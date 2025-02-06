<template>
  <div class="card" style="width: 18rem;">
    <div class="card-body">
      <h5 class="card-title">{{ name }}</h5>
      <p class="card-text"><strong>Id:</strong> {{ idNumber }}</p>
      <p class="card-text"><strong>Nome:</strong> {{ name }}</p>
      <p class="card-text"><strong>Cidade:</strong> {{ city }}</p>

      <div>
        <button class="btn btn-info" @click="$emit('edit', { id: idNumber, name, city })">Editar</button>
        <button class="btn btn-danger" @click="$emit('remove', { id: idNumber })">Remover</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    idNumber: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.card {
  margin: 20px;
}
</style>