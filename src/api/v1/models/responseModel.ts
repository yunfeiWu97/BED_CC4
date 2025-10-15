export interface SuccessResponse<T> {
  status: "success";
  data: T;
  message?: string;
}

export interface ErrorResponse {
  status: "error";
  error: { message: string; code?: string };
  timestamp?: string;
}

export const successResponse = <T>(data: T, message?: string): SuccessResponse<T> => ({
  status: "success",
  data,
  message,
});
