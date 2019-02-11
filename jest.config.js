module.exports = {
    clearMocks: true,
    coverageDirectory: "coverage",
    collectCoverageFrom: [
        "dist/Unitime.js"
    ],
    testEnvironment: "node",
    testRegex: "test/.*.test.js$",
};