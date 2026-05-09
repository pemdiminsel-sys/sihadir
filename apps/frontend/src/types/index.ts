export interface User {
  id: string;
  name: string;
  email: string;
  role: {
    id: string;
    name: 'SUPER_ADMIN' | 'ADMIN_OPD' | 'PANITIA' | 'PESERTA';
  };
  opdId?: string;
  opd?: {
    id: string;
    name: string;
  };
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  venue: string;
  startTime: string;
  endTime: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  attendanceMode: string;
  qrType: string;
  requireSelfie: boolean;
  requireGps: boolean;
  radiusMeter: number;
}
