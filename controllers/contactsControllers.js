import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateContactFavorite,
} from "../services/contactsServices.js";

export const getAllContacts = async (req, res, next) => {
  const { page, limit, favorite } = req.query;
  const ownerId = req.user._id;
  try {
    const contacts = await listContacts(
      parseInt(page),
      parseInt(limit),
      favorite,
      ownerId
    );
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  const ownerId = req.user._id;
  try {
    const contact = await getContactById(id, ownerId);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  const ownerId = req.user._id;
  try {
    const contact = await removeContact(id, ownerId);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const ownerId = req.user._id;
  try {
    const { name, email, phone } = req.body;
    const newContact = await addContact({ name, email, phone }, ownerId);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContactController = async (req, res, next) => {
  const { id } = req.params;
  const ownerId = req.user._id;
  try {
    const updatedContact = await updateContact(id, req.body, ownerId);
    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
};

export const updateFavorite = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  const ownerId = req.user._id;

  try {
    const updatedContact = await updateContactFavorite(
      contactId,
      favorite,
      ownerId
    );
    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
};
