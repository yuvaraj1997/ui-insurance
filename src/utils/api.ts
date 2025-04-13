import axios, { AxiosRequestConfig } from 'axios';
import { AccessTokenResponse, ActivatePolicyResponse, ApiErrorResponse, LoginResponse, PoliciesResponse, PolicyDetails, PolicyIssuedData, PolicyProps, StandardUserDashboardStats, User, UserPolicyPaymentList, UserQuotePolicyResponse } from '../types';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

type LoginResult =
  | { success: true; data?: any }
  | { success: false; error: any };

export const api = {
  signup: async (req: any): Promise<LoginResult> => {
    try {
      await axios.post<LoginResponse>(`${baseUrl}/auth/signup`, req);
      return { success: true };
    } catch (error: unknown) {
      if (axios.isAxiosError<ApiErrorResponse>(error) && error.response) {
        return { success: false, error: error.response.data };
      }
      throw error;
    }
  },
  login: async (email: string, password: string): Promise<LoginResult> => {
    try {
      const response = await axios.post<LoginResponse>(`${baseUrl}/auth/login`, {
        email,
        password,
      }, {
        withCredentials: true
      });
      return { success: true, data: response.data };
    } catch (error: unknown) {
      if (axios.isAxiosError<ApiErrorResponse>(error) && error.response) {
        return { success: false, error: error.response.data };
      }
      throw error;
    }
  },
  accessToken: async (): Promise<LoginResult> => {
    try {
      const response = await axios.get<AccessTokenResponse>(`${baseUrl}/auth/token`, {
        withCredentials: true
      });
      return { success: true, data: response.data };
    } catch (error: unknown) {
      if (axios.isAxiosError<ApiErrorResponse>(error) && error.response) {
        return { success: false, error: error.response.data };
      }
      throw error;
    }
  },
  logout: async (): Promise<LoginResult> => {
    try {
      await axios.post<LoginResponse>(`${baseUrl}/auth/logout`, {}, {
        withCredentials: true
      });
      sessionStorage.removeItem("accessToken")
      return { success: true };
    } catch (error: unknown) {
      if (axios.isAxiosError<ApiErrorResponse>(error) && error.response) {
        return { success: false, error: error.response.data };
      }
      throw error;
    }
  },
  ownProfile: async (): Promise<LoginResult> => {
    return await authenticatedGet<User>(`${baseUrl}/users/profile`);
  },
  ownPolicies: async (): Promise<LoginResult> => {
    return await authenticatedGet<PolicyProps>(`${baseUrl}/users/policies`);
  },
  getUserPolicyDetail: async (userPolicyId: string): Promise<LoginResult> => {
    return await authenticatedGet<PolicyDetails>(`${baseUrl}/users/policies/${userPolicyId}`);
  },
  getFile: async (userPolicyId: string): Promise<LoginResult> => {
    try {
      const token = JSON.parse(sessionStorage.getItem("accessToken")!)?.accessToken;
  
      const response = await axios.get<Blob>(`${baseUrl}/users/policies/${userPolicyId}/download`, {
        responseType: "blob",
        headers: {
          Authorization: token
        }
      });
  
      return { success: true, data: response.data };
    } catch (error) {
      if (axios.isAxiosError<ApiErrorResponse>(error) && error.response) {
        return { success: false, error: error.response.data };
      }
      throw error;
    }
  },
  getUserPolicyPayments: async (userPolicyId: string): Promise<LoginResult> => {
    return await authenticatedGet<UserPolicyPaymentList>(`${baseUrl}/users/policies/${userPolicyId}/payments`);
  },
  getInsurancePoliciesByType: async (type: string): Promise<LoginResult> => {
    return await authenticatedGet<PoliciesResponse>(`${baseUrl}/insurance/policies?type=${type.toUpperCase()}`);
  },
  generateQuotation: async (data: any): Promise<LoginResult> => {
    return await authenticatedPost<UserQuotePolicyResponse>(`${baseUrl}/insurance/generate-quote`, data);
  },
  upload: async (userQuotePolicyId: string, file: File): Promise<LoginResult> => {
    const formData = new FormData();
    formData.append("userQuotePolicyId", userQuotePolicyId);
    formData.append("file", file);

    return await authenticatedPost<void>(
      `${baseUrl}/insurance/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
  },
  pay: async (userQuotePolicyId: string): Promise<LoginResult> => {
    return await authenticatedPost<ActivatePolicyResponse>(`${baseUrl}/insurance/payment`, { userQuotePolicyId })
  },
  dashboardSummary: async (): Promise<LoginResult> => {
    return await authenticatedGet<StandardUserDashboardStats>(`${baseUrl}/dashboard/summary`);
  },
  adminDashboardPolicyIssued: async (): Promise<LoginResult> => {
    return await authenticatedGet<PolicyIssuedData>(`${baseUrl}/admin/dashboard/policies/issued`);
  },
}

export async function authenticatedPost<T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<LoginResult> {
  try {
    const token = JSON.parse(sessionStorage.getItem("accessToken")!)?.accessToken;

    const isFormData = data instanceof FormData;
    const headers = {
      ...config?.headers,
      Authorization: token,
      ...(isFormData ? {} : { "Content-Type": "application/json" }) // Don't override FormData content type
    };

    const response = await axios.post<T>(url, data, {
      ...config,
      headers
    });

    return { success: true, data: response.data };
  } catch (error: unknown) {
    if (axios.isAxiosError<ApiErrorResponse>(error) && error.response) {
      return { success: false, error: error.response.data };
    }
    throw error;
  }
}



async function authenticatedGet<T>(url: string, config?: AxiosRequestConfig): Promise<LoginResult> {
  try {
    const token = JSON.parse(sessionStorage.getItem("accessToken")!)?.accessToken;
    const response = await axios.get<T>(url, {
      ...config,
      headers: {
        ...config?.headers,
        Authorization: token
      }
    });
    return { success: true, data: response.data };
  } catch (error: unknown) {
    if (axios.isAxiosError<ApiErrorResponse>(error) && error.response) {
      return { success: false, error: error.response.data };
    }
    throw error;
  }
}