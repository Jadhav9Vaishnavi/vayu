/**
 * DUMMY DATA FOR ADMIN PANEL
 * This file contains sample data for development/demo purposes.
 * Remove this file and its initialization when connecting to backend.
 */

// Sample Users
const DUMMY_USERS = [
  {
    id: 'user_1001',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    phone: '9876543210',
    createdAt: '2024-11-15T10:30:00.000Z'
  },
  {
    id: 'user_1002',
    name: 'Priya Patel',
    email: 'priya.patel@yahoo.com',
    phone: '9812345678',
    createdAt: '2024-11-18T14:20:00.000Z'
  },
  {
    id: 'user_1003',
    name: 'Amit Kumar',
    email: 'amit.kumar@outlook.com',
    phone: '9988776655',
    createdAt: '2024-11-22T09:15:00.000Z'
  },
  {
    id: 'user_1004',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@gmail.com',
    phone: '9123456789',
    createdAt: '2024-11-25T16:45:00.000Z'
  },
  {
    id: 'user_1005',
    name: 'Vikram Singh',
    email: 'vikram.singh@hotmail.com',
    phone: '9876501234',
    createdAt: '2024-11-28T11:00:00.000Z'
  },
  {
    id: 'user_1006',
    name: 'Ananya Gupta',
    email: 'ananya.gupta@gmail.com',
    phone: '9654321098',
    createdAt: '2024-12-01T08:30:00.000Z'
  },
  {
    id: 'user_1007',
    name: 'Karthik Nair',
    email: 'karthik.nair@yahoo.com',
    phone: '9567890123',
    createdAt: '2024-12-03T13:20:00.000Z'
  },
  {
    id: 'user_1008',
    name: 'Meera Joshi',
    email: 'meera.joshi@gmail.com',
    phone: '9345678901',
    createdAt: '2024-12-05T15:10:00.000Z'
  },
  {
    id: 'user_1009',
    name: 'Arjun Menon',
    email: 'arjun.menon@outlook.com',
    phone: '9234567890',
    createdAt: '2024-12-08T10:45:00.000Z'
  },
  {
    id: 'user_1010',
    name: 'Divya Krishnan',
    email: 'divya.k@gmail.com',
    phone: '9876123450',
    createdAt: '2024-12-10T12:00:00.000Z'
  },
  {
    id: 'user_1011',
    name: 'Rajesh Iyer',
    email: 'rajesh.iyer@yahoo.com',
    phone: '9765432109',
    createdAt: '2024-12-12T09:30:00.000Z'
  },
  {
    id: 'user_1012',
    name: 'Pooja Sharma',
    email: 'pooja.sharma@gmail.com',
    phone: '9654321087',
    createdAt: '2024-12-14T14:15:00.000Z'
  },
  {
    id: 'user_1013',
    name: 'Sanjay Verma',
    email: 'sanjay.verma@hotmail.com',
    phone: '9543210987',
    createdAt: '2024-12-15T11:45:00.000Z'
  },
  {
    id: 'user_1014',
    name: 'Lakshmi Rao',
    email: 'lakshmi.rao@gmail.com',
    phone: '9432109876',
    createdAt: '2024-12-17T16:30:00.000Z'
  },
  {
    id: 'user_1015',
    name: 'Nikhil Agarwal',
    email: 'nikhil.a@outlook.com',
    phone: '9321098765',
    createdAt: '2024-12-18T10:00:00.000Z'
  }
]

