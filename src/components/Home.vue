<template>
	<div class="container">
		<!-- Breadcrumbs -->
		<nav class="breadcrumbs">
			<router-link to="/">🏠 Bosh sahifa</router-link>
		</nav>

		<h1 class="title">🔐 Fayl Shifrlash / Deshifrlash</h1>
		<p class="subtitle">Jarayonni boshlashdan oldin fayl tanlang</p>

		<!-- File input -->
		<div class="file-upload">
			<input type="file" id="file" @change="handleFileChange" style="display: none" />
			<label for="file" class="upload-button"> 📁 Fayl tanlang </label>
		</div>

		<!-- File and algorithm selection -->
		<div v-if="fileName" class="file-info" style="color: black">
			<span class="file-icon">{{ getFileIcon(fileName) }}</span>
			<span>{{ fileName }}</span>
			<button class="remove-btn" @click="clearFile">❌</button>
		</div>

		<!-- Select algorithm -->
		<div v-if="file" class="algorithm-select">
			<label for="algorithm">Shifrlash algoritmi:</label>
			<select id="algorithm" v-model="selectedAlgorithm">
				<option value="aes">AES</option>
				<option value="rsa" disabled>RSA</option>
				<option value="des" disabled>DES</option>
			</select>
		</div>

		<!-- Status -->
		<div v-if="status" class="status">
			<p><strong>Status:</strong> {{ status.message }}</p>
			<p><strong>Fayl hajmi:</strong> {{ status.fileSize }} MB</p>
			<p><strong>Shifrlash vaqti:</strong> {{ status.encryptionTime }} soniya</p>
		</div>

		<!-- Progress bar -->
		<div v-if="loading" class="progress">
			<div class="progress-bar"></div>
		</div>

		<!-- Action buttons -->
		<div class="button-group">
			<button @click="encryptFile" class="action-button" :disabled="!file">🔒 Shifrlash</button>
			<button @click="decryptFile" class="action-button" :disabled="!file">🔓 Deshifrlash</button>
		</div>

		<!-- Download button -->
		<div v-if="downloadLink" class="download-button">
			<button @click="downloadFile" class="action-button">📥 Yuklab olish</button>
		</div>
	</div>
</template>

<!--  -->
<!--  -->
<!--  -->

