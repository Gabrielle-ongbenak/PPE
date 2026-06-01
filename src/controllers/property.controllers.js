import mongoose from "mongoose";

import Property from "../models/property.model.js";

export const createProperty = async (req, res, next) => {
  try {
    if (!req.user.isAuthorized || req.user.subscriptionStatus === "inactive") {
      const error = new Error("Not authorize to create a property");
      error.statusCode = 403;
      throw error;
    }

    const property = await Property.create({
      ...req.body,
      postedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Property created successfuly",
      property,
    });
  } catch (error) {
    next(error);
  }
};

export const getProperties = async (req, res, next) => {
  try {
    // 1. Récupérer le logement et y lier les infos de l'agent
    const properties = await Property.find().populate("postedBy", "name email");

    res.status(200).json({
      success: true,
      message: "Fetching properties succeded",
      properties,
    });
  } catch (error) {
    next(error);
  }
};

export const getProperty = async (req, res, next) => {
  try {
    // 1. Récupérer le logement et y lier les infos de l'agent
    const property = await Property.findById(req.params.id).populate(
      "postedBy",
      "name email",
    );

    // 2. Vérifier si le logement existe
    if (!property) {
      const error = new Error("Resource not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      const error = new Error("Resource not found");
      error.statusCode = 404;
      throw error;
    }

    // Check if the querry initiator is actually the owner of the property
    if (!property.postedBy.equals(req.user._id)) {
      const error = new Error("You are not authorized to update this property");
      error.statusCode = 403;
      throw error;
    }

    // Update
    const newProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      message: "Property correctly updated",
      newProperty,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      const error = new Error("Resource not found");
      error.statusCode = 404;
      throw error;
    }

    if (!property.postedBy.equals(req.user._id)) {
      const error = new Error("You are not authorized to delete this property");
      error.statusCode = 403;
      throw error;
    }

    await property.deleteOne();

    res.status(200).json({
      success: true,
      message: "Property deleted correctly",
    });
  } catch (error) {
    next(error);
  }
};
