<template>
  <div class="container mt-4">
    <h2 class="mb-4">Tambah Barang</h2>
    <form @submit.prevent="addItem">
      <div class="mb-3">
        <label for="id_barang" class="form-label">ID Barang</label>
        <div class="input-group">
          <span class="input-group-text"><i class="bi bi-barcode"></i></span>
          <input v-model="id_barang" type="text" class="form-control" id="id_barang" required>
        </div>
      </div>
      <div class="mb-3">
        <label for="nama_barang" class="form-label">Nama Barang</label>
        <div class="input-group">
          <span class="input-group-text"><i class="bi bi-box"></i></span>
          <input v-model="nama_barang" type="text" class="form-control" id="nama_barang" required>
        </div>
      </div>
      <div class="mb-3">
        <label for="jumlah_barang" class="form-label">Jumlah Barang</label>
        <div class="input-group">
          <span class="input-group-text"><i class="bi bi-cash"></i></span>
          <input v-model="jumlah_barang" type="number" class="form-control" id="jumlah_barang" min="1" required>
        </div>
      </div>
      <div class="mb-3">
        <label for="harga_barang" class="form-label">Harga Barang</label>
        <div class="input-group">
          <span class="input-group-text"><i class="bi bi-cash-stack"></i></span>
          <input v-model="harga_barang" type="number" class="form-control" id="harga_barang" min="1" required>
        </div>
      </div>
      <button type="submit" class="btn btn-primary btn-lg">
        <i class="bi bi-plus-circle"></i> Tambah
      </button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

export default {
  name: 'TambahBarang',
  setup() {
    const id_barang = ref('');
    const nama_barang = ref('');
    const jumlah_barang = ref(0);
    const harga_barang = ref(0);
    const router = useRouter();

    const validateInput = () => {
      if (jumlah_barang.value <= 0) {
        Swal.fire('Error', 'Jumlah barang harus lebih dari 0', 'error');
        return false;
      }
      if (harga_barang.value <= 0) {
        Swal.fire('Error', 'Harga barang harus lebih dari 0', 'error');
        return false;
      }
      return true;
    };

    const isDuplicate = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/barang/${id_barang.value}`);
        return response.status === 200; // ID already exists
      } catch (error) {
        if (error.response.status === 404) {
          return false; // ID does not exist
        }
        Swal.fire('Error', 'An error occurred while checking for duplicates', 'error');
        return true;
      }
    };

    const addItem = async () => {
      if (!validateInput()) return;

      if (await isDuplicate()) {
        Swal.fire('Error', 'ID Barang sudah ada', 'error');
        return;
      }

      try {
        const response = await axios.post('http://localhost:3001/api/barang', {
          id_barang: id_barang.value,
          nama_barang: nama_barang.value,
          jumlah_barang: jumlah_barang.value,
          harga_barang: harga_barang.value,
        });

        if (response.status === 201) {
          Swal.fire('Sukses', 'Barang berhasil ditambahkan!', 'success').then(() => {
            router.push('/');
          });
        }
      } catch (error) {
        Swal.fire('Error', error.response ? error.response.data.message : 'An error occurred', 'error');
      }
    };

    return {
      id_barang,
      nama_barang,
      jumlah_barang,
      harga_barang,
      addItem,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin-top: 20px;
}

h2 {
  color: #007bff;
}

.form-control, .input-group-text {
  border-radius: 0.375rem;
}

.input-group-text {
  background-color: #f8f9fa;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
}
</style>
