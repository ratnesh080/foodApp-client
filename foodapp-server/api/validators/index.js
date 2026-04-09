const createUserSchema = {
  body: {
    name: { required: true },
    email: { required: true, email: true },
  },
};

const createCartSchema = {
  body: {
    menuItemId: { required: true },
    name: { required: true },
    price: { required: true, number: true, min: 0 },
    quantity: { required: true, number: true, min: 1 },
  },
};

const updateCartSchema = {
  params: { id: { required: true, objectId: true } },
  body: { quantity: { required: true, number: true, min: 1 } },
};

const idParamSchema = {
  params: { id: { required: true, objectId: true } },
};

const emailParamSchema = {
  params: { email: { required: true, email: true } },
};

const emailQuerySchema = {
  query: { email: { required: true, email: true } },
};

const menuItemSchema = {
  body: {
    name: { required: true },
    category: { required: true },
    price: { required: true, number: true, min: 0 },
    recipe: { required: true },
    image: { required: true },
  },
};

const paymentCreateSchema = {
  body: {
    transactionId: { required: true },
    cartItems: { required: true, array: true, nonEmptyArray: true, objectIdArray: true },
  },
};

const paymentIntentSchema = {
  body: {
    cartItems: { required: true, array: true, nonEmptyArray: true, objectIdArray: true },
  },
};

const updateOrderStatusSchema = {
  params: { id: { required: true, objectId: true } },
  body: {
    status: {
      required: true,
      oneOf: ["Order pending", "Preparing", "On the way", "Delivered", "Cancelled"],
    },
  },
};

module.exports = {
  createUserSchema,
  createCartSchema,
  updateCartSchema,
  idParamSchema,
  emailParamSchema,
  emailQuerySchema,
  menuItemSchema,
  paymentCreateSchema,
  paymentIntentSchema,
  updateOrderStatusSchema,
};
