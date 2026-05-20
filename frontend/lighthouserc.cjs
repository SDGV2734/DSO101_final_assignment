module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run preview -- --host 0.0.0.0",
      startServerReadyPattern: "Local:",
      url: [process.env.LHCI_COLLECT_URL || "http://localhost:4173"],
      numberOfRuns: 1,
      settings: {
        preset: "desktop"
      }
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.75 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["error", { minScore: 0.9 }],
        "categories:seo": ["warn", { minScore: 0.8 }]
      }
    },
    upload: {
      target: "temporary-public-storage"
    }
  }
};
