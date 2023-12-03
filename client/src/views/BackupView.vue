<script setup>
import _ from "lodash";
import {
  computed,
  ref,
  onMounted,
  onUnmounted,
  isProxy,
  toRaw,
  watch,
} from "vue";
import { useApi } from "@/composables/Api";
import BackupDialog from "@/components/BackupDialog.vue";
import { useAppStore } from "@/store/app";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const app = useAppStore();
const showBackupDialog = ref(false);
const { post, data, error } = useApi();
const { post: postMount } = useApi();
const { post: runBackupApi } = useApi();
const refresh = 1000 * 20;
const selected = ref([]);
const showSelect = ref(true);
const selectedItem = ref(null);
let intervalId;

const backupList = [
  {
    key: "total_files",
    title: "Total number of files in backup.",
    icon: "md:note",
  },
  {
    key: "transferred_files",
    title: "Number of transferred files.",
    icon: "md:sync",
  },
  {
    key: "size_formatted",
    title: "Total backup size.",
    icon: "md:storage",
  },
  {
    key: "created_local",
    title: "Started at",
    icon: "md:calendar_month",
  },
  {
    key: "duration",
    title: "Duration",
    icon: "md:timer",
  },
];

onMounted(() => {
  getList();
  intervalId = setInterval(() => {
    getList();
  }, refresh);
});

onUnmounted(() => clearInterval(intervalId));

const toggleMount = async (item) => {
  let mount;
  console.log(hasMountPoint(item.raw));
  if (hasMountPoint(item.raw)) {
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
const hasMountPoint = (device) => {
  if (isProxy(device)) device = toRaw(device);

  return _.get(device, "mountpoint", null) !== null;
};
const runBackup = (item) => {
  selectedItem.value = item;
  showBackupDialog.value = true;
};
const devices = computed(() => {
  if (data.value) {
    return data.value.result;
  }
  return [];
});

watch(devices, (value) => {
  if (value && value.length > 0) {
    app.fetchBackupHistory(toRaw(value).map((d) => d.uuid));
  }
});

const clearView = () => {
  setTimeout(() => {
    app.resetBackupRun();
    selectedItem.value = null;
  }, 1000);
};
const startBackup = async () => {
  runBackupApi(`${import.meta.env.VITE_API_URL}/backup/`, {
    source: app.backup_folders,
    dry: false,
    socket_id: app.socket_id,
    dest: selectedItem.value.mountpoint,
    device: selectedItem.value,
  });
  //selectedItem.value = {};
};
</script>

<template>
  <v-sheet
    rounded="lg"
    class="pa-2 bg-black pa-md-4"
    width="100%"
    min-height="70vh"
    theme="dark"
  >
    <BackupDialog
      v-model="showBackupDialog"
      :drive="selectedItem"
      @start="startBackup"
      :process="app.backup_run"
      :active="app.backup_run.active"
      @close="clearView"
    >
      <v-expand-transition>
        <v-row v-if="app.backupRunDeviceId === selectedItem.uuid" class="pa-2">
          <v-col sm-cols="12">
            <v-progress-circular
              :rotate="360"
              :size="72"
              :width="10"
              class="ml-2"
              :model-value="app.backup_run.progress"
              :color="app.backupStatusColor"
            >
              {{ app.backup_run.progress }}
            </v-progress-circular>
            <v-list
              density="compact"
              class="ml-0 mt-2 pa-0"
              variant="text"
              bg-color="transparent"
            >
              <v-list-item
                class="pa-0 ma-0"
                v-for="(msg, idx) in app.getBackupRunMessage()"
                :key="idx"
              >
                <v-card-subtitle
                  :class="{
                    'font-weight-medium': true,
                    'text-caption': mobile,
                  }"
                  >{{ msg }}
                </v-card-subtitle>
              </v-list-item>
            </v-list>

            <v-progress-circular
              v-if="app.backup_run.active"
              class="ml-4"
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-col>
        </v-row>
      </v-expand-transition>
    </BackupDialog>
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

    <v-data-iterator
      v-model="selected"
      :items="devices"
      item-value="name"
      :show-select="showSelect"
      select-strategy="single"
      return-object
    >
      <template v-slot:header>
        <v-toolbar class="mb-2 px-2" rounded="lg">
          <v-toolbar-title
            :class="{
              'text-body-2': mobile,
              'font-weight-bold': mobile,
            }"
            >USB-flash drives
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="elevated"
            @click="getList()"
            icon="mdi-refresh"
          ></v-btn>
        </v-toolbar>
      </template>
      <template #no-data>
        <div class="d-flex justify-center mb-6">
          <div class="ma-2 pa-2">
            <v-icon>mdi-usb</v-icon>
            No devices to display
          </div>
        </div>
      </template>
      <template v-slot:default="{ items }">
        <v-row>
          <v-col
            v-for="item in items"
            :key="item.raw.name"
            cols="12"
            sm="12"
            md="6"
          >
            <v-card rounded="lg" variant="tonal">
              <v-card-title class="d-flex align-center bg-grey-darken-4 mb-2">
                <v-icon
                  color="green"
                  icon="mdi-usb-flash-drive"
                  start
                  size="18"
                ></v-icon>

                <h4>{{ item.raw.label || "UNKNOWN-LABEL " }}<br /></h4>
                <v-spacer></v-spacer>

                <v-btn
                  :disabled="!hasMountPoint(item.raw)"
                  @click="runBackup(item.raw)"
                  variant="plain"
                >
                  <v-icon size="32">md:folder_copy</v-icon>
                </v-btn>

                <v-btn
                  @click="toggleMount(item)"
                  :color="hasMountPoint(item.raw) ? 'warning' : 'white'"
                  variant="plain"
                >
                  <v-icon size="32"
                    >{{ hasMountPoint(item.raw) ? "mdi-eject" : "mdi-play" }}
                  </v-icon>
                </v-btn>
              </v-card-title>

              <v-divider></v-divider>

              <v-expand-transition>
                <v-row
                  v-if="app.getBackupRunByDevice(item.raw.uuid)"
                  class="pa-2"
                >
                  <v-col sm-cols="12">
                    <v-list
                      density="compact"
                      class="ml-0 mt-2 pa-0"
                      variant="text"
                      bg-color="transparent"
                      lines="two"
                    >
                      <v-list-subheader>Last Backup run</v-list-subheader>
                      <v-list-item
                        v-for="(entry, idx) in backupList"
                        :key="idx"
                        :subtitle="entry.title"
                        :title="
                          app.getBackupRunByDevice(item.raw.uuid)[entry.key]
                        "
                      >
                        <template v-slot:prepend>
                          <v-avatar>
                            <v-icon>{{ entry.icon }}</v-icon>
                          </v-avatar>
                        </template>
                      </v-list-item>
                    </v-list>
                  </v-col>
                </v-row>
              </v-expand-transition>

              <div>
                <v-list density="compact" :lines="false">
                  <v-list-item
                    :title="`Device: ${item.raw.name}`"
                  ></v-list-item>
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
  </v-sheet>
</template>

<style scoped lang="scss"></style>
