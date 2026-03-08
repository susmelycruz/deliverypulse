#!/usr/bin/env node
const required = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SITE_URL'
];

const missing = required.filter((k) => !process.env[k]);

if (missing.length) {
  console.error('Missing env vars:');
  missing.forEach((k) => console.error(`- ${k}`));
  process.exit(1);
}

console.log('✅ All required environment variables are present.');
