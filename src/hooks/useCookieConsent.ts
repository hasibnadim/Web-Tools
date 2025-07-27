"use client";

import { useState, useEffect } from "react";

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function useCookieConsent() {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load preferences from localStorage
    const savedPreferences = localStorage.getItem("cookie-consent");
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error("Error parsing cookie preferences:", error);
        setPreferences(null);
      }
    }
    setIsLoaded(true);
  }, []);

  const updatePreferences = (newPreferences: CookiePreferences) => {
    localStorage.setItem("cookie-consent", JSON.stringify(newPreferences));
    localStorage.setItem("cookie-consent-date", new Date().toISOString());
    setPreferences(newPreferences);
  };

  const hasConsent = (type: keyof CookiePreferences): boolean => {
    if (!preferences) return false;
    return preferences[type];
  };

  const clearConsent = () => {
    localStorage.removeItem("cookie-consent");
    localStorage.removeItem("cookie-consent-date");
    setPreferences(null);
  };

  const getConsentDate = (): Date | null => {
    const dateString = localStorage.getItem("cookie-consent-date");
    return dateString ? new Date(dateString) : null;
  };

  return {
    preferences,
    isLoaded,
    updatePreferences,
    hasConsent,
    clearConsent,
    getConsentDate,
  };
} 