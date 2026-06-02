import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("La clé d'API GEMINI_API_KEY est manquante.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build-vercel',
        }
      }
    });
  }
  return aiClient;
}

export default async function handler(req: any, res: any) {
  // Set CORS headers for Vercel serverless functions
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, userProfile, conventions, requests } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Le paramètre messages est requis." });
    }

    let ai;
    try {
      ai = getGeminiClient();
    } catch (err: any) {
      return res.json({
        reply: "Bonjour ! Je suis l'Assistant Social de l'AOS. Pour que je puisse vous répondre de manière intelligente en utilisant l'IA Gemini, veuillez s'il vous plaît configurer la variable d'environnement GEMINI_API_KEY dans vos paramètres Vercel.",
        error: "GEMINI_API_KEY_MISSING"
      });
    }

    const userName = userProfile ? `${userProfile.prenom} ${userProfile.name}` : "Adhérent";
    const delegation = userProfile ? userProfile.delegation : "Non spécifiée";
    const userStatus = userProfile ? userProfile.cotisationStatus : "inactive";
    const matricule = userProfile ? userProfile.matricule : "Inconnu";
    const grade = userProfile ? userProfile.grade : "Collaborateur";

    const systemInstruction = `
      Vous êtes l'Assistant Coordinateur Social Virtuel de l'AOS (Association des Œuvres Sociales) de l'ANAPEC.
      Votre mission est d'aider les adhérents (collaborateurs de l'ANAPEC au Maroc) en répondant à leurs interrogations sur les prestations sociales, conventions de partenariat, critères d'éligibilité et procédures d'octroi de subventions.

      CONTEXTE DE L'ADHÉRENT CONNECTÉ :
      - Nom de l'adhérent : ${userName}
      - Matricule : ${matricule}
      - Délégation d'affectation : ${delegation}
      - Grade/Fonction : ${grade}
      - Statut de la cotisation : ${userStatus === 'active' ? 'ACTIVE (À jour de ses cotisations)' : 'INACTIVE (Non à jour de sa cotisation annuelle)'}

      LISTE DES CONVENTIONS ACTUELLES DE L'AOS :
      ${JSON.stringify(conventions || [], null, 2)}

      HISTORIQUE DES DEMANDES DE L'ADHÉRENT (Actuelles) :
      ${JSON.stringify(requests || [], null, 2)}

      RÈGLES DE CONDUITE :
      1. Soyez extrêmement chaleureux, professionnel, poli, et dévoué à l'accompagnement social !
      2. Communiquez en français ou en arabe selon la langue de l'utilisateur. S'il écrit en arabe, répondez-lui en arabe littéraire fluide et poli.
      3. Pour bénéficier de TOUTES les prestations sociales (Estivage, Aïd El Adha, Prêts, Aide Pèlerinage, etc.) ou conventions, l'adhérent doit avoir un statut de cotisation ACTIVE. Si son statut est INACTIVE, rappelez-lui gentiment et poliment qu'il doit régulariser sa cotisation annuelle auprès de la délégation sociale pour débloquer ses avantages.
      4. Si l'adhérent pose des questions sur ses demandes en cours, référez-vous STRICTEMENT à l'historique fourni ci-dessus (par exemple une subvention d'estivage ou dossier médical) et donnez-lui son statut exact (approuvé, rejeté, en attente) avec les montants s'ils sont approuvés.
      5. Expliquez les 5 grandes catégories de prestations de l'AOS :
         - Estivage : Subventions pour campings d'été ou centres d'estivage de prestige (Saïdia, M'diq, Al Hoceima, Ifrane, Agadir).
         - Aïd Al-Adha : Aide financière exceptionnelle de 2,000 DH versée d'ici fin Mai.
         - Prêt social : Prêt solidaire de trésorerie sans intérêt (jusqu'à 15,000 DH remboursables sur 18 mois).
         - Dossier médical : Prise en charge complémentaire des soins (optique, dentaire, cliniques).
         - Pèlerinage : Prime forfaitaire de participation de 10,000 DH liée au tirage au sort national.
      6. Restez humble, transparent et amical. N'inventez pas de montants imaginaires. Adoptez une structure de réponse claire, aérée, en utilisant le formatage Markdown.
    `;

    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const reply = response.text || "Pardon, je n'ai pas pu formuler de réponse. Veuillez réessayer.";
    res.json({ reply });
  } catch (err: any) {
    console.error("Vercel Serverless Function Error:", err);
    res.status(500).json({ error: err.message || "Une erreur interne est survenue sur le serveur de discussion." });
  }
}
