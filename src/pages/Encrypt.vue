<template>
	<div class="container">
		<h1>Shifrlash</h1>
		<input type="file" @change="handleFileChange" accept="application/pdf, .txt, .jpg" />
		<div v-if="fileName">
			<p>Tanlangan fayl: {{ fileName }}</p>
		</div>
		<button @click="encryptFile">Shifrlash</button>
	</div>
</template>

<script>
	import CryptoJS from "crypto-js";

	export default {
		data() {
			return {
				file: null,
				fileName: "",
			};
		},
		methods: {
			handleFileChange(event) {
				const file = event.target.files[0];
				if (file) {
					this.fileName = file.name;
					this.file = file;
				}
			},
			encryptFile() {
				if (this.file) {
					const reader = new FileReader();
					reader.onload = () => {
						const fileData = reader.result;
						const key = "secret-key";
						const encryptedData = CryptoJS.AES.encrypt(fileData, key).toString();

						console.log("Shifrlangan ma'lumot:", encryptedData);
						this.downloadEncryptedFile(encryptedData);
					};
					reader.readAsText(this.file);
				} else {
					alert("Iltimos, fayl tanlang");
				}
			},
			downloadEncryptedFile(encryptedData) {
				const blob = new Blob([encryptedData], { type: "application/octet-stream" });
				const link = document.createElement("a");
				link.href = URL.createObjectURL(blob);
				link.download = "encryptedFile.txt";
				link.click();
			},
		},
	};
</script>

<style scoped>
	.container {
		padding: 20px;
	}
	button {
		margin-top: 10px;
		padding: 10px;
	}
</style>
