import { hash } from 'scryptwrap';

/**
 * Generate user secret
 * @param {number} userId - ID of the user
 * @returns {Promise<Error | string>}
 */
export default function generateSecret(userId) {
  if (!userId) {
    throw new Error('User ID is required for generating user secret!');
  }

  return hash(`${userId}-${Date.now()}`);
}
