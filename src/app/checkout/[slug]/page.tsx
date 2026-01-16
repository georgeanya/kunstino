'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { createUser, createOrder } from '@/lib/api/user';
import { getArtworkBySlug, transformArtworkFromAPI } from '@/lib/api/artworks';
import { CheckoutFormData, Artwork } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CheckoutPage() {
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string; // Changed from id to slug
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: '',
    firstName: '',
    lastName: '',
    country: 'Germany',
    phoneNumber: '',
    street: '',
    additionalStreet: '',
    city: '',
    zipCode: '',
    state: '',
  });
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [step, setStep] = useState<'loading' | 'form' | 'processing' | 'success'>('loading');
  const [createdUserId, setCreatedUserId] = useState<string | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  // Fetch artwork data on component mount
  useEffect(() => {
    async function fetchArtwork() {
      if (!slug) {
        setSubmitError('No artwork selected. Please go back and select an artwork.');
        setStep('form');
        return;
      }

      try {
        setStep('loading');
        const apiArtwork = await getArtworkBySlug(slug);
        const transformedArtwork = transformArtworkFromAPI(apiArtwork);
        setArtwork(transformedArtwork);
        setStep('form');
      } catch (error) {
        console.error('Failed to fetch artwork:', error);
        setSubmitError('Failed to load artwork details. Please try again.');
        setStep('form');
      }
    }

    fetchArtwork();
  }, [slug]);

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
          artwork_id: artwork.id, // Use artwork.id (MongoDB _id)
          quantity: 1
        }],
        payment_method: 'bank_transfer' as const,
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
  const shippingFee = 10; // Fixed shipping fee
  const vat = 0.19 * subtotal; // 19% VAT
  const total = subtotal + shippingFee + vat;

  // Spinner Loader Component
  const SpinnerLoader = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mb-4"></div>
    </div>
  );

  // Processing Step
  const renderProcessingStep = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin mb-4"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-black rounded-full"></div>
        </div>
      </div>
      <h2 className="text-2xl font-semibold mb-2 mt-4">Processing Your Order</h2>
      <p className="text-gray-600 text-center max-w-md">
        Please wait while we create your account and process your order...
      </p>
    </div>
  );

  // Success Step - Updated to match your design
  const renderSuccessStep = () => (
    <main className="flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <h1 className="text-2xl lg:text-[32px] font-serif mt-19 md:mt-0 text-center mb-8">
          {t.thankYouOrder}
        </h1>

        <div className="bg-[#F2F2F2] p-5 rounded-lg mb-8 md:mb-10">
          <div className="flex gap-4">
            <div className="relative w-24 md:w-35 aspect-square bg-gray-200 shrink-0 rounded overflow-hidden">
              {artwork?.imageUrl && (
                <Image
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  fill
                  className="object-cover"
                  style={{ 
                  objectFit: 'contain',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
                />
              )}
            </div>
            <div>
              <h3 className="mb-1 md:text-base text-sm">{artwork?.artistName}</h3>
              <p className="md:text-base text-sm text-black font-light italic mb-4">
                {artwork?.title}, {artwork?.year}
              </p>
              <p className="md:text-sm text-xs text-black font-light">{artwork?.medium}</p>
              <p className="md:text-sm text-xs text-black font-light">
                {artwork?.dimensions.width} × {artwork?.dimensions.height} {artwork?.dimensions.unit}
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-sm md:text-base text-black mb-6">
            {t.orderPlaced || 'Your order has been placed successfully!'}
          </p>
            <hr className='mb-6 mt-8 opacity-20'/>
          <div className="bg-white text-left mb-6">
            <ul className="space-y-2 text-sm md:text-base list-disc pl-5 md:pl-6">
              <li>
                <span className="font-medium">{t.bankName}:</span> Deutsche Bank
              </li>
              <li>
                <span className="font-medium">{t.accountName}:</span> Kunstino UG
              </li>
              <li>
                <span className="font-medium">{t.accountNumber}:</span> 3537783483
              </li>
              <li>
                <span className="font-medium">{t.amount}:</span> {`€${total.toLocaleString()}`}
              </li>
            </ul>
          </div>
            <hr className='my-6 md:mb-8 opacity-20'/>
          <p className="text-sm md:text-base text-black">
            {t.paymentDeadline || 'Please complete your payment within 48 hours.'}
          </p>
        </div>

        <div className="text-center mt-10 md:mt-20 text-xs text-black">
          {t.contactHelp?.split('{contact}')[0] || 'Need help?'}
          <Link href="/contact" className="link-underline hover:text-black">
            {t.contact || 'Contact us'}
          </Link>
          {t.contactHelp?.split('{contact}')[1] || ' for assistance.'}
        </div>
      </div>
    </main>
  );

  // Form Step
  const renderFormStep = () => {
    if (!artwork) {
      return (
        <div className="text-center py-20">
          <div className="text-red-600 mb-4">Artwork not found</div>
          <button
            onClick={() => router.push('/artworks')}
            className="bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Browse Artworks
          </button>
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

               <input
                type="tel"
                name="phoneNumber"
                placeholder={t.phoneNumber}
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#F0F0F0] text-black font-light rounded-[3px] focus:outline-none focus:ring-1 focus:ring-black text-sm"
                required
                disabled={isSubmitting}
              />

              <input
                name="country"
                value="Germany"
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#F0F0F0] text-black placeholder:text-gray-500 font-light rounded-[3px] focus:outline-none focus:ring-1 focus:ring-black text-sm"
                required
                disabled={isSubmitting}
              />
                


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
                <div className="relative w-24 md:w-35 aspect-square rounded overflow-hidden">
                  {artwork.imageUrl && (
                    <Image
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      fill
                      className="object-cover"
                      unoptimized={artwork.imageUrl.includes('storage.googleapis.com')}
                      style={{ 
                      objectFit: 'contain',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                    />
                  )}
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

        
      </>
    );
  };

  return (
    <main className="px-4 lg:px-25">
      {step !== 'success' && (
        <>
          <h1 className="text-[22px] font-serif font-normal lg:text-[32px]">
            {t.checkout} <span className="text-[16px] font-sans">&gt; {t.confirmation}</span>
          </h1>
          <hr className='my-5 opacity-20'/>
        </>
      )}
      
      {step === 'loading' && <SpinnerLoader />}
      {step === 'processing' && <SpinnerLoader />}
      {step === 'success' && renderSuccessStep()}
      {step === 'form' && renderFormStep()}
    </main>
  );
}