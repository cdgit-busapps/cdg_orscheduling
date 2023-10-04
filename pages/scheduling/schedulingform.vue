<template>
  <div>
    <v-dialog
      v-model="dialog"
      width="800"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-form
        ref="form"
        @submit.prevent="submitform"
        v-model="valid"
        lazy-validation
      >
        <v-stepper v-model="e1">
          <v-stepper-header>
            <v-stepper-step :complete="e1 > 1" step="1"
              >Basic Patient Information</v-stepper-step
            >
            <v-divider> </v-divider>
            <v-stepper-step :complete="e1 > 2" step="2"
              >Schedule Date and Time
            </v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step step="3"> Procedure Details </v-stepper-step>
            <v-divider></v-divider>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <v-card flat class="mb-12" min-height="200px">
                <v-row no-gutters justify="space-around">
                  <v-col lg="12">
                    <v-col>
                      <v-row justify="space-around">
                        <v-col lg="4">
                          <v-text-field
                            hide-details
                            v-model="payload.caseno_reg"
                            readonly
                            label="Case No"
                          ></v-text-field>
                        </v-col>

                        <v-col lg="4">
                          <v-text-field
                            hide-details
                            v-model="payload.patientid_reg"
                            readonly
                            label="Patient I.D."
                          ></v-text-field>
                        </v-col>

                        <v-col lg="4">
                          <v-card-actions>
                            <v-btn
                              large
                              color="primary"
                              @click="$emit('searchPatientData_Props')"
                            >
                              Search
                            </v-btn>
                          </v-card-actions>
                        </v-col>
                      </v-row>

                      <v-row justify="space-around">
                        <v-col lg="4">
                          <v-text-field
                            hide-details
                            v-model="payload.stationid"
                            readonly
                            label="Nurse Station"
                          ></v-text-field>
                        </v-col>
                        <v-col lg="4">
                          <v-text-field
                            hide-details
                            v-model="payload.roomid"
                            readonly
                            label="Room No"
                          ></v-text-field>
                        </v-col>
                        <v-col lg="4"> </v-col>
                      </v-row>
                    </v-col>

                    <v-col>
                      <v-text-field
                        hide-details
                        v-model="payload.lastname"
                        :counter="50"
                        :rules="lastnameRules"
                        readonly
                        label="Lastname"
                        required
                      ></v-text-field>

                      <v-text-field
                        hide-details
                        v-model="payload.firstname"
                        :counter="50"
                        :rules="firstnameRules"
                        readonly
                        label="Firstname"
                        required
                      ></v-text-field>

                      <v-text-field
                        hide-details
                        v-model="payload.middlename"
                        :counter="50"
                        label="Middlename"
                        required
                      ></v-text-field>

                      <v-col>
                        <v-row>
                          <v-col cols="4">
                            <v-select
                              hide-details
                              v-model="payload.sexes"
                              :items="sexes"
                              item-text="text"
                              item-value="value"
                              :menu-props="{ top: true, offsetY: true }"
                              required
                              :rules="sexRules"
                              label="Sex"
                            >
                            </v-select>
                          </v-col>

                          <v-col cols="4">
                            <v-menu
                              ref="menubirtdate"
                              v-model="menubirtdate"
                              :close-on-content-click="false"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  hide-details
                                  v-model="payload.birthdate"
                                  label="Birthday date"
                                  prepend-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                >
                                </v-text-field>
                              </template>

                              <v-date-picker
                                v-model="payload.birthdate"
                                :active-picker.sync="activePickerBirthdate"
                                :max="
                                  new Date(
                                    Date.now() -
                                      new Date().getTimezoneOffset() * 60000
                                  )
                                    .toISOString()
                                    .substring(0, 10)
                                "
                                min="1900-01-01"
                                @input="calculateAge"
                                @change="saveBirthdate"
                              ></v-date-picker>
                            </v-menu>
                          </v-col>

                          <v-col cols="4">
                            <v-text-field
                              hide-details
                              v-model="payload.age"
                              readonly
                              label="Age"
                            >
                              <p>{{ age }}</p>
                            </v-text-field>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-col>
                  </v-col>
                </v-row>
              </v-card>

              <v-divider></v-divider>
              <v-card-actions>
                <v-btn depressed dark color="grey" @click="$emit('close')">
                  Cancel
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="validate(2)"> Continue </v-btn>
              </v-card-actions>
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-card flat class="mb-12" min-height="250px">
                <v-row>
                  <v-col cols="5">
                    <v-autocomplete
                      hide-details
                      required
                      :items="ORCategory"
                      item-value="id"
                      v-model="payload.ORCategory"
                      item-text="category_name"
                      label="Operating Room Category"
                    >
                    </v-autocomplete>
                  </v-col>

                  <v-col cols="5">
                    <v-autocomplete
                      hide-details
                      :items="ORRooms"
                      item-value="id"
                      v-model="payload.ORRooms"
                      @change="$emit('checkRoomAvailability')"
                      item-text="room_name"
                      label="Operating Room"
                    >
                    </v-autocomplete>
                  </v-col>
                </v-row>

                <v-row v-if="payload.ORRooms">
                  <v-col cols="4">
                    <v-text-field
                      hide-details
                      v-model="payload.scheduleddate"
                      label="Schedule Date"
                      prepend-icon="mdi-calendar"
                      readonly
                    >
                    </v-text-field>
                  </v-col>
                </v-row>

                <v-row v-if="payload.ORRooms" no-gutters>
                  <v-col cols="5">
                    <v-date-picker
                      v-model="payload.scheduleddate"
                      class="mt-4"
                      min="2023-01-01"
                      max="2050-12-31"
                      @change="$emit('checkRoomAvailability')"
                    ></v-date-picker>
                  </v-col>
                  <v-col cols="7">
                    <v-list>
                      <v-list-item>
                        <v-radio-group v-model="payload.radioScheduledTime">
                          <v-row
                            v-for="time in ORRoomTimeSlot"
                            no-gutters
                            :key="time.id"
                          >
                            <v-col cols="7" class="primary-text">
                              <v-radio
                                :label="`${time.timeslot}`"
                                :value="time.id"
                                :disabled="checkRoomAvailablity(time.id)"
                              >
                              </v-radio>
                            </v-col>
                             <v-col
                              cols="5"
                              style="width: 200px"
                              :class="getRoomStatusColor(time.id)"
                            >
                              {{
                                checkRoomAvailablity(time.id) == true
                                  ? "Not Available"
                                  : "Available"
                              }}
                            </v-col>
                          </v-row>
                        </v-radio-group>
                      </v-list-item>
                    </v-list>
                  </v-col>
                </v-row>
              </v-card>

              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn depressed dark color="info" @click="e1 = 1">
                  Back
                </v-btn>
                <v-btn depressed dark color="primary" @click="validate(3)">
                  Continue
                </v-btn>
              </v-card-actions>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-card flat class="mb-12" min-height="200px">
                <v-row>
                  <v-col class="12">
                    <v-text-field
                      hide-details
                      v-model="payload.procedurename"
                      :counter="100"
                      label="Procedure"
                      required
                    ></v-text-field>

                    <v-autocomplete
                      hide-details
                      :items="doctors.surgeons"
                      item-value="id"
                      return-object
                      v-model="payload.surgeon"
                      item-text="doctor_name"
                      label="Surgeon"
                    >
                    </v-autocomplete>

                    <v-autocomplete
                      hide-details
                      :items="doctors.anesthesia"
                      item-value="id"
                      return-object
                      v-model="payload.anesthesia"
                      item-text="doctor_name"
                      label="Anesthesia"
                    >
                    </v-autocomplete>

                    <v-autocomplete
                      hide-details
                      :items="ORCirculatingNurses"
                      item-value="id"
                      return-object
                      v-model="payload.ORCirculatingNurses"
                      item-text="circulatingnurses"
                      label="Circulating Nurse"
                    >
                    </v-autocomplete>

                    <v-text-field
                      hide-details
                      v-model="payload.SNurse"
                      :counter="100"
                      label="Scrub Nurse"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card>

              <v-divider></v-divider>
              <v-card-actions>
                <v-btn depressed dark color="grey" @click="$emit('close')">
                  Cancel
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn depressed dark color="info" @click="e1 = 2">
                  Back
                </v-btn>
                <v-btn
                  :ripple="{ center: true }"
                  depressed
                  dark
                  color="success"
                  type="submit"
                >
                  Submit
                </v-btn>
              </v-card-actions>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-form>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      default: () => false,
    },
    doctors: {
      type: Object,
      default: () => {},
    },
    payload: {
      type: Object,
      default: () => {},
    },
    ORCategory: {
      type: Array,
      default: () => [],
    },
    ORRooms: {
      type: Array,
      default: () => [],
    },
    ORRoomTimeSlot: {
      type: Array,
      default: () => [],
    },
    ORRoomAvailability: {
      type: Array,
      default: () => [],
    },
    ORCirculatingNurses: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    e1: 1,
    age: null,
    sexes: [
      { value: "M", text: "Male" },
      { value: "F", text: "Female" },
    ],
    sexRules: [
      (v) => !!v || "Sex is required",
      (v) => (v && v.length <= 5) || "Select Sex",
    ],
    valid: true,
    activePickerBirthdate: null,
    activePickerScheduledDate: null,
    scheduleddate: new Date().getDate(),
    birthdate: null,
    menubirtdate: false,
    menuscheduleddate: false,
    lastname: "",
    lastnameRules: [
      (v) => !!v || "Lastname is required",
      (v) =>
        (v && v.length <= 100) || "Lastname must be less than 2 characters",
    ],

    firstname: "",
    firstnameRules: [
      (v) => !!v || "Firstname is required",
      (v) =>
        (v && v.length <= 100) || "Firstname must be less than 2 characters",
    ],
    middlename: "",
    procedurename: null,
    radioScheduledTime: null,
  }),

  watch: {
    menubirtdate(val) {
      val && setTimeout(() => (this.activePickerBirthdate = "YEAR"));
    },
    menuscheduleddate(val) {
      val && setTimeout(() => (this.activePickerScheduledDate = "YEAR"));
    },
  },

  methods: {
    // allowedDates: (val) => parseInt(val.split("-")[2], 10) % 2 === 0,
    saveBirthdate(date) {
      this.$refs.menubirtdate.save(date);
    },

    saveScheduleddate(date) {
      this.$refs.menuscheduleddate.save(date);
    },

    calculateAge() {
      if (this.payload.birthdate) {
        const birthdate = new Date(this.payload.birthdate);
        const today = new Date();
        const age = today.getFullYear() - birthdate.getFullYear();

        // Check if the birthday has occurred this year
        if (
          today.getMonth() < birthdate.getMonth() ||
          (today.getMonth() === birthdate.getMonth() &&
            today.getDate() < birthdate.getDate())
        ) {
          this.payload.age = age - 1;
        } else {
          this.payload.age = age;
        }
      } else {
        this.age = null;
      }
    },

    validate(value) {
      if (this.$refs.form.validate()) {
        this.e1 = value;
      }
    },

    reset() {
      this.$refs.form.reset();
    },

    submitform() {
      this.$emit("submit", this.payload);
      setTimeout(() => {
        this.e1 = 1;
      }, 2000);
    },

    resetValidation() {
      this.$refs.form.resetValidation();
    },

    checkRoomAvailablity(val) {
      return this.ORRoomAvailability.some(
        (ORRoomAvailability) => ORRoomAvailability.timeslot_id == val
      );
    },

    getRoomStatusColor(val) {
      return this.checkRoomAvailablity(val) ? "error" : "success";
    },
  },
};
</script>
