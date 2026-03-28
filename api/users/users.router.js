const express = require("express");
const usersController = require("./users.controller");
const articlesController = require("../articles/articles.controller");
const router = express.Router();

router.get("/", usersController.getAll);
router.get("/:userId/articles", articlesController.getByUser);
router.get("/:id", usersController.getById);
router.post("/", usersController.create);
router.put("/:id", usersController.update);
router.delete("/:id", usersController.delete);

module.exports = router;
