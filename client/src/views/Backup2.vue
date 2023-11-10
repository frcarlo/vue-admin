<script setup>
import _ from "lodash";
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useApi } from "@/composables/Api";

const { post, data, error } = useApi();
const selected = ref([]);
const showSelect = ref(true);
let intervalId;

onMounted(() => {
  getList();
  intervalId = setInterval(() => {
    getList();
  }, 30000);
});

onUnmounted(() => clearInterval(intervalId));

const isSelected = (item) => !!selected.value.find((s) => s.uuid === item.uuid);
const getList = () => post("lsblk");
const showSnack = computed(() => !!error.value);
const headers = computed(() => {
  if (!data.value) return [];
  const first = _.first(data.value.result);
  const h = _.keys(first).map((k) => {
    return {
      key: k,
      title: _.capitalize(_.kebabCase(k)),
      removable: true,
    };
  });
  return h.concat([{ key: "status", title: "Status" }]);
});
const devices = computed(() => {
  if (data.value) {
    return data.value.result;
  }
  return [];
});
</script>

<template>
  <v-sheet
    rounded="lg"
    class="pt-6 pb-6 px-6 bg-black"
    width="100%"
    min-height="70vh"
    theme="dark"
  >
    <v-snackbar
      v-model="showSnack"
      multi-line
      :timeout="2000"
      location="top"
      color="error"
    >
      {{ error }}

      <template v-slot:actions></template>
    </v-snackbar>
    <v-card
      flat=""
      class="pt-6 pb-6 bg-black"
      theme="dark"
      width="100%"
      height="70vh"
      rounded="lg"
    >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="seconary"
          variant="tonal"
          @click="getList()"
          icon="mdi-refresh"
        ></v-btn>
      </v-card-actions>
      <v-card-text>
        <v-data-table
          density="compact"
          :hover="true"
          v-model="selected"
          :item-value="`uuid`"
          return-object
          select-strategy="single"
          :items="devices"
          :headers="headers"
          :show-select="showSelect"
        >
          <template v-slot:top>
            <v-toolbar
              :elevation="0"
              class="rounded-t-lg"
              title="Select device for backup"
            >
              <v-btn v-if="selected.length > 0" color="primary">Run</v-btn>
            </v-toolbar>
          </template>
          <template v-slot:[`item.status`]="{ item }">
            <v-progress-linear
              :indeterminate="isSelected(item)"
              color="yellow-darken-2"
            ></v-progress-linear>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-sheet>
</template>

<style scoped lang="scss"></style>
