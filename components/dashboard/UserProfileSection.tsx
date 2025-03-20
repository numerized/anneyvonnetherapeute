import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserProfileForm } from '@/components/UserProfileForm';
import { createOrUpdateUser, updatePartnerProfile, UserProfile } from '@/lib/userService';
import { Timestamp } from 'firebase/firestore';
import { User as UserIcon, Pencil } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

// Simplified user type to avoid FirebaseUser dependency
interface UserInfo {
  uid?: string;
  email: string | null;
}

interface UserProfileSectionProps {
  user: UserInfo | null;
  partner: UserInfo | null;
  userProfile: UserProfile | null;
  partnerProfile: UserProfile | null;
  onProfileUpdate: () => void;
}

export function UserProfileSection({
  user,
  partner,
  userProfile,
  partnerProfile,
  onProfileUpdate,
}: UserProfileSectionProps) {
  // UI states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPartnerProfile, setIsEditingPartnerProfile] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Function to handle photo click
  const handlePhotoClick = () => {
    setIsEditingProfile(true);
  };

  // Function to handle partner photo click
  const handlePartnerPhotoClick = () => {
    setIsEditingPartnerProfile(true);
  };

  // Function to handle update profile
  const handleUpdateProfile = async (formData: Partial<UserProfile>, isPartner: boolean = false) => {
    if (!user) return;

    try {
      setIsUpdatingProfile(true);
      
      if (isPartner) {
        // Update partner profile as nested object in main user's document
        await updatePartnerProfile(user.uid!, {
          ...formData,
          updatedAt: Timestamp.now()
        });
      } else {
        // Update main user profile
        await createOrUpdateUser({
          ...userProfile,
          ...formData,
          id: user.uid,
          email: user.email || formData.email || '',
          updatedAt: Timestamp.now()
        });
      }

      if (isPartner) {
        setIsEditingPartnerProfile(false);
      } else {
        setIsEditingProfile(false);
      }
      toast.success('Profil mis à jour avec succès');
      onProfileUpdate();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setIsUpdatingProfile(false);
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
          <Button
            variant="outline"
            className="border-primary-cream/20 text-primary-cream hover:bg-primary-cream/10 hover:text-primary-coral"
            onClick={handlePhotoClick}
          >
            <Pencil className="w-4 h-4 lg:hidden" />
            <span className="hidden lg:inline">Modifier</span>
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
              {partnerProfile ? `${partnerProfile.firstName} ${partnerProfile.lastName}` : 'Votre Partenaire'}
            </h3>
            <p className="text-sm text-primary-cream/60">
              {partnerProfile?.email || 'Ajoutez les informations de votre partenaire'}
            </p>
          </div>
          <Button
            variant="outline"
            className="border-primary-cream/20 text-primary-cream hover:bg-primary-cream/10 hover:text-primary-coral"
            onClick={handlePartnerPhotoClick}
          >
            <Pencil className="w-4 h-4 lg:hidden" />
            <span className="hidden lg:inline">{partnerProfile ? 'Modifier' : 'Ajouter'}</span>
          </Button>
        </div>
      </div>

      {/* User Profile Edit Dialog */}
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
            onSubmit={(data) => handleUpdateProfile(data, false)}
            isPartner={false}
          />
        </DialogContent>
      </Dialog>

      {/* Partner Profile Edit Dialog */}
      <Dialog open={isEditingPartnerProfile} onOpenChange={setIsEditingPartnerProfile}>
        <DialogContent className="bg-primary-forest border-primary-cream/20 text-primary-cream">
          <DialogHeader>
            <DialogTitle className="text-primary-coral">
              {partnerProfile ? 'Modifier le profil du partenaire' : 'Ajouter le profil du partenaire'}
            </DialogTitle>
            <DialogDescription className="text-primary-cream/60">
              {partnerProfile ? 'Mettez à jour les informations du partenaire' : 'Remplissez les informations de votre partenaire'}
            </DialogDescription>
          </DialogHeader>
          <UserProfileForm
            user={{
              ...partnerProfile,
              email: partnerProfile?.email || ''
            }}
            onSubmit={(data) => handleUpdateProfile(data, true)}
            isPartner={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
