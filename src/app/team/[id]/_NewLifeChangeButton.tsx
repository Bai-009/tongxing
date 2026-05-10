'use client';

import { useState, useTransition } from 'react';
import { postLifeChange, type LifeChangeCategory } from '@/actions/lifeChanges';

const CATS: { value: LifeChangeCategory; label: string; placeholder: string }[] = [
  { value: 'change', label: '生活', placeholder: '现在我每周都会去操场两三次。' },
  { value: 'ripple', label: '影响', placeholder: '宿舍三个人都买了车。周末一起骑。' },
  { value: 'note',   label: '随手', placeholder: '今天的风很好。' },
];

export default function NewLifeChangeButton({ teamId }: { teamId: string }) {
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<LifeChangeCategory>('change');
  const [isPending, startTransition] = useTransition();

  const canSubmit = body.trim() && !isPending;
  const placeholder = CATS.find(c => c.value === category)!.placeholder;

  return (
    <>
      <button onClick={() => setOpen(true)}
        style={{
          fontSize: 11, color: 'var(--ink-soft)',
          background: 'none',
          border: '1px solid var(--line)',
          padding: '2px 8px',
          borderRadius: 4,
          cursor: 'pointer',
        }}>
        + 发一条
      </button>

      {open && (
        <div className="sheet-veil" onClick={() => setOpen(false)}>
          <div className="sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-grab" />
            <div className="title">发一条</div>
            <div className="whisper" style={{ marginTop: 4 }}>
              因为这支队，最近有什么变化。
            </div>

            <div style={{ marginTop: 16, display: 'flex', gap: 6 }}>
              {CATS.map(c => {
                const active = c.value === category;
                return (
                  <button key={c.value} onClick={() => setCategory(c.value)}
                    style={{
                      padding: '6px 14px', borderRadius: 4,
                      border: '1px solid var(--line)',
                      background: active ? 'var(--ink)' : 'transparent',
                      color: active ? '#fff' : 'var(--ink-soft)',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}>
                    {c.label}
                  </button>
                );
              })}
            </div>

            <textarea
              rows={4}
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder={placeholder}
              maxLength={140}
              style={{
                marginTop: 14, width: '100%',
                border: '1px solid var(--line)', borderRadius: 8,
                padding: 12, fontSize: 14, fontFamily: 'inherit',
                outline: 'none', resize: 'none', background: 'transparent',
                color: 'var(--ink)',
              }}
            />

            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <button className="act act-soft" style={{ flex: 1 }} onClick={() => setOpen(false)}>
                取消
              </button>
              <button className="act" style={{ flex: 1, opacity: canSubmit ? 1 : 0.5 }}
                disabled={!canSubmit}
                onClick={() => startTransition(async () => {
                  await postLifeChange(teamId, body, category);
                  setBody('');
                  setOpen(false);
                })}>
                发出去
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
