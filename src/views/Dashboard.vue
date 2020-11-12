<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
      <booking-states-form
        :locations="locations"
      />
      <booking-count-form
        :locations="locations"
      />
      <price-stats-form
        :locations="locations"
      />
    </div>
    <price-avg-form class="mt-2" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useApi } from '@/utils/api';
import { APIRoutes } from '@/typings/api.types';
import BookingStatesForm from '@/components/molecules/BookingStatesForm.vue';
import BookingCountForm from '@/components/molecules/BookingCountForm.vue';
import PriceAvgForm from '@/components/molecules/PriceAvgForm.vue';
import PriceStatsForm from '@/components/molecules/PriceStatsForm.vue';
import { Location } from '@/typings/location.types';
import { sortLocationByName } from '@/utils/sort.util';

export default defineComponent({
  name: 'Dashboard',

  components: {
    BookingStatesForm,
    BookingCountForm,
    PriceAvgForm,
    PriceStatsForm,
  },

  setup() {
    const { fetchApi } = useApi();
    const locations = ref<Location[]>([]);

    // Fetch Locations
    async function fetchLocations() {
      try {
        const locationsResponse = await fetchApi(APIRoutes.GET_LOCATIONS);

        if (locationsResponse?.data?.length) {
          locations.value = (locationsResponse.data as Location[]).sort(sortLocationByName);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }

    onMounted(() => {
      fetchLocations();
    });

    return {
      locations,
    };
  },
});
</script>
