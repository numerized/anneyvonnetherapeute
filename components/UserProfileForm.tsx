'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { format, parse } from 'date-fns';
import { fr } from 'date-fns/locale';
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
    firstName: '',
    lastName: '',
    phone: '',
    birthDate: undefined,
    email: '',
    photo: undefined
  });
  const [dateInputValue, setDateInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        birthDate: user.birthDate || undefined,
        email: user.email || '',
        photo: user.photo || undefined
      });
      // Format the initial date value
      if (user.birthDate) {
        setDateInputValue(formatDateForInput(user.birthDate));
      }
    }
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'birthDate') {
      // Apply input mask for date (dd/mm/yyyy)
      if (value) {
        // Remove any non-digit characters from the new input
        const digits = value.replace(/\D/g, '');
        
        // Format the digits with slashes
        let formattedValue = '';
        if (digits.length > 0) {
          // Add first two digits (day)
          formattedValue = digits.slice(0, 2);
          if (digits.length > 2) {
            // Add month after day
            formattedValue += '/' + digits.slice(2, 4);
            if (digits.length > 4) {
              // Add year after month
              formattedValue += '/' + digits.slice(4, 8);
            }
          }
        }

        // Update the input display value
        setDateInputValue(formattedValue);

        // Only try to parse if we have a complete date
        if (formattedValue.length === 10) {
          try {
            // Try to parse the input value as dd/MM/yyyy
            const parsedDate = parse(formattedValue, 'dd/MM/yyyy', new Date());
            
            // Validate the parsed date
            if (!isNaN(parsedDate.getTime())) {
              setFormData(prev => ({
                ...prev,
                birthDate: parsedDate
              }));
            }
          } catch (error) {
            console.error('Error parsing date:', error, 'Value:', formattedValue);
          }
        } else {
          // Clear the date in formData if input is incomplete
          setFormData(prev => ({
            ...prev,
            birthDate: undefined
          }));
        }
      } else {
        // Clear both the input value and the form data
        setDateInputValue('');
        setFormData(prev => ({
          ...prev,
          birthDate: undefined
        }));
      }
    } else {
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

  const handleRemovePhoto = () => {
    if (isSubmitting) return;
    
    setFormData(prev => ({
      ...prev,
      photo: null // Explicitly set to null to trigger deletion
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
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Filter out undefined values
      const dataToSubmit: Partial<User> = {};
      (Object.entries(formData) as [keyof User, any][]).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          dataToSubmit[key] = value;
        }
      });

      await onSubmit(dataToSubmit);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date for display
  const formatDateForInput = (date: Date | string | any | undefined): string => {
    if (!date) return '';
    
    // If it's already in dd/mm/yyyy format, return as is
    if (typeof date === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
      return date;
    }

    try {
      let dateObj: Date;

      // If it's already a Date object
      if (date instanceof Date) {
        dateObj = date;
      }
      // Check if it's a Firestore Timestamp
      else if (typeof date === 'object' && date !== null && 'toDate' in date && typeof date.toDate === 'function') {
        dateObj = date.toDate();
      }
      // If it's a string or other value, try to create a Date
      else {
        dateObj = new Date(date);
      }

      // Validate the date
      if (!dateObj || isNaN(dateObj.getTime())) {
        console.warn('Invalid date value:', date);
        return '';
      }

      return format(dateObj, 'dd/MM/yyyy', { locale: fr });
    } catch (error) {
      console.error('Error formatting date:', error, 'Value:', date);
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
              onClick={handleRemovePhoto}
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
        <label htmlFor="firstName" className="block text-sm font-medium text-primary-cream">Prénom</label>
        <Input
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required={isFirstTime}
          className="bg-primary-cream/10 border-primary-cream/20 text-primary-cream"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="lastName" className="block text-sm font-medium text-primary-cream">Nom</label>
        <Input
          id="lastName"
          name="lastName"
          value={formData.lastName}
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
        <label htmlFor="phone" className="block text-sm font-medium text-primary-cream">Téléphone</label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="bg-primary-cream/10 border-primary-cream/20 text-primary-cream"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="birthDate" className="block text-sm font-medium text-primary-cream">Date de naissance</label>
        <Input
          id="birthDate"
          name="birthDate"
          type="text"
          placeholder="jj/mm/aaaa"
          maxLength={10}
          value={dateInputValue}
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
