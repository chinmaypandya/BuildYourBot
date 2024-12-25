import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
    	host: true, // Allow external connections (required for Docker and AWS ECS)
    	port: 5173, // Development port, overridden by Docker/production setup
  	},
  	build: {
    	outDir: 'build', // Output directory for the build
    	emptyOutDir: true, // Clean up previous builds
  	},
	optimizeDeps: {
    	include: ['@sveltejs/kit'], // Optimize dependencies for faster builds
  	},
});
