import config from '@tada5hi/eslint-config';

export default [
    ...await config(),
    {
        rules: {
            'no-useless-escape': 'off',
            'no-nested-ternary': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'unicorn/no-for-loop': 'off',
            '@stylistic/object-curly-newline': 'off',
            '@stylistic/operator-linebreak': 'off',
        },
    },
    { ignores: ['dist/**', '**/*.d.ts'] },
];
