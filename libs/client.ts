import { createClient } from 'microcms-js-sdk'

export const client = createClient({
  serviceDomain: 'test-fbsdl',
  apiKey: process.env.API_KEY || '',
})
