import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cron from "node-cron";
import Asset from "./models/Asset.js";
import dotenv from "dotenv";
import cors from "cors";
import fetchAssetPrice from "./utils/fetchAssetPrice.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log(err));

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("join-room", (assetSymbol) => {
    socket.join(assetSymbol);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

cron.schedule("*/10 * * * *", async () => {
  console.log("Updating asset prices...");

  const assets = await Asset.find();

  for (let asset of assets) {
    try {
      const newPrice = await fetchAssetPrice(asset.symbol);
      console.log(newPrice);
      if (newPrice) {
        await Asset.updateOne(
          { symbol: asset.symbol },
          { $set: { currentPrice: newPrice } }
        );

        io.to(asset.symbol).emit("portfolio-update", {
          asset: asset.symbol,
          assetId: asset._id,
          newPrice,
        });

        console.log(`Updated price for ${asset.symbol} to ${newPrice}`);
      } else {
        console.log(`No new price for ${asset.symbol}`);
      }
    } catch (error) {
      console.error(
        `Failed to update price for ${asset.symbol}: ${error.message}`
      );
    }
  }
});

server.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
