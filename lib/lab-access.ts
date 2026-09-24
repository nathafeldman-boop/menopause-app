// Allowlist restreinte au(x) compte(s) propriétaire : l'outil de lab expose le détail brut du
// raisonnement IA (confiance, preuves visuelles) et appelle Gemini sans passer par le contrôle
// d'abonnement — il ne doit jamais être accessible à une utilisatrice normale.
const LAB_ALLOWED_EMAILS = ["nathabuisseness@gmail.com", "marcnatha56@gmail.com"];

export function hasLabAccess(email: string | null | undefined): boolean {
  return !!email && LAB_ALLOWED_EMAILS.includes(email.toLowerCase());
}
