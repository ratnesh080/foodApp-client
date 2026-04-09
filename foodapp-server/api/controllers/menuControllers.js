const Menu = require("../model/Menu");
const { sendSuccess, sendError } = require("../utils/apiResponse");

const getAllMenuItems = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 100), 1), 200);
    const skip = (page - 1) * limit;
    const [menus, total] = await Promise.all([
      Menu.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Menu.countDocuments(),
    ]);
    return sendSuccess(
      res,
      200,
      {
        items: menus,
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
      "Menu fetched successfully"
    );
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// post a new menu item
const postMenuItem = async (req, res) => {
  const newItem = req.body;
  try {
    const result = await Menu.create(newItem);
    return sendSuccess(res, 201, result, "Menu item created");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// delete a menu item
const deleteMenuItem = async (req, res) => {
  const menuId = req.params.id;
  // console.log(menuId)
  try {
    const deletedItem = await Menu.findByIdAndDelete(menuId);

    // console.log(deletedItem);

    if (!deletedItem) {
      return sendError(res, 404, "Menu not found");
    }
    return sendSuccess(res, 200, { id: menuId }, "Menu item deleted successfully");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// get single menu item
const singleMenuItem = async (req, res) => {
  const menuId = req.params.id;
  try {
    const menu = await Menu.findById(menuId);
    return sendSuccess(res, 200, menu, "Menu item fetched");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// update single menu item
const updateMenuItem = async (req, res) => {
  const menuId = req.params.id;
  const { name, recipe, image, category, price } = req.body;
  try {
    const updatedMenu = await Menu.findByIdAndUpdate(
      menuId,
      { name, recipe, image, category, price },
      { new: true, runValidators: true }
    );

    if (!updatedMenu) {
      return sendError(res, 404, "Menu not found");
    }
    return sendSuccess(res, 200, updatedMenu, "Menu item updated");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = {
  getAllMenuItems,
  postMenuItem,
  deleteMenuItem,
  singleMenuItem,
  updateMenuItem,
};
