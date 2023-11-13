// Utilities
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useStorage } from "@vueuse/core";
import { useRouter } from "vue-router";

export const useAppStore = defineStore("app", () => {
  const router = useRouter();
  const token = useStorage("user.token", null);
  const socket_id = ref(null);
  const logout = () => {
    token.value = null;
    router.push({ name: "Login" });
  };

  const base_url = ref(
    import.meta.env.DEV === true
      ? import.meta.env.VITE_API_BASE_URL
      : import.meta.env.BASE_URL,
  );

  const connected = computed(() => !!socket_id.value);
  const socketState = (socket = null) => {
    if (!socket) {
      console.log("Reset socket ");
      socket_id.value = null;
    } else {
      socket_id.value = socket.id;
    }
  };
  const signedIn = computed(() => {
    return !!token.value;
  });

  return {
    logout,
    token,
    signedIn,
    socketState,
    socket_id,
    connected,
    base_url,
  };
});
