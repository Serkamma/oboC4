
export enum DocumentStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  COMPLETED = 'Completed',
  DAMAGED = 'Damaged',
  MISSING = 'Missing'
}

export enum UserRole {
  ADMIN = 'Admin',
  STAFF = 'Staff'
}

export interface PhysicalLocation {
  cabinetNumber: string;
  shelfNumber: string;
  folderLabel: string;
}

export interface BorrowLog {
  id: string;
  documentId: string;
  borrowerName: string;
  dateBorrowed: string;
  expectedReturnDate: string;
  dateReturned?: string;
}

export interface DocumentVersion {
  id: string;
  version: number;
  filename: string;
  date: string;
  url: string;
}

export interface DigitalDocument {
  id: string;
  ownerId: string;
  ownerName: string;
  permitNumber: string;
  filename: string;
  fileType: string;
  uploadDate: string;
  status: DocumentStatus;
  physicalLocation: PhysicalLocation;
  ocrText?: string;
  tags: string[];
  category: string;
  isBorrowed: boolean;
  versions: DocumentVersion[];
  notes?: string;
  year: number;
  month: string;
}

export interface Owner {
  id: string;
  name: string;
  permitNumber: string;
  documents: string[]; // Document IDs
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  details: string;
}

export interface AppState {
  documents: DigitalDocument[];
  owners: Owner[];
  borrowLogs: BorrowLog[];
  activityLogs: ActivityLog[];
  currentUser: {
    name: string;
    role: UserRole;
  };
}
