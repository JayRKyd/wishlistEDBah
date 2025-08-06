"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart, User, ArrowRight, Gift } from "lucide-react";
import { useRouter } from "next/navigation";

interface DonorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName?: string;
  teacherName?: string;
  returnUrl?: string;
}

export default function DonorAuthModal({ 
  isOpen, 
  onClose, 
  itemName, 
  teacherName,
  returnUrl 
}: DonorAuthModalProps) {
  const router = useRouter();

  const handleSignUp = () => {
    // Save pledge intent to localStorage
    if (itemName) {
      localStorage.setItem('pledge_intent', JSON.stringify({
        itemName,
        teacherName,
        returnUrl: returnUrl || window.location.pathname,
        timestamp: Date.now()
      }));
    }
    
    onClose();
    router.push('/auth/donor-signup');
  };

  const handleLogin = () => {
    // Save pledge intent to localStorage
    if (itemName) {
      localStorage.setItem('pledge_intent', JSON.stringify({
        itemName,
        teacherName,
        returnUrl: returnUrl || window.location.pathname,
        timestamp: Date.now()
      }));
    }
    
    onClose();
    router.push('/auth/donor-login');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-xl font-bold text-center text-gray-900">
            Support This Teacher
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Item/Teacher Info */}
          {(itemName || teacherName) && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-start space-x-3">
                <Gift className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  {itemName && (
                    <p className="font-medium text-gray-900 mb-1">
                      "{itemName}"
                    </p>
                  )}
                  {teacherName && (
                    <p className="text-sm text-gray-600">
                      for {teacherName}'s classroom
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Main Message */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              To make a pledge, you'll need to create a donor account. This helps us:
            </p>
            
            <div className="text-left space-y-2 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                <span>Track your donation history and impact</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                <span>Provide secure teacher banking information</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                <span>Send updates on your donations</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleSignUp}
              className="w-full bg-primary hover:bg-blue-700 text-white"
              size="lg"
            >
              <User className="mr-2 h-4 w-4" />
              Create Donor Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              onClick={handleLogin}
              variant="outline" 
              className="w-full border-primary text-primary hover:bg-blue-50"
              size="lg"
            >
              I Already Have an Account
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Creating an account takes less than 30 seconds
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Join the community of donors supporting Bahamian education!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 