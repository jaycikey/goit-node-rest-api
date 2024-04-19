import Contact from "../models/Contact.js";

async function listContacts() {
  return await Contact.find({});
}

async function getContactById(contactId) {
  return await Contact.findById(contactId);
}

async function addContact(name, email, phone, favorite = false) {
  return await Contact.create({ name, email, phone, favorite });
}

async function updateContact(contactId, updateData) {
  return await Contact.findByIdAndUpdate(contactId, updateData, { new: true });
}

async function updateContactFavorite(contactId, favorite) {
  return await Contact.findByIdAndUpdate(
    contactId,
    { favorite },
    { new: true }
  );
}

async function removeContact(contactId) {
  return await Contact.findByIdAndDelete(contactId);
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateContactFavorite,
};
