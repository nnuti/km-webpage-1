module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.js$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    "^react-markdown$": "<rootDir>/__mocks__/react-markdown.js",
    "^remark-gfm$": "<rootDir>/__mocks__/remark-gfm.js",
    "^remark-supersub$": "<rootDir>/__mocks__/remark-supersub.js",
    "^react-syntax-highlighter/dist/esm/styles/prism$": "<rootDir>/__mocks__/react-syntax-highlighter.js",
    '^@fontsource/prompt$': '<rootDir>/__mocks__/@fontsource/prompt.js',
    '^rehypeRaw$': '<rootDir>/__mocks__/rehypeRaw.js',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(react-markdown|remark-gfm|remark-supersub)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  reporters: [
    "default",
    ["jest-junit", {
      outputDirectory: "./test-reports",
      outputName: "junit.xml",
    }]
  ],
  testResultsProcessor: 'jest-junit',
  reporters: ['default', 'jest-junit'],
  collectCoverage: true,
  coverageThreshold: {
    global: {
      statements: 60,
      lines: 60

    }
  },
  // moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};