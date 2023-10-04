<template>
  <div>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-center">Case No.</th>
            <th class="text-center">Schedule Date</th>
            <th class="text-center">Surgeon</th>
            <th class="text-center">Anesthesia</th>
            <th class="text-center">Procedure</th>
            <th class="text-center">Room #</th>
            <th class="text-center">Status ID</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="schedule in schedules" :key="schedule.id">
            <td class="text-center">{{ schedule.orcase_no }}</td>
            <td class="text-center">
              {{ formatDate(schedule.schedule_date) }}
            </td>
            <td class="text-center">
              <ul>
                <li v-for="surgeon in schedule.schedule_surgeons">
                  {{ surgeon.lastname }} ,
                  {{ surgeon.firstname }}
                  {{ surgeon.middlename }}
                </li>
              </ul>
            </td>
            <td class="text-center">
              <ul>
                <li v-for="anesthesia in schedule.schedule_anesthesia">
                  {{ anesthesia.lastname }} ,
                  {{ anesthesia.firstname }}
                  {{ anesthesia.middlename }}
                </li>
              </ul>
            </td>
            <td class="text-center">{{ schedule.procedure_name }}</td>
            <td class="text-center">{{ schedule.room_id }}</td>
            <td class="text-center">{{ schedule.schedule_status_id }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>
  
  
    <script>
export default {
  data() {
    return {
      schedules: [],
    };
  },
  created() {
    this.asyncData();
  },

  methods: {
    async asyncData() {
      try {
        const response = await this.$axios.get("/schedules");
        if (response.status === 200) {
          this.schedules = response.data;
        }
      } catch (error) {
        console.error("Error fetching data from the API:", error);
        return { schedules: [] };
      }
    },

    formatDate(date) {
      const parsedDate = new Date(date); // Ensure 'date' is a valid Date object
      if (isNaN(parsedDate)) {
        return "Invalid Date";
      }
      
      // Format the date as "MM-dd-yyyy HH:mm"
      const formattedDate = `${(parsedDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${parsedDate
        .getDate()
        .toString()
        .padStart(2, "0")}-${parsedDate.getFullYear()} ${parsedDate
        .getHours()
        .toString()
        .padStart(2, "0")}:${parsedDate
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;

      return formattedDate;
    },
  },
};
</script>
  