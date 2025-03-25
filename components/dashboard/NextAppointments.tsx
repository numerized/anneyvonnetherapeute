import { User } from '@/lib/userService';
import { Offer } from '@/lib/offerService';
import { format, parseISO, isFuture } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Users } from 'lucide-react';

interface UserWithOffer extends User {
  currentOffer?: Offer | null;
}

interface NextAppointmentsProps {
  users: UserWithOffer[];
}

interface AppointmentInfo {
  date: Date;
  type: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    isPartner?: boolean;
  };
  mainUser?: {
    firstName: string;
    lastName: string;
  };
  partner?: {
    firstName: string;
    lastName: string;
  };
}

export function NextAppointments({ users }: NextAppointmentsProps) {
  const getAllUpcomingAppointments = (): AppointmentInfo[] => {
    const appointments: AppointmentInfo[] = [];

    users.forEach(user => {
      // Add main user appointments
      if (user.sessionDates) {
        Object.entries(user.sessionDates).forEach(([type, dateStr]) => {
          const date = parseISO(dateStr);
          if (isFuture(date)) {
            appointments.push({
              date,
              type,
              user: {
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || ''
              },
              mainUser: {
                firstName: user.firstName || '',
                lastName: user.lastName || ''
              },
              partner: user.partnerProfile ? {
                firstName: user.partnerProfile.firstName || '',
                lastName: user.partnerProfile.lastName || ''
              } : undefined
            });
          }
        });
      }

      // Add partner appointments
      if (user.partnerProfile?.sessionDates) {
        const partnerProfile = user.partnerProfile;  // We know this exists because of the if check
        const sessionDates = partnerProfile.sessionDates;  // Assign to variable to satisfy TypeScript
        if (sessionDates) {  // Extra check to satisfy TypeScript
          Object.entries(sessionDates).forEach(([type, dateStr]) => {
            const date = parseISO(dateStr);
            if (isFuture(date)) {
              appointments.push({
                date,
                type,
                user: {
                  firstName: partnerProfile.firstName || '',
                  lastName: partnerProfile.lastName || '',
                  email: partnerProfile.email || '',
                  isPartner: true
                },
                mainUser: {
                  firstName: user.firstName || '',
                  lastName: user.lastName || ''
                },
                partner: {
                  firstName: partnerProfile.firstName || '',
                  lastName: partnerProfile.lastName || ''
                }
              });
            }
          });
        }
      }
    });

    // Sort by date and take only the next 2 appointments
    return appointments
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 2);
  };

  const getSessionType = (key: string) => {
    if (key === 'initial_session') return 'Session initiale';
    if (key === 'final_session') return 'Session finale';
    if (key.startsWith('partner1_session_')) return `Session Individuelle`;
    if (key.startsWith('partner2_session_')) return `Session Individuelle`;
    return 'Session';
  };

  const isSharedSession = (type: string) => {
    return type === 'initial_session' || type === 'final_session';
  };

  const isCoupleSession = (type: string) => {
    return type.startsWith('partner1_session_') || type.startsWith('partner2_session_');
  };

  const nextAppointments = getAllUpcomingAppointments();

  if (nextAppointments.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-primary-cream/20 bg-primary-cream/10 p-6 mb-6">
      <h2 className="text-2xl font-semibold text-primary-coral mb-4">Prochains Rendez-vous</h2>
      <div className="space-y-4">
        {nextAppointments.map((appointment, index) => (
          <div key={index} className="flex items-start gap-4">
            {!isCoupleSession(appointment.type) ? (
              <Users className="w-5 h-5 text-primary-cream/60 mt-1" />
            ) : (
              <Calendar className="w-5 h-5 text-primary-cream/60 mt-1" />
            )}
            <div>
              {!isCoupleSession(appointment.type) && appointment.mainUser && appointment.partner ? (
                <div className="text-primary-cream">
                  <div className="font-medium">
                    {appointment.mainUser.firstName} {appointment.mainUser.lastName}
                  </div>
                  <div className="font-medium text-primary-cream/80">
                    {appointment.partner.firstName} {appointment.partner.lastName}
                  </div>
                </div>
              ) : (
                <div className="text-primary-cream">
                  <span className="font-medium">
                    {appointment.user.firstName} {appointment.user.lastName}
                  </span>
                  {appointment.user.isPartner && (
                    <span className="text-primary-cream/60 text-sm ml-2">(partenaire)</span>
                  )}
                </div>
              )}
              <p className="text-sm text-primary-cream/60">{appointment.user.email}</p>
              <p className="text-sm text-primary-coral mt-1">
                {getSessionType(appointment.type)}: {format(appointment.date, 'dd MMM yyyy à HH:mm', { locale: fr })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
