<template>
  <div v-if="(this.projects.length > 0) && user">
    <v-card elevation="2" class="my-3 pr-4">
      <v-row>
        <v-col cols="8"></v-col>
        <v-col cols="4">
          <v-select
            class="mt-5"
            v-model="projectID"
            :items="projects"
            item-text="name"
            item-value="id"
            label="Select Project"
            dense
            outlined
        ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="8"></v-col>
          <v-col cols="4">
          <v-dialog
            ref="dialog"
            v-model="modal"
            :return-value.sync="startDate"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="startDate"
                label="Project start data"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                dense
                outlined
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="startDate"
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn
                text
                color="primary"
                @click="modal = false"
              >
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.dialog.save(startDate)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
      </v-row>
    </v-card>
    <v-data-table
        ref="myTable"
        v-model="selected"
        :headers="activeHeaders"
        :items="plans"
        item-key="name"
        hide-default-footer
        class="elevation-1"
    >
        <template v-slot:top>
            <v-toolbar
                flat
            >
                <v-toolbar-title>Plans</v-toolbar-title>
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
                    New Plan
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
                            v-model="editedItem.title"
                            label="Plan name"
                            ></v-text-field>
                        </v-col>
                        <v-col
                        cols="12"
                        >
                        <v-select
                            v-model="editedItem.resourceID"
                            :items="resources"
                            item-text="name"
                            item-value="id"
                            label="Select Resource"
                            dense
                            outlined
                        ></v-select>
                        </v-col>
                        <v-col
                            cols="12"
                        >
                            <v-text-field
                                type="number"
                                v-model="editedItem.eta"
                                label="Estimated Time (Days)"
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
                    <v-card-title class="text-h5">Are you sure you want to delete this plan?</v-card-title>
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
        <template #body="props">
            <draggable
                v-model="plans"
                tag="tbody"
                @end="recalculateDealdline"
            >
                <data-table-row-handler
                    v-for="(item, index) in props.items"
                    :key="index"
                    :item="item"
                    :headers="activeHeaders"
                >
                    <template #item.actions="{ item }">
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
                </data-table-row-handler>
            </draggable>
        </template>
    </v-data-table>
  </div>
</template>
  
<script>
import DataTableRowHandler from "@/components/DataTableRowHandler.vue";
import draggable from "vuedraggable";
import {find, forEach, map, sortBy} from "lodash"; 
import moment from 'moment-business-days';

export default {
  components: {
    draggable,
    DataTableRowHandler,
  },
  async mounted() {
    const user = localStorage.getItem('user')
    if(!user) {
      this.$router.push('/auth');
    }
    else {
      this.user = JSON.parse(user);
      this.projects = await this.$axios.$get(`/projects?uid=${this.user.uid}`)
      if(this.projects.length > 0){
          this.projectID = this.projects[0].id;
      }
      this.resources = await this.$axios.$get(`/resources?uid=${this.user.uid}`)
      if(this.resources.length > 0){
          this.editedItem.resourceID = this.resources[0].id;
      }
      await this.initialize()
    }
  },
  data() {
    return {
      user : null,
      startDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      modal: false,
      projects: [],
      resources: [],
      allowDrag: true,
      projectID: '',
      selected: [],
      headers: [
        { text: "Title", value: "title", sortable: false  },
        { text: "Resource", value: "resourceName", sortable: false },
        { text: "Estimated Time (day)", value: "eta", sortable: false  },
        { text: "Deadline", value: "deadline", sortable: false  },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      plans: [],
      dialog: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: {
        title: '',
        eta: 0,
        resourceID: '',
        deadline: ''
      },
      defaultItem: {
        title: '',
        eta: 0,
        resourceID: '',
        deadline: ''
      },
    };
  },
    watch: {
        dialog (val) {
            val || this.close()
        },
        dialogDelete (val) {
            val || this.closeDelete()
        },
        async projectID(val){
          await this.initialize();
        },
        async plans(val){
          if(this.projects.length == 0)return;
          const planids = map(this.plans, p => p.id);
          await this.$axios.$put(`/projects/${this.projectID}`, {
            planids
          });
        },
        startDate(){
          this.recalculateDealdline()
        }
    },
  computed: {
    activeHeaders() {
      return this.headers.filter((h) => {
        if (!this.allowDrag && h.value === "lock") {
          return false;
        }
        return true;
      });
    },
    formTitle () {
        return this.editedIndex === -1 ? 'New Plan' : 'Edit Plan'
    },
  },
  methods: {
    recalculateDealdline() {
      const startDate = this.startDate;
      const newPlans = [...this.plans]
      forEach(this.resources, res => {
        const resID = res.id;
        let totalDays = 0;
        forEach(newPlans, p => {
          if(p.resourceID == resID){
            console.log(startDate)
            totalDays += parseInt(p.eta);
            const newDate = moment(startDate, "YYYY-MM-DD").add(totalDays, 'days');
            p.deadline = moment(newDate).format('DD/MM/YYYY');
          }
        })
      })
      this.plans = newPlans;
    },
    async initialize () {
        try {
            const project = await this.$axios.$get(`/projects/${this.projectID}`)
            const { planids } = project;
            const plans = await this.$axios.$get(`/plans?projectID=${this.projectID}`)
            forEach(plans, (p) => {
              p.resourceName = find(this.resources, r => r.id == p.resourceID)?.name;
              p.eta = "" + p.eta;
            })
            this.plans = sortBy(plans, (item) => planids.indexOf(item.id));
            this.recalculateDealdline();
        }
        catch(e){
            console.error(e)
        }
    },

    editItem (item) {
      this.editedIndex = this.plans.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.plans.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm () {
      const plan = this.plans[this.editedIndex];
      try{
        await this.$axios.$delete(`/plans/${plan.id}`);
        this.plans.splice(this.editedIndex, 1)
      }
      catch(e) {
        console.error(e)
      }
      this.closeDelete()
      this.recalculateDealdline();
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
      const resourceName = find(this.resources, r => r.id == this.editedItem.resourceID)?.name;
      if (this.editedIndex > -1) {
        try {
          const plan = this.plans[this.editedIndex];
          await this.$axios.$put(`/plans/${plan.id}`, {
            title: this.editedItem.title,
            resourceID: this.editedItem.resourceID,
            eta: this.editedItem.eta,
          });
          this.editedItem.resourceName = resourceName;
          Object.assign(this.plans[this.editedIndex], this.editedItem);
        }
        catch(e){
          console.error(e);
        }
      } else {
        try {
          const id = await this.$axios.$post('/plans', {
            title: this.editedItem.title,
            resourceID: this.editedItem.resourceID,
            eta: this.editedItem.eta,
            projectID: this.projectID
          });
          this.plans.push({
            id: id,
            title: this.editedItem.title,
            resourceID: this.editedItem.resourceID,
            eta: this.editedItem.eta,
            projectID: this.projectID,
            resourceName
          });
        }      
        catch(e) {
          console.error(e);
        }
      }
      this.recalculateDealdline();
      this.close()
    },
  },
};
</script>