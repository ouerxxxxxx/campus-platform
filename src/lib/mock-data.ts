// ============================================================
// 本地模拟数据 - 无需Supabase即可运行和演示
// ============================================================

import type {
  Profile, MarketItem, LostFoundItem, ErrandOrder,
  NewsArticle, TreeHolePost, TreeHoleComment, Notification, Message
} from '@/types'

// ---- 模拟用户 ----
export const mockUsers: Profile[] = [
  { id: 'u1', student_id: '2024001', real_name: '张三', email: 'zhangsan@univ.edu.cn', nickname: '小张同学', avatar_url: null, grade: '2024级', major: '计算机科学与技术', dormitory: '北区3号楼512', bio: '热爱生活，喜欢分享', points: 98, verified: true, created_at: '2024-09-01T00:00:00Z', updated_at: '2024-09-01T00:00:00Z' },
  { id: 'u2', student_id: '2024002', real_name: '李四', email: 'lisi@univ.edu.cn', nickname: '小李子', avatar_url: null, grade: '2024级', major: '电子信息工程', dormitory: '南区1号楼208', bio: '数码爱好者', points: 95, verified: true, created_at: '2024-09-01T00:00:00Z', updated_at: '2024-09-01T00:00:00Z' },
  { id: 'u3', student_id: '2023001', real_name: '王五', email: 'wangwu@univ.edu.cn', nickname: '小五哥', avatar_url: null, grade: '2023级', major: '工商管理', dormitory: '东区5号楼315', bio: '跑步达人', points: 100, verified: true, created_at: '2023-09-01T00:00:00Z', updated_at: '2023-09-01T00:00:00Z' },
]

// ---- 模拟二手物品 ----
export const mockMarketItems: MarketItem[] = [
  { id: 'm1', seller_id: 'u1', title: '九成新 iPad Air 5 64G', description: '去年10月购入，几乎没怎么用过，带原装充电器和盒子，屏幕完美无划痕', price: 3200, original_price: 4399, category: '数码', images: [], condition: '几乎全新', status: 'active', location: '图书馆一楼', views: 256, favorites_count: 12, created_at: '2025-06-01T00:00:00Z', updated_at: '2025-06-01T00:00:00Z', seller: mockUsers[0] },
  { id: 'm2', seller_id: 'u2', title: '高等数学第七版（上下册）', description: '上学期用过的教材，有少量笔记，不影响阅读，附赠期末复习资料', price: 25, original_price: 68, category: '书籍', images: [], condition: '良好', status: 'active', location: '南区宿舍', views: 89, favorites_count: 3, created_at: '2025-06-02T00:00:00Z', updated_at: '2025-06-02T00:00:00Z', seller: mockUsers[1] },
  { id: 'm3', seller_id: 'u3', title: '冬季羽绒服 L码 黑色', description: '去年冬天买的，穿了几次，非常保暖，L码适合175-180', price: 150, original_price: 599, category: '衣物', images: [], condition: '良好', status: 'active', location: '东区宿舍', views: 67, favorites_count: 5, created_at: '2025-06-03T00:00:00Z', updated_at: '2025-06-03T00:00:00Z', seller: mockUsers[2] },
  { id: 'm4', seller_id: 'u1', title: '台灯 LED护眼灯 可调光', description: '宿舍必备护眼台灯，三档调光，USB充电，很新', price: 45, original_price: 129, category: '生活用品', images: [], condition: '几乎全新', status: 'active', location: '北区3号楼', views: 134, favorites_count: 8, created_at: '2025-06-04T00:00:00Z', updated_at: '2025-06-04T00:00:00Z', seller: mockUsers[0] },
]

