'use server';

// 切换当前用户视角 —— 仅 demo 用。
// 真实产品里没有这个动作；登录 / 登出走 session。
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function switchUser(userId: string) {
  const c = await cookies();
  c.set('uid', userId, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
  revalidatePath('/', 'layout');
}
