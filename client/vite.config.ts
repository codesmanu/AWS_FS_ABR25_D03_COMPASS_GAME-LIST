import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
    plugins: [react()],
    build: {
        target: 'esnext',
    },
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    server: {
        port: 5000,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                ws: false,
            },
        },
    },
});
