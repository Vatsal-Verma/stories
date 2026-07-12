import fs from 'node:fs';
import path from 'node:path';

const STORIES_DIR = path.resolve('src/user-story');
const OUTPUT_FILE = path.resolve('src/generated-routes.mjs');
const routes = [];

const folders = fs
  .readdirSync(STORIES_DIR, { withFileTypes: true })
  .filter(entry => entry.isDirectory());

for (const folder of folders) {
  const yaml = path.join(STORIES_DIR, folder.name, 'index.yaml');

  if (fs.existsSync(yaml)) {
    routes.push(`/user-story/${folder.name}`);
  }
}

const content = `export default ${JSON.stringify(routes, null, 2)};\n`;
fs.writeFileSync(OUTPUT_FILE, content);
console.log(`✅ Generated ${routes.length} routes.`);
