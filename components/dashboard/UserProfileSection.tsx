import { Timestamp } from 'firebase/firestore'
import { Loader2, Pencil, User as UserIcon } from 'lucide-react'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { UserProfileForm } from '@/components/UserProfileForm'
import {
  createOrUpdateUser,
  updatePartnerProfile,
  UserProfile,
} from '@/lib/userService'

// Simplified user type to avoid FirebaseUser dependency
interface UserInfo {
  uid?: string
  email: string | null
}

interface UserProfileSectionProps {
  user: UserInfo | null
  partner: UserInfo | null
  userProfile: UserProfile | null
  partnerProfile: UserProfile | null
  onProfileUpdate: () => void
}

export function UserProfileSection({
  user,
  partner,
  userProfile,
  partnerProfile,
  onProfileUpdate,
}: UserProfileSectionProps) {
  // UI states
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingPartnerProfile, setIsEditingPartnerProfile] = useState(false)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Function to handle photo click
  const handlePhotoClick = () => {
    setIsEditingProfile(true)
  }

  // Function to handle partner photo click
  const handlePartnerPhotoClick = () => {
    setIsEditingPartnerProfile(true)
  }

  // Function to handle update profile
  const handleUpdateProfile = async (
    formData: Partial<UserProfile>,
    isPartner: boolean = false,
  ) => {
    if (!user) return

    // Clear any existing timeout first
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
      updateTimeoutRef.current = null
    }

    try {
      setIsUpdatingProfile(true)

      // Set a timeout to show an error if the update takes too long (15 seconds)
      updateTimeoutRef.current = setTimeout(() => {
        setIsUpdatingProfile(false)
        toast.error(
          'La mise à jour a pris trop de temps. Veuillez réessayer.',
          {
            duration: 5000,
            style: {
              backgroundColor: '#7f1d1d',
              color: 'white',
            },
          },
        )
      }, 15000)

      // Create the updated profile data
      const updatedData = isPartner
        ? {
            ...partnerProfile,
            ...formData,
            updatedAt: Timestamp.now(),
          }
        : {
            ...userProfile,
            ...formData,
            id: user.uid,
            email: user.email || formData.email || '',
            updatedAt: Timestamp.now(),
          }

      // Check for network connectivity before attempting the update
      if (!navigator.onLine) {
        throw new Error(
          'Vous êtes hors ligne. Veuillez vérifier votre connexion internet.',
        )
      }

      // Update the server in the background
      if (isPartner) {
        await updatePartnerProfile(user.uid!, updatedData)
      } else {
        await createOrUpdateUser(updatedData)
      }

      // Clear the timeout since the update succeeded
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
        updateTimeoutRef.current = null
      }

      toast.success('Profil mis à jour avec succès', {
        duration: 3000,
      })

      // Close dialogs only after successful update
      if (isPartner) {
        setIsEditingPartnerProfile(false)
      } else {
        setIsEditingProfile(false)
      }

      // Only trigger a full refresh after the server update is complete
      onProfileUpdate()
    } catch (error) {
      console.error('Error updating profile:', error)

      // Clear the timeout since we already know there's an error
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
        updateTimeoutRef.current = null
      }

      // Determine error message based on type
      let errorMessage = 'Erreur lors de la mise à jour du profil'

      if (!navigator.onLine) {
        errorMessage =
          'Vous êtes hors ligne. Veuillez vérifier votre connexion internet.'
      } else if (error instanceof Error) {
        // If it's a network error or Firebase error with a specific message
        if (
          error.message.includes('network') ||
          error.message.includes('conn')
        ) {
          errorMessage =
            'Problème de connexion réseau. Veuillez vérifier votre connexion internet.'
        }
      }

      toast.error(errorMessage, {
        duration: 4000,
      })

      // If there was an error, reopen the edit dialog
      if (isPartner) {
        setIsEditingPartnerProfile(true)
      } else {
        setIsEditingProfile(true)
      }
    } finally {
      // Make absolutely sure the timeout is cleared
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
        updateTimeoutRef.current = null
      }
      setIsUpdatingProfile(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* User Profile Card */}
      <div className="rounded-lg border border-primary-cream/20 bg-primary-cream/10 p-6">
        <div className="flex items-center gap-4">
          <div
            onClick={handlePhotoClick}
            className="relative w-16 h-16 rounded-full overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          >
            {userProfile?.photo ? (
              <Image
                src={userProfile.photo}
                alt="Photo de profil"
                className="object-cover"
                fill
                sizes="64px"
              />
            ) : (
              <div className="w-full h-full bg-primary-cream/10 flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-primary-cream/60" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-medium text-primary-cream">
              {userProfile?.firstName} {userProfile?.lastName}
            </h2>
            <p className="text-sm text-primary-cream/60">{user?.email}</p>
          </div>
          <Button
            variant="outline"
            className="border-primary-cream/20 text-primary-cream hover:bg-primary-cream/10 hover:text-primary-coral"
            onClick={handlePhotoClick}
            disabled={isUpdatingProfile}
          >
            {isUpdatingProfile ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Mise à jour...
              </>
            ) : (
              <>
                <Pencil className="w-4 h-4 lg:hidden" />
                <span className="hidden lg:inline">Modifier</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Partner Profile Card */}
      <div className="rounded-lg border border-primary-cream/20 bg-primary-cream/10 p-6">
        <div className="flex items-center gap-4">
          <div
            onClick={handlePartnerPhotoClick}
            className="relative w-16 h-16 rounded-full overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          >
            {partnerProfile?.photo ? (
              <Image
                src={partnerProfile.photo}
                alt="Photo de profil du partenaire"
                className="object-cover"
                fill
                sizes="64px"
              />
            ) : (
              <div className="w-full h-full bg-primary-cream/10 flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-primary-cream/60" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-primary-cream">
              {partnerProfile
                ? `${partnerProfile.firstName} ${partnerProfile.lastName}`
                : 'Votre Partenaire'}
            </h3>
            <p className="text-sm text-primary-cream/60">
              {partnerProfile?.email ||
                'Ajoutez les informations de votre partenaire'}
            </p>
          </div>
          <Button
            variant="outline"
            className="border-primary-cream/20 text-primary-cream hover:bg-primary-cream/10 hover:text-primary-coral"
            onClick={handlePartnerPhotoClick}
            disabled={isUpdatingProfile}
          >
            {isUpdatingProfile ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Mise à jour...
              </>
            ) : (
              <>
                <Pencil className="w-4 h-4 lg:hidden" />
                <span className="hidden lg:inline">
                  {partnerProfile ? 'Modifier' : 'Ajouter'}
                </span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* User Profile Edit Dialog */}
      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent className="bg-primary-forest border-primary-cream/20 text-primary-cream">
          <DialogHeader>
            <DialogTitle className="text-primary-coral">
              Modifier votre profil
            </DialogTitle>
            <DialogDescription className="text-primary-cream/60">
              Mettez à jour vos informations personnelles
            </DialogDescription>
          </DialogHeader>
          <UserProfileForm
            user={userProfile}
            onSubmit={(data) => handleUpdateProfile(data, false)}
            isPartner={false}
          />
        </DialogContent>
      </Dialog>

      {/* Partner Profile Edit Dialog */}
      <Dialog
        open={isEditingPartnerProfile}
        onOpenChange={setIsEditingPartnerProfile}
      >
        <DialogContent className="bg-primary-forest border-primary-cream/20 text-primary-cream">
          <DialogHeader>
            <DialogTitle className="text-primary-coral">
              {partnerProfile
                ? 'Modifier le profil du partenaire'
                : 'Ajouter le profil du partenaire'}
            </DialogTitle>
            <DialogDescription className="text-primary-cream/60">
              {partnerProfile
                ? 'Mettez à jour les informations du partenaire'
                : 'Remplissez les informations de votre partenaire'}
            </DialogDescription>
          </DialogHeader>
          <UserProfileForm
            user={{
              ...partnerProfile,
              email: partnerProfile?.email || '',
            }}
            onSubmit={(data) => handleUpdateProfile(data, true)}
            isPartner={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
