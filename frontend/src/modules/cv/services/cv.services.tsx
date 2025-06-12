// cv.services.tsx

import { mockCvApiCall, mockCvByIdApiCall } from "@/mock/data";
import type { CV } from "../types/cv.types";

export const getAllCvByUserId = async (userId: string): Promise<CV[]> => {
  return (await mockCvApiCall(userId)).data;
};

export const getCvById = async (id: string): Promise<CV | undefined> => {
  return (await mockCvByIdApiCall(id)).data;
};