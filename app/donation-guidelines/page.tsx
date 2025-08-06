"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Heart, 
  Shield, 
  Package, 
  Clock, 
  MapPin,
  AlertTriangle,
  CheckCircle,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function DonationGuidelinesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            
            <h1 className="text-4xl font-bold text-gray-900">Donation Guidelines</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about making safe donations to teachers
          </p>
        </div>



        {/* Guidelines Grid */}
        <div className="space-y-8">
          {/* Safety & Security */}
          <Card className="border-2 border-blue-100 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-start">
                <span className="text-primary text-3xl mr-4 mt-1"></span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Safety & Security</h2>
                  <div className="space-y-3 text-gray-700">
                    <div className="flex items-start">
                      <CheckCircle className="text-green-600 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>No money exchanges hands</strong> - We never handle payments. All donations are direct item donations.</span>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="text-green-600 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                      <span><strong>Verify teacher status</strong> - All teachers are verified through their schools before being approved.</span>
                    </div>
                                         <div className="flex items-start">
                       <CheckCircle className="text-green-600 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                       <span><strong>Teacher consent</strong> - Teachers provide their bank information with full consent for donations.</span>
                     </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What to Donate */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start">
                <span className="text-primary text-3xl mr-4 mt-1"></span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">What to Donate</h2>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <h3 className="font-semibold text-gray-900 mb-2">How to Donate</h3>
                       <ul className="space-y-1 text-gray-700">
                         <li>• <strong>Bank Transfers:</strong> View teacher's bank info and transfer through your bank app</li>
                         <li>• <strong>Amazon Wishlists:</strong> Purchase items from teacher's Amazon wishlist</li>
                         <li>• <strong>Pledge System:</strong> Commit to donating specific amounts or items</li>
                         <li>• <strong>Track Donations:</strong> Mark your donations as completed after making transfers</li>
                       </ul>
                     </div>
                     <div>
                       <h3 className="font-semibold text-gray-900 mb-2">What Teachers Need</h3>
                       <ul className="space-y-1 text-gray-700">
                         <li>• School supplies and classroom materials</li>
                         <li>• Educational books and resources</li>
                         <li>• Technology and equipment</li>
                         <li>• Art and science supplies</li>
                         <li>• Classroom organization items</li>
                       </ul>
                     </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How to Donate */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start">
                <span className="text-primary text-3xl mr-4 mt-1"></span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">How to Donate</h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3 mt-1">
                        <span className="text-sm font-semibold">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Browse Wishlists</h4>
                        <p className="text-gray-600">Find teachers and specific items they need in your area</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3 mt-1">
                        <span className="text-sm font-semibold">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Pledge Items</h4>
                        <p className="text-gray-600">Commit to donating specific items - this helps prevent duplicate donations</p>
                      </div>
                    </div>
                                         <div className="flex items-start">
                       <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3 mt-1">
                         <span className="text-sm font-semibold">3</span>
                       </div>
                       <div>
                         <h4 className="font-medium text-gray-900">Choose Donation Method</h4>
                         <p className="text-gray-600">View teacher's bank info or Amazon wishlist link</p>
                       </div>
                     </div>
                     <div className="flex items-start">
                       <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3 mt-1">
                         <span className="text-sm font-semibold">4</span>
                       </div>
                       <div>
                         <h4 className="font-medium text-gray-900">Complete Donation</h4>
                         <p className="text-gray-600">Make transfer through your bank app, then mark as completed</p>
                       </div>
                     </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start">
                <span className="text-primary text-3xl mr-4 mt-1"></span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Best Practices</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Before Donating</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Check item specifications carefully</li>

                        <li>• Keep receipts for your records</li>
                      </ul>
                    </div>
                                         <div>
                       <h3 className="font-semibold text-gray-900 mb-2">When Donating</h3>
                       <ul className="space-y-2 text-gray-700">
                         <li>• Use your own bank app to make transfers</li>
                         <li>• Purchase from verified Amazon wishlists</li>
                         <li>• Keep records of your donations</li>
                         <li>• Respect teacher's privacy and time</li>
                       </ul>
                     </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Card className="border-2 border-yellow-100 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-start">
                <AlertTriangle className="text-yellow-600 text-2xl mr-4 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Important Notes</h2>
                  <div className="space-y-3 text-gray-700">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                                             <span><strong>No cash donations:</strong> We only display bank information and Amazon wishlist links.</span>
                    </div>
                                         <div className="flex items-start">
                       <div className="w-2 h-2 bg-yellow-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                       <span><strong>Bank information display:</strong> Teachers provide their bank info for donors to use.</span>
                     </div>
                                           <div className="flex items-start">
                        <div className="w-2 h-2 bg-yellow-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        <span><strong>Amazon wishlists:</strong> Teachers can share Amazon wishlists for direct purchases.</span>
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