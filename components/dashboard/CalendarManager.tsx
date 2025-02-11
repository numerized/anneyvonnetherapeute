'use client';

import { InlineWidget } from 'react-calendly';

export function CalendarManager() {
  return (
    <div className="bg-primary-forest/30 rounded-[32px] p-8">
      <div className="w-full h-[1100px] rounded-[24px] overflow-hidden">
        <InlineWidget
          url="https://calendly.com/numerized-ara/1h"
          styles={{
            height: '100%',
            width: '100%',
            minHeight: '1100px'
          }}
        />
      </div>
    </div>
  );
}
