let { terser } = require('rollup-plugin-terser');

module.exports = [
  // node
  {
    input: 'src/eventbus.js',
    output: {
      file: 'dist/eventbus.cjs.js',
      format: 'cjs',
    }
  },
  {
    input: 'src/model/NamedEvent.js',
    output: {
      file: 'dist/model/NamedEvent.cjs.js',
      format: 'cjs',
    }
  },
  // browser esm
  {
    input: 'src/eventbus.js',
    output: {
      file: 'dist/eventbus.esm.js',
      format: 'esm'
    }
  },
  {
    input: 'src/model/NamedEvent.js',
    output: {
      file: 'dist/model/NamedEvent.esm.js',
      format: 'esm',
    }
  },
  // browser esm minified
  {
    input: 'src/eventbus.js',
    output: {
      file: 'dist/eventbus.esm.min.js',
      format: 'esm',
      sourcemap: true
    },
    plugins: [terser({sourcemap: true})]
  },
  {
    input: 'src/model/NamedEvent.js',
    output: {
        file: 'dist/model/NamedEvent.esm.min.js',
      format: 'esm',
      sourcemap: true
    },
    plugins: [terser({sourcemap: true})]
  }
];