// ---- 模拟失物招领 ----
export const mockLostFoundItems: LostFoundItem[] = [
  { id: 'l1', user_id: 'u1', type: 'found', item_name: '校园卡/一卡通', description: '在图书馆二楼自习室捡到一张校园卡，卡号以2024开头，姓名张*', images: [], location: '图书馆二楼自习室', location_coords: { lat: 30.5, lng: 114.3 }, lost_found_date: '2025-06-08', contact_info: '微信：xiaozhang001', status: 'open', views: 45, created_at: '2025-06-08T00:00:00Z', updated_at: '2025-06-08T00:00:00Z', user: mockUsers[0] },
  { id: 'l2', user_id: 'u2', type: 'lost', item_name: 'AirPods Pro 白色充电盒', description: '6月7日下午在操场跑步时丢失，白色AirPods Pro，充电盒上有贴纸', images: [], location: '操场跑道附近', location_coords: { lat: 30.51, lng: 114.31 }, lost_found_date: '2025-06-07', contact_info: '电话：138xxxx8888', status: 'open', views: 128, created_at: '2025-06-07T00:00:00Z', updated_at: '2025-06-07T00:00:00Z', user: mockUsers[1] },
]

// ---- 模拟跑腿订单 ----
export const mockErrandOrders: ErrandOrder[] = [
  { id: 'e1', publisher_id: 'u1', title: '代取快递 - 中通', description: '中通快递，取件码：1234，在菜鸟驿站，比较大需要帮忙搬一下', category: '代取快递', reward: 5, pickup_location: '菜鸟驿站', pickup_coords: { lat: 30.5, lng: 114.3 }, delivery_location: '北区3号楼', delivery_coords: null, deadline: '2025-06-09T18:00:00Z', status: 'open', runner_id: null, created_at: '2025-06-09T08:00:00Z', updated_at: '2025-06-09T08:00:00Z', completed_at: null, publisher: mockUsers[0] },
  { id: 'e2', publisher_id: 'u2', title: '代买午饭 - 二食堂', description: '帮我带一份二食堂的麻辣香锅，微辣，加米饭，送到南区1号楼', category: '代买饭', reward: 8, pickup_location: '二食堂二楼', pickup_coords: null, delivery_location: '南区1号楼208', delivery_coords: null, deadline: '2025-06-09T12:00:00Z', status: 'accepted', runner_id: 'u3', created_at: '2025-06-09T10:00:00Z', updated_at: '2025-06-09T10:30:00Z', completed_at: null, publisher: mockUsers[1], runner: mockUsers[2] },
]

// ---- 模拟资讯 ----
export const mockNewsArticles: NewsArticle[] = [
  { id: 'n1', title: '关于2025年端午节放假安排的通知', content: '<p>根据国务院办公厅通知精神，现将2025年端午节放假安排通知如下：6月25日（星期三）至6月27日（星期五）放假调休，共3天。6月28日（星期六）、6月29日（星期日）正常上班上课。</p><p>请各单位妥善安排好值班和安全保卫工作，确保师生度过一个平安祥和的节日。</p>', summary: '端午节放假3天，6月25日至27日', cover_image: null, category: '官方公告', source: '校长办公室', author: '校办', is_official: true, is_pinned: true, views: 1523, created_at: '2025-06-01T00:00:00Z', updated_at: '2025-06-01T00:00:00Z' },
  { id: 'n2', title: '校园歌手大赛决赛即将开赛！', content: '<p>🎵 2025校园歌手大赛决赛将于6月15日晚7点在大礼堂举行！</p><p>经过激烈的初赛和复赛，共有12位选手进入决赛。届时将有知名校友担任评委，现场还有抽奖环节！</p>', summary: '6月15日晚7点大礼堂，校园歌手大赛决赛', cover_image: null, category: '校园活动', source: '学生会文艺部', author: null, is_official: false, is_pinned: false, views: 892, created_at: '2025-06-03T00:00:00Z', updated_at: '2025-06-03T00:00:00Z' },
  { id: 'n3', title: '计算机协会2025年秋季招新开始啦', content: '<p>💻 计算机协会面向全校招新！无论你是编程大神还是零基础小白，只要对计算机感兴趣，都欢迎加入我们！</p><p>协会下设：算法组、Web开发组、移动开发组、AI组、设计组。每周有技术分享会和不定期项目实战。</p>', summary: '计算机协会招新，欢迎所有对计算机感兴趣的同学', cover_image: null, category: '社团招新', source: '计算机协会', author: null, is_official: false, is_pinned: false, views: 445, created_at: '2025-06-05T00:00:00Z', updated_at: '2025-06-05T00:00:00Z' },
  { id: 'n4', title: '暑期校园兼职招聘 - 图书馆管理员', content: '<p>📚 图书馆暑期招聘学生管理员若干名，主要负责图书整理、借还书服务和阅览室管理。</p><p>工作时间：7月-8月，每周工作20小时，薪资按学校勤工助学标准发放。</p><p>要求：认真负责，有良好的服务意识，暑期留校学生优先。</p>', summary: '图书馆暑期兼职，每周20小时', cover_image: null, category: '兼职信息', source: '图书馆', author: null, is_official: true, is_pinned: false, views: 678, created_at: '2025-06-06T00:00:00Z', updated_at: '2025-06-06T00:00:00Z' },
]

