import * as fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const contactsPath = path.resolve("db", "contacts.json");

async function readFile() {
  const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
  return JSON.parse(data);
}

async function writeFile(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
}

async function listContacts() {
  const contacts = readFile();
  return contacts;
}

async function getContactById(contactId) {
  const contacts = await readFile();
  const contact = contacts.find((contact) => contact.id === contactId);

  if (typeof contact === "undefined") {
    return null;
  }

  return contact;
}

async function removeContact(contactId) {
  const contacts = await readFile();
  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index === -1) {
    return null;
  }

  const removedContact = contacts[index];

  const newContacts = contacts.filter((contact) => contact.id !== contactId);

  await writeFile(newContacts);

  return removedContact;
}

async function addContact(name, email, phone) {
  const contacts = await readFile();

  const newContact = { name, email, phone, id: crypto.randomUUID() };

  contacts.push(newContact);

  await writeFile(contacts);

  return newContact;
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
