<template>
  <div class="container mt-4">
    <div class="text-center mb-4">
      <h1 class="display-4">KALSTORE</h1>
    </div>

    <!-- Form Edit Barang -->
    <transition name="fade">
      <div v-if="selectedItem" class="edit-form mt-4">
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
          <button type="submit" class="btn btn-primary me-2">
            <i class="bi bi-save"></i> Simpan Perubahan
          </button>
          <button type="button" class="btn btn-secondary" @click="cancelEdit">
            <i class="bi bi-x-circle"></i> Batal
          </button>
        </form>
      </div>
    </transition>

    <!-- Input Pencarian -->
    <div class="mb-3 mt-4">
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

    <!-- Tabel Barang -->
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
                    <td>{{ item.id_barang }}</td>
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
                        @click="confirmDelete(item.id_barang)"
                      >
                        <i class="bi bi-trash"></i> Hapus
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- Pagination -->
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

    <!-- Pesan Error -->
    <div v-if="errorMessage" class="alert alert-danger mt-3">
      {{ errorMessage }}
    </div>

    <!-- Toast Konfirmasi -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" v-if="showToast">
        <div class="toast-header">
          <strong class="me-auto">Notifikasi</strong>
          <button type="button" class="btn-close" aria-label="Close" @click="showToast = false"></button>
        </div>
        <div class="toast-body">
          {{ toastMessage }}
        </div>
      </div>
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
    const itemsPerPage = 10;
    const currentPage = ref(1);
    const showToast = ref(false);
    const toastMessage = ref('');

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

    const confirmDelete = (id_barang) => {
      if (confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
        deleteItem(id_barang);
      }
    };

    const deleteItem = async (id_barang) => {
      try {
        await axios.delete(`http://localhost:3001/api/barang/${id_barang}`);
        items.value = items.value.filter(item => item.id_barang !== id_barang);
        toastMessage.value = "Barang berhasil dihapus!";
        showToast.value = true;
      } catch (error) {
        errorMessage.value = error.response ? error.response.data.message : 'An error occurred';
      }
    };

    const editItem = (item) => {
      selectedItem.value = { ...item };
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
      selectedItem.value = null;
    };

    const updateItem = async () => {
      if (confirm('Apakah Anda yakin ingin menyimpan perubahan?')) {
        try {
          const response = await axios.put(`http://localhost:3001/api/barang/${selectedItem.value.id_barang}`, selectedItem.value);
          if (response.status === 200) {
            const index = items.value.findIndex(item => item.id_barang === selectedItem.value.id_barang);
            if (index !== -1) {
              items.value.splice(index, 1, selectedItem.value);
            }
            selectedItem.value = null;
            toastMessage.value = "Barang berhasil diperbarui!";
            showToast.value = true;
          }
        } catch (error) {
          errorMessage.value = error.response ? error.response.data.message : 'An error occurred';
        }
      }
    };

    const currencyFormat = (number) => {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
    };

    return {
      searchQuery,
      errorMessage,
      selectedItem,
      items,
      itemsPerPage,
      currentPage,
      showToast,
      toastMessage,
      fetchBarang,
      filteredItems,
      paginatedItems,
      totalPages,
      previousPage,
      nextPage,
      confirmDelete,
      deleteItem,
      editItem,
      cancelEdit,
      updateItem,
      currencyFormat,
    };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

body {
  font-family: 'Roboto', sans-serif;
}

.table-hover tbody tr:hover {
  background-color: #f0f0f0;
}

.table-bordered th, .table-bordered td {
  border: 1px solid #dee2e6;
}

.table-primary th {
  background-color: #007bff;
  color: #fff;
}

.pagination button {
  margin: 0 5px;
}

.form-control {
  margin-bottom: 10px;
}

.card {
  border-radius: 12px;
}

.card .card-body {
  padding: 1.5rem;
}

.card-title {
  font-weight: 700;
  color: #007bff;
}

.btn {
  font-size: 14px;
  font-family: 'Roboto', sans-serif;
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
  color: #fff;
}

.btn-outline-danger {
  border-color: #dc3545;
  color: #dc3545;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: #fff;
}

.form-label {
  font-weight: 700;
  color: #333;
}

input[type="number"] {
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.edit-form {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.toast {
  min-width: 300px;
  font-size: 14px;
}
</style>
