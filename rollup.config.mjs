/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
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

            // Allow bundling cjs modules. Rollup doesn't understand cjs
            commonjs(),

            // Compile TypeScript/JavaScript files
            babel({
                extensions,
                include: [
                    'src/**/*'
                ],
                presets: [
                    '@babel/preset-env',
                    '@babel/preset-typescript',
                ]
            }),
            terser(),
        ],
        output: [
            {
                file: pkg.main,
                format: 'cjs'
            }, {
                file: pkg.module,
                format: 'esm'
            }
        ]
    }
];
