import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:6213';

test.describe('Railway Ticket System API Tests', () => {
  let authToken: string = '';

  test('should login successfully and retrieve auth token', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/api/login`, {
      data: {
        email: 'vontedd23bcs81@iiitkottayam.ac.in',
        password: 'Raju@1234',
      },
    });

    console.log('Login status:', res.status());
    const text = await res.text();
    console.log('Raw login response:', text);

    expect(res.status(), `Login failed: ${text}`).toBeLessThan(400);

    let json: any = {};
    try {
      json = JSON.parse(text);
    } catch {
      console.warn('Login response is not valid JSON.');
    }

    authToken = json.token || json.accessToken || json.jwt || '';
    if (authToken) {
      console.log('Token retrieved:', authToken.slice(0, 20) + '...');
    } else {
      console.warn('No token found in response, backend may use cookies.');
    }
  });

  const makeHeaders = (): Record<string, string> =>
    authToken ? { Authorization: `Bearer ${authToken}` } : {};

  test('should fetch train list', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/trains`, {
      headers: makeHeaders(),
    });
    const body = await res.text();

    console.log('/api/trains status:', res.status());
    console.log('Response preview:', body.slice(0, 100));

    expect(res.status(), body).toBeLessThan(500);
  });

  test('should attempt booking (sample)', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/api/bookings`, {
      headers: makeHeaders(),
      data: {
        from: 'Delhi',
        to: 'Mumbai',
        date: '2025-11-15',
        trainNumber: '12345',
        seatClass: 'Sleeper',
      },
    });

    console.log('Booking status:', res.status());
    expect(res.status()).toBeLessThan(500);
  });

  test('should check PNR status (sample)', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/pnr?pnr=1234567890`, {
      headers: makeHeaders(),
    });

    const body = await res.text();
    console.log('PNR status:', res.status());
    console.log('Response preview:', body.slice(0, 100));

    expect(res.status(), 'PNR API failed').toBeLessThan(500);
  });
});
