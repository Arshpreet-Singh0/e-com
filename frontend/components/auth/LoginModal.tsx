"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { closeLoginModal } from '@/lib/store/features/loginModalSlice';
import axios from 'axios';
import { BACKEND_URL } from '@/config/config';
import { toast } from 'sonner';
import { setUser } from '@/lib/store/features/authSlice';

const LoginModal = () => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const dispatch = useAppDispatch();

  const {isLoginModalOpen} = useAppSelector(store=>store.modal);

  if (!isLoginModalOpen) return null;


  const handlegetOTP = async(e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await axios.post(`${BACKEND_URL}/api/v1/getotp`, {name, phone, otp}, {
        withCredentials : true,
      });
      
      
      if(res?.data?.success){
        toast.success(res?.data?.message);
        setStep('otp');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitOTP = async(e: React.FormEvent)=>{
    e.preventDefault();
    
    try {
      const res = await axios.post(`${BACKEND_URL}/api/v1/verifyotp`, {name, phone, otp}, {
        withCredentials : true,
      });

      if(res?.data?.success){
        toast.success(res?.data?.message);
        dispatch(setUser(res?.data?.user));
        dispatch(closeLoginModal());
      }
      
      
      if(res?.data?.success){
        toast.success(res?.data?.message);
        setStep('otp');
      }
    } catch (error) {
      console.log(error);
      if(axios.isAxiosError(error)){
        toast.error(error?.response?.data?.message || "something went wrong");
      }
    }
  }


  const onClose = ()=>{
    dispatch(closeLoginModal());
  }

  return (
    <div className="fixed inset-0 bg-black/50 shadow-2xl bg-opaci flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl rounded-lg overflow-hidden flex">
        <div className="hidden md:block w-1/2">
          <img
            src="https://images.unsplash.com/photo-1617922001439-4a2e6562f328?auto=format&fit=crop&q=80"
            alt="Model wearing denim"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Welcome to DENIM CO.</h2>
            <button onClick={onClose} className="p-2">
              <X size={24} />
            </button>
          </div>

          {step === 'phone' ? (
            <form onSubmit={handlegetOTP} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter your mobile number"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors"
              >
                Get OTP
              </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmitOTP}>
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter 4digit OTP"
                  maxLength={6}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors"
              >
                Verify OTP
              </button>
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-gray-600 text-sm hover:text-gray-800"
              >
                Back to phone number
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-gray-600">
            By continuing, you agree to our{' '}
            <a href="#" className="text-black hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-black hover:underline">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
