<template>
  <div class="container text-center">
    <img
      class="img-fluid mb-4"
      src="../assets/rootbooks.png"
      alt="Placeholder Image"
    />
    <button class="btn btn-dark" @click="goToProducts">Veja os produtos</button>
  </div>
</template>

<script>
export default {
  methods: {
    goToProducts() {
      this.$router.push("/produtos");
    },
  },
};
</script>

<style>
.container {
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.img-fluid {
  width: 200px;
  height: 200px;
}

.btn-dark {
  background-color: #014b01; /* Dark green button */
  transition: 1s ease-in;
  border: none;
}

.btn-dark:hover {
    background-color: #000000; /* Darker green on hover */
    transition: 1s ease-out;
}
</style>