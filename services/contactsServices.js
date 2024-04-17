import fs from "fs/promises";
import { randomUUID } from "crypto";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contactsPath = path.join(__dirname, "../db/contacts.json");

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error while reading file: ${err}`);
    throw err; // Повторне викидання помилки для зовнішньої обробки
  }
}

// Отримання контакта за ID
async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const contact = contacts.find((contact) => contact.id === contactId);
    return contact || null;
  } catch (err) {
    console.error(`Error while getting contact by ID: ${err}`);
    throw err;
  }
}

// Видалення контакта за ID
async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index === -1) return null;

    const [removedContact] = contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return removedContact;
  } catch (err) {
    console.error(`Error while removing contact: ${err}`);
    throw err;
  }
}

// Створення нового контакту
async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();
    const newContact = {
      id: randomUUID(),
      name,
      email,
      phone,
    };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
  } catch (err) {
    console.error(`Error while adding new contact: ${err}`);
    throw err;
  }
}
async function updateContact(contactId, updatedData) {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index === -1) {
      return null; // Якщо контакт не знайдено, повертаємо null
    }

    // Оновлення даних контакту зберігаючи старі дані
    contacts[index] = { ...contacts[index], ...updatedData };

    // Запис оновленого списку контактів у файл
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return contacts[index]; // Повертаємо оновлений контакт
  } catch (err) {
    console.error(`Error while updating contact: ${err}`);
    throw err;
  }
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
