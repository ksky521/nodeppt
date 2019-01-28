/**
 * @file app
 */
const fs = require('fs');
const path = require('path');

// ensure the filename passed to html-webpack-plugin is a relative path
// because it cannot correctly handle absolute paths
function ensureRelative(outputDir, p) {
    if (path.isAbsolute(p)) {
        return path.relative(outputDir, p);
    } else {
        return p;
    }
}

module.exports = (api, options) => {
    api.chainWebpack(webpackConfig => {
        const isProd = process.env.NODE_ENV === 'production';
        const outputDir = api.resolve(options.outputDir);
        // code splitting
        if (isProd) {
            webpackConfig.optimization.splitChunks({
                cacheGroups: {
                    vendors: {
                        name: 'chunk-vendors',
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                        chunks: 'initial'
                    },
                    common: {
                        name: 'chunk-common',
                        minChunks: 2,
                        priority: -20,
                        chunks: 'initial',
                        reuseExistingChunk: true
                    }
                }
            });
        }

        // HTML plugin
        // #1669 html-webpack-plugin's default sort uses toposort which cannot
        // handle cyclic deps in certain cases. Monkey patch it to handle the case
        // before we can upgrade to its 4.0 version (incompatible with preload atm)
        const chunkSorters = require('html-webpack-plugin/lib/chunksorter');
        const depSort = chunkSorters.dependency;
        chunkSorters.auto = chunkSorters.dependency = (chunks, ...args) => {
            try {
                return depSort(chunks, ...args);
            } catch (e) {
                // fallback to a manual sort if that happens...
                return chunks.sort((a, b) => {
                    // make sure user entry is loaded last so user CSS can override
                    // vendor CSS
                    if (a.id === 'app') {
                        return 1;
                    } else if (b.id === 'app') {
                        return -1;
                    } else if (a.entry !== b.entry) {
                        return b.entry ? -1 : 1;
                    }
                    return 0;
                });
            }
        };

        const htmlOptions = {
            templateParameters: (compilation, assets, pluginOptions) => {
                // enhance html-webpack-plugin's built in template params
                let stats;
                return Object.assign({
                    // make stats lazy as it is expensive
                    get webpack() {
                        return stats || (stats = compilation.getStats().toJson());
                    },
                    compilation: compilation,
                    webpackConfig: compilation.options,
                    htmlWebpackPlugin: {
                        files: assets,
                        options: pluginOptions
                    }
                });
            }
        };

        if (isProd) {
            Object.assign(htmlOptions, {
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    collapseBooleanAttributes: true,
                    removeScriptTypeAttributes: true
                    // more options:
                    // https://github.com/kangax/html-minifier#options-quick-reference
                }
            });

            // keep chunk ids stable so async chunks have consistent hash (#1916)
            webpackConfig.plugin('named-chunks').use(require('webpack/lib/NamedChunksPlugin'), [
                chunk => {
                    if (chunk.name) {
                        return chunk.name;
                    }
                    return (
                        'chunk-' +
                        Array.from(chunk.modulesIterable, m => {
                            return m.id;
                        }).join('_')
                    );
                }
            ]);
        }

        // resolve HTML file(s)
        const HTMLPlugin = require('html-webpack-plugin');
        const multiPageConfig = options.pages;
        const htmlPath = api.getEntry();
        const publicCopyIgnore = ['index.html', '.DS_Store'];

        if (!multiPageConfig) {
            // default, single page setup.
            htmlOptions.template = htmlPath;
            if (isProd) {
                htmlOptions.filename = api.getEntryName() + '.html';
            }
            webpackConfig.plugin('html').use(HTMLPlugin, [htmlOptions]);
        } else {
            // multi-page setup
            webpackConfig.entryPoints.clear();

            const pages = Object.keys(multiPageConfig);
            const normalizePageConfig = c => (typeof c === 'string' ? {entry: c} : c);

            pages.forEach(name => {
                const {
                    title,
                    entry,
                    template = `public/${name}.html`,
                    filename = `${name}.html`,
                    chunks
                } = normalizePageConfig(multiPageConfig[name]);
                // inject entry
                webpackConfig.entry(name).add(api.resolve(entry));

                // resolve page index template
                const hasDedicatedTemplate = fs.existsSync(api.resolve(template));
                if (hasDedicatedTemplate) {
                    publicCopyIgnore.push(template);
                }
                const templatePath = hasDedicatedTemplate ? template : htmlPath;

                // inject html plugin for the page
                const pageHtmlOptions = Object.assign({}, htmlOptions, {
                    chunks: chunks || ['chunk-vendors', 'chunk-common', name],
                    template: templatePath,
                    filename: ensureRelative(outputDir, filename),
                    title
                });

                webpackConfig.plugin(`html-${name}`).use(HTMLPlugin, [pageHtmlOptions]);
            });
        }

        // copy static assets in public/
        const publicDir = api.resolve('./public');
        if (fs.existsSync(publicDir)) {
            webpackConfig.plugin('copy').use(require('copy-webpack-plugin'), [
                [
                    {
                        from: publicDir,
                        to: outputDir,
                        ignore: publicCopyIgnore
                    }
                ]
            ]);
        }
    });
};
