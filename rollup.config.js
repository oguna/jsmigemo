import pluginTypescript from "@rollup/plugin-typescript"
import dts from "rollup-plugin-dts"
import { terser } from 'rollup-plugin-terser'

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                name: 'jsmigemo',
                file: 'dist/jsmigemo.mjs',
                format: 'esm',
                sourcemap: true,
            },
            {
                name: 'jsmigemo',
                file: 'dist/jsmigemo.min.mjs',
                format: 'esm',
                sourcemap: true,
                plugins: [
                    terser()
                ]
            },
            {
                name: 'jsmigemo',
                file: 'dist/jsmigemo.cjs',
                format: 'cjs',
                sourcemap: true,
            },
            {
                name: 'jsmigemo',
                file: 'dist/jsmigemo.min.cjs',
                format: 'cjs',
                sourcemap: true,
                plugins: [
                    terser()
                ]
            },
            {
                name: 'jsmigemo',
                file: 'dist/jsmigemo.js',
                format: 'iife',
                sourcemap: true,
            },
            {
                name: 'jsmigemo',
                file: 'dist/jsmigemo.min.js',
                format: 'iife',
                sourcemap: true,
                plugins: [
                    terser()
                ]
            },
        ],
        plugins: [
            pluginTypescript({
                declaration: false,
                outDir: undefined,
                sourceMap: true,
            }),
        ]
    },
    {
        input: 'lib/index.d.ts',
        output: [
            {
                file: 'dist/jsmigemo.d.ts',
                format: 'es',
            },
        ],
        plugins: [
            dts(),
        ]
    },
]