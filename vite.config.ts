import path from "path";
import {defineConfig} from "vite";
import react from '@vitejs/plugin-react';
import {fileURLToPath} from "url";
import injectCssToJs from "vite-plugin-css-injected-by-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({command}) => ({
    build: {
        sourcemap: true,
        lib: {
            entry: path.resolve(__dirname, 'lib/index.ts'),
            name: 'MarkedInput',
            formats: ['es', 'umd'],
            fileName: 'index'
        },
        rollupOptions: {
            external: ['react'],
            output: {
                globals: {
                    react: 'React'
                }
            }
        }
    },
    plugins: [react(), command !== "serve" && injectCssToJs()],
    test: {
        globals: true,
        environment: 'jsdom',
    },
}))