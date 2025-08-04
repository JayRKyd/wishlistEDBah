"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Heart, 
  DollarSign, 
  Gift, 
  CreditCard,
  Users,
  MessageSquare,
  Calculator,
  Building2,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import type { InsertPledge } from "@/lib/supabase/schema";

interface PledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: number;
    name: string;
    description?: string;
    quantity: number;
    estimated_cost?: string;
    priority: string;
  };
  teacher: {
    users: {
      first_name: string;
      last_name: string;
    };
    school: string;
    grade: string;
  };
}

export default function PledgeModal({ 
  isOpen, 
  onClose, 
  item, 
  teacher 
}: PledgeModalProps) {
  const { toast } = useToast();
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { data: userRole } = useUserRole();

  const [formData, setFormData] = useState({
    amount: item?.estimated_cost ? parseFloat(item.estimated_cost) : 0,
    quantity: 1,
    paymentMethod: 'bank_transfer', // Default to bank transfer only
    message: '',
  });

  const [step, setStep] = useState(1); // 1: Pledge Details, 2: Payment Method, 3: Confirmation

  // Get donor profile
  const { data: donorData } = useQuery({
    queryKey: ['donor-profile', userRole?.user?.id],
    queryFn: async () => {
      if (!userRole?.user) return null;
      
      const { data, error } = await supabase
        .from('donors')
        .select('*')
        .eq('user_id', userRole.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userRole?.user,
  });

  // Create pledge mutation
  const createPledgeMutation = useMutation({
    mutationFn: async (pledgeData: InsertPledge) => {
      const { data, error } = await supabase
        .from('pledges')
        .insert([pledgeData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (pledge) => {
      toast({
        title: "Pledge Created!",
        description: `Your pledge of $${formData.amount} has been created. Reference: ${pledge.transaction_reference}`,
      });
      queryClient.invalidateQueries({ queryKey: ['donor-pledges'] });
      onClose();
      
      // Reset form
      setFormData({
        amount: item?.estimated_cost ? parseFloat(item.estimated_cost) : 0,
        quantity: 1,
        paymentMethod: 'bank_transfer', // Default to bank transfer only
        message: '',
      });
      setStep(1);
    },
    onError: (error) => {
      console.error('Pledge creation error:', error);
      toast({
        title: "Error",
        description: "Failed to create pledge. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Don't render if item is not provided
  if (!item) {
    return null;
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!userRole?.user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a pledge.",
        variant: "destructive",
      });
      return;
    }

    // Check if donor data is available
    if (!donorData) {
      toast({
        title: "Donor Profile Required",
        description: "Please complete your donor profile first.",
        variant: "destructive",
      });
      return;
    }

    const pledgeData: InsertPledge = {
      donor_id: donorData.id,
      wishlist_item_id: item?.id || 0,
      amount: formData.amount,
      quantity: formData.quantity,
      message: formData.message || null,
      payment_method: formData.paymentMethod,
      // Legacy fields for compatibility
      donor_name: `${userRole.profile?.first_name} ${userRole.profile?.last_name}`,
      donor_email: userRole.user?.email || '',
      status: 'pending',
    };

    createPledgeMutation.mutate(pledgeData);
  };

  const totalAmount = formData.amount * formData.quantity;
  const teacherName = `${teacher.users.first_name} ${teacher.users.last_name}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mb-3 sm:mb-4">
            <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900">
            Make a Pledge
          </DialogTitle>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Support {teacherName}'s classroom with your donation
          </p>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-6">
          {/* Item Summary */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <Gift className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base break-words">{item?.name || 'Item'}</h3>
                  {item?.description && (
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 break-words">{item.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                    <span className="text-gray-600">
                      Need: <strong>{item?.quantity || 1}</strong>
                    </span>
                    {item?.estimated_cost && (
                      <span className="text-gray-600">
                        Est. Cost: <strong>{item.estimated_cost}</strong>
                      </span>
                    )}
                    <Badge 
                      className={
                        item?.priority === 'high' 
                          ? 'bg-orange-100 text-orange-700 border-orange-200 text-xs' 
                          : 'bg-blue-100 text-blue-700 border-blue-200 text-xs'
                      }
                    >
                      {item?.priority === 'high' ? 'High Priority' : 'Standard Priority'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 1: Pledge Details */}
          {step === 1 && (
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <Calculator className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Pledge Details
                </h3>
                
                <div className="space-y-3 sm:space-y-4">
                  {/* Amount */}
                  <div>
                    <Label htmlFor="amount" className="flex items-center text-sm sm:text-base">
                      <DollarSign className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Pledge Amount (USD) *
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                      className="mt-1 text-sm sm:text-base"
                      placeholder="0.00"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      You can pledge any amount toward this item
                    </p>
                  </div>

                  {/* Quantity */}
                  <div>
                    <Label htmlFor="quantity" className="flex items-center text-sm sm:text-base">
                      <Gift className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Quantity Contributing To *
                    </Label>
                    <Select 
                      value={formData.quantity.toString()} 
                      onValueChange={(value) => handleInputChange('quantity', parseInt(value))}
                    >
                      <SelectTrigger className="mt-1 text-sm sm:text-base">
                        <SelectValue placeholder="Select quantity" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(Math.min(item?.quantity || 1, 10))].map((_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1} {i + 1 === 1 ? 'item' : 'items'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Total Calculation */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-green-800 text-sm sm:text-base">Total Pledge:</span>
                      <span className="text-lg sm:text-xl font-bold text-green-900">
                        ${totalAmount.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-green-700 mt-1">
                      ${formData.amount} × {formData.quantity} {formData.quantity === 1 ? 'item' : 'items'}
                    </p>
                  </div>

                  {/* Message */}
                  <div>
                    <Label htmlFor="message" className="flex items-center text-sm sm:text-base">
                      <MessageSquare className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Message to Teacher (Optional)
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="mt-1 text-sm sm:text-base"
                      placeholder="Share an encouraging message with the teacher..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-6">
                  <Button variant="outline" onClick={onClose} size="sm" className="sm:size-default">
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => setStep(2)}
                    disabled={formData.amount <= 0}
                    className="bg-primary hover:bg-blue-700 size-sm sm:size-default"
                  >
                    Continue to Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Payment Method */}
          {step === 2 && (
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <CreditCard className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Payment Method
                </h3>
                
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <Label className="text-sm sm:text-base font-medium text-gray-700">
                      How would you like to make your donation?
                    </Label>
                    
                    <div className="mt-3">
                      <div className="border rounded-lg p-3 sm:p-4 border-primary bg-blue-50">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-gray-900 text-sm sm:text-base">Bank Transfer</h4>
                            <p className="text-xs sm:text-sm text-gray-600 break-words">
                              Direct transfer to teacher's bank account
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-3 mt-4 sm:mt-6">
                  <Button variant="outline" onClick={() => setStep(1)} size="sm" className="sm:size-default">
                    Back
                  </Button>
                  <Button 
                    onClick={() => setStep(3)}
                    className="bg-primary hover:bg-blue-700 size-sm sm:size-default"
                  >
                    Review Pledge
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <Heart className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Confirm Your Pledge
                </h3>
                
                <div className="space-y-3 sm:space-y-4">
                  {/* Pledge Summary */}
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Pledge Summary</h4>
                    <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Item:</span>
                        <span className="font-medium break-words text-right">{item?.name || 'Item'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Teacher:</span>
                        <span className="font-medium break-words text-right">{teacherName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">School:</span>
                        <span className="font-medium break-words text-right">{teacher.school}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount per item:</span>
                        <span className="font-medium">${formData.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantity:</span>
                        <span className="font-medium">{formData.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment method:</span>
                        <span className="font-medium">Bank Transfer</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="font-medium text-gray-900">Total Pledge:</span>
                        <span className="text-base sm:text-lg font-bold text-primary">${totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {formData.message && (
                    <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                      <h4 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">Your Message:</h4>
                      <p className="text-xs sm:text-sm text-blue-800 break-words">"{formData.message}"</p>
                    </div>
                  )}

                  {/* Important Notice */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-amber-800 mb-1 text-sm sm:text-base">Next Steps</h4>
                        <p className="text-xs sm:text-sm text-amber-700 break-words">
                          After creating your pledge, you'll receive the teacher's banking information 
                          to complete your donation. You can track your pledge status in your donor dashboard.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-3 mt-4 sm:mt-6">
                  <Button variant="outline" onClick={() => setStep(2)} size="sm" className="sm:size-default">
                    Back
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={createPledgeMutation.isPending}
                    className="bg-green-600 hover:bg-green-700 size-sm sm:size-default"
                  >
                    {createPledgeMutation.isPending ? (
                      "Creating Pledge..."
                    ) : (
                      <>
                        <Heart className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        Create Pledge
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 