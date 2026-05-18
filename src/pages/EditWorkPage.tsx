import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { workService, clientService, userService } from '../services/api';
import { Client, Status, WorkRole, User, UpdateWorkDto } from '../types';
import { formatDateForInput } from '../utils/date';
import { FORM_LABELS } from '../constants/formLabels';
import { BackButton } from '../components/forms/BackButton';
import { EditClientSelector } from '../components/forms/EditClientSelector';
import { EditBasicInfoForm } from '../components/forms/EditBasicInfoForm';
import { EditDatesForm } from '../components/forms/EditDatesForm';
import { EditTeamAssignments } from '../components/forms/EditTeamAssignments';
import { EditCommentsForm } from '../components/forms/EditCommentsForm';
import '../styles/EditWorkPage.css';

export const EditWorkPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
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

  // Nowy klient
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientContact, setNewClientContact] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    
    try {
      const [workData, clientsData, usersData] = await Promise.all([
        workService.getWork(parseInt(id)),
        clientService.getAllClients(),
        userService.getActiveUsers(),
      ]);
      
      setClients(clientsData);
      setUsers(usersData);

      // Wypełnij formularz danymi pracy
      setFormData({
        name: workData.name,
        city: workData.city,
        district: workData.district,
        region: workData.region,
        parcel_number: workData.parcel_number,
        operator_id: workData.operator_id,
        report_id: workData.report_id || '',
        report_date: formatDateForInput(workData.report_date),
        notification_date: formatDateForInput(workData.notification_date),
        fieldwork_date: formatDateForInput(workData.fieldwork_date),
        completion_date: formatDateForInput(workData.completion_date),
        ready_date: formatDateForInput(workData.ready_date),
        acceptance_date: formatDateForInput(workData.acceptance_date),
        status: workData.status,
        comments: workData.comments || '',
        client_id: workData.client_id,
      });

      // Wypełnij przypisania
      if (workData.assignments) {
        const fieldworkerIds = workData.assignments
          .filter(a => a.role === WorkRole.fieldworker)
          .map(a => a.user_id);
        const completerIds = workData.assignments
          .filter(a => a.role === WorkRole.completer)
          .map(a => a.user_id);
        
        setFieldworkers(fieldworkerIds);
        setCompleters(completerIds);
      }
    } catch (error) {
      console.error('Nie udało się załadować danych:', error);
      toast.error('Nie udało się załadować danych pracy');
      navigate('/dashboard');
    } finally {
      setLoading(false);
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
      
      // Przygotuj assignments
      const assignments = [
        ...fieldworkers.map(userId => ({ userId, role: WorkRole.fieldworker })),
        ...completers.map(userId => ({ userId, role: WorkRole.completer })),
      ];

      const workDto: UpdateWorkDto = {
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

      await workService.updateWork(parseInt(id!), workDto);
      toast.success('Praca została zaktualizowana');
      navigate(`/works/${id}`);
    } catch (error: any) {
      console.error('Error updating work:', error);
      toast.error(error.response?.data?.message || 'Nie udało się zaktualizować pracy');
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

  const toggleFieldworker = (userId: number) => {
    setFieldworkers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const toggleCompleter = (userId: number) => {
    setCompleters(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleShowNewClientForm = () => {
    setShowNewClientForm(true);
  };

  const handleCreateClient = async () => {
    if (!newClientName.trim()) {
      toast.error('Nazwa klienta jest wymagana');
      return;
    }

    try {
      const newClient = await clientService.createClient({
        name: newClientName.trim(),
        contact: newClientContact.trim() || undefined,
      });
      
      setClients(prev => [...prev, newClient]);
      setFormData(prev => ({ ...prev, client_id: newClient.client_id }));
      setNewClientName('');
      setNewClientContact('');
      setShowNewClientForm(false);
      toast.success('Klient został dodany');
    } catch (error: any) {
      console.error('Error creating client:', error);
      toast.error(error.response?.data?.message || 'Nie udało się utworzyć klienta');
    }
  };

  const handleCancelNewClient = () => {
    setNewClientName('');
    setNewClientContact('');
    setShowNewClientForm(false);
  };

  // status -> label mapping is provided by src/utils/status

  if (loading) {
    return <div className="edit-work-loading">Ładowanie...</div>;
  }

  return (
    <div className="edit-work-container">
      <header className="edit-work-header">
        <BackButton to={`/works/${id}`} label={FORM_LABELS.cancel} className="edit-work-back-button" />
        <h1>{FORM_LABELS.editWork}</h1>
      </header>

      <form onSubmit={handleSubmit} className="edit-work-form">
        <EditClientSelector
          clients={clients}
          selectedClientId={formData.client_id}
          showNewClientForm={showNewClientForm}
          newClientName={newClientName}
          newClientContact={newClientContact}
          onClientChange={handleInputChange}
          onShowNewClientForm={handleShowNewClientForm}
          onNewClientNameChange={setNewClientName}
          onNewClientContactChange={setNewClientContact}
          onCreateClient={handleCreateClient}
          onCancelNewClient={handleCancelNewClient}
        />

        <EditBasicInfoForm
          formData={formData}
          users={users}
          onInputChange={handleInputChange}
        />

        <EditDatesForm
          formData={formData}
          onInputChange={handleInputChange}
        />

        <EditTeamAssignments
          users={users}
          fieldworkers={fieldworkers}
          completers={completers}
          onToggleFieldworker={toggleFieldworker}
          onToggleCompleter={toggleCompleter}
        />

        <EditCommentsForm
          comments={formData.comments}
          onCommentsChange={handleInputChange}
        />

        <div className="edit-work-actions">
          <button type="submit" disabled={submitting} className="edit-work-submit-button">
            {submitting ? FORM_LABELS.saving : FORM_LABELS.saveChanges}
          </button>
          <Link to={`/works/${id}`} className="edit-work-cancel-link">
            {FORM_LABELS.cancel}
          </Link>
        </div>
      </form>
    </div>
  );
};

