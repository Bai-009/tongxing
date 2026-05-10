// 首屏：你属于的几支队伍
import Link from 'next/link';
import TeamBody from '@/components/TeamBody';
import {
  getMyTeamsByPulse, getTeamPulse, getTodayPresent,
  getNeighborTeams, getTeamWithMembers,
} from '@/lib/queries';

const POSITIONS = [
  { top: '22%', left: '50%', size: 160 },
  { top: '50%', left: '26%', size: 132 },
  { top: '64%', left: '74%', size: 144 },
];

export default async function Home() {
  const teams = await getMyTeamsByPulse();
  const neighbors = await getNeighborTeams();

  const teamData = await Promise.all(
    teams.map(async t => {
      const [pulse, today, withMembers] = await Promise.all([
        getTeamPulse(t.id),
        getTodayPresent(t.id),
        getTeamWithMembers(t.id),
      ]);
      return {
        team: t,
        pulse,
        members: withMembers!.members.map(m => m.user),
        todayActive: today.length > 0,
      };
    })
  );
  const todayActive = teamData.filter(d => d.todayActive).map(d => d.team);
  const neighborPulses = await Promise.all(
    neighbors.slice(0, 4).map(async n => ({ team: n, pulse: await getTeamPulse(n.id) }))
  );

  return (
    <div className="scene" style={{ padding: 0 }}>
      <div style={{ paddingTop: 60, paddingLeft: 24, paddingRight: 24 }}>
        <h1 style={{
          fontSize: 36,
          fontWeight: 500,
          letterSpacing: 0,
          lineHeight: 1.2,
          color: 'var(--ink)',
          margin: 0,
        }}>
          同行
        </h1>
        <div style={{
          fontSize: 11.5,
          color: 'var(--ink-faint)',
          marginTop: 10,
          letterSpacing: 0.2,
          lineHeight: 1.65,
        }}>
          运动激励工具 · 把运动嵌进归属感的团队结构里
        </div>
      </div>

      <div style={{ position: 'relative', height: 'calc(100vh - 220px)', minHeight: 460 }}>
        {neighborPulses.map((np, i) => {
          const corners = [
            { top: '8%',  left: '8%',  size: 32 },
            { top: '30%', left: '90%', size: 28 },
            { top: '78%', left: '10%', size: 30 },
            { top: '90%', left: '92%', size: 26 },
          ];
          const c = corners[i];
          return (
            <Link
              key={np.team.id}
              href={`/team/${np.team.id}`}
              style={{
                position: 'absolute', top: c.top, left: c.left,
                transform: 'translate(-50%, -50%)',
                width: c.size, height: c.size,
                borderRadius: '50%',
                background: `radial-gradient(circle at 35% 30%, ${np.team.tint} 0%, ${np.team.hue}99 100%)`,
                opacity: 0.35 + np.pulse * 0.2,
              }}
            />
          );
        })}

        {teamData.slice(0, POSITIONS.length).map((d, i) => {
          const pos = POSITIONS[i] ?? POSITIONS[0];
          return (
            <div
              key={d.team.id}
              className="in"
              style={{
                position: 'absolute', top: pos.top, left: pos.left,
                transform: 'translate(-50%, -50%)',
                animationDelay: `${i * 0.1}s`,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                zIndex: 2,
              }}
            >
              <Link href={`/team/${d.team.id}`}>
                <TeamBody team={d.team} size={pos.size} pulse={d.pulse}
                  memberNames={d.members.map(m => m.name)} pulseSeed={i} />
              </Link>
              <div className="team-name">{d.team.name}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 2, letterSpacing: 0.3 }}>
                {d.team.field}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, textAlign: 'center', padding: '0 24px' }}>
        {todayActive.length > 0 && (
          <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
            今天 <span style={{ color: 'var(--ink)' }}>{todayActive.map(t => t.name).join(' · ')}</span> 在动
          </div>
        )}
        <div style={{ marginTop: 12 }}>
          <Link href="/teams" style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
            队伍 →
          </Link>
        </div>
      </div>
    </div>
  );
}
