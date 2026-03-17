const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("API OK");
});

app.get("/shopee", async (req, res) => {
  try {
    const url = req.query.url;

    // lấy ID từ link
    const match = url.match(/i\.(\d+)\.(\d+)/);
    if (!match) return res.json({ error: "Link sai" });

    const shopid = match[1];
    const itemid = match[2];

    const api = `https://shopee.vn/api/v4/item/get?itemid=${itemid}&shopid=${shopid}`;

    const response = await axios.get(api);
    const item = response.data.data;

    const price = item.price / 100000;

    res.json({
      name: item.name,
      price: price,
      image: "https://cf.shopee.vn/file/" + item.image,
      commission: Math.round(price * 0.03), // 3%
      link: url
    });

  } catch (e) {
    res.json({ error: "Lỗi API" });
  }
});

app.listen(process.env.PORT || 3000);
