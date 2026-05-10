// 当前用户身份解析。基于 cookie，方便 demo 时切换视角。
// 默认 'u1'（沈砚）—— seed 数据里 u1 是 founder/成员最多的那个。
//
// 真实产品里这里会读 session/JWT；现在只是 cookie 直读。
import 'server-only';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'uid';
const DEFAULT_USER_ID = 'u1';

export async function getCurrentUserId(): Promise<string> {
  const c = await cookies();
  return c.get(COOKIE_NAME)?.value || DEFAULT_USER_ID;
}
