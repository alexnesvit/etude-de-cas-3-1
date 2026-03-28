jest.mock("../api/articles/articles.service", () => ({
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));

const articlesController = require("../api/articles/articles.controller");
const articlesService = require("../api/articles/articles.service");

function createRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  };
}

describe("articles.controller unit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("create: sets connected user id and returns 201", async () => {
    const req = {
      body: { title: "Title", content: "Body" },
      user: { userId: "u1" },
      io: { emit: jest.fn() },
    };
    const res = createRes();
    const next = jest.fn();

    articlesService.create.mockResolvedValue({
      _id: "a1",
      title: "Title",
      content: "Body",
      user: "u1",
    });

    await articlesController.create(req, res, next);

    expect(articlesService.create).toHaveBeenCalledWith({
      title: "Title",
      content: "Body",
      user: "u1",
    });
    expect(req.io.emit).toHaveBeenCalledWith(
      "article:create",
      expect.objectContaining({ _id: "a1" })
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test("update: returns 200 when article exists", async () => {
    const req = {
      params: { id: "a1" },
      body: { title: "Updated" },
      io: { emit: jest.fn() },
    };
    const res = createRes();
    const next = jest.fn();

    articlesService.update.mockResolvedValue({ _id: "a1", title: "Updated" });

    await articlesController.update(req, res, next);

    expect(articlesService.update).toHaveBeenCalledWith("a1", { title: "Updated" });
    expect(req.io.emit).toHaveBeenCalledWith(
      "article:update",
      expect.objectContaining({ _id: "a1" })
    );
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ _id: "a1" }));
  });

  test("delete: returns 204 when article exists", async () => {
    const req = {
      params: { id: "a1" },
      io: { emit: jest.fn() },
    };
    const res = createRes();
    const next = jest.fn();

    articlesService.delete.mockResolvedValue({ _id: "a1" });

    await articlesController.delete(req, res, next);

    expect(articlesService.delete).toHaveBeenCalledWith("a1");
    expect(req.io.emit).toHaveBeenCalledWith("article:delete", { id: "a1" });
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
