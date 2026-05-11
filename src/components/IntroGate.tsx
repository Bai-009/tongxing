'use client';

// 每次刷新都弹一次的设计说明小弹窗。
// 不持久化——给评委每次进入都看见立场。
// 点遮罩或"知道了"关闭，本次会话内不再弹。
import { useState } from 'react';

export default function IntroGate() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div className="sheet-veil" onClick={() => setOpen(false)}>
      <div
        className="sheet"
        onClick={e => e.stopPropagation()}
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className="sheet-grab" />

        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.7 }}>
          一款面向全体大学生的运动激励工具。
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.75, marginTop: 6 }}>
          不靠打卡、不靠排行榜、不靠激励个人——把运动嵌进有归属感的团队结构里。
        </div>

        <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.85, marginTop: 18 }}>
          游戏性的本意，是让用户更轻易地进入到某个状态。在运动这个场景下，要进入的状态就是"动起来"。任何积分 / 徽章 / 连续天数都是真游戏的弱化版，不会让大学生放弃网游和短视频去运动。
        </div>

        <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.85, marginTop: 12 }}>
          解法是<span style={{ color: 'var(--ink)', fontWeight: 500 }}>「团队为最小单位」</span>——决策从"我去不去运动"变成"我去不去找队伍"，归属感本能没有摩擦，运动作为副产品自然发生。
        </div>

        <div style={{
          fontSize: 12.5,
          color: 'var(--ink-soft)',
          lineHeight: 1.9,
          marginTop: 18,
          paddingTop: 14,
          borderTop: '1px solid var(--line-faint)',
        }}>
          这里不会出现：积分、徽章、排行榜、连续天数。<br />
          取而代之：命名 · 同类队伍 · 日子 · TeamBody pulse · 回望——团队层的集体游戏机制。
        </div>

        <div style={{
          fontSize: 12.5,
          color: 'var(--ink-soft)',
          lineHeight: 1.9,
          marginTop: 14,
        }}>
          <span style={{ color: 'var(--ink)', fontWeight: 500 }}>Agent 给理由</span>：产品里的「它」持续观察实时场地、天气、邻队此刻在动、最近一次相聚距今多久——从这些信号里拼出"今晚这里"的诱因，给团队一个再聚的理由。
        </div>
        <div style={{
          fontSize: 12.5,
          color: 'var(--ink-soft)',
          lineHeight: 1.9,
          marginTop: 10,
        }}>
          <span style={{ color: 'var(--ink)', fontWeight: 500 }}>美团生态给条件</span>：理由之外，把物理条件也备好——装备 / 水 / 场地通过外卖柜提前送达。到运动场不是"开始"——开始早就发生在你把球鞋塞进柜子的那一秒，发生在你下单订好场地的那一下。
        </div>
        <div style={{
          fontSize: 12.5,
          color: 'var(--ink)',
          fontWeight: 500,
          lineHeight: 1.85,
          marginTop: 10,
        }}>
          系统性地增加大学生的运动频率，不靠自觉、不靠打卡。
        </div>

        <div style={{ fontSize: 11.5, color: 'var(--ink-faint)', lineHeight: 1.7, marginTop: 14 }}>
          完整BRD见GitHub仓库：
          <a
            href="https://github.com/Bai-009/tongxing"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--ink-soft)', textDecoration: 'underline' }}
          >
            github.com/Bai-009/tongxing
          </a>
        </div>

        <button
          onClick={() => setOpen(false)}
          className="act"
          style={{ marginTop: 22, width: '100%' }}
        >
          知道了
        </button>
      </div>
    </div>
  );
}
