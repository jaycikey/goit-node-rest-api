import Contact from "../models/Contact.js";

async function listContacts(page = 1, limit = 10, favorite, ownerId) {
  const skip = (page - 1) * limit;
  let query = { owner: ownerId }; // Filter by owner
  if (favorite !== undefined) {
    query.favorite = favorite === "true";
  }
  return await Contact.find(query).skip(skip).limit(limit);
}

async function getContactById(contactId, ownerId) {
  return await Contact.findOne({ _id: contactId, owner: ownerId });
}

async function addContact({ name, email, phone, favorite = false }, ownerId) {
  return await Contact.create({ name, email, phone, favorite, owner: ownerId });
}

async function updateContact(contactId, updateData, ownerId) {
  return await Contact.findOneAndUpdate(
    { _id: contactId, owner: ownerId },
    updateData,
    { new: true }
  );
}

async function updateContactFavorite(contactId, favorite, ownerId) {
  return await Contact.findOneAndUpdate(
    { _id: contactId, owner: ownerId },
    { favorite },
    { new: true }
  );
}

async function removeContact(contactId, ownerId) {
  return await Contact.findOneAndDelete({ _id: contactId, owner: ownerId });
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateContactFavorite,
};
