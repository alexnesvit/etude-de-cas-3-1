const express = require("express");
const authMiddleware = require("../../middlewares/auth");
const adminMiddleware = require("../../middlewares/admin");
const articlesController = require("./articles.controller");

const router = express.Router();

router.get("/", articlesController.getAll);
router.get("/:id", articlesController.getById);
router.post("/", authMiddleware, articlesController.create);
router.put("/:id", authMiddleware, adminMiddleware, articlesController.update);
router.delete("/:id", authMiddleware, adminMiddleware, articlesController.delete);

module.exports = router;
