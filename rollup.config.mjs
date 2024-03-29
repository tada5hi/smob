import resolve from '@rollup/plugin-node-resolve';
import { transform } from "@swc/core";
import pkg from './package.json' assert {type: 'json'};

const extensions = [
    '.js', '.jsx', '.ts', '.tsx',
];

export default [
    {
        input: './src/index.ts',

        // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
        // https://rollupjs.org/guide/en/#external
        external: [],

        plugins: [
            // Allows node_modules resolution
            resolve({ extensions}),

            // Compile TypeScript/JavaScript files
            {
                name: 'swc',
                transform(code) {
                    return transform(code, {
                        jsc: {
                            target: 'es2016',
                            parser: {
                                syntax: 'typescript'
                            },
                            loose: true
                        },
                        sourceMaps: true
                    });
                }
            }
        ],
        output: [
            {
                file: pkg.main,
                format: 'cjs',
                sourcemap: true
            }, {
                file: pkg.module,
                format: 'esm',
                sourcemap: true
            }
        ]
    }
];
