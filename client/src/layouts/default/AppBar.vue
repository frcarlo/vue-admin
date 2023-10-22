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
          v-for="link in links"
          :key="link"
          :text="link"
          variant="text"
        ></v-btn>
      </template>

      <v-spacer></v-spacer>

      <v-responsive max-width="160">
        <v-btn v-if="appStore.signedIn" @click="logout()">Logout</v-btn>
      </v-responsive>
    </v-container>
  </v-app-bar>
</template>

<script setup>
import { useAppStore } from "@/store/app";

const appStore = useAppStore();

const props = defineProps({
  links: {
    type: Array,
    default: () => ["Home", "Backup"],
  },
});

const logout = () => {
  appStore.logout();
};
</script>
