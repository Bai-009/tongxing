'use server';

// 起一个新团队。
// 当前用户成为 founder + 第一个成员。颜色从未占用的调色板里挑。
import { prisma } from '@/lib/db';
import { NOW } from '@/lib/queries';
import { getCurrentUserId } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const HUE_PALETTE = [
  { hue: '#E8A87C', tint: '#F5DCC4', ink: '#A66744' }, // 暖橘
  { hue: '#85C7DE', tint: '#D8EEF5', ink: '#3E7E96' }, // 雾蓝
  { hue: '#A8C99C', tint: '#DEEAD6', ink: '#5A7A4F' }, // 鼠尾草绿
  { hue: '#C9A0DC', tint: '#E8D8F2', ink: '#7A5A95' }, // 丁香紫
  { hue: '#F2A6B1', tint: '#FAE0E5', ink: '#9F4F5E' }, // 樱粉
  { hue: '#D4B895', tint: '#EAD9C5', ink: '#856846' }, // 米咖
  { hue: '#9DB5A6', tint: '#D9E5DD', ink: '#4F6957' }, // 茶绿
  { hue: '#E9C46A', tint: '#F5E5B5', ink: '#9B7C29' }, // 黄铜
];

export async function createTeam(name: string, field: string, motto?: string) {
  const userId = await getCurrentUserId();
  const trimmedName = name.trim();
  const trimmedField = field.trim();
  if (!trimmedName) throw new Error('名字不能为空');
  if (!trimmedField) throw new Error('运动不能为空');

  // 优先选未占用的色；都占满了就 modulo
  const teams = await prisma.team.findMany({ select: { hue: true } });
  const used = new Set(teams.map(t => t.hue));
  const palette = HUE_PALETTE.find(p => !used.has(p.hue))
    ?? HUE_PALETTE[teams.length % HUE_PALETTE.length];

  const id = `t_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
  await prisma.team.create({
    data: {
      id,
      name: trimmedName,
      field: trimmedField,
      motto: motto?.trim() || null,
      hue: palette.hue,
      tint: palette.tint,
      ink: palette.ink,
      founderId: userId,
      bornAt: new Date(NOW),
      members: { create: [{ userId }] },
    },
  });

  revalidatePath('/teams');
  revalidatePath('/');
  redirect(`/team/${id}`);
}
