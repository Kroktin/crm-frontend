import React, { useState } from 'react';
import { Stage } from '../types';

interface Props {
  defaultStage: Stage;
  onAdd: (data: { title: string; company: string; value: number; stage: Stage; contact: string }) => void;
  onClose: () => void;
}

export const AddDealModal: React.FC<Props> = ({ defaultStage, onAdd, onClose }) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [value, setValue] = useState('');
  const [contact, setContact] = useState('');
  const [stage, setStage] = useState<Stage>(defaultStage);

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px',
    background: 'var(--bg)', border: '1px solid var(--border)',
    borderRadius: 8, color: 'var(--text)', fontSize: 14,
    outline: 'none', fontFamily: 'Manrope, sans-serif',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12, color: 'var(--muted)', marginBottom: 4, display: 'block',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }} onClick={onClose}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 16, padding: 28, width: 400, maxWidth: '90vw',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 20 }}>Новая сделка</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><label style={labelStyle}>Название *</label>
            <input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="Разработка сайта" /></div>
          <div><label style={labelStyle}>Компания *</label>
            <input style={inputStyle} value={company} onChange={e => setCompany(e.target.value)} placeholder="ООО Пример" /></div>
          <div><label style={labelStyle}>Сумма (₽) *</label>
            <input style={inputStyle} type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="50000" /></div>
          <div><label style={labelStyle}>Контакт</label>
            <input style={inputStyle} value={contact} onChange={e => setContact(e.target.value)} placeholder="Иван Иванов" /></div>
          <div><label style={labelStyle}>Этап</label>
            <select style={inputStyle} value={stage} onChange={e => setStage(e.target.value as Stage)}>
              <option value="new">Новые</option>
              <option value="negotiation">Переговоры</option>
              <option value="closed">Закрыто</option>
            </select></div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '10px', background: 'none', border: '1px solid var(--border)',
            borderRadius: 8, color: 'var(--muted)', cursor: 'pointer', fontFamily: 'Manrope, sans-serif',
          }}>Отмена</button>
          <button
            onClick={() => {
              if (!title || !company || !value) return;
              onAdd({ title, company, value: Number(value), stage, contact });
              onClose();
            }}
            style={{
              flex: 2, padding: '10px', background: 'var(--accent)',
              border: 'none', borderRadius: 8, color: '#fff',
              cursor: 'pointer', fontWeight: 700, fontFamily: 'Manrope, sans-serif',
            }}>Добавить сделку</button>
        </div>
      </div>
    </div>
  );
};
