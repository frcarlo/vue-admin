<template>
  <div class="text-center">
    <v-menu v-model="menu" :close-on-content-click="false" location="bottom">
      <template v-slot:activator="{ props }">
        <v-btn color="primary" v-bind="props" icon="mdi-power"></v-btn>
      </template>

      <v-card min-width="250">
        <v-list>
          <v-list-item prepend-icon="mdi-reload" title="Reboot"></v-list-item>
          <v-list-item prepend-icon="mdi-stop" title="Shutdown"></v-list-item>

          <v-divider></v-divider>
        </v-list>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn variant="text" @click="menu = false"> Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script setup>
import { ref } from "vue";

const menu = ref(false);
</script>
