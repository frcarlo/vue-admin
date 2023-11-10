<template>
  <div>
    <v-snackbar
      v-model="showSnack"
      multi-line
      location="top right"
      color="warning"
    >
      {{ message }}

      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="showSnack = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-sheet theme="dark" rounded="lg" class="mt-16">
      <v-card variant="tonal" min-width="300">
        <v-card-title>Login</v-card-title>
        <v-form
          @submit.prevent="submit"
          v-model="formValid"
          validate-on="lazy input blur"
        >
          <v-card-text>
            <v-text-field
              variant="outlined"
              :rules="formRules"
              v-model="username"
              :flat="true"
              label="Username"
              :clearable="true"
            ></v-text-field>
            <v-text-field
              :flat="true"
              v-model="password"
              :rules="formRules"
              :clearable="true"
              type="password"
              label="Password"
              variant="outlined"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              type="submit"
              variant="tonal"
              :disabled="!formValid"
              >Submit
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-sheet>
  </div>
</template>

<script setup>
import { useAuth } from "@/composables/Auth";
import { ref, computed } from "vue";

const formValid = ref(false);
const username = ref(null);
const password = ref(null);

const formRules = [
  (value) => (value && value.length > 0 ? true : "You must enter a value."),
];

const { error: loginError, loginUser } = useAuth();

const showSnack = computed({
  set() {
    loginError.value = null;
  },
  get() {
    return !!loginError.value;
  },
});

const message = computed(() => {
  return loginError.value ? loginError.value.message : null;
});

const submit = async (e) => {
  loginUser({ email: username.value, password: password.value });
};
</script>

<style lang="scss" scoped></style>
