import type { ROLE } from './base.enum';

type Role = (typeof ROLE)[keyof typeof ROLE];

type User = {
  id: string;
  name: string;
  avatarUrl: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  status: string;
  role: Role;
};

export type { Role, User };
