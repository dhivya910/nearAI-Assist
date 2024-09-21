import express from "express";
import cors from "cors";
import axios from "axios";

const PORT = process.env.PORT || 4000;
const HOSTNAME = process.env.HOSTNAME || "http://localhost";
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
);

app.use(express.json());

// Function to fetch NEAR transactions from the NEARBlocks API
async function fetchNearTransactions(limit: number = 10): Promise<any> {
  try {
    const response = await axios.get(`https://api.nearblocks.io/v1/txns?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching NEAR transactions", error);
    return undefined;
  }
}

app.post("/prompt", async (req, res) => {
  const { prompt } = req.body;

  // Fetch transactions based on your prompt (e.g., passing a transaction limit from prompt)
  const limit = parseInt(prompt) || 10; // Fallback to a default value if the prompt is not valid
  const transactions = await fetchNearTransactions(limit);

  if (!transactions) {
    return res.status(500).send("Error fetching transactions");
  }

  res.send(transactions);
});

app.listen(PORT, () => {
  console.log(`Running - ${HOSTNAME}:${PORT}`);
});
