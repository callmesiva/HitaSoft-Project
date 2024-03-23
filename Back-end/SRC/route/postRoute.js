const express = require("express");
const router = express.Router();
const postData = require("../controller/postControl");

router.get("/postlist", postData.getData);
router.get("/getpage", postData.getPage);
router.post("/postlist", postData.updateData);
router.delete("/postlist/:id", postData.deletePost);

module.exports = router;
