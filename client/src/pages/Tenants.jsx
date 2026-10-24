import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, Spinner, Badge, Alert, Input, Select, Modal, Table, EmptyState, PageHeader, toast } from '../components/ui';

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    propertyId: '',
    leaseStart: '',
    leaseEnd: '',
    status: 'Active'
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [tenantsRes, propsRes] = await Promise.all([
        axios.get('/api/tenants'),
        axios.get('/api/properties')
      ]);
      setTenants(Array.isArray(tenantsRes.data) ? tenantsRes.data : []);
      setProperties(Array.isArray(propsRes.data) ? propsRes.data : []);
    } catch (err) {
      console.error('Error fetching tenants data:', err);
      setError(err.response?.data?.error || 'Failed to load records from the ledger. Please verify connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingTenant(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      propertyId: properties[0]?._id || '',
      leaseStart: new Date().toISOString().split('T')[0],
      leaseEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Active'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (tenant) => {
    setEditingTenant(tenant);
    setFormData({
      fullName: tenant.fullName || '',
      email: tenant.email || '',
      phone: tenant.phone || '',
      propertyId: tenant.propertyId?._id || tenant.propertyId || '',
      leaseStart: tenant.leaseStart ? new Date(tenant.leaseStart).toISOString().split('T')[0] : '',
      leaseEnd: tenant.leaseEnd ? new Date(tenant.leaseEnd).toISOString().split('T')[0] : '',
      status: tenant.status || 'Active'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) {
      setFormError('Tenant name and contact email are required.');
      return;
    }

    try {
      setFormSubmitting(true);
      setFormError('');

      if (editingTenant) {
        await axios.put(`/api/tenants/${editingTenant._id}`, formData);
        toast.success('Tenant record updated successfully.');
      } else {
        await axios.post('/api/tenants', formData);
        toast.success('New tenant registered successfully.');
      }

      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Error saving tenant:', err);
      setFormError(err.response?.data?.error || 'Failed to save tenant record. Please verify fields.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Helper map for properties
  const propertyMap = React.useMemo(() => {
    const map = {};
    properties.forEach((p) => {
      map[p._id] = p;
    });
    return map;
  }, [properties]);

  // Filtered tenants
  const filteredTenants = tenants.filter((tenant) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesName = (tenant.fullName || '').toLowerCase().includes(query);
    const matchesEmail = (tenant.email || '').toLowerCase().includes(query);

    const matchedProp = propertyMap[tenant.propertyId?._id || tenant.propertyId];
    const matchesPropName = matchedProp ? (matchedProp.name || '').toLowerCase().includes(query) : false;

    const matchesSearch = !query || matchesName || matchesEmail || matchesPropName;
    const matchesStatus = !statusFilter || tenant.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Terminated':
      case 'Expired':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="container" style={{ paddingTop: '24px', paddingBottom: '80px' }}>
      {/* PAGE HEADER */}
      <PageHeader
        title="Tenants Ledger"
        subtitle="Maintain complete visibility over active occupants, lease periods, and compliance standing."
        actions={
          <Button variant="primary" onClick={openAddModal}>
            + Add Tenant
          </Button>
        }
      />

      {/* ERROR ALERT */}
      {error && (
        <Alert variant="error" title="Ledger Synchronisation Error" style={{ marginBottom: '24px' }}>
          {error}
        </Alert>
      )}

      {/* FILTER & SEARCH STRIP */}
      <Card style={{ marginBottom: '32px' }} padding="md">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            alignItems: 'end'
          }}
        >
          <Input
            label="Search Records"
            placeholder="Search by tenant name, email, or property..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Select
            label="Lease Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'Active', label: 'Active' },
              { value: 'Pending', label: 'Pending' },
              { value: 'Expired', label: 'Expired' },
              { value: 'Terminated', label: 'Terminated' }
            ]}
          />

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            {(searchQuery || statusFilter) && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* MAIN DATA SECTION */}
      <section className="section" style={{ padding: 0 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <Spinner size="lg" />
            <p style={{ marginTop: '16px', color: 'var(--muted)', fontFamily: 'var(--font-body)' }}>
              Loading registered lease records...
            </p>
          </div>
        ) : filteredTenants.length === 0 ? (
          <EmptyState
            icon="👥"
            title="No Tenants Found"
            description={
              searchQuery || statusFilter
                ? 'No tenant records match your active search filters.'
                : 'Your ledger has no registered tenants. Attach your first occupant to track lease agreements.'
            }
            action={
              <Button variant="primary" onClick={openAddModal}>
                Add a Tenant
              </Button>
            }
          />
        ) : (
          <Card padding="none" variant="bordered">
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Th>Tenant Name</Table.Th>
                  <Table.Th>Contact Information</Table.Th>
                  <Table.Th>Assigned Property</Table.Th>
                  <Table.Th>Lease Period</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th style={{ textAlign: 'right' }}>Actions</Table.Th>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {filteredTenants.map((tenant) => {
                  const prop = propertyMap[tenant.propertyId?._id || tenant.propertyId];
                  const propName = prop ? prop.name : tenant.propertyId?.name || 'Unassigned';
                  const propAddr = prop ? prop.address : tenant.propertyId?.address || '';

                  const startDate = tenant.leaseStart ? new Date(tenant.leaseStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
                  const endDate = tenant.leaseEnd ? new Date(tenant.leaseEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';

                  return (
                    <Table.Row key={tenant._id}>
                      <Table.Td>
                        <div style={{ fontWeight: 600, color: 'var(--text)' }}>
                          {tenant.fullName}
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{tenant.email}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{tenant.phone || 'No phone listed'}</div>
                      </Table.Td>
                      <Table.Td>
                        <div style={{ fontWeight: 500, color: 'var(--primary)' }}>{propName}</div>
                        {propAddr && <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{propAddr}</div>}
                      </Table.Td>
                      <Table.Td>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text)' }}>
                          {startDate} &ndash; {endDate}
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <Badge variant={getStatusBadgeVariant(tenant.status)}>
                          {tenant.status || 'Active'}
                        </Badge>
                      </Table.Td>
                      <Table.Td style={{ textAlign: 'right' }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(tenant)}
                        >
                          Edit Record
                        </Button>
                      </Table.Td>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          </Card>
        )}
      </section>

      {/* SECTION 2: STATUS LEGEND & COMPLIANCE NOTES */}
      <section className="section" style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
        <div className="grid grid-3">
          <Card padding="md">
            <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: '8px' }}>Active Compliance</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', margin: 0 }}>
              Occupants with an active status have legally binding, executing lease documents and full property access privileges.
            </p>
          </Card>
          <Card padding="md">
            <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: '8px' }}>Pending Approvals</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', margin: 0 }}>
              Tenants awaiting counter-signature, credit check clearance, or scheduled move-in inspection verification.
            </p>
          </Card>
          <Card padding="md">
            <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: '8px' }}>Expiring Agreements</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', margin: 0 }}>
              Lease agreements reaching maturity within 60 days automatically flag operational reminders for renewal dispatch.
            </p>
          </Card>
        </div>
      </section>

      {/* ADD / EDIT TENANT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTenant ? 'Edit Tenant Record' : 'Register New Tenant'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          {formError && (
            <Alert variant="error" style={{ marginBottom: '16px' }}>
              {formError}
            </Alert>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <Input
              label="Full Name *"
              name="fullName"
              placeholder="e.g. Eleanor Vance"
              value={formData.fullName}
              onChange={handleInputChange}
            />
            <Input
              label="Email Address *"
              type="email"
              name="email"
              placeholder="e.g. eleanor@example.com"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <Input
              label="Phone Number"
              name="phone"
              placeholder="+1 (555) 019-2834"
              value={formData.phone}
              onChange={handleInputChange}
            />
            <Select
              label="Assigned Property"
              name="propertyId"
              value={formData.propertyId}
              onChange={handleInputChange}
              options={[
                { value: '', label: '-- Select Property --' },
                ...properties.map((p) => ({
                  value: p._id,
                  label: `${p.name} (${p.type || 'Property'})`
                }))
              ]}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <Input
              label="Lease Start Date"
              type="date"
              name="leaseStart"
              value={formData.leaseStart}
              onChange={handleInputChange}
            />
            <Input
              label="Lease End Date"
              type="date"
              name="leaseEnd"
              value={formData.leaseEnd}
              onChange={handleInputChange}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <Select
              label="Lease Status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Pending', label: 'Pending' },
                { value: 'Expired', label: 'Expired' },
                { value: 'Terminated', label: 'Terminated' }
              ]}
            />
          </div>

          <Modal.Footer>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button variant="primary" loading={formSubmitting} type="submit">
              {editingTenant ? 'Save Changes' : 'Register Tenant'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}