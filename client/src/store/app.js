// Utilities
import { defineStore } from "pinia";
import { computed, ref, reactive, toRaw, watch } from "vue";
import { useStorage } from "@vueuse/core";
import { useRouter } from "vue-router";
import { useApi } from "@/composables/Api";
import _ from "lodash";
import Backup from "@/composables/Backup";
import { en } from "vuetify/locale";

export const useAppStore = defineStore("app", () => {
  const router = useRouter();
  const token = useStorage("user.token", null);
  const socket_id = ref(null);

  const { post: postPower } = useApi();
  const { post: backupApi, data: backupHistoryRawData } = useApi();

  const logout = () => {
    token.value = null;
    router.push({ name: "Login" });
  };

  let backupRuns = reactive([]);

  const getLastBackupRun = (uuid) => {
    if (backupRuns.length > 0) {
      return backupRuns.find((bck) => bck.deviceId === uuid);
    }
  };

  watch(backupHistoryRawData, (hist) => {
    let data = _.get(hist, "result", []);
    if (data.length > 0) {
      try {
        //backupRuns = reactive([]);
        data.map((entry) => {
          const backup = new Proxy(new Backup(entry), {
            get(target, property) {
              if (
                typeof property === "string" &&
                _.has(target, `_${property}`)
              ) {
                return target[`_${property}`];
              } else {
                return target[property];
              }
            },
          });

          const found = backupRuns.findIndex(
            (bck) => bck.deviceId === backup.deviceId,
          );
          if (found >= 0) {
            backupRuns[found] = backup;
          } else {
            backupRuns.push(backup);
          }
        });
      } catch (e) {
        console.error(e);
      }
    }
  });

  const backupStatusColor = computed(() => {
    let color;
    switch (backup_run.status) {
      case "done":
        color = "teal";
        break;
      case "error":
        color = "error";
        break;
      case "done_with_warnings":
        color = "orange-darken-3";
        break;
      case "running":
        color = "light-blue-darken-3";
        break;
    }
    return color;
  });

  let backup_run;

  const initBackupRun = () => {
    backup_run = reactive({
      file_count: 0,
      current_messages: [],
      warnings: [],
      total_size: 0,
      error_messages: [],
      successful: true,
      status: null,
      progress: 0,
      updated: null,
      created: null,
      active: false,
      device: null,
      id: null,
    });
  };

  const resetBackupRun = () => {
    _.keys(backup_run).map((key) => {
      if (_.isArray(backup_run[key])) {
        backup_run[key] = [];
      } else if (_.isNumber(backup_run[key])) {
        backup_run[key] = 0;
      } else if (_.isBoolean(backup_run[key])) {
        backup_run[key] = false;
      } else {
        backup_run[key] = null;
      }
    });
  };
  const setBackupRunErrorMessage = (messages) => {
    backup_run.error_messages = messages;
  };
  const setBackupRunMessage = (...messages) => {
    let raw = toRaw(messages);
    if (_.isArray(raw[0])) raw = raw[0];
    backup_run.current_messages = raw;
  };

  const getBackupRunMessage = () => {
    return backup_run.error_messages.length > 0
      ? backup_run.error_messages
      : backup_run.current_messages;
  };
  const backupRunId = computed(() => {
    return _.get(backup_run, "id");
  });

  const backupRunDeviceId = computed(() => {
    return _.get(backup_run, "device");
  });
  const backup_has_error = computed(() => {
    return 1;
  });
  const base_url = ref(new URL(import.meta.env.VITE_API_BASE_URL));

  const backup_folders = ref(
    import.meta.env.VITE_BACKUP_FOLDERS.split(",").map((x) => x.trim()),
  );

  const connected = computed(() => !!socket_id.value);
  const socketState = (socket = null) => {
    if (!socket) {
      console.log("Reset socket ");
      socket_id.value = null;
    } else {
      socket_id.value = socket.id;
    }
  };

  const fetchBackupHistory = async (devices = []) => {
    backupApi(`${import.meta.env.VITE_API_URL}/backup-history`, {
      devices,
    });
  };

  const osPower = async (action) => {
    return await postPower(`${import.meta.env.VITE_API_URL}/power`, {
      action,
    });
  };

  const getBackupRunByDevice = (device) => {
    return backupRuns.find((bck) => bck.deviceId == device);
  };

  const signedIn = computed(() => {
    return !!token.value;
  });
  initBackupRun();
  return {
    backupRuns,
    getBackupRunByDevice,

    resetBackupRun,

    fetchBackupHistory,
    backupStatusColor,
    backupRunDeviceId,
    backupRunId,
    getBackupRunMessage,
    setBackupRunErrorMessage,
    setBackupRunMessage,
    osPower,
    backup_has_error,
    backup_run,
    logout,
    backup_folders,
    token,
    signedIn,
    socketState,
    socket_id,
    connected,
    base_url,
  };
});
