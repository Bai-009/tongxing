// 数据结构反映产品观：
// - 主体单位是团队（Team），不是个人
// - 事件单位是相聚（Moment），不是个人动作
// - 成就单位是命名（Naming）：给历史片段贴温暖标签，不是 KPI
// - 社交单位是共在（Encounter）：团队间的共同空间，不是个人 follow
// - 环境引擎（Trigger）：世界为团队创造再聚的诱因

export interface User {
  id: string;
  name: string;
}

export interface Team {
  id: string;
  name: string;
  // 团队的"气质" —— 不是用来比较的属性，是视觉识别
  hue: string;       // 主色（雾化光的色相）
  tint: string;      // 浅色（用于背景晕染）
  ink: string;       // 深色（用于团队名等少数文字）
  // 团队做的事 —— 隐性的，主要服务环境引擎的推导
  field: string;     // 例 "篮球" "晨跑" "骑行" —— 但产品里几乎不强调这个标签
  founderId: string;
  memberIds: string[];
  bornAt: string;    // 团队的生日（日子的起点）
  motto?: string;    // 一句话气质，可选；不强制（绝不要求用户写）
}

// 一次相聚 —— 不可分割的事件，不归属任何"组织者"
export interface Moment {
  id: string;
  teamId: string;
  presentIds: string[];   // 在场的人。注意：不显示"未到的人"
  at: string;
  where?: string;
  weather?: string;       // 服务于命名引擎（"那天下雨了" → 命名"湿场"）
  note?: string;          // 极少出现，且只在自然语境下；从不要求用户填
}

// 命名 —— 团队成就。是回望，不是前瞻。属于团队，不分个人。
export interface Naming {
  id: string;
  teamId: string;
  title: string;          // 例 "全员之夜" "湿场" "球队的春天"
  hint: string;           // 一句温暖的描述，不带数据
  momentIds: string[];    // 这个命名指向哪几次相聚（视觉上对应的日子会发光）
  bornAt: string;
}

// 共在 —— 团队之间的社交单位。两支队伍曾在同一空间发生过的事。
// 没有胜负，没有"对抗"，只有"我们和他们曾在同一处"。
export interface Encounter {
  id: string;
  teamIds: [string, string];  // 两支团队
  description: string;        // 例 "那天东区球场，两支队都在"
  at: string;
}

// 环境引擎诱因 —— 漂在团队空间里的一句话，不是任务通知
// 由「它」（AI 节点）从团队历史 + 世界状态推导出来
export interface Trigger {
  id: string;
  teamId: string;
  whisper: string;        // 被风吹来的一句话（短，不带任何"还差"语气）
  reasoning: string[];    // 「它」的思考过程——长期记忆 + 当下世界
  bornAt: string;
  expireAt: string;
  respondedByIds: string[];
}

// 「它」的回望 —— AI 节点的长期记忆压缩
// 不是数据报表，是一段温柔的散文式总结。
// 它定期在团队的某段时间末尾、墙的尽头、或重要节点出现。
export interface Echo {
  id: string;
  teamId: string;
  body: string;           // 一段话（多行）—— 是 AI 看着这支团队这段时间写下的
  composedAt: string;
  scope: 'wall-end' | 'recent';  // 在哪里出现
}

export const CURRENT_USER_ID = 'u1';

export const USERS: User[] = [
  { id: 'u1', name: '沈砚' },
  { id: 'u2', name: '林屿' },
  { id: 'u3', name: '宋望' },
  { id: 'u4', name: '江野' },
  { id: 'u5', name: '陆桥' },
  { id: 'u6', name: '温让' },
  { id: 'u7', name: '顾辞' },
  { id: 'u8', name: '叶舟' },
  { id: 'u9', name: '苏迟' },
  { id: 'u10', name: '卫青' },
  { id: 'u11', name: '闻笛' },
  { id: 'u12', name: '傅远' },
];

