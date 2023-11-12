<template>
  <v-sheet
    rounded="lg"
    class="pt-6 pb-6 px-6 bg-black"
    width="100%"
    min-height="70vh"
    theme="dark"
  >
    <v-row>
      <v-spacer v-if="!mobile"></v-spacer>
      <v-col class="text-right text-caption">{{ timeDistanceString }}</v-col>
    </v-row>
    <v-row>
      <v-col sm="12">
        <v-card min-width="250" min-height="100" rounded="lg">
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
          <v-card-text>
            <v-list>
              <v-list-item-subtitle>
                <v-icon
                  size="18"
                  v-bind="alertMessage"
                  class="me-1 pb-1"
                ></v-icon>
                Warning or critical alerts (last
                {{ alertMessage.data.length }} entries)
              </v-list-item-subtitle>
              <v-divider theme="dark"></v-divider>
              <v-list-item v-for="(alert, idx) in alertMessage.data" :key="idx">
                <v-list-item-title color="error"
                  >{{ alert[2] }} on {{ alert[3] }} ({{ alert[4] }})
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col lg="6" sm="12">
        <v-card min-width="250" min-height="300" rounded="lg">
          <v-card-title :class="{ 'text-subtitle-2': mobile }"
            >{{ quicklook.cpu_name }}
          </v-card-title>

          <v-card-text>
            <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col lg="6" sm="12">
        <v-card min-width="250" min-height="300" rounded="lg">
          <v-card-title :class="{ 'text-subtitle-2': mobile }">
            {{ dockerVersion }}
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col
                lg="6"
                sm="12"
                v-for="item in dockerContainer"
                :key="item.Id"
              >
                <v-card>
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
const { post, data, error } = useApi();
let intervalId;
let intervalIds = [];
const timeDistance = ref(null);

onMounted(() => {
  lastTimeExecuted.value = new Date().toISOString();
  getList();
  intervalId = setInterval(() => {
    getList();
  }, 1000 * 45);
  intervalIds.push(intervalId);
  intervalIds.push(setInterval(() => setDistance, 1000 * 15));
});

onUnmounted(() => {
  intervalIds.map((id) => clearInterval(id));
});

const setDistance = () => {
  if (!data) {
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

const colorByThreshold = (value, norm = 50, critical = 80) => {
  if (_.inRange(value, norm)) {
    return Utils.transparentize(Utils.CHART_COLORS.green, 0.1);
  }
  if (_.inRange(value, norm, critical)) {
    return Utils.transparentize(Utils.CHART_COLORS.orange, 0.2);
  }
  if (_.inRange(value, critical)) {
    return Utils.transparentize(Utils.CHART_COLORS.deepOrange, 0.1);
  }
};
const chartData = computed(() => {
  console.log(quicklook.value.cpu);
  const data = [quicklook.value.cpu, quicklook.value.mem, quicklook.value.swap];
  const colors = [
    Utils.transparentize(Utils.CHART_COLORS.green, 0.1),
    Utils.transparentize(Utils.CHART_COLORS.green, 0.1),
    Utils.transparentize(Utils.CHART_COLORS.green, 0.1),
  ];
  if (data[0] > 5 && data[0] < 20) {
    colors[0] = Utils.transparentize(Utils.CHART_COLORS.deepOrange, 0.1);
  } else if (data[0] > 20) {
    colors[0] = Utils.transparentize(Utils.CHART_COLORS.red, 0.1);
  }

  if (data[1] > 10 && data[0] < 20) {
    colors[1] = Utils.transparentize(Utils.CHART_COLORS.deepOrange, 0.1);
  } else if (data[1] > 20) {
    colors[1] = Utils.transparentize(Utils.CHART_COLORS.red, 0.1);
  }
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
  console.log(docker.value.version.Platform.Name);
  return docker.value.containers;
});
const dockerVersion = computed(() => {
  if (!data.value) return "";
  console.log(docker.value.version.Platform.Name);
  return docker.value.version.Platform.Name;
});
const docker = computed(() => {
  if (!data.value) return {};

  const { docker } = data.value.sensors;
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
  await post("perfmon?sensors=cpu,system,alert,ip,quicklook,docker");
  setDistance();
};
</script>
