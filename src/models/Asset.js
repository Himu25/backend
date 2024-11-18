import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
    },
    currentPrice: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

assetSchema.index({ symbol: 1 });

const Asset = mongoose.model("Asset", assetSchema);

export default Asset;
