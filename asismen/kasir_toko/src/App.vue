<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">MARKETPLACE</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div class="navbar-nav mx-auto">
            <RouterLink class="nav-link" to="/" aria-current="page">
              <i class="bi bi-house-door"></i> Home
            </RouterLink>
            <RouterLink class="nav-link ms-4" to="/post">
              <i class="bi bi-plus-circle"></i> Tambah Barang
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>
    <RouterView />
  </div>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router';

export default {
  name: 'App',
  components: {
    RouterLink,
    RouterView
  }
};
</script>

<style scoped>
.navbar {
  margin-bottom: 20px;
  border-bottom: 2px solid #fff; /* Add a bottom border for more definition */
}

.navbar-brand {
  font-weight: bold;
  font-size: 1.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  color: #fff;
  transition: color 0.3s;
}

.nav-link i {
  margin-right: 8px;
}

.nav-link:hover {
  color: #f0f0f0; /* Lighten the text color on hover */
}

.navbar-toggler {
  border-color: #fff; /* White border for the toggler icon */
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,..."); /* Ensure the background image is visible */
}
</style>
