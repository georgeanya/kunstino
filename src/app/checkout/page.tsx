'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckoutFormData } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CheckoutPage() {
  const { t } = useLanguage();
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Order submitted:', formData);
    alert('Order placed successfully!');
  };

  const artwork = {
    title: 'Green Artwork',
    artist: 'Olumide Osamede',
    year: 2020,
    medium: 'Oil on canvas',
    dimensions: '24 X 24 in',
    price: 1500,
    imageUrl: '/images/artworks/green-artwork.jpg',
  };

  const subtotal = artwork.price;
  const shippingFee = 155;
  const vat = 12;
  const total = subtotal + shippingFee + vat;

  return (
    <main className="px-4 lg:px-25">
        <h1 className="text-[22px] font-serif font-normal lg:text-[32px]">
          {t.checkout} <span className="text-[16px] font-sans">&gt; {t.confirmation}</span>
        </h1>
        <hr className='my-5 opacity-20'/>
      <div className="lg:flex lg:gap-12">
        {/* Form */}
        <div className="mb-10 lg:mb-0 w-full">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder={t.emailAddress}
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#F0F0F0] text-black font-light rounded-[3px] focus:outline-none focus:ring-1 focus:ring-black text-sm"
              required
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
              />
              <input
                type="text"
                name="lastName"
                placeholder={t.lastName}
                value={formData.lastName}
                onChange={handleChange}
                className="px-4 py-3 bg-[#F0F0F0] text-black font-light rounded-[3px] focus:outline-none focus:ring-1 focus:ring-black text-sm"
                required
              />
            </div>

            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#F0F0F0] text-black placeholder:text-gray-500 font-light rounded-[3px] focus:outline-none focus:ring-1 focus:ring-black text-sm"
              required
            >
              <option value="">{t.country}</option>
              <option value="DE">{t.countries.germany}</option>
              <option value="US">{t.countries.usa}</option>
              <option value="GB">{t.countries.uk}</option>
              <option value="FR">{t.countries.france}</option>
            </select>

            <input
              type="text"
              name="street"
              placeholder={t.street}
              value={formData.street}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#F0F0F0] text-black font-light rounded-[3px] focus:outline-none focus:ring-1 focus:ring-black text-sm"
              required
            />

            <input
              type="text"
              name="additionalStreet"
              placeholder={t.additionalStreet}
              value={formData.additionalStreet}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#F0F0F0] text-black font-light rounded-[3px] focus:outline-none focus:ring-1 focus:ring-black text-sm"
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
              />
              <input
                type="text"
                name="zipCode"
                placeholder={t.zipCode}
                value={formData.zipCode}
                onChange={handleChange}
                className="px-4 py-3 bg-[#F0F0F0] text-black font-light rounded-[3px] focus:outline-none focus:ring-1 focus:ring-black text-sm"
                required
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
            />

            
          </form>
        </div>

        {/* Order Summary */}
        <div className='w-full max-w-112.5'>
          <div className="bg-white rounded-lg mb-6">
            <div className="flex gap-4">
              <div className="relative w-20 h-28 lg:w-24 lg:h-32 bg-gray-200 shrink-0 rounded overflow-hidden">
                <Image
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-base mb-1">
                  {artwork.artist}
                </h3>
                <p className="text-base text-black font-light italic mb-2">
                  {artwork.title}, {artwork.year}
                </p>
                <p className="text-sm text-black font-light">{artwork.medium}</p>
                <p className="text-sm text-black font-light">{artwork.dimensions}</p>
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
            type="submit"
            className="w-full max-w-100 bg-black text-white py-3 lg:py-4 rounded-[40px] transition-colors text-sm"
        >
            {t.saveAndContinue}
        </button>
        </div>
      <div className="text-center mt-8 lg:mt-12 text-xs text-gray-600">
        {t.contactHelp.split('{contact}')[0]}
        <Link href="/contact" className="link-underline hover:text-black">
          {t.contact}
        </Link>
        {t.contactHelp.split('{contact}')[1]}
      </div>
    </main>
  );
}