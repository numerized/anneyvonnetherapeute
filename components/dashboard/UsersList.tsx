import { User } from '@/lib/userService';
import { Offer } from '@/lib/offerService';
import { format, parseISO, isFuture } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';
import { Calendar } from 'lucide-react';

interface UserWithOffer extends User {
  currentOffer?: Offer | null;
}

interface UsersListProps {
  users: UserWithOffer[];
}

interface NextSession {
  date: Date;
  type: string;
  isSharedSession?: boolean;
}

export function UsersList({ users }: UsersListProps) {
  const formatDate = (date: Date | Timestamp | undefined) => {
    if (!date) return '';
    const jsDate = date instanceof Timestamp ? date.toDate() : date;
    return format(jsDate, 'dd MMMM yyyy', { locale: fr });
  };

  const getNextAppointment = (sessionDates?: Record<string, string>, includeShared = true) => {
    if (!sessionDates) return null;

    const now = new Date();
    
    // Filter out non-future dates and find the earliest one
    const futureDates = Object.entries(sessionDates)
      .map(([key, dateStr]) => ({
        key,
        date: parseISO(dateStr),
        isSharedSession: key === 'initial_session' || key === 'final_session'
      }))
      .filter(({ date, isSharedSession }) => 
        isFuture(date) && (includeShared || !isSharedSession)
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    if (futureDates.length > 0) {
      const nextSession = futureDates[0];
      return {
        date: nextSession.date,
        type: nextSession.key,
        isSharedSession: nextSession.isSharedSession
      };
    }

    return null;
  };

  const getSessionType = (key: string) => {
    if (key === 'initial_session') return 'Session initiale';
    if (key === 'final_session') return 'Session finale';
    if (key.startsWith('partner1_session_')) return `Session couple 1`;
    if (key.startsWith('partner2_session_')) return `Session couple 2`;
    return 'Session';
  };

  const renderNextAppointment = (mainUserDates?: Record<string, string>, partnerDates?: Record<string, string>, isPartner = false) => {
    // For partner view, first check if there's a shared session (initial/final)
    if (isPartner && mainUserDates) {
      const sharedSession = getNextAppointment(mainUserDates);
      if (sharedSession?.isSharedSession) {
        return (
          <div className="flex items-center gap-1 text-primary-cream/60">
            <Calendar className="w-3 h-3" />
            <span className="text-xs">
              {getSessionType(sharedSession.type)}: {format(sharedSession.date, 'dd MMM yyyy à HH:mm', { locale: fr })}
            </span>
          </div>
        );
      }
    }

    // Get next non-shared session
    const dates = isPartner ? partnerDates : mainUserDates;
    const next = getNextAppointment(dates, !isPartner);
    if (!next) return null;

    return (
      <div className="flex items-center gap-1 text-primary-cream/60">
        <Calendar className="w-3 h-3" />
        <span className="text-xs">
          {getSessionType(next.type)}: {format(next.date, 'dd MMM yyyy à HH:mm', { locale: fr })}
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
                  <div>
                    <h4 className="text-md font-medium text-primary-cream">
                      {user.partnerProfile.firstName} {user.partnerProfile.lastName}
                    </h4>
                    <p className="text-sm text-primary-cream/60">{user.partnerProfile.email}</p>
                    {user.partnerProfile.phone && (
                      <p className="text-sm text-primary-cream/60">{user.partnerProfile.phone}</p>
                    )}
                    {renderNextAppointment(user.sessionDates, user.partnerProfile.sessionDates, true)}
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
