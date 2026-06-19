const { GoogleGenAI } = require('@google/genai');
const Publication = require('../models/Publication');

const chatWithAssitant = async (req, res) => {
    try {
        const { messages } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(200).json({
                response: "Je suis désolé, mais la clé d'API (GEMINI_API_KEY) pour l'assistant intelligent n'est pas configurée dans le serveur. Veuillez l'ajouter dans le fichier .env du backend."
            });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        const client = new GoogleGenAI({ apiKey });

        const lastMessage = messages?.[messages.length - 1]?.text || "Bonjour";

        let result;
        try {
            // Tentative avec le modèle 1.5 Flash (recommandé)
            result = await client.models.generateContent({
                model: 'gemini-3.5-flash',
                contents: [{ role: 'user', parts: [{ text: lastMessage }] }]
            });
        } catch (e) {
            console.log("Échec avec gemini-1.5-flash, tentative avec gemini-pro...");
            // Repli sur le modèle de base si 1.5 n'est pas disponible
            result = await client.models.generateContent({
                model: 'gemini-pro',
                contents: [{ role: 'user', parts: [{ text: lastMessage }] }]
            });
        }

        return res.status(200).json({
            response: result.text
        });

    } catch (error) {
        console.error('Erreur IA détaillée :', error);

        let userMessage = "Désolé, je rencontre une difficulté technique.";
        const errorMsg = error.message || "";

        if (errorMsg.includes('connect ETIMEDOUT') || errorMsg.includes('ENETUNREACH')) {
            userMessage = "L'assistant ne peut pas se connecter aux serveurs Google (problème réseau local). Cela fonctionnera une fois le projet mis en ligne.";
        } else if (errorMsg.includes('404')) {
            userMessage = "Modèle introuvable. Votre clé API n'a pas accès à Gemini 1.5 Flash ni à Gemini Pro. Essayez de créer une nouvelle clé sur Google AI Studio.";
        } else if (errorMsg.includes('403') || errorMsg.includes('401')) {
            userMessage = "Erreur d'authentification. Votre clé API est invalide ou restreinte.";
        } else {
            userMessage = `Erreur : ${errorMsg}`;
        }

        return res.status(200).json({
            response: userMessage,
            error: errorMsg
        });
    }
};

module.exports = {
    chatWithAssitant
};
