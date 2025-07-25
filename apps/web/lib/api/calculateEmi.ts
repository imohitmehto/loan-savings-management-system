import axios from 'axios';
import { EmiFormData } from '@/types/EmiFormData';

export async function calculateEmi(form: EmiFormData): Promise<number> {
  try {
    const response = await axios.post<{ emi: number }>(
      '/api/calculate-emi',
      form,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        // timeout: 8000, // optional: add timeout for safety
      }
    );

    return response.data.emi;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || error.message || 'Calculation failed';
      throw new Error(message);
    }
    throw new Error('Unexpected error occurred');
  }
}