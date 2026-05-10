// 数据访问。返回团队/相聚/命名/共在/诱因。
// 注意：所有"活跃度"是给团身的呼吸光晕用的视觉信号——
// 不是排名、不是出勤率，永远不渲染成数字。

import {
  CURRENT_USER_ID, USERS, TEAMS, MOMENTS, NAMINGS, ENCOUNTERS, TRIGGERS, ECHOES, CO_NAMINGS,
  type User, type Team, type Moment, type Naming, type Encounter, type Trigger, type Echo, type CoNaming,
} from './mock';

// 可变副本（demo 内可以"我也来"，但不持久化）
let moments = [...MOMENTS];
let triggers = [...TRIGGERS];

export const NOW = new Date('2026-05-10T15:00:00');

export function getCurrentUser(): User {
  return USERS.find(u => u.id === CURRENT_USER_ID)!;
}

export function getUser(id: string): User | undefined {
  return USERS.find(u => u.id === id);
}

export function getUsers(ids: string[]): User[] {
  return ids.map(id => getUser(id)).filter(Boolean) as User[];
}

export function getMyTeams(): Team[] {
  return TEAMS.filter(t => t.memberIds.includes(CURRENT_USER_ID));
}

export function getTeam(id: string): Team | undefined {
  return TEAMS.find(t => t.id === id);
}

export function getTeamMoments(teamId: string): Moment[] {
  return moments
    .filter(m => m.teamId === teamId)
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
}

export function getTeamMomentsAsc(teamId: string): Moment[] {
  return moments
    .filter(m => m.teamId === teamId)
    .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
}

export function getTeamNamings(teamId: string): Naming[] {
  return NAMINGS
    .filter(n => n.teamId === teamId)
    .sort((a, b) => new Date(b.bornAt).getTime() - new Date(a.bornAt).getTime());
}

export function getTeamEncounters(teamId: string): Encounter[] {
  return ENCOUNTERS
    .filter(e => e.teamIds.includes(teamId))
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
}

export function getOtherTeam(encounter: Encounter, thisTeamId: string): Team | undefined {
  const otherId = encounter.teamIds.find(id => id !== thisTeamId);
  return otherId ? getTeam(otherId) : undefined;
}

export function getActiveTrigger(teamId: string): Trigger | undefined {
  return triggers.find(t =>
    t.teamId === teamId &&
    new Date(t.expireAt) > NOW
  );
}

// 团身的"此刻状态"——只用来驱动视觉，永不显示为数字
// 返回 0..1 的连续值
export function getTeamPulse(teamId: string): number {
  const ms = getTeamMoments(teamId);
  if (ms.length === 0) return 0.1;
  const last = new Date(ms[0].at).getTime();
  const hours = (NOW.getTime() - last) / (1000 * 60 * 60);
  if (hours < 24) return 1;
  if (hours < 48) return 0.85;
  if (hours < 24 * 5) return 0.65;
  if (hours < 24 * 14) return 0.45;
  if (hours < 24 * 30) return 0.3;
  return 0.18;
}

// "今天有谁出现过"——给屏 1 团身的内层用
export function getTodayPresent(teamId: string): User[] {
  const today = new Date(NOW); today.setHours(0, 0, 0, 0);
  const ids = new Set<string>();
  moments.forEach(m => {
    if (m.teamId !== teamId) return;
    if (new Date(m.at) >= today) m.presentIds.forEach(id => ids.add(id));
  });
  return getUsers([...ids]);
}

// 在场（屏 1）—— 我属于的所有团队，按 pulse 排序
export function getMyTeamsByPulse(): Team[] {
  return getMyTeams().sort((a, b) => getTeamPulse(b.id) - getTeamPulse(a.id));
}

// 操作：「我也来」——响应当前诱因
export function respondToTrigger(triggerId: string): void {
  triggers = triggers.map(t =>
    t.id === triggerId && !t.respondedByIds.includes(CURRENT_USER_ID)
      ? { ...t, respondedByIds: [...t.respondedByIds, CURRENT_USER_ID] }
      : t
  );
}

// 操作：「今晚这里」/「也到」—— 加一次相聚
export function addMoment(teamId: string, presentIds: string[], where?: string, note?: string): void {
  const id = 'm_' + Date.now();
  moments = [
    {
      id, teamId, presentIds,
      at: new Date(NOW).toISOString(),
      where, note,
    },
    ...moments,
  ];
}

// 找到 moment 关联的 naming（如果有）—— 被命名过的日子会发光
export function getNamingForMoment(momentId: string): Naming | undefined {
  return NAMINGS.find(n => n.momentIds.includes(momentId));
}

// 「它」的回望
export function getTeamEcho(teamId: string, scope: Echo['scope'] = 'wall-end'): Echo | undefined {
  return ECHOES.find(e => e.teamId === teamId && e.scope === scope);
}

// 团队最近一次命名 —— 给 MyTeams 卡片显示"成就感"
export function getLatestNaming(teamId: string): Naming | undefined {
  return getTeamNamings(teamId)[0];
}

