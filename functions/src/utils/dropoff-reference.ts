import { randomUUID } from 'node:crypto';

export function generateDropoffReference(now = new Date()): string {
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
  const token = randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase();
  return `BFD-${datePart}-${token}`;
}
