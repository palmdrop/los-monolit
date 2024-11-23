import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import dotenv from 'dotenv';
import https from 'https';

const CHANNEL_SLUG = 'vibin-in-the-office-aedificium';
const BASE_DIRECTORY = './src/content';
const OUTPUT_DIRECTORY = `${BASE_DIRECTORY}/images`;

dotenv.config({ path: './.env.local' });

const downloadImage = (url, filename) =>
  new Promise((resolve, reject) => {
    const file = createWriteStream(filename);
    https
      .get(url, response => {
        response.pipe(file);

        file.on('finish', () => {
          file.close();
          console.log(`Image "${filename} downloaded...`);
          resolve();
        });
      })
      .on('error', error => {
        console.error(`Error downloading image "${filename}": ${error}`);
        fs.unlink(filename, unlinkError => {
          if (!unlinkError) return;
          console.log(`Error deleting image: ${unlinkError}`);
        });

        reject(error);
      });
  });

const processImageBlock = async imageBlock => {
  const extension = imageBlock.image.filename.includes('.')
    ? imageBlock.image.filename.split('.').at(-1)
    : 'jpg';
  const imageUrl = imageBlock.image.display.url;
  const imageName = `${imageBlock.id}.${extension}`;
  const imagePath = `${OUTPUT_DIRECTORY}/${imageName}`;

  await downloadImage(imageUrl, imagePath);
};

const processBlock = async (block, published) => {
  const description = block.description ?? '';
  if (description.includes('published: false')) return undefined;

  switch (block.class) {
    case 'Image':
      return processImageBlock(block, published);
    case 'Text':
    default:
      return undefined;
  }
};

export const downloadChannel = async (
  channel,
  pageSize = 100,
  accessToken = process.env.ARENA_ACCESS_TOKEN
) => {
  console.log(`Done fetching channel "${channel}"`);

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`
  };

  try {
    const thumbResponse = await fetch(
      `https://api.are.na/v2/channels/${channel}/thumb`,
      {
        method: 'GET',
        headers
      }
    );

    const thumbJson = await thumbResponse.json();

    const length = thumbJson.length;
    const numberOfPages = Math.ceil(length / pageSize);

    const fetchPage = async pageNumber => {
      console.log(`Fetching page ${pageNumber}...`);

      const response = await fetch(
        `https://api.are.na/v2/channels/${channel}/contents?page=${pageNumber}&per=${pageSize}`,
        {
          method: 'GET',
          headers
        }
      );

      return response.json();
    };

    const pages = await Promise.all(
      [...Array(numberOfPages).keys()].map(fetchPage)
    );

    console.log(`Done fetching channel "${channel}"`);
    return pages;
  } catch (error) {
    console.error(error);
  }
};

const clearDestination = async () => {
  await Promise.all(
    (await fs.readdir(OUTPUT_DIRECTORY)).map(file =>
      fs.unlink(`${OUTPUT_DIRECTORY}/${file}`)
    )
  );
};

console.log('Downloading Images...');

downloadChannel(CHANNEL_SLUG)
  .then(async pages => {
    const blocks = pages.flatMap(page => page.contents);

    console.log('Processing blocks...');

    await fs.mkdir(OUTPUT_DIRECTORY, { recursive: true });
    await clearDestination();
    await Promise.all(blocks.map(block => processBlock(block, false)));

    console.log('Done processing blocks!');
  })
  .catch(error => console.error(`Error: ${error}`));
