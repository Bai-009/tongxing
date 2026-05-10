// 社区 —— 所有团队的动态流
// 跨团队公开可见。成员只能在自己团队里发，但所有人能看
import Link from 'next/link';
import { getRecentLifeChanges, NOW } from '@/lib/queries';

function timeText(d: Date): string {
  const days = Math.floor((NOW.getTime() - d.getTime()) / 86400000);
  if (days <= 0) {
    const h = Math.floor((NOW.getTime() - d.getTime()) / 3600000);
    return h <= 0 ? '刚刚' : `${h} 小时前`;
  }
  if (days === 1) return '昨天';
  if (days < 30) return `${days} 天前`;
  return `${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

const CATEGORY_LABEL: Record<string, string> = {
  change: '生活',
  ripple: '影响',
  note: '随手',
};

export default async function CommunityPage() {
  const all = await getRecentLifeChanges(50);

  return (
    <div className="scene">
      <div className="scene-header">
        <Link href="/teams" className="back">队伍</Link>
        <div className="title-l" style={{ marginTop: 8 }}>社区</div>
        <div className="whisper" style={{ marginTop: 6 }}>
          这片校园里所有团队的动态
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
        {all.map(lc => (
          <div key={lc.id} className="card-flat">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 13.5, fontWeight: 600 }}>{lc.user.name}</span>
              <Link href={`/team/${lc.team.id}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: lc.team.hue }} />
                <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{lc.team.name}</span>
              </Link>
              <span className="it-mark" style={{ marginLeft: 4 }}>{CATEGORY_LABEL[lc.category]}</span>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--ink-faint)' }}>
                {timeText(lc.sharedAt)}
              </span>
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.6 }}>
              {lc.body}
            </div>
          </div>
        ))}
      </div>

      {all.length === 0 && (
        <div className="whisper" style={{ textAlign: 'center', marginTop: 48, fontSize: 12.5 }}>
          还没有人发动态
        </div>
      )}
    </div>
  );
}
