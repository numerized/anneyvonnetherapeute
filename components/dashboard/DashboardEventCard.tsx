import { TherapyJourneyEvent } from '@/lib/coupleTherapyJourney'
import { SessionDetails } from '@/lib/userService'

import { CalendlyEventDetailsView } from './CalendlyEventDetails'

interface DashboardEventCardProps {
  event: TherapyJourneyEvent
  sessionDetails?: SessionDetails
}

export function DashboardEventCard({
  event,
  sessionDetails,
}: DashboardEventCardProps) {
  // If there are no session details or no calendar event URI, show a message
  if (!sessionDetails || !sessionDetails.calendarEvent) {
    return (
      <div className="bg-primary-cream/10 p-4 rounded-lg shadow-sm">
        <h3 className="font-medium text-[rgb(247_237_226_)]">{event.title}</h3>
        <p className="text-sm text-[rgb(247_237_226_)]/60 mt-1">
          Aucun rendez-vous programmé
        </p>
      </div>
    )
  }

  return (
    <div className="bg-primary-cream/10 p-4 rounded-lg shadow-sm">
      <h3 className="font-medium text-[rgb(247_237_226_)]">{event.title}</h3>
      <div className="mt-2">
        <CalendlyEventDetailsView eventUri={sessionDetails.calendarEvent} />
      </div>
    </div>
  )
}

// Simplified version that just shows basic session info without fetching details
export function DashboardSessionInfo({
  event,
  sessionDetails,
}: DashboardEventCardProps) {
  if (!sessionDetails) {
    return (
      <div className="text-sm text-[rgb(247_237_226_)]">
        Aucun rendez-vous programmé
      </div>
    )
  }

  // Use pre-formatted date if available, otherwise show the date from sessionDetails
  const displayDate =
    sessionDetails.formattedDateTime ||
    (sessionDetails.date
      ? new Date(sessionDetails.date).toLocaleDateString('fr-FR')
      : 'Date non disponible')

  return (
    <div className="text-sm">
      <div className="flex items-center justify-between">
        <div className="font-medium text-[rgb(247_237_226_)]">
          {event.title}
        </div>
        <div
          className={`text-xs px-2 py-0.5 rounded-full ${
            sessionDetails.status === 'completed'
              ? 'bg-[rgb(247_237_226)]/20 text-[rgb(247_237_226)]'
              : sessionDetails.status === 'cancelled'
                ? 'bg-red-100/20 text-red-200'
                : 'bg-[rgb(247_237_226)]/10 text-[rgb(247_237_226)]'
          }`}
        >
          {sessionDetails.status === 'completed'
            ? 'Complété'
            : sessionDetails.status === 'cancelled'
              ? 'Annulé'
              : 'Programmé'}
        </div>
      </div>
      <div className="text-[rgb(247_237_226_)]/60 mt-1">{displayDate}</div>
    </div>
  )
}
