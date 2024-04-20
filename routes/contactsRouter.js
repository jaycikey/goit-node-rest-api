import express from "express";
import authenticate from "../middleware/authenticate.js";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContactController,
  updateFavorite,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import validateQuery from "../helpers/validateQuery.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";
import paginationSchema from "../schemas/paginationSchema.js";

const contactsRouter = express.Router();

contactsRouter.get(
  "/",
  authenticate,
  validateQuery(paginationSchema),
  getAllContacts
);

contactsRouter.get("/:id", authenticate, getOneContact);

contactsRouter.delete("/:id", authenticate, deleteContact);

contactsRouter.post(
  "/",
  authenticate,
  validateBody(createContactSchema),
  createContact
);

contactsRouter.put(
  "/:id",
  authenticate,
  validateBody(updateContactSchema),
  updateContactController
);

contactsRouter.patch(
  "/:contactId/favorite",
  authenticate,
  validateBody(updateFavoriteSchema),
  updateFavorite
);

export default contactsRouter;
