require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = 5008;

const CATEGORY_KEYWORDS = {
  All: [
    "Indian Constitution",
    "Fundamental Rights India",
    "Supreme Court India",
    "Fundamental Duties India",
    "Indian Judiciary",
    "Parliament India law"
  ],

  "Fundamental Rights": [
    "Fundamental Rights India",
    "Right to Equality",
    "Right to Freedom",
    "Right to Education Article 21A",
    "Article 14",
    "Article 19",
    "Article 21"
  ],

  "Supreme Court": [
    "Supreme Court India",
    "SC Verdict",
    "SC Ruling",
    "Constitution Bench India",
    "Chief Justice of India"
  ],

  Articles: [
    "Article 370",
    "Article 21",
    "Article 14",
    "Article 32",
    "Article 368",
    "Important Articles of Indian Constitution"
  ],

  Amendments: [
    "Constitution Amendment India",
    "42nd Amendment",
    "44th Amendment",
    "103rd Amendment",
    "CAA Amendment India"
  ]
};

app.get("/constitution-news", async (req, res) => {
  try {
    const category = req.query.category || "All";
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    let selectedQueries = CATEGORY_KEYWORDS[category] || CATEGORY_KEYWORDS.All;

    // Include search term if user typed something
    if (search.trim() !== "") {
      selectedQueries = [search.trim(), ...selectedQueries];
    }

    // Build API requests
    const requests = selectedQueries.map((q) =>
      axios.get(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          q
        )}&language=en&pageSize=50&sortBy=publishedAt&apiKey=${process.env.API_KEY}`
      )
    );

    // Fetch all results in parallel
    const responses = await Promise.all(requests);

    let allArticles = [];
    responses.forEach((r) => {
      if (r.data.articles) allArticles = allArticles.concat(r.data.articles);
    });

    // Remove duplicates
    let uniqueArticles = Array.from(
      new Map(allArticles.map((a) => [a.title, a])).values()
    );

    // Sort by latest
    uniqueArticles.sort(
      (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
    );

    if (uniqueArticles.length < 3) {
      console.log("⚠️ Not enough category news → Fetching fallback news...");

      const fallback = await axios.get(
        `https://newsapi.org/v2/everything?q=Indian Constitution&language=en&pageSize=50&sortBy=publishedAt&apiKey=${process.env.API_KEY}`
      );

      uniqueArticles = uniqueArticles.concat(fallback.data.articles);

      // Remove duplicates again
      uniqueArticles = Array.from(
        new Map(uniqueArticles.map((a) => [a.title, a])).values()
      );
    }

    // PAGINATION
    const totalResults = uniqueArticles.length;
    const start = (page - 1) * pageSize;
    const paginatedArticles = uniqueArticles.slice(start, start + pageSize);

    res.json({
      totalResults,
      articles: paginatedArticles
    });

  } catch (err) {
    console.error("NEWS API ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

app.listen(PORT, () => console.log("Backend running on port", PORT));