// Sample Family Members (mapped to users)
const DUMMY_MEMBERS = {
  'user_1001': [
    {
      id: 'member_1001_1',
      fullName: 'Rahul Sharma',
      age: 35,
      bloodGroup: 'B+',
      allergies: 'Penicillin',
      medicalCondition: 'Mild Asthma',
      homeAddress: '42, MG Road, Koramangala, Bangalore 560034',
      emergencyContacts: [
        { name: 'Priya Sharma', phone: '9876543211', relation: 'Wife' },
        { name: 'Dr. Suresh', phone: '9876543212', relation: 'Family Doctor' }
      ],
      relationship: 'self',
      bandId: 'band_1001',
      privacySettings: { fullName: true, age: true, bloodGroup: true, allergies: true, medicalCondition: true, homeAddress: false, emergencyContacts: true, relationship: true },
      createdAt: '2024-11-15T10:35:00.000Z'
    },
    {
      id: 'member_1001_2',
      fullName: 'Priya Sharma',
      age: 32,
      bloodGroup: 'A+',
      allergies: '',
      medicalCondition: '',
      homeAddress: '42, MG Road, Koramangala, Bangalore 560034',
      emergencyContacts: [
        { name: 'Rahul Sharma', phone: '9876543210', relation: 'Husband' }
      ],
      relationship: 'spouse',
      bandId: 'band_1002',
      privacySettings: { fullName: true, age: true, bloodGroup: true, allergies: false, medicalCondition: false, homeAddress: false, emergencyContacts: true, relationship: true },
      createdAt: '2024-11-15T10:40:00.000Z'
    },
    {
      id: 'member_1001_3',
      fullName: 'Aryan Sharma',
      age: 8,
      bloodGroup: 'B+',
      allergies: 'Peanuts, Dust',
      medicalCondition: '',
      homeAddress: '42, MG Road, Koramangala, Bangalore 560034',
      emergencyContacts: [
        { name: 'Rahul Sharma', phone: '9876543210', relation: 'Father' },
        { name: 'Priya Sharma', phone: '9876543211', relation: 'Mother' }
      ],
      relationship: 'son',
      bandId: 'band_1003',
      privacySettings: { fullName: true, age: true, bloodGroup: true, allergies: true, medicalCondition: true, homeAddress: true, emergencyContacts: true, relationship: true },
      createdAt: '2024-11-15T10:45:00.000Z'
    },
    {
      id: 'member_1001_4',
      fullName: 'Kamala Sharma',
      age: 65,
      bloodGroup: 'O+',
      allergies: 'Sulfa drugs',
      medicalCondition: 'Diabetes Type 2, Hypertension',
      homeAddress: '42, MG Road, Koramangala, Bangalore 560034',
      emergencyContacts: [
        { name: 'Rahul Sharma', phone: '9876543210', relation: 'Son' }
      ],
      relationship: 'mother',
      bandId: 'band_1004',
      privacySettings: { fullName: true, age: true, bloodGroup: true, allergies: true, medicalCondition: true, homeAddress: true, emergencyContacts: true, relationship: true },
      createdAt: '2024-11-16T09:00:00.000Z'
    }
  ],
  'user_1002': [
    {
      id: 'member_1002_1',
      fullName: 'Priya Patel',
      age: 28,
      bloodGroup: 'AB+',
      allergies: '',
      medicalCondition: 'Thyroid',
      homeAddress: '15, Jubilee Hills, Hyderabad 500033',
      emergencyContacts: [
        { name: 'Ramesh Patel', phone: '9812345679', relation: 'Father' }
      ],
      relationship: 'self',
      bandId: 'band_1005',
      privacySettings: { fullName: true, age: true, bloodGroup: true, allergies: false, medicalCondition: false, homeAddress: false, emergencyContacts: true, relationship: true },
      createdAt: '2024-11-18T14:25:00.000Z'
    }
  ],
  'user_1003': [
    {
      id: 'member_1003_1',
      fullName: 'Amit Kumar',
      age: 42,
      bloodGroup: 'O-',
      allergies: 'Shellfish',
      medicalCondition: 'Heart Disease',
      homeAddress: '78, Sector 15, Noida 201301',
      emergencyContacts: [
        { name: 'Sunita Kumar', phone: '9988776656', relation: 'Wife' },
        { name: 'Apollo Hospital', phone: '1800123456', relation: 'Hospital' }
      ],
      relationship: 'self',
      bandId: 'band_1006',
      privacySettings: { fullName: true, age: true, bloodGroup: true, allergies: true, medicalCondition: true, homeAddress: true, emergencyContacts: true, relationship: true },
      createdAt: '2024-11-22T09:20:00.000Z'
    },
    {
      id: 'member_1003_2',
      fullName: 'Sunita Kumar',
      age: 38,
      bloodGroup: 'A-',
      allergies: '',
      medicalCondition: '',
      homeAddress: '78, Sector 15, Noida 201301',
      emergencyContacts: [
        { name: 'Amit Kumar', phone: '9988776655', relation: 'Husband' }
      ],
      relationship: 'spouse',
      bandId: null,
      privacySettings: { fullName: true, age: true, bloodGroup: true, allergies: false, medicalCondition: false, homeAddress: false, emergencyContacts: true, relationship: true },
      createdAt: '2024-11-22T09:30:00.000Z'
    }
  ],
  'user_1004': [
    {
      id: 'member_1004_1',
      fullName: 'Sneha Reddy',
      age: 31,
      bloodGroup: 'B-',
      allergies: 'Latex, Ibuprofen',
      medicalCondition: '',
      homeAddress: '23, Anna Nagar, Chennai 600040',
      emergencyContacts: [
        { name: 'Venkat Reddy', phone: '9123456790', relation: 'Brother' }
      ],
      relationship: 'self',
      bandId: 'band_1007',
      privacySettings: { fullName: true, age: true, bloodGroup: true, allergies: true, medicalCondition: false, homeAddress: false, emergencyContacts: true, relationship: true },
      createdAt: '2024-11-25T16:50:00.000Z'
    }
  ],
  'user_1005': [
    {
      id: 'member_1005_1',
      fullName: 'Vikram Singh',
      age: 55,
      bloodGroup: 'A+',
      allergies: '',
      medicalCondition: 'Diabetes Type 2',
      homeAddress: '56, Civil Lines, Jaipur 302006',
      emergencyContacts: [
        { name: 'Meera Singh', phone: '9876501235', relation: 'Wife' }
      ],
      relationship: 'self',
      bandId: 'band_1008',
      privacySettings: { fullName: true, age: true, bloodGroup: true, allergies: false, medicalCondition: true, homeAddress: false, emergencyContacts: true, relationship: true },
      createdAt: '2024-11-28T11:05:00.000Z'
    },
    {
      id: 'member_1005_2',
      fullName: 'Meera Singh',
      age: 52,
      bloodGroup: 'B+',
      allergies: 'Aspirin',
      medicalCondition: 'Arthritis',
      homeAddress: '56, Civil Lines, Jaipur 302006',
      emergencyContacts: [
        { name: 'Vikram Singh', phone: '9876501234', relation: 'Husband' }
      ],
      relationship: 'spouse',
      bandId: 'band_1009',
      privacySettings: { fullName: true, age: true, bloodGroup: true, allergies: true, medicalCondition: true, homeAddress: false, emergencyContacts: true, relationship: true },
      createdAt: '2024-11-28T11:10:00.000Z'
    }
  ],
  'user_1006': [
    {
      id: 'member_1006_1',
      fullName: 'Ananya Gupta',
      age: 26,
      bloodGroup: 'O+',
      allergies: 'Pollen',
      medicalCondition: '',
      homeAddress: '89, Banjara Hills, Hyderabad 500034',
      emergencyContacts: [
        { name: 'Suresh Gupta', phone: '9654321099', relation: 'Father' }
      ],
      relationship: 'self',
      bandId: 'band_1010',
      privacySettings: { fullName: true, age: true, bloodGroup: true, allergies: true, medicalCondition: false, homeAddress: false, emergencyContacts: true, relationship: true },
      createdAt: '2024-12-01T08:35:00.000Z'
    }
  ],
  'user_1007': [
    {
      id: 'member_1007_1',
      fullName: 'Karthik Nair',
      age: 45,
      bloodGroup: 'AB-',
      allergies: '',
      medicalCondition: 'Epilepsy',
      homeAddress: '12, Marine Drive, Kochi 682001',
      emergencyContacts: [
        { name: 'Lakshmi Nair', phone: '9567890124', relation: 'Wife' },
        { name: 'Dr. Menon', phone: '9567890125', relation: 'Neurologist' }
      ],
      relationship: 'self',
      bandId: 'band_1011',
      privacySettings: { fullName: true, age: true, bloodGroup: true, allergies: false, medicalCondition: true, homeAddress: true, emergencyContacts: true, relationship: true },
      createdAt: '2024-12-03T13:25:00.000Z'
    },
    {
      id: 'member_1007_2',
      fullName: 'Lakshmi Nair',
      age: 42,
      bloodGroup: 'A+',
      allergies: 'Penicillin',
      medicalCondition: '',
      homeAddress: '12, Marine Drive, Kochi 682001',
      emergencyContacts: [
        { name: 'Karthik Nair', phone: '9567890123', relation: 'Husband' }
      ],
      relationship: 'spouse',
      bandId: 'band_1012',
      privacySettings: { fullName: true, age: true, bloodGroup: true, allergies: true, medicalCondition: false, homeAddress: false, emergencyContacts: true, relationship: true },
      createdAt: '2024-12-03T13:30:00.000Z'
    },
    {
      id: 'member_1007_3',
      fullName: 'Arun Nair',
      age: 72,
      bloodGroup: 'O+',
      allergies: '',
      medicalCondition: 'Parkinson\'s, Hypertension',
      homeAddress: '12, Marine Drive, Kochi 682001',
      emergencyContacts: [
        { name: 'Karthik Nair', phone: '9567890123', relation: 'Son' }
      ],
      relationship: 'father',
      bandId: 'band_1013',
      privacySettings: { fullName: true, age: true, bloodGroup: true, allergies: true, medicalCondition: true, homeAddress: true, emergencyContacts: true, relationship: true },
      createdAt: '2024-12-03T13:35:00.000Z'
    }
  ],
  'user_1008': [
    {
      id: 'member_1008_1',
      fullName: 'Meera Joshi',
      age: 29,
      bloodGroup: 'B+',
      allergies: 'Milk, Eggs',
      medicalCondition: '',
      homeAddress: '34, FC Road, Pune 411004',
      emergencyContacts: [
        { name: 'Anil Joshi', phone: '9345678902', relation: 'Father' }
      ],
      relationship: 'self',
      bandId: 'band_1014',
      privacySettings: { fullName: true, age: true, bloodGroup: true, allergies: true, medicalCondition: false, homeAddress: false, emergencyContacts: true, relationship: true },
      createdAt: '2024-12-05T15:15:00.000Z'
    }
  ],
  'user_1009': [
    {
      id: 'member_1009_1',
      fullName: 'Arjun Menon',
      age: 38,
      bloodGroup: 'A-',
      allergies: '',
      medicalCondition: 'Asthma',
      homeAddress: '67, Indiranagar, Bangalore 560038',
      emergencyContacts: [
        { name: 'Deepa Menon', phone: '9234567891', relation: 'Wife' }
      ],
      relationship: 'self',
      bandId: 'band_1015',
      privacySettings: { fullName: true, age: true, bloodGroup: true, allergies: false, medicalCondition: true, homeAddress: false, emergencyContacts: true, relationship: true },
      createdAt: '2024-12-08T10:50:00.000Z'
    }
  ],
  'user_1010': [
    {
      id: 'member_1010_1',
      fullName: 'Divya Krishnan',
      age: 33,
      bloodGroup: 'O+',
      allergies: 'Dust Mites',
      medicalCondition: '',
      homeAddress: '45, T Nagar, Chennai 600017',
      emergencyContacts: [
        { name: 'Ravi Krishnan', phone: '9876123451', relation: 'Husband' }
      ],
      relationship: 'self',
      bandId: null,
      privacySettings: { fullName: true, age: true, bloodGroup: true, allergies: true, medicalCondition: false, homeAddress: false, emergencyContacts: true, relationship: true },
      createdAt: '2024-12-10T12:05:00.000Z'
    }
  ],
  'user_1011': [
    {
      id: 'member_1011_1',
      fullName: 'Rajesh Iyer',
      age: 48,
      bloodGroup: 'AB+',
      allergies: 'Fish',
      medicalCondition: 'Kidney Disease',
      homeAddress: '23, Mylapore, Chennai 600004',
      emergencyContacts: [
        { name: 'Kamala Iyer', phone: '9765432110', relation: 'Wife' },
        { name: 'Apollo Hospital', phone: '04428290200', relation: 'Hospital' }
      ],
      relationship: 'self',
      bandId: 'band_1016',
      privacySettings: { fullName: true, age: true, bloodGroup: true, allergies: true, medicalCondition: true, homeAddress: true, emergencyContacts: true, relationship: true },
      createdAt: '2024-12-12T09:35:00.000Z'
    }
  ],
  'user_1012': [
    {
      id: 'member_1012_1',
      fullName: 'Pooja Sharma',
      age: 27,
      bloodGroup: 'B-',
      allergies: '',
      medicalCondition: '',
      homeAddress: '78, Vaishali, Ghaziabad 201010',
      emergencyContacts: [
        { name: 'Mohan Sharma', phone: '9654321088', relation: 'Father' }
      ],
      relationship: 'self',
      bandId: null,
      privacySettings: { fullName: true, age: true, bloodGroup: true, allergies: false, medicalCondition: false, homeAddress: false, emergencyContacts: true, relationship: true },
      createdAt: '2024-12-14T14:20:00.000Z'
    }
  ],
  'user_1013': [
    {
      id: 'member_1013_1',
      fullName: 'Sanjay Verma',
      age: 52,
      bloodGroup: 'A+',
      allergies: 'Insect Stings',
      medicalCondition: 'Hypertension',
      homeAddress: '90, Gomti Nagar, Lucknow 226010',
      emergencyContacts: [
        { name: 'Rani Verma', phone: '9543210988', relation: 'Wife' }
      ],
      relationship: 'self',
      bandId: 'band_1017',
      privacySettings: { fullName: true, age: true, bloodGroup: true, allergies: true, medicalCondition: true, homeAddress: false, emergencyContacts: true, relationship: true },
      createdAt: '2024-12-15T11:50:00.000Z'
    },
    {
      id: 'member_1013_2',
      fullName: 'Rani Verma',
      age: 48,
      bloodGroup: 'O+',
      allergies: '',
      medicalCondition: 'Thyroid',
      homeAddress: '90, Gomti Nagar, Lucknow 226010',
      emergencyContacts: [
        { name: 'Sanjay Verma', phone: '9543210987', relation: 'Husband' }
      ],
      relationship: 'spouse',
      bandId: 'band_1018',
      privacySettings: { fullName: true, age: true, bloodGroup: true, allergies: false, medicalCondition: true, homeAddress: false, emergencyContacts: true, relationship: true },
      createdAt: '2024-12-15T11:55:00.000Z'
    }
  ],
  'user_1014': [],
  'user_1015': []
}

