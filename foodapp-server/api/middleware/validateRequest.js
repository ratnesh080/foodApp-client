const { sendError } = require("../utils/apiResponse");

const isObjectId = (value) => /^[a-f\d]{24}$/i.test(String(value || ""));

const validateRequest = (schema = {}) => (req, res, next) => {
  const errors = [];

  if (schema.params) {
    for (const [key, rule] of Object.entries(schema.params)) {
      const value = req.params[key];
      if (rule.required && (value === undefined || value === null || value === "")) {
        errors.push(`${key} is required`);
        continue;
      }
      if (rule.objectId && value && !isObjectId(value)) {
        errors.push(`${key} must be a valid ObjectId`);
      }
    }
  }

  if (schema.query) {
    for (const [key, rule] of Object.entries(schema.query)) {
      const value = req.query[key];
      if (rule.required && (value === undefined || value === null || value === "")) {
        errors.push(`${key} is required`);
      }
      if (rule.email && value && !/^\S+@\S+\.\S+$/.test(String(value))) {
        errors.push(`${key} must be a valid email`);
      }
    }
  }

  if (schema.body) {
    for (const [key, rule] of Object.entries(schema.body)) {
      const value = req.body[key];
      if (rule.required && (value === undefined || value === null || value === "")) {
        errors.push(`${key} is required`);
        continue;
      }
      if (rule.number && value !== undefined && value !== null && Number.isNaN(Number(value))) {
        errors.push(`${key} must be a number`);
      }
      if (rule.min !== undefined && value !== undefined && Number(value) < rule.min) {
        errors.push(`${key} must be >= ${rule.min}`);
      }
      if (rule.email && value && !/^\S+@\S+\.\S+$/.test(String(value))) {
        errors.push(`${key} must be a valid email`);
      }
      if (rule.array && value && !Array.isArray(value)) {
        errors.push(`${key} must be an array`);
      }
      if (rule.nonEmptyArray && Array.isArray(value) && value.length === 0) {
        errors.push(`${key} must not be empty`);
      }
      if (rule.objectIdArray && Array.isArray(value)) {
        const bad = value.some((v) => !isObjectId(v));
        if (bad) errors.push(`${key} must contain valid ObjectIds`);
      }
      if (rule.oneOf && value !== undefined && value !== null && !rule.oneOf.includes(value)) {
        errors.push(`${key} must be one of: ${rule.oneOf.join(", ")}`);
      }
    }
  }

  if (errors.length) {
    return sendError(res, 400, "Validation failed", errors);
  }
  next();
};

module.exports = validateRequest;
