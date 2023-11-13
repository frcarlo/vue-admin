import { useAppStore } from "@/store/app";
import { ref, toValue } from "vue";
import api from "@/api/index";
import { useRouter } from "vue-router";

export function useAuth() {
  const appStore = useAppStore();
  const router = useRouter();
  const data = ref(null);
  const error = ref(null);

  const logOutUser = (payload) => {
    // reset state before fetching..
    data.value = null;
    error.value = null;
    // toValue() unwraps potential refs or getters

    api
      .post(import.meta.env.VITE_LOGOUT_URL, payload)
      .then((response) => {
        if (response.data?.token) {
          appStore.token = null;
          data.value = response.data;
          router.push({ name: "Login" });
        }
      })
      .catch((err) => (error.value = err));
  };

  const loginUser = (payload) => {
    // reset state before fetching..
    data.value = null;
    error.value = null;
    // toValue() unwraps potential refs or getters

    api
      .post(toValue(import.meta.env.VITE_LOGIN_URL), payload, {
        headers: {},
      })
      .then((response) => {
        if (response.data?.token) {
          appStore.token = response.data.token;
          data.value = response.data;
          router.push({ name: "Home" });
        }
      })
      .catch((err) => (error.value = err));
  };

  return { data, error, loginUser, logOutUser };
}
