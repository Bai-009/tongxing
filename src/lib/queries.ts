// 服务端数据访问。
// 所有页面（Server Components）通过这里读数据，不直接动 Prisma。
//
// 注意：本文件是 server-only。不要在客户端组件里 import。

import 'server-only';
import { prisma } from './db';
import { getCurrentUserId } from './auth';

// 演示用：固定的"现在"，让 mock 数据的时间逻辑保持稳定
export const NOW = new Date('2026-05-10T15:00:00');

// ——— Users ———————————————————————————————————————————

export async function getCurrentUser() {
  const id = await getCurrentUserId();
  const u = await prisma.user.findUnique({ where: { id } });
  if (!u) throw new Error('current user not found');
  return u;
}

export async function getUser(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getAllUsers() {
  return prisma.user.findMany({ orderBy: { id: 'asc' } });
}

// ——— Teams ———————————————————————————————————————————

export async function getMyTeams() {
  const id = await getCurrentUserId();
  return prisma.team.findMany({
    where: { members: { some: { userId: id } } },
    orderBy: { bornAt: 'asc' },
  });
}

export async function getTeam(id: string) {
  return prisma.team.findUnique({ where: { id } });
}

export async function getTeamWithMembers(id: string) {
  return prisma.team.findUnique({
    where: { id },
    include: {
      members: { include: { user: true } },
    },
  });
}

export async function isMyTeam(teamId: string) {
  const id = await getCurrentUserId();
  const m = await prisma.teamMember.findUnique({
    where: { teamId_userId: { teamId, userId: id } },
  });
  return !!m;
}

// 团身的"此刻状态" —— 0..1 的连续值，只用于驱动视觉
// 永不渲染为数字
export async function getTeamPulse(teamId: string): Promise<number> {
  const last = await prisma.moment.findFirst({
    where: { teamId },
    orderBy: { at: 'desc' },
    select: { at: true },
  });
  if (!last) return 0.1;
  const hours = (NOW.getTime() - last.at.getTime()) / 3600_000;
  if (hours < 24)       return 1;
  if (hours < 48)       return 0.85;
  if (hours < 24 * 5)   return 0.65;
  if (hours < 24 * 14)  return 0.45;
  if (hours < 24 * 30)  return 0.3;
  return 0.18;
}

export async function getMyTeamsByPulse() {
  const teams = await getMyTeams();
  const withPulse = await Promise.all(
    teams.map(async t => ({ team: t, pulse: await getTeamPulse(t.id) }))
  );
  return withPulse.sort((a, b) => b.pulse - a.pulse).map(x => x.team);
}

// ——— Moments ———————————————————————————————————————————

export async function getTeamMoments(teamId: string) {
  return prisma.moment.findMany({
    where: { teamId },
    orderBy: { at: 'desc' },
    include: {
      present: { include: { user: true } },
    },
  });
}

export async function getTeamMomentsAsc(teamId: string) {
  return prisma.moment.findMany({
    where: { teamId },
    orderBy: { at: 'asc' },
    include: {
      present: { include: { user: true } },
    },
  });
}

// 今天有谁出现 —— 给屏 1 团身的内层用
export async function getTodayPresent(teamId: string) {
  const todayStart = new Date(NOW);
  todayStart.setHours(0, 0, 0, 0);
  const moments = await prisma.moment.findMany({
    where: { teamId, at: { gte: todayStart } },
    include: { present: { include: { user: true } } },
  });
  const seen = new Map<string, { id: string; name: string }>();
  moments.forEach(m =>
    m.present.forEach(p => seen.set(p.user.id, { id: p.user.id, name: p.user.name })),
  );
  return [...seen.values()];
}

// ——— Namings ———————————————————————————————————————————

export async function getTeamNamings(teamId: string) {
  return prisma.naming.findMany({
    where: { teamId },
    orderBy: { bornAt: 'desc' },
    include: { moments: true },
  });
}

export async function getLatestNaming(teamId: string) {
  return prisma.naming.findFirst({
    where: { teamId },
    orderBy: { bornAt: 'desc' },
  });
}

export async function getNamingForMoment(momentId: string) {
  return prisma.naming.findFirst({
    where: { moments: { some: { id: momentId } } },
  });
}

// ——— CoNamings (团队间荣誉) ——————————————————————————————
// 区别于 Naming（单队记忆）：CoNaming 是社会价值事件，由两支团队的接触沉淀
// 没有接触就没有荣誉

export async function getTeamCoNamings(teamId: string) {
  return prisma.coNaming.findMany({
    where: { OR: [{ teamAId: teamId }, { teamBId: teamId }] },
    orderBy: { bornAt: 'desc' },
    include: { teamA: true, teamB: true },
  });
}

// 一个 CoNaming 由几次 Encounter 沉淀出来 —— 荣誉的根源
export async function getEncounterCountBetween(teamAId: string, teamBId: string): Promise<number> {
  return prisma.encounter.count({
    where: {
      OR: [
        { teamAId: teamAId, teamBId: teamBId },
        { teamAId: teamBId, teamBId: teamAId },
      ],
    },
  });
}

// ——— Encounters (团队间共在) ——————————————————————————————

export async function getTeamEncounters(teamId: string) {
  return prisma.encounter.findMany({
    where: { OR: [{ teamAId: teamId }, { teamBId: teamId }] },
    orderBy: { at: 'desc' },
    include: { teamA: true, teamB: true },
  });
}

// 邻队 —— 我不属于但和我有过共在的队伍
export async function getNeighborTeams() {
  const myIds = (await getMyTeams()).map(t => t.id);
  const enc = await prisma.encounter.findMany({
    where: {
      OR: [
        { teamAId: { in: myIds } },
        { teamBId: { in: myIds } },
      ],
    },
    include: { teamA: true, teamB: true },
  });
  const seen = new Map<string, typeof enc[number]['teamA']>();
  enc.forEach(e => {
    if (!myIds.includes(e.teamAId)) seen.set(e.teamAId, e.teamA);
    if (!myIds.includes(e.teamBId)) seen.set(e.teamBId, e.teamB);
  });
  return [...seen.values()];
}

// 此刻在动的邻队 —— 给团队空间顶部用
export async function getActiveNeighborsForTeam(teamId: string) {
  const todayStart = new Date(NOW);
  todayStart.setHours(0, 0, 0, 0);

  // 找出和该队有过共在的所有团队
  const enc = await prisma.encounter.findMany({
    where: { OR: [{ teamAId: teamId }, { teamBId: teamId }] },
    include: { teamA: true, teamB: true },
  });
  const neighborMap = new Map<string, typeof enc[number]['teamA']>();
  enc.forEach(e => {
    if (e.teamAId !== teamId) neighborMap.set(e.teamAId, e.teamA);
    if (e.teamBId !== teamId) neighborMap.set(e.teamBId, e.teamB);
  });

  // 过滤出今天有 moment 的
  const ids = [...neighborMap.keys()];
  const activeIds = await prisma.moment.findMany({
    where: { teamId: { in: ids }, at: { gte: todayStart } },
    select: { teamId: true },
    distinct: ['teamId'],
  });

  return activeIds.map(a => neighborMap.get(a.teamId)).filter((t): t is NonNullable<typeof t> => !!t);
}

// 我的团队这周的擦肩 —— 给屏 1 底部用
export async function getMyEncountersThisWeek() {
  const myIds = (await getMyTeams()).map(t => t.id);
  const oneWeekAgo = new Date(NOW.getTime() - 7 * 24 * 3600_000);
  return prisma.encounter.findMany({
    where: {
      OR: [
        { teamAId: { in: myIds } },
        { teamBId: { in: myIds } },
      ],
      at: { gte: oneWeekAgo },
    },
    orderBy: { at: 'desc' },
    include: { teamA: true, teamB: true },
  });
}

// ——— Trigger ———————————————————————————————————————————

export type TriggerWithReasoning = Omit<Awaited<ReturnType<typeof prisma.trigger.findFirst>>, 'reasoning'> & {
  reasoning: string[];
  responses: { userId: string; user: { id: string; name: string } }[];
};

export async function getActiveTrigger(teamId: string) {
  const t = await prisma.trigger.findFirst({
    where: { teamId, expireAt: { gt: NOW } },
    orderBy: { bornAt: 'desc' },
    include: { responses: { include: { user: true } } },
  });
  if (!t) return null;
  // 反序列化 reasoning JSON
  const reasoning: string[] = JSON.parse(t.reasoning);
  return { ...t, reasoning };
}

// ——— Echo ———————————————————————————————————————————

export async function getTeamEcho(teamId: string, scope: 'wall-end' | 'recent' = 'wall-end') {
  return prisma.echo.findFirst({
    where: { teamId, scope },
    orderBy: { composedAt: 'desc' },
  });
}

// ——— LifeChange (社区) —————————————————————————————————————

export async function getTeamLifeChanges(teamId: string) {
  return prisma.lifeChange.findMany({
    where: { teamId },
    orderBy: { sharedAt: 'desc' },
    include: { user: true },
  });
}

// 给「校园」首页用 —— 这片大学最近的几条生活改变
export async function getRecentLifeChanges(limit = 6) {
  return prisma.lifeChange.findMany({
    orderBy: { sharedAt: 'desc' },
    take: limit,
    include: { user: true, team: true },
  });
}

// 跨团队观察 —— 墙的尽头一段
export async function getCrossObservations(teamId: string) {
  const cos = await getTeamCoNamings(teamId);
  return cos.map(c => ({
    withTeam: c.teamAId === teamId ? c.teamB : c.teamA,
    fact: c.hint,
  }));
}

// ——— Public Memorial (这片) ——————————————————————————————

export type PublicEntry =
  | { kind: 'naming'; naming: Awaited<ReturnType<typeof prisma.naming.findFirst>>; team: NonNullable<Awaited<ReturnType<typeof prisma.team.findFirst>>> }
  | { kind: 'co-naming'; coNaming: Awaited<ReturnType<typeof prisma.coNaming.findFirst>>; teams: [NonNullable<Awaited<ReturnType<typeof prisma.team.findFirst>>>, NonNullable<Awaited<ReturnType<typeof prisma.team.findFirst>>>] };

export async function getPublicMemorial(): Promise<PublicEntry[]> {
  const namings = await prisma.naming.findMany({ include: { team: true } });
  const coNamings = await prisma.coNaming.findMany({ include: { teamA: true, teamB: true } });

  const entries: PublicEntry[] = [];
  namings.forEach(n => {
    if (n.team) entries.push({ kind: 'naming', naming: n, team: n.team });
  });
  coNamings.forEach(c => {
    entries.push({ kind: 'co-naming', coNaming: c, teams: [c.teamA, c.teamB] });
  });

  return entries.sort((a, b) => {
    const ta = a.kind === 'naming' ? a.naming!.bornAt : a.coNaming!.bornAt;
    const tb = b.kind === 'naming' ? b.naming!.bornAt : b.coNaming!.bornAt;
    return tb.getTime() - ta.getTime();
  });
}
