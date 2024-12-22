import fs from 'fs/promises';

const POEMS_DIRECTORY = './src/content/poems';

const parsePoems = async () => {
  console.log('Parsing poems...');
  const files = await fs.readdir(POEMS_DIRECTORY);

  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    const content = await fs.readFile(`${POEMS_DIRECTORY}/${file}`, 'utf-8');
    const [title, ...paragraphs] = content
      .split('\n')
      .filter(line => !!line.trim().length);

    console.log(`Parsing "${title}"...`);

    const lines = paragraphs
      .flatMap(paragraph => paragraph.split(/ {2}|\?/))
      .map(line => line.trim())
      .filter(Boolean);

    const data = `
export const ${title} = {
  title: '${title}',
  lines: ${JSON.stringify(lines, null, 2)}
};
    `;

    await fs.writeFile(`${POEMS_DIRECTORY}/${title}.ts`, data);

    console.log(`"${title}" parsed!`);
  }

  console.log('Done parsing poems!');
};

parsePoems();
