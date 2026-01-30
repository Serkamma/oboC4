
import { DocumentStatus, UserRole, AppState } from './types';

export const INITIAL_STATE: AppState = {
  currentUser: {
    name: 'Officer Dela Cruz',
    role: UserRole.ADMIN
  },
  owners: [
    { id: 'o1', name: 'Juan Manuel', permitNumber: 'BP-2023-001', documents: ['d1', 'd2'] },
    { id: 'o2', name: 'Maria Santos', permitNumber: 'BP-2023-002', documents: ['d3'] },
    { id: 'o3', name: 'Skyline Corp.', permitNumber: 'BP-2024-010', documents: ['d4'] }
  ],
  documents: [
    {
      id: 'd1',
      ownerId: 'o1',
      ownerName: 'Juan Manuel',
      permitNumber: 'BP-2023-001',
      filename: 'Building_Permit_Application.pdf',
      fileType: 'pdf',
      uploadDate: '2023-05-12',
      status: DocumentStatus.COMPLETED,
      physicalLocation: { cabinetNumber: 'A1', shelfNumber: 'S2', folderLabel: 'BP-2023-RES' },
      tags: ['Permit', 'Residential'],
      category: 'Permit Application',
      isBorrowed: false,
      year: 2023,
      month: 'May',
      versions: [{ id: 'v1', version: 1, filename: 'Building_Permit_Application.pdf', date: '2023-05-12', url: 'https://picsum.photos/800/1000' }]
    },
    {
      id: 'd2',
      ownerId: 'o1',
      ownerName: 'Juan Manuel',
      permitNumber: 'BP-2023-001',
      filename: 'Floor_Plan_v1.jpg',
      fileType: 'jpg',
      uploadDate: '2023-05-15',
      status: DocumentStatus.COMPLETED,
      physicalLocation: { cabinetNumber: 'A1', shelfNumber: 'S2', folderLabel: 'BP-2023-RES' },
      tags: ['Blueprint'],
      category: 'Architectural Plans',
      isBorrowed: true,
      year: 2023,
      month: 'May',
      versions: [{ id: 'v2', version: 1, filename: 'Floor_Plan_v1.jpg', date: '2023-05-15', url: 'https://picsum.photos/1200/800' }]
    },
    {
      id: 'd3',
      ownerId: 'o2',
      ownerName: 'Maria Santos',
      permitNumber: 'BP-2023-002',
      filename: 'Structural_Analysis.pdf',
      fileType: 'pdf',
      uploadDate: '2023-06-01',
      status: DocumentStatus.PENDING,
      physicalLocation: { cabinetNumber: 'B2', shelfNumber: 'S1', folderLabel: 'BP-2023-RES' },
      tags: ['Structural'],
      category: 'Technical Report',
      isBorrowed: false,
      year: 2023,
      month: 'June',
      versions: [{ id: 'v3', version: 1, filename: 'Structural_Analysis.pdf', date: '2023-06-01', url: 'https://picsum.photos/800/1000' }]
    },
    {
      id: 'd4',
      ownerId: 'o3',
      ownerName: 'Skyline Corp.',
      permitNumber: 'BP-2024-010',
      filename: 'Commercial_Complex_Final.pdf',
      fileType: 'pdf',
      uploadDate: '2024-01-20',
      status: DocumentStatus.PROCESSING,
      physicalLocation: { cabinetNumber: 'C1', shelfNumber: 'S3', folderLabel: 'BP-2024-COMM' },
      tags: ['Commercial', 'Mixed-Use'],
      category: 'Main Blueprint',
      isBorrowed: false,
      year: 2024,
      month: 'January',
      versions: [{ id: 'v4', version: 1, filename: 'Commercial_Complex_Final.pdf', date: '2024-01-20', url: 'https://picsum.photos/800/1000' }]
    }
  ],
  borrowLogs: [
    {
      id: 'l1',
      documentId: 'd2',
      borrowerName: 'Engr. Santos',
      dateBorrowed: '2024-05-10',
      expectedReturnDate: '2024-05-20'
    }
  ],
  activityLogs: [
    { id: 'act1', userId: 'u1', userName: 'Officer Dela Cruz', action: 'Upload', timestamp: '2024-01-20 09:30 AM', details: 'Uploaded Commercial_Complex_Final.pdf' },
    { id: 'act2', userId: 'u1', userName: 'Officer Dela Cruz', action: 'Borrow', timestamp: '2024-05-10 02:15 PM', details: 'Floor_Plan_v1.jpg borrowed by Engr. Santos' }
  ]
};
