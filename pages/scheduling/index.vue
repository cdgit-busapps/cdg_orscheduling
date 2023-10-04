<template>
  <div>
    <v-container>
      <v-row>
        <v-col lg="8">
          <v-row>
            <v-col lg="6">
              <v-card>
                <v-card-text>
                  <div>Newly Schedule</div>
                  <div class="text--primary">
                    <p>08:00 - 09:00 - Pt. 001 - Procedure</p>
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-btn text color="deep-purple accent-4">More...</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>

            <v-col lg="6">
              <v-card>
                <v-card-text>
                  <div>On-going Schedule</div>
                  <div class="text--primary">
                    <p>08:00 - 09:00 - Pt. 003 - Procedure</p>
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-btn text color="deep-purple accent-4">More...</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>

            <v-col lg="12">
              <v-card>
                <v-toolbar dark color="primary">
                  <v-toolbar-title>List of Schedules</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-toolbar-items>
                    <v-btn dark text @click="addnewschedule"> Add New </v-btn>
                  </v-toolbar-items>
                </v-toolbar>

                <v-card-text>
                  <div>New Schedule</div>
                  <p class="text-h4 text--primary">be•nev•o•lent</p>
                  <p>adjective</p>
                  <div class="text--primary">
                    well meaning and kindly.<br />
                    "a benevolent smile"
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-btn text color="deep-purple accent-4">More...</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col lg="4">
          <v-card>
            <v-card-text>
              <div>Statistics</div>
              <p class="text-h4 text--primary">Ab•cde•f•ghi</p>
              <p>adjective</p>
              <div class="text--primary">
                well meaning and kindly.<br />
                "a benevolent smile"
              </div>
            </v-card-text>

            <v-card-actions>
              <v-btn text color="deep-purple accent-4">More...</v-btn>
            </v-card-actions>

            <v-sheet
              class="v-sheet--offset mx-auto"
              color="cyan"
              elevation="10"
              max-width="calc(100% - 32px)"
            >
              <v-sparkline
                :labels="labels"
                :value="value"
                color="white"
                line-width="2"
                padding="16"
              ></v-sparkline>
            </v-sheet>

            <v-card-text class="pt-0">
              <div class="text-h6 font-weight-light mb-2">
                User Registrations
              </div>
              <div class="subheading font-weight-light grey--text">
                Last Campaign Performance
              </div>
              <v-divider class="my-2"></v-divider>
              <v-icon class="mr-2" small> mdi-clock </v-icon>
              <span class="text-caption grey--text font-weight-light"
                >last registration 26 minutes ago</span
              >
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <schedulingform
      :ORCategory="ORCategory"
      :e1="e1"
      :payload="payload"
      :dialog="dialog"
      :doctors="doctors"
      :ORRooms="ORRooms"
      :ORCirculatingNurses="ORCirculatingNurses"
      :ORRoomTimeSlot="ORRoomTimeSlot"
      :ORRoomAvailability="ORRoomAvailability"
      @checkRoomAvailability="checkRoomAvailability"
      @searchPatientData_Props="searchPatientData_Props"
      @submit="submitform"
      @close="closeform"
    />

    <v-dialog
      v-model="searchdialog"
      width="1020"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-card-title> Patient Search </v-card-title>
        <v-divider></v-divider>

        <v-card-text style="height: 55vh">
          <v-row>
            
            <v-col cols="3" align-self="center">
              <v-autocomplete
                v-model="payload.case_type_id"              
                :items="ORCaseType"             
                depressed
                required
                item-text="category_name"
                label="Patient Type"
              >
              </v-autocomplete>

            </v-col>

            <v-col cols="3" align-self="center">
              <v-text-field v-model="payload.patientid" label="Patient ID">
              </v-text-field>
            </v-col>
            <v-col cols="3" align-self="center">
              <v-text-field v-model="payload.lastname" label="Lastname">
              </v-text-field>
            </v-col>
            <v-col cols="2" align-self="center">
              <v-btn color="primary" @click="searchPatientData">Search</v-btn>
            </v-col>
          </v-row>
          <v-divider></v-divider>

          <v-data-table
            dense
            height="40vh"
            width="200px"
            fixed-header
            class="elevation-1"
            @click:row="selectedPatient"
            :headers="headers"
            :items="patient_data"
            item-key="name"
                        
          >
            <template v-slot:item.LastName="{ item }">
              {{ item.patient_details ? item.patient_details.LastName : "" }}
            </template>
            <template v-slot:item.FirstName="{ item }">
              {{ item.patient_details ? item.patient_details.FirstName : "" }}
            </template>
            <template v-slot:item.MiddleName="{ item }">
              {{ item.patient_details ? item.patient_details.MiddleName : "" }}
            </template>
            <template v-slot:item.Sex="{ item }">
              {{ item.patient_details ? item.patient_details.Sex : "" }}
            </template>
            <template v-slot:item.BirthDate="{ item }">
              {{
                item.patient_details
                  ? _date_format(item.patient_details.BirthDate)
                  : ""
              }}
            </template>
            <template v-slot:item.Age="{ item }">
              {{ item.patient_details ? item.patient_details.Age : "" }}
            </template>
          </v-data-table>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn dark color="grey" @click="searchdialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style>
.v-sheet--offset {
  top: -0px;
  position: relative;
}
</style>

<script>
import schedulingform from "./schedulingform.vue";

