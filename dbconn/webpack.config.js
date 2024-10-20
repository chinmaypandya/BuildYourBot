const path = require('path');

module.exports = {
  entry: './src/app.ts', // Your main TypeScript file
  output: {
    filename: 'bundle.js', // Output bundle name
    path: path.resolve(__dirname, 'build'), // Output directory
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Match .ts and .tsx files
        use: 'ts-loader', // Use ts-loader for these files
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'], // Resolve these file extensions
  },
  target: 'node', // Specify the target environment
};