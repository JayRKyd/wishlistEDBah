-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT auth.uid(),
    email VARCHAR UNIQUE,
    first_name VARCHAR,
    last_name VARCHAR,
    profile_image_url VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teachers table
CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL UNIQUE,
    grade VARCHAR NOT NULL,
    school VARCHAR NOT NULL,
    location VARCHAR NOT NULL,
    bio TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    amazon_wishlist_url TEXT,
    bank_name VARCHAR,
    account_number VARCHAR,
    branch_location VARCHAR,
    account_holder_name VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wishlists table
CREATE TABLE wishlists (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES teachers(id) NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    share_token VARCHAR NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wishlist_items table
CREATE TABLE wishlist_items (
    id SERIAL PRIMARY KEY,
    wishlist_id INTEGER REFERENCES wishlists(id) NOT NULL,
    name VARCHAR NOT NULL,
    description TEXT,
    priority VARCHAR NOT NULL DEFAULT 'medium',
    quantity INTEGER NOT NULL DEFAULT 1,
    estimated_cost DECIMAL(10,2),
    is_fulfilled BOOLEAN DEFAULT FALSE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pledges table
CREATE TABLE pledges (
    id SERIAL PRIMARY KEY,
    wishlist_item_id INTEGER REFERENCES wishlist_items(id) NOT NULL,
    donor_name VARCHAR NOT NULL,
    donor_email VARCHAR NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    message TEXT,
    status VARCHAR NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_teachers_user_id ON teachers(user_id);
CREATE INDEX idx_wishlists_teacher_id ON wishlists(teacher_id);
CREATE INDEX idx_wishlists_share_token ON wishlists(share_token);
CREATE INDEX idx_wishlist_items_wishlist_id ON wishlist_items(wishlist_id);
CREATE INDEX idx_pledges_wishlist_item_id ON pledges(wishlist_item_id);
CREATE INDEX idx_pledges_donor_email ON pledges(donor_email);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pledges ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Anyone can read public teacher profiles
CREATE POLICY "Anyone can view teacher profiles" ON teachers
    FOR SELECT USING (true);

-- Teachers can update their own profile
CREATE POLICY "Teachers can update own profile" ON teachers
    FOR UPDATE USING (auth.uid() = user_id);

-- Teachers can insert their own profile
CREATE POLICY "Teachers can create own profile" ON teachers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Anyone can read active wishlists
CREATE POLICY "Anyone can view active wishlists" ON wishlists
    FOR SELECT USING (is_active = true);

-- Teachers can manage their own wishlists
CREATE POLICY "Teachers can manage own wishlists" ON wishlists
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM teachers 
            WHERE teachers.id = wishlists.teacher_id 
            AND teachers.user_id = auth.uid()
        )
    );

-- Anyone can read wishlist items from active wishlists
CREATE POLICY "Anyone can view wishlist items" ON wishlist_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM wishlists 
            WHERE wishlists.id = wishlist_items.wishlist_id 
            AND wishlists.is_active = true
        )
    );

-- Teachers can manage their own wishlist items
CREATE POLICY "Teachers can manage own wishlist items" ON wishlist_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM wishlists 
            JOIN teachers ON teachers.id = wishlists.teacher_id
            WHERE wishlists.id = wishlist_items.wishlist_id 
            AND teachers.user_id = auth.uid()
        )
    );

-- Anyone can read pledges (for public viewing)
CREATE POLICY "Anyone can view pledges" ON pledges
    FOR SELECT USING (true);

-- Authenticated users can create pledges
CREATE POLICY "Authenticated users can create pledges" ON pledges
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Donors can view their own pledges
CREATE POLICY "Donors can view own pledges" ON pledges
    FOR SELECT USING (
        donor_email = (
            SELECT email FROM users WHERE id = auth.uid()
        )
    );

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users (id, email, first_name, last_name, profile_image_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        NEW.raw_user_meta_data->>'profile_image_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wishlists_updated_at BEFORE UPDATE ON wishlists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wishlist_items_updated_at BEFORE UPDATE ON wishlist_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pledges_updated_at BEFORE UPDATE ON pledges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();