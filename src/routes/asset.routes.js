import express from "express";
import {
  addAsset,
  deleteAsset,
  getAssets,
  updateAssetQuantity,
} from "../controllers/asset.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();
router.use(verifyToken);
router.post("/assets", addAsset);
router.get("/assets", getAssets);
router.put("/assets/quantity/:id", updateAssetQuantity);
router.delete("/assets/:id", deleteAsset);

export default router;
