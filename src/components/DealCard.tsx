import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Deal } from '../types';

interface Props {
  deal: Deal;
  index: number;
  onDelete: (id: number) => void;
}

export const DealCard: React.FC<Props> = ({ deal, index, onDelete }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Draggable draggableId={String(deal.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            background: snapshot.isDragging ? 'var(--surface2)' : 'var(--surface)',
            border: `1px solid ${snapshot.isDragging ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: 10,
            padding: '14px 16px',
            marginBottom: 10,
            cursor: 'grab',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            boxShadow: snapshot.isDragging ? '0 8px 32px rgba(108,99,255,0.25)' : hovered ? '0 2px 12px rgba(0,0,0,0.3)' : 'none',
            position: 'relative',
            ...provided.draggableProps.style,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3, flex: 1 }}>{deal.title}</div>
            {hovered && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(deal.id); }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--red)', fontSize: 16, padding: '0 2px', lineHeight: 1,
                  opacity: 0.7, flexShrink: 0,
                }}
                title="Удалить"
              >✕</button>
            )}
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 6 }}>🏢 {deal.company}</div>
          {deal.contact && (
            <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 2 }}>👤 {deal.contact}</div>
          )}
          <div style={{
            marginTop: 12, fontWeight: 800, fontSize: 15,
            color: 'var(--accent2)',
          }}>
            ₽{deal.value.toLocaleString('ru-RU')}
          </div>
        </div>
      )}
    </Draggable>
  );
};
