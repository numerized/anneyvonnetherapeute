import { User } from '@/lib/userService';
import { Offer } from '@/lib/offerService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';

interface UserWithOffer extends User {
  currentOffer?: Offer | null;
}

interface UsersListProps {
  users: UserWithOffer[];
}

export function UsersList({ users }: UsersListProps) {
  const formatDate = (date: Date | Timestamp | undefined) => {
    if (!date) return '';
    const jsDate = date instanceof Timestamp ? date.toDate() : date;
    return format(jsDate, 'dd MMMM yyyy', { locale: fr });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-primary-cream/20 bg-primary-cream/10 p-6">
        <h2 className="text-2xl font-semibold text-primary-coral mb-6">Liste des Patients</h2>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="border-b border-primary-cream/10 pb-4 last:border-0 last:pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-primary-cream">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-sm text-primary-cream/60">{user.email}</p>
                  {user.phone && (
                    <p className="text-sm text-primary-cream/60 mt-1">{user.phone}</p>
                  )}
                </div>
                <div className="text-right">
                  {user.currentOffer ? (
                    <>
                      <p className="text-primary-coral font-medium">
                        {user.currentOffer.metadata.title}
                      </p>
                      <p className="text-sm text-primary-cream/60">
                        Depuis le {formatDate(user.currentOffer.createdAt)}
                      </p>
                    </>
                  ) : (
                    <p className="text-primary-cream/40 italic">Aucune formule active</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
