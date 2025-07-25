-- Add donor role to users table
ALTER TABLE users 
ALTER COLUMN role DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE users
ADD CONSTRAINT users_role_check CHECK (role IN ('teacher', 'admin', 'donor'));

-- Create donors table
CREATE TABLE donors (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  phone VARCHAR(20),
  location VARCHAR(100),
  motivation TEXT,
  total_pledged DECIMAL(10,2) DEFAULT 0.00,
  total_donated DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pledges table
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

-- Create transactions table
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

-- Add indexes for better performance
CREATE INDEX idx_donors_user_id ON donors(user_id);
CREATE INDEX idx_pledges_donor_id ON pledges(donor_id);
CREATE INDEX idx_pledges_wishlist_item_id ON pledges(wishlist_item_id);
CREATE INDEX idx_pledges_status ON pledges(status);
CREATE INDEX idx_transactions_pledge_id ON transactions(pledge_id);

-- Enable RLS
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE pledges ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for donors table
CREATE POLICY "Allow users to view own donor profile" ON donors
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow users to update own donor profile" ON donors
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert own donor profile" ON donors
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for pledges table
CREATE POLICY "Allow donors to view own pledges" ON pledges
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM donors 
      WHERE donors.id = pledges.donor_id 
      AND donors.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow teachers to view pledges for their items" ON pledges
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM wishlist_items wi
      JOIN wishlists w ON wi.wishlist_id = w.id
      JOIN teachers t ON w.teacher_id = t.id
      WHERE wi.id = pledges.wishlist_item_id
      AND t.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow donors to create pledges" ON pledges
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM donors 
      WHERE donors.id = pledges.donor_id 
      AND donors.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow donors to update own pledges" ON pledges
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM donors 
      WHERE donors.id = pledges.donor_id 
      AND donors.user_id = auth.uid()
    )
  );

-- RLS Policies for transactions table  
CREATE POLICY "Allow users to view own transactions" ON transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM donors 
      WHERE donors.id = transactions.donor_id 
      AND donors.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM teachers 
      WHERE teachers.id = transactions.teacher_id 
      AND teachers.user_id = auth.uid()
    )
  );

-- Function to update donor totals when pledges change
CREATE OR REPLACE FUNCTION update_donor_totals()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total_pledged when pledge is created or updated
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE donors SET 
      total_pledged = (
        SELECT COALESCE(SUM(amount), 0) 
        FROM pledges 
        WHERE donor_id = NEW.donor_id 
        AND status IN ('pending', 'confirmed', 'completed')
      ),
      total_donated = (
        SELECT COALESCE(SUM(amount), 0) 
        FROM pledges 
        WHERE donor_id = NEW.donor_id 
        AND status = 'completed'
      ),
      updated_at = NOW()
    WHERE id = NEW.donor_id;
  END IF;
  
  -- Update totals when pledge is deleted
  IF TG_OP = 'DELETE' THEN
    UPDATE donors SET 
      total_pledged = (
        SELECT COALESCE(SUM(amount), 0) 
        FROM pledges 
        WHERE donor_id = OLD.donor_id 
        AND status IN ('pending', 'confirmed', 'completed')
      ),
      total_donated = (
        SELECT COALESCE(SUM(amount), 0) 
        FROM pledges 
        WHERE donor_id = OLD.donor_id 
        AND status = 'completed'
      ),
      updated_at = NOW()
    WHERE id = OLD.donor_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for donor totals
CREATE TRIGGER trigger_update_donor_totals
  AFTER INSERT OR UPDATE OR DELETE ON pledges
  FOR EACH ROW EXECUTE FUNCTION update_donor_totals();

-- Function to generate pledge reference numbers
CREATE OR REPLACE FUNCTION generate_pledge_reference()
RETURNS TRIGGER AS $$
BEGIN
  NEW.transaction_reference = 'PL-' || UPPER(LEFT(MD5(RANDOM()::TEXT), 8));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for pledge reference generation
CREATE TRIGGER trigger_generate_pledge_reference
  BEFORE INSERT ON pledges
  FOR EACH ROW EXECUTE FUNCTION generate_pledge_reference(); 