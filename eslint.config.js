const js = require('@eslint/js');
const ts = require('typescript-eslint');
const prettier = require('eslint-plugin-prettier/recommended');
const jsdoc = require('eslint-plugin-jsdoc');
const globals = require('globals');
const vue = require('eslint-plugin-vue');

// Common rule sets that can be reused across configurations
const commonJsRules = {
    'sort-imports': 'error',
};

const commonTsRules = {
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

// Limit TypeScript configs to TypeScript files only
const tsConfigs = ts.configs.recommended.map((config) =>
    !config.files ? { ...config, files: ['**/*.ts'] } : config,
);

module.exports = [
    // Files to exclude from linting
    {
        ignores: ['**/dist/**', '**/node_modules/**'],
    },

    // Common globals for all files
    {
        languageOptions: {
            ecmaVersion: 2021,
            globals: {
                ...globals.commonjs,
            },
        },
    },

    // Add Node.js globals for configuration files
    {
        files: ['**/*', '!**/src/**'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },

    // Base configurations
    js.configs.recommended,
    ...tsConfigs,
    jsdoc.configs['flat/recommended'],
    jsdoc.configs['flat/recommended-typescript'],
    ...vue.configs['flat/recommended'],
    prettier, // Must come after Vue configs to avoid formatting conflicts

    // JavaScript-specific configuration
    {
        files: ['**/*.js'],
        rules: {
            ...commonJsRules,
        },
    },

    // TypeScript-specific configuration
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
            ...commonJsRules,
            ...commonTsRules,
        },
    },

    // Frontend-specific configuration
    {
        files: ['packages/frontend/**/*.{ts,vue}'],
        plugins: {
            '@typescript-eslint': ts.plugin,
        },
        languageOptions: {
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
            // Vue/Quasar specific rules
            'generator-star-spacing': 'off',
            'arrow-parens': 'off',
            'one-var': 'off',
            'no-void': 'off',
            'multiline-ternary': 'off',
            'prefer-promise-reject-errors': 'off',
            quotes: ['warn', 'single', { avoidEscape: true }],
            '@typescript-eslint/explicit-function-return-type': 'off',
            'no-unused-vars': 'off',
            'no-debugger':
                process.env.NODE_ENV === 'production' ? 'error' : 'off',
            'vue/html-indent': 'off',

            // Inherit common rules
            ...commonJsRules,
            ...commonTsRules,

            // Vue-specific formatting
            'vue/attributes-order': ['error', { alphabetical: true }],
            'vue/component-name-in-template-casing': ['error', 'kebab-case'],
        },
    },

    // Backend-specific configuration (NestJS)
    {
        files: ['packages/backend/**/*.ts'],
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
            // NestJS recommended rules
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
];
