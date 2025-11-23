const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const multer = require("multer");
const path = require("path");

// ---------- AI SUMMARIZER ----------
const OpenAI = require("openai");
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateRealSummary(text) {
    try {
        const response = await client.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "Summarize the news article." },
                { role: "user", content: text }
            ],
            max_tokens: 120,
            temperature: 0.5
        });

        return response.choices[0].message.content.trim();
    } catch (err) {
        console.log("AI Summary Error:", err.message);
        return text.split(" ").slice(0, 25).join(" ") + "...";
    }
}

// ---------- IMAGE UPLOAD (multer) ----------
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });

// ---------- CREATE ARTICLE ----------
router.post("/", upload.single("image"), async(req, res) => {
    try {
        const text = req.body.content;

        // BASIC ARTICLE DATA
        const article = new Article({
            title: req.body.title,
            content: text,
            imagePath: req.file ? "/uploads/" + req.file.filename : null,
            status: "pending"
        });

        // ⭐ AI SUMMARY HERE
        article.summary = await generateRealSummary(text);

        // SAVE ARTICLE
        await article.save();

        res.json({
            message: "Article created successfully",
            article: article
        });

    } catch (err) {
        console.log("Article Create Error:", err.message);
        res.status(500).json({ error: "Server error while creating article" });
    }
});

// ---------- GET ALL ARTICLES ----------
router.get("/", async(req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: -1 });
        res.json(articles);
    } catch (err) {
        res.status(500).json({ error: "Server error while fetching articles" });
    }
});

module.exports = router;