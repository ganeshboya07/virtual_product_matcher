import { Product } from './supabase';

interface ColorHistogram {
  red: number[];
  green: number[];
  blue: number[];
}

export async function extractImageFeatures(imageUrl: string): Promise<ColorHistogram> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      canvas.width = 100;
      canvas.height = 100;
      ctx.drawImage(img, 0, 0, 100, 100);

      const imageData = ctx.getImageData(0, 0, 100, 100);
      const histogram = calculateColorHistogram(imageData.data);
      resolve(histogram);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
}

function calculateColorHistogram(pixelData: Uint8ClampedArray): ColorHistogram {
  const bins = 8;
  const red = new Array(bins).fill(0);
  const green = new Array(bins).fill(0);
  const blue = new Array(bins).fill(0);

  for (let i = 0; i < pixelData.length; i += 4) {
    const r = Math.floor(pixelData[i] / (256 / bins));
    const g = Math.floor(pixelData[i + 1] / (256 / bins));
    const b = Math.floor(pixelData[i + 2] / (256 / bins));

    red[r]++;
    green[g]++;
    blue[b]++;
  }

  const total = pixelData.length / 4;
  return {
    red: red.map(v => v / total),
    green: green.map(v => v / total),
    blue: blue.map(v => v / total)
  };
}

function calculateHistogramSimilarity(hist1: ColorHistogram, hist2: ColorHistogram): number {
  let similarity = 0;

  for (let i = 0; i < hist1.red.length; i++) {
    similarity += Math.min(hist1.red[i], hist2.red[i]);
    similarity += Math.min(hist1.green[i], hist2.green[i]);
    similarity += Math.min(hist1.blue[i], hist2.blue[i]);
  }

  return similarity / 3;
}

export interface ProductMatch extends Product {
  similarity: number;
}

export async function findSimilarProducts(
  uploadedImageUrl: string,
  products: Product[]
): Promise<ProductMatch[]> {
  const uploadedFeatures = await extractImageFeatures(uploadedImageUrl);

  const matches: ProductMatch[] = await Promise.all(
    products.map(async (product) => {
      try {
        const productFeatures = await extractImageFeatures(product.image_url);
        const similarity = calculateHistogramSimilarity(uploadedFeatures, productFeatures);

        return {
          ...product,
          similarity: Math.round(similarity * 100)
        };
      } catch (error) {
        console.error(`Failed to process product ${product.id}:`, error);
        return {
          ...product,
          similarity: 0
        };
      }
    })
  );

  return matches.sort((a, b) => b.similarity - a.similarity);
}
