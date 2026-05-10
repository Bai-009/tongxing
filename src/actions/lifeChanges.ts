'use server';

// 发一条动态。仅团队成员可发，所有人可看（在团队主页 + 社区）。
import { prisma } from '@/lib/db';
import { NOW } from '@/lib/queries';
import { getCurrentUserId } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

const VALID_CATEGORIES = ['change', 'ripple', 'note'] as const;
export type LifeChangeCategory = typeof VALID_CATEGORIES[number];

export async function postLifeChange(
  teamId: string,
  body: string,
  category: LifeChangeCategory,
) {
  const userId = await getCurrentUserId();
  const trimmed = body.trim();
  if (!trimmed) throw new Error('正文不能为空');
  if (!VALID_CATEGORIES.includes(category)) throw new Error('分类不对');

  // 必须是团队成员
  const m = await prisma.teamMember.findUnique({
    where: { teamId_userId: { teamId, userId } },
  });
  if (!m) throw new Error('只能在自己的团队里发');

  const id = `lc_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
  await prisma.lifeChange.create({
    data: {
      id,
      teamId,
      userId,
      body: trimmed,
      category,
      sharedAt: new Date(NOW),
    },
  });

  revalidatePath(`/team/${teamId}`);
  revalidatePath('/community');
  revalidatePath('/');
}
