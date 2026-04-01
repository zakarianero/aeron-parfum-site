import { ENV } from './_core/env';

export async function syncOrderToSheety(orderData: {
  customerName: string;
  customerNumber?: string;
  totalPrice: string;
  orderNumber: string;
  date: string;
}) {
  const sheetyUrl = ENV.sheetyOrdersUrl;
  
  if (!sheetyUrl) {
    console.warn('[Sheety] SHEETY_ORDERS_URL not configured');
    return false;
  }

  try {
    const body = {
      sheet1: {
        "customer name": orderData.customerName,
        "customer number": orderData.customerNumber || '',
        "prixcommand": parseFloat(orderData.totalPrice),
        "date": orderData.date,
        "order number": orderData.orderNumber,
      }
    };

    const response = await fetch(sheetyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Sheety] Failed to sync order: ${response.status} - ${errorText}`);
      return false;
    }

    const result = await response.json();
    console.log('[Sheety] Order synced successfully:', result);
    return true;
  } catch (error) {
    console.error('[Sheety] Error syncing order:', error);
    return false;
  }
}