// ---- 模拟树洞 ----
export const mockTreeHolePosts: TreeHolePost[] = [
  { id: 't1', user_id: 'u1', content: '期末周了，图书馆的位置也太难抢了吧！有没有人知道哪里还有安静的自习的地方？', images: [], tags: ['期末', '自习'], likes_count: 23, comments_count: 5, is_anonymous: true, mood: '求助', created_at: '2025-06-08T00:00:00Z', user: null },
  { id: 't2', user_id: 'u2', content: '今天在食堂吃到了超级好吃的麻辣香锅！强烈推荐二食堂二楼那家！', images: [], tags: ['美食', '食堂'], likes_count: 45, comments_count: 8, is_anonymous: true, mood: '开心', created_at: '2025-06-07T00:00:00Z', user: null },
  { id: 't3', user_id: 'u3', content: '有时候真的觉得大学生活好累啊，课多作业多还要参加各种活动，好想躺平...但又不甘心就这样咸鱼下去', images: [], tags: ['吐槽', '日常'], likes_count: 67, comments_count: 12, is_anonymous: true, mood: '吐槽', created_at: '2025-06-06T00:00:00Z', user: null },
]

// ---- 模拟评论 ----
export const mockTreeHoleComments: TreeHoleComment[] = [
  { id: 'c1', post_id: 't1', user_id: 'u2', content: '教学楼A区三楼的空教室，一般没什么人', is_anonymous: true, created_at: '2025-06-08T01:00:00Z' },
  { id: 'c2', post_id: 't1', user_id: 'u3', content: '学院楼的研究生自习室可以试试，环境很好', is_anonymous: true, created_at: '2025-06-08T02:00:00Z' },
]

// ---- 模拟通知 ----
export const mockNotifications: Notification[] = [
  { id: 'nt1', user_id: 'u1', type: 'system', title: '欢迎加入校园综合服务平台！', content: '请完善您的个人资料，开始体验一站式校园服务', related_id: null, is_read: false, created_at: '2025-06-09T00:00:00Z' },
  { id: 'nt2', user_id: 'u1', type: 'market', title: '您的二手物品有新的浏览', content: '您的iPad Air 5 获得了10次新浏览', related_id: 'm1', is_read: false, created_at: '2025-06-08T00:00:00Z' },
  { id: 'nt3', user_id: 'u1', type: 'message', title: '新私信', content: '同学你好，想了解一下你的iPad...', related_id: null, is_read: true, created_at: '2025-06-07T00:00:00Z' },
]

/** 获取当前登录用户（模拟） */
export function getCurrentUser(): Profile | null {
  // 模拟已登录用户u1
  return mockUsers[0]
}

/** 模拟延迟 */
export function delay(ms = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
