<template>
  <div>
    <h1>Vendas</h1>
    <div class="mb-3">
      <input type="text" class="form-control" placeholder="Pesquisar pelo Nome do Cliente ou Descrição do Produto" v-model="searchQuery" @input="fetchVendas">
    </div>
    <button class="btn btn-primary mb-3" @click="openAddModal">Adicionar Venda</button>
    <div class="row">
      <div class="col-md-4 mb-3" v-for="venda in filteredVendas" :key="venda.idVenda">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Venda ID: {{ venda.idVenda }}</h5>
            <p class="card-text">Cliente: {{ venda.idCliente }}</p>
            <p class="card-text">Produto: {{ venda.idProduto }}</p>
            <p class="card-text">Quantidade: {{ venda.qtdVenda }}</p>
            <p class="card-text">Valor Unitário: {{ venda.vlrUnitarioVenda }}</p>
            <p class="card-text">Data/Hora: {{ new Date(venda.dthVenda).toLocaleString() }}</p>
            <p class="card-text">Valor Total: {{ venda.vlrTotalVenda }}</p>
            <button class="btn btn-info btn-sm" @click="openEditModal(venda)">Editar</button>
            <button class="btn btn-danger btn-sm" @click="confirmDelete(venda)">Excluir</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Venda Modal -->
    <div class="modal fade" id="addVendaModal" tabindex="-1" aria-labelledby="addVendaModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addVendaModalLabel">Adicionar Venda</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveVenda">
              <div class="mb-3">
                <label for="idCliente" class="form-label">Cliente</label>
                <input type="number" class="form-control" id="idCliente" v-model="vendaForm.idCliente" required>
              </div>
              <div class="mb-3">
                <label for="idProduto" class="form-label">Produto</label>
                <input type="number" class="form-control" id="idProduto" v-model="vendaForm.idProduto" required>
              </div>
              <div class="mb-3">
                <label for="qtdVenda" class="form-label">Quantidade</label>
                <input type="number" class="form-control" id="qtdVenda" v-model="vendaForm.qtdVenda" required>
              </div>
              <div class="mb-3">
                <label for="vlrUnitarioVenda" class="form-label">Valor Unitário</label>
                <input type="number" step="0.01" class="form-control" id="vlrUnitarioVenda" v-model="vendaForm.vlrUnitarioVenda" required>
              </div>
              <div class="mb-3">
                <label for="dthVenda" class="form-label">Data/Hora</label>
                <input type="datetime-local" class="form-control" id="dthVenda" v-model="vendaForm.dthVenda" required>
              </div>
              <div class="mb-3">
                <label for="vlrTotalVenda" class="form-label">Valor Total</label>
                <input type="number" step="0.01" class="form-control" id="vlrTotalVenda" v-model="vendaForm.vlrTotalVenda" required>
              </div>
              <button type="submit" class="btn btn-primary">Adicionar</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Venda Modal -->
    <div class="modal fade" id="editVendaModal" tabindex="-1" aria-labelledby="editVendaModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editVendaModalLabel">Editar Venda</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateVenda">
              <div class="mb-3">
                <label for="editIdCliente" class="form-label">Cliente</label>
                <input type="number" class="form-control" id="editIdCliente" v-model="vendaForm.idCliente" required>
              </div>
              <div class="mb-3">
                <label for="editIdProduto" class="form-label">Produto</label>
                <input type="number" class="form-control" id="editIdProduto" v-model="vendaForm.idProduto" required>
              </div>
              <div class="mb-3">
                <label for="editQtdVenda" class="form-label">Quantidade</label>
                <input type="number" class="form-control" id="editQtdVenda" v-model="vendaForm.qtdVenda" required>
              </div>
              <div class="mb-3">
                <label for="editVlrUnitarioVenda" class="form-label">Valor Unitário</label>
                <input type="number" step="0.01" class="form-control" id="editVlrUnitarioVenda" v-model="vendaForm.vlrUnitarioVenda" required>
              </div>
              <div class="mb-3">
                <label for="editDthVenda" class="form-label">Data/Hora</label>
                <input type="datetime-local" class="form-control" id="editDthVenda" v-model="vendaForm.dthVenda" required>
              </div>
              <div class="mb-3">
                <label for="editVlrTotalVenda" class="form-label">Valor Total</label>
                <input type="number" step="0.01" class="form-control" id="editVlrTotalVenda" v-model="vendaForm.vlrTotalVenda" required>
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
            Tem certeza que deseja excluir a venda do cliente "{{ vendaToDelete?.clienteNome }}" do produto "{{ vendaToDelete?.produtoDescricao }}"?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-danger" @click="deleteVenda">Excluir</button>
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
      vendas: [],
      searchQuery: '',
      vendaForm: {
        idVenda: null,
        idCliente: '',
        idProduto: '',
        qtdVenda: 0,
        vlrUnitarioVenda: 0,
        dthVenda: '',
        vlrTotalVenda: 0
      },
      vendaToDelete: null
    };
  },
  computed: {
    filteredVendas() {
      return this.vendas.filter(venda =>
        venda.clienteNome.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        venda.produtoDescricao.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    fetchVendas() {
      api.get('/api/Vendas/', { params: { search: this.searchQuery } })
        .then(response => {
          console.log(response.data);
          this.vendas = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    openAddModal() {
      this.vendaForm = { idVenda: null, idCliente: '', idProduto: '', qtdVenda: 0, vlrUnitarioVenda: 0, dthVenda: '', vlrTotalVenda: 0 };
      new bootstrap.Modal(document.getElementById('addVendaModal')).show();
    },
    openEditModal(venda) {
      this.vendaForm = { ...venda };
      new bootstrap.Modal(document.getElementById('editVendaModal')).show();
    },
    saveVenda() {
      api.post('/api/Vendas/', this.vendaForm)
        .then(response => {
          this.vendas.push(response.data);
          bootstrap.Modal.getInstance(document.getElementById('addVendaModal')).hide();
        })
        .catch(error => {
          console.error(error);
        });
    },
    updateVenda() {
      api.put(`/api/Vendas/${this.vendaForm.idVenda}`, this.vendaForm)
        .then(() => {
          const index = this.vendas.findIndex(venda => venda.idVenda === this.vendaForm.idVenda);
          if (index !== -1) {
            this.vendas.splice(index, 1, this.vendaForm);
          }
          bootstrap.Modal.getInstance(document.getElementById('editVendaModal')).hide();
        })
        .catch(error => {
          console.error(error);
        });
    },
    confirmDelete(venda) {
      this.vendaToDelete = venda;
      new bootstrap.Modal(document.getElementById('deleteModal')).show();
    },
    deleteVenda() {
      api.delete(`/api/Vendas/${this.vendaToDelete.idVenda}`)
        .then(() => {
          const index = this.vendas.findIndex(venda => venda.idVenda === this.vendaToDelete.idVenda);
          if (index !== -1) {
            this.vendas.splice(index, 1);
          }
          bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
        })
        .catch(error => {
          console.error(error);
        });
    }
  },
  mounted() {
    this.fetchVendas();
  }
};
</script>

<style>
</style>