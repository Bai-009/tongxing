'use client';

import { useState, useTransition } from 'react';
import { openMoment, joinMoment } from '@/actions/moments';

interface Props {
  team: { id: string; name: string };
  lastNamingTitle?: string;
}

export default function ActionBar({ team, lastNamingTitle }: Props) {
  const [showOpen, setShowOpen] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  return (
    <>
      <div className="action-bar">
        <div className="action-bar-inner">
          <button className="act" style={{ flex: 1 }} onClick={() => setShowOpen(true)}>
            今晚 · 这里
          </button>
          <button className="act act-soft" style={{ flex: 1 }} onClick={() => setShowJoin(true)}>
            也到
          </button>
        </div>
      </div>

      {showOpen && <OpenSheet team={team} onClose={() => setShowOpen(false)} />}
      {showJoin && <JoinSheet team={team} lastNamingTitle={lastNamingTitle} onClose={() => setShowJoin(false)} />}
    </>
  );
}

function OpenSheet({ team, onClose }: { team: Props['team']; onClose: () => void }) {
  const [where, setWhere] = useState('');
  const [note, setNote] = useState('');
  const [isPending, startTransition] = useTransition();

  return (
    <div className="sheet-veil" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-grab" />
        <div className="title">开个口</div>
        <div className="whisper" style={{ marginTop: 4 }}>
          告诉 {team.name},今晚这里。来不来都行。
        </div>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input className="field" placeholder="在哪" value={where} onChange={e => setWhere(e.target.value)} />
          <input className="field" placeholder="说一句 (可选)" value={note} onChange={e => setNote(e.target.value)} />
        </div>
        <div style={{ marginTop: 24, display: 'flex', gap: 8 }}>
          <button className="act act-soft" style={{ flex: 1 }} onClick={onClose}>取消</button>
          <button className="act" style={{ flex: 1, opacity: isPending ? 0.6 : 1 }}
            disabled={isPending}
            onClick={() => startTransition(async () => {
              await openMoment(team.id, where || undefined, note || undefined);
              onClose();
            })}>
            放出去
          </button>
        </div>
      </div>
    </div>
  );
}

function JoinSheet({ team, lastNamingTitle, onClose }: { team: Props['team']; lastNamingTitle?: string; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  return (
    <div className="sheet-veil" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-grab" />
        <div className="title">这场,到</div>
        <div className="whisper" style={{ marginTop: 4 }}>
          今天 {team.name} 这里又发生了一次。
          {lastNamingTitle && <> 这一段日子,它叫「{lastNamingTitle}」。</>}
        </div>
        <div style={{ marginTop: 24, display: 'flex', gap: 8 }}>
          <button className="act act-soft" style={{ flex: 1 }} onClick={onClose}>取消</button>
          <button className="act" style={{ flex: 1, opacity: isPending ? 0.6 : 1 }}
            disabled={isPending}
            onClick={() => startTransition(async () => {
              await joinMoment(team.id);
              onClose();
            })}>
            也到
          </button>
        </div>
      </div>
    </div>
  );
}
