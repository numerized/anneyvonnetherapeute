import { User } from '@/lib/userService';
import { Offer } from '@/lib/offerService';
import { format, parseISO, isFuture } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from 'lucide-react';

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
              }
            });
          }
        });
      }

      // Add partner appointments
      if (user.partnerProfile?.sessionDates) {
        Object.entries(user.partnerProfile.sessionDates).forEach(([type, dateStr]) => {
          const date = parseISO(dateStr);
          if (isFuture(date)) {
            appointments.push({
              date,
              type,
              user: {
                firstName: user.partnerProfile?.firstName || '',
                lastName: user.partnerProfile?.lastName || '',
                email: user.partnerProfile?.email || '',
                isPartner: true
              }
            });
          }
        });
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
    if (key.startsWith('partner1_session_')) return `Session couple 1`;
    if (key.startsWith('partner2_session_')) return `Session couple 2`;
    return 'Session';
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
          <div key={index} className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-primary-cream/60" />
            <div>
              <div className="text-primary-cream">
                <span className="font-medium">
                  {appointment.user.firstName} {appointment.user.lastName}
                </span>
                {appointment.user.isPartner && (
                  <span className="text-primary-cream/60 text-sm ml-2">(partenaire)</span>
                )}
              </div>
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
