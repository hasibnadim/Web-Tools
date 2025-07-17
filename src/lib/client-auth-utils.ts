// Client-safe auth utilities (no MongoDB imports)
import { BaseUser } from "./types";

// Validation utilities (client-safe)
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePersona = (persona: string): { isValid: boolean; error?: string } => {
  if (persona.length > 1000) {
    return { isValid: false, error: "Persona description is too long (max 1000 characters)" };
  }
  
  if (persona.trim().length === 0) {
    return { isValid: false, error: "Persona description cannot be empty" };
  }
  
  return { isValid: true };
};

// User utilities (client-safe)
export const getUserDisplayName = (user: BaseUser): string => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.firstName || user.email.split('@')[0] || 'User';
};

export const getUserInitials = (user: BaseUser): string => {
  const firstName = user.firstName || '';
  const lastName = user.lastName || '';
  
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  
  if (firstName) {
    return firstName[0].toUpperCase();
  }
  
  return user.email[0].toUpperCase();
};

// Time utilities (client-safe)
export const formatLastSeen = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  return date.toLocaleDateString();
};

// Error handling (client-safe)
export class ClientAuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'ClientAuthError';
  }
}

export const handleClientAuthError = (error: unknown): ClientAuthError => {
  if (error instanceof ClientAuthError) {
    return error;
  }
  
  if (error instanceof Error) {
    return new ClientAuthError(error.message, 'UNKNOWN_ERROR', 500);
  }
  
  return new ClientAuthError('An unexpected error occurred', 'UNKNOWN_ERROR', 500);
}; 