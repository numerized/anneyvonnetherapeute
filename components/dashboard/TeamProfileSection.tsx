import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserProfileForm } from '@/components/UserProfileForm';
import { createOrUpdateUser, UserProfile } from '@/lib/userService';
import { Timestamp } from 'firebase/firestore';
import { User as UserIcon, Pencil, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { toast } from 'sonner';

// Simplified user type to avoid FirebaseUser dependency
interface UserInfo {
  uid?: string;
  email: string | null;
}

interface TeamProfileSectionProps {
  user: UserInfo | null;
  userProfile: UserProfile | null;
  onProfileUpdate: () => void;
}

export function TeamProfileSection({
  user,
  userProfile,
  onProfileUpdate,
}: TeamProfileSectionProps) {
  // UI states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to handle photo click
  const handlePhotoClick = () => {
    setIsEditingProfile(true);
  };

  // Function to handle update profile
  const handleUpdateProfile = async (formData: Partial<UserProfile>) => {
    if (!user?.uid) return;
    
    setIsUpdatingProfile(true);

    try {
      await createOrUpdateUser({
        ...formData,
        id: user.uid,
        updatedAt: Timestamp.now(),
      });

      // Clear any existing timeout
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      // Set a new timeout for the profile update
      updateTimeoutRef.current = setTimeout(() => {
        onProfileUpdate();
        setIsEditingProfile(false);
        setIsUpdatingProfile(false);
        toast.success('Profil mis à jour avec succès');
      }, 500);
    } catch (error) {
      console.error('Error updating profile:', error);
      setIsUpdatingProfile(false);
      toast.error('Erreur lors de la mise à jour du profil');
    }
  };

  return (
    <div className="space-y-6">
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
            <h3 className="text-lg font-medium text-primary-cream">
              {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'Votre Profil'}
            </h3>
            <p className="text-sm text-primary-cream/60">{userProfile?.email || user?.email || ''}</p>
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
            onSubmit={(data) => handleUpdateProfile(data)}
            isPartner={false}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
