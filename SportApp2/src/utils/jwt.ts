import type { Role } from '../types';

interface JwtPayload {
  role?: Role;
}

export const extractRoleFromToken = (token: string): Role | null => {
  try {
    const payloadPart = token.split('.')[1];
    if (!payloadPart) {
      return null;
    }

    const payload = JSON.parse(atob(payloadPart)) as JwtPayload;
    return payload.role ?? null;
  } catch {
    return null;
  }
};
