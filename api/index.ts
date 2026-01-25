import { supabase } from '../lib/supabase';
import { Memory, Profile } from '../types';

// ============ 记忆相关 API ============

export interface MemoryInput {
  title: string;
  type: 'album' | 'audio' | 'video' | 'story';
  description?: string;
  location?: string;
  cover_image?: string;
  media_url?: string;
  duration?: string;
  tags?: string[];
  family_id: string;
  person_id?: string;
}

// 获取记忆列表
export const getMemories = async (familyId?: string): Promise<Memory[]> => {
  let query = supabase
    .from('memories')
    .select('*')
    .order('created_at', { ascending: false });

  if (familyId) {
    query = query.eq('family_id', familyId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('获取记忆失败:', error);
    return [];
  }

  // 转换字段名称以匹配前端类型
  return (data || []).map((item) => ({
    id: item.id,
    title: item.title,
    type: item.type,
    dateLabel: item.date_label || formatDateLabel(item.created_at),
    description: item.description,
    location: item.location,
    coverImage: item.cover_image,
    mediaUrl: item.media_url,
    duration: item.duration,
    extraCount: item.extra_count,
    tags: item.tags,
    uploadDate: item.upload_date,
  }));
};

// 获取单个记忆详情
export const getMemory = async (id: string): Promise<Memory | null> => {
  const { data, error } = await supabase
    .from('memories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('获取记忆详情失败:', error);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    type: data.type,
    dateLabel: data.date_label || formatDateLabel(data.created_at),
    description: data.description,
    location: data.location,
    coverImage: data.cover_image,
    mediaUrl: data.media_url,
    duration: data.duration,
    extraCount: data.extra_count,
    tags: data.tags,
    uploadDate: data.upload_date,
  };
};

// 创建记忆
export const createMemory = async (memory: MemoryInput): Promise<{ data: Memory | null; error: Error | null }> => {
  const { data: user } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('memories')
    .insert({
      ...memory,
      created_by: user?.user?.id,
    })
    .select()
    .single();

  if (error) {
    return { data: null, error: error as Error };
  }

  return {
    data: {
      id: data.id,
      title: data.title,
      type: data.type,
      dateLabel: formatDateLabel(data.created_at),
      description: data.description,
      location: data.location,
      coverImage: data.cover_image,
      mediaUrl: data.media_url,
      duration: data.duration,
      extraCount: data.extra_count,
      tags: data.tags,
      uploadDate: data.upload_date,
    },
    error: null,
  };
};

// 更新记忆
export const updateMemory = async (id: string, updates: Partial<MemoryInput>): Promise<{ error: Error | null }> => {
  const { error } = await supabase
    .from('memories')
    .update(updates)
    .eq('id', id);

  return { error: error as Error | null };
};

// 删除记忆
export const deleteMemory = async (id: string): Promise<{ error: Error | null }> => {
  const { error } = await supabase.from('memories').delete().eq('id', id);
  return { error: error as Error | null };
};

// ============ 家族相关 API ============

export interface Family {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  created_at: string;
}

export interface FamilyMember {
  id: string;
  family_id: string;
  user_id: string;
  role: string;
  permission: '编辑' | '仅浏览';
  profile?: Profile;
}

// 获取用户的家族列表
export const getFamilies = async (): Promise<Family[]> => {
  const { data, error } = await supabase
    .from('families')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('获取家族列表失败:', error);
    return [];
  }

  return data || [];
};

// 创建家族
export const createFamily = async (name: string, description?: string): Promise<{ data: Family | null; error: Error | null }> => {
  const { data: user } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('families')
    .insert({
      name,
      description,
      owner_id: user?.user?.id,
    })
    .select()
    .single();

  if (error) {
    return { data: null, error: error as Error };
  }

  // 自动添加创建者为家族成员（管理员权限）
  await supabase.from('family_members').insert({
    family_id: data.id,
    user_id: user?.user?.id,
    role: '管理员',
    permission: '编辑',
  });

  return { data, error: null };
};

// 获取家族成员
export const getFamilyMembers = async (familyId: string): Promise<FamilyMember[]> => {
  const { data, error } = await supabase
    .from('family_members')
    .select(`
      *,
      profile:profiles(*)
    `)
    .eq('family_id', familyId);

  if (error) {
    console.error('获取家族成员失败:', error);
    return [];
  }

  return (data || []).map((item) => ({
    id: item.id,
    family_id: item.family_id,
    user_id: item.user_id,
    role: item.role,
    permission: item.permission,
    profile: item.profile,
  }));
};

// ============ 人物档案相关 API ============

export interface PersonProfile {
  id: string;
  family_id: string;
  name: string;
  nickname?: string;
  lifespan?: string;
  role?: string;
  avatar?: string;
  cover?: string;
  bio?: string;
}

// 获取人物档案列表
export const getPersonProfiles = async (familyId: string): Promise<PersonProfile[]> => {
  const { data, error } = await supabase
    .from('person_profiles')
    .select('*')
    .eq('family_id', familyId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('获取人物档案失败:', error);
    return [];
  }

  return data || [];
};

// 获取单个人物档案
export const getPersonProfile = async (id: string): Promise<PersonProfile | null> => {
  const { data, error } = await supabase
    .from('person_profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('获取人物档案失败:', error);
    return null;
  }

  return data;
};

// ============ 工具函数 ============

// 格式化日期标签
function formatDateLabel(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays < 7) return `${diffDays}天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}个月前`;
  return `${Math.floor(diffDays / 365)}年前`;
}
