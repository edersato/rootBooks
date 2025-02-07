<template>
  <div>
    <div class="d-flex justify-content-between px-3">
      <h1>Clientes</h1>
      <button class="btn btn-success" @click="openAddModal">Novo Cliente</button>
    </div>
    <div class="row">
      <div class="col-md-4" v-for="client in clients" :key="client.idCliente">
        <Card :idNumber="client.idCliente" :name="client.nmCliente" :city="client.cidade" @edit="openEditModal(client)" @remove="removeClient(client)" />
      </div>
    </div>

    <!-- Add Client Modal -->
    <div class="modal fade" id="addClientModal" tabindex="-1" aria-labelledby="addClientModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addClientModalLabel">Novo Cliente</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveNewClient">
              <div class="mb-3">
                <label for="newClientName" class="form-label">Nome</label>
                <input type="text" class="form-control" id="newClientName" v-model="newClientForm.nmCliente" required>
              </div>
              <div class="mb-3">
                <label for="newClientCity" class="form-label">Cidade</label>
                <input type="text" class="form-control" id="newClientCity" v-model="newClientForm.cidade" required>
              </div>
              <button type="submit" class="btn btn-success">Adicionar</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Client Modal -->
    <div class="modal fade" id="editClientModal" tabindex="-1" aria-labelledby="editClientModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editClientModalLabel">Atualizar Cliente</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveEditedClient">
              <div class="mb-3">
                <label for="editClientName" class="form-label">Nome</label>
                <input type="text" class="form-control" id="editClientName" v-model="editClientForm.nmCliente" required>
              </div>
              <div class="mb-3">
                <label for="editClientCity" class="form-label">Cidade</label>
                <input type="text" class="form-control" id="editClientCity" v-model="editClientForm.cidade" required>
              </div>
              <button type="submit" class="btn btn-primary">Atualizar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api'
import Card from '../components/Card.vue';

export default {
  components: {
    Card
  },
  data() {
    return {
      clients: [],
      newClientForm: {
        nmCliente: '',
        cidade: ''
      },
      editClientForm: {
        idCliente: null,
        nmCliente: '',
        cidade: ''
      }
    };
  },
  methods: {
    fetchClients() {
      api.get('api/Clientes')
        .then(response => {
          console.log('API response:', response.data);
          this.clients = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    openAddModal() {
      this.newClientForm = { nmCliente: '', cidade: '' };
      new bootstrap.Modal(document.getElementById('addClientModal')).show();
    },
    openEditModal(client) {
      this.editClientForm = { ...client };
      new bootstrap.Modal(document.getElementById('editClientModal')).show();
    },
    saveNewClient() {
      api.post('api/Clientes', this.newClientForm)
        .then(response => {
          this.clients.push(response.data);
          bootstrap.Modal.getInstance(document.getElementById('addClientModal')).hide();
        })
        .catch(error => {
          console.error(error);
        });
    },
    saveEditedClient() {
      api.put(`api/Clientes/${this.editClientForm.idCliente}`, this.editClientForm)
        .then(response => {
          const index = this.clients.findIndex(client => client.idCliente === this.editClientForm.idCliente);
          if (index !== -1) {
            this.clients.splice(index, 1, response.data);
          }
          bootstrap.Modal.getInstance(document.getElementById('editClientModal')).hide();
        })
        .catch(error => {
          console.error(error);
        });
    },
    removeClient(client) {
      api.delete(`api/Clientes/${client.idCliente}`)
        .then(() => {
          const index = this.clients.findIndex(c => c.idCliente === client.idCliente);
          if (index !== -1) {
            this.clients.splice(index, 1);
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  },
  mounted() {
    this.fetchClients();
  }
};
</script>

<style>
</style>