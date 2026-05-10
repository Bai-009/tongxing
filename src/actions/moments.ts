'use server';

// Server Actions —— 写入操作。
// 直接在客户端组件里调用，不需要 REST/GraphQL 中间层。
//
// 两个动作的语义都指向"这次相聚"，不指向"我"：
// - openMoment      "今晚，这里"  —— 开口发起一次相聚
// - joinMoment      "也到"        —— 加入正在发生的（响应当下诱因 + 直接到场）

import { prisma } from '@/lib/db';
import { NOW } from '@/lib/queries';
import { getCurrentUserId } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

function genId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// 开口 —— 发起一次相聚，自己在场
export async function openMoment(teamId: string, where?: string, note?: string) {
  const userId = await getCurrentUserId();
  await prisma.moment.create({
    data: {
      id: genId('m'),
      teamId,
      at: new Date(NOW),
      where: where || null,
      note: note || null,
      present: { create: [{ userId }] },
    },
  });
  revalidatePath(`/team/${teamId}`);
  revalidatePath(`/team/${teamId}/end`);
  revalidatePath('/teams');
  revalidatePath('/');
}

// 也到 —— 加入这场相聚
export async function joinMoment(teamId: string) {
  const userId = await getCurrentUserId();
  await prisma.moment.create({
    data: {
      id: genId('m'),
      teamId,
      at: new Date(NOW),
      present: { create: [{ userId }] },
    },
  });
  revalidatePath(`/team/${teamId}`);
  revalidatePath(`/team/${teamId}/end`);
  revalidatePath('/teams');
  revalidatePath('/');
}

// 响应诱因（"它"看见的诱因 → 我也到）
export async function respondToTrigger(triggerId: string, teamId: string) {
  const userId = await getCurrentUserId();
  const existing = await prisma.triggerResponse.findUnique({
    where: { triggerId_userId: { triggerId, userId } },
  });
  if (existing) return;

  await prisma.triggerResponse.create({
    data: { triggerId, userId },
  });
  revalidatePath(`/team/${teamId}`);
}
