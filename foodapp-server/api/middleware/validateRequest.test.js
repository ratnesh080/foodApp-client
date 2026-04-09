const validateRequest = require("./validateRequest");

const createReqRes = ({ params = {}, query = {}, body = {} } = {}) => {
  const req = { params, query, body };
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  const next = jest.fn();
  return { req, res, next };
};

describe("validateRequest middleware", () => {
  test("passes for valid schema and payload", () => {
    const schema = {
      params: { id: { required: true, objectId: true } },
      query: { email: { required: true, email: true } },
      body: { quantity: { required: true, number: true, min: 1 } },
    };
    const { req, res, next } = createReqRes({
      params: { id: "507f1f77bcf86cd799439011" },
      query: { email: "test@example.com" },
      body: { quantity: 2 },
    });

    validateRequest(schema)(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("returns 400 for invalid payload", () => {
    const schema = {
      params: { id: { required: true, objectId: true } },
      body: { quantity: { required: true, number: true, min: 1 } },
    };
    const { req, res, next } = createReqRes({
      params: { id: "bad-id" },
      body: { quantity: 0 },
    });

    validateRequest(schema)(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
  });
});
