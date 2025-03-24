/* eslint-disable max-len */
const defaultsDeep = require('lodash.defaultsdeep');
const path = require('path');
const webpack = require('webpack');

// Plugins
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// PostCss
const autoprefixer = require('autoprefixer');
const postcssVars = require('postcss-simple-vars');
const postcssImport = require('postcss-import');

const STATIC_PATH = process.env.STATIC_PATH || '/static';
const {APP_NAME} = require('./src/lib/brand');

const root = process.env.ROOT || '';
if (root.length > 0 && !root.endsWith('/')) {
    throw new Error('If ROOT is defined, it must have a trailing slash.');
}

const htmlWebpackPluginCommon = {
    root: root,
    meta: JSON.parse(process.env.EXTRA_META || '{}'),
    APP_NAME
};

const base = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    devtool:
        process.env.SOURCEMAP ||
        (process.env.NODE_ENV === 'production' ? false : 'cheap-module-source-map'),
    devServer: {
        contentBase: path.resolve(__dirname, 'build'),
        host: '0.0.0.0',
        disableHostCheck: true,
        compress: true,
        port: process.env.PORT || 8601,
        // Simple fallback that routes everything to index.html
        historyApiFallback: {
            index: '/index.html'
        }
    },
    output: {
        library: 'GUI',
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js',
        publicPath: root
    },
    resolve: {
        symlinks: false,
        alias: {
            'text-encoding$': path.resolve(__dirname, 'src/lib/tw-text-encoder'),
            'scratch-render-fonts$': path.resolve(__dirname, 'src/lib/tw-scratch-render-fonts'),
            // Metaplex UMI aliases - using more flexible paths
            '@metaplex-foundation/umi/serializers': path.resolve(__dirname, 'node_modules/alpha-vm/node_modules/@metaplex-foundation/umi'),
            '@metaplex-foundation/umi': path.resolve(__dirname, 'node_modules/alpha-vm/node_modules/@metaplex-foundation/umi'),
            // Existing aliases
            'path': require.resolve('path-browserify'),
            'crypto': require.resolve('crypto-browserify'),
            'stream': require.resolve('stream-browserify'),
            'buffer': require.resolve('buffer'),
            'util': require.resolve('util/'),
            'assert': require.resolve('assert/')
        },
        modules: [
            'node_modules',
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, 'node_modules/alpha-vm/node_modules')
        ],
        mainFields: ['browser', 'module', 'main'],
        // Add extensions to help with module resolution
        extensions: ['.js', '.jsx', '.mjs', '.cjs', '.json']
    },
    // For webpack 4, use the "node" property for modules that have no browser equivalent.
    node: {
        fs: 'empty'
    },
    module: {
        rules: [
            // NEW RULE: Force any .mjs files in @solana modules to be parsed as CommonJS.
            {
                test: /\.mjs$/,
                include: /node_modules[\\/]@solana/,
                type: 'javascript/auto'
            },
            // Rule: Force rpc-websockets .mjs files to be parsed as CommonJS
            {
                test: /\.mjs$/,
                include: /node_modules[\\/]rpc-websockets/,
                type: 'javascript/auto'
            },
            // (No separate rule is added for @solana modules inside alpha-vm—
            // they will be handled by Babel below.)
            {
                // Process .js, .mjs, .cjs, and .jsx files
                test: /\.(mjs|cjs|jsx?)$/,
                loader: 'babel-loader',
                include: [
                    path.resolve(__dirname, 'src'),
                    // Include the linked repo's source so its modern syntax is transpiled
                    path.resolve(__dirname, '../alpha-vm/src'),
                    // NEW: Include alpha-vm's source in node_modules to transpile modern syntax
                    /node_modules[\\/]alpha-vm[\\/]src/,
                    /node_modules[\\/]scratch-[^\\/]+[\\/]src/,
                    /node_modules[\\/]pify/,
                    /node_modules[\\/]@vernier[\\/]godirect/,
                    /node_modules[\\/]@solana[\\/]web3\.js/,
                    /node_modules[\\/]@solana[\\/]spl-token/,
                    // NEW: Include @solana/codecs-core to transpile modern syntax (e.g. nullish coalescing)
                    /node_modules[\\/]@solana[\\/]codecs-core/,
                    // NEW: Include @solana/codecs-strings to transpile modern syntax
                    /node_modules[\\/]@solana[\\/]codecs-strings/,
                    // NEW: Include @solana[\\/]codecs-numbers to transpile modern syntax (e.g. optional chaining)
                    /node_modules[\\/]@solana[\\/]codecs-numbers/,
                    // NEW: Include @solana/options to transpile modern syntax (e.g. optional chaining, nullish coalescing)
                    /node_modules[\\/]@solana[\\/]options/,
                    // NEW: Include @solana/codecs-data-structures to transpile modern syntax
                    /node_modules[\\/]@solana[\\/]codecs-data-structures/,
                    // NEW: Include @solana/errors to transpile modern class field syntax
                    /node_modules[\\/]@solana[\\/]errors/,
                    /node_modules[\\/]@noble[\\/]curves/,
                    /node_modules[\\/]superstruct/,
                    /node_modules[\\/]rpc-websockets/,
                    // NEW: Also include any @solana modules inside the linked repo's node_modules
                    /node_modules[\\/]alpha-vm[\\/]node_modules[\\/]@solana/,
                    // Add Metaplex modules to be transpiled
                    /node_modules[\\/]@metaplex-foundation[\\/]umi/,
                    /node_modules[\\/]alpha-vm[\\/]node_modules[\\/]@metaplex-foundation[\\/]umi/
                ],
                options: {
                    // Explicitly disable babelrc so we don't catch various config in lower dependencies.
                    babelrc: false,
                    plugins: [
                        [
                            'react-intl',
                            {
                                messagesDir: './translations/messages/'
                            }
                        ],
                        '@babel/plugin-proposal-logical-assignment-operators',
                        '@babel/plugin-proposal-optional-chaining',
                        '@babel/plugin-proposal-nullish-coalescing-operator',
                        '@babel/plugin-proposal-class-properties',
                        // Add class properties transform to handle class fields
                        '@babel/plugin-proposal-private-methods',
                        '@babel/plugin-proposal-private-property-in-object'
                    ],
                    presets: ['@babel/preset-env', '@babel/preset-react'],
                    // NEW OVERRIDE: For any files in alpha-vm's node_modules/@solana, force Babel to output CommonJS.
                    overrides: [
                        {
                            test: /node_modules[\\/]alpha-vm[\\/]node_modules[\\/]@solana/,
                            presets: [
                                [
                                    '@babel/preset-env',
                                    {
                                        modules: 'commonjs'
                                    }
                                ]
                            ]
                        }
                    ]
                }
            },
            {
                test: /\.css$/,
                use: [
                    {loader: 'style-loader'},
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[name]_[local]_[hash:base64:5]',
                            camelCase: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: function () {
                                return [postcssImport, postcssVars, autoprefixer];
                            }
                        }
                    }
                ]
            },
            // Add new rule for Metaplex UMI modules
            {
                test: /\.(mjs|cjs|js)$/,
                include: [
                    /node_modules[\\/]@metaplex-foundation[\\/]umi/,
                    /node_modules[\\/]alpha-vm[\\/]node_modules[\\/]@metaplex-foundation[\\/]umi/
                ],
                type: 'javascript/auto',
                use: {
                    loader: 'babel-loader',
                    options: {
                        babelrc: false,
                        presets: [
                            ['@babel/preset-env', {
                                modules: 'commonjs'
                            }]
                        ],
                        plugins: [
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-proposal-private-methods',
                            '@babel/plugin-proposal-private-property-in-object'
                        ]
                    }
                }
            },
            // Update the Metaplex Foundation modules rule
            {
                test: /\.(js|mjs|cjs)$/,
                include: [
                    /node_modules[\\/]@metaplex-foundation/,
                    /node_modules[\\/]alpha-vm[\\/]node_modules[\\/]@metaplex-foundation/
                ],
                type: 'javascript/auto',
                use: {
                    loader: 'babel-loader',
                    options: {
                        babelrc: false,
                        presets: [
                            ['@babel/preset-env', {
                                modules: 'commonjs',
                                targets: {
                                    node: 'current'
                                }
                            }]
                        ],
                        plugins: [
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-proposal-private-methods',
                            '@babel/plugin-proposal-private-property-in-object',
                            '@babel/plugin-proposal-optional-chaining',
                            '@babel/plugin-proposal-nullish-coalescing-operator'
                        ]
                    }
                }
            }
        ]
    },
    plugins: [
        // Provide Buffer polyfill for modules that depend on it.
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer']
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'node_modules/scratch-blocks/media',
                    to: 'static/blocks-media/default'
                },
                {
                    from: 'node_modules/scratch-blocks/media',
                    to: 'static/blocks-media/high-contrast'
                },
                {
                    from: 'src/lib/themes/blocks/high-contrast-media/blocks-media',
                    to: 'static/blocks-media/high-contrast',
                    force: true
                }
            ]
        })
    ]
};

