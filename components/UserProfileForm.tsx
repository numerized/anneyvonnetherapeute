import { useState, useEffect, useRef } from 'react';
import { User } from '@/lib/userService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Camera } from 'lucide-react';

interface UserProfileFormProps {
  user: User | null;
  onSubmit: (userData: Partial<User>) => Promise<void>;
  isFirstTime?: boolean;
}

export function UserProfileForm({ user, onSubmit, isFirstTime = false }: UserProfileFormProps) {
  const [formData, setFormData] = useState<Partial<User>>({
    prenom: '',
    nom: '',
    telephone: '',
    dateNaissance: '',
    email: '',
    photo: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        prenom: user.prenom || '',
        nom: user.nom || '',
        telephone: user.telephone || '',
        dateNaissance: user.dateNaissance || '',
        email: user.email || '',
        photo: user.photo || null
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to resize image
  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      setIsResizing(true);
      
      // Create an image object
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round(height * (MAX_WIDTH / width));
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round(width * (MAX_HEIGHT / height));
            height = MAX_HEIGHT;
          }
        }
        
        // Create canvas and resize
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsResizing(false);
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Draw image on canvas with new dimensions
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get base64 data URL (JPEG format with 0.9 quality)
        const resizedBase64 = canvas.toDataURL('image/jpeg', 0.9);
        setIsResizing(false);
        resolve(resizedBase64);
      };
      
      img.onerror = () => {
        setIsResizing(false);
        reject(new Error('Error loading image'));
      };
      
      // Load the image from the file
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = () => {
        setIsResizing(false);
        reject(new Error('Error reading file'));
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Check if file needs resizing (larger than 1MB)
      if (file.size > 1024 * 1024) {
        // Resize the image
        const resizedBase64 = await resizeImage(file);
        setFormData(prev => ({
          ...prev,
          photo: resizedBase64
        }));
      } else {
        // File is small enough, just convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setFormData(prev => ({
            ...prev,
            photo: base64String
          }));
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Erreur lors du traitement de l\'image. Veuillez réessayer.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting user data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Photo Upload */}
      <div className="flex justify-center mb-4">
        <div 
          className="relative w-24 h-24 rounded-full overflow-hidden bg-primary-cream/20 cursor-pointer"
          onClick={handlePhotoClick}
        >
          {formData.photo ? (
            <img 
              src={formData.photo} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-cream/60">
              {isResizing ? (
                <div className="text-xs text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-cream mx-auto mb-1"></div>
                  Redimensionnement...
                </div>
              ) : (
                <>
                  <PlusCircle className="w-8 h-8 mb-1" />
                  <span className="text-xs">Ajouter photo</span>
                </>
              )}
            </div>
          )}
          <div className="absolute bottom-0 right-0 bg-primary-coral rounded-full p-1">
            <Camera className="w-4 h-4 text-primary-cream" />
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="hidden"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="prenom" className="block text-sm font-medium text-primary-cream">Prénom</label>
        <Input
          id="prenom"
          name="prenom"
          value={formData.prenom}
          onChange={handleChange}
          required={isFirstTime}
          className="bg-primary-cream/10 border-primary-cream/20 text-primary-cream"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="nom" className="block text-sm font-medium text-primary-cream">Nom</label>
        <Input
          id="nom"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          required={isFirstTime}
          className="bg-primary-cream/10 border-primary-cream/20 text-primary-cream"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-primary-cream">Email</label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={true}
          className="bg-primary-cream/10 border-primary-cream/20 text-primary-cream opacity-70"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="telephone" className="block text-sm font-medium text-primary-cream">Téléphone</label>
        <Input
          id="telephone"
          name="telephone"
          value={formData.telephone}
          onChange={handleChange}
          className="bg-primary-cream/10 border-primary-cream/20 text-primary-cream"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="dateNaissance" className="block text-sm font-medium text-primary-cream">Date de naissance</label>
        <Input
          id="dateNaissance"
          name="dateNaissance"
          type="date"
          value={formData.dateNaissance || ''}
          onChange={handleChange}
          className="bg-primary-cream/10 border-primary-cream/20 text-primary-cream"
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={isSubmitting || isResizing}
        className="w-full bg-primary-coral hover:bg-primary-rust text-primary-cream"
      >
        {isSubmitting ? 'Enregistrement...' : isFirstTime ? 'Créer mon profil' : 'Mettre à jour mon profil'}
      </Button>
    </form>
  );
}
