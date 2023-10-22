// Composables
import { createRouter, createWebHistory } from "vue-router";
import api from "@/api/index.js";
import { useAppStore } from "@/store/app";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/Default.vue"),
    children: [
      {
        path: "",
        name: "Home",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/Home.vue"),
      },
      {
        path: "/login",
        name: "Login",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/Login.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  const appStore = useAppStore();

  try {
    if (to.path !== "/login") {
      await api.post(
        "/profile",
        {},
        {
          headers: {
            Authorization: `JWT ${appStore.token}`,
          },
        },
      );
    }
  } catch (error) {
    s;
    if (error.response?.status == 401) return { name: "Login" };
  }
  // if (!canAccess) return "/login";
});

export default router;
