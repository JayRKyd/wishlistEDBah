"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  CheckCircle, 
  ArrowLeft,
  Heart,
  Users,
  Package
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function TrackYourImpactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <span className="text-primary text-3xl mr-4 mt-1"></span>
            <h1 className="text-4xl font-bold text-gray-900">Track Your Impact</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See how your donations make a difference 
          </p>
        </div>



        {/* Content */}
        <div className="space-y-6">
          {/* Your Donations */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start">
                <span className="text-primary text-3xl mr-4 mt-1"></span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Donations</h2>
                  <div className="space-y-4 text-gray-700">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <span className="text-primary text-3xl mr-4 mt-1"></span>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Amazon Purchases</h3>
                          <p className="text-gray-700">
                            Track items you've purchased from teacher wishlists and see when they're delivered.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start">
                            <span className="text-primary text-3xl mr-4 mt-1"></span>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">Bank Transfers</h3>
                          <p className="text-gray-700">
                            Monitor transfers you've made and see how teachers use the funds.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impact Metrics */}
          <Card>
            <CardContent className="p-6">
                             <div className="flex items-center">
                 <span className="text-primary text-3xl mr-4 mt-1"></span>
                 <div className="w-full">
                   <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Impact</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-primary mb-2">0</div>
                      <div className="text-sm text-gray-600">Items Funded</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-2">0</div>
                      <div className="text-sm text-gray-600">Teachers Helped</div>
                    </div>
 
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How to Track */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start">
                <span className="text-primary text-3xl mr-4 mt-1"></span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">How to Track</h2>
                  <div className="space-y-3 text-gray-700">
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center mr-3 mt-1">
                        <span className="text-sm font-semibold">1</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Log into your donor account</h3>
                        <p className="text-gray-600">Access your dashboard to see your donation history</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center mr-3 mt-1">
                        <span className="text-sm font-semibold">2</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">View your donations</h3>
                        <p className="text-gray-600">See all items you've funded and transfers made</p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
} 