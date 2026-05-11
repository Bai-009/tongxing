// 「美团给条件」静态演示条
// 仅团队成员可见，且只在该队有活跃 trigger 时出现——
// 让"理由已经有了 → 物理条件也由美团备好了"在 UI 上可见，不只是文案承诺。
//
// 注：此处是 mock 静态展示，不是真功能。真实接入要打通：
// - 美团柜（球鞋包寄存定时投放）
// - 外卖订单（水/能量补给配送至运动场地）
// - 美团预订（场地档期）

type PrepConfig = {
  when: string;
  items: string[];
};

function getPrepConfig(field: string): PrepConfig {
  if (field.includes('跑')) {
    return {
      when: '明早 · 5:48 日出 · 南湖跑道',
      items: [
        '跑步装备 已放入楼下美团柜 #C03',
        '电解质饮料 4 瓶 下单送达至起点',
        '跑道 自由出入，无需预订',
      ],
    };
  }
  if (field.includes('骑')) {
    return {
      when: '本周末 · 8:00 · 磨山起点',
      items: [
        '头盔 + 手套 已放入楼下美团柜 #A08',
        '矿泉水 + 能量胶 下单送达至起点',
        '骑行路线 已通过美团骑行规划',
      ],
    };
  }
  // 默认：篮球 / 足球 / 球类晚场
  return {
    when: '今晚 · 19:00 · 灯光球场',
    items: [
      '球鞋包 已放入楼下美团柜 #B12',
      '矿泉水 6 瓶 下单送达至场地',
      '场地 已通过美团预订 19:00-21:00',
    ],
  };
}

export default function PrepStrip({ teamField }: { teamField: string }) {
  const cfg = getPrepConfig(teamField);

  return (
    <div className="card-flat" style={{ marginTop: 12, padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
        <span className="it-mark">美团</span>
        <span style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>
          今晚的准备
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--ink-faint)' }}>
          {cfg.when}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.75 }}>
        {cfg.items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ color: 'var(--ink-trace)', fontSize: 11 }}>✓</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
      <div className="whisper" style={{ fontSize: 10.5, color: 'var(--ink-faint)', marginTop: 10, lineHeight: 1.6 }}>
        到场即开始——美团把物理条件备好，活动早已在准备完成的那一刻开始
      </div>
    </div>
  );
}
