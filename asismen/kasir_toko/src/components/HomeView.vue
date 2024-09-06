<template>
  <div class="container mt-4">
    <div class="text-center mb-4">
      <h1 class="display-4">KALSTORE</h1>
    </div>
    <div class="mb-3">
      <div class="input-group">
        <span class="input-group-text"><i class="bi bi-search"></i></span>
        <input
          v-model="searchQuery"
          type="text"
          class="form-control form-control-sm"
          placeholder="Cari barang..."
        />
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title mb-3">Daftar Nama Barang</h5>
            <div class="table-responsive">
              <table class="table table-hover table-bordered">
                <thead class="table-primary">
                  <tr>
                    <th>NO</th>
                    <th><i class="bi bi-barcode"></i> ID</th>
                    <th><i class="bi bi-box"></i> Nama Barang</th>
                    <th><i class="bi bi-boxes"></i> Jumlah</th>
                    <th><i class="bi bi-cash-stack"></i> Harga</th>
                    <th><i class="bi bi-gear"></i> Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in paginatedItems"
                    :key="item.id_barang"
                  >
                    <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                    <td><i class="bi bi-barcode"></i> {{ item.id_barang }}</td>
                    <td>{{ item.nama_barang }}</td>
                    <td>{{ item.jumlah_barang }}</td>
                    <td>{{ currencyFormat(item.harga_barang) }}</td>
                    <td>
                      <button
                        class="btn btn-outline-secondary me-2 rounded-pill shadow-sm"
                        @click="editItem(item)"
                      >
                        <i class="bi bi-pencil"></i> Edit
                      </button>
                      <button
                        class="btn btn-outline-danger rounded-pill shadow-sm"
                        @click="deleteItem(item.id_barang)"
                      >
                        <i class="bi bi-trash"></i> Hapus
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="pagination mt-3">
              <button
                class="btn btn-primary"
                :disabled="currentPage === 1"
                @click="previousPage"
              >
                <i class="bi bi-chevron-left"></i> Prev
              </button>
              <span class="mx-3">Page {{ currentPage }} of {{ totalPages }}</span>
              <button
                class="btn btn-primary"
                :disabled="currentPage === totalPages"
                @click="nextPage"
              >
                Next <i class="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedItem" class="mt-4">
      <h3>Edit Barang</h3>
      <form @submit.prevent="updateItem">
        <div class="mb-3">
          <label for="edit_id_barang" class="form-label">ID Barang</label>
          <input v-model="selectedItem.id_barang" type="text" class="form-control" id="edit_id_barang" required readonly>
        </div>
        <div class="mb-3">
          <label for="edit_nama_barang" class="form-label">Nama Barang</label>
          <input v-model="selectedItem.nama_barang" type="text" class="form-control" id="edit_nama_barang" required>
        </div>
        <div class="mb-3">
          <label for="edit_jumlah_barang" class="form-label">Jumlah Barang</label>
          <input v-model="selectedItem.jumlah_barang" type="number" class="form-control" id="edit_jumlah_barang" required>
        </div>
        <div class="mb-3">
          <label for="edit_harga_barang" class="form-label">Harga Barang</label>
          <input v-model="selectedItem.harga_barang" type="number" class="form-control" id="edit_harga_barang" required>
        </div>
        <button type="submit" class="btn btn-primary">
          <i class="bi bi-save"></i> Simpan Perubahan
        </button>
      </form>
    </div>

    <div v-if="errorMessage" class="alert alert-danger mt-3">
      {{ errorMessage }}
    </div>
  </div>
</template>


<script>
import { ref, computed } from 'vue';
import axios from 'axios';

export default {
  name: 'HomeView',
  setup() {
    const searchQuery = ref('');
    const errorMessage = ref('');
    const selectedItem = ref(null);
    const items = ref([]);
    const itemsPerPage = 10; // Didefinisikan dengan benar
    const currentPage = ref(1);

    // Fetch barang from API
    const fetchBarang = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/barang');
        items.value = response.data;
      } catch (error) {
        console.error('Failed to fetch barang:', error);
      }
    };

    fetchBarang();

    const filteredItems = computed(() => {
      return items.value.filter(item =>
        item.nama_barang.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    const paginatedItems = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredItems.value.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredItems.value.length / itemsPerPage);
    });

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const deleteItem = async (id_barang) => {
      try {
        await axios.delete(`http://localhost:3001/api/barang/${id_barang}`);
        items.value = items.value.filter(item => item.id_barang !== id_barang);
      } catch (error) {
        errorMessage.value = error.response ? error.response.data.message : 'An error occurred';
      }
    };

    const editItem = (item) => {
      selectedItem.value = { ...item };
    };

    const updateItem = async () => {
      try {
        const response = await axios.put(`http://localhost:3001/api/barang/${selectedItem.value.id_barang}`, selectedItem.value);
        if (response.status === 200) {
          const index = items.value.findIndex(item => item.id_barang === selectedItem.value.id_barang);
          items.value[index] = { ...selectedItem.value };
          selectedItem.value = null;
        }
      } catch (error) {
        errorMessage.value = error.response ? error.response.data.message : 'An error occurred';
      }
    };

    const currencyFormat = (value) => {
      if (value === null || value === undefined || isNaN(value)) {
        return 'Rp 0';
      }
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(value);
    };

    return {
      searchQuery,
      items,
      filteredItems,
      paginatedItems,
      totalPages,
      currentPage,
      previousPage,
      nextPage,
      deleteItem,
      editItem,
      updateItem,
      selectedItem,
      errorMessage,
      currencyFormat,
      itemsPerPage, // Pastikan didefinisikan di sini
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 960px;
}

.text-center {
  text-align: center;
}

.display-4 {
  font-size: 3rem;
  font-weight: bold;
  color: #007bff;
}

.table {
  margin-top: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.table thead {
  background-color: #007bff;
  color: white;
}

.table th, .table td {
  vertical-align: middle;
  padding: 15px;
  border: 1px solid #dee2e6;
}

.table tbody tr {
  background-color: #f9f9f9;
}

.table tbody tr:nth-of-type(even) {
  background-color: #e9ecef;
}

.table tbody tr:hover {
  background-color: #d0e7ff;
}

.table td i {
  margin-right: 5px;
}

.input-group-text {
  background-color: #f1f1f1;
  border-color: #ced4da;
}

.input-group .form-control-sm {
  border-radius: 0.375rem;
}

.card {
  border-radius: 12px;
}

.card .card-body {
  padding: 1.5rem;
}

.card-title {
  font-weight: bold;
  color: #007bff;
}

.btn {
  font-size: 14px;
}

.btn i {
  margin-right: 5px;
}

.btn-outline-secondary {
  border-color: #6c757d;
  color: #6c757d;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  color: white;
}

.btn-outline-danger {
  border-color: #dc3545;
  color: #dc3545;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
}

.alert {
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination button {
  font-size: 14px;
}

.text-primary {
  color: #007bff;
}

.text-success {
  color: #28a745;
}

.text-warning {
  color: #ffc107;
}

.table-primary {
  background-color: #007bff;
  color: white;
}

.table-responsive {
  max-height: 400px; /* Adjust height as needed */
  overflow-y: auto;
}
</style>
