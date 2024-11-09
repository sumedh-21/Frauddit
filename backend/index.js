const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const { Web3, HttpProvider } = require("web3");
const contractABI =
  require("../blockchain/build/contracts/FraudReport.json").abi;

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const cors = require("cors");
app.use(cors());

// Initialize Web3 with Ganache RPC URL
const web3 = new Web3("http://127.0.0.1:7545");
const contractAddress = "0x6fbe9ba4738250cce22a6ceb0fd3e243810d567a";
const FraudReport = new web3.eth.Contract(contractABI, contractAddress);

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit if MongoDB connection fails
  });

// Endpoint to handle fraud report submissions
app.post("/report", async (req, res) => {
  const { fraudType, description } = req.body;

  try {
    const accounts = await web3.eth.getAccounts();
    console.log("Accounts:", accounts);

    console.log("Submitting report:", fraudType, description);
    const tx = await FraudReport.methods
      .submitReport(fraudType, description)
      .send({ from: accounts[0] });
    console.log("Transaction successful:", tx);

    const report = {
      fraudType,
      description,
      blockchainTxId: tx.transactionHash,
    };

    io.emit("newReport", report);

    res.status(201).json({ message: "Report submitted successfully", report });
  } catch (error) {
    console.error("Error submitting report:", error);
    res.status(500).json({ error: "Report submission failed" });
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
app.get("/", (req, res) => {
  res.send("Welcome to the Fraud Alert Network API");
});
