<template>
	<div class="login-wrapper">
		<div class="login-card">
			<h2 class="login-title">🔐 Kirish</h2>

			<div class="form-group">
				<label for="username">Login</label>
				<input
					id="username"
					v-model="username"
					maxlength="8"
					@keydown.enter.prevent="focusNext"
					type="text"
					class="form-input"
				/>
			</div>

			<div class="form-group">
				<label for="password">Parol</label>
				<div class="password-wrapper">
					<input
						ref="passwordInput"
						id="password"
						maxlength="8"
						:type="showPassword ? 'text' : 'password'"
						v-model="password"
						@keydown.enter.prevent="handleLogin"
						class="form-input"
					/>
					<button class="toggle-btn" @click="showPassword = !showPassword" type="button">
						<svg
							v-if="showPassword"
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
							<path
								d="M2.458 12C3.732 7.943 7.524 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.066 7-9.542 7S3.732 16.057 2.458 12z"
							/>
						</svg>
						<svg
							v-else
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.973 9.973 0 012.227-3.592M9.88 9.88a3 3 0 104.24 4.24"
							/>
							<path d="M3 3l18 18" />
						</svg>
					</button>
				</div>
			</div>

			<div class="form-group remember-me">
				<input type="checkbox" id="remember" v-model="rememberMe" />
				<label for="remember">Eslab qolish</label>
			</div>

			<button :disabled="loading" @click="handleLogin" class="login-button">
				<span v-if="loading">Yuklanmoqda...</span>
				<span v-else>Kirish</span>
			</button>

			<p v-if="error" class="error-text">{{ error }}</p>
		</div>
	</div>
</template>

<script setup>
	import { ref, onMounted } from "vue";
	import { useRouter } from "vue-router";
	import { checkCredentials } from "@/utils/auth.js";

	const username = ref("");
	const password = ref("");
	const showPassword = ref(false);
	const error = ref("");
	const loading = ref(false);
	const rememberMe = ref(false);
	const router = useRouter();
	const passwordInput = ref(null);

	onMounted(() => {
		const saved = localStorage.getItem("savedUsername");
		if (saved) username.value = saved;
	});

	const focusNext = () => {
		passwordInput.value?.focus();
	};

	const handleLogin = () => {
		error.value = "";
		loading.value = true;

		setTimeout(() => {
			if (checkCredentials(username.value, password.value)) {
				localStorage.setItem("auth", "true");
				if (rememberMe.value) {
					localStorage.setItem("savedUsername", username.value);
				} else {
					localStorage.removeItem("savedUsername");
				}
				router.push("/");
			} else {
				error.value = "Login yoki parol noto‘g‘ri";
			}
			loading.value = false;
		}, 800);
	};
</script>

<style scoped>
	.login-wrapper {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
	}

	.login-card {
		width: 100%;
		max-width: 400px;
		background-color: white;
		border-radius: 20px;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
		padding: 30px;
		box-sizing: border-box;
	}

	.form-input {
		width: 100%;
		padding: 12px 16px;
		font-size: 16px;
		color: #1e293b;
		background-color: #f8fafc;
		border: 2px solid #e5e7eb;
		outline: none;
		border-radius: 8px;
		transition: all 0.2s ease;
	}

	.form-input:focus {
		border-color: #02457a;
		box-shadow: 0 0 0 3px rgba(2, 69, 122, 0.1);
	}

	.login-title {
		font-size: 28px;
		font-weight: 700;
		text-align: center;
		margin-bottom: 30px;
		color: #02457a;
	}

	.form-group label {
		display: block;
		font-size: 14px;
		margin: 10px;
		font-weight: 600;
		color: #475569;
	}

	.login-button {
		width: 100%;
		background: linear-gradient(to right, #02457a, #018abe);
		color: white;
		font-weight: 600;
		padding: 14px;
		font-size: 16px;
		border: none;
		border-radius: 10px;
		cursor: pointer;
		transition: all 0.3s ease;
		margin-top: 20px;
	}

	.login-button:hover {
		background: linear-gradient(to right, #018abe, #02457a);
		transform: translateY(-1px);
	}

	.login-button:disabled {
		background: #94a3b8;
		transform: none;
	}

	/* Remember me */
	.remember-me {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 16px;
		margin: 16px 0;
		color: #475569;
	}

	.remember-me input[type="checkbox"] {
		width: 16px;
		height: 16px;
		accent-color: #02457a;
	}

	/* Error */
	.error-text {
		margin-top: 16px;
		color: #f71d1d;
		text-align: center;
		font-size: 14px;
		font-weight: 500;
	}
	.password-wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}

	.password-wrapper .form-input {
		padding-right: 40px;
	}

	.toggle-btn {
		position: absolute;
		right: 10px;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		cursor: pointer;
		color: #64748b;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
