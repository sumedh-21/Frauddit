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
const contractAddress = "0x68b76828162448d83C9536A11B7DD165A0bDc0C4";
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

// Define the schema for reports
const reportSchema = new mongoose.Schema({
  fraudType: String,
  description: String,
  blockchainTxId: String,
  timestamp: { type: Date, default: Date.now },
});

const Report = mongoose.model("Report", reportSchema);

// Endpoint to handle fraud report submissions
app.post("/report", async (req, res) => {
  const { fraudType, description } = req.body;

  try {
    // Step 1: Check if the report already exists on the blockchain
    const reportExists = await FraudReport.methods
      .reportExists(fraudType, description)
      .call();

    if (reportExists) {
      return res.status(400).json({
        message:
          "This report already exists! Please check the list of recent fraud reports.",
        error: "duplicate_report",
      });
    }

    // Step 2: Submit the report to the blockchain
    const accounts = await web3.eth.getAccounts();
    const tx = await FraudReport.methods
      .submitReport(fraudType, description)
      .send({ from: accounts[0], gas: 500000 });

    const report = {
      fraudType,
      description,
      blockchainTxId: tx.transactionHash,
    };

    // Emit the new report for real-time updates
    io.emit("newReport", report);

    // Save the report to the MongoDB database
    const newReport = new Report({
      fraudType,
      description,
      blockchainTxId: tx.transactionHash,
    });
    await newReport.save();

    res.status(201).json({ message: "Report submitted successfully", report });
  } catch (error) {
    console.error("Error submitting report:", error);
    res.status(500).json({ error: "Report submission failed" });
  }
});

// Endpoint to get top 10 recent fraud reports
app.get("/reports/recent", async (req, res) => {
  try {
    // Fetch top 10 recent reports sorted by timestamp (descending)
    const reports = await Report.find()
      .sort({ timestamp: -1 }) // Sort by timestamp, descending
      .limit(10); // Limit to 10 reports

    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

// Endpoint to get all fraud reports
app.get("/reports/all", async (req, res) => {
  try {
    const reports = await Report.find(); // Fetch all reports from the database
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching all reports:", error);
    res.status(500).json({ error: "Failed to fetch all reports" });
  }
});

app.get("/sync-reports", async (req, res) => {
  try {
    const reportsFromBlockchain = await FraudReport.methods.getReports().call();
    const existingReports = await Report.find(); // Get all existing reports in MongoDB

    // Loop through blockchain reports and save them if they're not already in MongoDB
    for (const blockchainReport of reportsFromBlockchain) {
      const exists = existingReports.some(
        (report) => report.blockchainTxId === blockchainReport.blockchainTxId
      );

      if (!exists) {
        const newReport = new Report({
          fraudType: blockchainReport.fraudType,
          description: blockchainReport.description,
          blockchainTxId: blockchainReport.blockchainTxId,
          timestamp: new Date(blockchainReport.timestamp * 1000),
        });

        await newReport.save();
      }
    }

    res.status(200).json({ message: "Reports synchronized" });
  } catch (error) {
    console.error("Error syncing reports:", error);
    res.status(500).json({ error: "Failed to sync reports" });
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
