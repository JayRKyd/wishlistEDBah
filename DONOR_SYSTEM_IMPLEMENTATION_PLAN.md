# Donor System Implementation Plan

## 🎯 **Overview**
Implement a complete donor system that allows community members to pledge donations to teacher wishlists, manage their pledges, and complete payments through teacher banking information.

## 🔐 **Authentication Flow**

### **Donor Sign Up/Login Process**
1. **Entry Point**: When donor clicks "Pledge to Donate" on `/wishlist/[share_token]`
2. **Authentication Check**: 
   - If logged in as donor → Go to pledge modal
   - If logged in as teacher → Show message "Switch to donor account or sign out"
   - If not logged in → Redirect to donor auth

### **Donor Registration Form** (`/auth/donor-signup`)
Required fields:
- **Full Name** (first_name, last_name)
- **Email Address** (for Supabase auth)
- **Phone Number** (optional, for notifications)
- **Location** (City/Island - for local matching)
- **Motivation** (Why they want to help - optional text area)

### **Donor Login** (`/auth/donor-login`)
- Email + Password
- "Forgot Password" functionality
- Link to "New donor? Sign up here"

## 🗄️ **Database Schema Updates**

### **New `donors` Table**
```sql
CREATE TABLE donors (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  phone VARCHAR(20),
  location VARCHAR(100),
  motivation TEXT,
  total_pledged DECIMAL(10,2) DEFAULT 0.00,
  total_donated DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Update `users` Table**
Add role differentiation:
```sql
-- Add donor role option
ALTER TABLE users 
ALTER COLUMN role TYPE VARCHAR(20),
ADD CONSTRAINT users_role_check 
CHECK (role IN ('teacher', 'admin', 'donor'));
```

### **New `pledges` Table**
```sql
CREATE TABLE pledges (
  id SERIAL PRIMARY KEY,
  donor_id INTEGER REFERENCES donors(id) ON DELETE CASCADE,
  wishlist_item_id INTEGER REFERENCES wishlist_items(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  quantity INTEGER DEFAULT 1,
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  payment_method VARCHAR(50), -- 'bank_transfer', 'cash', 'online'
  transaction_reference VARCHAR(100),
  pledged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **New `transactions` Table**
```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  pledge_id INTEGER REFERENCES pledges(id),
  teacher_id INTEGER REFERENCES teachers(id),
  donor_id INTEGER REFERENCES donors(id),
  amount DECIMAL(10,2) NOT NULL,
  transaction_type VARCHAR(20) CHECK (transaction_type IN ('pledge', 'refund')),
  payment_method VARCHAR(50),
  bank_reference VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎨 **UI/UX Flow**

### **1. Wishlist Page Updates** (`/wishlist/[share_token]`)
- **Add "Pledge to Donate" button** next to each wishlist item
- **Update item cards** to show current pledge amount and remaining needed
- **Add pledge progress bar** for each item
- **Show "This item is fully funded!" when pledges meet the cost**

### **2. Donor Dashboard** (`/donor/dashboard`)

#### **Overview Section**
- Welcome message: "Welcome back, [Donor Name]!"
- **Quick Stats Cards**:
  - Total Pledged: $X,XXX
  - Total Donated: $X,XXX  
  - Active Pledges: X items
  - Teachers Helped: X teachers

#### **Active Pledges Section**
Table/card view showing:
- **Teacher Info**: Name, School, Grade
- **Item Details**: Name, Quantity pledged, Amount pledged
- **Status**: Pending, Confirmed, Completed
- **Actions**: 
  - "Complete Payment" button (opens banking modal)
  - "View Wishlist" link
  - "Cancel Pledge" option (if pending)

#### **Pledge History Section**
- Completed donations
- Cancelled pledges
- Transaction references

### **3. Pledge Modal Flow**

#### **Step 1: Item Selection**
- **Item Details**: Name, description, teacher's estimated cost
- **Pledge Amount**: 
  - Pre-filled with item cost
  - Allow custom amounts (partial or full funding)
  - Show "X others have pledged $XXX toward this item"
- **Quantity**: How many of this item they're pledging for
- **Message**: Optional message to teacher

#### **Step 2: Payment Method Selection**
- **Bank Transfer** (Primary option in Bahamas)
- **Cash Delivery** (For local donors)
- **Future**: Online payment integration

#### **Step 3: Teacher Banking Information**
- **Modal displays teacher's banking details**:
  - Bank Name
  - Account Holder Name
  - Account Number
  - Branch Location
- **Important Notice**: "Please include your pledge reference #PL-XXXX in your transfer memo"
- **Confirmation button**: "I've Made the Transfer"

## 🔧 **Technical Implementation**

### **Phase 1: Authentication & Basic Structure**
1. **Create donor auth pages**:
   - `/auth/donor-signup` component
   - `/auth/donor-login` component
2. **Update middleware** to handle donor routes
3. **Create donor dashboard** basic layout
4. **Database migrations** for new tables

### **Phase 2: Pledge System**
1. **Pledge modal component**
2. **Update wishlist page** with pledge buttons
3. **Donor dashboard** with pledge management
4. **Banking information modal**

### **Phase 3: Payment Processing**
1. **Bank transfer verification system**
2. **Notification system** (email/SMS)
3. **Admin approval workflow** for completed transfers
4. **Receipt generation**

### **Phase 4: Advanced Features**
1. **Real-time pledge updates**
2. **Teacher notification system**
3. **Donor matching by location**
4. **Impact tracking and reports**

## 🔐 **Security & Privacy**

### **Banking Information Protection**
- **Only show banking info** to confirmed pledgers
- **Encrypt sensitive data** in database
- **Audit log** for banking info access
- **Teacher consent** before showing banking details

### **Pledge Verification**
- **Two-step confirmation** for pledges
- **Email verification** for new donors
- **Reference number system** for tracking transfers
- **Admin review** before marking as completed

## 📱 **Key Components to Build**

### **Authentication Components**
- `DonorSignUpForm.tsx`
- `DonorLoginForm.tsx` 
- `AuthGuard.tsx` (donor route protection)

### **Dashboard Components**
- `DonorDashboard.tsx`
- `PledgeOverview.tsx`
- `ActivePledges.tsx`
- `PledgeHistory.tsx`

### **Pledge Components**
- `PledgeModal.tsx`
- `PaymentMethodSelection.tsx`
- `BankingInfoModal.tsx`
- `PledgeConfirmation.tsx`

### **Updated Components**
- Update `WishlistPage.tsx` with pledge buttons
- Update `WishlistItemCard.tsx` with funding progress
- Update `Navbar.tsx` with donor menu options

## 🚀 **Success Metrics**

### **For Donors**
- Number of active donors
- Average pledge amount
- Pledge completion rate
- Donor retention (repeat donations)

### **For Teachers**
- Items funded per week
- Time from posting to funding
- Teacher satisfaction with donor experience

### **For Platform**
- Total donations processed
- Successful teacher-donor connections
- Platform transaction volume

## 📋 **User Stories**

### **As a Donor**
- I want to browse teacher wishlists and find items to support
- I want to pledge a specific amount toward an item
- I want to see my donation history and impact
- I want secure access to teacher banking information
- I want to track the status of my pledges

### **As a Teacher**
- I want to be notified when someone pledges to my items
- I want to confirm when I receive donations
- I want to thank donors for their support
- I want to see funding progress on my items

### **As Platform Admin**
- I want to verify completed transactions
- I want to ensure donor and teacher safety
- I want to track platform success metrics
- I want to resolve any payment disputes

## ⏰ **Implementation Timeline**

### **Week 1-2: Foundation**
- Database schema and migrations
- Basic donor authentication
- Donor dashboard shell

### **Week 3-4: Core Pledge System**
- Pledge modal and flow
- Banking information integration
- Basic donation tracking

### **Week 5-6: Enhancement**
- Notification system
- Advanced dashboard features
- Security hardening

### **Week 7-8: Testing & Launch**
- Comprehensive testing
- Documentation
- Beta launch with select donors

## 🔄 **Future Enhancements**

1. **Mobile App** for easier donor access
2. **Automated Payment Processing** (Stripe, PayPal)
3. **Corporate Donor Accounts** for business sponsors
4. **Donor Recognition System** (badges, certificates)
5. **Tax Receipt Generation** for donations
6. **Wishlist Item Categories** for targeted giving
7. **Donor Matching** by interests and location
8. **Impact Reports** showing classroom outcomes

---

This comprehensive donor system will transform the platform from a simple wishlist display into a fully functional donation marketplace, enabling real financial support for Bahamian teachers and their classrooms. 