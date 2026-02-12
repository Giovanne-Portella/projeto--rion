import React, { useState, useEffect } from 'react';
import { configService } from '../../services/api';
import { Play, Pause, PlusCircle, Trash2, Server, BarChart2, CheckSquare, Square } from 'lucide-react';

const BLOCKS_STORAGE_KEY = 'orion_dashboard_blocks';
const STATS_STORAGE_KEY = 'orion_dashboard_stats';

export default function Dashboard() {
  // --- STATE ---
  const [stats, setStats] = useState(() => {
    const savedStats = localStorage.getItem(STATS_STORAGE_KEY);
    return savedStats ? JSON.parse(savedStats) : { messagesSent: 0, connectedBms: 0, activeQueues: 0 };
  });
  const [wabas, setWabas] = useState([]);
  const [lines, setLines] = useState([]);
  const [blocks, setBlocks] = useState(() => {
    const savedBlocks = localStorage.getItem(BLOCKS_STORAGE_KEY);
    return savedBlocks ? JSON.parse(savedBlocks) : [];
  });

  // State for the creation form
  const [newBlock, setNewBlock] = useState({ wabaId: '', lineId: '', templateName: '', status: 'active' });

  // --- DATA FETCHING ---
  useEffect(() => {
    configService.getWABAs()
      .then(wabasData => {
        const validWabas = wabasData || [];
        setWabas(validWabas);
        setStats(prev => ({ ...prev, connectedBms: validWabas.length }));
      })
      .catch(console.error);

    // Listener for stats changes from other tabs (like ImportPage)
    const handleStorageChange = (e) => {
      if (e.key === STATS_STORAGE_KEY) {
        const newStats = e.newValue ? JSON.parse(e.newValue) : { messagesSent: 0 };
        setStats(prev => ({ ...prev, messagesSent: newStats.messagesSent }));
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (newBlock.wabaId) {
      configService.getLines(newBlock.wabaId)
        .then(linesData => setLines(linesData || []))
        .catch(console.error);
    } else {
      setLines([]);
    }
  }, [newBlock.wabaId]);

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem(BLOCKS_STORAGE_KEY, JSON.stringify(blocks));
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  }, [blocks, stats]);

  // --- BLOCK MANAGEMENT ---
  const handleCreateBlock = (e) => {
    e.preventDefault();
    if (!newBlock.wabaId || !newBlock.lineId || !newBlock.templateName) {
      alert("Preencha todos os campos para criar o bloco.");
      return;
    }

    const waba = wabas.find(w => w.id === newBlock.wabaId);
    const line = lines.find(l => l.id === newBlock.lineId);

    const blockToAdd = {
      id: `block-${Date.now()}`,
      waba: { id: waba.id, description: waba.description },
      line: { id: line.id, phone: line.phone },
      templateName: newBlock.templateName,
      status: 'active', // 'active' or 'paused'
    };

    const updatedBlocks = [...blocks, blockToAdd];
    setBlocks(updatedBlocks);
    setStats(prev => ({ ...prev, activeQueues: updatedBlocks.filter(b => b.status === 'active').length }));
    setNewBlock({ wabaId: '', lineId: '', templateName: '', status: 'active' }); // Reset form
  };

  const toggleBlockStatus = (blockId) => {
    const updatedBlocks = blocks.map(block =>
      block.id === blockId
        ? { ...block, status: block.status === 'active' ? 'paused' : 'active' }
        : block
    );
    setBlocks(updatedBlocks);
    setStats(prev => ({ ...prev, activeQueues: updatedBlocks.filter(b => b.status === 'active').length })); // Update stats
  };

  const deleteBlock = (blockId) => {
    if (window.confirm("Tem certeza que deseja remover este bloco?")) {
        const updatedBlocks = blocks.filter(block => block.id !== blockId);
        setBlocks(updatedBlocks);
        setStats(prev => ({ ...prev, activeQueues: updatedBlocks.filter(b => b.status === 'active').length })); // Update stats
    }
  };

  return (
    <div className="space-y-8">
      {/* --- STATS --- */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Mensagens Enviadas" value={stats.messagesSent} icon={<BarChart2 />} />
          <StatCard title="BMs Conectadas" value={stats.connectedBms} icon={<Server />} />
          <StatCard title="Filas Ativas" value={stats.activeQueues} icon={<Play />} />
        </div>
      </section>

      {/* --- BLOCK CREATION --- */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Criar Novo Bloco de Disparo</h2>
        <form onSubmit={handleCreateBlock} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-sm font-bold text-slate-700">BM (WABA)</label>
            <select className="w-full border p-2 rounded bg-white" value={newBlock.wabaId} onChange={e => setNewBlock({ ...newBlock, wabaId: e.target.value, lineId: '' })}>
              <option value="">Selecione a BM...</option>
              {wabas.map(w => <option key={w.id} value={w.id}>{w.description}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700">Linha</label>
            <select className="w-full border p-2 rounded bg-white" value={newBlock.lineId} onChange={e => setNewBlock({ ...newBlock, lineId: e.target.value })} disabled={!newBlock.wabaId}>
              <option value="">Selecione a Linha...</option>
              {lines.map(l => <option key={l.id} value={l.id}>{l.phone}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700">Template</label>
            <input className="w-full border p-2 rounded" value={newBlock.templateName} onChange={e => setNewBlock({ ...newBlock, templateName: e.target.value })} placeholder="Ex: ativacao_v2" />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-bold flex items-center justify-center gap-2 hover:bg-blue-700">
            <PlusCircle size={18} /> Criar Bloco
          </button>
        </form>
      </section>

      {/* --- BLOCKS LIST --- */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Filas e Blocos Ativos</h2>
        <div className="space-y-3">
          {blocks.length === 0 && <p className="text-slate-500 text-center py-4">Nenhum bloco criado ainda.</p>}
          {blocks.map(block => (
            <div key={block.id} className={`p-4 rounded-lg flex items-center justify-between border-l-4 ${block.status === 'active' ? 'bg-green-50 border-green-500' : 'bg-slate-50 border-slate-400'}`}>
              <div>
                <p className="font-bold text-slate-800">{block.templateName}</p>
                <p className="text-sm text-slate-600">{block.waba.description} &rarr; {block.line.phone}</p>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => toggleBlockStatus(block.id)} className={`font-bold text-sm flex items-center gap-2 px-3 py-1 rounded ${block.status === 'active' ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'}`}>
                  {block.status === 'active' ? <><Pause size={14} /> Pausar</> : <><Play size={14} /> Ativar</>}
                </button>
                <button onClick={() => deleteBlock(block.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-5">
    <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);