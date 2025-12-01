import * as userService from '../services/userService.js';

export const getProfile = async (req, res, next) => {
  try {
    const result = await userService.getProfile(req.user.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const result = await userService.updateProfile(req.user.id, req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const result = await userService.deleteAccount(req.user.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getContacts = async (req, res, next) => {
  try {
    const result = await userService.getContacts(req.user.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const created = await userService.createContact(req.user.id, req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const contactId = Number(req.params.contactId);
    const updated = await userService.updateContact(req.user.id, contactId, req.body);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const contactId = Number(req.params.contactId);
    const result = await userService.deleteContact(req.user.id, contactId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
