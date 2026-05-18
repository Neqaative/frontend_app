import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { workService, clientService, userService } from '../services/api';
import { Client, CreateWorkDto, Status, WorkRole, User } from '../types';
import { FORM_LABELS } from '../constants/formLabels';
import { BackButton } from '../components/forms/BackButton';
import { ClientSelector } from '../components/forms/ClientSelector';
import { BasicInfoForm } from '../components/forms/BasicInfoForm';
import { DatesForm } from '../components/forms/DatesForm';
import { TeamAssignments } from '../components/forms/TeamAssignments';
import { CommentsForm } from '../components/forms/CommentsForm';
import '../styles/AddWorkPage.css';

export const AddWorkPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Tryb dodawania nowego klienta
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientContact, setNewClientContact] = useState('');
  
  // Formularz pracy
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    district: '',
    region: '',
    parcel_number: '',
    operator_id: 0,
    report_id: '',
    report_date: '',
    notification_date: '',
    fieldwork_date: '',
    completion_date: '',
    ready_date: '',
    acceptance_date: '',
    status: Status.submitted,
    comments: '',
    client_id: 0,
  });

  // Przypisania pracowników
  const [fieldworkers, setFieldworkers] = useState<number[]>([]);
  const [completers, setCompleters] = useState<number[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
  }, [formData]);

  useEffect(() => {
  }, [fieldworkers]);

  useEffect(() => {
  }, [completers]);

  const loadData = async () => {
    try {
      const [clientsData, usersData] = await Promise.all([
        clientService.getAllClients(),
        userService.getActiveUsers(), // Użyj nowego endpointu dla aktywnych użytkowników
      ]);
      setClients(clientsData);
      setUsers(usersData);
    } catch (error) {
      console.error('Nie udało się załadować danych:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async () => {
    if (!newClientName.trim()) {
      toast.error('Nazwa klienta jest wymagana');
      return;
    }

    try {
      const newClient = await clientService.createClient({
        name: newClientName,
        contact: newClientContact || undefined,
      });
      
      setClients([...clients, newClient]);
      setFormData({ ...formData, client_id: newClient.client_id });
      setShowNewClientForm(false);
      setNewClientName('');
      setNewClientContact('');
      toast.success('Klient został dodany');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Nie udało się dodać klienta');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.client_id) {
      toast.error('Wybierz klienta');
      return;
    }

    try {
      setSubmitting(true);
      
      const assignments = [
        ...fieldworkers.map(userId => ({ userId, role: WorkRole.fieldworker })),
        ...completers.map(userId => ({ userId, role: WorkRole.completer })),
      ];

      const workDto: CreateWorkDto = {
        ...formData,
        report_date: new Date(formData.report_date),
        notification_date: new Date(formData.notification_date),
        fieldwork_date: new Date(formData.fieldwork_date),
        completion_date: new Date(formData.completion_date),
        ready_date: new Date(formData.ready_date),
        acceptance_date: new Date(formData.acceptance_date),
        comments: formData.comments || undefined,
        assignments,
      };


      const createdWork = await workService.createWork(workDto);
      toast.success('Praca została dodana');
      navigate(`/works/${createdWork.work_id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Nie udało się dodać pracy');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'client_id' || name === 'operator_id') ? Number(value) || 0 : value,
    }));
  };

  const handleClientChange = (clientId: number) => {
    setFormData(prev => ({ ...prev, client_id: clientId }));
  };

  const handleCancelNewClient = () => {
    setShowNewClientForm(false);
    setNewClientName('');
    setNewClientContact('');
  };

  const toggleFieldworker = (userId: number) => {
    setFieldworkers(prev => {
      const newValue = prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId];
      return newValue;
    });
  };

  const toggleCompleter = (userId: number) => {
    setCompleters(prev => {
      const newValue = prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId];
      return newValue;
    });
  };

  if (loading) {
    return <div className="add-work-loading">Ładowanie...</div>;
  }

  return (
    <div className="add-work-container">
      <header className="add-work-header">
        <BackButton to="/dashboard" label={FORM_LABELS.backToDashboard} />
        <h1>Dodaj nową pracę</h1>
      </header>

      <form onSubmit={handleSubmit} className="add-work-form">
        <ClientSelector
          clients={clients}
          selectedClientId={formData.client_id}
          showNewClientForm={showNewClientForm}
          newClientName={newClientName}
          newClientContact={newClientContact}
          onClientChange={handleClientChange}
          onShowNewClientForm={() => setShowNewClientForm(true)}
          onNewClientNameChange={setNewClientName}
          onNewClientContactChange={setNewClientContact}
          onCreateClient={handleCreateClient}
          onCancelNewClient={handleCancelNewClient}
        />

        <BasicInfoForm
          formData={formData}
          users={users}
          onInputChange={handleInputChange}
        />

        <DatesForm
          formData={formData}
          onInputChange={handleInputChange}
        />

        <TeamAssignments
          users={users}
          fieldworkers={fieldworkers}
          completers={completers}
          onToggleFieldworker={toggleFieldworker}
          onToggleCompleter={toggleCompleter}
        />

        <CommentsForm
          comments={formData.comments}
          onCommentsChange={(comments) => setFormData(prev => ({ ...prev, comments }))}
        />

        {/* Przyciski akcji */}
        <div className="add-work-actions">
          <button type="submit" disabled={submitting} className="add-work-submit-button">
            {submitting ? 'Dodawanie...' : FORM_LABELS.addWork}
          </button>
          <Link to="/dashboard" className="add-work-cancel-link">
            {FORM_LABELS.cancel}
          </Link>
        </div>
      </form>
    </div>
  );
};

