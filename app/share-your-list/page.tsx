"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Share2, 
  Link as LinkIcon, 
  Mail, 
  MessageSquare, 
  Facebook, 
  Twitter, 
  Instagram,
  ArrowLeft,
  Copy,
  CheckCircle,
  Users,
  Heart
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ShareYourListPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">

            <h1 className="text-4xl font-bold text-gray-900">Share Your Wishlist</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple ways to share your classroom needs with potential donors
          </p>
        </div>


        {/* Guide Content */}
        <div className="space-y-8">
          {/* How to Get Your Share Link */}
          <Card>
            <CardContent className="p-6">
                             <div className="flex items-start">
                 <span className="text-primary text-3xl mr-4 mt-1"></span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Getting Your Share Link</h2>
                  <div className="space-y-4 text-gray-700">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <CheckCircle className="text-blue-600 mr-2 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-blue-900 mb-2">Automatic Share Link</h3>
                          <p className="text-blue-800">
                            Every wishlist you create automatically gets a unique share link. 
                            You can find this link in your teacher dashboard.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">Step-by-Step:</h3>
                      <ol className="list-decimal list-inside space-y-2 ml-4">
                        <li>Log into your teacher dashboard</li>
                        <li>Find your wishlist in the dashboard</li>
                        <li>Click the "Share" button next to your wishlist</li>
                        <li>Copy the unique link that appears</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sharing Methods */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start">
                <span className="text-primary text-3xl mr-4 mt-1"></span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Ways to Share Your Wishlist</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Digital Sharing</h3>
                      <div className="space-y-3">
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Mail className="text-blue-600 mr-3" />
                          <div>
                            <strong>Email</strong>
                            <p className="text-sm text-gray-600">Send to friends, family, and colleagues</p>
                          </div>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <MessageSquare className="text-green-600 mr-3" />
                          <div>
                            <strong>Text Messages</strong>
                            <p className="text-sm text-gray-600">Share with your personal network</p>
                          </div>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Facebook className="text-blue-600 mr-3" />
                          <div>
                            <strong>Social Media</strong>
                            <p className="text-sm text-gray-600">Post on Facebook, Instagram, or Twitter</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Community Sharing</h3>
                      <div className="space-y-3">
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Users className="text-purple-600 mr-3" />
                          <div>
                            <strong>School Community</strong>
                            <p className="text-sm text-gray-600">Share with parents and school staff</p>
                          </div>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Heart className="text-red-600 mr-3" />
                          <div>
                            <strong>Local Groups</strong>
                            <p className="text-sm text-gray-600">Community organizations and clubs</p>
                          </div>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <MessageSquare className="text-orange-600 mr-3" />
                          <div>
                            <strong>WhatsApp Groups</strong>
                            <p className="text-sm text-gray-600">Family and community chat groups</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips for Effective Sharing */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start">
                <span className="text-primary text-3xl mr-4 mt-1"></span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Tips for Effective Sharing</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">What to Include</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li>• A brief explanation of your classroom needs</li>
                        <li>• How the supplies will benefit your students</li>
                        <li>• Any urgent items that need immediate attention</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Best Practices</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Share regularly, not just once</li>
                        <li>• Update your wishlist as items are received</li>
                        <li>• Be specific about how items will be used</li>
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
            </CardContent>
          </Card>

          {/* What Happens When You Share */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start">
                <span className="text-primary text-3xl mr-4 mt-1"></span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">What Happens When You Share</h2>
                  <div className="space-y-4 text-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-lg font-bold">1</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Donors Visit</h3>
                        <p className="text-sm text-gray-600">People click your link and see your wishlist</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-lg font-bold">2</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">They Pledge</h3>
                        <p className="text-sm text-gray-600">Donors commit to providing specific items</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-lg font-bold">3</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">You Connect</h3>
                        <p className="text-sm text-gray-600">Coordinate payment and thank your donors</p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <span className="text-primary text-3xl mr-4 mt-1"></span>
                        <div>
                          <h3 className="font-semibold text-yellow-900 mb-2">Stay Active</h3>
                          <p className="text-yellow-800">
                            The more you share, the more likely you are to receive donations. 
                            Don't be afraid to share multiple times - people appreciate reminders!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}

        </div>
      </div>
    </div>
  );
} 