// import { HotModuleReplacementPlugin } from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const defaultEnv = {
  dev: true,
  production: false,
};

console.log(`${__dirname}/../src/`)

export default (env = defaultEnv) => ({
  entry: [
    ...env.dev ? [
        // 'react-hot-loader',
        'webpack-dev-server/client?http://0.0.0.0:8080',
      ] : [],
    `${__dirname}/../src/main.js`,
  ],
  output: {
    path: `${__dirname}/../build`,
    filename: 'bundle.js',
  },
  plugins: [
    ...env.dev ? [
        // new HotModuleReplacementPlugin(),
      ] : [
        new ExtractTextPlugin('[name].css'),
      ],
  ],
  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        // include: `${__dirname}/../src`,
        use: [
          {
            loader: 'babel-loader',
          }
        ]
      },
      {
        test: /\.(css|scss|sass)$/,
        loader: env.dev ? 'style!css!sass' : ExtractTextPlugin.extract({
            fallbackLoader: 'style',
            loader: 'css!sass'
          })
      },
    ]
  },
});