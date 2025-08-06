"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Plus, 
  Share, 
  Edit, 
  Check, 
  Trash2,
  ArrowLeft,
  BookOpen,
  Users,
  Heart,
  DollarSign,
  Link as LinkIcon,
  AlertCircle,
  Lightbulb
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function HowToCreateWishlistsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            
            <h1 className="text-4xl font-bold text-gray-900">How to Create Wishlists</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A step-by-step guide to creating effective wishlists that connect you with generous donors
          </p>
        </div>



        {/* Guide Content */}
        <div className="space-y-8">
          {/* Getting Started */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start">
                <span className="text-primary text-3xl mr-4 mt-1">
                  
                </span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Getting Started</h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      Creating a wishlist is the first step to connecting with donors who want to support your classroom. 
                      Follow these simple steps to get started:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-lg font-bold">1</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Create Account</h3>
                        <p className="text-sm text-gray-600">Sign up and verify your teacher status</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-lg font-bold">2</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Build Wishlist</h3>
                        <p className="text-sm text-gray-600">Add items your classroom needs</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-lg font-bold">3</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Share & Receive</h3>
                        <p className="text-sm text-gray-600">Share your wishlist and coordinate with donors</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Creating Your First Wishlist */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start">
                <span className="text-primary text-3xl mr-4 mt-1">
                  
                </span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Creating Your First Wishlist</h2>
                  <div className="space-y-4 text-gray-700">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <span className="text-primary text-3xl mr-4 mt-1">
                          
                        </span>
                        <div>
                          <h3 className="font-semibold text-blue-900 mb-2">Access Your Dashboard</h3>
                          <p className="text-blue-800">
                            After logging in, you'll be taken to your teacher dashboard where you can manage all your wishlists.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">Step-by-Step Process:</h3>
                      <ol className="list-decimal list-inside space-y-2 ml-4">
                        <li>
                          <strong>Click "Create First Wishlist"</strong> - This button appears when you have no wishlists yet
                        </li>
                        <li>
                          <strong>Add Wishlist Details</strong> - Give your wishlist a title and optional description
                        </li>
                        <li>
                          <strong>Add Items</strong> - Start with at least one item (up to 50 items per wishlist)
                        </li>
                        <li>
                          <strong>Fill Item Details</strong> - Include name, description, quantity, and priority
                        </li>
                        <li>
                          <strong>Save Your Wishlist</strong> - Click "Create Wishlist" to save
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Item Details Guide */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start">
                <span className="text-primary text-3xl mr-4 mt-1">
                  
                </span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Item Details Guide</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Required Fields</h3>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          <div>
                            <strong>Item Name</strong>
                            <p className="text-sm text-gray-600">Be specific: "Colored Pencils (48 count)" not just "Pencils"</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          <div>
                            <strong>Quantity</strong>
                            <p className="text-sm text-gray-600">How many of this item you need (1-100)</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                     <span className="text-primary text-3xl mr-4 mt-1">
                          
                        </span>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          <div>
                            <strong>Description</strong>
                            <p className="text-sm text-gray-600">Explain how you'll use this item in your classroom</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          <div>
                            <strong>Priority Level</strong>
                            <p className="text-sm text-gray-600">High, Standard, or Low priority</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          <div>
                            <strong>Estimated Cost</strong>
                            <p className="text-sm text-gray-600">Approximate price to help donors budget</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          <div>
                            <strong>Purchase Link</strong>
                            <p className="text-sm text-gray-600">Amazon or other online store link</p>
                          </div>
                        </div>
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Best Practices for Success</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Item Descriptions</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Be specific about brand, size, and quantity</li>
                        <li>• Explain how the item will benefit your students</li>
                        <li>• Include any specific requirements (e.g., "non-toxic")</li>
                        <li>• Mention if it's for a specific project or lesson</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Priority Setting</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Mark urgent supplies as "High Priority"</li>
                        <li>• Use "Standard" for regular classroom needs</li>
                        <li>• Reserve "Low Priority" for nice-to-have items</li>
                        <li>• Update priorities as needs change</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertCircle className="text-yellow-600 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-yellow-900 mb-2">Pro Tips</h3>
                        <ul className="text-yellow-800 space-y-1">
                          <li>• Add purchase links to make it easier for donors to buy exactly what you need</li>
                          <li>• Include estimated costs to help donors understand the investment</li>
                          <li>• Update your wishlist regularly as items are received</li>
                          <li>• Be responsive when donors reach out to coordinate donations</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Managing Your Wishlists */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start">
                <span className="text-primary text-3xl mr-4 mt-1"></span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Managing Your Wishlists</h2>
                  <div className="space-y-4 text-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Adding More Items</h3>
                        <p>
                          You can add up to 50 items per wishlist. Click "Add New Item to Wishlist" 
                          on any existing wishlist to add more items.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Marking Items as Received</h3>
                        <p>
                          When you receive an item, mark it as "Fulfilled" in your dashboard. 
                          This helps donors track their impact and prevents duplicate donations.
                        </p>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <span className="text-primary text-3xl mr-4 mt-1">
                          
                        </span>
                        <div>
                          <h3 className="font-semibold text-green-900 mb-2">Sharing Your Wishlist</h3>
                          <p className="text-green-800">
                            Each wishlist gets a unique share link that you can send to potential donors, 
                            post on social media, or share with your school community.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What Happens Next */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start">
                <span className="text-primary text-3xl mr-4 mt-1"></span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">What Happens After You Create a Wishlist</h2>
                  <div className="space-y-4 text-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Users className="text-blue-600 text-2xl mx-auto mb-2" />
                        <h3 className="font-semibold text-gray-900 mb-2">Donors Browse</h3>
                        <p className="text-sm text-gray-600">Potential donors can discover your wishlist and see what you need</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Heart className="text-green-600 text-2xl mx-auto mb-2" />
                        <h3 className="font-semibold text-gray-900 mb-2">Pledges Made</h3>
                        <p className="text-sm text-gray-600">Donors can pledge to provide specific items from your list</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <DollarSign className="text-purple-600 text-2xl mx-auto mb-2" />
                        <h3 className="font-semibold text-gray-900 mb-2">Items Received</h3>
                        <p className="text-sm text-gray-600">Coordinate with donors to receive your classroom supplies</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <span className="text-primary text-3xl mr-4 mt-1">
                          
                        </span>
                        <div>
                          <h3 className="font-semibold text-blue-900 mb-2">Stay Connected</h3>
                          <p className="text-blue-800">
                            You'll receive notifications when donors pledge items or contact you. 
                            Be responsive to coordinate delivery and thank your donors!
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