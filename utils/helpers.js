// utils/helpers.js

// Strip all non-digit characters from a phone string
export const stripPhone = (s = '') => s.replace(/[^\d]/g, '');

// Build WhatsApp link from digits
export const toWaLink = (digits = '') => digits ? `https://wa.me/${digits}` : '';
