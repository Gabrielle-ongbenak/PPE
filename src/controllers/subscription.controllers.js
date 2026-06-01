import mongoose from "mongoose";

import SubscriptionPayment from "../models/subscriptionPayment.model.js";
import User from "../models/user.model.js";
// import { verify } from "jsonwebtoken";

export const createPayment = async (req, res, next) => {
  try {
    const payment = await SubscriptionPayment.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      payment,
    });
  } catch (error) {
    next(error);
  }
};

export const webhook = async (req, res, next) => {
  try {
    // 1. Récupérer le paiement en base de données avec l'ID de l'URL
    const payment = await SubscriptionPayment.findById(req.params.id);

    // 2. Vérifier si le ticket de paiement existe
    if (!payment) {
      const error = new Error("Payment record not found");
      error.statusCode = 404;
      throw error;
    }

    // 3. Si le prestataire indique que le paiement a échoué
    if (req.body.status !== "SUCCESS") {
      payment.status = "rejected";
      await payment.save();

      return res.status(200).json({
        success: false,
        message: "Payment was rejected by the provider",
      });
    }

    // 4. Si le paiement est un succès: on met à jour le paiement
    payment.status = "completed";
    await payment.save();

    // 5. Récuéerer l'agent lié à ce paiement
    const user = await User.findById(payment.user);
    if (!user) {
      const error = new Error("User linked to this payment not found");
      error.statusCode = 404;
      throw error;
    }

    // 6. Calculer la date d'expiration (Date du jour + 30 jours)
    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + 30);

    // 7. Activer l'abonnement de l'agent
    user.subscriptionExpiresAt = expiredAt;
    user.subscriptionStatus = "active";
    await user.save();

    res.status(200).json({
      success: true,
      message: "Payment verified and user subscription activated successfully",
    });
  } catch (error) {
    next(error);
  }
};
