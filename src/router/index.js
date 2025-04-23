// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated } from "@/utils/auth";

const routes = [
	{
		path: "/login",
		name: "Login",
		component: () => import("@/components/Login.vue"),
		meta: { requiresAuth: false },
	},
	{
		path: "/",
		name: "Home",
		component: () => import("@/components/Home.vue"),
		meta: { requiresAuth: true },
	},
	{
		path: "/404/",
		name: "Error",
		component: () => import("@/components/error.vue"),
		meta: { requiresAuth: false },
	},
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

router.beforeEach((to, from, next) => {
	const isAuth = isAuthenticated();

	if (to.meta.requiresAuth && !isAuth) {
		next({ name: "Login" });
	} else if (to.name === "Login" && isAuth) {
		next({ name: "Home" });
	} else {
		next();
	}
});

export default router;
