let inputElement = document.getElementById("imageUploaded");
let inputFormatType = document.getElementById("formatType");

inputElement.addEventListener("input", function (event) {
	inputFormatType = inputFormatType.value;
    if (inputFormatType === undefined || inputFormatType === null){
        inputFormatType = 'png'
    }
        
	getBlobForImageAndDownload(this, inputFormatType);
});

async function getBlobForImageAndDownload(targetElement, extension) {
	const fileInput = targetElement.files[0];
	const imageUrl = URL.createObjectURL(fileInput);

	let mimeType = `image/${extension}`;

	draw(imageUrl, mimeType)
		.then((imageBlob) => {
			const downloadImage = document.createElement("button");
			downloadImage.textContent = "Download the image!";

			let main = document.getElementById("main-content");
			main.appendChild(downloadImage);

			downloadImage.onclick = () => {
				saveImage(imageBlob, `download.${extension}`);

				main.removeChild(downloadImage);
			};
		})
		.catch((error) => {
			console.error("Error:", error);
		});
}

function draw(imageUrl, mimeType) {
	return new Promise((resolve, reject) => {
		const canvas = document.createElement("canvas");
		if (canvas.getContext) {
			const ctx = canvas.getContext("2d");

			const image = new Image();
			image.src = imageUrl;

			image.onload = () => {
				canvas.width = image.width;
				canvas.height = image.height;

				ctx.drawImage(image, 0, 0, image.width, image.height);

				canvas.toBlob((blob) => {
					resolve(blob);
				}, mimeType);
			};

			image.onerror = (error) => {
				reject(error);
			};
		} else {
			reject(new Error("Canvas is not supported"));
		}
	});
}

async function saveImage(imageData, filename = "download.png") {
	const options = {
		suggestedName: filename,
	};

	try {
		const newHandle = await showSaveFilePicker(options);

		const writableStream = await newHandle.createWritable();

		await writableStream.write(imageData);

		await writableStream.close();

	} catch (error) {
        console.error("Error", error);
    }
}