export const TEAMS: Team[] = [
  {
    id: 't1',
    name: '南墙',
    hue: '#D88A60',
    tint: '#FFE4D2',
    ink: '#A85F3A',
    field: '篮球',
    founderId: 'u1',
    memberIds: ['u1', 'u2', 'u3', 'u4', 'u5'],
    bornAt: '2025-09-15T10:00:00',
    motto: '球场南面那道墙',
  },
  {
    id: 't2',
    name: '拂晓',
    hue: '#7FA8C9',
    tint: '#DDEAF4',
    ink: '#446F94',
    field: '晨跑',
    founderId: 'u2',
    memberIds: ['u1', 'u2', 'u6', 'u9'],
    bornAt: '2025-10-08T06:00:00',
    motto: '六点的湖边',
  },
  {
    id: 't3',
    name: '外环',
    hue: '#8FB89B',
    tint: '#DDEBE0',
    ink: '#4F7A60',
    field: '骑行',
    founderId: 'u4',
    memberIds: ['u4', 'u5', 'u7', 'u8', 'u10'],
    bornAt: '2025-11-02T14:00:00',
    motto: '一直往外骑',
  },
  // 邻居团队 —— 我不属于，但和我有过共在
  {
    id: 't4',
    name: '黑桥',
    hue: '#A88BC4',
    tint: '#E5DAEC',
    ink: '#6E5286',
    field: '篮球',
    founderId: 'u11',
    memberIds: ['u11', 'u12', 'u7', 'u3'],
    bornAt: '2025-09-20T10:00:00',
    motto: '老球场西边那座桥',
  },
  {
    id: 't5',
    name: '六点半',
    hue: '#C9A961',
    tint: '#F2E6C7',
    ink: '#8A6D2A',
    field: '晨跑',
    founderId: 'u8',
    memberIds: ['u8', 'u10', 'u12', 'u11'],
    bornAt: '2025-10-12T06:30:00',
    motto: '比拂晓晚半小时',
  },
  {
    id: 't6',
    name: '南门口',
    hue: '#B97A6E',
    tint: '#F4D7D7',
    ink: '#8A4A40',
    field: '骑行',
    founderId: 'u9',
    memberIds: ['u9', 'u6', 'u3', 'u11'],
    bornAt: '2025-11-15T15:00:00',
    motto: '从南门出发',
  },
];

