<template>
  <v-app-bar flat theme="dark">
    <v-container class="mx-auto d-flex align-center justify-center">
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

      <v-responsive max-width="160">
        <v-btn
          :variant="!mobile ? 'tonal' : 'plain'"
          v-if="appStore.signedIn"
          @click="logout()"
        >
          <v-icon v-if="mobile">mdi-logout</v-icon>
          <span v-else>LOGOUT</span>
        </v-btn>
        <v-icon v-if="!appStore.connected" color="yellow">mdi-alert</v-icon>
      </v-responsive>
    </v-container>
  </v-app-bar>
</template>

<script setup>
import { computed } from "vue";
import { useAppStore } from "@/store/app";
import { useDisplay } from "vuetify";

const appStore = useAppStore();
const { mobile } = useDisplay();

const props = defineProps({
  links: {
    type: Array,
    default: () => [
      { text: "Home", to: "/" },
      { text: "Backup", to: "/backup" },
    ],
  },
});

const logout = () => {
  appStore.logout();
};
</script>
