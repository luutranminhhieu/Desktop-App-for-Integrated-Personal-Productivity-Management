import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CALENDAR_CONFIG } from '@renderer/config/calendarConfig';
import type { CalendarViewType } from '@renderer/types';

export type CalendarViewProps = {
  calendarRef: React.RefObject<FullCalendar | null>;
  events: Array<{
    id: string;
    title: string;
    start: string;
    end: string;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    extendedProps?: Record<string, unknown>;
  }>;
  view: CalendarViewType;
  onDatesChange: (start: Date, end: Date) => void;
  onEventClick: (eventId: string) => void;
};

const CalendarView = ({
  calendarRef,
  events,
  view,
  onDatesChange,
  onEventClick
}: CalendarViewProps): React.JSX.Element => {
  return (
    <div className="h-full calendar-root">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={view}
        headerToolbar={false}
        height="100%"
        locale="en"
        firstDay={1}
        allDayText={CALENDAR_CONFIG.STRINGS.allDayText}
        dayHeaderFormat={{ weekday: 'short' }}
        slotDuration="01:00:00"
        slotLabelInterval="01:00"
        editable={false}
        selectable={false}
        selectMirror={false}
        nowIndicator
        dayMaxEvents
        events={events}
        datesSet={(info) => onDatesChange(info.start, info.end)}
        eventClick={(info) => onEventClick(info.event.id)}
        eventContent={(info) => {
          const color = info.event.backgroundColor || info.event.borderColor || '#1E3A8A';
          const textColor = info.event.textColor || '#ffffff';
          return (
            <div
              className="calendar-event"
              style={{ backgroundColor: color, borderLeft: `3px solid ${color}`, color: textColor }}
            >
              <div className="calendar-event-title">{info.event.title}</div>
              {info.timeText && <div className="calendar-event-time">{info.timeText}</div>}
            </div>
          );
        }}
      />
    </div>
  );
};

export default CalendarView;