// 「我属于的团队 × 它们最近的擦肩」—— 给屏 1 用
export function getMyEncountersThisWeek(): Encounter[] {
  const myTeams = getMyTeams().map(t => t.id);
  const oneWeekAgo = NOW.getTime() - 7 * 24 * 60 * 60 * 1000;
  return ENCOUNTERS
    .filter(e => e.teamIds.some(id => myTeams.includes(id)))
    .filter(e => new Date(e.at).getTime() >= oneWeekAgo)
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
}

// 「走在同一片的其他队伍」—— 给屏 2 底部用
// 这些是和我擦过肩、但我不属于的队伍
export function getNeighborTeams(): Team[] {
  const myTeamIds = new Set(getMyTeams().map(t => t.id));
  const neighborIds = new Set<string>();
  ENCOUNTERS.forEach(e => {
    if (e.teamIds.some(id => myTeamIds.has(id))) {
      e.teamIds.forEach(id => {
        if (!myTeamIds.has(id)) neighborIds.add(id);
      });
    }
  });
  return [...neighborIds].map(id => getTeam(id)).filter(Boolean) as Team[];
}

// 联动命名 —— 团队间成就
// 给定一支团队，返回它参与的所有 CoNaming
export function getTeamCoNamings(teamId: string): CoNaming[] {
  return CO_NAMINGS.filter(c => c.teamIds.includes(teamId))
    .sort((a, b) => new Date(b.bornAt).getTime() - new Date(a.bornAt).getTime());
}

export function getCoNamingOtherTeam(co: CoNaming, thisTeamId: string): Team | undefined {
  const otherId = co.teamIds.find(id => id !== thisTeamId);
  return otherId ? getTeam(otherId) : undefined;
}

// 「此刻在动的邻居团队」—— 团队空间顶部的此刻感
// 「邻居」= 和当前团队有过共在的其他团队
export function getActiveNeighborsForTeam(teamId: string): Team[] {
  const today = new Date(NOW); today.setHours(0, 0, 0, 0);
  const neighborIds = new Set<string>();
  ENCOUNTERS.forEach(e => {
    if (e.teamIds.includes(teamId)) {
      e.teamIds.forEach(id => { if (id !== teamId) neighborIds.add(id); });
    }
  });
  return [...neighborIds]
    .map(id => getTeam(id))
    .filter((t): t is Team => !!t)
    .filter(t => moments.some(m => m.teamId === t.id && new Date(m.at) >= today));
}

// 「同一片大学里所有的队伍」—— 给屏 1 远景用
// 我的 + 邻居 + 邻居的邻居（如果有）
export function getAllNearbyTeams(): Team[] {
  const myTeamIds = getMyTeams().map(t => t.id);
  const neighborIds = getNeighborTeams().map(t => t.id);
  const allIds = new Set([...myTeamIds, ...neighborIds]);
  return [...allIds].map(id => getTeam(id)).filter((t): t is Team => !!t);
}

// 「它」的跨团队观察 —— 在墙的尽头一段
// 基于 CoNaming + Encounter 自动推导（这里 mock）
export function getCrossObservations(teamId: string): Array<{
  withTeam: Team;
  fact: string;
}> {
  const obs: Array<{ withTeam: Team; fact: string }> = [];
  CO_NAMINGS.filter(c => c.teamIds.includes(teamId)).forEach(c => {
    const other = getCoNamingOtherTeam(c, teamId);
    if (other) obs.push({ withTeam: other, fact: c.hint });
  });
  return obs;
}

// 「这片」公开命名展厅。
// 所有团队的所有命名（包括联动命名）的统一视图，按时间倒序。
// 这是产品里成就系统的"对外面"——任何人都能翻这一片大学的被命名过的时光。
export type PublicEntry =
  | { kind: 'naming'; naming: Naming; team: Team }
  | { kind: 'co-naming'; coNaming: CoNaming; teams: [Team, Team] };

export function getPublicMemorial(): PublicEntry[] {
  const entries: PublicEntry[] = [];

  NAMINGS.forEach(n => {
    const t = getTeam(n.teamId);
    if (t) entries.push({ kind: 'naming', naming: n, team: t });
  });

  CO_NAMINGS.forEach(c => {
    const t1 = getTeam(c.teamIds[0]);
    const t2 = getTeam(c.teamIds[1]);
    if (t1 && t2) entries.push({ kind: 'co-naming', coNaming: c, teams: [t1, t2] });
  });

  return entries.sort((a, b) => {
    const ta = a.kind === 'naming' ? a.naming.bornAt : a.coNaming.bornAt;
    const tb = b.kind === 'naming' ? b.naming.bornAt : b.coNaming.bornAt;
    return new Date(tb).getTime() - new Date(ta).getTime();
  });
}

// 哪些团队是"我"的（用来在这片页判断点击该跳哪个路由）
export function isMyTeam(teamId: string): boolean {
  return getMyTeams().some(t => t.id === teamId);
}
