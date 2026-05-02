export const productImagesBucket =
  process.env.SUPABASE_PRODUCT_IMAGES_BUCKET ?? "product-images";

const allowedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const maxImageSizeInBytes = 5 * 1024 * 1024;

function sanitizeFileName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getFileExtension(fileName: string, mimeType: string) {
  const fromName = fileName.split(".").pop()?.toLowerCase();

  if (fromName && /^[a-z0-9]+$/.test(fromName)) {
    return fromName;
  }

  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "bin";
  }
}

export function validateProductImage(file: File) {
  if (!allowedImageTypes.has(file.type)) {
    throw new Error("Please upload a JPG, PNG, WEBP, or GIF image.");
  }

  if (file.size > maxImageSizeInBytes) {
    throw new Error("Image must be 5MB or smaller.");
  }
}

export function buildProductImagePath(file: File) {
  const extension = getFileExtension(file.name, file.type);
  const baseName = sanitizeFileName(file.name.replace(/\.[^.]+$/, "")) || "product";
  const timestamp = new Date().toISOString().slice(0, 10);
  const uniqueId = crypto.randomUUID();

  return `products/${timestamp}/${baseName}-${uniqueId}.${extension}`;
}
