import { FC, useState } from 'react';
import { TherapyTimelineEvent } from '@/functions/src/templates/types';
import { FaEnvelope, FaCalendarAlt, FaUserFriends, FaUser } from 'react-icons/fa';
import EmailModal from './EmailModal';
import { emailTemplates } from '@/functions/src/templates/emails';
import { TherapyEmailType } from '@/functions/src/types/emails';

interface TherapyTimelineProps {
  events: TherapyTimelineEvent[];
}

const TherapyTimeline: FC<TherapyTimelineProps> = ({ events }) => {
  const [selectedEmail, setSelectedEmail] = useState<{ title: string; content: string } | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

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

  const getEmailContent = (event: TherapyTimelineEvent) => {
    console.log('Getting email content for:', event);
    if (event.type !== 'email') return null;
    
    // Map the event title to the corresponding email type
    const templateMap: { [key: string]: TherapyEmailType } = {
      'Email de Bienvenue': TherapyEmailType.RESERVATION,
      'Préparation Séance 1 - Femme': TherapyEmailType.BEFORE_INDIV_1,
      'Préparation Séance 1 - Homme': TherapyEmailType.BEFORE_INDIV_1,
      'Suivi Séance 1 - Femme': TherapyEmailType.AFTER_INDIV_1,
      'Suivi Séance 1 - Homme': TherapyEmailType.AFTER_INDIV_1,
      'Préparation Séance 2 - Femme': TherapyEmailType.BEFORE_INDIV_2,
      'Préparation Séance 2 - Homme': TherapyEmailType.BEFORE_INDIV_2,
      'Suivi Séance 2 - Femme': TherapyEmailType.AFTER_INDIV_2,
      'Suivi Séance 2 - Homme': TherapyEmailType.AFTER_INDIV_2,
      'Préparation Séance 3 - Femme': TherapyEmailType.BEFORE_INDIV_3,
      'Préparation Séance 3 - Homme': TherapyEmailType.BEFORE_INDIV_3,
      'Suivi Séance 3 - Femme': TherapyEmailType.AFTER_INDIV_3,
      'Suivi Séance 3 - Homme': TherapyEmailType.AFTER_INDIV_3,
      'Préparation Séance Couple 1': TherapyEmailType.BEFORE_COUPLE_1,
      'Suivi Séance Couple 1': TherapyEmailType.AFTER_COUPLE_1,
      'Préparation Séance Couple 2': TherapyEmailType.BEFORE_COUPLE_2,
      'Suivi Séance Couple 2': TherapyEmailType.AFTER_COUPLE_2,
    };

    const emailType = templateMap[event.title];
    console.log('Email type:', emailType);
    
    if (!emailType || !emailTemplates[emailType]) {
      console.log('No template found for:', event.title);
      return null;
    }

    const template = emailTemplates[emailType];
    console.log('Found template:', template);

    return {
      title: event.title,
      content: template.getHtml({ 
        name: event.partner === 'male' ? 'Monsieur' : 'Madame',
        // Add any other required data here
      }),
    };
  };

  const handleEmailClick = (event: TherapyTimelineEvent) => {
    console.log('Email clicked:', event.title);
    const emailContent = getEmailContent(event);
    console.log('Email content:', emailContent);
    if (emailContent) {
      setSelectedEmail(emailContent);
      setIsEmailModalOpen(true);
    }
  };

  const renderTimelineEvent = (event: TherapyTimelineEvent, index: number) => {
    const isWomanEvent = isFemaleEvent(event);
    const isManEvent = isMaleEvent(event);
    const iconColor = getIconColor(event);

    return (
      <div key={`timeline-${event.title}-${index}`} className={`relative ${isWomanEvent ? 'pl-12' : 'pl-12'}`}>
        {/* Icon */}
        <div className={`absolute ${isWomanEvent ? 'left-0.5' : 'left-0.5'} -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md`}>
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
            <button 
              className={`text-lg font-semibold text-left ${event.type === 'email' ? 'cursor-pointer hover:underline' : ''}`} 
              style={{ color: iconColor }}
              onClick={() => event.type === 'email' && handleEmailClick(event)}
              disabled={event.type !== 'email'}
            >
              {event.title}
            </button>
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

          // If it's not a homme/femme event, render in single column spanning both
          if (!isWomanEvent && !isManEvent) {
            return (
              <div key={`event-${index}`} className="col-span-2 mx-auto w-2/3">
                {renderTimelineEvent(event, index)}
              </div>
            );
          }

          // For homme/femme events, find the matching event for the other partner
          if (isManEvent || isWomanEvent) {
            // Find the matching event for the other partner
            const matchingEvent = events.find(e => 
              e.title.replace(' - Homme', '').replace(' - Femme', '') === 
              event.title.replace(' - Homme', '').replace(' - Femme', '') &&
              ((isManEvent && isFemaleEvent(e)) || (isWomanEvent && isMaleEvent(e)))
            );

            // Only render when we find the man's event (to avoid duplicates)
            if (isManEvent) {
              return (
                <div key={`event-pair-${index}`} className="grid grid-cols-2 gap-4">
                  {/* Left column - Homme */}
                  <div className="relative">
                    {renderTimelineEvent(event, index)}
                  </div>
                  {/* Right column - Femme */}
                  <div className="relative">
                    {matchingEvent && renderTimelineEvent(matchingEvent, index)}
                  </div>
                </div>
              );
            }
            return null; // Skip woman's events as they're handled with the matching man's event
          }
          return null;
        })}
      </div>

      {/* Email Modal */}
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        emailTitle={selectedEmail?.title || ''}
        emailContent={selectedEmail?.content || ''}
      />
    </div>
  );
};

export default TherapyTimeline;
