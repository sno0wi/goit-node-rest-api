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
  try {
    const { id } = req.params;

    const contact = await contactsService.getContactById(id);
    res.status(200).json(contact);
  } catch (error) {
    res.status(404).json({ message: "Not found" });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContact = await contactsService.removeContact(id);
    if (deletedContact) {
      res.status(200).json(deletedContact);
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    res.status(404).json({ message: "Not found" });
  }
};

export const createContact = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const createdContact = await contactsService.addContact(name, email, phone);
    res.status(200).json(createdContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    if (name === undefined && email === undefined && phone === undefined) {
      res.status(400).json({ message: "Body must have at least one field" });
    }

    const updatedContact = await contactsService.updateContact(
      id,
      name,
      email,
      phone
    );
    const newContact = await contactsService.getContactById(id);
    res.status(200).json(newContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
