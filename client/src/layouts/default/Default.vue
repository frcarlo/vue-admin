<template>
  <v-app class="bg-grey-darken-2">
    <default-bar></default-bar>
    <default-view></default-view>
  </v-app>
</template>

<script setup>
import DefaultBar from "./AppBar.vue";
import DefaultView from "./View.vue";
import Login from "@/views/Login.vue";

const isLoggedIn = false;
</script>
