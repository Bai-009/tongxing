// 尽头 —— 团队从开始到现在
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getTeam, getTeamMomentsAsc, getUser, getNamingForMoment,
  getTeamEcho, getCrossObservations,
} from '@/lib/queries';

function monthKey(d: Date): string {
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月`;
}

export default async function EndPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const team = await getTeam(id);
  if (!team) notFound();

  const [moments, founder, echo, crossObs] = await Promise.all([
    getTeamMomentsAsc(team.id),
    getUser(team.founderId),
    getTeamEcho(team.id, 'wall-end'),
    getCrossObservations(team.id),
  ]);

  const withNamings = await Promise.all(
    moments.map(async m => ({ moment: m, naming: await getNamingForMoment(m.id) }))
  );

  const byMonth: Record<string, typeof withNamings> = {};
  withNamings.forEach(m => {
    const k = monthKey(m.moment.at);
    (byMonth[k] ||= []).push(m);
  });

  return (
    <div className="scene">
      <div className="scene-header">
        <Link href={`/team/${team.id}`} className="back">{team.name}</Link>
        <div className="title-l" style={{ marginTop: 8 }}>尽头</div>
        <div className="whisper" style={{ marginTop: 6 }}>
          {founder?.name} 起的名字 · {team.bornAt.getFullYear()} 年 {team.bornAt.getMonth() + 1} 月 {team.bornAt.getDate()} 日
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        {Object.entries(byMonth).map(([month, ms]) => (
          <div key={month} style={{ marginBottom: 24 }}>
            <div className="section-title-text" style={{ marginBottom: 10 }}>{month}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 6 }}>
              {ms.map(({ moment: m, naming }) => {
                const span = m.present.length >= 5 ? 2 : 1;
                return (
                  <div key={m.id} className={`brick ${naming ? 'brick-named' : ''}`}
                    style={{ gridColumn: `span ${span}` }}>
                    <div style={{ fontSize: 10.5, color: 'var(--ink-faint)' }}>
                      {m.at.getMonth() + 1}.{m.at.getDate()}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 4, lineHeight: 1.5 }}>
                      {m.present.map(p => p.user.name).join(' · ')}
                    </div>
                    {m.where && (
                      <div style={{ fontSize: 10, color: 'var(--ink-faint)', marginTop: 2 }}>{m.where}</div>
                    )}
                    {naming && (
                      <div style={{ fontSize: 10, color: 'var(--ink)', marginTop: 4, paddingTop: 4, borderTop: '1px dashed var(--line)' }}>
                        「{naming.title}」
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {echo && (
        <>
          <div className="section-title">
            <span className="section-title-text">echo</span>
          </div>
          <div className="echo-card">
            <div className="echo-body">{echo.body}</div>
            <div className="echo-byline">— 它，写于这一段之后</div>
          </div>
        </>
      )}

      {crossObs.length > 0 && (
        <>
          <div className="section-title">
            <span className="section-title-text">它也注意到</span>
          </div>
          <div className="echo-card">
            <div className="echo-body" style={{ fontSize: 13 }}>
              {crossObs.map((o, i) => (
                <div key={i} style={{ marginBottom: i < crossObs.length - 1 ? 10 : 0 }}>
                  <Link href={`/team/${o.withTeam.id}`}
                    style={{ color: 'var(--ink)', fontWeight: 600 }}>
                    {o.withTeam.name}
                  </Link>
                  <span style={{ color: 'var(--ink-faint)', margin: '0 6px' }}>·</span>
                  <span>{o.fact}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
