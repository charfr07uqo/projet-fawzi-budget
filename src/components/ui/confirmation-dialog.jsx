/**
 * Composant de dialogue de confirmation avec compte à rebours - Interface de confirmation interactive
 *
 * Fonctionnalités métier :
 * - Affichage d'un message de confirmation personnalisé
 * - Compte à rebours visuel de 5 secondes avant exécution automatique
 * - Bouton d'annulation pour interrompre l'action
 * - Interface accessible avec gestion du clavier
 * - Animation de progression du compte à rebours
 *
 * Objectif : Fournir une expérience utilisateur intuitive pour les actions
 * destructives, permettant à l'utilisateur de confirmer ou annuler
 * l'opération avec un mécanisme de sécurité temporelle.
 *
 * @created 2025-09-30
 * @author Équipe Développement
 */

import { useState, useEffect } from 'react'
import { Button } from './button.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog.jsx'
import { AlertTriangle, Clock, X } from 'lucide-react'

/**
 * Composant de dialogue de confirmation avec compte à rebours
 * @param {object} props - Propriétés du composant
 * @param {boolean} props.isOpen - État d'ouverture du dialogue
 * @param {string} props.title - Titre du dialogue
 * @param {string} props.message - Message de confirmation
 * @param {string} props.confirmText - Texte du bouton de confirmation (optionnel)
 * @param {string} props.cancelText - Texte du bouton d'annulation (optionnel)
 * @param {Function} props.onConfirm - Fonction appelée lors de la confirmation
 * @param {Function} props.onCancel - Fonction appelée lors de l'annulation
 * @param {number} props.countdownSeconds - Durée du compte à rebours en secondes (par défaut: 5)
 * @returns {JSX.Element} Dialogue de confirmation
 */
function ConfirmationDialog({
  isOpen,
  title = 'Confirmation requise',
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  onConfirm,
  onCancel,
  countdownSeconds = 5
}) {
  const [timeLeft, setTimeLeft] = useState(countdownSeconds)
  const [isActive, setIsActive] = useState(false)

  // Réinitialise le compte à rebours quand le dialogue s'ouvre
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(countdownSeconds)
      setIsActive(true)
    } else {
      setIsActive(false)
    }
  }, [isOpen, countdownSeconds])

  // Gestion du compte à rebours
  useEffect(() => {
    let interval = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (isActive && timeLeft === 0) {
      // Auto-confirme quand le compte à rebours arrive à zéro
      handleConfirm()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft])

  /**
   * Gère la confirmation de l'action
   * Appelle la fonction onConfirm et ferme le dialogue
   */
  const handleConfirm = () => {
    setIsActive(false)
    onConfirm()
  }

  /**
   * Gère l'annulation de l'action
   * Appelle la fonction onCancel et ferme le dialogue
   */
  const handleCancel = () => {
    setIsActive(false)
    onCancel()
  }

  /**
   * Gère la fermeture du dialogue
   * Appelle la fonction onCancel
   */
  const handleClose = () => {
    setIsActive(false)
    onCancel()
  }

  // Calcule le pourcentage de progression pour l'animation circulaire
  const progressPercentage = ((countdownSeconds - timeLeft) / countdownSeconds) * 100

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-left">
            {message}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-4">
          {/* Animation du compte à rebours circulaire */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-muted flex items-center justify-center">
              <Clock className="w-6 h-6 text-muted-foreground" />
            </div>
            {/* Cercle de progression SVG */}
            <svg className="absolute top-0 left-0 w-16 h-16 -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="100, 100"
                className="text-muted-foreground/20"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${progressPercentage}, 100`}
                className="text-destructive transition-all duration-1000 ease-linear"
              />
            </svg>
            {/* Texte du compte à rebours */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-mono font-bold text-destructive">
                {timeLeft}
              </span>
            </div>
          </div>

          {/* Message d'information sur le compte à rebours */}
          <p className="text-sm text-muted-foreground text-center">
            {timeLeft > 0 ? (
              `L'action sera automatiquement confirmée dans ${timeLeft} seconde${timeLeft > 1 ? 's' : ''}`
            ) : (
              'Confirmation automatique...'
            )}
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={timeLeft === 0}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            className="flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { ConfirmationDialog }