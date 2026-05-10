'use client';

// 首次访问的使用须知。覆盖整个屏幕，必须点"知道了，开始"才能进入。
// 评委只看到 Vercel 链接的话，至少能在这里读到立场和导览。
import { useTransition } from 'react';
import { dismissIntro } from '@/actions/intro';

const SECTION_LABEL: React.CSSProperties = {
  fontSize: 11,
  color: 'var(--ink-faint)',
  letterSpacing: 1.2,
  textTransform: 'uppercase',
  marginBottom: 8,
  marginTop: 28,
};

const MECHANISMS: { name: string; tag: string; desc: string }[] = [
  { name: '命名',           tag: 'Reward',      desc: '它给一段日子起一个名字' },
  { name: '同类队伍',       tag: 'Achievement', desc: '两支队伍相遇生成的共同命名' },
  { name: '日子',           tag: 'Collection',  desc: '每次相聚是历史里的一格' },
  { name: 'TeamBody pulse', tag: 'Feedback',    desc: '团队是有呼吸的活体' },
  { name: '回望',           tag: 'Progression', desc: '长期记忆压缩成档案' },
];

const TOUR: { path: string; label: string; note: string }[] = [
  { path: '/',                label: '在场',     note: '首屏团身浮现，下方显示运动名' },
  { path: '/teams',           label: '队伍',     note: '切视角、起新团队、看附近邻队' },
  { path: '/team/t1',         label: '团队空间', note: '诱因 / 动态 / 同类队伍 / 命名 / 日子' },
  { path: '/team/t1/end',     label: '尽头',     note: '它给整段历史的回望' },
  { path: '/here',            label: '校园',     note: '静态成就对外面' },
  { path: '/community',       label: '社区',     note: '流动影响对外面' },
];

export default function IntroGate() {
  const [isPending, startTransition] = useTransition();

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--bg)',
      zIndex: 1000,
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}>
      <div style={{
        maxWidth: 380,
        margin: '0 auto',
        padding: '64px 24px 96px',
      }}>
        <h1 style={{
          fontSize: 36,
          fontWeight: 500,
          lineHeight: 1.2,
          color: 'var(--ink)',
          margin: 0,
        }}>
          同行
        </h1>
        <div style={{
          fontSize: 11.5,
          color: 'var(--ink-faint)',
          marginTop: 8,
          letterSpacing: 0.2,
          lineHeight: 1.65,
        }}>
          运动激励工具 · 美团 AI Coding 测评作品
        </div>

        {/* 立场 */}
        <div style={SECTION_LABEL}>立场</div>
        <div style={{ fontSize: 13.5, lineHeight: 1.85, color: 'var(--ink-soft)' }}>
          游戏化是伪命题——运动场景下，任何积分/徽章/连续天数都是真游戏的弱化版。
          解法是<span style={{ color: 'var(--ink)', fontWeight: 500 }}>「团队为最小单位」</span>：
          决策从"我去不去运动"变成"我去不去找队伍"，归属感本能没有摩擦，运动作为副产品自然发生。
        </div>

        {/* 5 行机制 */}
        <div style={SECTION_LABEL}>集体游戏机制（团队为最小单位下）</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {MECHANISMS.map(m => (
            <div key={m.name} style={{ display: 'flex', alignItems: 'baseline', gap: 8, fontSize: 12.5, lineHeight: 1.5 }}>
              <span style={{ color: 'var(--ink)', fontWeight: 500, minWidth: 92 }}>
                {m.name}
              </span>
              <span style={{ color: 'var(--ink-faint)', fontSize: 11 }}>← {m.tag}</span>
              <span style={{ color: 'var(--ink-soft)', flex: 1 }}>· {m.desc}</span>
            </div>
          ))}
        </div>

        {/* 导览 */}
        <div style={SECTION_LABEL}>90 秒导览</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {TOUR.map((t, i) => (
            <div key={t.path} style={{ display: 'flex', alignItems: 'baseline', gap: 8, fontSize: 12.5, lineHeight: 1.6 }}>
              <span style={{ color: 'var(--ink-faint)', minWidth: 16 }}>{i + 1}.</span>
              <span style={{ color: 'var(--ink)', fontWeight: 500, minWidth: 70 }}>{t.label}</span>
              <span style={{ color: 'var(--ink-soft)' }}>· {t.note}</span>
            </div>
          ))}
        </div>

        {/* 空状态提示 */}
        <div style={SECTION_LABEL}>体验空状态</div>
        <div style={{ fontSize: 12.5, lineHeight: 1.75, color: 'var(--ink-soft)' }}>
          /teams 顶部「视角」一行，切到 <span style={{ color: 'var(--ink)' }}>闻笛 (u11)</span>——
          一个还没加入任何团队的用户。可以体验"创建团队"和"新团队的空状态引导"。
        </div>

        {/* 源码 */}
        <div style={{
          marginTop: 32,
          paddingTop: 16,
          borderTop: '1px solid var(--line)',
          fontSize: 11.5,
          color: 'var(--ink-faint)',
          lineHeight: 1.7,
        }}>
          源码: <a href="https://github.com/Bai-009/tongxing" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--ink-soft)', textDecoration: 'underline' }}>
            github.com/Bai-009/tongxing
          </a>
          <br />
          完整 PRD 见仓库 PRD.md
        </div>

        <button
          disabled={isPending}
          onClick={() => startTransition(async () => { await dismissIntro(); })}
          style={{
            marginTop: 36,
            width: '100%',
            padding: '14px 18px',
            background: 'var(--ink)',
            color: '#fff',
            borderRadius: 8,
            fontSize: 14.5,
            fontWeight: 500,
            opacity: isPending ? 0.6 : 1,
            cursor: isPending ? 'wait' : 'pointer',
            transition: 'opacity 0.15s',
          }}>
          知道了，开始
        </button>
      </div>
    </div>
  );
}