<script>
	import CryptoJS from "crypto-js";
	import { toast } from "vue3-toastify";
	import "vue3-toastify/dist/index.css";

	export default {
		name: "Home",
		data() {
			return {
				file: null,
				fileName: "",
				loading: false,
				selectedAlgorithm: "aes",
				algorithms: ["aes", "rsa", "des"],
				encryptedFile: null,
				status: null,
				downloadFile: null,
				downloadLink: null, // Добавляем это свойство
				secretKey: "your-secret-key-here",
				fileType: "",
			};
		},
		methods: {
			hhandleFileChange(event) {
				const file = event.target.files[0];
				const maxSize = 100; // Максимальный размер в МБ

				if (file) {
					const fileSizeMB = file.size / (1024 * 1024);

					if (fileSizeMB > maxSize) {
						toast.error(`⚠️ Fayl hajmi ${maxSize}MB dan katta bo'lmasligi kerak`);
						return;
					}

					this.file = file;
					this.fileName = file.name;
					this.fileType = file.type;
					this.status = null;
					toast.success("✅ Fayl tanlandi");
				}
			},
			clearFile() {
				this.file = null;
				this.fileName = "";
				this.status = null;
				this.fileType = ""; // Fayl turini tozalash
				toast.info("❌ Fayl bekor qilindi");
			},
			async encryptFile() {
				if (!this.file) {
					toast.warning("⚠️ Iltimos, fayl tanlang");
					return;
				}

				try {
					this.showLoading();
					const startTime = Date.now();
					const fileSizeMB = (this.file.size / (1024 * 1024)).toFixed(2);

					const { content, fileType } = await this.readFileContent(this.file);
					const encryptedContent = await this.encrypt(content);

					const encryptionTime = ((Date.now() - startTime) / 1000).toFixed(2);

					this.updateStatus("encrypted", fileSizeMB, encryptionTime);
					this.createDownloadableFile(encryptedContent);

					toast.success("🔒 Fayl muvaffaqiyatli shifrlandi!");
				} catch (error) {
					toast.error("Shifrlashda xatolik yuz berdi!");
					console.error(error);
				} finally {
					this.hideLoading();
				}
			},
			async decryptFile() {
				if (!this.file) {
					toast.warning("⚠️ Iltimos, fayl tanlang");
					return;
				}

				try {
					this.showLoading();
					const startTime = Date.now();
					const fileSizeMB = (this.file.size / (1024 * 1024)).toFixed(2);

					const { content, fileType } = await this.readFileContent(this.file);
					const decryptedContent = await this.decrypt(content);

					const decryptionTime = ((Date.now() - startTime) / 1000).toFixed(2);

					this.updateStatus("decrypted", fileSizeMB, decryptionTime);
					this.createDownloadableFile(decryptedContent);

					toast.success("🔓 Fayl muvaffaqiyatli deshifrlandi!");
				} catch (error) {
					toast.error("Deshifrlashda xatolik yuz berdi!");
					console.error(error);
				} finally {
					this.hideLoading();
				}
			},
			readFileContent(file) {
				return new Promise((resolve, reject) => {
					const reader = new FileReader();

					reader.onload = () => {
						// Проверяем, является ли файл зашифрованным (JSON)
						if (file.type === "application/json" || file.name.startsWith("encrypted_")) {
							resolve({
								content: reader.result, // Читаем как текст для JSON
								fileType: file.type,
								fileName: file.name,
							});
						} else {
							// Для обычных файлов читаем как ArrayBuffer
							const content = new Uint8Array(reader.result);
							resolve({
								content,
								fileType: file.type,
								fileName: file.name,
							});
						}
					};

					reader.onerror = () => reject(new Error("Faylni o'qishda xatolik!"));

					// Выбираем метод чтения в зависимости от типа файла
					if (file.type === "application/json" || file.name.startsWith("encrypted_")) {
						reader.readAsText(file);
					} else {
						reader.readAsArrayBuffer(file);
					}
				});
			},
			encrypt(content) {
				try {
					// Конвертируем Uint8Array в base64
					const base64String = btoa(String.fromCharCode.apply(null, content));
					// Шифруем base64 строку
					const encrypted = CryptoJS.AES.encrypt(base64String, this.secretKey);

					return JSON.stringify({
						content: encrypted.toString(),
						fileType: this.fileType,
						fileName: this.fileName,
					});
				} catch (error) {
					console.error("Ошибка шифрования:", error);
					throw new Error("Shifrlashda xatolik yuz berdi!");
				}
			},
			decrypt(content) {
				try {
					let parsedData;

					// Пробуем распарсить JSON
					try {
						parsedData = JSON.parse(content);
					} catch (error) {
						throw new Error("Fayl noto'g'ri formatda: JSON emas");
					}

					if (!parsedData.content || !parsedData.fileType || !parsedData.fileName) {
						throw new Error("Fayl tarkibida zarur ma'lumotlar yo'q");
					}

					// Расшифровываем контент
					const decrypted = CryptoJS.AES.decrypt(parsedData.content, this.secretKey);
					const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

					if (!decryptedString) {
						throw new Error("Deshifrlash kaliti noto'g'ri");
					}

					// Конвертируем base64 обратно в Uint8Array
					const binaryString = atob(decryptedString);
					const array = new Uint8Array(binaryString.length);
					for (let i = 0; i < binaryString.length; i++) {
						array[i] = binaryString.charCodeAt(i);
					}

					return {
						content: array,
						fileType: parsedData.fileType,
						fileName: parsedData.fileName,
					};
				} catch (error) {
					console.error("Расшифровка ошибка:", error);
					throw new Error("Deshifrlashda xatolik! " + error.message);
				}
			},
			createDownloadableFile(content) {
				let blob;
				let fileName;

				if (typeof content === "string") {
					// Для зашифрованного файла
					blob = new Blob([content], { type: "application/json" });
					fileName = `encrypted_${this.fileName}`;
				} else {
					// Для расшифрованного файла
					blob = new Blob([content.content], { type: content.fileType });
					fileName = `decrypted_${content.fileName.replace("encrypted_", "")}`;
				}

				if (this.downloadLink) {
					URL.revokeObjectURL(this.downloadLink);
				}

				this.downloadLink = URL.createObjectURL(blob);
				const link = document.createElement("a");
				link.href = this.downloadLink;
				link.download = fileName;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			},
			updateStatus(operation, fileSize, operationTime) {
				this.status = {
					message: `Fayl ${this.selectedAlgorithm.toUpperCase()} algoritmi bilan ${
						operation === "encrypted" ? "shifrlandi" : "deshifrlandi"
					}.`,
					fileSize,
					encryptionTime: operationTime,
				};
			},
			showLoading() {
				this.loading = true;
			},
			hideLoading() {
				this.loading = false;
			},
			getFileIcon(filename) {
				const ext = filename.split(".").pop().toLowerCase();
				switch (ext) {
					case "doc":
					case "docx":
						return "📄 Word";
					case "xls":
					case "xlsx":
						return "📊 Excel";
					case "pdf":
						return "📕 PDF";
					default:
						return "📁 Fayl";
				}
			},
		},
	};
</script>

<!--  -->
<!--  -->
<!--  -->

