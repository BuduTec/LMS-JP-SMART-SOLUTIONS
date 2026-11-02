export const SITE_CONFIG = {
  name: 'JP Smart Solutions Academy',
  companyName: 'JP SMART SOLUTIONS LTD',
  description: 'Premier engineering and technical training academy specializing in ETAP, Power System Analysis & Protection, and Solar PV Systems.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://academy.jpsmartsolutions.com',
  ogImage: '/og-image.jpg',
  contact: {
    phone: '+234 906 737 4854',
    phoneRaw: '+2349067374854',
    whatsapp: '2349067374854',
    whatsappLink: 'https://wa.me/2349067374854',
    email: 'info@jpsmartsolutions.com',
    supportEmail: 'support@jpsmartsolutions.com',
    address: 'Rumuruji Street, Rumuodara, Port Harcourt, Rivers State, Nigeria',
    workingHours: 'Mon - Fri: 8:00 AM - 5:00 PM (WAT)',
  },
  socials: {
    linkedin: 'https://www.linkedin.com/company/jp-smart-solutions',
    facebook: 'https://facebook.com/jpsmartsolutions',
    twitter: 'https://twitter.com/jpsmartsol',
  },
  brand: {
    jpblue: '#0B63CE',
    jpdark: '#071525',
    jpmuted: '#607086',
    jplight: '#F3F7FC',
    jpcyan: '#14B8D4',
  },
  currency: 'NGN',
  defaultCountry: 'NG',
} as const;

export const COURSE_DIFFICULTIES = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
] as const;

export const COURSE_CATEGORIES = [
  { name: 'ETAP & Power Systems', slug: 'etap-power-systems' },
  { name: 'ETAP', slug: 'etap' },
  { name: 'Power Systems', slug: 'power-systems' },
  { name: 'Protection', slug: 'protection' },
  { name: 'Solar PV', slug: 'solar-pv' },
] as const;