// Sample Subscriptions (mapped to users)
const DUMMY_SUBSCRIPTIONS = {
  'user_1001': [
    {
      id: 'sub_1001',
      plan: 'family',
      planName: 'Family',
      memberCount: 4,
      price: 1499,
      startDate: '2024-11-15T10:30:00.000Z',
      endDate: '2025-11-15T10:30:00.000Z',
      status: 'active'
    }
  ],
  'user_1002': [
    {
      id: 'sub_1002',
      plan: 'individual',
      planName: 'Individual',
      memberCount: 1,
      price: 499,
      startDate: '2024-11-18T14:20:00.000Z',
      endDate: '2025-11-18T14:20:00.000Z',
      status: 'active'
    }
  ],
  'user_1003': [
    {
      id: 'sub_1003',
      plan: 'family',
      planName: 'Family',
      memberCount: 4,
      price: 1499,
      startDate: '2024-11-22T09:15:00.000Z',
      endDate: '2025-11-22T09:15:00.000Z',
      status: 'active'
    }
  ],
  'user_1004': [
    {
      id: 'sub_1004',
      plan: 'individual',
      planName: 'Individual',
      memberCount: 1,
      price: 499,
      startDate: '2024-11-25T16:45:00.000Z',
      endDate: '2025-11-25T16:45:00.000Z',
      status: 'active'
    }
  ],
  'user_1005': [
    {
      id: 'sub_1005',
      plan: 'family',
      planName: 'Family',
      memberCount: 4,
      price: 1499,
      startDate: '2024-11-28T11:00:00.000Z',
      endDate: '2025-11-28T11:00:00.000Z',
      status: 'active'
    }
  ],
  'user_1006': [
    {
      id: 'sub_1006',
      plan: 'individual',
      planName: 'Individual',
      memberCount: 1,
      price: 499,
      startDate: '2024-12-01T08:30:00.000Z',
      endDate: '2025-12-01T08:30:00.000Z',
      status: 'active'
    }
  ],
  'user_1007': [
    {
      id: 'sub_1007',
      plan: 'family',
      planName: 'Family',
      memberCount: 4,
      price: 1499,
      startDate: '2024-12-03T13:20:00.000Z',
      endDate: '2025-12-03T13:20:00.000Z',
      status: 'active'
    }
  ],
  'user_1008': [
    {
      id: 'sub_1008',
      plan: 'individual',
      planName: 'Individual',
      memberCount: 1,
      price: 499,
      startDate: '2024-12-05T15:10:00.000Z',
      endDate: '2025-12-05T15:10:00.000Z',
      status: 'active'
    }
  ],
  'user_1009': [
    {
      id: 'sub_1009',
      plan: 'individual',
      planName: 'Individual',
      memberCount: 1,
      price: 499,
      startDate: '2024-12-08T10:45:00.000Z',
      endDate: '2025-12-08T10:45:00.000Z',
      status: 'active'
    }
  ],
  'user_1010': [
    {
      id: 'sub_1010_old',
      plan: 'individual',
      planName: 'Individual',
      memberCount: 1,
      price: 499,
      startDate: '2023-12-10T12:00:00.000Z',
      endDate: '2024-12-10T12:00:00.000Z',
      status: 'expired'
    }
  ],
  'user_1011': [
    {
      id: 'sub_1011',
      plan: 'individual',
      planName: 'Individual',
      memberCount: 1,
      price: 499,
      startDate: '2024-12-12T09:30:00.000Z',
      endDate: '2025-12-12T09:30:00.000Z',
      status: 'active'
    }
  ],
  'user_1012': [],
  'user_1013': [
    {
      id: 'sub_1013',
      plan: 'family',
      planName: 'Family',
      memberCount: 4,
      price: 1499,
      startDate: '2024-12-15T11:45:00.000Z',
      endDate: '2025-12-15T11:45:00.000Z',
      status: 'active'
    }
  ],
  'user_1014': [],
  'user_1015': []
}

