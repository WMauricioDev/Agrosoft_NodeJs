import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';
import ReuModal from './ReuModal';
import { addToast } from "@heroui/react";

type EventType = 'timed' | 'allDay';

interface CalendarEvent {
  id: number;
  title: string;
  start: string;
  allDay: boolean;
  backgroundColor: string;
  extendedProps: {
    description?: string;
  };
}

interface DateClickArg {
  dateStr: string;
  allDay: boolean;
  date: Date;
  view: any;
}

interface EventClickArg {
  event: {
    id: string;
    title: string;
    remove: () => void;
  };
}

const Calendario = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DateClickArg | null>(null);

  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState<EventType>('timed');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        setEvents(parsedEvents);
      } catch (error) {
        console.error('Error parsing saved events:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const showToast = (options: {
    title: string;
    description?: string;
    color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
    timeout?: number;
  }) => {
    addToast({
      title: options.title,
      description: options.description,
      color: options.color || "default",
      timeout: options.timeout || 3000,
    });
  };

  const handleDateClick = (arg: DateClickArg) => {
    setSelectedDate(arg);
    setIsModalVisible(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    addToast({
      title: `¿Eliminar recordatorio "${clickInfo.event.title}"?`,
      color: "danger",
      timeout: 5000,
      description: (
        <div style={{display: 'flex', gap: '8px', marginTop: '8px'}}>
          <button
            onClick={() => {
              setEvents(events.filter(event => event.id !== parseInt(clickInfo.event.id)));
              showToast({ title: 'Recordatorio eliminado', color: 'success' });
            }}
            style={{
              padding: '6px 12px',
              backgroundColor: '#52c41a',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Sí
          </button>
          <button
            onClick={() => {
              showToast({ title: 'Operación cancelada', color: 'secondary' });
            }}
            style={{
              padding: '6px 12px',
              backgroundColor: '#f0f0f0',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            No
          </button>
        </div>
      ),
      hideIcon: false,
    });
  };

  const handleModalConfirm = () => {
    if (!selectedDate || !title.trim() || (eventType === 'timed' && !time)) {
      showToast({ title: 'Por favor llena todos los campos obligatorios.', color: 'danger' });
      return;
    }

    const newEvent: CalendarEvent = {
      id: Date.now(),
      title: title.trim(),
      start: selectedDate.dateStr + (eventType === 'timed' ? `T${time}` : ''),
      allDay: eventType === 'allDay',
      backgroundColor: eventType === 'allDay' ? '#1890ff' : '#52c41a',
      extendedProps: {
        description
      }
    };

    setEvents([...events, newEvent]);

    setTitle('');
    setEventType('timed');
    setTime('');
    setDescription('');
    setIsModalVisible(false);

    showToast({ title: 'Recordatorio agregado', color: 'success' });
  };
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Calendario de Recordatorios</h1>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        locales={[esLocale]}
        locale="es"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        height="80vh"
        editable={true}
        selectable={true}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        events={events}
        eventDisplay="block"
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false
        }}
      />

      <ReuModal
        isOpen={isModalVisible}
        onOpenChange={setIsModalVisible}
        title="Nuevo Recordatorio"
        onConfirm={handleModalConfirm}
        confirmText="Guardar"
        cancelText="Cancelar"
      >
        <div className="space-y-4">
          <div>
            <label className="block font-medium">Título</label>
            <input
              type="text"
              className="w-full border rounded px-2 py-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Reunión con equipo"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Tipo de evento</label>
            <select
              className="w-full border rounded px-2 py-1"
              value={eventType}
              onChange={(e) => setEventType(e.target.value as EventType)}
            >
              <option value="timed">Con hora específica</option>
              <option value="allDay">Todo el día</option>
            </select>
          </div>

          {eventType === 'timed' && (
            <div>
              <label className="block font-medium">Hora</label>
              <input
                type="time"
                className="w-full border rounded px-2 py-1"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="block font-medium">Descripción (opcional)</label>
            <textarea
              className="w-full border rounded px-2 py-1"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      </ReuModal>
    </div>
  );
};

export default Calendario;
