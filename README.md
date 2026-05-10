# 同行 (Tongxing)

> 一款面向全体大学生的运动激励工具。
> 不打卡、不排行、不竞争。让运动长出关系，让关系反哺运动。

[在线 Demo](#) · [产品文档（PRD）](./PRD.md)

---

## 评委 90 秒导览

如果时间紧，按这个顺序看：

1. **[/](#)** — 首屏。你属于的几支队伍以"团身"浮现，下方是运动名（篮球/晨跑/骑行）。底部"今天 xx 在动"是当下状态
2. **[/teams](#)** — 顶部「视角」一行可切到任一身份。底部「+ 起一个新团队」可建队伍；最末是折叠的 **「为什么不做积分」**——展开看 5 行游戏机制对照表
3. **[/team/t1](#)（南墙 · 篮球）** — 完整团队空间：诱因、动态、同类队伍、命名、日子；自己的团队会看到底部行动条
4. **[/team/t1/end](#)（尽头）** — 翻到团队的开始，看「它」给整段历史的回望段
5. **[/here](#)（校园）** — 公开命名陈列馆，所有团队的命名 + 同类队伍
6. **[/community](#)（社区）** — 全校所有团队的动态流

**想体验空状态**：切到 `闻笛`（u11，无团队）后访问 /teams——会看到为新用户准备的引导和创建入口。

**核心立场**："游戏化"是伪命题，运动场景下任何积分/徽章都是真游戏的弱化版。
解法是**团队为最小单位**——决策从"我去不去运动"变成"我去不去找队伍"，归属感本能没有摩擦。
已有的集体游戏机制：命名（Reward）· 同类队伍（Achievement）· 日子（Collection）· TeamBody pulse（Feedback）· 回望（Progression）。

---

## 它是什么

大学生不运动的本质，不是懒，是**大学生活的默认结构里没有运动的位置**。绝大多数 fitness 产品的解法是给运动加奖励（卡路里、徽章、连续天数）—— 这条路打不过短视频。

同行的解法不是奖励个体，是**把运动嵌进有归属感的团队结构里**。篮球队员不需要"坚持运动的计划"——他属于一支队伍，到场是责任和荣誉。

产品的角色是**守护者**——它不组织、不激励，做三件事：

1. 让一次相聚**容易发生**（动作极轻）
2. 让相聚被**沉淀得可感**（不是数字，是可触摸的什么）
3. 让世界**为这个团队**不断创造再聚的诱因

详细产品观见 [PRD.md](./PRD.md)。

---

## 屏幕

| 屏 | 路径 | 是什么 |
|---|---|---|
| 在场 | `/` | 你属于的几支队伍以"团身"浮现。邻队团身散在画面四角虚化漂浮 |
| 队伍 | `/teams` | 你属于的团队列表 + 附近的邻居团队 + 校园/社区入口 |
| 团队空间 | `/team/:id` | 此刻、诱因、动态、同类队伍、命名、日子；非成员只看公开层，成员看到底部行动条 |
| 尽头 | `/team/:id/end` | 翻到团队的开始 + 它的回望 |
| 校园 | `/here` | 公开命名陈列馆——所有团队的命名与跨队同类队伍（静态沉淀） |
| 社区 | `/community` | 全校所有团队的动态流（流动影响）。成员只能在自己团队里发，但所有人能看 |

---

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Next.js 15（App Router） |
| 数据库 | SQLite（开发）/ Postgres（部署） |
| ORM | Prisma |
| 写入 | Server Actions |
| 部署 | Vercel |
| 语言 | TypeScript |
| 样式 | 原生 CSS（极简、克制，不用 Tailwind） |
| 字体 | 系统字（`-apple-system` · `PingFang SC`）——不引第三方字体，符合"易接触"的底色 |

---

## 本地运行

```bash
# 1. 安装依赖
npm install

# 2. 推送 schema 到本地 SQLite
npm run db:push

# 3. 灌入演示数据
npm run db:seed

# 4. 启动开发服务器
npm run dev
```

开发地址：http://localhost:3000

本地默认用 SQLite（`prisma/dev.db`），零外部依赖。
`.env` 中 `DATABASE_URL="file:./dev.db"`。

### 评委可演示的写入入口

- **/teams 顶部「视角」一行** —— 切换当前用户身份（cookie 实现）。换不同用户去看哪些团队是「我的」、哪些是「附近」、动态/创建按钮是否出现
- **/teams 底部「+ 起一个新团队」** —— 起名 + 运动 + motto，颜色自动分配；当前用户成为创始成员
- **/team/:id 「动态」section 的「+ 发一条」** —— 仅成员可见。三种分类（生活 / 影响 / 随手），写完后同时出现在该团队主页与 /community 全校流
- **/team/:id 底部行动条「今晚 · 这里」/「也到」** —— 仅成员可见。模拟一次相聚发生

---

## 项目结构

```
tongxing/
├── prisma/
│   ├── schema.prisma          # 数据模型
│   ├── seed.ts                # 演示数据（翻译自 src/data/mock.ts）
│   └── dev.db                 # 本地 SQLite（gitignored）
├── src/
│   ├── app/
│   │   ├── layout.tsx         # 根 layout，引入字体 + globals.css
│   │   ├── globals.css        # 全部样式
│   │   ├── page.tsx           # 屏 1 · 在场
│   │   ├── teams/page.tsx     # 屏 2 · 队伍
│   │   ├── team/[id]/
│   │   │   ├── page.tsx       # 屏 3 · 团队空间（Server Component，公开+成员合并）
│   │   │   ├── _TriggerCard.tsx  # 客户端：诱因卡可展开 + 响应
│   │   │   ├── _ActionBar.tsx    # 客户端:底部行动条（仅成员可见）+ 弹窗
│   │   │   └── end/page.tsx   # 屏 4 · 尽头
│   │   ├── here/page.tsx      # 屏 5 · 校园（公开命名陈列馆）
│   │   └── community/page.tsx # 屏 6 · 社区（全校动态流）
│   ├── components/
│   │   └── TeamBody.tsx       # 团身 — 产品的核心视觉单元
│   ├── lib/
│   │   ├── db.ts              # Prisma client（singleton）
│   │   ├── auth.ts            # 当前用户身份（cookie 读取）
│   │   └── queries.ts         # 服务端数据访问层
│   ├── actions/
│   │   ├── auth.ts            # Server Action：切换视角（demo 用）
│   │   ├── moments.ts         # Server Actions：开口 / 也到 / 响应诱因
│   │   ├── teams.ts           # Server Action：起一个新团队
│   │   └── lifeChanges.ts     # Server Action：发一条动态（仅成员）
│   └── data/
│       └── mock.ts            # seed 的源数据
├── PRD.md                     # 产品文档
├── README.md
├── package.json
├── tsconfig.json
├── next.config.mjs
└── .env                       # DATABASE_URL（本地）
```

---

## 核心数据模型

```prisma
User    { id, name }
Team    { id, name, hue, tint, ink, field, founderId, members, bornAt, motto? }
Moment  { id, teamId, present[], at, where?, weather?, note? }
Naming  { id, teamId, title, hint, moments[], bornAt }
CoNaming{ id, teams[2], title, hint, bornAt }
Encounter { id, teams[2], description, at }
Trigger { id, teamId, whisper, reasoning[], bornAt, expireAt, respondedBy[] }
Echo    { id, teamId, body, composedAt, scope }
```

完整 schema 见 [prisma/schema.prisma](./prisma/schema.prisma)。

---

## 部署到 Vercel

本地用 SQLite，部署用 Postgres。两步：

### 1. 切换 schema provider

编辑 `prisma/schema.prisma`：

```diff
 datasource db {
-  provider = "sqlite"
+  provider = "postgresql"
   url      = env("DATABASE_URL")
 }
```

### 2. 在 Vercel 上

```bash
# 推送代码
npm install -g vercel
vercel

# 在 Vercel UI 中
# Storage → Create Database → Postgres
# 它会自动注入 DATABASE_URL 等环境变量
```

`package.json` 的 build 脚本已经包含 `prisma generate && prisma db push`，部署时会自动同步 schema：

```json
"build": "prisma generate && prisma db push && next build"
```

**首次部署后**手动跑一次 seed 灌入演示数据（之后不要每次都跑，否则会重置）：

```bash
vercel env pull .env.local
npm run db:seed
```

或者临时把 build 脚本改成 `... && prisma db seed && next build`，部署一次后再改回去。

### 本地连同一个 Postgres（可选）

```bash
vercel env pull .env.local
# 然后 .env.local 里有 DATABASE_URL 指向 Vercel Postgres
# 用 npm run db:push 推 schema
```

或者**保持本地 SQLite + 部署 Postgres**：用 git 在两个分支分别保存不同的 `schema.prisma`。最简单的做法是部署前手动 sed 一下。

---

## 设计原则（落到代码）

下面这五条是产品观对工程的硬约束：

1. **任何展示都不显示个人参与频次**（grep 不到「次数」「连续 X 天」「参与度」）
2. **任何提醒都不针对个人**
3. **沉睡成员和活跃成员视觉上完全等同**（不区分顺序、不打标签、不灰化）
4. **每格日子只记 `present`，不记 `absent`**——schema 上就没有 `absentIds` 字段
5. **成就 = 历史的命名**（`Naming.title` + `hint`），不是未来的 KPI

---

## 「它」的语言风格

产品里有一个 AI 节点，叫「它」。它没有名字、没有头像、没有人格。
所有由它生成的文案（trigger / naming / echo）必须遵守：

- **只列事实**：日期、地点、人数、距离、天气、出现频次
- **不替别人解释**：不写「还是」「坚持」「走到了」「定下来」
- **句子短**：多用句号，少用连词
- 像档案条目，不像散文

```
❌ "半决赛赢了，从那一刻起，这支队的样子定下来了"
✓ "四月二十七日合练。五月八日，半决赛。两次,五人到齐。"
```

---

## 题目背景

本项目为美团 AI Coding 测评作品。

> 设计一款「游戏化运动激励工具」，通过社交与成就系统提升运动频率。

### 破题

游戏性的本意，是让用户更轻易地进入到某个状态。在运动场景下，要进入的状态就是"动起来"。

**解法是团队。**

把团队当成产品的最小单位——决策不再是"我要不要去运动"，而是"我去不去找队伍"。前者是有摩擦的个人理性决策，每天和短视频/作业/午睡重做一次，必输；后者是归属感本能，决策成本归零。运动作为副产品自然发生。

这就是同行的"游戏化"——不是奖励的游戏，是归属的游戏。

#### 为什么不做积分/徽章/连续天数

如果"游戏化"指的是这套，这条路在运动赛道上是伪命题：积分比不过《王者荣耀》的段位，连续天数比不过短视频下一条，徽章比不过 Steam 的成就。用户在 fitness app 里玩弱化版游戏，是因为他们不能在这里玩真正的游戏——只要"和真游戏比游戏"这个框架成立，运动永远输。

回到游戏性的本意：积分系统不让人更轻易动起来，反而追加了"打卡"的负担。团队这个最小单位才直接降低了进入门槛。

#### 已有机制对照（团队为最小单位下的集体游戏机制）

| 经典游戏元素 | 同行的对应物 |
|---|---|
| Reward | **命名** —— 它给一段日子起名字（不是数字，是叙事） |
| Achievement | **同类队伍** —— 两队相遇生成的共同命名（不是 KPI，是关系事件） |
| Collection | **日子** —— 每次相聚是历史里的一格（不是任务清单，是历史本身） |
| Feedback | **TeamBody pulse** —— 团队是活体（不是奖励通知，是状态显形） |
| Progression | **回望** —— 长期记忆压缩成档案（不是等级条，是叙事弧线） |

详见 [PRD.md](./PRD.md) 的"破题"一节。

---

## License

仅供测评演示用途。
