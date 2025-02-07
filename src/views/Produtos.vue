<template>
  <div>
    <div class="d-flex justify-content-between px-3">
      <h1>Produtos</h1>
      <button class="btn btn-success mb-3" @click="openModal">Adicionar Produto</button>
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
              <button class="btn btn-primary" @click="openModal(produto)">Editar</button>
              <button class="btn btn-danger" @click="confirmDelete(produto)">Excluir</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="produtoModal" tabindex="-1" aria-labelledby="produtoModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="produtoModalLabel">{{ isEditing ? 'Editar Produto' : 'Adicionar Produto' }}</h5>
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
              <button type="submit" class="btn btn-primary">{{ isEditing ? 'Atualizar' : 'Adicionar' }}</button>
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
      api.get('/produtos', { params: { search: this.searchQuery } })
        .then(response => {
          console.log(response.data);
          
          this.produtos = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    openModal(produto = null) {
      if (produto) {
        this.produtoForm = { ...produto };
        this.isEditing = true;
      } else {
        this.produtoForm = { idProduto: null, dscProduto: '', vlrUnitario: 0 };
        this.isEditing = false;
      }
      new bootstrap.Modal(document.getElementById('produtoModal')).show();
    },
    saveProduto() {
      if (this.isEditing) {
        api.put(`/produtos/${this.produtoForm.idProduto}`, this.produtoForm)
          .then(() => {
            this.fetchProdutos();
            bootstrap.Modal.getInstance(document.getElementById('produtoModal')).hide();
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        api.post('/produtos', this.produtoForm)
          .then(() => {
            this.fetchProdutos();
            bootstrap.Modal.getInstance(document.getElementById('produtoModal')).hide();
          })
          .catch(error => {
            console.error(error);
          });
      }
    },
    confirmDelete(produto) {
      this.produtoToDelete = produto;
      new bootstrap.Modal(document.getElementById('deleteModal')).show();
    },
    deleteProduto() {
      api.delete(`/produtos/${this.produtoToDelete.idProduto}`)
        .then(() => {
          this.fetchProdutos();
          bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
        })
        .catch(error => {
          console.error(error);
        });
    }
  },
  mounted() {
    this.fetchProdutos();
  }
};
</script>

<style>
</style>