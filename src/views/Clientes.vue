<template>
  <div>
    <h1>Clientes</h1>
    <button class="btn btn-primary" @click="openModal">Add Client</button>
    <div class="row">
      <div class="col-md-4" v-for="client in clients" :key="client.id">
        <Card :idNumber="client.id" :name="client.name" :city="client.city" @edit="editClient" @remove="removeClient" />
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="clientModal" tabindex="-1" aria-labelledby="clientModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="clientModalLabel">{{ isEditing ? 'Edit Client' : 'Add Client' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveClient">
              <div class="mb-3">
                <label for="clientName" class="form-label">Name</label>
                <input type="text" class="form-control" id="clientName" v-model="clientForm.name" required>
              </div>
              <div class="mb-3">
                <label for="clientCity" class="form-label">City</label>
                <input type="text" class="form-control" id="clientCity" v-model="clientForm.city" required>
              </div>
              <button type="submit" class="btn btn-primary">{{ isEditing ? 'Update' : 'Add' }}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Card from '../components/Card.vue';

export default {
  components: {
    Card
  },
  data() {
    return {
      clients: [],
      clientForm: {
        id: null,
        name: '',
        city: ''
      },
      isEditing: false
    };
  },
  methods: {
    fetchClients() {
      axios.get('testing')
        .then(response => {
          this.clients = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    openModal(client = null) {
      if (client) {
        this.clientForm = { ...client };
        this.isEditing = true;
      } else {
        this.clientForm = { id: null, name: '', city: '' };
        this.isEditing = false;
      }
      new bootstrap.Modal(document.getElementById('clientModal')).show();
    },
    saveClient() {
      if (this.isEditing) {
        axios.put(`testing/${this.clientForm.id}`, this.clientForm)
          .then(() => {
            this.fetchClients();
            bootstrap.Modal.getInstance(document.getElementById('clientModal')).hide();
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        axios.post('testing', this.clientForm)
          .then(() => {
            this.fetchClients();
            bootstrap.Modal.getInstance(document.getElementById('clientModal')).hide();
          })
          .catch(error => {
            console.error(error);
          });
      }
    },
    editClient(client) {
      this.openModal(client);
    },
    removeClient(client) {
      axios.delete(`testing/${client.id}`)
        .then(() => {
          this.fetchClients();
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