// Sample Bands (registered by users)
const DUMMY_USER_BANDS = {
  'user_1001': [
    { id: 'band_1001', bs: 'VB001001', bui: 'BUI-R1S2T3U4', memberId: 'member_1001_1', registeredAt: '2024-11-15T10:35:00.000Z' },
    { id: 'band_1002', bs: 'VB001002', bui: 'BUI-V5W6X7Y8', memberId: 'member_1001_2', registeredAt: '2024-11-15T10:40:00.000Z' },
    { id: 'band_1003', bs: 'VB001003', bui: 'BUI-Z9A0B1C2', memberId: 'member_1001_3', registeredAt: '2024-11-15T10:45:00.000Z' },
    { id: 'band_1004', bs: 'VB001004', bui: 'BUI-D3E4F5G6', memberId: 'member_1001_4', registeredAt: '2024-11-16T09:00:00.000Z' }
  ],
  'user_1002': [
    { id: 'band_1005', bs: 'VB001005', bui: 'BUI-H7I8J9K0', memberId: 'member_1002_1', registeredAt: '2024-11-18T14:25:00.000Z' }
  ],
  'user_1003': [
    { id: 'band_1006', bs: 'VB001006', bui: 'BUI-L1M2N3O4', memberId: 'member_1003_1', registeredAt: '2024-11-22T09:20:00.000Z' }
  ],
  'user_1004': [
    { id: 'band_1007', bs: 'VB001007', bui: 'BUI-P5Q6R7S8', memberId: 'member_1004_1', registeredAt: '2024-11-25T16:50:00.000Z' }
  ],
  'user_1005': [
    { id: 'band_1008', bs: 'VB001008', bui: 'BUI-T9U0V1W2', memberId: 'member_1005_1', registeredAt: '2024-11-28T11:05:00.000Z' },
    { id: 'band_1009', bs: 'VB001009', bui: 'BUI-X3Y4Z5A6', memberId: 'member_1005_2', registeredAt: '2024-11-28T11:10:00.000Z' }
  ],
  'user_1006': [
    { id: 'band_1010', bs: 'VB001010', bui: 'BUI-B7C8D9E0', memberId: 'member_1006_1', registeredAt: '2024-12-01T08:35:00.000Z' }
  ],
  'user_1007': [
    { id: 'band_1011', bs: 'VB001011', bui: 'BUI-F1G2H3I4', memberId: 'member_1007_1', registeredAt: '2024-12-03T13:25:00.000Z' },
    { id: 'band_1012', bs: 'VB001012', bui: 'BUI-J5K6L7M8', memberId: 'member_1007_2', registeredAt: '2024-12-03T13:30:00.000Z' },
    { id: 'band_1013', bs: 'VB001013', bui: 'BUI-N9O0P1Q2', memberId: 'member_1007_3', registeredAt: '2024-12-03T13:35:00.000Z' }
  ],
  'user_1008': [
    { id: 'band_1014', bs: 'VB001014', bui: 'BUI-R3S4T5U6', memberId: 'member_1008_1', registeredAt: '2024-12-05T15:15:00.000Z' }
  ],
  'user_1009': [
    { id: 'band_1015', bs: 'VB001015', bui: 'BUI-V7W8X9Y0', memberId: 'member_1009_1', registeredAt: '2024-12-08T10:50:00.000Z' }
  ],
  'user_1010': [],
  'user_1011': [
    { id: 'band_1016', bs: 'VB001016', bui: 'BUI-Z1A2B3C4', memberId: 'member_1011_1', registeredAt: '2024-12-12T09:35:00.000Z' }
  ],
  'user_1012': [],
  'user_1013': [
    { id: 'band_1017', bs: 'VB001017', bui: 'BUI-D5E6F7G8', memberId: 'member_1013_1', registeredAt: '2024-12-15T11:50:00.000Z' },
    { id: 'band_1018', bs: 'VB001018', bui: 'BUI-H9I0J1K2', memberId: 'member_1013_2', registeredAt: '2024-12-15T11:55:00.000Z' }
  ],
  'user_1014': [],
  'user_1015': []
}

