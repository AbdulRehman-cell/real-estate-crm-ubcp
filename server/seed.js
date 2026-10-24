const Property = require('./models/Property');
const Tenant = require('./models/Tenant');
const MaintenanceRequest = require('./models/MaintenanceRequest');

async function seedData() {
  try {
    console.log('Checking database seed requirements...');

    // 1. Seed Properties
    const propertyCount = await Property.countDocuments();
    let properties = [];
    
    if (propertyCount === 0) {
      console.log('Seeding properties...');
      const propertyData = [
        {
          name: 'The Grandview Heights',
          address: '742 Evergreen Terrace, Springfield, OR 97477',
          type: 'Apartment',
          status: 'Occupied',
          monthlyRent: 2450,
          bedrooms: 2,
          bathrooms: 2,
          squareFeet: 1150,
          images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80']
        },
        {
          name: 'Oakridge Manor #302',
          address: '1288 Oakridge Way, Seattle, WA 98101',
          type: 'Condo',
          status: 'Occupied',
          monthlyRent: 3100,
          bedrooms: 3,
          bathrooms: 2,
          squareFeet: 1420,
          images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80']
        },
        {
          name: 'Pine Street Suburban Villa',
          address: '405 Pine Street, Bellevue, WA 98004',
          type: 'Single Family',
          status: 'Occupied',
          monthlyRent: 4200,
          bedrooms: 4,
          bathrooms: 3.5,
          squareFeet: 2800,
          images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80']
        },
        {
          name: 'Beacon Hill Plaza Unit 4B',
          address: '890 Beacon Ave S, Seattle, WA 98144',
          type: 'Apartment',
          status: 'Occupied',
          monthlyRent: 1950,
          bedrooms: 1,
          bathrooms: 1,
          squareFeet: 720,
          images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80']
        },
        {
          name: 'The Mercer Executive Suites',
          address: '500 Mercer St, Suite 200, Seattle, WA 98109',
          type: 'Commercial',
          status: 'Occupied',
          monthlyRent: 6500,
          bedrooms: 0,
          bathrooms: 2,
          squareFeet: 3100,
          images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80']
        },
        {
          name: 'Highland Park Townhouse',
          address: '2214 Highland Drive, Portland, OR 97201',
          type: 'Townhouse',
          status: 'Available',
          monthlyRent: 2800,
          bedrooms: 3,
          bathrooms: 2.5,
          squareFeet: 1850,
          images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80']
        },
        {
          name: 'Cascade Creek Duplex A',
          address: '1402 Cascade Ave, Eugene, OR 97401',
          type: 'Multi Family',
          status: 'Under Maintenance',
          monthlyRent: 1800,
          bedrooms: 2,
          bathrooms: 1,
          squareFeet: 950,
          images: ['https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80']
        },
        {
          name: 'Waterfront Loft 810',
          address: '1001 Alaskan Way, Unit 810, Seattle, WA 98104',
          type: 'Condo',
          status: 'Available',
          monthlyRent: 3800,
          bedrooms: 2,
          bathrooms: 2,
          squareFeet: 1300,
          images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80']
        }
      ];

      properties = await Property.insertMany(propertyData);
      console.log(`Seeded ${properties.length} properties.`);
    } else {
      properties = await Property.find();
    }

    // 2. Seed Tenants
    const tenantCount = await Tenant.countDocuments();
    if (tenantCount === 0 && properties.length > 0) {
      console.log('Seeding tenants...');
      
      const p1 = properties.find(p => p.name.includes('Grandview')) || properties[0];
      const p2 = properties.find(p => p.name.includes('Oakridge')) || properties[1];
      const p3 = properties.find(p => p.name.includes('Pine Street')) || properties[2];
      const p4 = properties.find(p => p.name.includes('Beacon Hill')) || properties[3];
      const p5 = properties.find(p => p.name.includes('Mercer')) || properties[4];

      const tenantData = [
        {
          fullName: 'Eleanor Vance',
          email: 'eleanor.vance@example.com',
          phone: '(206) 555-0143',
          propertyId: p1._id,
          leaseStart: new Date('2023-06-01'),
          leaseEnd: new Date('2024-05-31'),
          status: 'Active',
          monthlyRent: p1.monthlyRent || 2450
        },
        {
          fullName: 'Marcus Sterling',
          email: 'marcus.sterling@example.com',
          phone: '(206) 555-0188',
          propertyId: p2._id,
          leaseStart: new Date('2023-09-15'),
          leaseEnd: new Date('2024-09-14'),
          status: 'Active',
          monthlyRent: p2.monthlyRent || 3100
        },
        {
          fullName: 'Sophia & David Chen',
          email: 'd.chen@example.com',
          phone: '(425) 555-0192',
          propertyId: p3._id,
          leaseStart: new Date('2022-11-01'),
          leaseEnd: new Date('2024-10-31'),
          status: 'Active',
          monthlyRent: p3.monthlyRent || 4200
        },
        {
          fullName: 'Julian Hayes',
          email: 'julian.hayes@example.com',
          phone: '(206) 555-0111',
          propertyId: p4._id,
          leaseStart: new Date('2024-01-01'),
          leaseEnd: new Date('2024-12-31'),
          status: 'Active',
          monthlyRent: p4.monthlyRent || 1950
        },
        {
          fullName: 'Apex Tech Solutions (Contact: Sarah Jenkins)',
          email: 'sjenkins@apextech.io',
          phone: '(206) 555-0100',
          propertyId: p5._id,
          leaseStart: new Date('2022-04-01'),
          leaseEnd: new Date('2025-03-31'),
          status: 'Active',
          monthlyRent: p5.monthlyRent || 6500
        },
        {
          fullName: 'Clara Oswald',
          email: 'clara.o@example.com',
          phone: '(503) 555-0177',
          propertyId: null,
          leaseStart: new Date('2023-01-01'),
          leaseEnd: new Date('2023-12-31'),
          status: 'Expired',
          monthlyRent: 1800
        },
        {
          fullName: 'Arthur Pendelton',
          email: 'a.pendelton@example.com',
          phone: '(503) 555-0124',
          propertyId: null,
          leaseStart: new Date('2024-06-01'),
          leaseEnd: new Date('2025-05-31'),
          status: 'Pending',
          monthlyRent: 2800
        }
      ];

      await Tenant.insertMany(tenantData);
      console.log('Seeded tenants successfully.');
    }

    // 3. Seed Maintenance Requests
    const maintenanceCount = await MaintenanceRequest.countDocuments();
    if (maintenanceCount === 0 && properties.length > 0) {
      console.log('Seeding maintenance requests...');

      const p1 = properties.find(p => p.name.includes('Grandview')) || properties[0];
      const p3 = properties.find(p => p.name.includes('Pine Street')) || properties[2];
      const p7 = properties.find(p => p.name.includes('Cascade Creek')) || properties[6];

      const maintenanceData = [
        {
          title: 'Main HVAC line leaking coolant',
          propertyId: p1._id.toString(),
          description: 'Tenant reported strange noise and reduced cooling efficiency. Inspection confirmed slight refrigerant pressure drop.',
          priority: 'Urgent',
          status: 'In Progress',
          dateReported: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
        },
        {
          title: 'Garbage disposal unit jammed',
          propertyId: p3._id.toString(),
          description: 'Sink unit hums but blade does not rotate. Needs reset or object removal.',
          priority: 'Medium',
          status: 'Open',
          dateReported: new Date(Date.now() - 1000 * 60 * 60 * 12) // 12 hours ago
        },
        {
          title: 'Water heater replacement',
          propertyId: p7._id.toString(),
          description: '50-gallon tank showing severe corrosion and bottom seal failure during routine unit turnover.',
          priority: 'High',
          status: 'In Progress',
          dateReported: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4) // 4 days ago
        },
        {
          title: 'Balcony door latch loose',
          propertyId: p1._id.toString(),
          description: 'Sliding glass door lock mechanism requires alignment and tightening.',
          priority: 'Low',
          status: 'Resolved',
          dateReported: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
          dateResolved: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8)
        },
        {
          title: 'Smoke detector chirping - Unit 302',
          propertyId: properties[1] ? properties[1]._id.toString() : p1._id.toString(),
          description: 'Battery replacement requested for 10ft high ceiling unit.',
          priority: 'Low',
          status: 'Resolved',
          dateReported: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
          dateResolved: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14)
        }
      ];

      await MaintenanceRequest.insertMany(maintenanceData);
      console.log('Seeded maintenance requests successfully.');
    }

    console.log('Database seeding process completed.');
  } catch (err) {
    console.error('Error during database seeding:', err);
  }
}

// Execute immediately without managing connection lifecycle
(async () => {
  await seedData();
})();

module.exports = seedData;