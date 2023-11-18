<script setup>
import _ from "lodash";
import { computed, ref, onMounted, onUnmounted, isProxy, toRaw } from "vue";
import { useApi } from "@/composables/Api";

const { post, data, error } = useApi();
const { post: postMount, data: mountResponse, error: mountError } = useApi();

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

const toggleMount = async (item) => {
  let mount;
  console.log(hasMountpoint(item.raw));
  if (hasMountpoint(item.raw)) {
    mount = false;
  } else {
    mount = true;
  }
  await postMount(`${import.meta.env.VITE_API_URL}/mount`, {
    device: { ...item.raw, mount },
  });
  getList();
};
const getList = () => post(`${import.meta.env.VITE_API_URL}/lsblk`);
const showSnack = computed(() => !!error.value);
const hasMountpoint = (device) => {
  if (isProxy(device)) device = toRaw(device);

  return _.get(device, "mountpoint", null) !== null;
};
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
      min-height="70vh"
      rounded="lg"
    >
      <v-card-title>List of usb-flash drives</v-card-title>
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
        <v-data-iterator
          v-model="selected"
          :items="devices"
          item-value="name"
          :show-select="showSelect"
          select-strategy="single"
          return-object
        >
          <template
            v-slot:default="{
              items,
              isExpanded,
              toggleExpand,
              select,
              toggleSelect,
              isSelected,
            }"
          >
            <v-row>
              <v-col
                v-for="item in items"
                :key="item.raw.name"
                cols="12"
                sm="12"
                md="6"
              >
                <v-card rounded="lg">
                  <v-card-title class="d-flex align-center">
                    <v-icon
                      color="green"
                      icon="mdi-usb-flash-drive"
                      start
                      size="18"
                    ></v-icon>

                    <h4>
                      {{ item.raw.name }}
                      <span class="text-subtitle-2">({{ item.raw.uuid }})</span>
                    </h4>
                    <v-spacer></v-spacer>
                    <v-btn
                      @click="toggleMount(item)"
                      :color="hasMountpoint(item.raw) ? 'warning' : 'white'"
                      variant="plain"
                    >
                      <v-icon size="32"
                        >{{
                          hasMountpoint(item.raw) ? "mdi-eject" : "mdi-play"
                        }}
                      </v-icon>
                    </v-btn>
                  </v-card-title>
                  <v-card-text>
                    {{ item.raw.label || "UNKNOWN-LABEL " }}
                  </v-card-text>

                  <v-divider></v-divider>

                  <div>
                    <v-list density="compact" :lines="false">
                      <v-list-item
                        :title="`Mountpoint: ${item.raw.mountpoint}`"
                      ></v-list-item>
                      <v-list-item
                        :title="`Filesystem: ${item.raw.fstype}`"
                      ></v-list-item>
                    </v-list>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </template>
        </v-data-iterator>
      </v-card-text>
    </v-card>
  </v-sheet>
</template>

<style scoped lang="scss"></style>
