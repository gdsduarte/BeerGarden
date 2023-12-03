/* eslint-disable linebreak-style */
/* eslint-disable new-cap */
const express = require("express");
const router = express.Router();
const chatController = require("./controller");

router.get("/:userId", chatController.getChats);
router.get("/:chatId", chatController.getChat);
router.post("/", chatController.createChat);
router.put("/notification", chatController.updateNotificationSettings);

module.exports = router;
