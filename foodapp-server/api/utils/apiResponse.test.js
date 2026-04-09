const { sendSuccess, sendError } = require("./apiResponse");

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("apiResponse helpers", () => {
  test("sendSuccess returns normalized success payload", () => {
    const res = createRes();
    const payload = { hello: "world" };

    sendSuccess(res, 200, payload, "Fetched");

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Fetched",
      data: payload,
    });
  });

  test("sendError returns normalized error payload", () => {
    const res = createRes();

    sendError(res, 400, "Validation failed", ["email is required"]);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Validation failed",
      details: ["email is required"],
    });
  });
});
