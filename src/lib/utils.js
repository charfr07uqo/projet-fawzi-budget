/**
 * Utilitaires partagés - Fonctions utilitaires communes
 *
 * Fonctionnalités métier :
 * - Fonctions d'aide pour les classes CSS
 * - Utilitaires de manipulation de données
 * - Fonctions de formatage communes
 *
 * Objectif : Fournir des utilitaires réutilisables
 * dans toute l'application pour éviter la duplication de code.
 *
 * @created 2025-09-29
 * @author Équipe Développement
 */

import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}