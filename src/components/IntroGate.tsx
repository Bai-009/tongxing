'use client';

// 每次刷新都弹一次的"为什么这样设计"小弹窗。
// 不持久化——给评委每次进入都看见立场。
// 点遮罩或"知道了"关闭，本次会话内不再弹。
import { useState } from 'react';

export default function IntroGate() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div className="sheet-veil" onClick={() => setOpen(false)}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-grab" />
        <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--ink)' }}>
          为什么这样设计
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.85, color: 'var(--ink-soft)', marginTop: 14 }}>
          游戏化是伪命题——运动场景下，任何积分 / 徽章 / 连续天数都是真游戏的弱化版，
          必输给王者荣耀和短视频。
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.85, color: 'var(--ink-soft)', marginTop: 10 }}>
          解法是<span style={{ color: 'var(--ink)', fontWeight: 500 }}>「团队为最小单位」</span>——
          决策从"我去不去运动"变成"我去不去找队伍"，归属感本能没有摩擦，运动作为副产品自然发生。
        </div>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: 'var(--ink-faint)', marginTop: 14 }}>
          这里不会出现：积分、徽章、排行榜、连续天数。<br />
          取而代之：命名 · 同类队伍 · 日子 · TeamBody pulse · 回望——团队层的集体游戏机制。
        </div>
        <button
          onClick={() => setOpen(false)}
          className="act"
          style={{ marginTop: 22, width: '100%' }}>
          知道了
        </button>
      </div>
    </div>
  );
}
