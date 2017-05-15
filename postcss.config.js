const autoPrefixer = require('autoprefixer')

module.exports = {
  plugins: [
    autoPrefixer({
      browsers: [
        'last 2 version',
        'ie >= 10',
      ],
    }),
  ],
}
