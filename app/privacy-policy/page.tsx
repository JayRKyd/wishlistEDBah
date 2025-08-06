"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            
            <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            How we collect, use, and protect your information
          </p>
        </div>



        {/* Privacy Policy Content */}
        <div className="space-y-8">
          <Card>
            <CardContent className="p-6">
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
                <p className="text-gray-700 mb-4">
                  We collect information you provide directly to us, such as when you create an account, 
                  submit a wishlist, or contact us. This may include:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-6">
                  <li>Name and contact information</li>
                  <li>School and teaching information</li>
                  <li>Wishlist items and descriptions</li>
                  <li>Banking information (with explicit consent)</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
                <p className="text-gray-700 mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-6">
                  <li>Provide and maintain our services</li>
                  <li>Connect teachers with potential donors</li>
                  <li>Display wishlists to donors</li>
                  <li>Send notifications about donations and pledges</li>
                  <li>Improve our platform and user experience</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">Banking Information</h2>
                <p className="text-gray-700 mb-4">
                  <strong>We will never share your banking information without your explicit consent.</strong> 
                  Banking information is only displayed to donors when you have provided consent during 
                  the signup process. You can withdraw this consent at any time by updating your account settings.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing</h2>
                <p className="text-gray-700 mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties 
                  except in the following circumstances:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-6">
                  <li>With your explicit consent</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and safety</li>
                  <li>With service providers who assist in operating our platform</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
                <p className="text-gray-700 mb-4">
                  We implement appropriate security measures to protect your personal information against 
                  unauthorized access, alteration, disclosure, or destruction. However, no method of 
                  transmission over the internet is 100% secure.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
                <p className="text-gray-700 mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-6">
                  <li>Access your personal information</li>
                  <li>Update or correct your information</li>
                  <li>Delete your account and associated data</li>
                  <li>Withdraw consent for banking information sharing</li>
                  <li>Opt out of certain communications</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about this Privacy Policy or our data practices, 
                  please contact us through our platform.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
                <p className="text-gray-700 mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any 
                  changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                </p>

                <p className="text-sm text-gray-500 mt-8">
                  Last Updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 