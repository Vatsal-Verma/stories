import fs from 'node:fs';
import path from 'node:path';
import { Buffer } from 'node:buffer';

function extractImageUrl(value) {
  if (!value || typeof value !== 'string') return null;

  let match = value.match(/src="([^"]+)"/i);
  if (match) return match[1];

  match = value.match(/!\[.*?\]\((.*?)\)/);
  if (match) return match[1];

  match = value.match(
    /https:\/\/github\.com\/user-attachments\/assets\/[^\s")]+/,
  );
  if (match) return match[0];

  return null;
}

function extensionFromContentType(contentType) {
  if (!contentType) return null;

  const type = contentType.split(';')[0].trim().toLowerCase();

  switch (type) {
    case 'image/png':
      return 'png';
    case 'image/jpeg':
      return 'jpg';
    case 'image/webp':
      return 'webp';
    case 'image/svg+xml':
      return 'svg';
    case 'image/gif':
      return 'gif';
    case 'image/avif':
      return 'avif';
    default:
      return null;
  }
}

async function downloadImage(markdown, outputDir, outputName) {
  const url = extractImageUrl(markdown);

  if (!url) {
    console.log(`No ${outputName} image found.`);
    return null;
  }

  console.log(`Downloading ${outputName} image...`);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to download ${outputName}: ${response.status} ${response.statusText}`,
    );
  }

  const ext = extensionFromContentType(response.headers.get('content-type'));

  if (!ext) {
    throw new Error(
      `Unsupported image type: ${response.headers.get('content-type')}`,
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  const filename = `${outputName}.${ext}`;

  fs.writeFileSync(path.join(outputDir, filename), buffer);

  console.log(`Saved ${filename}`);

  return filename;
}

export async function downloadImages(raw, storyDir) {
  const images = {};

  images.story = await downloadImage(raw.story_image, storyDir, 'story');

  images.quote = await downloadImage(raw.quote_image, storyDir, 'quote');

  return images;
}
