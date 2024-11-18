import Asset from "../models/Asset.js";
import UserAssets from "../models/UserAssets.js";
import fetchAssetPrice from "../utils/fetchAssetPrice.js";

export const getAssets = async (req, res) => {
  const userId = req.user.id;

  try {
    const userAssets = await UserAssets.find({ userId }).populate("assetId");

    if (!userAssets || userAssets.length === 0) {
      return res.status(200).json({
        message: "No assets found for the user",
        assets: [],
      });
    }

    return res.status(200).json({
      message: "Assets fetched successfully",
      assets: userAssets,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error fetching assets",
      error: error.message,
    });
  }
};

export const updateAssetQuantity = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const asset = await UserAssets.findById(id);

    if (!asset) {
      return res.status(404).json({
        message: "Asset not found",
      });
    }

    asset.quantity = quantity;
    await asset.save();

    return res.status(200).json({
      message: "Asset quantity updated successfully",
      asset,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error updating asset quantity",
      error: error.message,
    });
  }
};

export const addAsset = async (req, res) => {
  const { symbol, quantity, name } = req.body;
  const userId = req.user.id;

  try {
    let asset = await Asset.findOne({ symbol });

    if (!asset) {
      const currentPrice = await fetchAssetPrice(symbol);
      asset = new Asset({
        symbol,
        currentPrice,
        name,
      });
      await asset.save();
    }

    const existingUserAsset = await UserAssets.findOne({
      userId,
      assetId: asset._id,
    });

    if (existingUserAsset) {
      existingUserAsset.quantity += quantity;
      await existingUserAsset.save();
    } else {
      const newUserAsset = new UserAssets({
        userId,
        quantity,
        assetId: asset._id,
      });
      await newUserAsset.save();
    }

    return res.status(200).json({
      message: "Asset successfully added or updated",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error adding asset",
      error: error.message,
    });
  }
};

export const deleteAsset = async (req, res) => {
  const { id } = req.params;

  try {
    const asset = await UserAssets.findByIdAndDelete(id);

    if (!asset) {
      return res.status(404).json({
        message: "Asset not found",
      });
    }

    return res.status(200).json({
      message: "Asset deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error deleting asset",
      error: error.message,
    });
  }
};