// 历史相聚 —— 跨度大，让墙能堆出厚度
export const MOMENTS: Moment[] = [
  // 湖大猛虎 —— 从 9 月延续到 5 月，密度逐渐增加
  { id: 'm1',  teamId: 't1', presentIds: ['u1','u2','u3','u4','u5'], at: '2025-09-15T19:00:00', where: '东区球场', note: '第一次凑齐' },
  { id: 'm2',  teamId: 't1', presentIds: ['u1','u3','u4'],            at: '2025-09-22T18:30:00', where: '东区球场' },
  { id: 'm3',  teamId: 't1', presentIds: ['u2','u4','u5'],            at: '2025-10-01T20:00:00', where: '体育馆' },
  { id: 'm4',  teamId: 't1', presentIds: ['u1','u2','u3','u4','u5'], at: '2025-10-15T19:00:00', where: '东区球场', weather: '雨', note: '下了雨还是来了' },
  { id: 'm5',  teamId: 't1', presentIds: ['u1','u3','u5'],            at: '2025-11-05T18:00:00', where: '东区球场' },
  { id: 'm6',  teamId: 't1', presentIds: ['u2','u4','u5'],            at: '2025-12-02T17:30:00', where: '体育馆', weather: '冷' },
  { id: 'm7',  teamId: 't1', presentIds: ['u1','u2','u3','u4','u5'], at: '2026-02-20T19:00:00', where: '东区球场', note: '开学第一场' },
  { id: 'm8',  teamId: 't1', presentIds: ['u1','u2','u4'],            at: '2026-03-10T18:30:00', where: '东区球场' },
  { id: 'm9',  teamId: 't1', presentIds: ['u1','u3','u5'],            at: '2026-04-02T19:00:00', where: '体育馆' },
  { id: 'm10', teamId: 't1', presentIds: ['u1','u2','u3','u4','u5'], at: '2026-04-27T19:00:00', where: '东区球场', note: '院赛前最后一次合练' },
  { id: 'm11', teamId: 't1', presentIds: ['u1','u2','u3','u4','u5'], at: '2026-05-08T18:00:00', where: '东区球场', note: '院赛半决赛，赢了' },
  { id: 'm12', teamId: 't1', presentIds: ['u2','u4','u5'],            at: '2026-05-09T17:00:00', where: '东区球场' },

  // 晨跑搭子
  { id: 'm13', teamId: 't2', presentIds: ['u1','u2','u6'],       at: '2025-10-08T06:30:00', where: '校园环道', note: '第一次约成' },
  { id: 'm14', teamId: 't2', presentIds: ['u2','u6'],            at: '2025-10-15T06:30:00', where: '校园环道' },
  { id: 'm15', teamId: 't2', presentIds: ['u1','u2','u6','u9'], at: '2025-11-01T06:30:00', where: '校园环道', weather: '雾', note: '湖边大雾' },
  { id: 'm16', teamId: 't2', presentIds: ['u1','u2'],            at: '2025-11-20T06:30:00', where: '校园环道' },
  { id: 'm17', teamId: 't2', presentIds: ['u2','u6','u9'],       at: '2026-03-05T06:30:00', where: '南湖路' },
  { id: 'm18', teamId: 't2', presentIds: ['u1','u2','u6','u9'], at: '2026-04-15T06:30:00', where: '校园环道', weather: '晴' },
  { id: 'm19', teamId: 't2', presentIds: ['u2','u9'],            at: '2026-04-28T06:30:00', where: '校园环道' },
  { id: 'm20', teamId: 't2', presentIds: ['u1','u2','u6'],       at: '2026-05-06T06:30:00', where: '南湖路', note: '换了条新的' },
  { id: 'm21', teamId: 't2', presentIds: ['u1','u6'],            at: '2026-05-09T06:30:00', where: '校园环道' },
  { id: 'm21b', teamId: 't2', presentIds: ['u2','u9'],           at: '2026-05-10T06:30:00', where: '校园环道' },

  // 环湖骑行队
  { id: 'm22', teamId: 't3', presentIds: ['u4','u7','u8','u10'],      at: '2025-11-02T14:00:00', where: '东湖绿道', note: '第一次集合' },
  { id: 'm23', teamId: 't3', presentIds: ['u4','u5','u7','u8','u10'], at: '2025-11-22T09:00:00', where: '东湖绿道', note: '第一次环湖 40 公里' },
  { id: 'm24', teamId: 't3', presentIds: ['u4','u5','u8'],             at: '2025-12-15T09:00:00', where: '磨山' },
  { id: 'm25', teamId: 't3', presentIds: ['u4','u7','u10'],            at: '2026-03-08T08:00:00', where: '东湖绿道' },
  { id: 'm26', teamId: 't3', presentIds: ['u4','u5','u7','u8','u10'], at: '2026-04-12T08:00:00', where: '磨山', note: '探了新路线' },
  { id: 'm27', teamId: 't3', presentIds: ['u4','u7'],                  at: '2026-05-04T08:00:00', where: '磨山' },
  { id: 'm28', teamId: 't3', presentIds: ['u4','u5','u7','u8','u10'], at: '2026-05-08T08:00:00', where: '东湖绿道', note: '又一次环湖' },

  // 邻居团队的相聚 —— 让 OtherTeam 页有东西可看
  // 黑桥（篮球）
  { id: 'm29', teamId: 't4', presentIds: ['u11','u12','u7','u3'], at: '2025-09-20T18:00:00', where: '老球场' },
  { id: 'm30', teamId: 't4', presentIds: ['u11','u12','u3'],      at: '2025-11-08T19:00:00', where: '老球场', weather: '冷' },
  { id: 'm31', teamId: 't4', presentIds: ['u11','u12','u7','u3'], at: '2026-04-20T18:30:00', where: '东区球场' },
  { id: 'm32', teamId: 't4', presentIds: ['u11','u7'],            at: '2026-05-09T19:00:00', where: '老球场' },

  // 六点半（晨跑）
  { id: 'm33', teamId: 't5', presentIds: ['u8','u10','u12','u11'], at: '2025-10-12T06:30:00', where: '校园环道' },
  { id: 'm34', teamId: 't5', presentIds: ['u8','u10','u11'],       at: '2026-03-15T06:30:00', where: '南湖路' },
  { id: 'm35', teamId: 't5', presentIds: ['u8','u10'],             at: '2026-05-04T06:30:00', where: '校园环道' },
  { id: 'm36', teamId: 't5', presentIds: ['u8','u10','u12'],       at: '2026-05-09T06:30:00', where: '校园环道' },
  { id: 'm36b', teamId: 't5', presentIds: ['u8','u10'],            at: '2026-05-10T06:30:00', where: '校园环道' },

  // 南门口（骑行）
  { id: 'm37', teamId: 't6', presentIds: ['u9','u6','u3','u11'], at: '2025-11-15T15:00:00', where: '南门 → 东湖' },
  { id: 'm38', teamId: 't6', presentIds: ['u9','u6','u3'],       at: '2025-12-20T14:00:00', where: '南门 → 磨山' },
  { id: 'm39', teamId: 't6', presentIds: ['u9','u11'],           at: '2026-04-25T14:00:00', where: '南门 → 东湖' },
  { id: 'm40', teamId: 't6', presentIds: ['u9','u6','u3','u11'], at: '2026-05-08T14:00:00', where: '南门 → 东湖' },
];

