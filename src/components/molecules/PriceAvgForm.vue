<template>
  <div class="bg-gray-100 border border-solid border-gray-300 py-6 px-5 text-left">
    <h3 class="font-bold">Price Averages</h3>
    <form @submit.prevent="submitForm">
      <fieldset>
        <div class="flex flex-row flex-wrap justify-between items-center mt-6 xl:mt-0">
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
                'bg-green-500 hover:bg-green-700': !loading,
                'bg-green-300 cursor-not-allowed': loading,
              }"
              :disabled="loading"
            >
              {{ loading ? 'Loading...' : 'Submit' }}
            </button>
          </div>
        </div>
      </fieldset>
    </form>

    <h3>Price Averages between {{ searchDateStart }} and {{ searchDateEnd }}:</h3>

    <canvas id="priceAvgChart" width="400"></canvas>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, onMounted,
} from 'vue';
import Chart from 'chart.js';
import { APIRoutes } from '@/typings/api.types';
import { useApi } from '@/utils/api';
import { nextWeek, today } from '@/utils/date.util';
import { PriceAvg } from '@/typings/analytics.types';

export default defineComponent({
  name: 'PriceAvgForm',

  setup() {
    const { fetchApi } = useApi();

    const loading = ref<boolean>(false);
    const searchDateStart = ref<string>(today.toISOString().substring(0, 10));
    const searchDateEnd = ref<string>(nextWeek.toISOString().substring(0, 10));
    const priceAvg = ref<PriceAvg[]>([]);

    function createChart() {
      const element = document.getElementById('priceAvgChart');

      if (element) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const chart = new Chart(element as HTMLCanvasElement, {
          type: 'bar',

          data: {
            labels: priceAvg.value.map((item: PriceAvg) => item.location.name),
            datasets: [
              {
                label: '',
                data: priceAvg.value.map((item: PriceAvg) => item.avg_price),
                fill: false,
                borderWidth: 1,
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
          startDate: new Date(searchDateStart.value).toISOString(),
          endDate: new Date(searchDateEnd.value).toISOString(),
        };

        const response = await fetchApi(APIRoutes.GET_PRICE_AVG, {
          params,
        });

        priceAvg.value = response?.data || null;

        console.log(priceAvg.value);
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
      priceAvg,
      submitForm,
    };
  },
});
</script>
