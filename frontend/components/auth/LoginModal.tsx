"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');

  if (!isOpen) return null;

  const handleSubmitPhone = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('otp');
  };

  const handleSubmitOTP = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    setStep('phone');
    setPhone('');
    setName('');
    setOtp('');
  };

  return (
    <div className="fixed inset-0 bg-[rgba(255,255,255,0.03)] flex items-center justify-center z-50">
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
            <form onSubmit={handleSubmitPhone} className="space-y-4">
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
            <form onSubmit={handleSubmitOTP} className="space-y-4">
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
                  placeholder="Enter 6-digit OTP"
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
