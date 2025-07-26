"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  CreditCard, 
  Building2, 
  User, 
  MapPin, 
  Copy, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Gift,
  Clock,
  Eye,
  EyeOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

interface BankingInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  pledge: {
    id: number;
    amount: number;
    quantity: number;
    transaction_reference: string;
    status?: string;
    wishlist_items: {
      name: string;
      description?: string;
    };
  };
  teacher: {
    bank_name: string;
    account_holder_name: string;
    account_number: string;
    branch_location: string;
    users: {
      first_name: string;
      last_name: string;
    };
    school: string;
    grade: string;
  };
}

export default function BankingInfoModal({ 
  isOpen, 
  onClose, 
  pledge, 
  teacher 
}: BankingInfoModalProps) {
  const { toast } = useToast();
  const supabase = createClient();
  const queryClient = useQueryClient();

  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [isMarkingDonated, setIsMarkingDonated] = useState(false);

  // Mutation to mark pledge as confirmed
  const confirmPaymentMutation = useMutation({
    mutationFn: async (message: string) => {
      const { error } = await supabase
        .from('pledges')
        .update({ 
          status: 'confirmed',
          message: message || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', pledge.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Payment Confirmed!",
        description: "Thank you! The teacher will be notified of your donation.",
      });
      queryClient.invalidateQueries({ queryKey: ['donor-pledges'] });
      onClose();
    },
    onError: (error) => {
      console.error('Confirmation error:', error);
      toast({
        title: "Error",
        description: "Failed to confirm payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Mutation to mark pledge as completed (donated)
  const markDonatedMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('pledges')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', pledge.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Donation Recorded!",
        description: "Thank you! Your donation has been marked as completed.",
      });
      queryClient.invalidateQueries({ queryKey: ['donor-pledges'] });
      queryClient.invalidateQueries({ queryKey: ['donor-profile'] });
      onClose();
    },
    onError: (error) => {
      console.error('Mark donated error:', error);
      toast({
        title: "Error",
        description: "Failed to mark donation as completed. Please try again.",
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const handleConfirmPayment = () => {
    confirmPaymentMutation.mutate(confirmationMessage);
  };

  const maskedAccountNumber = teacher.account_number
    ? teacher.account_number.replace(/.(?=.{4})/g, '*')
    : '';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Complete Your Donation
          </DialogTitle>
          <p className="text-gray-600 mt-2">
            Use the banking information below to transfer your donation
          </p>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Pledge Summary */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Gift className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {pledge.wishlist_items.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      for {teacher.users.first_name} {teacher.users.last_name}'s classroom
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-600">
                        <strong>${pledge.amount}</strong> • Qty: {pledge.quantity}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        Ref: {pledge.transaction_reference}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-amber-800 mb-1">
                  Secure Information
                </h4>
                <p className="text-sm text-amber-700">
                  This banking information is only shown to confirmed donors. 
                  Please keep these details confidential and use them only for this donation.
                </p>
              </div>
            </div>
          </div>

          {/* Banking Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Building2 className="mr-2 h-5 w-5 text-primary" />
                Banking Information
              </h3>
              
              <div className="space-y-4">
                {/* Bank Name */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-4 w-4 text-gray-600" />
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Bank Name</Label>
                      <p className="text-gray-900 font-medium">{teacher.bank_name}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(teacher.bank_name, 'Bank name')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                {/* Account Holder Name */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-gray-600" />
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Account Holder</Label>
                      <p className="text-gray-900 font-medium">{teacher.account_holder_name}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(teacher.account_holder_name, 'Account holder name')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                {/* Account Number */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-4 w-4 text-gray-600" />
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Account Number</Label>
                      <p className="text-gray-900 font-mono font-medium">
                        {showAccountNumber ? teacher.account_number : maskedAccountNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAccountNumber(!showAccountNumber)}
                    >
                      {showAccountNumber ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(teacher.account_number, 'Account number')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Branch Location */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Branch Location</Label>
                      <p className="text-gray-900 font-medium">{teacher.branch_location}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(teacher.branch_location, 'Branch location')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transfer Instructions */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-green-800 mb-3 flex items-center">
                <CheckCircle className="mr-2 h-4 w-4" />
                Transfer Instructions
              </h4>
              <div className="space-y-2 text-sm text-green-700">
                <p><strong>1.</strong> Use the banking details above to make your transfer</p>
                <p><strong>2.</strong> Include reference: <code className="bg-green-100 px-1 rounded">{pledge.transaction_reference}</code></p>
                <p><strong>3.</strong> Transfer amount: <strong>${pledge.amount}</strong></p>
                <p><strong>4.</strong> Confirm your payment below once completed</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Confirmation */}
          {!isConfirming ? (
            <div className="text-center">
              <Button
                onClick={() => setIsConfirming(true)}
                className="bg-primary hover:bg-blue-700"
                size="lg"
              >
                <Clock className="mr-2 h-4 w-4" />
                I've Made the Transfer
              </Button>
            </div>
          ) : (
            <Card>
              <CardContent className="p-6">
                <h4 className="font-medium text-gray-900 mb-4">
                  Confirm Your Payment
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="message">Optional Message to Teacher</Label>
                    <Textarea
                      id="message"
                      value={confirmationMessage}
                      onChange={(e) => setConfirmationMessage(e.target.value)}
                      placeholder="Share an encouraging message with the teacher..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsConfirming(false)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleConfirmPayment}
                      disabled={confirmPaymentMutation.isPending}
                      className="bg-green-600 hover:bg-green-700 flex-1"
                    >
                      {confirmPaymentMutation.isPending ? (
                        "Confirming..."
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Confirm Payment
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mark as Donated Section */}
          {pledge.status === 'confirmed' && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Mark as Donated
                </h4>
                <p className="text-sm text-blue-700 mb-4">
                  If you have already completed the bank transfer, you can mark this pledge as donated to update your total donated amount.
                </p>
                <Button
                  onClick={() => markDonatedMutation.mutate()}
                  disabled={markDonatedMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  {markDonatedMutation.isPending ? (
                    "Marking as Donated..."
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Donated
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Important Notice */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-800 mb-1">
                  Important Notice
                </h4>
                <p className="text-sm text-red-700">
                  Only confirm payment after you have successfully completed the bank transfer. 
                  False confirmations may result in account suspension.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 