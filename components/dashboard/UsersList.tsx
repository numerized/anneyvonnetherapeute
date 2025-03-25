import { User } from '@/lib/userService';
import { Offer } from '@/lib/offerService';
import { format, parseISO, isFuture } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';
import { Users, Calendar } from 'lucide-react';

interface UserWithOffer extends User {
  currentOffer?: Offer | null;
  sessionDates?: Record<string, string>;
  partnerProfile?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    sessionDates?: Record<string, string>;
  };
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

  const getNextAppointment = (sessionDates?: Record<string, string>) => {
    if (!sessionDates) return null;

    const now = new Date();
    let nextDate: Date | null = null;

    Object.values(sessionDates).forEach(dateStr => {
      const date = parseISO(dateStr);
      if (isFuture(date) && (!nextDate || date < nextDate)) {
        nextDate = date;
      }
    });

    return nextDate;
  };

  const renderNextAppointment = (sessionDates?: Record<string, string>) => {
    const nextDate = getNextAppointment(sessionDates);
    if (!nextDate) return null;

    return (
      <div className="flex items-center gap-1 text-primary-cream/60">
        <Calendar className="w-3 h-3" />
        <span className="text-xs">
          Prochain RDV: {format(nextDate, 'dd MMM yyyy', { locale: fr })}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-primary-cream/20 bg-primary-cream/10 p-6">
        <h2 className="text-2xl font-semibold text-primary-coral mb-6">Liste des Patients</h2>
        
        {/* Table Header */}
        <div className="grid grid-cols-3 gap-4 mb-4 text-sm font-medium text-primary-cream/60 border-b border-primary-cream/10 pb-2">
          <div>Patient</div>
          <div>Partenaire</div>
          <div className="text-right">Formule</div>
        </div>

        {/* Table Body */}
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="grid grid-cols-3 gap-4 py-4 border-b border-primary-cream/10 last:border-0">
              {/* Patient Column */}
              <div>
                <h3 className="text-md font-medium text-primary-cream">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-primary-cream/60">{user.email}</p>
                {user.phone && (
                  <p className="text-sm text-primary-cream/60">{user.phone}</p>
                )}
                {renderNextAppointment(user.sessionDates)}
              </div>

              {/* Partner Column */}
              <div>
                {user.partnerProfile ? (
                  <div className="flex items-start gap-2">
                    <Users className="w-4 h-4 mt-1 text-primary-cream/60 flex-shrink-0" />
                    <div>
                      <h4 className="text-md font-medium text-primary-cream">
                        {user.partnerProfile.firstName} {user.partnerProfile.lastName}
                      </h4>
                      <p className="text-sm text-primary-cream/60">{user.partnerProfile.email}</p>
                      {user.partnerProfile.phone && (
                        <p className="text-sm text-primary-cream/60">{user.partnerProfile.phone}</p>
                      )}
                      {renderNextAppointment(user.partnerProfile.sessionDates)}
                    </div>
                  </div>
                ) : (
                  <p className="text-primary-cream/40 italic">Pas de partenaire</p>
                )}
              </div>

              {/* Offer Column */}
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
          ))}
        </div>
      </div>
    </div>
  );
}