export default {
  components: {
    schedulingform,
  },
  data: () => ({
    
    labels: ["12am", "3am", "6am", "9am", "12pm", "3pm", "6pm", "9pm"],
    value: [200, 675, 410, 390, 310, 460, 250, 240],
  
    isEditing: true,
    e1: 1,
    doctors: {
      surgeons: [],
      anesthesia: [],
    },
    ORRooms: [],
    ORCategory: [],
    ORCaseType: [],
    ORCirculatingNurses: [],
    ORRoomTimeSlot: [],
    ORRoomAvailability: [],
    payload: {
      patientid: "",
      lastname: "",
    },
    dialog: false,
    searchdialog: false,
    alignments: ["start", "center", "end"],

    patient_data: [],
    headers: [
      {
        text: "Patient ID",
        align: "start",
        sortable: false,
        value: "HospNum",
      },
      { text: "Case No", value: "IDNum" },
      { text: "Lastname", value: "LastName" },
      { text: "Firstname", value: "FirstName" },
      { text: "Middlename", value: "MiddleName" },
      { text: "Sex", value: "Sex" },
      { text: "Birthdate", value: "BirthDate" },
      { text: "Age", value: "Age" },
    ],
  }),

  methods: {
    async getDoctors() {
      try {
        const response = await this.$axios.get("/getdoctor");
        if (response.status === 200) {
          this.doctors.surgeons = response.data.Surgeons;
          this.doctors.anesthesia = response.data.Anethesia;
        }
      } catch (error) {
        console.error("Error fetching data from the API:", error);
        return { schedules: [] };
      }
    },

    async getORCategory() {
      try {
        const response = await this.$axios.get("/getORCategory");
        if (response.status === 200) {
          this.ORCategory = response.data;
        }
      } catch (error) {
        console.error("Error fetching data from the API:", error);
        return { ORCategory: [] };
      }
    },

    async getORRooms() {
      try {
        const response = await this.$axios.get("/getORRooms");
        if (response.status === 200) {
          this.ORRooms = response.data;
        }
      } catch (error) {
        console.error("Error fetching data from the API:", error);
        return { ORRooms: [] };
      }
    },

    async getORCaseTypes() {
      try {
        const response = await this.$axios.get("/getORCaseTypes");
        if (response.status === 200) {
          this.ORCaseType = response.data;
        }
      } catch (error) {
        console.error("Error fetching data from the API:", error);
        return { ORCaseType: [] };
      }
    },

    async getORCirculatingNurses() {
      try {
        const response = await this.$axios.get("/getORCirculatingNurses");
        if (response.status === 200) {
          this.ORCirculatingNurses = response.data;
        }
      } catch (error) {
        console.error("Error fetching data from the API:", error);
        return { ORCirculatingNurses: [] };
      }
    },

    async getORRoomTimeSlot() {
      try {
        const response = await this.$axios.get("/getORRoomTimeSlot");
        if (response.status === 200) {
          this.ORRoomTimeSlot = response.data;
        }
      } catch (error) {
        console.error("Error fetching data from the API:", error);
        return { ORRoomTimeSlot: [] };
      }
    },

    async searchPatientData() {
      try {
        var hospitalno = this.payload.patientid ? this.payload.patientid : "";
        var lastname = this.payload.lastname ? this.payload.lastname : "";

        const response = await this.$axios.get(
          "/searchPatientData?lastname=" +
            lastname +
            "&hospitalno=" +
            hospitalno
        );
        if (response.status === 200) {
          this.patient_data = response.data.data;
        }
      } catch (error) {
        console.error("Error fetching data from the API:", error);
        return { schedules: [] };
      }
    },

    async checkRoomAvailability(item) {
      try {
        var room_id = this.payload.ORRooms ? this.payload.ORRooms : "";
        var or_date = this.payload.scheduleddate
          ? this.payload.scheduleddate
          : "";
        const response = await this.$axios.get(
          "/checkRoomAvailability?room_id=" + room_id + "&or_date=" + or_date
        );
        if (response.status === 200) {
          this.ORRoomAvailability = response.data;
        }
      } catch (error) {
        console.error("Error fetching data from the API:", error);
        return { schedules: [] };
      }
    },

    async submitform() {
      try {
        const response = await this.$axios.post("/submitschedule", {
          payload: this.payload,
        });
        if (response.status === 200) {
          this.doctors.surgeons = response.data.Surgeons;
          this.doctors.anesthesia = response.data.Anethesia;
          this.dialog = false;
          this.payload = Object.assign({});
          this.e1 = 1;
        }
      } catch (error) {
        console.error("Error fetching data from the API:", error);
        return { schedules: [] };
      }
    },

    searchPatientData_Props() {
      this.searchdialog = true;
    },

    selectedPatient(item) {
      this.payload.caseno_reg = item.IDNum;
      this.payload.patientid_reg = item.HospNum;
      this.payload.lastname = item.patient_details.LastName;
      this.payload.firstname = item.patient_details.FirstName;
      this.payload.middlename = item.patient_details.MiddleName;
      this.payload.sexes = item.patient_details.Sex;
      this.payload.birthdate = this._date_format(
        item.patient_details.birthdate
      );
      this.payload.age = item.patient_details.Age;

      this.searchdialog = false;
    },

    addnewschedule() {
      this.payload = Object.assign({});
      this.dialog = true;
      this.getDoctors();
      this.getORCategory();
      this.getORRooms();
      this.getORRoomTimeSlot();
      this.getORCirculatingNurses();
      this.getORCaseTypes();
    },

    closeform() {
      this.e1 = 1;
      this.dialog = false;
    },
  },
};
</script>