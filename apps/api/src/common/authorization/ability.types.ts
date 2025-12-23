import { PrismaAbility } from '@casl/prisma';

export type AppSubjects =
  | 'all'
  | 'role'
  | 'permission'
  | 'user'
  | 'folder'
  | 'file'
  | 'parcel'
  | 'agent-assignment'
  | 'parcel-status-history'
  | 'location-tracking'
  | 'payment'
  | 'analytics';
export type AppActions = 'manage' | 'create' | 'read' | 'update' | 'delete';

export type AppAbility = PrismaAbility<[AppActions, AppSubjects]>;
