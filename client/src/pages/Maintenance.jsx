import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, Badge, Modal, Input, Select, Textarea, PageHeader, Table, EmptyState, Alert, Spinner, toast } from '../components/ui';

export default function Maintenance() {
  const [requests, setRequests] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showResolvedHistory, setShowResolvedHistory] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    propertyId: '',
    description: '',
    priority: 'Medium',
    status: 'Open'
  });

  const priorityOptions = [
    { value: 'Low', label: 'Low Priority' },
    { value: 'Medium', label: 'Medium Priority' },
    { value: 'High', label: 'High Priority' },
    { value: 'Urgent', label: 'Urgent / Emergency' }
  ];

  const statusOptions = [
    { value: 'Open', label: 'Open' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Resolved', label: 'Resolved' },
    { value: 'Closed', label: 'Closed' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [reqRes, propRes] = await Promise.all([
        axios.get('/api/maintenancerequests'),
        axios.get('/api/properties')
      ]);
      setRequests(Array.isArray(reqRes.data) ? reqRes.data : []);
      setProperties(Array.isArray(propRes.data) ? propRes.data : []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to fetch maintenance records. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingRequest(null);
    setFormData({
      title: '',
      propertyId: properties[0]?._id || '',
      description: '',
      priority: 'Medium',
      status: 'Open'
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const openEditModal = (req) => {
    setEditingRequest(req);
    const propId = typeof req.propertyId === 'object' ? req.propertyId?._id : req.propertyId;
    setFormData({
      title: req.title || '',
      propertyId: propId || (properties[0]?._id || ''),
      description: req.description || '',
      priority: req.priority || 'Medium',
      status: req.status || 'Open'
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.propertyId) {
      setModalError('Please fill out all required fields (Title & Property).');
      return;
    }

    try {
      setSubmitting(true);
      setModalError('');

      if (editingRequest) {
        await axios.put(`/api/maintenancerequests/${editingRequest._id}`, formData);
        toast.success('Maintenance request updated successfully');
      } else {
        await axios.post('/api/maintenancerequests', {
          ...formData,
          dateReported: new Date()
        });
        toast.success('Maintenance request submitted successfully');
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      setModalError(err.response?.data?.error || 'Failed to save maintenance request. Check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Urgent':
        return <Badge variant="danger">Urgent / Emergency</Badge>;
      case 'High':
        return <Badge variant="warning">High Priority</Badge>;
      case 'Medium':
        return <Badge variant="info">Medium</Badge>;
      case 'Low':
      default:
        return <Badge variant="secondary">Low</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
      case 'Closed':
        return <Badge variant="success">{status}</Badge>;
      case 'In Progress':
        return <Badge variant="warning">In Progress</Badge>;
      case 'Open':
      default:
        return <Badge variant="primary">Open</Badge>;
    }
  };

  const propertyMap = properties.reduce((acc, p) => {
    acc[p._id] = p.name;
    return acc;
  }, {});

  const getPropertyName = (req) => {
    if (typeof req.propertyId === 'object' && req.propertyId?.name) {
      return req.propertyId.name;
    }
    return propertyMap[req.propertyId] || 'Unassigned Property';
  };

  // Statistics counts
  const totalCount = requests.length;
  const urgentCount = requests.filter(r => r.priority === 'Urgent' && r.status !== 'Resolved' && r.status !== 'Closed').length;
  const highCount = requests.filter(r => r.priority === 'High' && r.status !== 'Resolved' && r.status !== 'Closed').length;
  const inProgressCount = requests.filter(r => r.status === 'In Progress').length;
  const openCount = requests.filter(r => r.status === 'Open').length;

  // Filter processing
  const filteredRequests = requests.filter(req => {
    const isResolved = req.status === 'Resolved' || req.status === 'Closed';
    if (!showResolvedHistory && isResolved) return false;
    if (showResolvedHistory && !isResolved) return false;

    if (priorityFilter !== 'ALL' && req.priority !== priorityFilter) return false;
    if (statusFilter !== 'ALL' && req.status !== statusFilter) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const pName = getPropertyName(req).toLowerCase();
      const title = (req.title || '').toLowerCase();
      const desc = (req.description || '').toLowerCase();
      return pName.includes(q) || title.includes(q) || desc.includes(q);
    }

    return true;
  });

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      {/* Compact Page Hero */}
      <PageHeader
        title="Maintenance Requests"
        subtitle="Track, triage, and resolve portfolio work orders with calm operational clarity."
        actions={
          <Button variant="primary" onClick={openCreateModal}>
            + Log Maintenance Request
          </Button>
        }
      />

      {/* SECTION 1: Operational Priority Summary Strip */}
      <section className="section" style={{ paddingTop: '0', paddingBottom: '32px' }}>
        <div className="grid grid-4">
          <Card padding="md" variant="bordered">
            <div className="stat-label">Urgent / Emergency</div>
            <div className="stat-value" style={{ color: urgentCount > 0 ? '#B5473B' : 'var(--text)' }}>
              {urgentCount}
            </div>
            <p className="hero-subtitle" style={{ fontSize: '0.85rem', marginTop: '4px' }}>
              Requires immediate action
            </p>
          </Card>

          <Card padding="md" variant="bordered">
            <div className="stat-label">High Priority</div>
            <div className="stat-value" style={{ color: 'var(--secondary)' }}>
              {highCount}
            </div>
            <p className="hero-subtitle" style={{ fontSize: '0.85rem', marginTop: '4px' }}>
              Target &lt; 24h resolution
            </p>
          </Card>

          <Card padding="md" variant="bordered">
            <div className="stat-label">In Progress</div>
            <div className="stat-value" style={{ color: 'var(--primary)' }}>
              {inProgressCount}
            </div>
            <p className="hero-subtitle" style={{ fontSize: '0.85rem', marginTop: '4px' }}>
              Technicians assigned
            </p>
          </Card>

          <Card padding="md" variant="bordered">
            <div className="stat-label">Open Queue</div>
            <div className="stat-value">
              {openCount}
            </div>
            <p className="hero-subtitle" style={{ fontSize: '0.85rem', marginTop: '4px' }}>
              Awaiting dispatch
            </p>
          </Card>
        </div>
      </section>

      {/* SECTION 2: Maintenance Log & Filterable Table */}
      <section className="section" style={{ paddingTop: '0', paddingBottom: '48px' }}>
        <Card padding="lg" variant="bordered">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', margin: 0 }}>
                {showResolvedHistory ? 'Resolved History Archive' : 'Active Work Orders'}
              </h2>
              <p className="hero-subtitle" style={{ fontSize: '0.9rem', margin: '4px 0 0 0' }}>
                {showResolvedHistory
                  ? 'Historical log of closed and completed maintenance dispatches.'
                  : 'Current queue of work orders categorized by property and urgency.'}
              </p>
            </div>

            <Button
              variant="ghost"
              onClick={() => setShowResolvedHistory(!showResolvedHistory)}
              style={{ fontSize: '0.85rem' }}
            >
              {showResolvedHistory ? '← View Active Queue' : 'View Resolved History →'}
            </Button>
          </div>

          {/* Filter Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <Input
              placeholder="Search by title, property, or details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Select
              label=""
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Priorities' },
                { value: 'Urgent', label: 'Urgent / Emergency' },
                { value: 'High', label: 'High Priority' },
                { value: 'Medium', label: 'Medium Priority' },
                { value: 'Low', label: 'Low Priority' }
              ]}
            />

            <Select
              label=""
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Statuses' },
                { value: 'Open', label: 'Open' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'Resolved', label: 'Resolved' },
                { value: 'Closed', label: 'Closed' }
              ]}
            />
          </div>

          {error && <Alert variant="error" title="Data Load Error" className="mb-4">{error}</Alert>}

          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <Spinner size="lg" />
              <p style={{ marginTop: '12px', color: 'var(--muted)' }}>Fetching maintenance records...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <EmptyState
              title={showResolvedHistory ? "No resolved requests found" : "No active maintenance issues"}
              description={
                search || priorityFilter !== 'ALL' || statusFilter !== 'ALL'
                  ? "No work orders matched your current filters. Try resetting the search."
                  : showResolvedHistory
                  ? "There are no archived/resolved requests in the system records."
                  : "The portfolio is operating without open issues. Log a new request if something arises."
              }
              action={
                <Button variant="primary" onClick={openCreateModal}>
                  Log New Request
                </Button>
              }
            />
          ) : (
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Th>Request Title</Table.Th>
                  <Table.Th>Property</Table.Th>
                  <Table.Th>Priority</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Date Reported</Table.Th>
                  <Table.Th style={{ textAlign: 'right' }}>Actions</Table.Th>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {filteredRequests.map((req) => (
                  <Table.Row key={req._id}>
                    <Table.Td style={{ fontWeight: 500 }}>
                      <div>{req.title}</div>
                      {req.description && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '2px', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {req.description}
                        </div>
                      )}
                    </Table.Td>
                    <Table.Td>{getPropertyName(req)}</Table.Td>
                    <Table.Td>{getPriorityBadge(req.priority)}</Table.Td>
                    <Table.Td>{getStatusBadge(req.status)}</Table.Td>
                    <Table.Td style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                      {req.dateReported ? new Date(req.dateReported).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                    </Table.Td>
                    <Table.Td style={{ textAlign: 'right' }}>
                      <Button size="sm" variant="ghost" onClick={() => openEditModal(req)}>
                        Update Issue
                      </Button>
                    </Table.Td>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </Card>
      </section>

      {/* SECTION 3: Standard Maintenance Protocol Guide */}
      <section className="section" style={{ paddingTop: '0' }}>
        <div className="section-head" style={{ textAlign: 'left', marginBottom: '24px' }}>
          <span className="eyebrow">Operating Standard</span>
          <h2>Dispatch &amp; Triage Policy</h2>
        </div>
        <div className="grid grid-3">
          <Card padding="md" variant="bordered">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>1. Emergency Triage</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', margin: 0 }}>
              Water leaks, loss of heat, or structural concerns trigger immediate dispatch within 2 hours.
            </p>
          </Card>
          <Card padding="md" variant="bordered">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>2. Resident Updates</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', margin: 0 }}>
              Status changes from "Open" to "In Progress" automatically notify the primary tenant contact on record.
            </p>
          </Card>
          <Card padding="md" variant="bordered">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>3. Closing Reconciliation</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', margin: 0 }}>
              Resolved requests store full audit dates to ensure accurate vendor accounting and property performance metrics.
            </p>
          </Card>
        </div>
      </section>

      {/* CREATE / EDIT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRequest ? "Update Maintenance Request" : "New Maintenance Request"}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          {modalError && <Alert variant="error" title="Submission Error" className="mb-4">{modalError}</Alert>}

          <Input
            label="Request Title *"
            name="title"
            placeholder="e.g. HVAC Unit Making Loud Humming Sound"
            value={formData.title}
            onChange={handleFormChange}
            required
            style={{ marginBottom: '16px' }}
          />

          <Select
            label="Property *"
            name="propertyId"
            value={formData.propertyId}
            onChange={handleFormChange}
            options={
              properties.length > 0
                ? properties.map(p => ({ value: p._id, label: `${p.name} (${p.address})` }))
                : [{ value: '', label: 'No properties available — add property first' }]
            }
            style={{ marginBottom: '16px' }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <Select
              label="Priority Level"
              name="priority"
              value={formData.priority}
              onChange={handleFormChange}
              options={priorityOptions}
            />

            <Select
              label="Current Status"
              name="status"
              value={formData.status}
              onChange={handleFormChange}
              options={statusOptions}
            />
          </div>

          <Textarea
            label="Detailed Description"
            name="description"
            placeholder="Provide context, tenant observations, or entry instructions for the maintenance contractor..."
            rows={4}
            value={formData.description}
            onChange={handleFormChange}
            style={{ marginBottom: '24px' }}
          />

          <Modal.Footer>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button variant="primary" loading={submitting} type="submit">
              {editingRequest ? "Save Changes" : "Submit Request"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}