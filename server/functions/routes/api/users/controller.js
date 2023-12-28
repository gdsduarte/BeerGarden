/* eslint-disable linebreak-style */
const firestoreService = require("../../../services/firestoreService");
const User = require("./model");

const getUsers = async (req, res) => {
  try {
    const users = await firestoreService.getDocuments("user");
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send("Error getting users: " + error.message);
  }
};

const getUser = async (req, res) => {
  try {
    const user = await firestoreService.getDocument("user", req.params.id);
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send("Error getting user: " + error.message);
  }
};

const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    const userData = {...user};
    const userId = await firestoreService.addDocument("user", userData);
    res.status(201).send({id: userId, ...userData});
  } catch (error) {
    res.status(500).send("Error creating user: " + error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await firestoreService.updateDocument("user", req.params.id, user);
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send("Error updating user: " + error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    await firestoreService.deleteDocument("user", req.params.id);
    res.status(200).send("User deleted");
  } catch (error) {
    res.status(500).send("Error deleting user: " + error.message);
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
