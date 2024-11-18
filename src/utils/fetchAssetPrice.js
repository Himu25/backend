import finnhub from "finnhub";

const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = "csssafpr01qld5m1inggcsssafpr01qld5m1inh0";

const finnhubClient = new finnhub.DefaultApi();

const fetchAssetPrice = async (symbol) => {
  return new Promise((resolve, reject) => {
    finnhubClient.quote(symbol, (error, data, response) => {
      if (error) {
        reject("Error fetching price:", error);
      } else {
        let latestPrice = data.c;
        const randomAdjustment = Math.floor(Math.random() * 21) - 10;
        const adjustedPrice = latestPrice + randomAdjustment;
        console.log(`The latest price for ${symbol} is ${latestPrice}`);
        console.log(`The adjusted price for ${symbol} is ${adjustedPrice}`);
        resolve(adjustedPrice);
      }
    });
  });
};
export default fetchAssetPrice;
