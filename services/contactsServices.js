import Contact from "../models/contact.js";

async function listContacts() {
  try {
    const data = await Contact.find();
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

async function getContactById(contactId) {
  try {
    const data = await Contact.findById(contactId);
    if (data === null) {
      return null;
    }
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

async function removeContact(contactId) {
  try {
    const data = await Contact.findByIdAndDelete(contactId);

    if (data === null) {
      return null;
    }
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

async function addContact(name, email, phone, favorite = false) {
  const newContact = {
    name: name,
    email: email,
    phone: phone,
    favorite: favorite,
  };
  try {
    const data = await Contact.create(newContact);

    return data;
  } catch (error) {
    throw new Error(error);
  }
}

async function updateContact(contactId, favorite, name, email, phone) {
  const updatableContact = await Contact.findById(contactId);
  if (updatableContact === null) {
    return null;
  }

  const newData = {
    name: name !== undefined ? name : updatableContact.name,
    email: email !== undefined ? email : updatableContact.email,
    phone: phone !== undefined ? phone : updatableContact.phone,
    favorite: favorite !== undefined ? favorite : updatableContact.favorite,
  };

  try {
    const result = await Contact.findByIdAndUpdate(contactId, newData, {
      new: true,
    });
    if (result === null) {
      return null;
    }
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

async function updateStatusContact(contactId, favorite) {
  try {
    const result = updateContact(contactId, favorite);
    if (result === null) {
      return null;
    }
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
