// Utilities
import { defineStore } from "pinia";
import { computed } from "vue";
import { useStorage } from "@vueuse/core";
import { useRouter } from "vue-router";

export const useAppStore = defineStore("app", () => {
  const router = useRouter();
  const token = useStorage("user.token", null);

  const logout = () => {
    token.value = null;
    router.push("/login");
  };

  const signedIn = computed(() => {
    return token.value ? true : false;
  });

  return { logout, token, signedIn };
});
