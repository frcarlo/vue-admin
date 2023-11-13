import { useAppStore } from "@/store/app";
import { ref } from "vue";
import { io } from "socket.io-client";

export function useSocket(url, listeners = []) {
  const states = { connected: false, id: null };
  const appStore = useAppStore();
  listeners.forEach((l) => (states[l.name] = ""));
  const state = ref(states);
  console.log("Connect to socket: " + appStore.base_url);
  const socket = io(appStore.base_url, {
    path: appStore.url_path + "/socket.io",
  });

  console.log("socket ...", socket);
  // Change connected state
  socket.on("connect", () => {
    console.log("Connected to socket ...");
    state.value.connected = true;
    state.value.id = socket.id;
    appStore.socketState(socket);
  });
  socket.on("connect_error", (error) => {
    console.log(error);
  });
  socket.on("error", () => {
    console.log("Ups ...");
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
