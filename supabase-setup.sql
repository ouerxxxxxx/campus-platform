-- ============================================================
-- 校园综合服务平台 - Supabase 完整数据库初始化脚本
-- 在 Supabase SQL Editor 中执行此文件
-- ============================================================

-- 1. 创建用户资料表
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id VARCHAR(20) UNIQUE NOT NULL,
  real_name VARCHAR(50) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  nickname VARCHAR(50),
  avatar_url TEXT,
  grade VARCHAR(10),
  major VARCHAR(100),
  dormitory VARCHAR(100),
  bio TEXT,
  points INT DEFAULT 100,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 二手物品表
CREATE TABLE market_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category VARCHAR(50) NOT NULL,
  images TEXT[] DEFAULT '{}',
  condition VARCHAR(20) DEFAULT '良好',
  status VARCHAR(20) DEFAULT 'active',
  location VARCHAR(100),
  views INT DEFAULT 0,
  favorites_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 失物招领表
CREATE TABLE lost_found_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(20) NOT NULL,
  item_name VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  location VARCHAR(200) NOT NULL,
  location_coords JSONB,
  lost_found_date DATE NOT NULL,
  contact_info VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'open',
  views INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 跑腿订单表
CREATE TABLE errand_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publisher_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  reward DECIMAL(10,2) NOT NULL,
  pickup_location VARCHAR(200),
  pickup_coords JSONB,
  delivery_location VARCHAR(200),
  delivery_coords JSONB,
  deadline TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'open',
  runner_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 5. 跑腿评价表
CREATE TABLE errand_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES errand_orders(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES profiles(id) NOT NULL,
  reviewee_id UUID REFERENCES profiles(id) NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 资讯公告表
CREATE TABLE news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(300) NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  cover_image TEXT,
  category VARCHAR(50) NOT NULL,
  source VARCHAR(100),
  author VARCHAR(100),
  is_official BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  views INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. 树洞帖子表
CREATE TABLE treehole_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  tags VARCHAR(50)[] DEFAULT '{}',
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  is_anonymous BOOLEAN DEFAULT true,
  mood VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. 树洞评论表
CREATE TABLE treehole_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES treehole_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. 通知表
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(30) NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  related_id UUID,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. 收藏表
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  item_type VARCHAR(30) NOT NULL,
  item_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_type, item_id)
);

-- 11. 私信表
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  related_item_id UUID,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RLS 安全策略
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE lost_found_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE errand_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE errand_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE treehole_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE treehole_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- market_items
CREATE POLICY "market_select" ON market_items FOR SELECT USING (true);
CREATE POLICY "market_insert" ON market_items FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "market_update" ON market_items FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "market_delete" ON market_items FOR DELETE USING (auth.uid() = seller_id);

-- lost_found_items
CREATE POLICY "lf_select" ON lost_found_items FOR SELECT USING (true);
CREATE POLICY "lf_insert" ON lost_found_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "lf_update" ON lost_found_items FOR UPDATE USING (auth.uid() = user_id);

-- errand_orders
CREATE POLICY "errand_select" ON errand_orders FOR SELECT USING (true);
CREATE POLICY "errand_insert" ON errand_orders FOR INSERT WITH CHECK (auth.uid() = publisher_id);
CREATE POLICY "errand_update" ON errand_orders FOR UPDATE USING (auth.uid() = publisher_id OR auth.uid() = runner_id);

-- errand_reviews
CREATE POLICY "review_select" ON errand_reviews FOR SELECT USING (true);
CREATE POLICY "review_insert" ON errand_reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- news_articles
CREATE POLICY "news_select" ON news_articles FOR SELECT USING (true);

-- treehole
CREATE POLICY "th_select" ON treehole_posts FOR SELECT USING (true);
CREATE POLICY "th_insert" ON treehole_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "thc_select" ON treehole_comments FOR SELECT USING (true);
CREATE POLICY "thc_insert" ON treehole_comments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- notifications
CREATE POLICY "notif_select" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notif_update" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- favorites
CREATE POLICY "fav_select" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "fav_insert" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "fav_delete" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- messages
CREATE POLICY "msg_select" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "msg_insert" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- ============================================================
-- 索引优化
-- ============================================================
CREATE INDEX idx_market_category ON market_items(category);
CREATE INDEX idx_market_status ON market_items(status);
CREATE INDEX idx_market_seller ON market_items(seller_id);
CREATE INDEX idx_market_created ON market_items(created_at DESC);

CREATE INDEX idx_lf_type ON lost_found_items(type);
CREATE INDEX idx_lf_status ON lost_found_items(status);

CREATE INDEX idx_errand_status ON errand_orders(status);
CREATE INDEX idx_errand_publisher ON errand_orders(publisher_id);
CREATE INDEX idx_errand_runner ON errand_orders(runner_id);

CREATE INDEX idx_news_category ON news_articles(category);
CREATE INDEX idx_news_pinned ON news_articles(is_pinned);
CREATE INDEX idx_news_created ON news_articles(created_at DESC);

CREATE INDEX idx_treehole_created ON treehole_posts(created_at DESC);

CREATE INDEX idx_notif_user ON notifications(user_id, is_read);

CREATE INDEX idx_fav_user ON favorites(user_id);

CREATE INDEX idx_msg_users ON messages(sender_id, receiver_id);
