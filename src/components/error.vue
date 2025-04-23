<template>
	<div class="error-page">
		<h1>404 - Page Not Found</h1>
		<p>The page you are looking for does not exist.</p>
		<router-link to="/">Go back to Home</router-link>
	</div>
</template>

<script>
	export default {
		name: "ErrorPage",
	};
</script>

<style scoped>
	.error-page {
		text-align: center;
		margin-top: 50px;
	}
	.error-page h1 {
		font-size: 2.5rem;
		color: #ff6b6b;
	}
	.error-page p {
		font-size: 1.2rem;
		margin: 20px 0;
	}
</style>
