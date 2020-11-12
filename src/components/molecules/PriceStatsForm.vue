<template>
  <div class="bg-gray-100 border border-solid border-gray-300 py-6 px-5 text-left">
    <h3 class="font-bold">Booking Count</h3>
    <form @submit.prevent="submitForm">
      <fieldset>
        <div class="flex flex-row flex-wrap justify-between items-center mt-6 xl:mt-0">
          <!--      Location-->
          <div class="field-row">
            <label for="searchLocation">Location:</label>
            <select
              v-model="searchLocation"
              id="searchLocation"
            >
              <option />
              <option
                v-for="location in locations"
                :key="location.id"
                :value="location"
              >
                {{ location.name }}
              </option>
            </select>
          </div>

          <!--      Date-->
          <div class="field-row">
            <label for="searchDateStart">Start-Date:</label>
            <input
              id="searchDateStart"
              type="date"
              v-model="searchDateStart"
            />
          </div>

          <div class="field-row">
            <label for="searchDateEnd">End-Date:</label>
            <input id="searchDateEnd" type="date" v-model="searchDateEnd" />
          </div>

          <div class="w-full mt-4 xl:mt-0 xl:w-auto text-right">
            <button
              type="submit"
              class="
                py-2 px-3 px-6 text-white  inline-block rounded
              "
              :class="{
                'bg-green-500 hover:bg-green-700': !loading && searchLocation,
                'bg-green-300 cursor-not-allowed': loading || !searchLocation,
              }"
              :disabled="loading || !searchLocation"
            >
              {{ loading ? 'Loading...' : 'Submit' }}
            </button>
          </div>
        </div>
      </fieldset>
    </form>

    <h3>Booking-Counts between {{ searchDateStart }} and {{ searchDateEnd }}:</h3>

    <canvas id="bookingCountsChart" width="400" height="400"></canvas>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, PropType, onMounted,
} from 'vue';
import Chart from 'chart.js';
import { APIRoutes } from '@/typings/api.types';
import { useApi } from '@/utils/api';
import { Location } from '@/typings/location.types';
import { getDates, nextWeek, today } from '@/utils/date.util';

export default defineComponent({
  name: 'PriceStatsForm',

  props: {
    locations: {
      type: Array as PropType<Location[]>,
      default: () => [],
    },
  },

  setup() {
    const { fetchApi } = useApi();

    const loading = ref<boolean>(false);
    const searchLocation = ref <Location | null>(null);
    const searchDateStart = ref<string>(today.toISOString().substring(0, 10));
    const searchDateEnd = ref<string>(nextWeek.toISOString().substring(0, 10));
    const bookingCounts = ref<number[]>([]);

    function createChart() {
      const element = document.getElementById('bookingCountsChart');

      const dates = getDates(new Date(searchDateStart.value), new Date(searchDateEnd.value));
      const formattedDates = dates.map((date: Date) => date.toISOString().substring(0, 10));
      formattedDates.pop();

      if (element) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const chart = new Chart(element as HTMLCanvasElement, {
          type: 'line',

          data: {
            labels: formattedDates,
            datasets: [
              {
                label: '',
                data: bookingCounts.value,
                fill: false,
                backgroundColor: [
                  '#48bb78', // Green
                ],
                borderColor: [
                  '#2f855a',
                ],
                lineTension: 0.1,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                },
              }],
            },
          },
        });
      }
    }

    async function submitForm() {
      try {
        loading.value = true;

        const params = {
          location: searchLocation.value?.id || '',
          startDate: new Date(searchDateStart.value).toISOString(),
          endDate: new Date(searchDateEnd.value).toISOString(),
        };

        const response = await fetchApi(APIRoutes.GET_BOOKING_COUNT, {
          params,
        });

        bookingCounts.value = response?.data || null;

        console.log(bookingCounts.value);
        createChart();
      } catch (e) {
        console.error(e);
      } finally {
        loading.value = false;
      }
    }

    onMounted(() => {
      createChart();
    });

    return {
      loading,
      searchDateStart,
      searchDateEnd,
      searchLocation,
      bookingCounts,
      submitForm,
    };
  },
});
</script>
