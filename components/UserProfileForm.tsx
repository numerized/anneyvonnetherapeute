'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { PlusCircle, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User } from '@/lib/userService';

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
    dateNaissance: undefined,
    email: '',
    photo: undefined
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
        dateNaissance: user.dateNaissance || undefined,
        email: user.email || '',
        photo: user.photo || undefined
      });
    }
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'dateNaissance') {
      // For date inputs, store as a proper Date object if value exists
      setFormData(prev => ({
        ...prev,
        [name]: value ? new Date(value) : undefined
      }));
    } else {
      // For other inputs, store the value as is
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDeletePhoto = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent click handler
    setFormData(prev => ({
      ...prev,
      photo: undefined
    }));
  };

  // Function to resize image
  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      setIsResizing(true);
      
      // Create an image object
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
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
        
        // Create a canvas and draw the resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          setIsResizing(false);
          reject(new Error('Unable to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to data URL and resolve promise
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        URL.revokeObjectURL(img.src); // Clean up
        setIsResizing(false);
        resolve(dataUrl);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(img.src); // Clean up
        setIsResizing(false);
        reject(new Error('Error loading image'));
      };
    });
  };

  const handlePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
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

  // Format date to YYYY-MM-DD for input
  const formatDateForInput = (date: Date | string | any | undefined): string => {
    if (!date) return '';
    
    try {
      // If it's already a Date object with toISOString method
      if (date instanceof Date && typeof date.toISOString === 'function') {
        return date.toISOString().split('T')[0];
      }
      
      // Check if it's a Firestore Timestamp (has toDate method)
      if (typeof date === 'object' && date !== null && 'toDate' in date && typeof date.toDate === 'function') {
        const dateObj = date.toDate();
        return dateObj.toISOString().split('T')[0];
      }
      
      // If it's a string or other value, try to create a valid Date
      const dateObj = new Date(date);
      
      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        return '';
      }
      
      return dateObj.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Photo Upload */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          {formData.photo && (
            <button
              type="button"
              onClick={handleDeletePhoto}
              className="absolute -top-2 -right-2 z-10 bg-black/70 rounded-full p-1 hover:bg-black/90 transition-colors"
              aria-label="Delete photo"
            >
              <X className="w-3.5 h-3.5 text-white" />
            </button>
          )}
          <div 
            className="relative w-24 h-24 rounded-full overflow-hidden bg-primary-cream/20 cursor-pointer"
            onClick={handlePhotoClick}
          >
            {formData.photo ? (
              <Image 
                src={formData.photo} 
                alt="Profile" 
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-cream/60 text-center">
                {isResizing ? (
                  <div className="text-xs">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-cream mx-auto mb-1"></div>
                    Redimensionnement...
                  </div>
                ) : (
                  < >
                    <PlusCircle className="w-8 h-8 mb-1" />
                    <span className="text-xs">
                      Ajouter<br/>une photo
                    </span>
                  </ >
                )}
              </div>
            )}
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
          value={formatDateForInput(formData.dateNaissance)}
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
