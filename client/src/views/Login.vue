<template>
  <v-main class="bg-grey-darken-1">
    <div class="d-flex justify-center mt-16">
      <v-snackbar v-model="snackbar" multi-line>
        {{ text }}

        <template v-slot:actions>
          <v-btn color="red" variant="text" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
      <v-sheet theme="dark" rounded="lg">
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
                >Submit</v-btn
              >
            </v-card-actions>
          </v-form>
        </v-card>
      </v-sheet>
    </div>
  </v-main>
</template>

<script setup>
import { useRouter } from "vue-router";
import api from "../api/index";
import { ref } from "vue";
import router from "@/router";
const route = useRouter();
const showSnack = ref(false);
const formValid = ref(false);
const username = ref(null);
const password = ref(null);

const formRules = [
  (value) => (value && value.length > 0 ? true : "You must enter a value."),
];
const submit = async (e) => {
  console.log(e);
  try {
    const { data } = await api.post(
      "/auth/sign_in",
      { email: username.value, password: password.value },
      {
        headers: {},
      }
    );
    console.log(data.status);
    if (data?.status) {
      router.push("/");
    }
  } catch (e) {
    console.log(e.message);
  }
};
</script>

<style lang="scss" scoped></style>
