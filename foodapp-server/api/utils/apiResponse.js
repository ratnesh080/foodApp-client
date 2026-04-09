const sendSuccess = (res, status, data, message = "OK") => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, status, message, details = null) => {
  return res.status(status).json({
    success: false,
    message,
    details,
  });
};

module.exports = {
  sendSuccess,
  sendError,
};