// Master Band Inventory (all available bands)
const DUMMY_MASTER_BANDS = [
  { bs: 'VB001001', bui: 'BUI-R1S2T3U4' },
  { bs: 'VB001002', bui: 'BUI-V5W6X7Y8' },
  { bs: 'VB001003', bui: 'BUI-Z9A0B1C2' },
  { bs: 'VB001004', bui: 'BUI-D3E4F5G6' },
  { bs: 'VB001005', bui: 'BUI-H7I8J9K0' },
  { bs: 'VB001006', bui: 'BUI-L1M2N3O4' },
  { bs: 'VB001007', bui: 'BUI-P5Q6R7S8' },
  { bs: 'VB001008', bui: 'BUI-T9U0V1W2' },
  { bs: 'VB001009', bui: 'BUI-X3Y4Z5A6' },
  { bs: 'VB001010', bui: 'BUI-B7C8D9E0' },
  { bs: 'VB001011', bui: 'BUI-F1G2H3I4' },
  { bs: 'VB001012', bui: 'BUI-J5K6L7M8' },
  { bs: 'VB001013', bui: 'BUI-N9O0P1Q2' },
  { bs: 'VB001014', bui: 'BUI-R3S4T5U6' },
  { bs: 'VB001015', bui: 'BUI-V7W8X9Y0' },
  { bs: 'VB001016', bui: 'BUI-Z1A2B3C4' },
  { bs: 'VB001017', bui: 'BUI-D5E6F7G8' },
  { bs: 'VB001018', bui: 'BUI-H9I0J1K2' },
  // Unregistered bands (available in inventory)
  { bs: 'VB001019', bui: 'BUI-L3M4N5O6' },
  { bs: 'VB001020', bui: 'BUI-P7Q8R9S0' },
  { bs: 'VB001021', bui: 'BUI-T1U2V3W4' },
  { bs: 'VB001022', bui: 'BUI-X5Y6Z7A8' },
  { bs: 'VB001023', bui: 'BUI-B9C0D1E2' },
  { bs: 'VB001024', bui: 'BUI-F3G4H5I6' },
  { bs: 'VB001025', bui: 'BUI-J7K8L9M0' }
]

