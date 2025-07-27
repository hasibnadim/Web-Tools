import { User, Session } from "@/service/auth/interface"; 

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUserId = (userId: string): boolean => {
  return userId.length === 24 && /^[0-9a-fA-F]{24}$/.test(userId);
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

// Session utilities
export const isSessionExpired = (session: Session): boolean => {
  return new Date() > session.expires;
};

 
// User utilities
export const getUserDisplayName = (user: User): string => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.firstName || user.email.split('@')[0] || 'User';
};

export const getUserInitials = (user: User): string => {
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

// Security utilities
export const sanitizeUserData = (user: User): Partial<User> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};

// Time utilities
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

// Error handling
export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export const handleAuthError = (error: unknown): AuthError => {
  if (error instanceof AuthError) {
    return error;
  }
  
  if (error instanceof Error) {
    return new AuthError(error.message, 'UNKNOWN_ERROR', 500);
  }
  
  return new AuthError('An unexpected error occurred', 'UNKNOWN_ERROR', 500);
}; 