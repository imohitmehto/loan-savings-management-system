import api from "@/lib/api/axiosInstance";
import { safeApiCall, ApiError, apiLog } from "@/lib/api/helpers/apiHelpers";
import { EmiFormData } from "@/types/EmiFormData";

// ------------------- EMI Calculator API -------------------

/**
 * Calculate EMI amount based on provided form data.
 * @param form - EMI calculation form payload.
 * @returns EMI amount as a number.
 */
export const calculateEmi = (form: EmiFormData): Promise<number> =>
  safeApiCall(async () => {
    apiLog("Calculating EMI...", form);
    const { data } = await api.post<{ emi: number }>(
      "/api/calculate-emi",
      form,
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    if (typeof data?.emi !== "number") {
      throw new ApiError("Invalid EMI data in response", 500);
    }

    return data.emi;
  });
