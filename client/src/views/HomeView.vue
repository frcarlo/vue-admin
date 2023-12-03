<template>
  <v-sheet
    rounded="lg"
    class="bg-black pa-2 pa-md-4"
    width="100%"
    min-height="70vh"
    theme="dark"
  >
    <div class="d-flex justify-end mr-4 mb-2">
      <div class="text-right text-caption mr-4">{{ timeDistanceString }}</div>
    </div>

    <v-row v-if="showErrors.is_error" justify="center" align-content="center">
      <v-col cols="6">
        <v-alert color="error" icon="$error"
          >{{ showErrors.message }} retry in {{ refresh }} seconds...
        </v-alert>
      </v-col>
    </v-row>
    <v-progress-linear
      :active="loading"
      :indeterminate="true"
      color="yellow-darken-2"
    ></v-progress-linear>

    <!--    <v-skeleton-loader-->
    <!--      :loading="firstTimeLoading"-->
    <!--      type="card-avatar, article, actions"-->
    <!--      height="90%"-->
    <!--    >-->
    <v-row v-if="showErrors.is_error === false">
      <v-col sm="12">
        <v-card min-height="100" rounded="lg" class="" variant="tonal">
          <v-card-item>
            <template v-slot:title>
              <v-card-title :class="{ 'text-subtitle-2': mobile }"
                >Host: {{ system.hostname }}
              </v-card-title>
            </template>
            <template v-slot:subtitle>
              <v-card-subtitle
                >{{ system.hr_name }} / {{ system.os_name }}
                {{ system.os_version }}
              </v-card-subtitle>
              <v-card-subtitle>IP {{ ip.address }}</v-card-subtitle>
            </template>
          </v-card-item>
          <v-card-text class="">
            <v-list class="pa-6" rounded="lg">
              <v-list-item-subtitle>
                <p>
                  <v-icon
                    size="18"
                    v-bind="alertMessage"
                    class="me-1 pb-1"
                  ></v-icon>
                  Warning or critical alerts
                </p>
                <p class="ml-7">
                  (last {{ alertMessage.data.length }} entries)
                </p>
              </v-list-item-subtitle>
              <v-divider theme="dark"></v-divider>
              <v-list-item v-for="(alert, idx) in alertMessage.data" :key="idx">
                <v-list-item-title
                  :class="{
                    'text-caption': mobile,
                    'font-weight-bold': mobile,
                  }"
                >
                  {{ alert[2] }} on {{ alert[3] }} ({{ alert[4] }})
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col lg="6" sm="12">
        <v-card min-height="320" rounded="lg" class="" variant="tonal">
          <v-card-title :class="{ 'text-subtitle-2': mobile }"
            >{{ quicklook.cpu_name }}
          </v-card-title>

          <v-card-text>
            <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col lg="6" sm="12">
        <v-card min-height="330" rounded="lg" variant="tonal" class="">
          <v-card-title :class="{ 'text-subtitle-2': mobile }">
            Container (#{{ dockerContainer.length }})
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col
                lg="6"
                sm="12"
                v-for="item in dockerContainer"
                :key="item.Id"
              >
                <v-card variant="text" rounded="lg">
                  <v-card-title>
                    {{ item.name }}
                  </v-card-title>
                  <v-card-item
                    :class="{
                      'text-red': item.Status !== 'running',
                      'text-green': item.Status === 'running',
                      'font-weight-bold': true,
                    }"
                    >{{ item.Status }}
                  </v-card-item>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!--    </v-skeleton-loader>-->
  </v-sheet>
</template>

<script setup>
import _ from "lodash";
import * as Utils from "../composables/Utils";
import { computed, ref, onMounted, onUnmounted } from "vue";
import { Bar } from "vue-chartjs";
import { useDisplay } from "vuetify";

import {
  Chart as ChartJS,
  Colors,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Colors,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
);
import { formatDistance } from "date-fns";
import { useApi } from "@/composables/Api";

let firstload = true;
const refresh = 1000 * 60;

const chartOptions = ref({
  responsive: true,
  indexAxis: "y",

  plugins: {
    colors: {
      enabled: true,
    },
  },
});
const lastTimeExecuted = ref(null);
const { mobile } = useDisplay();

