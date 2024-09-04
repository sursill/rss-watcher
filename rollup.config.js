import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export default {
  input: 'src/index.mjs',
  output: {
    exports: 'named',
    format: 'es',
    file: 'dist/index.mjs',
    sourcemap: true
  },
  plugins: [
    commonjs(),
    nodeResolve(),
    terser()
  ]
}
