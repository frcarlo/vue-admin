<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col>
          <v-sheet min-height="70vh" rounded="lg">
            <div class="d-flex justify-center">
              <router-view v-slot="{ Component, route }">
                <!-- Use any custom transition and  to `fade` -->
                <transition
                  :name="route.meta.transition || 'fade'"
                  mode="out-in"
                >
                  <component :is="Component" />
                </transition>
              </router-view>
            </div>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup>
//
import Default from "@/layouts/default/Default.vue";
</script>