<style scoped>
	@import url("https://fonts.googleapis.com/css2?family=Fira+Code:wght@500&display=swap");

	.container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		/* justify-content: center; */
		align-items: center;
		background-color: #f8fafc;
		padding: 40px 20px;
		font-family: "Fira Code", monospace;
		text-align: center;
	}

	.breadcrumbs {
		width: 100%;
		max-width: 600px;
		margin-bottom: 20px;
		text-align: left;
		font-size: 14px;
		color: #475569;
	}
	.breadcrumbs a {
		color: #02457a;
		text-decoration: none;
		font-weight: 500;
	}

	.title {
		font-size: 28px;
		font-weight: bold;
		color: #02457a;
		margin-bottom: 10px;
		text-transform: capitalize;
	}
	.subtitle {
		font-size: 16px;
		color: #475569;
		margin-bottom: 30px;
	}

	.file-upload {
		margin-bottom: 20px;
	}
	.file-upload label {
		font-weight: 600;
		color: #475569;
		margin-right: 10px;
	}
	.file-upload input[type="file"] {
		margin-top: 10px;
	}

	.file-name {
		margin-top: 8px;
		color: #1e293b;
		font-size: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
	}
	.remove-btn {
		background: transparent;
		border: none;
		cursor: pointer;
		color: #dc2626;
		font-size: 16px;
	}

	.button-group {
		display: flex;
		flex-direction: column;
		gap: 15px;
		width: 100%;
		max-width: 300px;
		margin-top: 20px;
	}

	.action-button {
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
	}
	.action-button:hover {
		background: linear-gradient(to right, #018abe, #02457a);
		transform: translateY(-1px);
	}
	.action-button:disabled {
		background: linear-gradient(to right, #02457a, #018abe);
		cursor: not-allowed;
		transform: none;
	}
	.file-name {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		color: #1e293b;
		font-size: 14px;
		background: #f1f5f9;
		padding: 8px 12px;
		border-radius: 8px;
	}
	.file-icon {
		font-weight: bold;
	}

	.upload-button {
		display: inline-block;
		padding: 12px 24px;
		color: white;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.3s ease;
		font-weight: 500;
		margin-bottom: 20px;
		transition: 0.3s ease;
		cursor: pointer;
	}

	.upload-button:hover {
		box-shadow: 0 5px 10px black;
	}
	.algorithm-select {
		margin-top: 20px;
		text-align: left;
	}

	.algorithm-select select {
		padding: 8px;
		font-size: 16px;
		border-radius: 8px;
		border: 1px solid #ccc;
		width: 100%;
		max-width: 300px;
	}

	.status {
		margin-top: 20px;
		font-size: 16px;
		color: #333;
		background: #f1f5f9;
		padding: 10px;
		border-radius: 8px;
	}

	.download-button {
		margin-top: 20px;
	}

	.download-button a {
		text-decoration: none;
	}

	.download-button button {
		width: 100%;
		background: #018abe;
		color: white;
		font-weight: 600;
		padding: 12px;
		font-size: 16px;
		border: none;
		border-radius: 10px;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.download-button button:hover {
		background: #02457a;
	}

	/* Loading progress */
	.progress {
		width: 100%;
		max-width: 300px;
		background: #e2e8f0;
		height: 8px;
		border-radius: 10px;
		overflow: hidden;
		margin-top: 10px;
	}
	.progress-bar {
		width: 100%;
		height: 100%;
		background: linear-gradient(to right, #02457a, #018abe);
		animation: loading 2s infinite;
	}
	@keyframes loading {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}

	@media (max-width: 768px) {
		.container {
			padding: 20px 10px;
		}
		.title {
			font-size: 24px;
		}
		.subtitle {
			font-size: 14px;
		}
		.file-upload {
			margin-bottom: 15px;
		}
		.file-upload label {
			font-size: 14px;
		}
		.algorithm-select {
			width: 100%;
			max-width: 250px;
			margin-top: 15px;
		}
		.action-button {
			font-size: 14px;
			padding: 12px;
		}
		.button-group {
			width: 100%;
		}
		.upload-button {
			width: 100%;
		}
		.progress-bar {
			background: linear-gradient(to right, #018abe, #02457a);
		}
	}

	@media (max-width: 480px) {
		.title {
			font-size: 20px;
		}
		.subtitle {
			font-size: 12px;
		}
		.file-upload label {
			font-size: 12px;
		}
		.algorithm-select select {
			padding: 6px;
			font-size: 14px;
		}
		.action-button {
			font-size: 12px;
			padding: 10px;
		}
		.upload-button {
			padding: 10px 20px;
		}
		.status {
			font-size: 14px;
			padding: 8px;
		}
		.download-button button {
			font-size: 14px;
			padding: 10px;
		}
	}
</style>