// eslint-disable-next-line no-unused-vars
const { post, data, error, loading, errorX } = useApi();
let intervalId;
let intervalIds = [];
const timeDistance = ref(null);
const firstTimeLoading = computed(() => {
  return loading.value && firstload;
});
const showErrors = computed(() => {
  if (
    data.value &&
    Array.isArray(data.value.errors) &&
    data.value.errors.length > 0
  ) {
    return {
      is_error: true,
      message: "Some errors occured ....",
    };
  }
  if (error.value !== null) {
    return {
      is_error: true,
      message: error.value,
    };
  }
  return {
    is_error: false,
    message: "OK",
  };
});
const showTiles = computed(() => {
  if (!timeDistance.value && error.value !== null) return false;
  return !(data.value && Array.isArray(data.value.errors));
});
onMounted(async () => {
  lastTimeExecuted.value = new Date().toISOString();
  await getList();
  firstload = false;
  intervalId = setInterval(() => {
    getList();
  }, refresh);
  intervalIds.push(intervalId);
  intervalIds.push(setInterval(() => setDistance, 1000 * 15));
});

onUnmounted(() => {
  intervalIds.map((id) => clearInterval(id));
});

const setDistance = () => {
  if (!data.value) {
    console.log("No data...");
    return;
  }

  timeDistance.value = {
    distance: formatDistance(new Date(), Date.parse(data.value.executed_at)),
  };
};

const timeDistanceString = computed(() => {
  if (!timeDistance.value) {
    return "no executed";
  } else {
    return "last refresh " + timeDistance.value.distance;
  }
});

const ip = computed(() => {
  if (!data.value) return {};
  const { ip } = data.value.sensors;
  return ip;
});

const colorByThreshold = (value, norm = 15, critical = 20, max = 101) => {
  if (_.inRange(value, norm)) {
    return Utils.transparentize(Utils.CHART_COLORS.green, 0.1);
  }
  if (_.inRange(value, norm, critical)) {
    return Utils.transparentize(Utils.CHART_COLORS.orange, 0.2);
  }
  if (_.inRange(value, critical, max)) {
    return Utils.transparentize(Utils.CHART_COLORS.deepOrange, 0.1);
  }
};
const chartData = computed(() => {
  return {
    labels: ["Load"],
    datasets: [
      {
        label: "CPU",
        data: [quicklook.value.cpu],
        //barThickness: 60,
        barPercentage: 0.7,

        categoryPercentage: 0.5,

        backgroundColor: colorByThreshold(quicklook.value.cpu, 15, 20),
      },
      {
        label: "Memory",
        //barThickness: 100,
        categoryPercentage: 0.5,
        barPercentage: 0.7,
        data: [quicklook.value.mem],
        backgroundColor: colorByThreshold(quicklook.value.mem, 18, 80),
      },
    ],
  };
});
const dockerContainer = computed(() => {
  if (!data.value) return [];

  return docker.value.containers;
});
const dockerVersion = computed(() => {
  if (!docker.value) return "";

  return _.get(docker.value, "version.Platform.Name", "-");
});
const docker = computed(() => {
  if (!data.value) return {};

  const { containers: docker } = data.value.sensors;
  return docker;
});

const quicklook = computed(() => {
  if (!data.value) return {};

  const { quicklook } = data.value.sensors;
  return quicklook;
});
const system = computed(() => {
  if (!data.value) return {};

  const { system } = data.value.sensors;
  return system;
});

const alertMessage = computed(() => {
  if (data.value) {
    if (data.value.sensors.alert.length > 0)
      return {
        message: `Alerts detected`,
        icon: "mdi-alert",
        color: "error",
        data: data.value.sensors.alert,
      };
  }
  return {
    message: `No Alerts`,
    icon: "mdi-hand-okay",
    color: "primary",
    data: [],
  };
});
const getList = async () => {
  console.log("Execute");
  try {
    await post(
      `${
        import.meta.env.VITE_API_URL
      }/perfmon?sensors=cpu,system,alert,ip,quicklook,containers`,
    );
    setDistance();
  } catch (error) {
    console.log("Ups ...", error);
  }
};
</script>
