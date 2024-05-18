import { isValidObjectId } from "mongoose";
import contactsService from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await contactsService.listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(404).json({ message: "This identifier is not valid" });
  }

  try {
    const contact = await contactsService.getContactById(id);
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(404).json({ message: "This identifier is not valid" });
  }

  try {
    const deletedContact = await contactsService.removeContact(id);
    if (deletedContact) {
      res.status(200).json(deletedContact);
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const createdContact = await contactsService.addContact(name, email, phone);
    res.status(201).json(createdContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateContact = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(404).json({ message: "This identifier is not valid" });
  }

  try {
    const contact = await contactsService.getContactById(id);
    if (contact) {
      const { name, email, phone, favorite } = req.body;

      if (!name && !email && !phone && !favorite) {
        return res
          .status(400)
          .json({ message: "Body must have at least one field" });
      }

      await contactsService.updateContact(id, favorite, name, email, phone);
      const newContact = await contactsService.getContactById(id);
      res.status(200).json(newContact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateContactFavorite = async (req, res) => {
  const { id } = req.params;
  const { favorite } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(404).json({ message: "This identifier is not valid" });
  }

  try {
    const updatedContact = await contactsService.updateStatusContact(
      id,
      favorite
    );
    if (updatedContact === null) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};
