<template>
  <div class="text-center">
    <v-menu v-model="menu" :close-on-content-click="true" location="bottom">
      <template v-slot:activator="{ props }">
        <v-btn color="primary" v-bind="props" icon="mdi-power"></v-btn>
      </template>

      <v-card min-width="250" rounded="lg ">
        <v-list density="compact">
          <v-list-item
            prepend-icon="mdi-logout"
            title="Logout"
            @click="action('logout')"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-reload"
            title="Reboot"
            @click="action('reboot')"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-stop"
            title="Shutdown"
            @click="action('shutdown')"
          ></v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["power"]);

const action = (action) => {
  emit("power", action);
};
const menu = ref(false);
</script>