// 命名 —— 团队成就。回望式，不是 KPI。
// 「它」的语言原则：只记事实，不替别人下结论。
// 不要："还是""定下来""走到了""都看见了""不容易"这类带情绪/因果的词
// 要：日期、地点、人数、天气、距离——名词和数字
export const NAMINGS: Naming[] = [
  {
    id: 'n1',
    teamId: 't1',
    title: '湿场',
    hint: '十月十五日，东区，雨。五人到。',
    momentIds: ['m4'],
    bornAt: '2025-10-15T22:00:00',
  },
  {
    id: 'n2',
    teamId: 't1',
    title: '冬场',
    hint: '十二月二日，体育馆。室外零下三度。三人到。',
    momentIds: ['m6'],
    bornAt: '2025-12-02T22:00:00',
  },
  {
    id: 'n3',
    teamId: 't1',
    title: '院赛',
    hint: '四月二十七日合练。五月八日，半决赛。两次,五人到齐。',
    momentIds: ['m10', 'm11'],
    bornAt: '2026-05-08T23:00:00',
  },
  {
    id: 'n4',
    teamId: 't2',
    title: '雾',
    hint: '十一月一日，校园环道，雾。四人到。',
    momentIds: ['m15'],
    bornAt: '2025-11-01T08:00:00',
  },
  {
    id: 'n5',
    teamId: 't2',
    title: '湖边的三月到五月',
    hint: '三月五日起，五月九日止。湖边出现五次。每次至少两人。',
    momentIds: ['m17', 'm18', 'm19', 'm20', 'm21'],
    bornAt: '2026-05-09T00:00:00',
  },
  {
    id: 'n6',
    teamId: 't3',
    title: '第一次环湖',
    hint: '十一月二十二日，东湖绿道，五人，四十公里。',
    momentIds: ['m23'],
    bornAt: '2025-11-22T20:00:00',
  },
  {
    id: 'n7',
    teamId: 't3',
    title: '第二次环湖',
    hint: '五月八日，东湖绿道，五人。',
    momentIds: ['m28'],
    bornAt: '2026-05-08T20:00:00',
  },
  // 邻居团队的命名
  {
    id: 'n8',
    teamId: 't4',
    title: '老球场',
    hint: '九月起到次年五月，出现六次。四个名字。',
    momentIds: ['m29', 'm30', 'm32'],
    bornAt: '2026-05-09T22:00:00',
  },
  {
    id: 'n9',
    teamId: 't5',
    title: '六点三十一',
    hint: '十月起到五月，七次。每次至少两人。',
    momentIds: ['m33', 'm34', 'm35', 'm36'],
    bornAt: '2026-05-09T22:00:00',
  },
  {
    id: 'n10',
    teamId: 't6',
    title: '南门到东湖',
    hint: '十一月起，三次。同一条路。',
    momentIds: ['m37', 'm39', 'm40'],
    bornAt: '2026-05-09T22:00:00',
  },
];

// 联动命名 —— 「它」给两支团队的共同事实贴的标签
// 这是「团队之间」的成就系统。属于两支队伍共享，不分主次。
// 不是赢谁、不是 KPI，是把跨团队的反复的共在压缩成一个名字。
export interface CoNaming {
  id: string;
  teamIds: [string, string];
  title: string;
  hint: string;       // 只列事实
  bornAt: string;
}

