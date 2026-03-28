const request = require("supertest");
const jwt = require("jsonwebtoken");
const mockingoose = require("mockingoose");
const { app } = require("../server");
const config = require("../config");
const User = require("../api/users/users.model");
const Article = require("../api/articles/articles.schema");

describe("tester API articles", () => {
  const USER_ID = "507f1f77bcf86cd799439011";
  const ARTICLE_ID = "507f1f77bcf86cd799439012";
  const adminToken = jwt.sign({ userId: USER_ID }, config.secretJwtToken);

  beforeEach(() => {
    mockingoose(User).toReturn(
      {
        _id: USER_ID,
        role: "admin",
      },
      "findOne"
    );
  });

  afterEach(() => {
    mockingoose.resetAll();
    jest.restoreAllMocks();
  });

  test("[Articles] Create article with authenticated user", async () => {
    mockingoose(Article).toReturn(
      {
        _id: ARTICLE_ID,
        title: "Mon titre",
        content: "Mon contenu",
        status: "draft",
        user: USER_ID,
      },
      "save"
    );

    const res = await request(app)
      .post("/api/articles")
      .set("x-access-token", adminToken)
      .send({
        title: "Mon titre",
        content: "Mon contenu",
      });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Mon titre");
    expect(String(res.body.user)).toBe(USER_ID);
  });

  test("[Articles] Update article for admin", async () => {
    mockingoose(Article).toReturn(
      {
        _id: ARTICLE_ID,
        title: "Titre modifie",
        content: "Contenu",
        status: "published",
        user: USER_ID,
      },
      "findOneAndUpdate"
    );

    const res = await request(app)
      .put(`/api/articles/${ARTICLE_ID}`)
      .set("x-access-token", adminToken)
      .send({
        title: "Titre modifie",
        status: "published",
      });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Titre modifie");
    expect(res.body.status).toBe("published");
  });

  test("[Articles] Delete article for admin", async () => {
    mockingoose(Article).toReturn(
      {
        _id: ARTICLE_ID,
        title: "Titre",
        content: "Contenu",
        user: USER_ID,
      },
      "findOneAndDelete"
    );

    const res = await request(app)
      .delete(`/api/articles/${ARTICLE_ID}`)
      .set("x-access-token", adminToken);

    expect(res.status).toBe(204);
  });

  test("[Articles] Update should fail for non admin", async () => {
    const memberToken = jwt.sign({ userId: USER_ID }, config.secretJwtToken);

    mockingoose(User).toReturn(
      {
        _id: USER_ID,
        role: "member",
      },
      "findOne"
    );

    const res = await request(app)
      .put(`/api/articles/${ARTICLE_ID}`)
      .set("x-access-token", memberToken)
      .send({ title: "Interdit" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Admin role required");
  });
});
