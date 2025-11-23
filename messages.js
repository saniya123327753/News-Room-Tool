const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// Add message
router.post("/", async(req, res) => {
    const msg = new Message({ message: req.body.message });
    await msg.save();
    res.json(msg);
});

// Get all messages
router.get("/", async(req, res) => {
    const messages = await Message.find();
    res.json(messages);
});

module.exports = router;