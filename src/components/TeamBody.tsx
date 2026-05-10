// 团身 —— 一团雾化色光 + 内层成员痕迹 + 外层呼吸光晕。
// 没有边、没有数字、没有头像照片。
// pulse 0..1 控制亮度和呼吸幅度。
// 纯展示组件（无 hooks 无 onClick），可在 Server Component 中直接使用。
// 外层用 <Link> 包裹实现导航。

type Team = {
  id: string;
  name: string;
  hue: string;
  tint: string;
  ink: string;
};

const MEMBER_DOT_PALETTE = [
  '#D88A60', '#7FA8C9', '#8FB89B', '#A88BC4',
  '#C9A961', '#7CB8C2', '#9AAD7B', '#C9A47B',
  '#B97A6E', '#6B8FA3',
];

function hashIndex(name: string, mod: number): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return Math.abs(h) % mod;
}

interface Props {
  team: Team;
  size: number;
  pulse: number;
  memberNames: string[];
  pulseSeed?: number;
}

export default function TeamBody({ team, size, pulse, memberNames, pulseSeed = 0 }: Props) {
  const dotCount = Math.min(memberNames.length, 7);
  const dotSize = size * 0.18;

  const positions = memberNames.slice(0, dotCount).map((name, i) => {
    const seed = hashIndex(name + team.id, 1000);
    const angle = (i / dotCount) * Math.PI * 2 + (seed / 1000) * Math.PI * 0.4;
    const radius = size * 0.18 + (seed % 100) / 100 * size * 0.12;
    return {
      left: `calc(50% + ${Math.cos(angle) * radius}px - ${dotSize / 2}px)`,
      top: `calc(50% + ${Math.sin(angle) * radius}px - ${dotSize / 2}px)`,
      color: MEMBER_DOT_PALETTE[hashIndex(name, MEMBER_DOT_PALETTE.length)],
    };
  });

  return (
    <div
      className="team-body"
      style={{
        width: size,
        height: size,
        opacity: 0.4 + pulse * 0.6,
        background: 'transparent',
      }}
    >
      <span
        className="team-body-glow"
        style={{
          background: team.hue,
          opacity: 0.35 + pulse * 0.5,
          animationDuration: `${5 + pulseSeed * 0.8}s`,
        }}
      />
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 30%, ${team.tint} 0%, ${team.hue}cc 50%, ${team.hue}88 100%)`,
        }}
      />
      <span className="team-body-core" />
      <span className="team-body-faces">
        {positions.map((p, i) => (
          <span
            key={i}
            className="face-dot"
            style={{
              width: dotSize,
              height: dotSize,
              left: p.left,
              top: p.top,
              background: p.color,
            }}
          />
        ))}
      </span>
    </div>
  );
}
