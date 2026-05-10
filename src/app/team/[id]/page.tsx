// Team Space —— 团队主页
// 任何人可访问。仅成员看到行动条。
// 公开层：team body + 成员 + 命名 + 动态 + 同类队伍 + 日子
// 仅成员：底部行动条（也到 / 今晚这里）

import Link from 'next/link';
import { notFound } from 'next/navigation';
import TeamBody from '@/components/TeamBody';
import TriggerCard from './_TriggerCard';
import ActionBar from './_ActionBar';
import NewLifeChangeButton from './_NewLifeChangeButton';
import {
  getTeam, getTeamWithMembers, getTeamMoments, getActiveTrigger,
  getTeamNamings, getTeamCoNamings, getTeamLifeChanges,
  getActiveNeighborsForTeam, getTeamPulse, getTodayPresent,
  getNamingForMoment, getCurrentUser, getLatestNaming, isMyTeam, NOW,
} from '@/lib/queries';

function timeText(d: Date): string {
  const days = Math.floor((NOW.getTime() - d.getTime()) / 86400000);
  if (days <= 0) {
    const h = Math.floor((NOW.getTime() - d.getTime()) / 3600000);
    return h <= 0 ? '刚刚' : `${h} 小时前`;
  }
  if (days === 1) return '昨天';
  if (days < 7) return `${days} 天前`;
  return `${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

function shortDate(d: Date): string {
  return `${d.getMonth() + 1}.${d.getDate()}`;
}

const CATEGORY_LABEL: Record<string, string> = {
  change: '生活',
  ripple: '影响',
  note: '随手',
};

export default async function TeamSpacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const team = await getTeam(id);
  if (!team) notFound();

  const isMine = await isMyTeam(team.id);
  const me = await getCurrentUser();

  const [withMembers, moments, trigger, namings, coNamings, lifeChanges,
    activeNeighbors, pulse, todayPresent, latestNaming] = await Promise.all([
    getTeamWithMembers(team.id), getTeamMoments(team.id), getActiveTrigger(team.id),
    getTeamNamings(team.id), getTeamCoNamings(team.id), getTeamLifeChanges(team.id),
    getActiveNeighborsForTeam(team.id), getTeamPulse(team.id),
    getTodayPresent(team.id), getLatestNaming(team.id),
  ]);
  const members = withMembers!.members.map(m => m.user);
  const lastMoment = moments[0];

  const recentMoments = moments.slice(0, 12);
  const bricks = await Promise.all(
    recentMoments.map(async m => ({ moment: m, naming: await getNamingForMoment(m.id) }))
  );

  return (
    <div className="scene" style={{ paddingBottom: isMine ? 100 : 48 }}>
      <div className="scene-header">
        <Link href={isMine ? '/teams' : '/teams'} className="back">
          {isMine ? '队伍' : '附近'}
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 12 }}>
          <TeamBody team={team} size={56} pulse={pulse}
            memberNames={members.map(m => m.name)} />
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
              <div className="title-l" style={{ fontSize: 24 }}>{team.name}</div>
              <span style={{
                fontSize: 11, color: 'var(--ink-faint)',
                padding: '1px 6px', border: '1px solid var(--line)', borderRadius: 3,
              }}>{team.field}</span>
            </div>
            {team.motto && (
              <div className="whisper" style={{ fontSize: 12.5, marginTop: 2 }}>
                {team.motto}
              </div>
            )}
          </div>
        </div>

        {/* 成员名字行 */}
        <div className="names" style={{ marginTop: 16 }}>
          {members.map((m, i) => (
            <span key={m.id}>
              <span style={{ color: m.id === me.id ? 'var(--ink)' : 'var(--ink-soft)' }}>
                {m.name}
              </span>
              {i < members.length - 1 && <span style={{ color: 'var(--ink-trace)', margin: '0 6px' }}>·</span>}
            </span>
          ))}
        </div>

        {/* 此刻 */}
        <div style={{ marginTop: 14 }}>
          {todayPresent.length > 0 ? (
            <div className="whisper">
              <span style={{ color: 'var(--ink)' }}>{todayPresent.map(p => p.name).join('、')}</span>
              <span style={{ color: 'var(--ink-faint)' }}> 今天在动</span>
            </div>
          ) : lastMoment && (
            <div className="whisper" style={{ color: 'var(--ink-faint)' }}>
              上次 {timeText(lastMoment.at)}{lastMoment.where && `,${lastMoment.where}`}
            </div>
          )}
          {activeNeighbors.length > 0 && (
            <div className="whisper" style={{ marginTop: 6, color: 'var(--ink-faint)' }}>
              <span className="it-mark" style={{ marginRight: 6 }}>此刻</span>
              {activeNeighbors.map(n => n.name).join(' · ')} 也在
            </div>
          )}
        </div>
      </div>

      {/* 当下诱因 */}
      {trigger && <TriggerCard trigger={trigger} team={team} currentUserId={me.id} />}

      {/* 新团队空状态引导 —— 给评委 / 真实新建者解释接下来会发生什么 */}
      {isMine && moments.length === 0 && (
        <div className="card-flat" style={{ marginTop: 16, padding: '16px 18px' }}>
          <div style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.8 }}>
            新团队还没有日子。
          </div>
          <div className="whisper" style={{ fontSize: 12, marginTop: 8, lineHeight: 1.9 }}>
            点底部「今晚 · 这里」开第一次相聚——它会变成第一格<span style={{ color: 'var(--ink-soft)' }}>日子</span>。<br />
            日子累到一定程度，<span style={{ color: 'var(--ink-soft)' }}>它</span>会从你们的痕迹里挑出一段，起一个名字（<span style={{ color: 'var(--ink-soft)' }}>命名</span>）。<br />
            和别的队伍多次共在过，会一起获得一个<span style={{ color: 'var(--ink-soft)' }}>同类队伍</span>。
          </div>
        </div>
      )}

      {/* 动态 —— 成员发的（团队主页可见，公开） */}
      {(isMine || lifeChanges.length > 0) && (
        <>
          <div className="section-title">
            <span className="section-title-text">动态</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {!isMine && <span className="it-mark">公开可见</span>}
              {isMine && <NewLifeChangeButton teamId={team.id} />}
            </div>
          </div>
          {lifeChanges.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {lifeChanges.map(lc => (
                <div key={lc.id} className="card-flat">
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{lc.user.name}</span>
                    <span className="it-mark">{CATEGORY_LABEL[lc.category]}</span>
                    <span style={{ fontSize: 11, color: 'var(--ink-faint)', marginLeft: 'auto' }}>
                      {timeText(lc.sharedAt)}
                    </span>
                  </div>
                  <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--ink)' }}>
                    {lc.body}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="whisper" style={{ fontSize: 12, color: 'var(--ink-faint)', padding: '4px 0' }}>
              还没有人发动态。
            </div>
          )}
        </>
      )}

      {/* 同类队伍 —— 两队相遇兴起的共同命名 */}
      {coNamings.length > 0 && (
        <>
          <div className="section-title">
            <span className="section-title-text">同类队伍</span>
            <span className="it-mark">echo</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {coNamings.map(c => {
              const other = c.teamAId === team.id ? c.teamB : c.teamA;
              return (
                <Link key={c.id} href={`/team/${other.id}`}
                  className="card-flat"
                  style={{ display: 'block' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: team.hue }} />
                    <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{team.name}</span>
                    <span style={{ fontSize: 12, color: 'var(--ink-faint)', margin: '0 4px' }}>·</span>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: other.hue }} />
                    <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{other.name}</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>「{c.title}」</div>
                  <div className="whisper" style={{ marginTop: 4 }}>{c.hint}</div>
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
            <span className="section-title-text">命名</span>
            <span className="it-mark">echo</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {namings.map(n => (
              <div key={n.id} className="card-flat">
                <div style={{ fontSize: 14, fontWeight: 600 }}>「{n.title}」</div>
                <div className="whisper" style={{ marginTop: 4 }}>{n.hint}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 日子 */}
      {moments.length > 0 && (
        <>
          <div className="section-title">
            <span className="section-title-text">日子</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 6 }}>
            {bricks.map(({ moment: m, naming }) => {
          const present = m.present.map(p => p.user);
          const span = present.length >= 5 ? 2 : 1;
          return (
            <div key={m.id} className={`brick ${naming ? 'brick-named' : ''}`}
              style={{ gridColumn: `span ${span}` }}>
              <div style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{shortDate(m.at)}</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-soft)', marginTop: 4, lineHeight: 1.5 }}>
                {present.map(p => p.name).join(' · ')}
              </div>
              {m.where && (
                <div style={{ fontSize: 10.5, color: 'var(--ink-faint)', marginTop: 3 }}>{m.where}</div>
              )}
              {naming && (
                <div style={{ fontSize: 10.5, color: 'var(--ink)', marginTop: 6, paddingTop: 6, borderTop: '1px dashed var(--line)' }}>
                  「{naming.title}」
                </div>
              )}
            </div>
          );
        })}
          </div>
        </>
      )}

      {moments.length > 12 && (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link href={`/team/${team.id}/end`} style={{ fontSize: 12, color: 'var(--ink-faint)' }}>
            翻到尽头 →
          </Link>
        </div>
      )}

      {isMine && <ActionBar team={team} lastNamingTitle={latestNaming?.title} />}
    </div>
  );
}
