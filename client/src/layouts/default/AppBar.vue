<template>
  <div>
    <v-snackbar
      v-model="snackbar"
      :timeout="5000"
      location="top right"
      :color="severity"
    >
      {{ message }}
    </v-snackbar>
    <PowerDialog
      v-model="actionDialog.show"
      :title="actionDialog.title"
      @action="action"
      @cancel="cancel"
    >
      <template #default="{ run }">
        <v-row
          v-if="rebootProgress"
          class="fill-height"
          align-content="center"
          justify="center"
        >
          <v-col class="text-subtitle-1 text-center" cols="12">
            wait for the server to be back online ...
          </v-col>
          <v-col cols="6">
            <v-progress-linear
              color="deep-purple-accent-4"
              :indeterminate="true"
              rounded
              height="6"
            ></v-progress-linear>
          </v-col>
        </v-row>
      </template>
    </PowerDialog>

    <v-app-bar flat theme="dark">
      <v-container class="d-flex align-center justify-center">
        <v-avatar
          class="me-4"
          color="grey-darken-1"
          size="32"
          icon="mdi-shield-crown-outline"
        ></v-avatar>

        <template v-if="appStore.signedIn">
          <v-btn
            class="mr-4"
            v-for="link in links"
            :key="link.label"
            v-bind="link"
            variant="text"
          ></v-btn>
        </template>

        <v-spacer></v-spacer>

        <v-responsive class="text-right mr-2" max-width="160">
          <v-icon v-if="!appStore.connected" color="yellow">mdi-alert</v-icon>
        </v-responsive>
        <PowerMenu
          v-if="appStore.signedIn"
          class="mr-2"
          @power="activateActionDialog($event)"
        />
      </v-container>
    </v-app-bar>
  </div>
</template>

<script setup>
import _ from "lodash";
import { reactive, ref } from "vue";
import { useAppStore } from "@/store/app";
import PowerMenu from "@/components/PowerMenu.vue";
import PowerDialog from "@/components/PowerDialog.vue";

const severity = ref("info");
const message = ref("");
const appStore = useAppStore();
const interValId = ref(null);
const snackbar = ref(false);

let actionDialog = reactive({ title: null, show: false, action: null });
const rebootProgress = ref(false);
const props = defineProps({
  links: {
    type: Array,
    default: () => [
      { text: "Home", to: "/" },
      { text: "Backup", to: "/backup" },
    ],
  },
});

const activateActionDialog = (action) => {
  actionDialog.show = true;
  actionDialog.action = action;
  actionDialog.title = `Do you really want to ${action} ?`;
};

const action = () => {
  const action = actionDialog.action;
  switch (action) {
    case "logout":
      actionDialog.show = false;
      logout();
      break;
    case "reboot":
      power(action);
      break;
    case "shutdown":
      power(action);
      break;
  }
};

const setSnack = (message, sev = "info", show = true) => {
  snackbar.value = show;
  severity.value = sev;
  message.value = message;
};
const cancel = () => {
  if (interValId.value) clearInterval(interValId.value);
  actionDialog.show = false;
  actionDialog.action = null;
  actionDialog.title = `Ups no action ...`;
  rebootProgress.value = false;
  actionDialog.show = false;
  message.value = "";
  snackbar.value = false;
  severity.value = "warn";
};
const power = (action) => {
  //console.log("Run osPower");
  if (action === "reboot") {
    rebootProgress.value = true;
    let c = 0;
    if (interValId.value) clearInterval(interValId.value);
    interValId.value = setInterval(() => {
      c++;

      if (c > 3) {
        cancel();
        setSnack(
          "Ups ... the server is not available. Something seems to be wrong.",
          "orange",
        );
      }
      if (appStore.connected) {
        rebootProgress.value = false;
        cancel();

        setSnack("The server has rebooted successfully", "blue");
      }
    }, 30000);
  } else {
    actionDialog.show = false;
  }

  if (import.meta.env.DEV === true) {
    console.log(`skip the action ${action} as we are in dev mode`);
    return true;
  }
  appStore.osPower(action);
};
const logout = () => {
  appStore.logout();
};
</script>
