module.exports = {
    forbidden: [
        {
            name: 'no-view-to-service',
            comment: 'Views should not access Services directly. Use Stores instead.',
            severity: 'error',
            from: { path: '^apps/web/src/views' },
            to: { path: '^packages/core/src/services' }
        },
        {
            name: 'no-circular',
            severity: 'error',
            from: {},
            to: { circular: true }
        },
        {
            name: 'no-orphans',
            severity: 'warn',
            from: { orphan: true },
            to: {}
        }
    ],
    options: {
        doNotFollow: {
            path: 'node_modules'
        },
        moduleSystems: ['amd', 'cjs', 'es6', 'tsd'],
        tsPreCompilationDeps: true,
        tsConfig: {
            fileName: 'tsconfig.json'
        }
    }
};
