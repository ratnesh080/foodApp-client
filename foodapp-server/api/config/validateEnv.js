const required = ["DB_USER", "DB_PASSWORD", "STRIPE_SECRET_KEY"];

const validateEnv = () => {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }
};

module.exports = validateEnv;
