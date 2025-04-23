<template>
	<div class="container">
		<h1>Deshifrlash</h1>
		<input type="file" @change="handleFileChange" accept="application/octet-stream, .txt" />
		<div v-if="fileName">
			<p>Tanlangan fayl: {{ fileName }}</p>
		</div>
		<button @click="decryptFile">Deshifrlash</button>
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
			decryptFile() {
				if (this.file) {
					const reader = new FileReader();
					reader.onload = () => {
						const fileData = reader.result;
						const key = "secret-key";
						const bytes = CryptoJS.AES.decrypt(fileData, key);
						const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

						console.log("Deshifrlangan ma'lumot:", decryptedData);
						this.downloadDecryptedFile(decryptedData);
					};
					reader.readAsText(this.file);
				} else {
					alert("Iltimos, fayl tanlang");
				}
			},
			downloadDecryptedFile(decryptedData) {
				const blob = new Blob([decryptedData], { type: "text/plain" });
				const link = document.createElement("a");
				link.href = URL.createObjectURL(blob);
				link.download = "decryptedFile.txt";
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
