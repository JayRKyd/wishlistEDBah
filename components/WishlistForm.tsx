"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import type { InsertWishlist, InsertWishlistItem } from "@/lib/supabase/schema";

interface WishlistFormProps {
  teacherId: number;
  onClose: () => void;
  isOpen: boolean;
  existingWishlistId?: number;
  existingWishlistTitle?: string;
}

interface WishlistItem {
  name: string;
  description: string;
  quantity: number;
  priority: string;
  estimated_cost: string;
}

export default function WishlistForm({ teacherId, onClose, isOpen, existingWishlistId, existingWishlistTitle }: WishlistFormProps) {
  const [wishlistTitle, setWishlistTitle] = useState(existingWishlistTitle || "My Classroom Wishlist");
  const [wishlistDescription, setWishlistDescription] = useState("");
  const [items, setItems] = useState<WishlistItem[]>([
    {
      name: "",
      description: "",
      quantity: 1,
      priority: "standard",
      estimated_cost: "",
    }
  ]);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const supabase = createClient();

  // Generate a random share token
  const generateShareToken = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const createWishlistMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      items: WishlistItem[];
    }) => {
      let wishlistId = existingWishlistId;
      let wishlist = null;

      if (!existingWishlistId) {
        // Create a new wishlist if we don't have an existing one
        const wishlistData: InsertWishlist = {
          teacher_id: teacherId,
          title: data.title,
          description: data.description,
          share_token: generateShareToken(),
        };

        const { data: newWishlist, error: wishlistError } = await supabase
          .from('wishlists')
          .insert([wishlistData])
          .select()
          .single();

        if (wishlistError) throw wishlistError;
        
        wishlist = newWishlist;
        wishlistId = newWishlist.id;
      } else {
        // Get existing wishlist for return
        const { data: existingWishlist, error: fetchError } = await supabase
          .from('wishlists')
          .select('*')
          .eq('id', existingWishlistId)
          .single();

        if (fetchError) throw fetchError;
        wishlist = existingWishlist;
      }

      // Create the wishlist items
      const validItems = data.items.filter(item => item.name.trim());
      if (validItems.length > 0) {
        // Get the current max sort_order for this wishlist
        const { data: maxSortOrder } = await supabase
          .from('wishlist_items')
          .select('sort_order')
          .eq('wishlist_id', wishlistId!)
          .order('sort_order', { ascending: false })
          .limit(1)
          .single();

        const startingSortOrder = maxSortOrder ? maxSortOrder.sort_order + 1 : 0;

        const itemsToInsert: InsertWishlistItem[] = validItems.map((item, index) => ({
          wishlist_id: wishlistId!,
          name: item.name,
          description: item.description || null,
          quantity: item.quantity,
          priority: item.priority,
          estimated_cost: item.estimated_cost,
          sort_order: startingSortOrder + index,
        }));

        const { error: itemsError } = await supabase
          .from('wishlist_items')
          .insert(itemsToInsert);

        if (itemsError) throw itemsError;
      }

      return wishlist;
    },
    onSuccess: () => {
      toast({
        title: existingWishlistId ? "Items Added" : "Wishlist Created",
        description: existingWishlistId 
          ? "New items have been added to your wishlist successfully."
          : "Your wishlist has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['teacher-wishlists'] });
      queryClient.invalidateQueries({ queryKey: ['teacher-stats'] });
      
      // Also invalidate the specific wishlist items query if adding to existing wishlist
      if (existingWishlistId) {
        queryClient.invalidateQueries({ queryKey: ['wishlist-items', existingWishlistId] });
      }
      
      onClose();
    },
    onError: (error) => {
      console.error('Wishlist operation error:', error);
      toast({
        title: "Error",
        description: existingWishlistId 
          ? "Failed to add items to wishlist. Please try again."
          : "Failed to create wishlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validItems = items.filter(item => item.name.trim() && item.estimated_cost.trim());
    
    if (validItems.length === 0) {
      toast({
        title: "Missing Required Fields",
        description: "Please add at least one item with both name and estimated cost.",
        variant: "destructive",
      });
      return;
    }

    // Check for items with missing required fields
    const itemsWithMissingFields = items.filter(item => 
      item.name.trim() && !item.estimated_cost.trim()
    );
    
    if (itemsWithMissingFields.length > 0) {
      toast({
        title: "Missing Estimated Costs",
        description: "Please provide estimated costs for all items.",
        variant: "destructive",
      });
      return;
    }

    if (validItems.length > 50) {
      toast({
        title: "Too Many Items",
        description: "Maximum 50 items allowed per wishlist.",
        variant: "destructive",
      });
      return;
    }

    createWishlistMutation.mutate({
      title: wishlistTitle,
      description: wishlistDescription,
      items: validItems,
    });
  };

  const handleItemChange = (index: number, field: keyof WishlistItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const addItem = () => {
    if (items.length >= 50) {
      toast({
        title: "Limit Reached",
        description: "Maximum 50 items allowed per wishlist.",
        variant: "destructive",
      });
      return;
    }
    
    setItems([...items, {
      name: "",
      description: "",
      quantity: 1,
      priority: "standard",
      estimated_cost: "",
    }]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems.length > 0 ? newItems : [{
      name: "",
      description: "",
      quantity: 1,
      priority: "standard",
      estimated_cost: "",
    }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              {existingWishlistId ? "Add Items to Wishlist" : "Create Wishlist"}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Wishlist Title</Label>
                <Input
                  id="title"
                  type="text"
                  value={wishlistTitle}
                  onChange={(e) => setWishlistTitle(e.target.value)}
                  placeholder="My Classroom Wishlist"
                  disabled={!!existingWishlistId}
                />
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={wishlistDescription}
                  onChange={(e) => setWishlistDescription(e.target.value)}
                  disabled={!!existingWishlistId}
                  placeholder="Describe what these supplies will be used for in your classroom..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Wishlist Items</h3>
                <span className="text-sm text-gray-500">{items.length}/50 items</span>
              </div>

              {items.map((item, index) => (
                <Card key={index} className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium">Item {index + 1}</h4>
                      {items.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor={`name-${index}`}>Item Name *</Label>
                        <Input
                          id={`name-${index}`}
                          type="text"
                          value={item.name}
                          onChange={(e) => handleItemChange(index, "name", e.target.value)}
                          placeholder="e.g., Colored Pencils (48 count)"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor={`description-${index}`}>Description</Label>
                        <Textarea
                          id={`description-${index}`}
                          rows={2}
                          value={item.description}
                          onChange={(e) => handleItemChange(index, "description", e.target.value)}
                          placeholder="Describe how this item will be used in your classroom..."
                        />
                      </div>

                      <div>
                        <Label htmlFor={`quantity-${index}`}>Quantity Needed</Label>
                        <Input
                          id={`quantity-${index}`}
                          type="number"
                          min="1"
                          max="100"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value) || 1)}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`priority-${index}`}>Priority Level</Label>
                        <Select 
                          value={item.priority} 
                          onValueChange={(value) => handleItemChange(index, "priority", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High Priority</SelectItem>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="low">Low Priority</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor={`estimated_cost-${index}`}>Estimated Cost *</Label>
                        <Input
                          id={`estimated_cost-${index}`}
                          type="text"
                          value={item.estimated_cost}
                          onChange={(e) => handleItemChange(index, "estimated_cost", e.target.value)}
                          placeholder="e.g., $15"
                          required
                        />
                      </div>


                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addItem}
                className="w-full"
                disabled={items.length >= 50}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Another Item
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="text-blue-600 mr-2">💡</div>
                <div className="text-sm text-blue-800">
                  <strong>Tips for better results:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Be specific with item names and descriptions</li>
                    <li>Mark urgent items as high priority</li>
                    <li>Explain how items will benefit your students' learning</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={createWishlistMutation.isPending}
              >
                {createWishlistMutation.isPending ? (
                  existingWishlistId ? "Adding..." : "Creating..."
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    {existingWishlistId ? "Add Items" : "Create Wishlist"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 