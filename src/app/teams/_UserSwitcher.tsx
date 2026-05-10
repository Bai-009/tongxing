'use client';

// Demo 视角切换器 —— 评委可以切到不同用户看页面差异。
// 真实产品里没有这个组件。
import { useTransition } from 'react';
import { switchUser } from '@/actions/auth';

interface User { id: string; name: string }

export default function UserSwitcher({ users, currentId }: { users: User[]; currentId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      flexWrap: 'wrap', fontSize: 11,
    }}>
      <span style={{ color: 'var(--ink-faint)' }}>视角</span>
      {users.map(u => {
        const active = u.id === currentId;
        return (
          <button key={u.id}
            onClick={() => startTransition(async () => { await switchUser(u.id); })}
            disabled={isPending || active}
            style={{
              padding: '2px 8px',
              borderRadius: 4,
              border: '1px solid var(--line)',
              background: active ? 'var(--ink)' : 'transparent',
              color: active ? '#fff' : 'var(--ink-soft)',
              fontSize: 11,
              cursor: active ? 'default' : 'pointer',
              opacity: isPending && !active ? 0.4 : 1,
              transition: 'opacity 0.15s',
            }}>
            {u.name}
          </button>
        );
      })}
    </div>
  );
}
