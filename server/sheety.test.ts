import { describe, it, expect } from 'vitest';

describe('Sheety Integration', () => {
  it('should validate Sheety webhook URL is accessible', async () => {
    const sheetyUrl = process.env.SHEETY_ORDERS_URL;
    
    if (!sheetyUrl) {
      throw new Error('SHEETY_ORDERS_URL environment variable is not set');
    }

    // Test GET request to verify the URL is valid
    const response = await fetch(sheetyUrl);
    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);

    // Verify response is JSON
    const data = await response.json();
    expect(data).toBeDefined();
  });

  it('should be able to POST order data to Sheety with correct column names', async () => {
    const sheetyUrl = process.env.SHEETY_ORDERS_URL;
    
    if (!sheetyUrl) {
      throw new Error('SHEETY_ORDERS_URL environment variable is not set');
    }

    // Test POST request with sample order data matching the Google Sheet columns
    const testOrder = {
      sheet1: {
        "customer name": "Test Customer",
        "customer number": "0612345678",
        "prixcommand": 100,
        "date": new Date().toISOString().split('T')[0],
        "order number": "TEST-001",
      }
    };

    const response = await fetch(sheetyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testOrder),
    });

    // Sheety returns 201 for successful POST
    expect([200, 201]).toContain(response.status);
  });
});
