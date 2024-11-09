const Web3 = require("web3").Web3;

// Initialize Web3
const web3 = new Web3("http://127.0.0.1:7545");

// Test Web3 Connectivity
(async () => {
  try {
    const isConnected = await web3.eth.net.isListening();
    console.log("Web3 is connected to Ganache:", isConnected);

    const accounts = await web3.eth.getAccounts();
    console.log("Accounts:", accounts);
  } catch (error) {
    console.error("Error initializing Web3:", error);
  }
})();