export const CO_NAMINGS: CoNaming[] = [
  {
    id: 'cn1',
    teamIds: ['t1', 't4'],
    title: '东区两边',
    hint: '四月起，东区球场两支队都在过。最近一次：四月二十日。',
    bornAt: '2026-05-09T22:00:00',
  },
  {
    id: 'cn2',
    teamIds: ['t2', 't5'],
    title: '清晨的湖',
    hint: '十月起，校园环道清晨。两支队相隔半小时，过过同一片湖。',
    bornAt: '2026-05-09T22:00:00',
  },
  {
    id: 'cn3',
    teamIds: ['t3', 't6'],
    title: '东湖之环',
    hint: '十一月起，东湖绿道。两支队都骑过同一条路。',
    bornAt: '2026-05-09T22:00:00',
  },
];

// 共在 —— 团队之间的事。
// 描述同样克制：只记两边在哪里、什么时候。
export const ENCOUNTERS: Encounter[] = [
  {
    id: 'e1',
    teamIds: ['t1', 't2'],
    description: '四月二十七日傍晚。南墙在东区，拂晓在湖边。同一时段。',
    at: '2026-04-27T18:00:00',
  },
  {
    id: 'e2',
    teamIds: ['t1', 't3'],
    description: '五月八日。南墙半决赛，外环三人在场边。',
    at: '2026-05-08T19:00:00',
  },
  {
    id: 'e3',
    teamIds: ['t2', 't3'],
    description: '五月四日清晨。拂晓在湖西岸，外环在湖东岸。同一片湖。',
    at: '2026-05-04T06:30:00',
  },
  // 我的团队 × 邻居团队
  {
    id: 'e4',
    teamIds: ['t1', 't4'],
    description: '四月二十日。东区球场。南墙在东边场，黑桥在西边场。',
    at: '2026-04-20T18:30:00',
  },
  {
    id: 'e5',
    teamIds: ['t2', 't5'],
    description: '五月四日清晨。拂晓和六点半都在校园环道，相隔半小时。',
    at: '2026-05-04T06:30:00',
  },
  {
    id: 'e6',
    teamIds: ['t3', 't6'],
    description: '五月八日下午。东湖绿道。两支队都在，方向相反。',
    at: '2026-05-08T14:00:00',
  },
];

// 成员动态 —— 团队主页里的「社区」段
// 仅成员可发，所有人可看
export interface LifeChange {
  id: string;
  teamId: string;
  userId: string;
  body: string;
  category: 'change' | 'ripple' | 'note';  // 生活改变 / 涟漪 / 小记录
  sharedAt: string;
}

export const LIFE_CHANGES: LifeChange[] = [
  // 南墙
  { id: 'lc1', teamId: 't1', userId: 'u1', category: 'change',
    body: '从去年九月起，每周至少一场。回宿舍累，睡得反而好。',
    sharedAt: '2026-04-15T22:00:00' },
  { id: 'lc2', teamId: 't1', userId: 'u3', category: 'note',
    body: '今天东区的灯比平时亮。',
    sharedAt: '2026-05-08T20:30:00' },
  { id: 'lc3', teamId: 't1', userId: 'u2', category: 'ripple',
    body: '室友看我每周打，自己也开始去健身房。',
    sharedAt: '2026-03-20T19:00:00' },

  // 拂晓
  { id: 'lc4', teamId: 't2', userId: 'u1', category: 'change',
    body: '六点起床这件事，从硬撑变成了不需要闹钟。',
    sharedAt: '2026-03-10T07:00:00' },
  { id: 'lc5', teamId: 't2', userId: 'u9', category: 'ripple',
    body: '是林屿喊我才开始的。现在我也喊不动的早上会想到他们也都还在。',
    sharedAt: '2026-04-28T07:00:00' },
  { id: 'lc6', teamId: 't2', userId: 'u6', category: 'change',
    body: '体重没怎么变，但腰围小了一圈。',
    sharedAt: '2026-04-30T08:00:00' },
  { id: 'lc7', teamId: 't2', userId: 'u2', category: 'note',
    body: '南湖路那段桂花要开了。',
    sharedAt: '2026-05-06T07:00:00' },

  // 外环
  { id: 'lc8', teamId: 't3', userId: 'u4', category: 'change',
    body: '半年下来，体检报告里之前红的几项都正常了。',
    sharedAt: '2026-04-25T19:00:00' },
  { id: 'lc9', teamId: 't3', userId: 'u7', category: 'ripple',
    body: '因为外环，宿舍三个人都买了车。现在周末我们四个一起骑。',
    sharedAt: '2026-04-13T20:00:00' },
  { id: 'lc10', teamId: 't3', userId: 'u8', category: 'note',
    body: '磨山东边那条路，秋天会更值得。',
    sharedAt: '2026-04-12T18:00:00' },
];