/**
 * Initialize dummy data in localStorage
 * Call this function to populate the admin panel with sample data
 */
export function initializeDummyData() {
  // Check if dummy data already exists
  const existingUsers = localStorage.getItem('vayu_users')
  if (existingUsers && JSON.parse(existingUsers).length > 5) {
    console.log('Dummy data already initialized')
    return false
  }

  console.log('Initializing dummy data...')

  // Save users
  localStorage.setItem('vayu_users', JSON.stringify(DUMMY_USERS))

  // Save members, subscriptions, and bands for each user
  DUMMY_USERS.forEach(user => {
    const members = DUMMY_MEMBERS[user.id] || []
    const subscriptions = DUMMY_SUBSCRIPTIONS[user.id] || []
    const bands = DUMMY_USER_BANDS[user.id] || []

    localStorage.setItem(`vayu_members_${user.id}`, JSON.stringify(members))
    localStorage.setItem(`vayu_subscriptions_${user.id}`, JSON.stringify(subscriptions))
    localStorage.setItem(`vayu_bands_${user.id}`, JSON.stringify(bands))
  })

  // Save master bands
  localStorage.setItem('vayu_master_bands', JSON.stringify(DUMMY_MASTER_BANDS))

  // Save all registered bands (for global lookup)
  const allRegisteredBands = []
  Object.entries(DUMMY_USER_BANDS).forEach(([userId, bands]) => {
    bands.forEach(band => {
      allRegisteredBands.push({ ...band, userId })
    })
  })
  localStorage.setItem('vayu_all_registered_bands', JSON.stringify(allRegisteredBands))

  console.log('Dummy data initialized successfully!')
  console.log(`- ${DUMMY_USERS.length} users`)
  console.log(`- ${Object.values(DUMMY_MEMBERS).flat().length} family members`)
  console.log(`- ${Object.values(DUMMY_SUBSCRIPTIONS).flat().length} subscriptions`)
  console.log(`- ${allRegisteredBands.length} registered bands`)
  console.log(`- ${DUMMY_MASTER_BANDS.length} bands in inventory`)

  return true
}

/**
 * Clear all dummy data from localStorage
 * Call this function before connecting to backend
 */
export function clearDummyData() {
  console.log('Clearing dummy data...')

  // Clear users
  localStorage.removeItem('vayu_users')

  // Clear user-specific data
  DUMMY_USERS.forEach(user => {
    localStorage.removeItem(`vayu_members_${user.id}`)
    localStorage.removeItem(`vayu_subscriptions_${user.id}`)
    localStorage.removeItem(`vayu_bands_${user.id}`)
  })

  // Clear global data
  localStorage.removeItem('vayu_master_bands')
  localStorage.removeItem('vayu_all_registered_bands')

  console.log('Dummy data cleared!')
}

// Export data for reference
export {
  DUMMY_USERS,
  DUMMY_MEMBERS,
  DUMMY_SUBSCRIPTIONS,
  DUMMY_USER_BANDS,
  DUMMY_MASTER_BANDS
}
