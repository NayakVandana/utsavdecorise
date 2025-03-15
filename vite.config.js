import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',  // CSS entry point
                'resources/js/main.jsx'    // React entry point
            ],
            refresh: true,
        }),
    ],
    esbuild: {
        jsxFactory: 'React.createElement', // Manually specify JSX factory
        jsxFragment: 'React.Fragment',     // Manually specify JSX fragment
    },
});