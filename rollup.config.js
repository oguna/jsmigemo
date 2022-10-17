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
            },
            {
                name: 'jsmigemo',
                file: 'dist/jsmigemo.min.mjs',
                format: 'esm',
                plugins: [
                    terser()
                ]
            },
            {
                name: 'jsmigemo',
                file: 'dist/jsmigemo.cjs',
                format: 'cjs',
            },
            {
                name: 'jsmigemo',
                file: 'dist/jsmigemo.min.cjs',
                format: 'cjs',
                plugins: [
                    terser()
                ]
            },
            {
                name: 'jsmigemo',
                file: 'dist/jsmigemo.js',
                format: 'iife',
            },
            {
                name: 'jsmigemo',
                file: 'dist/jsmigemo.min.js',
                format: 'iife',
                plugins: [
                    terser()
                ]
            },
        ],
        plugins: [
            pluginTypescript({
                declaration: false,
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