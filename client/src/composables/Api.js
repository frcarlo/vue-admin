import { useAppStore } from "@/store/app";
import { ref, toValue, computed } from "vue";
import api from "@/api/index";

export function useApi() {
  const app = useAppStore();
  const data = ref(null);
  const response = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const post = async (url, payload) => {
    error.value = null;
    loading.value = true;

    //const base_url = app.base_url.href;
    //console.log("execute: ", `${app.base_url.href}/${toValue(url)}`);
    try {
      const result = await api.post(
        `${app.base_url.href}${toValue(url)}`,
        payload,
        {
          headers: {
            Authorization: `JWT ${app.token}`,
          },
        },
      );
      response.value = result;
      data.value = result.data;
    } catch (error) {
      error.value = error;
    } finally {
      loading.value = false;
    }
  };

  return { data, error, loading, response, post };
}
