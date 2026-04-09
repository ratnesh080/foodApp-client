const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const durationMs = Date.now() - start;
    // Structured one-line logs for easier debugging in production.
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms`
    );
  });
  next();
};

module.exports = requestLogger;
