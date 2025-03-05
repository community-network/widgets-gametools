// shared config (dev and prod)
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const Dotenv = require('dotenv-webpack');
const {
  defineReactCompilerLoaderOption,
  reactCompilerLoader,
} = require("react-compiler-webpack");

module.exports = {
  entry: "./index.tsx",
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  context: resolve(__dirname, "../../src"),
  module: {
    rules: [
      {
        test: /\.[mc]?[jt]sx?$/i,
        exclude: /node_modules/,
        use: [
          // babel-loader, swc-loader, esbuild-loader, or anything you like to transpile JSX should go here.
          // If you are using rspack, the rspack's buiilt-in react transformation is sufficient.
          { loader: "swc-loader" },
          // Now add forgetti-loader
          {
            loader: reactCompilerLoader,
            options: defineReactCompilerLoaderOption({
              // React Compiler options goes here
            }),
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(svg)$/,
        loader: "file-loader",
        options: {
          name: "assets/[name].[ext]",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html.ejs",
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "public" }],
    }),
    new Dotenv({
      defaults: true,
      systemvars: true,
    }),
  ],
};
