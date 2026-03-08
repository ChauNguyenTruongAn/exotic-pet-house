import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

import path from 'path';

//cấu hình mode cho khi build khác môi trường
export default ({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return defineConfig({
        plugins: [react()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
        },
        server: {
            port: Number(env.VITE_APP_PORT) || 5173,
        },
    });
};
