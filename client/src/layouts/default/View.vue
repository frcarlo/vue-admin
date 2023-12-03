<template>
  <v-main>
    <v-container :fluid="mobile">
      <v-row>
        <v-col cols="12">
          <v-sheet theme="dark" min-height="70vh" rounded="lg">
            <div class="d-flex justify-center">
              <Suspense>
                <router-view v-slot="{ Component, route }">
                  <!-- Use any custom transition and  to `fade` -->
                  <transition
                    :name="route.meta.transition || 'fade'"
                    mode="out-in"
                  >
                    <component :is="Component" />
                  </transition>
                </router-view>
              </Suspense>
            </div>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup>
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
</script>
