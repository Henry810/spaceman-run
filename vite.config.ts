import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { resolve } from 'node:path';

export default defineConfig(({ mode }) => {
  const share = mode === 'share';
  const emptyFont = resolve('scripts/empty-font.css');

  return {
    base: './',
    resolve: share
      ? {
          alias: [
            {
              find: '@fontsource/fusion-pixel-12px-proportional-sc/400.css',
              replacement: emptyFont,
            },
            {
              find: '@fontsource/fusion-pixel-12px-proportional-sc',
              replacement: emptyFont,
            },
          ],
        }
      : undefined,
    plugins: [
      share
        ? {
            name: 'share-skip-font',
            enforce: 'pre' as const,
            resolveId(id: string) {
              if (id.includes('fusion-pixel') || id.includes('@fontsource/fusion')) {
                return emptyFont;
              }
            },
          }
        : null,
      viteSingleFile({ removeViteModuleLoader: true }),
    ].filter(Boolean),
    build: {
      target: 'es2015',
      assetsInlineLimit: share ? 4096 : 3_000_000,
      cssCodeSplit: false,
      chunkSizeWarningLimit: 5000,
    },
  };
});
