const js = require('@eslint/js');
const ts = require('typescript-eslint');
const prettier = require('eslint-plugin-prettier/recommended');
const jsdoc = require('eslint-plugin-jsdoc');
const globals = require('globals');
const vue = require('eslint-plugin-vue');

const customJsRules = {
    'sort-imports': 'error',
};
const customTsRules = {
    '@typescript-eslint/consistent-type-imports': [
        'error',
        {
            prefer: 'type-imports',
            fixStyle: 'separate-type-imports',
        },
    ],
    '@typescript-eslint/no-unused-vars': [
        'off',
        {
            args: 'all',
            argsIgnorePattern: '^_',
            caughtErrors: 'all',
            caughtErrorsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            ignoreRestSiblings: true,
        },
    ],
};

// Only apply ts configs to TypeScript files.
const tsConfigs = ts.configs.recommended.map((config) =>
    !config.files ? { ...config, files: ['**/*.ts'] } : config,
);

/**
 * Exports the ESLint configuration.
 */
module.exports = [
    {
        ignores: ['**/dist/**', '**/node_modules/**'],
    },
    // Globals
    {
        languageOptions: {
            ecmaVersion: 2021,
            globals: {
                ...globals.commonjs,
            },
        },
    },
    // Add node globals to files not in src folders, these are always ran in Node context.
    // Mainly needed for processing config files.
    {
        files: ['**/*', '!**/src/**'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
    js.configs.recommended,
    ...tsConfigs,
    jsdoc.configs['flat/recommended'],
    jsdoc.configs['flat/recommended-typescript'],
    ...vue.configs['flat/recommended'],
    // Prettier comes after Vue to ensure it doesn't conflict with Vue's formatting rules.
    prettier,
    // Custom JS config.
    {
        files: ['**/*.js'],
        rules: {
            ...customJsRules,
        },
    },
    // Custom TS config.
    {
        files: ['**/*.ts'],
        plugins: {
            '@typescript-eslint': ts.plugin,
        },
        languageOptions: {
            parser: ts.parser,
            parserOptions: {
                project: true,
            },
        },
        rules: {
            ...customJsRules,
            ...customTsRules,
        },
    },
    // frontend specific config.
    {
        files: ['packages/frontend/**/*.{ts,vue}'],
        plugins: {
            '@typescript-eslint': ts.plugin,
        },
        languageOptions: {
            //parser: ts.parser,
            parserOptions: {
                parser: ts.parser,
                project: true,
                extraFileExtensions: ['.vue'],
                sourceType: 'module',
            },
            globals: {
                ...globals.browser,
                ...globals.es2021,
                ...globals.node,
                ga: 'readonly', // Google Analytics
                cordova: 'readonly',
                __statics: 'readonly',
                __QUASAR_SSR__: 'readonly',
                __QUASAR_SSR_SERVER__: 'readonly',
                __QUASAR_SSR_CLIENT__: 'readonly',
                __QUASAR_SSR_PWA__: 'readonly',
                process: 'readonly',
                Capacitor: 'readonly',
                chrome: 'readonly',
            },
        },
        rules: {
            // allow async-await
            'generator-star-spacing': 'off',
            // allow paren-less arrow functions
            'arrow-parens': 'off',
            'one-var': 'off',
            'no-void': 'off',
            'multiline-ternary': 'off',

            // Disable import rules since they don't work with flat config.
            //'import/first': 'off',
            //'import/namespace': 'error',
            //'import/default': 'error',
            //'import/export': 'error',
            //'import/extensions': 'off',
            //'import/no-unresolved': 'off',
            //'import/no-extraneous-dependencies': 'off',
            // The core 'import/named' rules
            // does not work with type definitions
            //'import/named': 'off',

            'prefer-promise-reject-errors': 'off',

            quotes: ['warn', 'single', { avoidEscape: true }],

            // this rule, if on, would require explicit return type on the `render` function
            '@typescript-eslint/explicit-function-return-type': 'off',

            // in plain CommonJS modules, you can't use `import foo = require('foo')` to pass this rule, so it has to be disabled
            // Disable rule since these rules don't apply to CJS files.
            //'@typescript-eslint/no-var-requires': 'off',

            // The core 'no-unused-vars' rules (in the eslint:recommended ruleset)
            // does not work with type definitions
            'no-unused-vars': 'off',

            // allow debugger during development only
            'no-debugger':
                process.env.NODE_ENV === 'production' ? 'error' : 'off',

            'vue/html-indent': 'off',

            ...customJsRules,
            ...customTsRules,

            'vue/attributes-order': ['error', { alphabetical: true }],
            'vue/component-name-in-template-casing': ['error', 'kebab-case'],
        },
    },
    // backend specific config.
    {
        files: ['packages/backend/**/*.{ts}'],
        plugins: {
            '@typescript-eslint': ts.plugin,
        },
        languageOptions: {
            parser: ts.parser,
            parserOptions: {
                project: true,
                tsconfigRootDir: __dirname,
                sourceType: 'module',
            },
            globals: {
                ...globals.node,
                ...globals.jest,
            },
        },
        rules: {
            // Default NestJS rules.
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
];
