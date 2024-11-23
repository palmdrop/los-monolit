import fs from 'fs/promises';

const CHANNEL_SLUG = 'stupid-office-words';
const OUTPUT_DIRECTORY = './src/content';
const OUTPUT_FILE = 'words.ts';

const downloadChannel = async (channel, pageSize = 100) => {
  console.log(`Done fetching channel "${channel}"`);

  const headers = {
    'Content-Type': 'application/json'
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

downloadChannel(CHANNEL_SLUG)
  .then(async pages => {
    const blocks = pages.flatMap(page => page.contents);

    console.log('Processing blocks...');

    await fs.mkdir(OUTPUT_DIRECTORY, { recursive: true });

    const words = blocks
      .filter(block => block.class === 'Text')
      .map(block => (block.content ?? '').trim().toLowerCase())
      .filter(Boolean);

    const data = `
export const words = ${JSON.stringify(words, null, 2)} as const; 
    `;

    await fs.writeFile(`${OUTPUT_DIRECTORY}/${OUTPUT_FILE}`, data);

    console.log('Done processing blocks!');
  })
  .catch(error => console.error(`Error: ${error}`));
