import Joi from "joi";

export const storeSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  instagram: Joi.string().required(),
  whatsApp: Joi.string().required(),
  address: Joi.string().required(),
  business_hours: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8),
});

export const ProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow("").optional(),
  price: Joi.number().positive().required(),
  category_id: Joi.number().integer().required(),
  subcategory_id: Joi.number().integer().optional(),
  variants: Joi.array().items(
    Joi.object({
      color: Joi.string().allow(null).uppercase(),
      size: Joi.string().uppercase(),
      stock: Joi.number().integer().min(0).required(),
    }),
  ),
});

export const reviewSchema = Joi.object({
  author_name: Joi.string().required(),
  comment: Joi.string().optional(),
  rating: Joi.number().integer().required().min(1).max(5),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const CheckoutSchema = Joi.object({
  full_name: Joi.string().required(),
  address: Joi.string().empty("").default(null),
  whatsApp: Joi.string()
    .pattern(/^[0-9]{11}$/)
    .required(),

  items: Joi.array()
    .items(
      Joi.object({
        variantId: Joi.number().required(),
        quantity: Joi.number().min(1).required(),
      }),
    )
    .min(1)
    .required(),
});
