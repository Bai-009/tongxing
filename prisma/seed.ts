// 演示数据 seed
// 把 src/data/mock.ts 的全部数据翻译进数据库
import { PrismaClient } from '@prisma/client';
import {
  USERS, TEAMS, MOMENTS, NAMINGS, CO_NAMINGS, ENCOUNTERS, TRIGGERS, ECHOES, LIFE_CHANGES,
} from '../src/data/mock';

const prisma = new PrismaClient();

async function main() {
  console.log('清空旧数据...');
  // 按依赖顺序删（被依赖的最后删）
  await prisma.lifeChange.deleteMany();
  await prisma.echo.deleteMany();
  await prisma.triggerResponse.deleteMany();
  await prisma.trigger.deleteMany();
  await prisma.encounter.deleteMany();
  await prisma.coNaming.deleteMany();
  await prisma.momentPresent.deleteMany();
  // Naming 与 Moment 是隐式 m-to-m，删 Naming 会自动清除关系
  await prisma.naming.deleteMany();
  await prisma.moment.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.user.deleteMany();

  console.log('写入用户...');
  await prisma.user.createMany({ data: USERS });

  console.log('写入团队 + 成员关系...');
  for (const t of TEAMS) {
    await prisma.team.create({
      data: {
        id: t.id,
        name: t.name,
        hue: t.hue,
        tint: t.tint,
        ink: t.ink,
        field: t.field,
        founderId: t.founderId,
        bornAt: new Date(t.bornAt),
        motto: t.motto ?? null,
        members: {
          create: t.memberIds.map(uid => ({ userId: uid })),
        },
      },
    });
  }

  console.log('写入相聚 + 在场关系...');
  for (const m of MOMENTS) {
    await prisma.moment.create({
      data: {
        id: m.id,
        teamId: m.teamId,
        at: new Date(m.at),
        where: m.where ?? null,
        weather: m.weather ?? null,
        note: m.note ?? null,
        present: {
          create: m.presentIds.map(uid => ({ userId: uid })),
        },
      },
    });
  }

  console.log('写入命名（关联 moments）...');
  for (const n of NAMINGS) {
    await prisma.naming.create({
      data: {
        id: n.id,
        teamId: n.teamId,
        title: n.title,
        hint: n.hint,
        bornAt: new Date(n.bornAt),
        moments: {
          connect: n.momentIds.map(id => ({ id })),
        },
      },
    });
  }

  console.log('写入联动命名...');
  for (const c of CO_NAMINGS) {
    await prisma.coNaming.create({
      data: {
        id: c.id,
        teamAId: c.teamIds[0],
        teamBId: c.teamIds[1],
        title: c.title,
        hint: c.hint,
        bornAt: new Date(c.bornAt),
      },
    });
  }

  console.log('写入共在...');
  for (const e of ENCOUNTERS) {
    await prisma.encounter.create({
      data: {
        id: e.id,
        teamAId: e.teamIds[0],
        teamBId: e.teamIds[1],
        description: e.description,
        at: new Date(e.at),
      },
    });
  }

  console.log('写入诱因 + 响应关系...');
  for (const tr of TRIGGERS) {
    await prisma.trigger.create({
      data: {
        id: tr.id,
        teamId: tr.teamId,
        whisper: tr.whisper,
        reasoning: JSON.stringify(tr.reasoning),  // 序列化为 JSON
        bornAt: new Date(tr.bornAt),
        expireAt: new Date(tr.expireAt),
        responses: {
          create: tr.respondedByIds.map(uid => ({ userId: uid })),
        },
      },
    });
  }

  console.log('写入回望...');
  await prisma.echo.createMany({
    data: ECHOES.map(e => ({
      id: e.id,
      teamId: e.teamId,
      body: e.body,
      composedAt: new Date(e.composedAt),
      scope: e.scope,
    })),
  });

  console.log('写入成员动态...');
  await prisma.lifeChange.createMany({
    data: LIFE_CHANGES.map(lc => ({
      id: lc.id,
      teamId: lc.teamId,
      userId: lc.userId,
      body: lc.body,
      category: lc.category,
      sharedAt: new Date(lc.sharedAt),
    })),
  });

  console.log('完成');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
