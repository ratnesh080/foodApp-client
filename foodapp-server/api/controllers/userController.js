const User = require("../model/User");
const { sendSuccess, sendError } = require("../utils/apiResponse");
const allowedAdminEmails = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

// get all the users
const getAllUsers = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 50), 1), 200);
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find({}).skip(skip).limit(limit),
      User.countDocuments(),
    ]);
    return sendSuccess(
      res,
      200,
      {
        items: users,
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
      "Users fetched successfully"
    );
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// post a new user (Upsert logic)
const createUser = async (req, res) => {
  const user = req.body;
  const query = { email: user.email };
  try {
    const existingUser = await User.findOne(query);
    if (existingUser) {
      return sendSuccess(
        res,
        200,
        { status: "existing", user: existingUser },
        "User already exists"
      );
    }
    const result = await User.create(user);
    return sendSuccess(res, 201, result, "User created successfully");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// deleteUser
const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return sendError(res, 404, "User not found");
    }
    return sendSuccess(res, 200, { id: userId }, "User deleted successfully");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// get admin status
const getAdmin = async (req, res) => {
  const email = req.params.email;
  
  try {
    // 1. Security Check: Ensure the requester is asking about their own admin status
    if (email !== req.decoded.email) {
      return sendError(res, 403, "Forbidden access");
    }

    // 2. Database Check
    const user = await User.findOne({ email: email });
    let admin = false;
    if (user) {
      admin = user?.role === "admin";
    }
    return sendSuccess(res, 200, { admin }, "Admin status fetched");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// make a user an admin
const makeAdmin = async (req, res) => {
  const userId = req.params.id;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: "admin" },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return sendError(res, 404, "User not found");
    }
    return sendSuccess(res, 200, updatedUser, "User promoted to admin");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// bootstrap admin role for allowed emails
const bootstrapAdmin = async (req, res) => {
  try {
    const email = String(req.decoded?.email || "").toLowerCase();
    if (!email) {
      return sendError(res, 401, "Unauthorized");
    }
    if (!allowedAdminEmails.includes(email)) {
      return sendError(
        res,
        403,
        "This email is not allowed to bootstrap admin role"
      );
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { email, role: "admin" } },
      { new: true, upsert: true }
    );

    return sendSuccess(res, 200, updatedUser, "Admin role activated");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = {
  getAllUsers,
  createUser,
  deleteUser,
  getAdmin,
  makeAdmin,
  bootstrapAdmin,
};