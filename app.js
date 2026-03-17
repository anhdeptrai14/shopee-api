const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

// test
app.get("/", (req, res) => {
  res.send("API OK 🚀");
});

// API lấy sản phẩm Shopee
app.get("/shopee", async (req, res) => {
  try {
    const url = req.query.url;

    if (!url) {
      return res.json({ error: "Thiếu link" });
    }

    // lấy shopid + itemid
    const match = url.match(/i\.(\d+)\.(\d+)/);
    if (!match) {
      return res.json({ error: "Link sai định dạng" });
    }

    const shopid = match[1];
    const itemid = match[2];

    const api = `https://shopee.vn/api/v4/item/get?itemid=${itemid}&shopid=${shopid}`;

    // 👉 FIX: thêm header để không bị Shopee chặn
    const response = await axios.get(api, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
        "Referer": "https://shopee.vn/"
      }
    });

    const item = response.data.data;

    if (!item) {
      return res.json({ error: "Không lấy được sản phẩm" });
    }

    const price = item.price / 100000;

    res.json({
      name: item.name,
      price: price,
      image: "https://cf.shopee.vn/file/" + item.image,
      commission: Math.round(price * 0.03), // 3%
      link: url
    });

  } catch (e) {
    console.log(e.message);
    res.json({ error: "Lỗi API Shopee" });
  }
});

app.listen(process.env.PORT || 3000);
