import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateContactFavorite,
} from "../controllers/contactsControllers.js";

import {
  createContactSchema,
  updateContactSchema,
  updateContactFavoriteSchema,
} from "../schemas/contactsSchemas.js";

import validateBody from "../helpers/validateBody.js";

import authMiddleware from "../middlewares/auth.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authMiddleware, getAllContacts);

contactsRouter.get("/:id", authMiddleware, getOneContact);

contactsRouter.delete("/:id", authMiddleware, deleteContact);

contactsRouter.post(
  "/",
  authMiddleware,
  validateBody(createContactSchema),
  createContact
);

contactsRouter.put(
  "/:id",
  authMiddleware,
  validateBody(updateContactSchema),
  updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  authMiddleware,
  validateBody(updateContactFavoriteSchema),
  updateContactFavorite
);

export default contactsRouter;
