
import { fetchHandler } from "./handlers/fetch";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

export const backendapi = {
  ai: {
    processDocument: (
      formData: FormData
    ): APIResponse<DocProcessResponse> =>
      fetchHandler(`${API_BASE_URL}/doc-processing`, {
        method: "POST",
        formData,
      }),
  },
};

