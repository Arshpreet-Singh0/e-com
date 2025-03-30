declare global {
    interface Window {
      Razorpay: new (options) => any; // Replace `any` with actual type if available
    }
  }
  
  export {}; // This ensures the file is treated as a module
  