<template>
	<div class="app-container">
		<router-view v-slot="{ Component }">
			<transition name="fade" mode="out-in">
				<component :is="Component" />
			</transition>
		</router-view>
	</div>
</template>

<script>
	export default {
		name: "App",
		created() {
			const token = localStorage.getItem("user-token");
			if (!token && this.$route.name !== "Login") {
				this.$router.push({ name: "Login" });
			}
		},
	};
</script>

<style>
	:root {
		--text-color: #333;
		--error-color: #ff4444;
	}

	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	body {
		font-family: "Fira Code", monospace;
		background-color: var(--background-color);
		line-height: 1.6;
	}
</style>
