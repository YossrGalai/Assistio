const express = require("express");
const Groq = require("groq-sdk").default;
const router = express.Router();

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

router.post("/", async (req, res) => {
  const { question } = req.body;
  if (!question || typeof question !== "string") {
    return res.status(400).json({ message: "Question requise" });
  }

  console.log("❓ Question reçue:", question);
  console.log("🔑 Clé Groq présente:", !!process.env.GROQ_API_KEY);

  try {
    let answer;
    let source;
    if (groq && process.env.GROQ_API_KEY) {
      console.log("🚀 Tentative Groq API...");
      answer = await getAnswerFromGroq(question);
      source = "groq";
      console.log("✅ Réponse Groq reçue");
    } else {
      console.log("⚠️ Groq non disponible, utilisation fallback");
      answer = getChatbotAnswer(question);
      source = "fallback";
    }
    res.json({ answer, source });
  } catch (error) {
    console.warn("❌ Groq error, using fallback:", error.message);
    const fallbackAnswer = getChatbotAnswer(question);
    res.json({ answer: fallbackAnswer, source: "fallback" });
  }
});

async function getAnswerFromGroq(question) {
  try {
    console.log("📤 Envoi à Groq:", question);
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "Tu es un assistant intelligent pour la plateforme Assistio. Réponds en français de manière utile et concise. Si la question n'est pas liée à Assistio, invite l'utilisateur à poser une question pertinente.",
        },
        { role: "user", content: question },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });
    const answer = response.choices[0].message.content.trim();
    console.log("📥 Réponse Groq reçue:", answer.substring(0, 50) + "...");
    return answer;
  } catch (error) {
    console.error("❌ Groq API failed:", error.message);
    console.error("Error code:", error.code || "N/A");
    throw error;
  }
}

function getChatbotAnswer(question) {
  const normalized = question.trim().toLowerCase();

  //  Salutation
  if (
    normalized.includes("bonjour") ||
    normalized.includes("salut") ||
    normalized.includes("hello") ||
    normalized.includes("aide")
  ) {
    return "Bonjour 👋 Je suis l'assistant Assistio. Posez-moi une question sur le site (compte, demandes, paiement, etc.).";
  }

  //  Inscription
  if (
    normalized.includes("inscript") ||
    normalized.includes("compte") ||
    normalized.includes("enregistrer")
  ) {
    return "Pour créer un compte, cliquez sur 'S'inscrire' puis remplissez le formulaire. Vous pourrez ensuite publier ou répondre aux demandes.";
  }

  //  Connexion
  if (
    normalized.includes("connexion") ||
    normalized.includes("login") ||
    normalized.includes("se connecter")
  ) {
    return "Cliquez sur 'Se connecter' en haut à droite et entrez vos identifiants. En cas d’oubli, utilisez la récupération par email.";
  }

  //  Publier demande
  if (
    normalized.includes("demande") ||
    normalized.includes("publier") ||
    normalized.includes("service")
  ) {
    return "Allez sur 'Publier une demande', ajoutez une description, une catégorie et votre localisation pour recevoir des offres.";
  }

  //  Prestataire
  if (
    normalized.includes("prestataire") ||
    normalized.includes("trouver quelqu")
  ) {
    return "Les prestataires peuvent répondre à votre demande. Consultez leurs profils et choisissez celui qui vous convient.";
  }

  //  Carte
  if (
    normalized.includes("carte") ||
    normalized.includes("map") ||
    normalized.includes("localisation")
  ) {
    return "La carte montre les demandes autour de vous. Utilisez les filtres pour affiner les résultats.";
  }

  //  Notifications
  if (
    normalized.includes("notification") ||
    normalized.includes("alerte")
  ) {
    return "Les notifications apparaissent dans la cloche 🔔 et vous informent des nouvelles activités sur vos demandes.";
  }

  //  Messages
  if (
    normalized.includes("message") ||
    normalized.includes("discussion") ||
    normalized.includes("chat")
  ) {
    return "Vous pouvez discuter avec les utilisateurs via le chat après avoir répondu à une demande.";
  }

  //  Profil
  if (normalized.includes("profil")) {
    return "Votre profil contient vos informations, vos avis et votre historique. Vous pouvez le modifier à tout moment.";
  }

  //  Avis
  if (
    normalized.includes("avis") ||
    normalized.includes("note") ||
    normalized.includes("évaluation")
  ) {
    return "Après un service, vous pouvez laisser un avis et une note pour aider les autres utilisateurs.";
  }

  //  Paiement
  if (
    normalized.includes("paiement") ||
    normalized.includes("payer") ||
    normalized.includes("prix")
  ) {
    return "Le paiement se fait directement entre utilisateurs selon l'accord convenu. Vérifiez toujours les détails avant.";
  }

  //  Supprimer compte
  if (
    normalized.includes("supprimer") ||
    normalized.includes("delete compte")
  ) {
    return "Pour supprimer votre compte, contactez le support ou utilisez les paramètres si cette option est disponible.";
  }

  //  Sécurité
  if (
    normalized.includes("sécurité") ||
    normalized.includes("arnaque") ||
    normalized.includes("fake")
  ) {
    return "Ne partagez jamais vos informations sensibles. Vérifiez les profils et privilégiez les utilisateurs bien notés.";
  }

  //  Problème technique
  if (
    normalized.includes("bug") ||
    normalized.includes("problème") ||
    normalized.includes("erreur")
  ) {
    return "Essayez de rafraîchir la page ou reconnectez-vous. Si le problème persiste, contactez le support.";
  }

  //  Contact
  if (
    normalized.includes("contact") ||
    normalized.includes("support")
  ) {
    return "Vous pouvez contacter le support via la page Contact du site.";
  }

  //  Fallback
  return "Je ne suis pas sûr de comprendre 🤔 Essayez une question sur : compte, demandes, carte, paiement ou profil.";
}

module.exports = router;
