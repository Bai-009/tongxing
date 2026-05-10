'use client';

import { useState, useTransition } from 'react';
import { respondToTrigger } from '@/actions/moments';

interface Props {
  trigger: {
    id: string;
    whisper: string;
    reasoning: string[];
    responses: { user: { id: string; name: string } }[];
  };
  team: { id: string; ink: string };
  currentUserId: string;
}

export default function TriggerCard({ trigger, team, currentUserId }: Props) {
  const [showReason, setShowReason] = useState(false);
  const [isPending, startTransition] = useTransition();
  const responded = trigger.responses.some(r => r.user.id === currentUserId);

  const handle = () => {
    startTransition(async () => {
      await respondToTrigger(trigger.id, team.id);
    });
  };

  return (
    <div className="card" style={{ marginTop: 20 }}>
      <div className="it-mark" style={{ marginBottom: 8 }}>它看见</div>
      <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.4 }}>{trigger.whisper}</div>

      <button onClick={() => setShowReason(s => !s)}
        style={{ fontSize: 12, color: 'var(--ink-faint)', padding: '6px 0', marginTop: 4 }}>
        {showReason ? '收起' : '它怎么想到的 ↓'}
      </button>

      {showReason && (
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px dashed var(--line)' }}>
          {trigger.reasoning.map((r, i) => (
            <div key={i} style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.7, paddingLeft: 12, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: 'var(--ink-faint)' }}>·</span>
              {r}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div className="whisper" style={{ fontSize: 12 }}>
          {trigger.responses.length > 0 ? (
            <>
              <span style={{ color: 'var(--ink)' }}>
                {trigger.responses.map(r => r.user.name).join('、')}
              </span>
              <span style={{ color: 'var(--ink-faint)' }}> 已经在</span>
            </>
          ) : <span style={{ color: 'var(--ink-faint)' }}>等开口的人</span>}
        </div>
        {!responded ? (
          <button className="act" onClick={handle} disabled={isPending}
            style={{ padding: '8px 16px', fontSize: 13, opacity: isPending ? 0.6 : 1 }}>
            也到
          </button>
        ) : (
          <span style={{ fontSize: 12.5, color: 'var(--ink)' }}>在了</span>
        )}
      </div>
    </div>
  );
}
