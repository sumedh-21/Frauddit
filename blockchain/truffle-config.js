module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost for Ganache
      port: 7545, // Port where Ganache is running
      network_id: "*", // Match any network ID
    },
  },

  // Set default mocha options here
  mocha: {
    timeout: 100000,
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.21", // Fetch exact version from solc-bin (default: truffle's version)
    },
  },

  // Truffle DB configuration
  db: {
    enabled: false,
  },
};
