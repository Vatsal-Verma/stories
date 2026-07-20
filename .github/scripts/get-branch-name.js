import fs from 'node:fs';
import process from 'node:process';

const event = JSON.parse(
  fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'),
);

const raw = JSON.parse(
  fs.readFileSync('.story-submission/parsed.json', 'utf8'),
);

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const slug = slugify(raw.story_title);

console.log(`story/${slug}-issue-${event.issue.number}`);
