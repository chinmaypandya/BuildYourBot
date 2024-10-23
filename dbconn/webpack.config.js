const path = require('path');

module.exports = {
  entry: './src/app.ts', // Your main TypeScript file
  output: {
    filename: 'bundle.js', // Output bundle name
    path: path.resolve(__dirname, 'build'), // Output directory
  },
  devtool: 'source-map', // Enable source maps for better error tracing
  module: {
    rules: [
      {
        test: /\.ts$/, // Match .ts files (no .tsx needed since no React)
        use: {
          loader: 'swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript', // Parse TypeScript
                tsx: false, // No React, so no need for TSX support
              },
              target: 'es2020', // Target ECMAScript version
              loose: false,
            },
            minify: true,
          },
        },
        exclude: /node_modules/, // Exclude node_modules from processing
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'], // Resolve these file extensions
  },
  target: 'node', // Specify the target environment as Node.js
};