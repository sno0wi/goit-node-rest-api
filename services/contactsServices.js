import Contact from "../models/contact.js";

async function listContacts(filter) {
  try {
    const data = await Contact.find(filter);
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

async function getContactById(contactId, ownerId) {
  try {
    const data = await Contact.findOne({ _id: contactId, owner: ownerId });
    if (data === null) {
      return null;
    }
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

async function removeContact(contactId, ownerId) {
  try {
    const data = await Contact.findByIdAndDelete({
      _id: contactId,
      owner: ownerId,
    });

    if (data === null) {
      return null;
    }
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

async function addContact(ownerId, name, email, phone, favorite = false) {
  const newContact = {
    name: name,
    email: email,
    phone: phone,
    favorite: favorite,
    owner: ownerId,
  };
  try {
    const data = await Contact.create(newContact);

    return data;
  } catch (error) {
    throw new Error(error);
  }
}

async function updateContact(contactId, ownerId, favorite, name, email, phone) {
  const updatableContact = await Contact.findById({
    _id: contactId,
    owner: ownerId,
  });
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

async function updateStatusContact(contactId, ownerId, favorite) {
  try {
    const result = updateContact(contactId, ownerId, favorite);
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
