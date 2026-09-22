/**
 * users table column names — keep in sync with
 * shared/migrations/001_create_users.sql
 */
export const USERS_TABLE = 'users';

export const UserColumns = Object.freeze({
  id: 'id',
  email: 'email',
  passwordHash: 'password_hash',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});
