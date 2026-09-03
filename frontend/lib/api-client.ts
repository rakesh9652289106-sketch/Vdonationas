// Multi-Tier Temple REST API Client Service Layer
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export async function fetchFromDjango<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  try {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!res.ok) {
      console.warn(`[Django API] Request failed for ${endpoint}: ${res.statusText}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.warn(`[Django API] Server connection error on ${endpoint}. Falling back to client state.`, error);
    return null;
  }
}

export const DjangoAPI = {
  // Temples
  getTemples: () => fetchFromDjango<any[]>('/temples/'),
  getTempleById: (id: string) => fetchFromDjango<any>(`/temples/${id}/`),
  getCategories: () => fetchFromDjango<any[]>('/temples/categories/'),

  // Donations
  createDonation: (data: any) =>
    fetchFromDjango<any>('/donations/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getDonationByNumber: (donationId: string) => fetchFromDjango<any>(`/donations/${donationId}/`),

  // Autopay Subscriptions
  createAutopay: (data: any) =>
    fetchFromDjango<any>('/recurring/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getAutopaySubscriptions: () => fetchFromDjango<any[]>('/recurring/'),

  // Receipt Verification
  verifyReceipt: (code: string) => fetchFromDjango<any>(`/receipts/verify/${code}/`),
};
