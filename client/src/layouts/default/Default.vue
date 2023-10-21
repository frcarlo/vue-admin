<template>
  <v-app>
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
