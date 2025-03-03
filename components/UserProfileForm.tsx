import { useState, useEffect } from 'react';
import { User } from '@/lib/userService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        prenom: user.prenom || '',
        nom: user.nom || '',
        telephone: user.telephone || '',
        dateNaissance: user.dateNaissance || '',
        email: user.email || ''
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
        disabled={isSubmitting}
        className="w-full bg-primary-coral hover:bg-primary-rust text-primary-cream"
      >
        {isSubmitting ? 'Enregistrement...' : isFirstTime ? 'Créer mon profil' : 'Mettre à jour mon profil'}
      </Button>
    </form>
  );
}
