import { FC, useState } from 'react';
import { FaEnvelope, FaUser, FaUserFriends } from 'react-icons/fa';
import { TherapyTimelineEvent } from '@/functions/src/templates/types';
import { EmailModal } from './EmailModal';
import { emailTemplates } from '@/functions/src/templates/emails/index';
import { TherapyEmailType } from '@/functions/src/types/emails';

interface TherapyTimelineProps {
  events: TherapyTimelineEvent[];
}

interface PartnerInfo {
  firstName: string;
  lastName: string;
}

interface CoupleInfo {
  homme: PartnerInfo;
  femme: PartnerInfo;
}

const TherapyTimeline: FC<TherapyTimelineProps> = ({ events }) => {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<TherapyTimelineEvent | null>(null);
  const [coupleInfo, setCoupleInfo] = useState<CoupleInfo>({
    homme: { firstName: 'Kevin', lastName: 'Perrée' },
    femme: { firstName: 'Justine', lastName: 'Huyghebaert' }
  });

  // Function to generate dates for the therapy process
  const generateProcessDates = (startDate: Date = new Date()) => {
    const dates: { [key: string]: Date } = {};
    let currentDate = startDate;

    // Helper to add days to a date
    const addDays = (date: Date, days: number) => {
      const newDate = new Date(date);
      newDate.setDate(date.getDate() + days);
      return newDate;
    };

    // Generate dates for each step
    dates.preparation1 = currentDate;
    dates.seance1 = addDays(currentDate, 3); // 3 days after preparation
    dates.suivi1 = addDays(dates.seance1, 1); // 1 day after seance
    dates.preparation2 = addDays(dates.suivi1, 3); // 3 days after suivi
    // ... continue for all steps

    return dates;
  };

  const getEmailType = (event: TherapyTimelineEvent): TherapyEmailType | null => {
    // Direct title mappings
    const titleToType: Record<string, TherapyEmailType> = {
      'Email de Bienvenue': TherapyEmailType.RESERVATION,
      'Suivi Première Séance': TherapyEmailType.AFTER_COUPLE_1,
      'Suivi Séance Couple': TherapyEmailType.AFTER_COUPLE_2
    };

    if (titleToType[event.title]) {
      return titleToType[event.title];
    }

    // Pattern-based mappings
    if (event.title.includes('Préparation Séance 1')) {
      return event.title.includes('Homme') ? TherapyEmailType.BEFORE_INDIV_1 : TherapyEmailType.BEFORE_INDIV_1;
    } else if (event.title.includes('Suivi Séance 1')) {
      return event.title.includes('Homme') ? TherapyEmailType.AFTER_INDIV_1 : TherapyEmailType.AFTER_INDIV_1;
    } else if (event.title.includes('Préparation Séance 2')) {
      return event.title.includes('Homme') ? TherapyEmailType.BEFORE_INDIV_2 : TherapyEmailType.BEFORE_INDIV_2;
    } else if (event.title.includes('Suivi Séance 2')) {
      return event.title.includes('Homme') ? TherapyEmailType.AFTER_INDIV_2 : TherapyEmailType.AFTER_INDIV_2;
    } else if (event.title.includes('Préparation Séance 3')) {
      return event.title.includes('Homme') ? TherapyEmailType.BEFORE_INDIV_3 : TherapyEmailType.BEFORE_INDIV_3;
    } else if (event.title.includes('Suivi Séance 3')) {
      return event.title.includes('Homme') ? TherapyEmailType.AFTER_INDIV_3 : TherapyEmailType.AFTER_INDIV_3;
    } else if (event.title.includes('Préparation Séance Couple 1')) {
      return TherapyEmailType.BEFORE_COUPLE_1;
    } else if (event.title.includes('Préparation Séance Couple 2')) {
      return TherapyEmailType.BEFORE_COUPLE_2;
    }
    
    console.log('No mapping found for title:', event.title);
    return null;
  };

  const handleEmailClick = (event: TherapyTimelineEvent) => {
    const processDate = generateProcessDates();
    
    // Get email template type and content
    const emailType = getEmailType(event);
    if (!emailType) {
      console.error('Could not determine email type for:', event.title);
      return;
    }

    const emailTemplate = emailTemplates[emailType];
    if (!emailTemplate) {
      console.error('No email template found for type:', emailType);
      return;
    }

    // Format names for combined greeting
    const coupleNames = `${coupleInfo.femme.firstName} et ${coupleInfo.homme.firstName}`;
    const amount = '750€'; // You might want to make this dynamic
    const firstSessionDate = processDate.seance1.toLocaleDateString('fr-FR');

    // Replace template variables and generate HTML
    const emailContent = emailTemplate.getHtml({
      name: coupleNames,
      paymentAmount: amount,
      firstSessionDate: firstSessionDate,
      homme: {
        prenom: coupleInfo.homme.firstName,
        nom: coupleInfo.homme.lastName,
      },
      femme: {
        prenom: coupleInfo.femme.firstName,
        nom: coupleInfo.femme.lastName,
      },
      date: new Date().toLocaleDateString('fr-FR'),
    });
    
    setSelectedEmail({ ...event, content: emailContent });
    setIsEmailModalOpen(true);
  };

  const handlePartnerInfoChange = (partner: 'homme' | 'femme', field: 'firstName' | 'lastName', value: string) => {
    setCoupleInfo(prev => ({
      ...prev,
      [partner]: {
        ...prev[partner],
        [field]: value
      }
    }));
  };

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

  const renderTimelineEvent = (event: TherapyTimelineEvent, index: number) => {
    const isWomanEvent = isFemaleEvent(event);
    const isManEvent = isMaleEvent(event);
    const iconColor = getIconColor(event);

    return (
      <div key={`timeline-${event.title}-${index}`} className={`relative ${isWomanEvent ? 'pl-12' : 'pl-12'}`}>
        {/* Icon */}
        <div 
          className={`absolute ${isWomanEvent ? 'left-0.5' : 'left-0.5'} -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md cursor-pointer`}
          onClick={() => event.type === 'email' && handleEmailClick(event)}
        >
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
    <div>
      {/* Partner Information Form */}
      <div className="mb-8 grid grid-cols-2 gap-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        {/* Homme */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-blue-600">Homme</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Prénom</label>
              <input
                type="text"
                value={coupleInfo.homme.firstName}
                onChange={(e) => handlePartnerInfoChange('homme', 'firstName', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                value={coupleInfo.homme.lastName}
                onChange={(e) => handlePartnerInfoChange('homme', 'lastName', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Femme */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-pink-600">Femme</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Prénom</label>
              <input
                type="text"
                value={coupleInfo.femme.firstName}
                onChange={(e) => handlePartnerInfoChange('femme', 'firstName', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                value={coupleInfo.femme.lastName}
                onChange={(e) => handlePartnerInfoChange('femme', 'lastName', e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
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
    </div>
  );
};

export default TherapyTimeline;
