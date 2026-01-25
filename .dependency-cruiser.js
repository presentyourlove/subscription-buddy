/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
    options: {
        doNotFollow: {
            path: 'node_modules',
        },
        tsPreCompilationDeps: true,
        tsConfig: {
            fileName: 'tsconfig.json',
        },
    },
    forbidden: [
        /* rules from the 'recommended' preset: */
        {
            name: 'no-circular',
            severity: 'error',
            comment:
                'This dependency is part of a circular relationship. You might want to revise ' +
                'your solution (i.e. use some dependency injection, 101 rules of separation ' +
                'or some other trick) to make the dependency graph a Directed Acyclic Graph.',
            from: {},
            to: {
                circular: true,
            },
        },
        // Custom Rules
        {
            name: 'no-view-to-db',
            severity: 'error',
            comment: 'Views should not access Firebase SDK directly. Use Services instead.',
            from: { path: "^apps/web/src/views" },
            to: { path: "^firebase/" }
        },
        {
            name: 'no-core-to-ui',
            severity: 'error',
            comment: 'Core package should not depend on UI apps.',
            from: { path: "^packages/core" },
            to: { path: "^apps/web" }
        }
    ],
};
