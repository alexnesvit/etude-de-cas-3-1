const Article = require("./articles.schema");

class ArticlesService {
  getAll() {
    return Article.find().populate("user", "-password");
  }

  getById(id) {
    return Article.findById(id).populate("user", "-password");
  }

  getByUser(userId) {
    return Article.find({ user: userId }).populate("user", "-password");
  }

  create(data) {
    const article = new Article(data);
    return article.save();
  }

  update(id, data) {
    return Article.findByIdAndUpdate(id, data, { new: true }).populate(
      "user",
      "-password"
    );
  }

  delete(id) {
    return Article.findByIdAndDelete(id);
  }
}

module.exports = new ArticlesService();
