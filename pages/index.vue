<template>
  <v-data-table
    v-if="user"
    :headers="headers"
    :items="projects"
    hide-default-footer
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Projects</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              New Projects
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                  >
                    <v-text-field
                      v-model="editedItem.name"
                      label="Project name"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                  >
                    <v-text-field
                      v-model="editedItem.manager"
                      label="Project manager"
                    ></v-text-field>
                  </v-col>

                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this project?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
 

  export default {
    data: () => ({
      user: null,
      dialog: false,
      dialogDelete: false,
      headers: [
        { text: 'ID', value: 'id', sortable: false },
        { text: 'Name', value: 'name' },
        { text: 'Manager', value: 'manager' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      projects: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        manager: ''
      },
      defaultItem: {
        name: '',
        manager: ''
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Project' : 'Edit Project'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    mounted() {
      const user = localStorage.getItem('user')
      if(!user) {
        this.$router.push('/auth');
      }
      else {
        this.user = JSON.parse(user);
        this.initialize()
      }
    },

    methods: {
    
      initialize () {
        this.$axios.$get(`/projects?uid=${this.user.uid}`)
          .then(data => {
            this.projects = data;
          })
          .catch(e => {
            console.log(e)
          });
      },


      editItem (item) {
        this.editedIndex = this.projects.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.projects.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      async deleteItemConfirm () {
        const project = this.projects[this.editedIndex];
        try{
          await this.$axios.$delete(`/projects/${project.id}`);
          this.projects.splice(this.editedIndex, 1)
        }
        catch(e) {
          console.error(e)
        }
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      async save () {
        if (this.editedIndex > -1) {
          const project = this.projects[this.editedIndex];
          try {
            await this.$axios.$put(`/projects/${project.id}`, {
              name: this.editedItem.name,
              manager: this.editedItem.manager
            });
            Object.assign(this.projects[this.editedIndex], this.editedItem);
          }
          catch(e){
            console.error(e);
          }
        } else {
          try {
            const id = await this.$axios.$post(`/projects?uid=${this.user.uid}`, {
              name: this.editedItem.name,
              manager: this.editedItem.manager
            });
            this.projects.push({
              id: id,
              name: this.editedItem.name,
              manager: this.editedItem.manager
            });
          }      
          catch(e) {
            console.error(e);
          }
        }
        this.close()
      },
    },
  }
</script>
