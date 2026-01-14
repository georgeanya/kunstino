'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getArtworkById, transformArtworkFromAPI } from '@/lib/api/artworks';
import { createUser, createOrder } from '@/lib/api/user'; 
import { CheckoutFormData } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Artwork } from '@/lib/types';

export default function CheckoutPage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const artworkId = searchParams.get('artworkId');
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: '',
    firstName: '',
    lastName: '',
    country: '',
    street: '',
    additionalStreet: '',
    city: '',
    zipCode: '',
    state: '',
  });
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [createdUserId, setCreatedUserId] = useState<string | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [loadingArtwork, setLoadingArtwork] = useState(true);

  // Fetch artwork data on component mount
  useEffect(() => {
    async function fetchArtwork() {
      if (!artworkId) {
        setSubmitError('No artwork selected. Please go back and select an artwork.');
        setLoadingArtwork(false);
        return;
      }

      try {
        setLoadingArtwork(true);
        const apiArtwork = await getArtworkById(artworkId);
        const transformedArtwork = transformArtworkFromAPI(apiArtwork);
        setArtwork(transformedArtwork);
      } catch (error) {
        console.error('Failed to fetch artwork:', error);
        setSubmitError('Failed to load artwork details. Please try again.');
      } finally {
        setLoadingArtwork(false);
      }
    }

    fetchArtwork();
  }, [artworkId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!artwork) {
      setSubmitError('Artwork information is missing. Please try again.');
      return;
    }

    // Basic validation
    if (!formData.email || !formData.firstName || !formData.lastName || 
        !formData.country || !formData.street || !formData.city || 
        !formData.zipCode || !formData.state) {
      setSubmitError('Please fill in all required fields');
      return;
    }

    if (!artwork.available) {
      setSubmitError('This artwork is no longer available for purchase.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setStep('processing');

    try {
      // Step 1: Create User
      const userData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: '', // You might want to add phone field to your form
        street: formData.street,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zip_code: formData.zipCode,
      };

      console.log('Creating user...');
      const userResponse = await createUser(userData);
      const customerId = userResponse.data.customer_id;
      setCreatedUserId(customerId);
      
      console.log('User created successfully. Customer ID:', customerId);

      // Step 2: Create Order
      const orderData = {
        customer_id: customerId,
        items: [{
          artwork_id: artwork.id,
          quantity: 1
        }],
        payment_method: 'bank_transfer',
        shipping_address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zip_code: formData.zipCode,
        }
      };

      console.log('Creating order...');
      const orderResponse = await createOrder(orderData);
      const orderId = orderResponse.data.order_id;
      setCreatedOrderId(orderId);
      
      console.log('Order created successfully. Order ID:', orderId);

      // Success
      setStep('success');
      
    } catch (error: any) {
      console.error('Checkout failed:', error);
      setSubmitError(error.message || 'Failed to complete checkout. Please try again.');
      setStep('form');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate totals
  const subtotal = artwork?.price || 0;
  const shippingFee = 155;
  const vat = 12;
  const total = subtotal + shippingFee + vat;

  // Render different states
  const renderProcessingStep = () => (
    <div className="text-center py-20">
      <div className="mb-6">
        <div className="w-16 h-16 border-4 border-t-black border-gray-300 rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-2xl font-semibold mb-2">Processing Your Order</h2>
        <p className="text-gray-600">Please wait while we create your account and process your order...</p>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center py-10">
      <div className="mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold mb-2">Order Successful!</h2>
        <p className="text-gray-600 mb-4">Thank you for your purchase.</p>
        
        <div className="max-w-md mx-auto bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="font-semibold mb-3">Order Details</h3>
          <div className="text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">{createdOrderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Customer ID:</span>
              <span className="font-medium">{createdUserId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Artwork:</span>
              <span className="font-medium">{artwork?.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Artist:</span>
              <span className="font-medium">{artwork?.artistName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-medium">€{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium">Bank Transfer</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => window.location.href = '/'}
            className="bg-black text-white py-3 px-8 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
          <div>
            <p className="text-sm text-gray-600 mb-2">A confirmation email has been sent to {formData.email}</p>
            <p className="text-sm text-gray-600">Please check your inbox for order details.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFormStep = () => {
    if (loadingArtwork) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mb-4"></div>
  </div>
      );
    }

    if (!artwork) {
      return (
        <div className="text-center py-20">
          <div className="text-red-600 mb-4">Artwork not found</div>
          <Link href="/artworks" className="bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-800 transition-colors">
            Browse Artworks
          </Link>
        </div>
      );
    }

    return (
      <>
        <div className="lg:flex lg:gap-12">
          {/* Form */}
          <div className="mb-10 lg:mb-0 w-full">
            <form onSubmit={handleSubmit} className="space-y-4">
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {submitError}
                </div>
              )}

              <input
                type="email"
                name="email"
                placeholder={t.emailAddress}
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#F0F0F0] text-black font-light rounded-[3px] focus:outline-none focus:ring-1 focus:ring-black text-sm"
                required
                disabled={isSubmitting}
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder={t.firstName}
                  value={formData.firstName}
                  onChange={handleChange}
                  className="px-4 py-3 bg-[#F0F0F0] text-black font-light rounded-[3px] focus:outline-none focus:ring-1 focus:ring-black text-sm"
                  required
                  disabled={isSubmitting}
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder={t.lastName}
                  value={formData.lastName}
                  onChange={handleChange}
                  className="px-4 py-3 bg-[#F0F0F0] text-black font-light rounded-[3px] focus:outline-none focus:ring-1 focus:ring-black text-sm"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#F0F0F0] text-black placeholder:text-gray-500 font-light rounded-[3px] focus:outline-none focus:ring-1 focus:ring-black text-sm"
                required
                disabled={isSubmitting}
              >
                <option value="">{t.country}</option>
                <option value="Germany">{t.countries.germany}</option>
                <option value="USA">{t.countries.usa}</option>
                <option value="UK">{t.countries.uk}</option>
                <option value="France">{t.countries.france}</option>
              </select>

              <input
                type="text"
                name="street"
                placeholder={t.street}
                value={formData.street}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#F0F0F0] text-black font-light rounded-[3px] focus:outline-none focus:ring-1 focus:ring-black text-sm"
                required
                disabled={isSubmitting}
              />

              <input
                type="text"
                name="additionalStreet"
                placeholder={t.additionalStreet}
                value={formData.additionalStreet}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#F0F0F0] text-black font-light rounded-[3px] focus:outline-none focus:ring-1 focus:ring-black text-sm"
                disabled={isSubmitting}
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder={t.city}
                  value={formData.city}
                  onChange={handleChange}
                  className="px-4 py-3 bg-[#F0F0F0] text-black font-light rounded-[3px] focus:outline-none focus:ring-1 focus:ring-black text-sm"
                  required
                  disabled={isSubmitting}
                />
                <input
                  type="text"
                  name="zipCode"
                  placeholder={t.zipCode}
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="px-4 py-3 bg-[#F0F0F0] text-black font-light rounded-[3px] focus:outline-none focus:ring-1 focus:ring-black text-sm"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <input
                type="text"
                name="state"
                placeholder={t.state}
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#F0F0F0] text-black font-light rounded-[3px] focus:outline-none focus:ring-1 focus:ring-black text-sm"
                required
                disabled={isSubmitting}
              />
            </form>
          </div>

          {/* Order Summary */}
          <div className='w-full max-w-112.5'>
            <div className="bg-white rounded-lg mb-6">
              <div className="flex gap-4">
                <div className="relative w-20 h-28 lg:w-24 lg:h-32 bg-gray-200 shrink-0 rounded overflow-hidden">
                  <Image
                    src={artwork.imageUrl || '/images/placeholder.jpg'}
                    alt={artwork.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-base mb-1">
                    {artwork.artistName}
                  </h3>
                  <p className="text-base text-black font-light italic mb-2">
                    {artwork.title}, {artwork.year}
                  </p>
                  <p className="text-sm text-black font-light">{artwork.medium}</p>
                  <p className="text-sm text-black font-light">
                    {artwork.dimensions.width} × {artwork.dimensions.height} {artwork.dimensions.unit}
                  </p>
                </div>
              </div>
            </div>
            <hr className='mb-5 mt-6 opacity-20'/>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="">{t.subtotal}</span>
                <span className="">€{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="">{t.shippingFee}</span>
                <span className="">€{shippingFee}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="">{t.vat}</span>
                <span className="">€{vat}</span>
              </div>
              <div className="flex justify-between font-semibold text-sm">
                <span>{t.total}</span>
                <span>€{total.toLocaleString()}</span>
              </div>
              <hr className='my-5 opacity-20'/>
            </div>
          </div>
        </div>

        <div className='md:mt-20 mt-10 flex items-center justify-center'>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !artwork.available}
            className={`w-full max-w-100 py-3 lg:py-4 rounded-[40px] transition-colors text-sm ${
              isSubmitting || !artwork.available
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : artwork.available ? (
              t.saveAndContinue
            ) : (
              'Sold Out'
            )}
          </button>
        </div>

        <div className="text-center mt-8 lg:mt-12 text-xs text-gray-600">
          {t.contactHelp.split('{contact}')[0]}
          <Link href="/contact" className="link-underline hover:text-black">
            {t.contact}
          </Link>
          {t.contactHelp.split('{contact}')[1]}
        </div>
      </>
    );
  };

  return (
    <main className="px-4 lg:px-25">
      <h1 className="text-[22px] font-serif font-normal lg:text-[32px]">
        {t.checkout} <span className="text-[16px] font-sans">&gt; {t.confirmation}</span>
      </h1>
      <hr className='my-5 opacity-20'/>
      
      {step === 'processing' && renderProcessingStep()}
      {step === 'success' && renderSuccessStep()}
      {step === 'form' && renderFormStep()}
    </main>
  );
}