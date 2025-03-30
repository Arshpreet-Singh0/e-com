"use client";

import { BACKEND_URL } from "@/config/config";
import { useAppSelector } from "@/lib/store/hooks";
import { handleAxiosError } from "@/utils/handleAxiosError";
import axios from "axios";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
const AddressForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    street : ""
  });

  const {user} = useAppSelector(store => store.auth);

  const {items} = useAppSelector(store => store.cart);

  interface Address {
    id: string;
    firstName: string;
    lastName? : string;
    phone: string;
    city: string;
    street: string;
    state: string;
    pincode: string;
    landmark: string;
    email : string;
  }

  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(()=>{
    if(!user){
      toast.error("You are not logged in");
      router.push('/');
      return;
    }
  })

  useEffect(() => {
    const getSavedAddresses = async () => {
      setLoading(true);

      if(!user){
        return;
      }
      try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/address`, {
          withCredentials: true,
        });

        setAddresses(res?.data);
      } catch (error) {
        console.error(error);
        handleAxiosError(error);
      } finally {
        setLoading(false);
      }
    };
    getSavedAddresses();
  }, [user]);

//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;
//     script.onload = () => console.log("Razorpay script loaded!");
//     document.body.appendChild(script);
// }, []);



  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!selectedAddressId) {
      toast.error("Please select an address");
      return;
    }
  
    try {
      // Create Order on Backend
      const orderResponse = await axios.post(
        `${BACKEND_URL}/api/v1/order`,
        { items, addressId: selectedAddressId },
        { withCredentials: true }
      );
  
      if (!orderResponse.data || !orderResponse.data.order) {
        toast.error("Failed to create order. Please try again.");
        return;
      }
  
      const {id: prisamOrderId} = orderResponse.data.order;
      const { amount, id: orderId } = orderResponse.data?.razorpayOrder;

      
      
      const scriptLoaded = await loadRazorpayScript();
if (!scriptLoaded) {
  toast.error("Failed to load Razorpay. Check your network.");
  return;
}
      // Initialize Razorpay Payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY, // Razorpay Key
        amount: amount,
        currency: "INR",
        name: "DENIM CO.",
        description: "Order Payment",
        order_id: orderId, // Ensure this is correctly mapped
        handler: function (response: RazorpayResponse) {
          // Redirect to verify page with all necessary parameters
          const params = new URLSearchParams({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            order_id: prisamOrderId,
            amount: String(amount),
          });
          window.location.href = `/payment/verify?${params.toString()}`;
        },
        modal: {
          ondismiss: function () {
            window.location.href = `/payment/cancel?order_id=${prisamOrderId}`;
          },
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#000000",
        },
      };
  
      try {
        const razorpay = new window.Razorpay(options);
        
        razorpay.open();
      } catch (err) {
        console.error("Razorpay Initialization Error:", err);
        toast.error("Failed to initialize Razorpay.");
      }
      
    } catch (error) {
      console.log(error);
      
      handleAxiosError(error);
    }
  };
  

  const handleSaveAdress = async(e : React.FormEvent)=>{
    e.preventDefault();

    try {
      const res = await axios.post(`${BACKEND_URL}/api/v1/address`, formData, {
        withCredentials : true
      });
      if(res?.data?.success){
        toast.success(res?.data?.message);
        setAddresses(res?.data?.addresses);
        setShowNewAddressForm(false);

      }
    } catch (error) {
      console.log(error);
      
      handleAxiosError(error);
    }
  }


  return (
    <div className="bg-white rounded-lg shadow p-8">
      {/* Progress Steps */}
      <div className="flex items-center mb-8">
        <div className="flex-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-black text-white">
            1
          </div>
          <p className="text-sm mt-1">Details</p>
        </div>
        <div className="flex-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center border">
            2
          </div>
          <p className="text-sm mt-1">Payment</p>
        </div>
      </div>

      {/* Address Selection & Form */}
      <div className="flex flex-col gap-10">
        {/* Saved Addresses List */}
        {
          !showNewAddressForm && (
            <div className="h-[300px] overflow-y-auto p-4 rounded-lg">
          {loading ? (
            <p>Loading addresses...</p>
          ) : addresses.length === 0 ? (
            <p className="text-gray-500">No saved addresses found.</p>
          ) : (
            addresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-3 mb-3 border rounded-lg cursor-pointer ${
                  selectedAddressId === addr.id
                    ? "border-black"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedAddressId(addr.id)}
              >
                <p className="font-semibold">{addr.firstName} {addr.lastName}</p>
                <p className="text-sm">{addr.email}</p>
                <p className="text-sm text-gray-600">
                  {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                </p>
                <p className="text-sm text-gray-600">Phone: {addr.phone}</p>
              </div>
            ))
          )}
        </div>
          )
        }

        {/* Add New Address */}
        <div className="flex flex-col gap-4">
          {!showNewAddressForm && (
            <button
              type="button"
              onClick={() => setShowNewAddressForm(true)}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400"
            >
              <Plus className="w-5 h-5 mx-auto mb-2" />
              <span className="text-gray-600">Add New Address</span>
            </button>
          )}

          {showNewAddressForm && (
            <form className="space-y-6" onSubmit={handleSaveAdress}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800"
              >
                Save Address & Continue to Payment
              </button>
            </form>
          )}
          {
          showNewAddressForm && (
            <button
              type="button"
              className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 mt-5"
              onClick={()=>setShowNewAddressForm(false)}
            >
              Go back
            </button>
          )
        }

       {
        !showNewAddressForm && (
          <button
          className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 mt-10"
          onClick={handleCheckout}
        >
          Continue to Payment
        </button>
        )
       }
        </div>

        
      </div>
    </div>
  );
};

export default AddressForm;

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
