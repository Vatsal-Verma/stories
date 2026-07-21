import fs from 'node:fs';
import path from 'node:path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Sitemap from 'vite-plugin-sitemap';

const storyDir = path.resolve('src/user-story');

const dynamicRoutes = fs
  .readdirSync(storyDir, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => `/user-story/${entry.name}/`);

export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://stories.jenkins.io',
      dynamicRoutes,
      readable: true,

      priority: {
        '/': 1.0,
        '*': 0.8,
      },

      changefreq: {
        '/': 'daily',
        '*': 'weekly',
      },
    }),
  ],
});
