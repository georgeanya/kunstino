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
    <main className="px-4 py-8 lg:px-[100px] lg:py-12">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-xl lg:text-3xl font-medium">
          {t.checkout} <span className="text-gray-400">&gt; {t.confirmation}</span>
        </h1>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-12">
        {/* Form */}
        <div className="mb-8 lg:mb-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder={t.emailAddress}
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#F2F2F2] border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder={t.firstName}
                value={formData.firstName}
                onChange={handleChange}
                className="px-4 py-3 bg-[#F2F2F2] border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder={t.lastName}
                value={formData.lastName}
                onChange={handleChange}
                className="px-4 py-3 bg-[#F2F2F2] border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm"
                required
              />
            </div>

            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#F2F2F2] border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm text-gray-700"
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
              className="w-full px-4 py-3 bg-[#F2F2F2] border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm"
              required
            />

            <input
              type="text"
              name="additionalStreet"
              placeholder={t.additionalStreet}
              value={formData.additionalStreet}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#F2F2F2] border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="city"
                placeholder={t.city}
                value={formData.city}
                onChange={handleChange}
                className="px-4 py-3 bg-[#F2F2F2] border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm"
                required
              />
              <input
                type="text"
                name="zipCode"
                placeholder={t.zipCode}
                value={formData.zipCode}
                onChange={handleChange}
                className="px-4 py-3 bg-[#F2F2F2] border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm"
                required
              />
            </div>

            <input
              type="text"
              name="state"
              placeholder={t.state}
              value={formData.state}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#F2F2F2] border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 text-sm"
              required
            />

            <button
              type="submit"
              className="w-full bg-black text-white py-3 lg:py-4 rounded-lg hover:bg-gray-800 transition-colors mt-6 font-medium text-sm"
            >
              {t.saveAndContinue}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg mb-6">
            <div className="flex gap-4">
              <div className="relative w-20 h-28 lg:w-24 lg:h-32 bg-gray-200 flex-shrink-0 rounded overflow-hidden">
                <Image
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium text-sm mb-1">
                  {artwork.artist}
                </h3>
                <p className="text-xs text-gray-600 italic mb-2">
                  {artwork.title}, {artwork.year}
                </p>
                <p className="text-xs text-gray-600">{artwork.medium}</p>
                <p className="text-xs text-gray-600">{artwork.dimensions}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t.subtotal}</span>
              <span className="font-medium">€{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t.shippingFee}</span>
              <span className="font-medium">€{shippingFee}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t.vat}</span>
              <span className="font-medium">€{vat}</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-medium text-base">
              <span>{t.total}</span>
              <span>€{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-8 lg:mt-12 text-xs text-gray-600">
        {t.contactHelp.split('{contact}')[0]}
        <Link href="/contact" className="underline hover:text-black">
          {t.contact}
        </Link>
        {t.contactHelp.split('{contact}')[1]}
      </div>
    </main>
  );
}