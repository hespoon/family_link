
export type Role = '管理员' | '父亲' | '母亲' | '表亲' | '祖父' | '祖母' | '访客';
export type Permission = '编辑' | '仅浏览';

export interface User {
  id: string;
  name: string;
  email?: string;
  role: Role;
  avatar: string;
  isMe?: boolean;
  permission: Permission;
}

export interface Memory {
  id: string;
  title: string;
  type: 'album' | 'audio' | 'video' | 'story';
  dateLabel: string;
  description?: string;
  location?: string;
  coverImage?: string;
  mediaUrl?: string;
  duration?: string;
  extraCount?: number;
  tags?: string[];
  uploadDate?: string;
}

export interface Profile {
  id: string;
  name: string;
  nickname?: string;
  email?: string;
  role?: string;
  avatar?: string;
  permission?: Permission;
  lifespan?: string;
  cover?: string;
  bio?: string;
}

