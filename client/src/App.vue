<template>
  <div>
    <v-snackbar
      v-model="showSnack"
      multi-line
      :timeout="2000"
      location="top right"
      color="info"
    >
      {{ message }}

      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="showSnack = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <router-view />
  </div>
</template>

<script setup>
import _ from "lodash";
import { watch, ref } from "vue";
import { useSocket } from "@/composables/Socket";
import { useAppStore } from "@/store/app";
import * as dayjs from "dayjs";

const app = useAppStore();
const showSnack = ref(false);
const message = ref(null);
useSocket(`${import.meta.env.BASE_URL}`, [
  {
    name: "trigger",
    fn: (ev, opts) => {
      console.log(ev, opts);
      if (app[ev] === "function") {
        app[ev](opts);
      }
    },
  },
  {
    name: "message",
    fn: (ev, opts) => {
      console.log(ev, opts);
      message.value = ev;
      showSnack.value = true;
    },
  },
  {
    name: "backup",
    fn: (ev, opts) => {
      console.log(ev, opts);

      const { type = "data", message, error = false, id, backup = {} } = opts;

      if (
        ![
          "data",
          "end",
          "ping",
          "current_file",
          "error",
          "total_size",
          "progress",
        ].includes(type)
      )
        return;

      const {
        device = {},
        updated,
        created,
        error_message = [],
        size_formatted = "",
        status,
        warning_messages = [],
      } = backup;

      let backup_run = {
        device: _.get(device, "uuid"),
        active: status === "running" ? true : false,
        created,
        updated,
        status,
        warnings: warning_messages,
        total_size: size_formatted,
        id: id,
      };

      if (!error) backup_run.error_messages = [];

      switch (type) {
        case "error":
          app.setBackupRunErrorMessage(error_message);
          backup_run.successful = false;
          backup_run.progress = 100;
          break;
        case "current_file":
          app.setBackupRunMessage(message);
          break;
        case "progress":
          backup_run.progress = message;
          break;
        case "end":
          if (!error && status === "done") {
            app.setBackupRunMessage(
              "Successfully Synced.",
              "Total file size: " + app.backup_run.total_size,
              "Last time executed: " +
                dayjs(app.backup_run.updated).format("dddd, D. MMMM YYYY"),
            );
            backup_run.successful = true;
          } else if (status === "done_with_warnings") {
            app.setBackupRunMessage(
              "Synced with warnings.",
              "Total file size: " + app.backup_run.total_size,
              "Last time executed: " +
                dayjs(app.backup_run.updated).format("dddd, D. MMMM YYYY"),
              ...warning_messages,
            );
            backup_run.successful = false;
          } else {
            app.setBackupRunMessage(app.backup_run.error_messages);
            backup_run.successful = false;
          }
          backup_run.progress = 100;
          break;
      }

      app.$patch({ backup_run });
    },
  },
]);

watch(message, () => {
  showSnack.value = true;
});
</script>
