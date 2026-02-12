import React, { useState, useEffect } from 'react';
import { configService, mailingService } from '../../services/api';
import { Play, Pause, PlusCircle, Trash2, Server, BarChart2, Layers, Settings, X, Zap, ChevronRight, FileText, Smartphone, Tag, Search } from 'lucide-react';

const QUEUES_STORAGE_KEY = 'orion_dashboard_queues';
const STATS_STORAGE_KEY = 'orion_dashboard_stats';

// --- COMPONENTE PRINCIPAL ---
export default function Dashboard() {
  const [stats, setStats] = useState(() => {
    const savedStats = localStorage.getItem(STATS_STORAGE_KEY);
    return savedStats ? JSON.parse(savedStats) : { messagesSent: 0, connectedBms: 0, activeQueues: 0 };
  });
  const [queues, setQueues] = useState(() => {
    const savedQueues = localStorage.getItem(QUEUES_STORAGE_KEY);
    return savedQueues ? JSON.parse(savedQueues) : [];
  });
  const [segments, setSegments] = useState([]);
  const [isAddBlockModalOpen, setAddBlockModalOpen] = useState(false);
  const [queueToAddTo, setQueueToAddTo] = useState(null);

  // --- EFEITOS E CICLO DE VIDA ---
  useEffect(() => {
    mailingService.getSegments().then(data => setSegments(Array.isArray(data) ? data : [])).catch(console.error);

    const handleStorageChange = (e) => {
      if (e.key === STATS_STORAGE_KEY) {
        const newStats = e.newValue ? JSON.parse(e.newValue) : { messagesSent: 0 };
        setStats(prev => ({ ...prev, messagesSent: newStats.messagesSent }));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    localStorage.setItem(QUEUES_STORAGE_KEY, JSON.stringify(queues));
    setStats(prev => ({ ...prev, activeQueues: queues.filter(q => q.status === 'running').length }));
  }, [queues]);

  // --- HANDLERS ---
  const handleCreateQueue = (name, segmentId, sendsPerMinute) => {
    const segment = segments.find(s => s.id === segmentId);
    if (!name || !segment) return alert("Nome da Fila e Segmento são obrigatórios.");

    const newQueue = {
      id: `q-${Date.now()}`,
      name,
      segmentId,
      segmentName: segment.name,
      sendsPerMinute: sendsPerMinute || 60,
      status: 'paused',
      activeBlockIndex: 0,
      blocks: [],
    };
    setQueues(prev => [...prev, newQueue]);
  };

  const handleAddBlock = (queueId, newBlock) => {
    setQueues(prev => prev.map(q => q.id === queueId ? { ...q, blocks: [...q.blocks, newBlock] } : q));
    setAddBlockModalOpen(false);
  };

  const handleToggleQueueStatus = (queueId) => {
    setQueues(prev => prev.map(q => q.id === queueId ? { ...q, status: q.status === 'running' ? 'paused' : 'running' } : q));
  };

  const handleDeleteQueue = (queueId) => {
    if (window.confirm("Tem certeza que deseja remover esta fila e todos os seus blocos?")) {
      setQueues(prev => prev.filter(q => q.id !== queueId));
    }
  };

  const handleDeleteBlock = (queueId, blockId) => {
     setQueues(prev => prev.map(q => q.id === queueId ? { ...q, blocks: q.blocks.filter(b => b.id !== blockId) } : q));
  };

  const openAddBlockModal = (queueId) => {
    setQueueToAddTo(queueId);
    setAddBlockModalOpen(true);
  };

  return (
    <>
      <div className="space-y-8">
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Mensagens Enviadas" value={stats.messagesSent} icon={<BarChart2 />} />
            <StatCard title="Filas Ativas" value={stats.activeQueues} icon={<Play />} />
            <StatCard title="Total de Filas" value={queues.length} icon={<Layers />} />
          </div>
        </section>

        <CreateQueueForm segments={segments} onCreateQueue={handleCreateQueue} />

        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><Zap size={20} className="text-yellow-500"/> Filas de Disparo</h2>
          <div className="space-y-6">
            {queues.length === 0 && <p className="text-slate-500 text-center py-8 bg-white rounded-lg shadow-sm">Nenhuma fila criada. Comece adicionando uma acima.</p>}
            {queues.map(queue => (
              <QueueCard 
                key={queue.id} 
                queue={queue} 
                onToggleStatus={() => handleToggleQueueStatus(queue.id)}
                onDeleteQueue={() => handleDeleteQueue(queue.id)}
                onDeleteBlock={(blockId) => handleDeleteBlock(queue.id, blockId)}
                onAddBlock={() => openAddBlockModal(queue.id)}
              />
            ))}
          </div>
        </section>
      </div>

      {isAddBlockModalOpen && (
        <AddBlockModal
          queueId={queueToAddTo}
          onClose={() => setAddBlockModalOpen(false)}
          onAddBlock={handleAddBlock}
        />
      )}
    </>
  );
}

// --- SUB-COMPONENTES ---

const CreateQueueForm = ({ segments, onCreateQueue }) => {
  const [name, setName] = useState('');
  const [segmentId, setSegmentId] = useState('');
  const [sendsPerMinute, setSendsPerMinute] = useState(60);

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateQueue(name, segmentId, sendsPerMinute);
    setName('');
    setSegmentId('');
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Criar Nova Fila</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="md:col-span-2">
          <label className="text-sm font-bold text-slate-700">Nome da Fila</label>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full border p-2 rounded" placeholder="Ex: Campanha de Boas-Vindas" />
        </div>
        <div>
          <label className="text-sm font-bold text-slate-700">Segmento</label>
          <select value={segmentId} onChange={e => setSegmentId(e.target.value)} className="w-full border p-2 rounded bg-white">
            <option value="">Selecione...</option>
            {segments.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-bold flex items-center justify-center gap-2 hover:bg-blue-700">
          <PlusCircle size={18} /> Criar Fila
        </button>
      </form>
    </section>
  );
};

const QueueCard = ({ queue, onToggleStatus, onDeleteQueue, onDeleteBlock, onAddBlock }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200">
    <div className="p-4 border-b flex justify-between items-center bg-slate-50">
      <div>
        <h3 className="font-bold text-lg text-slate-800">{queue.name}</h3>
        <p className="text-xs text-slate-500 font-medium">Segmento: <span className="font-bold">{queue.segmentName}</span></p>
      </div>
      <div className="flex items-center gap-3">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${queue.status === 'running' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {queue.status === 'running' ? 'ATIVA' : 'PAUSADA'}
        </span>
        <button onClick={onToggleStatus} className="text-slate-600 hover:text-blue-600">{queue.status === 'running' ? <Pause size={20}/> : <Play size={20}/>}</button>
        <button onClick={onDeleteQueue} className="text-slate-600 hover:text-red-600"><Trash2 size={18}/></button>
      </div>
    </div>
    <div className="p-4 overflow-x-auto">
      <div className="flex items-center gap-4">
        {queue.blocks.map((block, index) => (
          <React.Fragment key={block.id}>
            <BlockCard block={block} onDelete={() => onDeleteBlock(block.id)} />
            <ChevronRight className="text-slate-300" />
          </React.Fragment>
        ))}
        <button onClick={onAddBlock} className="flex-shrink-0 h-40 w-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-colors">
          <PlusCircle size={24} />
          <span className="text-sm font-semibold mt-2">Adicionar Bloco</span>
        </button>
      </div>
    </div>
  </div>
);

const BlockCard = ({ block, onDelete }) => (
  <div className="flex-shrink-0 w-64 bg-slate-50 border rounded-lg p-3 relative group">
    <button onClick={onDelete} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>
    <div className="flex items-center gap-2 mb-2 pb-2 border-b">
      <Server size={14} className="text-slate-500"/>
      <p className="text-sm font-bold text-slate-700 truncate" title={block.waba.description}>{block.waba.description}</p>
    </div>
    <div className="flex items-center gap-2 mb-1">
      <Smartphone size={14} className="text-slate-500"/>
      <p className="text-xs text-slate-600">{block.line.phone}</p>
      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${block.line.quality === 'GREEN' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{block.line.quality}</span>
    </div>
    <div className="flex items-center gap-2">
      <FileText size={14} className="text-slate-500"/>
      <p className="text-xs text-slate-600 truncate">{block.template.name}</p>
    </div>
     <div className="flex items-center gap-2 mt-2 pt-2 border-t">
      <Tag size={14} className="text-slate-500"/>
      <p className="text-xs text-slate-600">Reports: 0 / {block.config.reportLimit}</p>
    </div>
  </div>
);

const AddBlockModal = ({ queueId, onClose, onAddBlock }) => {
  const [wabas, setWabas] = useState([]);
  const [lines, setLines] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedWabaId, setSelectedWabaId] = useState('');
  const [selectedLineId, setSelectedLineId] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [reportLimit, setReportLimit] = useState(1000);
  const [isTemplateModalOpen, setTemplateModalOpen] = useState(false);

  useEffect(() => {
    configService.getWABAs().then(setWabas).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedWabaId) {
      setLines([]); setTemplates([]); // Reset
      configService.getLines(selectedWabaId).then(setLines).catch(console.error);
      configService.getTemplates(selectedWabaId).then(setTemplates).catch(console.error);
    }
  }, [selectedWabaId]);

  const handleSubmit = () => {
    if (!selectedWabaId || !selectedLineId || !selectedTemplate) {
      return alert("Selecione BM, Linha e Template.");
    }
    const waba = wabas.find(w => w.id === selectedWabaId);
    const line = lines.find(l => l.id === selectedLineId);
    const template = selectedTemplate;

    const newBlock = {
      id: `b-${Date.now()}`,
      waba: { id: waba.id, description: waba.description },
      line: { id: line.id, phone: line.phone, quality: line.whatsapp_line_number_details?.quality_rating?.code || 'N/A' },
      template: { id: template.id, name: template.name, quality: template.whatsapp_quality_template },
      config: { reportLimit },
      currentReports: 0,
    };
    onAddBlock(queueId, newBlock);
  };

  const selectedLine = lines.find(l => l.id === selectedLineId);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold">Adicionar Bloco à Fila</h3>
          <button onClick={onClose}><X size={20}/></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-bold text-slate-700">1. Selecione a BM (WABA)</label>
            <select value={selectedWabaId} onChange={e => setSelectedWabaId(e.target.value)} className="w-full border p-2 rounded bg-white">
              <option value="">Selecione...</option>
              {wabas.map(w => <option key={w.id} value={w.id}>{w.description}</option>)}
            </select>
          </div>
          <div className={!selectedWabaId ? 'opacity-50' : ''}>
            <label className="text-sm font-bold text-slate-700">2. Selecione a Linha</label>
            <select value={selectedLineId} onChange={e => setSelectedLineId(e.target.value)} className="w-full border p-2 rounded bg-white" disabled={!selectedWabaId}>
              <option value="">Selecione...</option>
              {lines.map(l => <option key={l.id} value={l.id}>{l.phone}</option>)}
            </select>
            {selectedLine && <p className="text-xs mt-1">Qualidade: <span className="font-bold">{selectedLine.whatsapp_line_number_details?.quality_rating?.code || 'N/A'}</span></p>}
          </div>
          <div className={!selectedWabaId ? 'opacity-50' : ''}>
            <label className="text-sm font-bold text-slate-700">3. Selecione o Template</label>
            <button 
              type="button"
              onClick={() => setTemplateModalOpen(true)} 
              className="w-full border p-2 rounded bg-white text-left flex justify-between items-center" 
              disabled={!selectedWabaId}
            >
              <span className={selectedTemplate ? 'text-slate-800' : 'text-slate-400'}>
                {selectedTemplate ? selectedTemplate.name : 'Selecionar um template...'}
              </span>
              <Search size={16} className="text-slate-400" />
            </button>
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700">4. Limite de Reports da Meta</label>
            <input type="number" value={reportLimit} onChange={e => setReportLimit(Number(e.target.value))} className="w-full border p-2 rounded" />
          </div>
        </div>
        <div className="p-4 bg-slate-50 border-t text-right">
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-2 rounded font-bold">Adicionar Bloco</button>
        </div>
      </div>
      {isTemplateModalOpen && (
        <TemplateSelectionModal
          templates={templates}
          onClose={() => setTemplateModalOpen(false)}
          onSelect={(template) => {
            setSelectedTemplate(template);
            setTemplateModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

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

const TemplateSelectionModal = ({ templates, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[70vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold">Selecionar Template</h3>
          <button onClick={onClose}><X size={20}/></button>
        </div>
        <div className="p-4 border-b">
          <input
            type="text"
            placeholder="Pesquisar por nome do template..."
            className="w-full border p-2 rounded"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredTemplates.length === 0 ? (
            <p className="text-center text-slate-500 p-8">Nenhum template encontrado para sua busca.</p>
          ) : (
            <ul className="divide-y divide-slate-200">
              {filteredTemplates.map(template => (
                <li
                  key={template.id}
                  onClick={() => onSelect(template)}
                  className="p-4 hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <p className="font-bold text-slate-800">{template.name}</p>
                  <p className="text-xs text-slate-500 mt-1 truncate">{template.body}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};