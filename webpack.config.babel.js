import { HotModuleReplacementPlugin, LoaderOptionsPlugin } from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

const defaultEnv = {
  dev: true,
  production: false,
};

export default (env = defaultEnv) => ({
  entry: [
    ...env.dev ? [
        'webpack-dev-server/client?http://0.0.0.0:8080',
      ] : [],
    `${__dirname}/src/main.js`,
  ],
  output: {
    path: `${__dirname}/build`,
    filename: 'bundle.js',
  },
  plugins: [
    ...env.dev ? [
        new HotModuleReplacementPlugin(),
      ] : [
        new ExtractTextPlugin('style.css'),
      ],
  ],
  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        // include: `${__dirname}/src`,
        use: [
          {
            loader: 'babel-loader',
          }
        ]
      },
      {
        test: /.scss$/,
        use: env.dev ? [
            'style-loader',
            // Using source maps breaks urls in the CSS loader
            // https://github.com/webpack/css-loader/issues/232
            // This comment solves it, but breaks testing from a local network
            // https://github.com/webpack/css-loader/issues/232#issuecomment-240449998
            // 'css-loader?sourceMap',
            'css-loader?importLoaders=1&modules&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
            'postcss-loader',
            'sass-loader',
          ] : ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader!sass-loader',
          }),
      },
    ]
  },
  devtool: env.dev ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
})