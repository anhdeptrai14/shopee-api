const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
app.use(cors());

// lấy từ ENV (Render)
const APP_ID = process.env.APP_ID;
const SECRET = process.env.SECRET;

app.get("/", (req, res) => {
  res.send("Shopee API đang chạy 🚀");
});

app.get("/shopee", async (req, res) => {
  try {
    const url = req.query.url;
    const timestamp = Math.floor(Date.now() / 1000);

    const base = `${APP_ID}${timestamp}`;
    const sign = crypto
      .createHmac("sha256", SECRET)
      .update(base)
      .digest("hex");

    const response = await axios.get(
      "https://open-api.affiliate.shopee.vn/graphql",
      {
        params: {
          app_id: APP_ID,
          timestamp: timestamp,
          sign: sign,
          url: url
        }
      }
    );

    const d = response.data;

    res.json({
      name: d.name || "",
      price: d.price || 0,
      image: d.image || "",
      commission: d.commission || 0,
      aff_link: d.aff_link || url
    });

  } catch (e) {
    res.json({ error: "Lỗi API" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running...");
});
