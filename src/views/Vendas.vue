<template>
  <div>
    <h1>Vendas</h1>
    <div class="mb-3">
      <input type="text" class="form-control" placeholder="Pesquisar pelo Nome do Cliente ou Descrição do Produto" v-model="searchQuery" @input="fetchVendas">
    </div>
    <button class="btn btn-primary mb-3" @click="openModal">Adicionar Venda</button>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Produto</th>
          <th>Quantidade</th>
          <th>Valor Unitário</th>
          <th>Data/Hora</th>
          <th>Valor Total</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="venda in filteredVendas" :key="venda.idVenda">
          <td>{{ venda.id }}</td>
          <td>{{ venda.cliente.id }}</td>
          <td>{{ venda.produto.id }}</td>
          <td>{{ venda.qtdVenda }}</td>
          <td>{{ venda.vlrUnitarioVenda }}</td>
          <td>{{ new Date(venda.dthVenda).toLocaleString() }}</td>
          <td>{{ venda.vlrTotalVenda }}</td>
          <td>
            <button class="btn btn-info btn-sm" @click="openModal(venda)">Editar</button>
            <button class="btn btn-danger btn-sm" @click="confirmDelete(venda)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div class="modal fade" id="vendaModal" tabindex="-1" aria-labelledby="vendaModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="vendaModalLabel">{{ isEditing ? 'Editar Venda' : 'Adicionar Venda' }}</h5>
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
      isEditing: false,
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
      api.get('/vendas', { params: { search: this.searchQuery } })
        .then(response => {
          console.log(response.data);
          this.vendas = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    openModal(venda = null) {
      if (venda) {
        this.vendaForm = { ...venda };
        this.isEditing = true;
      } else {
        this.vendaForm = { idVenda: null, idCliente: '', idProduto: '', qtdVenda: 0, vlrUnitarioVenda: 0, dthVenda: '', vlrTotalVenda: 0 };
        this.isEditing = false;
      }
      new bootstrap.Modal(document.getElementById('vendaModal')).show();
    },
    saveVenda() {
      if (this.isEditing) {
        api.put(`/vendas/${this.vendaForm.idVenda}`, this.vendaForm)
          .then(() => {
            this.fetchVendas();
            bootstrap.Modal.getInstance(document.getElementById('vendaModal')).hide();
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        api.post('/vendas', this.vendaForm)
          .then(() => {
            this.fetchVendas();
            bootstrap.Modal.getInstance(document.getElementById('vendaModal')).hide();
          })
          .catch(error => {
            console.error(error);
          });
      }
    },
    confirmDelete(venda) {
      this.vendaToDelete = venda;
      new bootstrap.Modal(document.getElementById('deleteModal')).show();
    },
    deleteVenda() {
      api.delete(`/vendas/${this.vendaToDelete.idVenda}`)
        .then(() => {
          this.fetchVendas();
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