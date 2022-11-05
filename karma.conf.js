const path = require('path');
module.exports = (config) => {
    config.set({
        basePath: '.',
        frameworks: [ 'jasmine', 'karma-typescript', 'api' ],
        port: '8080',
        plugins: [
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-typescript',
            'karma-sourcemap-loader',
            'karma-spec-reporter',
            'karma-jasmine-html-reporter',
            'karma-coverage',
            require('./karma-test-api'),
        ],
        karmaTypescriptConfig: {
            tsconfig: "tsconfig.spec.json",
        },
        client: {
            // leave Jasmine Spec Runner output visible in browser
            clearContext: false
        },
        files: [
            { pattern: 'src/**/*.ts' },
            { pattern: 'spec/**/*.ts' }
        ],
        preprocessors: {
            '**/*.ts': [ 'karma-typescript' ],
            '**/*.js': ['sourcemap']
        },
        reporters: [ 'kjhtml', 'spec', 'coverage' ],
        coverageReporter: {
            type : 'text',
            dir : 'coverage/'
        },
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['ChromeHeadlessNoSandbox'],
        singleRun: false,
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: [
                    '--no-sandbox',
                    '--enable-logging=stderr',
                    '--disable-web-security',
                    '--disable-gpu'
                ]
            }
        }
    })
}
