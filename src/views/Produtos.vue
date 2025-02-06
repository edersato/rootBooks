<template>
  <div>
    <h1>Produtos</h1>
    <div class="mb-3">
      <input type="text" class="form-control" placeholder="Pesquisar pela Descrição do Produto" v-model="searchQuery" @input="fetchProdutos">
    </div>
    <button class="btn btn-primary mb-3" @click="openModal">Adicionar Produto</button>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Descrição</th>
          <th>Valor Unitário</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="produto in filteredProdutos" :key="produto.idProduto">
          <td>{{ produto.idProduto }}</td>
          <td>{{ produto.dscProduto }}</td>
          <td>{{ produto.vlrUnitario.toFixed(2) }}</td>
          <td>
            <button class="btn btn-info btn-sm" @click="openModal(produto)">Editar</button>
            <button class="btn btn-danger btn-sm" @click="confirmDelete(produto)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>

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
import axios from 'axios';

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
      axios.get('/api/produtos', { params: { search: this.searchQuery } })
        .then(response => {
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
        axios.put(`/api/produtos/${this.produtoForm.idProduto}`, this.produtoForm)
          .then(() => {
            this.fetchProdutos();
            bootstrap.Modal.getInstance(document.getElementById('produtoModal')).hide();
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        axios.post('/api/produtos', this.produtoForm)
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
      axios.delete(`/api/produtos/${this.produtoToDelete.idProduto}`)
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