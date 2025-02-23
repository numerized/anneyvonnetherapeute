import { FC } from 'react';
import { TherapyTimelineEvent } from '@/functions/src/templates/types';
import { FaEnvelope, FaCalendarAlt, FaUserFriends, FaUser } from 'react-icons/fa';

interface TherapyTimelineProps {
  events: TherapyTimelineEvent[];
}

const TherapyTimeline: FC<TherapyTimelineProps> = ({ events }) => {
  const isFemaleEvent = (event: TherapyTimelineEvent): boolean => {
    return event.title.toUpperCase().includes('FEMME') || event.title.includes('- Femme');
  };

  const isMaleEvent = (event: TherapyTimelineEvent): boolean => {
    return event.title.toUpperCase().includes('HOMME') || event.title.includes('- Homme');
  };

  const getIconColor = (event: TherapyTimelineEvent): string => {
    if (isMaleEvent(event)) return '#2563EB'; // blue-600
    if (isFemaleEvent(event)) return '#EC4899'; // pink-500
    return '#8B5CF6'; // purple-500 for everything else
  };

  return (
    <div className="relative pl-1">
      {/* Vertical line */}
      <div className="absolute left-1 top-0 h-full w-0.5 bg-gray-200"></div>

      {/* Timeline events */}
      <div className="space-y-8">
        {events.map((event, index) => {
          const isWomanEvent = isFemaleEvent(event);
          const isManEvent = isMaleEvent(event);
          const iconColor = getIconColor(event);

          return (
            <div key={index} className="relative pl-12">
              {/* Icon */}
              <div className="absolute left-0.5 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md">
                <div style={{ color: iconColor }}>
                  {event.type === 'email' ? (
                    <FaEnvelope size={16} />
                  ) : event.sessionType === 'couple' ? (
                    <FaUserFriends size={16} />
                  ) : (
                    <FaUser size={16} />
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold" style={{ color: iconColor }}>
                    {event.title}
                  </h3>
                  {event.delayDays && (
                    <span className="text-sm text-gray-500">
                      {event.triggerType === 'beforeSession'
                        ? `${event.delayDays} jours avant`
                        : event.triggerType === 'afterSession'
                        ? `${event.delayDays} jours après`
                        : 'Immédiat'}
                    </span>
                  )}
                </div>
                
                <div className="mt-2 text-gray-600">
                  {event.description}
                </div>

                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {/* Partner Tag - First */}
                  {event.partner && (
                    <span 
                      style={{ 
                        backgroundColor: event.partner === 'male' ? '#DBEAFE' : '#FCE7F3',
                        color: event.partner === 'male' ? '#1D4ED8' : '#BE185D',
                        border: `1px solid ${event.partner === 'male' ? '#93C5FD' : '#F9A8D4'}`,
                      }}
                      className="rounded-full px-3 py-1 text-sm"
                    >
                      {event.partner === 'male' ? 'Partenaire Masculin' : 'Partenaire Féminin'}
                    </span>
                  )}

                  {/* Session Type Tag - Second */}
                  {event.type === 'session' && (
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700">
                      {event.sessionType === 'couple' ? 'Séance de Couple' : 'Séance Individuelle'}
                    </span>
                  )}

                  {/* Email Tag - Second */}
                  {event.type === 'email' && (
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700">
                      Email
                    </span>
                  )}

                  {/* Suivi Tag - Last */}
                  {event.title.toLowerCase().includes('suivi') && (
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-700">
                      Suivi
                    </span>
                  )}

                  {/* Preparation Tag - Last */}
                  {event.title.toLowerCase().includes('préparation') && (
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-700">
                      Préparation
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TherapyTimeline;