if (!process.env.CI) {
    base.plugins.push(new webpack.ProgressPlugin());
}

module.exports = [
    // to run editor examples
    defaultsDeep({}, base, {
        entry: {
            // Keep only the editor entry point and rename it to main
            'main': './src/playground/editor.jsx',
            // If you need other pages, keep them
            'player': './src/playground/player.jsx',
            'fullscreen': './src/playground/fullscreen.jsx',
            'embed': './src/playground/embed.jsx',
            'addon-settings': './src/playground/addon-settings.jsx',
            'integration': './src/integration/index.js'
        },
        output: {
            path: path.resolve(__dirname, 'build')
        },
        module: {
            rules: base.module.rules.concat([
                {
                    test: /\.(svg|png|wav|mp3|gif|jpg|woff2|hex)$/,
                    loader: 'url-loader',
                    options: {
                        limit: 2048,
                        outputPath: 'static/assets/',
                        esModule: false
                    }
                }
            ])
        },
        plugins: base.plugins.concat([
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
                'process.env.DEBUG': Boolean(process.env.DEBUG),
                'process.env.ENABLE_SERVICE_WORKER': JSON.stringify(
                    process.env.ENABLE_SERVICE_WORKER || ''
                ),
                'process.env.ROOT': JSON.stringify(root),
                'process.env.ROUTING_STYLE': JSON.stringify(process.env.ROUTING_STYLE || 'filehash')
            }),
            new HtmlWebpackPlugin({
                chunks: ['main'],
                template: 'src/playground/index.ejs',
                filename: 'index.html',
                title: `${APP_NAME} - Low-Code Solana, High-Speed Innovation`,
                isEditor: true,
                ...htmlWebpackPluginCommon
            }),
            new HtmlWebpackPlugin({
                chunks: ['player'],
                template: 'src/playground/index.ejs',
                filename: 'player.html',
                title: `${APP_NAME} - Low-Code Solana, High-Speed Innovation`,
                ...htmlWebpackPluginCommon
            }),
            new HtmlWebpackPlugin({
                chunks: ['fullscreen'],
                template: 'src/playground/index.ejs',
                filename: 'fullscreen.html',
                title: `${APP_NAME} - Low-Code Solana, High-Speed Innovation`,
                ...htmlWebpackPluginCommon
            }),
            new HtmlWebpackPlugin({
                chunks: ['embed'],
                template: 'src/playground/embed.ejs',
                filename: 'embed.html',
                title: `Embedded Project - ${APP_NAME}`,
                ...htmlWebpackPluginCommon
            }),
            new HtmlWebpackPlugin({
                chunks: ['addon-settings'],
                template: 'src/playground/simple.ejs',
                filename: 'addons.html',
                title: `Addon Settings - ${APP_NAME}`,
                ...htmlWebpackPluginCommon
            }),
            new HtmlWebpackPlugin({
                chunks: ['credits'],
                template: 'src/playground/simple.ejs',
                filename: 'credits.html',
                title: `${APP_NAME} Credits`,
                ...htmlWebpackPluginCommon
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: 'static',
                        to: ''
                    }
                ]
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: 'extensions/**',
                        to: 'static',
                        context: 'src/examples'
                    }
                ]
            })
        ])
    })
].concat(
    process.env.NODE_ENV === 'production' || process.env.BUILD_MODE === 'dist' ? // export as library
        defaultsDeep({}, base, {
            target: 'web',
            entry: {
                'alpha-gui': './src/index.js'
            },
            output: {
                libraryTarget: 'umd',
                filename: 'js/[name].js',
                chunkFilename: 'js/[name].js',
                path: path.resolve('dist'),
                publicPath: `${STATIC_PATH}/`
            },
            externals: {
                'react': 'react',
                'react-dom': 'react-dom'
            },
            module: {
                rules: base.module.rules.concat([
                    {
                        test: /\.(svg|png|wav|mp3|gif|jpg|woff2|hex)$/,
                        loader: 'url-loader',
                        options: {
                            limit: 2048,
                            outputPath: 'static/assets/',
                            publicPath: `${STATIC_PATH}/assets/`,
                            esModule: false
                        }
                    }
                ])
            },
            plugins: base.plugins.concat([
                new CopyWebpackPlugin({
                    patterns: [
                        {
                            from: 'extension-worker.{js,js.map}',
                            context: 'node_modules/alpha-vm/dist/web',
                            noErrorOnMissing: true
                        }
                    ]
                }),
                // Include library JSON files for scratch-desktop to use for downloading
                new CopyWebpackPlugin({
                    patterns: [
                        {
                            from: 'src/lib/libraries/*.json',
                            to: 'libraries',
                            flatten: true
                        }
                    ]
                })
            ])
        }) :
        []
);
