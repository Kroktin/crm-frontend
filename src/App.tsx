import React, { useEffect, useState, useRef, useCallback } from 'react';
import { DropResult } from '@hello-pangea/dnd';
import { Deal, Stage, Stats } from './types';
import { api, WS_URL } from './api';
import { MetricCard } from './components/MetricCard';
import { KanbanBoard } from './components/KanbanBoard';
import { AddDealModal } from './components/AddDealModal';

function App() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [, setStats] = useState<Stats | null>(null);
  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [modal, setModal] = useState<{ open: boolean; stage: Stage }>({ open: false, stage: 'new' });
  const wsRef = useRef<WebSocket | null>(null);

  const loadAll = useCallback(async () => {
    const [d, s] = await Promise.all([api.getDeals(), api.getStats()]);
    setDeals(d);
    setStats(s);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  useEffect(() => {
    const connect = () => {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;
      ws.onopen = () => setWsStatus('connected');
      ws.onclose = () => { setWsStatus('disconnected'); setTimeout(connect, 3000); };
      ws.onerror = () => ws.close();
      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.type === 'deal_created') {
          setDeals(prev => [msg.deal, ...prev]);
        } else if (msg.type === 'deal_updated') {
          setDeals(prev => prev.map(d => d.id === msg.deal.id ? msg.deal : d));
        } else if (msg.type === 'deal_deleted') {
          setDeals(prev => prev.filter(d => d.id !== msg.deal_id));
        }
        api.getStats().then(setStats);
      };
    };
    connect();
    return () => wsRef.current?.close();
  }, []);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;
    const dealId = Number(draggableId);
    const newStage = destination.droppableId as Stage;
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, stage: newStage } : d));
    await api.updateDeal(dealId, { stage: newStage });
  };

  const handleDelete = async (id: number) => {
    await api.deleteDeal(id);
  };

  const handleAdd = async (data: { title: string; company: string; value: number; stage: Stage; contact: string }) => {
    await api.createDeal(data);
  };

  const totalNew = deals.filter(d => d.stage === 'new').reduce((s, d) => s + d.value, 0);
  const totalNeg = deals.filter(d => d.stage === 'negotiation').reduce((s, d) => s + d.value, 0);
  const totalClosed = deals.filter(d => d.stage === 'closed').reduce((s, d) => s + d.value, 0);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        padding: '0 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 60,
        background: 'var(--surface)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 800, color: '#fff',
          }}>C</div>
          <span style={{ fontWeight: 800, fontSize: 16 }}>CRM Dashboard</span>
          <span style={{ color: 'var(--muted)', fontSize: 13 }}>/ Сделки</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              background: wsStatus === 'connected' ? 'var(--green)' : wsStatus === 'connecting' ? 'var(--yellow)' : 'var(--red)',
              boxShadow: wsStatus === 'connected' ? '0 0 6px var(--green)' : 'none',
            }} />
            <span style={{ color: 'var(--muted)' }}>
              {wsStatus === 'connected' ? 'Live' : wsStatus === 'connecting' ? 'Подключение...' : 'Офлайн'}
            </span>
          </div>
          <button
            onClick={() => setModal({ open: true, stage: 'new' })}
            style={{
              background: 'var(--accent)', border: 'none', borderRadius: 8,
              color: '#fff', padding: '8px 16px', cursor: 'pointer',
              fontWeight: 700, fontSize: 13, fontFamily: 'Manrope, sans-serif',
            }}>+ Новая сделка</button>
        </div>
      </div>

      <div style={{ padding: '28px 32px', maxWidth: 1400, margin: '0 auto' }}>
        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          <MetricCard icon="📋" label="Всего сделок" value={deals.length} color="var(--accent)" />
          <MetricCard icon="🔵" label="Новые лиды" value={`₽${totalNew.toLocaleString('ru-RU')}`} sub={`${deals.filter(d => d.stage === 'new').length} сделок`} color="var(--accent)" />
          <MetricCard icon="🟡" label="В переговорах" value={`₽${totalNeg.toLocaleString('ru-RU')}`} sub={`${deals.filter(d => d.stage === 'negotiation').length} сделок`} color="var(--yellow)" />
          <MetricCard icon="🟢" label="Закрыто" value={`₽${totalClosed.toLocaleString('ru-RU')}`} sub={`${deals.filter(d => d.stage === 'closed').length} сделок`} color="var(--green)" />
        </div>

        {/* Kanban */}
        <KanbanBoard
          deals={deals}
          onDragEnd={handleDragEnd}
          onDelete={handleDelete}
          onAddClick={(stage) => setModal({ open: true, stage })}
        />
      </div>

      {modal.open && (
        <AddDealModal
          defaultStage={modal.stage}
          onAdd={handleAdd}
          onClose={() => setModal({ open: false, stage: 'new' })}
        />
      )}
    </div>
  );
}

export default App;
