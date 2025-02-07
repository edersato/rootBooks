<template>
  <div>
    <div class="d-flex justify-content-between px-3">
      <h1>Produtos</h1>
      <button class="btn btn-success mb-3" @click="openAddModal">Adicionar Produto</button>
    </div>
    <div class="mb-3">
      <input type="text" class="form-control" placeholder="Pesquisar pela Descrição do Produto" v-model="searchQuery" @input="fetchProdutos">
    </div>
    <div class="row">
      <div class="col-md-4 mb-3" v-for="produto in filteredProdutos" :key="produto.idProduto">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">{{ produto.dscProduto }}</h5>
            <p class="card-text">ID: {{ produto.idProduto }}</p>
            <p class="card-text">Valor Unitário: {{ produto.vlrUnitario }}</p>
            <div class="d-flex justify-content-between pl-3">
              <button class="btn btn-primary" @click="openEditModal(produto)">Editar</button>
              <button class="btn btn-danger" @click="confirmDelete(produto)">Excluir</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Product Modal -->
    <div class="modal fade" id="addProdutoModal" tabindex="-1" aria-labelledby="addProdutoModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addProdutoModalLabel">Adicionar Produto</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveProduto">
              <div class="mb-3">
                <label for="dscProduto" class="form-label">Descrição</label>
                <input type="text" class="form-control" id="dscProduto" v-model="produtoForm.dscProduto" required>
              </div>
              <div class="mb-3">
                <label for="vlrUnitario" class="form-label">Valor Unitário</label>
                <input type="number" step="0.01" class="form-control" id="vlrUnitario" v-model="produtoForm.vlrUnitario" required>
              </div>
              <button type="submit" class="btn btn-primary">Adicionar</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Product Modal -->
    <div class="modal fade" id="editProdutoModal" tabindex="-1" aria-labelledby="editProdutoModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editProdutoModalLabel">Editar Produto</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateProduto">
              <div class="mb-3">
                <label for="dscProduto" class="form-label">Descrição</label>
                <input type="text" class="form-control" id="dscProduto" v-model="produtoForm.dscProduto" required>
              </div>
              <div class="mb-3">
                <label for="vlrUnitario" class="form-label">Valor Unitário</label>
                <input type="number" step="0.01" class="form-control" id="vlrUnitario" v-model="produtoForm.vlrUnitario" required>
              </div>
              <button type="submit" class="btn btn-primary">Atualizar</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteModalLabel">Confirmar Exclusão</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Tem certeza que deseja excluir o produto "{{ produtoToDelete ? produtoToDelete.dscProduto : '' }}"?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-danger" @click="deleteProduto">Excluir</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  data() {
    return {
      produtos: [],
      searchQuery: '',
      produtoForm: {
        idProduto: null,
        dscProduto: '',
        vlrUnitario: 0
      },
      isEditing: false,
      produtoToDelete: null
    };
  },
  computed: {
    filteredProdutos() {
      return this.produtos.filter(produto =>
        produto.dscProduto.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    fetchProdutos() {
      api.get('api/Produtos', { params: { search: this.searchQuery } })
        .then(response => {
          console.log(response.data);
          this.produtos = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    openAddModal() {
      this.produtoForm = { idProduto: null, dscProduto: '', vlrUnitario: 0 };
      new bootstrap.Modal(document.getElementById('addProdutoModal')).show();
    },
    openEditModal(produto) {
      this.produtoForm = { ...produto };
      this.isEditing = true;
      new bootstrap.Modal(document.getElementById('editProdutoModal')).show();
    },
    saveProduto() {
      const newProduto = { ...this.produtoForm, idProduto: Date.now() };
      this.produtos.push(newProduto);
      bootstrap.Modal.getInstance(document.getElementById('addProdutoModal')).hide();
    },
    updateProduto() {
      const index = this.produtos.findIndex(produto => produto.idProduto === this.produtoForm.idProduto);
      if (index !== -1) {
        this.produtos.splice(index, 1, this.produtoForm);
      }
      bootstrap.Modal.getInstance(document.getElementById('editProdutoModal')).hide();
    },
    confirmDelete(produto) {
      this.produtoToDelete = produto;
      new bootstrap.Modal(document.getElementById('deleteModal')).show();
    },
    deleteProduto() {
      const index = this.produtos.findIndex(produto => produto.idProduto === this.produtoToDelete.idProduto);
      if (index !== -1) {
        this.produtos.splice(index, 1);
      }
      bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
    }
  },
  mounted() {
    this.fetchProdutos();
  }
};
</script>

<style>
</style>