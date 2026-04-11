export function imageToDataUrl(file, maxDimension = 800, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      if (width > height) {
        if (width > maxDimension) {
          height = Math.round(height * (maxDimension / width));
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width = Math.round(width * (maxDimension / height));
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      resolve(dataUrl);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}
