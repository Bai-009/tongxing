'use server';

// 看过须知后，写一个 cookie，下次不再弹。
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function dismissIntro() {
  const c = await cookies();
  c.set('intro_seen', '1', {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: true,
    sameSite: 'lax',
  });
  revalidatePath('/', 'layout');
}
