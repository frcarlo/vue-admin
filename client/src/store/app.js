// Utilities
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useStorage } from "@vueuse/core";
import { useRouter } from "vue-router";
import { useApi } from "@/composables/Api";

export const useAppStore = defineStore("app", () => {
  const router = useRouter();
  const token = useStorage("user.token", null);
  const socket_id = ref(null);

  const { data, error, loading, post, response } = useApi();
  const logout = () => {
    token.value = null;
    router.push({ name: "Login" });
  };

  const base_url = ref(new URL(import.meta.env.VITE_API_BASE_URL));

  const connected = computed(() => !!socket_id.value);
  const socketState = (socket = null) => {
    if (!socket) {
      console.log("Reset socket ");
      socket_id.value = null;
    } else {
      socket_id.value = socket.id;
    }
  };

  const osPower = (action) => {
    post(`${import.meta.env.VITE_API_URL}/power`, {
      action,
    });
  };
  const signedIn = computed(() => {
    return !!token.value;
  });

  return {
    osPower,
    logout,
    token,
    signedIn,
    socketState,
    socket_id,
    connected,
    base_url,
  };
});
