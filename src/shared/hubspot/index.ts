import * as hubspot from '@hubspot/api-client';

export function hubspotClient() {
  return new hubspot.Client({
    apiKey: process.env.API_KEY,
  });
}
