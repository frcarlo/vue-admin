import { useAppStore } from "@/store/app";
import { ref } from "vue";
import { io } from "socket.io-client";

export function useSocket(url, listeners = []) {
  const states = { connected: false, id: null };
  const appStore = useAppStore();
  listeners.forEach((l) => (states[l.name] = ""));
  console.log(states);
  const state = ref(states);
  const socket = io(url);

  // Change connected state
  socket.on("connect", (x) => {
    state.value.connected = true;
    state.value.id = socket.id;
    appStore.socketState(socket);
  });
  socket.on("error", () => {
    state.value.connected = false;
    appStore.socketState();
  });
  socket.on("disconnect", () => {
    console.log("Ups ....");
    state.value.connected = false;
    appStore.socketState();
  });

  listeners.forEach((listener) => {
    socket.on(
      listener.name,
      (data) => (state.value[listener.name] = listener.fn(data)),
    );
  });

  return { state, socket };
}
