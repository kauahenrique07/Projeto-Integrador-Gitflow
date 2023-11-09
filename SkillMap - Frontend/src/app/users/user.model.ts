export interface User {
  id: number;
  name: string;
  department: Department;
  role: string;
  roleId?: number;
  managerId: number;
  managerName: string;
  accessType: string[];
  email: string;
  password: string;
  needsPasswordChange: boolean;
  userStatus: boolean;
  profilePictureUrl?: string;
  isLocked: boolean;
  hasCompletedTour: boolean;
}


export interface Department{
  id: number;
  name: string;
}
