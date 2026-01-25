import { createClient } from '@supabase/supabase-js';

// Supabase 配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jbwsonsklywmfqsjrpsm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_e094mNLmVqKOZ0BIJvJlDg_xdBTmwNp';

// 创建 Supabase 客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