// 「它」—— AI 节点的回望。
// 它在产品里没有名字，是一种持续的存在。
// 它做三件事：看见（trigger）、命名（naming）、回望（echo）。
//
// 语言原则（重要）：
// - 只列事实：日期、地点、人数、距离、天气、出现频次
// - 不替别人解释：不写「坚持」「走到了」「定下来」「不容易」「都看见了」
// - 不替别人有情绪：不写「不容易」「难得」「珍贵」
// - 句子短，多用句号，少用连词
// - 像档案条目，不像散文
export const ECHOES: Echo[] = [
  {
    id: 'ec1',
    teamId: 't1',
    body: `九月十五日起。二百三十八天。
十二次相聚。
出现地点：东区，体育馆。
五个名字。每次至少三人到。
雨一次，零下一次。
最近一次：五月八日，半决赛。`,
    composedAt: '2026-05-09T22:00:00',
    scope: 'wall-end',
  },
  {
    id: 'ec2',
    teamId: 't2',
    body: `十月八日起。二百一十四天。
九次清晨。
出现地点：校园环道，南湖路。
四个名字。每次至少两人到。
雾两次：十一月一日，三月底。
最近一次：五月九日。`,
    composedAt: '2026-05-09T22:00:00',
    scope: 'wall-end',
  },
  {
    id: 'ec3',
    teamId: 't3',
    body: `十一月二日起。一百八十九天。
七次出行。
路线：东湖绿道四次，磨山三次。
五个名字。
环湖两次：十一月二十二日，五月八日。
最近一次：五月八日。`,
    composedAt: '2026-05-09T22:00:00',
    scope: 'wall-end',
  },
];

// 当前的环境诱因
// reasoning 同样只记事实——本团队历史 + 当下世界。
// 「它」的 reasoning 显式展示四层信号：
// 1) 团队历史（距上次相聚多久）
// 2) 当下环境（天气/亮灯/温差）
// 3) 实时场地（空位/开放状态）
// 4) 其他团队此刻动态（邻队是否在动 / 同片区谁占用）
// 这四层叠起来 → 拼出一句"今晚这里"的诱因
export const TRIGGERS: Trigger[] = [
  {
    id: 'tr1',
    teamId: 't1',
    whisper: '东区今晚有灯',
    reasoning: [
      '南墙最近一次东区：四月二十七日。五人到。距今十三天。',
      '今晚天气晴，气温二十二度。东区球场亮灯：十九点至二十一点三十。',
      '实时场地：东区球场今晚两块场地空闲，余量可订。',
      '其他团队此刻：「黑桥」十六点刚结束在东区的相聚。',
    ],
    bornAt: '2026-05-10T14:00:00',
    expireAt: '2026-05-10T22:00:00',
    respondedByIds: ['u2'],
  },
  {
    id: 'tr2',
    teamId: 't2',
    whisper: '湖面明早温差五度',
    reasoning: [
      '拂晓最近一次南湖跑道：五月六日。三人。距今四天。',
      '明日日出：五点四十八。湖面温差预报五度，大概率起雾。',
      '实时场地：南湖跑道明早四点四十五开放。',
      '其他团队此刻：「六点半」明早安排也在湖边。',
    ],
    bornAt: '2026-05-10T20:00:00',
    expireAt: '2026-05-11T08:00:00',
    respondedByIds: [],
  },
  {
    id: 'tr3',
    teamId: 't3',
    whisper: '磨山东侧十五公里未走',
    reasoning: [
      '外环最近一次磨山：四月十二日。骑西半。距今二十八天。',
      '磨山东侧沿湖路段：约十五公里。林荫覆盖率约百分之七十。',
      '本周末天气：晴，二十至二十六度。',
      '实时场地：磨山东侧本周末无大型活动占道。',
    ],
    bornAt: '2026-05-10T10:00:00',
    expireAt: '2026-05-12T18:00:00',
    respondedByIds: ['u4'],
  },
];
