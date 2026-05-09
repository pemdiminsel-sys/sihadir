export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'secretKey',
  expiresIn: process.env.JWT_EXPIRES_IN || '1d',
};

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN_OPD = 'ADMIN_OPD',
  PANITIA = 'PANITIA',
  PESERTA = 'PESERTA',
  PIMPINAN = 'PIMPINAN',
}
