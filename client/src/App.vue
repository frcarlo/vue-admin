<template>
  <div>
    <v-snackbar
      v-model="showSnack"
      multi-line
      :timeout="2000"
      location="top right"
      color="info"
    >
      {{ socket.state.value.message }}

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
import { watch, ref } from "vue";
import { useSocket } from "@/composables/Socket";

const showSnack = ref(false);

const socket = useSocket(`${import.meta.env.BASE_URL}`, [
  {
    name: "message",
    fn: (ev) => ev.data,
  },
]);

watch(
  () => socket.state.value.message,
  (value) => {
    showSnack.value = true;
    console.log(value);
  },
);
</script>
