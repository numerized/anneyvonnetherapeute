import { Timestamp } from 'firebase/firestore';
import { User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { InvitePartnerForm } from '@/components/InvitePartnerForm';
import { UserProfileForm } from '@/components/UserProfileForm';
import { createOrUpdateUser, UserProfile } from '@/lib/userService';

// Simplified user type to avoid FirebaseUser dependency
interface UserInfo {
  uid?: string;
  email: string | null;
}

interface UserProfileSectionProps {
  user: UserInfo | null;
  userProfile: UserProfile | null;
  partnerProfile: UserProfile | null;
  onProfileUpdate: () => void;
}

export function UserProfileSection({
  user,
  userProfile,
  partnerProfile,
  onProfileUpdate,
}: UserProfileSectionProps) {
  // UI states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Function to handle photo click
  const handlePhotoClick = () => {
    setIsEditingProfile(true);
  };

  // Function to handle update profile
  const handleUpdateProfile = async (formData: Partial<UserProfile>) => {
    if (!user) return;

    try {
      setIsUpdatingProfile(true);
      
      const userData: UserProfile = {
        ...userProfile,
        ...formData,
        email: user.email || formData.email || '',
        updatedAt: Timestamp.now()
      };

      const updatedProfile = await createOrUpdateUser(userData);
      setIsEditingProfile(false);
      toast.success('Profil mis à jour avec succès');
      onProfileUpdate();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Function to handle invite partner
  const handleInvitePartner = async (email: string) => {
    if (!userProfile || !user) return;

    try {
      // Update the userProfile with the partner email
      await createOrUpdateUser({
        ...userProfile,
        partnerEmail: email,
        updatedAt: Timestamp.now()
      });

      setIsInviting(false);
      toast.success('Invitation envoyée avec succès');
      onProfileUpdate();
    } catch (error) {
      console.error('Error inviting partner:', error);
      toast.error('Erreur lors de l\'envoi de l\'invitation');
    }
  };

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
          <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
            <DialogContent className="bg-primary-forest border-primary-cream/20 text-primary-cream">
              <DialogHeader>
                <DialogTitle className="text-primary-coral">Modifier votre profil</DialogTitle>
                <DialogDescription className="text-primary-cream/60">
                  Mettez à jour vos informations personnelles
                </DialogDescription>
              </DialogHeader>
              <UserProfileForm
                user={userProfile}
                onSubmit={handleUpdateProfile}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Partner Profile Card */}
      <div className="rounded-lg border border-primary-cream/20 bg-primary-cream/10 p-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            {userProfile?.partnerEmail ? (
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-primary-cream/20">
                <div className="absolute inset-0 flex items-center justify-center text-primary-cream/60">
                  <UserIcon className="w-8 h-8" />
                </div>
              </div>
            ) : partnerProfile?.photo ? (
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-primary-cream/20">
                <Image
                  src={partnerProfile.photo}
                  alt="Partner Profile"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-primary-cream/20">
                <div className="absolute inset-0 flex items-center justify-center text-primary-cream/60">
                  <UserIcon className="w-8 h-8" />
                </div>
              </div>
            )}
          </div>
          <div className="flex-1">
            {userProfile?.partnerEmail ? (
              <h3 className="text-lg font-medium text-primary-cream">Votre Partenaire</h3>
            ) : partnerProfile ? (
              <>
                <h3 className="text-lg font-medium text-primary-cream">
                  {partnerProfile.firstName} {partnerProfile.lastName}
                </h3>
                <p className="text-sm text-primary-cream/60">{partnerProfile.email}</p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium text-primary-cream">Votre Partenaire</h3>
                <p className="text-sm text-primary-cream/60">Ajoutez votre partenaire ici et commencez votre parcours</p>
              </>
            )}
          </div>
          {userProfile?.partnerEmail ? (
            <p className="text-sm text-primary-cream/60">Invitation envoyée à {userProfile.partnerEmail}</p>
          ) : !partnerProfile && (
            <Button
              variant="outline"
              className="border-primary-cream/20 text-primary-cream hover:bg-primary-cream/10 hover:text-primary-coral"
              onClick={() => setIsInviting(true)}
            >
              INVITER
            </Button>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={isInviting} onOpenChange={setIsInviting}>
        <DialogContent className="bg-primary-forest border-primary-cream/20 text-primary-cream">
          <DialogHeader>
            <DialogTitle className="text-primary-coral">Inviter votre partenaire</DialogTitle>
            <DialogDescription className="text-primary-cream/60">
              Envoyez une invitation à votre partenaire pour commencer votre parcours ensemble
            </DialogDescription>
          </DialogHeader>
          <InvitePartnerForm onSubmit={handleInvitePartner} onClose={() => setIsInviting(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
