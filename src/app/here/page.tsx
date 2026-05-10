// 校园 —— 公开陈列馆（命名 + 同类队伍）
import Link from 'next/link';
import { getPublicMemorial } from '@/lib/queries';

function monthOf(d: Date): string {
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export default async function HerePage() {
  const entries = await getPublicMemorial();
  const coNamings = entries.filter(e => e.kind === 'co-naming');
  const namings = entries.filter(e => e.kind === 'naming');

  return (
    <div className="scene">
      <div className="scene-header">
        <Link href="/teams" className="back">队伍</Link>
        <div className="title-l" style={{ marginTop: 8 }}>校园</div>
        <div className="whisper" style={{ marginTop: 6 }}>
          这片校园里所有团队被命名过的时光
        </div>
      </div>

      {/* 同类队伍 —— 两队相遇兴起的共同命名 */}
      {coNamings.length > 0 && (
        <>
          <div className="section-title">
            <span className="section-title-text">同类队伍</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {coNamings.map(e => {
              if (e.kind !== 'co-naming') return null;
              const co = e.coNaming!;
              const [t1, t2] = e.teams;
              return (
                <Link key={co.id} href={`/team/${t1.id}`}
                  className="card-flat" style={{ display: 'block' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: t1.hue }} />
                    <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{t1.name}</span>
                    <span style={{ fontSize: 12, color: 'var(--ink-faint)', margin: '0 4px' }}>·</span>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: t2.hue }} />
                    <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{t2.name}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--ink-faint)' }}>
                      {monthOf(co.bornAt)}
                    </span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>「{co.title}」</div>
                  <div className="whisper" style={{ marginTop: 4 }}>{co.hint}</div>
                </Link>
              );
            })}
          </div>
        </>
      )}

      {/* 命名 */}
      {namings.length > 0 && (
        <>
          <div className="section-title">
            <span className="section-title-text">各队的命名</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {namings.map(e => {
              if (e.kind !== 'naming') return null;
              const n = e.naming!;
              const t = e.team;
              return (
                <Link key={n.id} href={`/team/${t.id}`}
                  className="card-flat" style={{ display: 'block' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: t.hue }} />
                    <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{t.name}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--ink-faint)' }}>
                      {monthOf(n.bornAt)}
                    </span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>「{n.title}」</div>
                  <div className="whisper" style={{ marginTop: 4 }}>{n.hint}</div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
