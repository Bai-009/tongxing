'use client';

import { useState, useTransition } from 'react';
import { createTeam } from '@/actions/teams';

export default function NewTeamSheet() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [field, setField] = useState('');
  const [motto, setMotto] = useState('');
  const [isPending, startTransition] = useTransition();

  const canSubmit = name.trim() && field.trim() && !isPending;

  return (
    <>
      <button onClick={() => setOpen(true)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--ink-soft)', fontSize: 12,
          padding: 4,
        }}>
        + 起一个新团队
      </button>

      {open && (
        <div className="sheet-veil" onClick={() => setOpen(false)}>
          <div className="sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-grab" />
            <div className="title">起一个新团队</div>
            <div className="whisper" style={{ marginTop: 4 }}>
              你会是创始成员。颜色自动分配。
            </div>
            <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input className="field" placeholder="名字（如：南墙、拂晓）"
                value={name} onChange={e => setName(e.target.value)} maxLength={12} />
              <input className="field" placeholder="运动（如：篮球、晨跑、骑行）"
                value={field} onChange={e => setField(e.target.value)} maxLength={12} />
              <input className="field" placeholder="一句话气质（可选）"
                value={motto} onChange={e => setMotto(e.target.value)} maxLength={30} />
            </div>
            <div style={{ marginTop: 24, display: 'flex', gap: 8 }}>
              <button className="act act-soft" style={{ flex: 1 }} onClick={() => setOpen(false)}>
                取消
              </button>
              <button className="act" style={{ flex: 1, opacity: canSubmit ? 1 : 0.5 }}
                disabled={!canSubmit}
                onClick={() => startTransition(async () => {
                  await createTeam(name, field, motto || undefined);
                  // server action redirects to /team/{id}
                })}>
                起这个团队
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
