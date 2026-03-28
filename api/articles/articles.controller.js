const NotFoundError = require("../../errors/not-found");
const articlesService = require("./articles.service");

class ArticlesController {
  async getAll(req, res, next) {
    try {
      const articles = await articlesService.getAll();
      res.json(articles);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const article = await articlesService.getById(req.params.id);
      if (!article) {
        throw new NotFoundError("Article not found");
      }
      res.json(article);
    } catch (err) {
      next(err);
    }
  }

  async getByUser(req, res, next) {
    try {
      const articles = await articlesService.getByUser(req.params.userId);
      res.json(articles);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const article = await articlesService.create({
        ...req.body,
        user: req.user.userId,
      });
      req.io.emit("article:create", article);
      res.status(201).json(article);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const article = await articlesService.update(req.params.id, req.body);
      if (!article) {
        throw new NotFoundError("Article not found");
      }
      req.io.emit("article:update", article);
      res.json(article);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const article = await articlesService.delete(req.params.id);
      if (!article) {
        throw new NotFoundError("Article not found");
      }
      req.io.emit("article:delete", { id: req.params.id });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ArticlesController();
