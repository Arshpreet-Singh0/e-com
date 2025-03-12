import { AxiosError } from "axios";
import { toast } from "sonner";

export const handleAxiosError = (error: unknown) => {
  if (error instanceof AxiosError) {
    if (!navigator.onLine) {
      toast.error("You are offline. Please check your internet connection.");
      return;
    }

    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          toast.error("Unauthorized access. Please log in again.");
          break;
        case 403:
          toast.error("Forbidden access. You don't have permission.");
          break;
        case 404:
          toast.error("Requested resource not found.");
          break;
        case 500:
          toast.error("Server error. Please try again later.");
          break;
        default:
          toast.error(data?.message || "An unexpected error occurred.");
      }
    } else if (error.request) {
      toast.error("Network error. Please try again later.");
    } else {
      toast.error("An unexpected error occurred.");
    }
  } else {
    toast.error("An unknown error occurred.");
  }
};
