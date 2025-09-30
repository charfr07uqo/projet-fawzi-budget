/**
 * Générateur d'identifiants uniques - Fonctions utilitaires pour IDs uniques
 *
 * Fonctionnalités métier :
 * - Génération d'IDs vraiment uniques pour les entités
 * - Évite les collisions de timestamps simultanés
 * - IDs lisibles et cohérents pour le debugging
 *
 * Objectif : Fournir des identifiants fiables et uniques
 * pour éviter les conflits de clés React et assurer
 * l'intégrité des données dans l'application.
 *
 * @created 2025-09-30
 * @author Équipe Développement
 */

/**
 * Génère un identifiant unique basé sur timestamp et composant aléatoire
 * Utilise une combinaison de timestamp précis et séquence aléatoire
 * pour éviter les collisions même avec des créations simultanées
 *
 * @returns {string} Identifiant unique sous forme de string
 *
 * @example
 * // Sortie possible : "1759248147141-a7f3"
 * generateUniqueId()
 */
export function generateUniqueId() {
  const timestamp = Date.now()
  const randomSuffix = Math.random().toString(36).substring(2, 6)
  return `${timestamp}-${randomSuffix}`
}

/**
 * Génère un identifiant unique avec préfixe pour différencier les types d'entités
 * Ajoute un préfixe pour faciliter l'identification du type d'entité
 *
 * @param {string} prefix - Préfixe pour identifier le type (ex: 'expense', 'person')
 * @returns {string} Identifiant unique avec préfixe
 *
 * @example
 * // Sortie possible : "expense-1759248147141-a7f3"
 * generatePrefixedId('expense')
 */
export function generatePrefixedId(prefix) {
  const uniquePart = generateUniqueId()
  return `${prefix}-${uniquePart}`
}

/**
 * Générateur d'ID avec compteur séquentiel pour les sessions
 * Maintient un compteur en mémoire pour garantir l'unicité
 * même dans les millisecondes identiques
 */
class SequentialIdGenerator {
  constructor() {
    this.lastTimestamp = 0
    this.counter = 0
  }

  /**
   * Génère un ID séquentiel unique
   * @returns {string} ID séquentiel unique
   */
  generate() {
    const now = Date.now()

    if (now === this.lastTimestamp) {
      this.counter++
    } else {
      this.counter = 0
      this.lastTimestamp = now
    }

    return `${now}-${this.counter}`
  }
}

// Instance globale pour maintenir la continuité pendant la session
const sequentialGenerator = new SequentialIdGenerator()

/**
 * Génère un ID avec compteur séquentiel pour éviter toute collision
 * @returns {string} ID séquentiel garanti unique
 */
export function generateSequentialId() {
  return sequentialGenerator.generate()
}