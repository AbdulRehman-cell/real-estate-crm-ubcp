import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, Spinner, Badge, Alert, Input, Select, Modal, Table, EmptyState, toast } from '../components/ui';

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: 'Apartment',
    status: 'Occupied',
    monthlyRent: ''
  });

  const propertyTypes = ['Apartment', 'Single Family', 'Multi Family', 'Commercial', 'Condo', 'Townhouse'];
  const propertyStatuses = ['Occupied', 'Vacant', 'Under Maintenance', 'Available'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [propsRes, tenantsRes, maintRes] = await Promise.all([
        axios.get('/api/properties'),
        axios.get('/api/tenants').catch(() => ({ data: [] })),
        axios.get('/api/maintenancerequests').catch(() => ({ data: [] }))
      ]);

      setProperties(Array.isArray(propsRes.data) ? propsRes.data : []);
      setTenants(Array.isArray(tenantsRes.data) ? tenantsRes.data : []);
      setMaintenance(Array.isArray(maintRes.data) ? maintRes.data : []);
    } catch (err) {
      console.error('Error fetching properties data:', err);
      setError(err.response?.data?.error || 'Failed to load property ledger. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (property = null) => {
    setFormError('');
    if (property) {
      setEditingProperty(property);
      setFormData({
        name: property.name || '',
        address: property.address || '',
        type: property.type || 'Apartment',
        status: property.status || 'Occupied',
        monthlyRent: property.monthlyRent !== undefined ? property.monthlyRent : ''
      });
    } else {
      setEditingProperty(null);
      setFormData({
        name: '',
        address: '',
        type: 'Apartment',
        status: 'Occupied',
        monthlyRent: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProperty(null);
    setFormError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.address.trim()) {
      setFormError('Property name and physical address are required.');
      return;
    }

    if (!formData.monthlyRent || isNaN(formData.monthlyRent) || Number(formData.monthlyRent) < 0) {
      setFormError('Please enter a valid monthly rent amount.');
      return;
    }

    setSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      address: formData.address.trim(),
      type: formData.type,
      status: formData.status,
      monthlyRent: Number(formData.monthlyRent)
    };

    try {
      if (editingProperty) {
        const res = await axios.put(`/api/properties/${editingProperty._id}`, payload);
        setProperties((prev) => prev.map((p) => (p._id === editingProperty._id ? res.data : p)));
        toast.success('Property details updated successfully.');
      } else {
        const res = await axios.post('/api/properties', payload);
        setProperties((prev) => [res.data, ...prev]);
        toast.success('New property added to portfolio ledger.');
      }
      handleCloseModal();
    } catch (err) {
      console.error('Error saving property:', err);
      setFormError(err.response?.data?.error || 'Failed to save property record. Please verify fields.');
    } finally {
      setSubmitting(false);
    }
  };

  // Status Badge Mapping
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Occupied':
        return 'primary';
      case 'Vacant':
        return 'warning';
      case 'Under Maintenance':
        return 'secondary';
      default:
        return 'info';
    }
  };

  // Filter Logic
  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.address || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || p.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate summary stats
  const totalUnits = properties.length;
  const occupiedUnits = properties.filter((p) => p.status === 'Occupied').length;
  const occupancyRate = totalUnits ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
  const totalMonthlyRoll = properties.reduce((sum, p) => sum + Number(p.monthlyRent || 0), 0);

  return (
    <div className="container" style={{ paddingTop: '32px', paddingBottom: '80px' }}>
      {/* Page Header */}
      <section className="section-head" style={{ textAlign: 'left', marginBottom: '32px' }}>
        <span className="eyebrow">PORTFOLIO ASSETS &amp; RENT ROLL</span>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginTop: '8px' }}>
          <div>
            <h1 style={{ marginBottom: '8px' }}>Properties</h1>
            <p className="hero-subtitle" style={{ maxWidth: '640px', margin: 0 }}>
              Every address, its asset class, current occupancy status, and scheduled rent — in one unified ledger.
            </p>
          </div>
          <Button variant="primary" onClick={() => handleOpenModal()}>
            + Add Property
          </Button>
        </div>
      </section>

      {/* Overview Stat Strip */}
      <section className="section" style={{ padding: '0 0 32px 0' }}>
        <div className="grid grid-3">
          <Card padding="md" variant="bordered">
            <div className="stat-label">TOTAL MANAGED ASSETS</div>
            <div className="stat-value" style={{ fontFamily: 'Fraunces, serif', fontSize: '2.2rem', marginTop: '4px' }}>
              {totalUnits} Units
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '4px' }}>
              Across {new Set(properties.map((p) => p.type)).size} distinct asset types
            </div>
          </Card>

          <Card padding="md" variant="bordered">
            <div className="stat-label">PORTFOLIO OCCUPANCY</div>
            <div className="stat-value" style={{ fontFamily: 'Fraunces, serif', fontSize: '2.2rem', marginTop: '4px' }}>
              {occupancyRate}%
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '4px' }}>
              {occupiedUnits} of {totalUnits} active leases assigned
            </div>
          </Card>

          <Card padding="md" variant="bordered">
            <div className="stat-label">GROSS MONTHLY RENT ROLL</div>
            <div className="stat-value" style={{ fontFamily: 'Fraunces, serif', fontSize: '2.2rem', marginTop: '4px' }}>
              ${totalMonthlyRoll.toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '4px' }}>
              Expected monthly gross recurring yield
            </div>
          </Card>
        </div>
      </section>

      {/* Main Table Section */}
      <section className="section" style={{ padding: '0 0 48px 0' }}>
        <Card padding="lg" variant="bordered">
          {/* Filter Bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
              paddingBottom: '20px',
              borderBottom: '1px solid var(--border)'
            }}
          >
            <div style={{ flex: '1 1 300px', maxWidth: '400px' }}>
              <Input
                placeholder="Search by property name or physical address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ minWidth: '160px' }}>
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  options={[
                    { value: 'ALL', label: 'All Property Types' },
                    ...propertyTypes.map((t) => ({ value: t, label: t }))
                  ]}
                />
              </div>

              <div style={{ minWidth: '160px' }}>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={[
                    { value: 'ALL', label: 'All Statuses' },
                    ...propertyStatuses.map((s) => ({ value: s, label: s }))
                  ]}
                />
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="error" title="Ledger Fetch Error" className="animate-in" style={{ marginBottom: '20px' }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <div style={{ padding: '60px 0', textAlign: 'center' }}>
              <Spinner size="lg" />
              <p style={{ marginTop: '16px', color: 'var(--muted)', fontSize: '0.9rem' }}>
                Syncing portfolio asset ledger...
              </p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <EmptyState
              icon={
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 21h18M3 10l9-7 9 7v11H3V10z" />
                </svg>
              }
              title={searchTerm || typeFilter !== 'ALL' || statusFilter !== 'ALL' ? 'No matching properties' : 'No properties in portfolio yet'}
              description={
                searchTerm || typeFilter !== 'ALL' || statusFilter !== 'ALL'
                  ? 'Try broadening your search query or clear property filters.'
                  : 'Start building your portfolio ledger by adding your first building or unit.'
              }
              action={
                searchTerm || typeFilter !== 'ALL' || statusFilter !== 'ALL' ? (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSearchTerm('');
                      setTypeFilter('ALL');
                      setStatusFilter('ALL');
                    }}
                  >
                    Reset Filters
                  </Button>
                ) : (
                  <Button variant="primary" onClick={() => handleOpenModal()}>
                    + Add First Property
                  </Button>
                )
              }
            />
          ) : (
            <div>
              <Table>
                <Table.Head>
                  <Table.Row>
                    <Table.Th>PROPERTY &amp; LOCATION</Table.Th>
                    <Table.Th>TYPE</Table.Th>
                    <Table.Th>STATUS</Table.Th>
                    <Table.Th>TENANT / LEASE</Table.Th>
                    <Table.Th>OPEN ISSUES</Table.Th>
                    <Table.Th style={{ textAlign: 'right' }}>MONTHLY RENT</Table.Th>
                    <Table.Th style={{ textAlign: 'right' }}>ACTIONS</Table.Th>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {filteredProperties.map((prop) => {
                    // Match assigned tenant
                    const assignedTenant = tenants.find((t) => {
                      const tPropId = typeof t.propertyId === 'object' ? t.propertyId?._id : t.propertyId;
                      return tPropId === prop._id && t.status === 'Active';
                    });

                    // Match open maintenance
                    const openMaintCount = maintenance.filter((m) => {
                      const mPropId = typeof m.propertyId === 'object' ? m.propertyId?._id : m.propertyId;
                      return mPropId === prop._id && m.status !== 'Resolved' && m.status !== 'Closed';
                    }).length;

                    return (
                      <Table.Row key={prop._id}>
                        <Table.Td>
                          <div style={{ fontWeight: '600', color: 'var(--text)' }}>{prop.name || 'Unnamed Property'}</div>
                          <div style={{ fontSize: '0.825rem', color: 'var(--muted)', marginTop: '2px' }}>
                            {prop.address || 'Address unrecorded'}
                          </div>
                        </Table.Td>
                        <Table.Td>
                          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{prop.type || 'Apartment'}</span>
                        </Table.Td>
                        <Table.Td>
                          <Badge variant={getStatusBadgeVariant(prop.status)}>
                            {prop.status || 'Occupied'}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          {assignedTenant ? (
                            <div>
                              <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>{assignedTenant.fullName}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>Lease Active</div>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.85rem', color: 'var(--muted)', italic: 'true' }}>
                              Unassigned
                            </span>
                          )}
                        </Table.Td>
                        <Table.Td>
                          {openMaintCount > 0 ? (
                            <span
                              style={{
                                fontSize: '0.8rem',
                                color: '#B5473B',
                                fontWeight: '600',
                                padding: '2px 8px',
                                background: 'rgba(181, 71, 59, 0.1)',
                                borderRadius: '12px'
                              }}
                            >
                              {openMaintCount} Open
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>None</span>
                          )}
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'right', fontWeight: '600', fontFamily: 'Inter, sans-serif' }}>
                          ${Number(prop.monthlyRent || 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                        </Table.Td>
                        <Table.Td style={{ textAlign: 'right' }}>
                          <Button variant="ghost" size="sm" onClick={() => handleOpenModal(prop)}>
                            Edit
                          </Button>
                        </Table.Td>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>

              <div
                style={{
                  marginTop: '20px',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.825rem',
                  color: 'var(--muted)',
                  borderTop: '1px solid var(--border)',
                  paddingTop: '16px'
                }}
              >
                <div>
                  Showing {filteredProperties.length} of {properties.length} total entries
                </div>
                <div>Ledger synchronized with central database</div>
              </div>
            </div>
          )}
        </Card>
      </section>

      {/* Portfolio Discipline Section */}
      <section className="section" style={{ padding: '0 0 32px 0' }}>
        <div className="grid grid-2">
          <Card padding="lg" variant="bordered">
            <span className="eyebrow" style={{ color: 'var(--secondary)' }}>
              ASSET MANAGEMENT STANDARD
            </span>
            <h3 style={{ marginTop: '8px', marginBottom: '12px' }}>Uniform Valuation &amp; Terms</h3>
            <p style={{ fontSize: '0.925rem', color: 'var(--muted)', lineHeight: '1.6' }}>
              Every property registered in Holt &amp; Ives enforces strict metadata binding. Monthly yields, maintenance logs, and tenant lease agreements auto-link to this master key to maintain 100% audit accuracy.
            </p>
          </Card>

          <Card padding="lg" variant="bordered">
            <span className="eyebrow" style={{ color: 'var(--accent)' }}>
              AUTOMATED COMPLIANCE
            </span>
            <h3 style={{ marginTop: '8px', marginBottom: '12px' }}>Maintenance &amp; Rent Roll Sync</h3>
            <p style={{ fontSize: '0.925rem', color: 'var(--muted)', lineHeight: '1.6' }}>
              When a unit status transitions to <em>Under Maintenance</em>, active ticket queues elevate priority automatically, and lease renewals for the corresponding unit trigger warning advisories.
            </p>
          </Card>
        </div>
      </section>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProperty ? 'Edit Property Details' : 'Add Property to Portfolio'}
        size="lg"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '8px' }}>
          {formError && (
            <Alert variant="error" title="Submission Error">
              {formError}
            </Alert>
          )}

          <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '4px' }}>
            Enter official record details for this real estate asset. Information recorded here cascades across tenant leases and revenue projections.
          </div>

          <Input
            label="PROPERTY NAME OR IDENTIFIER"
            placeholder="e.g. Oakridge Heights - Unit 4B"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          <Input
            label="PHYSICAL ADDRESS"
            placeholder="e.g. 1042 Grand Avenue, Suite 4B, Chicago IL"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Select
              label="PROPERTY TYPE"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              options={propertyTypes.map((t) => ({ value: t, label: t }))}
            />

            <Select
              label="CURRENT STATUS"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              options={propertyStatuses.map((s) => ({ value: s, label: s }))}
            />
          </div>

          <Input
            label="MONTHLY RENT ($ USD)"
            placeholder="e.g. 2450"
            type="number"
            name="monthlyRent"
            value={formData.monthlyRent}
            onChange={handleInputChange}
            required
          />

          <Modal.Footer>
            <Button variant="ghost" type="button" onClick={handleCloseModal} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={submitting}>
              {editingProperty ? 'Save Property Updates' : 'Add Property to Ledger'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}