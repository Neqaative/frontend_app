import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { calendarService } from '../services/calendar.service';
import { userService } from '../services/user.service';
import { CalendarEvent, CreateEventDto, UpdateEventDto } from '../types/calendar.types';
import { User } from '../types/user.types';
import { useToast } from '../contexts/ToastContext';
import { EVENT_TYPE_LABELS } from '../constants/eventTypes';
import { CALENDAR_CONSTANTS, CALENDAR_MESSAGES } from '../constants/calendar';
import { formatDateForInput } from '../utils/dateUtils';
import { CalendarHeader } from '../components/Calendar/CalendarHeader';
import { CalendarGrid } from '../components/Calendar/CalendarGrid';
import { EventModal } from '../components/Calendar/EventModal';
import { ConfirmDeleteModal } from '../components/Calendar/ConfirmDeleteModal';
import '../styles/CalendarPage.css';

const getInitialFormData = (): CreateEventDto => ({
  title: '',
  type: CALENDAR_CONSTANTS.DEFAULT_EVENT_TYPE,
  description: '',
  start_date: '',
  end_date: '',
  location: '',
  all_day: false,
});

export const CalendarPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [formData, setFormData] = useState<CreateEventDto>(getInitialFormData());

  const isViewingOwnCalendar = selectedUserId === currentUser?.user_id;

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedUserId !== null) {
      loadEvents();
    }
  }, [selectedUserId]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [currentUserData, allUsers] = await Promise.all([
        userService.getMe(),
        userService.getAllUsers(),
      ]);
      setCurrentUser(currentUserData);
      setUsers(allUsers);
      setSelectedUserId(currentUserData.user_id);
    } catch (error) {
      showToast(CALENDAR_MESSAGES.ERROR_LOADING_DATA, 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      let eventsData: CalendarEvent[];
      
      if (selectedUserId === currentUser?.user_id) {
        eventsData = await calendarService.getEvents();
      } else if (selectedUserId !== null) {
        eventsData = await calendarService.getUserEvents(selectedUserId);
      } else {
        return;
      }
      
      setEvents(eventsData);
    } catch (error) {
      showToast(CALENDAR_MESSAGES.ERROR_LOADING_EVENTS, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (event?: CalendarEvent, prefilledDate?: string) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        type: event.type,
        description: event.description,
        start_date: formatDateForInput(event.start_date),
        end_date: formatDateForInput(event.end_date),
        location: event.location,
        all_day: event.all_day,
      });
    } else {
      setEditingEvent(null);
      const initialData = getInitialFormData();
      setFormData(prefilledDate ? {
        ...initialData,
        start_date: prefilledDate,
        end_date: prefilledDate,
      } : initialData);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEvent(null);
  };

  const handleAddEventForDate = (date: Date) => {
    const dateStr = formatDateForInput(date);
    handleOpenModal(undefined, dateStr);
  };

  const handleFormChange = (data: Partial<CreateEventDto>) => {
    setFormData({ ...formData, ...data });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isViewingOwnCalendar) {
      showToast(CALENDAR_MESSAGES.ERROR_NO_PERMISSION_EDIT, 'error');
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        title: formData.title || EVENT_TYPE_LABELS[formData.type]
      };
      
      if (editingEvent) {
        await calendarService.updateEvent(editingEvent.index, dataToSend as UpdateEventDto);
        showToast(CALENDAR_MESSAGES.SUCCESS_EVENT_UPDATED, 'success');
      } else {
        await calendarService.createEvent(dataToSend);
        showToast(CALENDAR_MESSAGES.SUCCESS_EVENT_CREATED, 'success');
      }
      handleCloseModal();
      loadEvents();
    } catch (error) {
      showToast(CALENDAR_MESSAGES.ERROR_SAVING_EVENT, 'error');
    }
  };

  const handleDelete = (eventIndex: number) => {
    if (!isViewingOwnCalendar) {
      showToast(CALENDAR_MESSAGES.ERROR_NO_PERMISSION_DELETE, 'error');
      return;
    }
    setEventToDelete(eventIndex);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (eventToDelete === null) return;

    try {
      await calendarService.deleteEvent(eventToDelete);
      showToast(CALENDAR_MESSAGES.SUCCESS_EVENT_DELETED, 'success');
      loadEvents();
      setShowDeleteModal(false);
      setEventToDelete(null);
      handleCloseModal();
    } catch (error) {
      showToast(CALENDAR_MESSAGES.ERROR_DELETING_EVENT, 'error');
    }
  };

  const changeMonth = (increment: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
  };

  if (loading && !currentUser) {
    return <div className="calendar-loading">{CALENDAR_MESSAGES.LOADING}</div>;
  }

  return (
    <div className="calendar-page">
      <CalendarHeader
        users={users}
        selectedUserId={selectedUserId}
        currentUserId={currentUser?.user_id}
        onUserChange={setSelectedUserId}
        onBack={() => navigate('/dashboard')}
      />

      <div className="calendar-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <button onClick={() => changeMonth(-1)} className="form-btn cancel">
            ← Poprzedni
          </button>
          <h2 style={{ margin: 0 }}>
            {currentDate.toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={() => changeMonth(1)} className="form-btn cancel">
            Następny →
          </button>
        </div>

        <CalendarGrid
          currentDate={currentDate}
          events={events}
          isViewingOwnCalendar={isViewingOwnCalendar}
          onAddEvent={handleAddEventForDate}
          onEventClick={handleOpenModal}
        />
      </div>

      <EventModal
        isOpen={showModal}
        isEditing={!!editingEvent}
        formData={formData}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        onDelete={editingEvent ? () => handleDelete(editingEvent.index) : undefined}
        onChange={handleFormChange}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};
