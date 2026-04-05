import React from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { Deal, Stage } from '../types';
import { DealCard } from './DealCard';

interface Column {
  id: Stage;
  label: string;
  color: string;
  icon: string;
}

const COLUMNS: Column[] = [
  { id: 'new', label: 'Новые лиды', color: 'var(--accent)', icon: '🔵' },
  { id: 'negotiation', label: 'Переговоры', color: 'var(--yellow)', icon: '🟡' },
  { id: 'closed', label: 'Закрыто', color: 'var(--green)', icon: '🟢' },
];

interface Props {
  deals: Deal[];
  onDragEnd: (result: DropResult) => void;
  onDelete: (id: number) => void;
  onAddClick: (stage: Stage) => void;
}

export const KanbanBoard: React.FC<Props> = ({ deals, onDragEnd, onDelete, onAddClick }) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16,
        alignItems: 'start',
      }}>
        {COLUMNS.map(col => {
          const colDeals = deals.filter(d => d.stage === col.id);
          const colTotal = colDeals.reduce((sum, d) => sum + d.value, 0);
          return (
            <div key={col.id} style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
            }}>
              {/* Column header */}
              <div style={{
                padding: '14px 16px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%', background: col.color
                  }} />
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{col.label}</span>
                  <span style={{
                    background: 'var(--surface2)', borderRadius: 20,
                    padding: '2px 8px', fontSize: 12, color: 'var(--muted)',
                  }}>{colDeals.length}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>
                  ₽{colTotal.toLocaleString('ru-RU')}
                </div>
              </div>

              {/* Cards */}
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      padding: '12px 12px 4px',
                      minHeight: 120,
                      background: snapshot.isDraggingOver ? 'rgba(108,99,255,0.04)' : 'transparent',
                      transition: 'background 0.2s',
                    }}
                  >
                    {colDeals.map((deal, index) => (
                      <DealCard key={deal.id} deal={deal} index={index} onDelete={onDelete} />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              {/* Add button */}
              <button
                onClick={() => onAddClick(col.id)}
                style={{
                  width: '100%', padding: '10px 16px',
                  background: 'none', border: 'none',
                  borderTop: '1px solid var(--border)',
                  color: 'var(--muted)', cursor: 'pointer',
                  fontSize: 13, textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontFamily: 'Manrope, sans-serif',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
              >
                <span style={{ fontSize: 16 }}>+</span> Добавить сделку
              </button>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};
