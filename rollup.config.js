let { terser } = require('rollup-plugin-terser');

module.exports = [
  {
    input: 'src/eventbus.js',
    output: {
      file: 'dist/eventbus.js',
      format: 'es',
    }
  },
  {
    input: 'src/eventbus.js',
    output: {
      file: 'dist/eventbus.min.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [terser({})]
  }
];
