"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Search, 
  CheckCircle, 
  ArrowLeft,
  Users,
  Package,
  MessageSquare,
  HandHeart
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function HowToHelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            
            <h1 className="text-4xl font-bold text-gray-900">How to Help</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple ways to support Bahamian teachers and their classrooms
          </p>
        </div>


        {/* Guide Content */}
        <div className="space-y-8">
          {/* Getting Started */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start">
                    <span className="text-primary text-3xl mr-4 mt-1"></span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Getting Started</h2>
                  <div className="space-y-4 text-gray-700">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                          <span className="text-primary text-3xl mr-4 mt-1"></span>
                        <div>
                          <h3 className="font-semibold text-blue-900 mb-2">No Account Required</h3>
                          <p className="text-blue-800">
                            You can browse wishlists and see what teachers need without creating an account. 
                            Only create an account when you're ready to pledge items.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">Quick Start:</h3>
                      <ol className="list-decimal list-inside space-y-2 ml-4">
                        <li>Browse available wishlists</li>
                        <li>Find items you'd like to help with</li>
                        <li>Create a donor account </li>
                        <li>Pledge the items you want to donate</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How Pledging Works */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start">
                <span className="text-primary text-3xl mr-4 mt-1"></span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">How Pledging Works</h2>
                  <div className="space-y-4 text-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-sm sm:text-lg font-bold">1</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Browse & Choose</h3>
                        <p className="text-sm text-gray-600">Find wishlists and select items you want to help with</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-sm sm:text-lg font-bold">2</span>
                        </div>
                                                 <h3 className="font-semibold text-gray-900 mb-2">Fund the Classroom</h3>
                         <p className="text-sm text-gray-600">Purchase from Amazon wishlist or make bank transfer</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-sm sm:text-lg font-bold">3</span>
                        </div>
                                                 <h3 className="font-semibold text-gray-900 mb-2">Track Your Impact</h3>
                         <p className="text-sm text-gray-600">See how your funding helps teachers and students</p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start">
                            <span className="text-primary text-3xl mr-4 mt-1"></span>
                        <div>
                                                     <h3 className="font-semibold text-yellow-900 mb-2">Funding Options</h3>
                           <p className="text-yellow-800">
                             You can fund classrooms through Amazon wishlist purchases (items ship directly to teachers) 
                             or bank transfers (teachers use funds for classroom supplies).
                           </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What You Can Donate */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start">
                <span className="text-primary text-3xl mr-4 mt-1"></span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">How You Can Fund Classrooms</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Amazon Wishlist Purchases</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Teachers create Amazon wishlists with specific items</li>
                        <li>• Purchase items directly from their wishlist</li>
                        <li>• Items ship directly to the teacher's address</li>
                        <li>• Track your purchases and impact</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Bank Transfers</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Teachers provide their bank account details</li>
                        <li>• Make direct transfers from your bank app</li>
                        <li>• Teachers use funds for classroom supplies</li>
                        <li>• Coordinate directly with the teacher</li>
                      </ul>
                    </div>
                  </div>


                </div>
              </div>
            </CardContent>
          </Card>

          {/* Finding Teachers to Help */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start">
                <span className="text-primary text-3xl mr-4 mt-1"></span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Finding Teachers to Help</h2>
                  <div className="space-y-4 text-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Browse All Wishlists</h3>
                        <ul className="space-y-2 text-gray-700">
                          <li>• See all available teacher wishlists</li>
                          <li>• Filter by location or school</li>
  
                          <li>• Read teacher descriptions</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Direct Links</h3>
                        <ul className="space-y-2 text-gray-700">
                          <li>• Teachers share their wishlist links</li>
                          <li>• Click shared links to view specific lists</li>
                          <li>• Contact teachers directly</li>

                        </ul>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <span className="text-primary text-3xl mr-4 mt-1"></span>
                        <div>
                          <h3 className="font-semibold text-blue-900 mb-2">Community Impact</h3>
                          <p className="text-blue-800">
                            Every donation, no matter how small, makes a difference in a classroom. 
                            Your support helps teachers provide better education for our children.
                          </p>
                        </div>
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