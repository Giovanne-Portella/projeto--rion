import React, { useState } from 'react';
import { parseCSV } from '../../utils/csvParser';
import { Upload, CheckCircle, AlertTriangle, FileText, XCircle } from 'lucide-react';

export default function MailingValidator({ onValidationSuccess }) {
  const [files, setFiles] = useState({ original: null, rejected: null, flags: null });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const handleFileChange = (key, file) => {
    setFiles(prev => ({ ...prev, [key]: file }));
  };

  const processFiles = async () => {
    if (!files.original || !files.rejected || !files.flags) {
      alert("Selecione os 3 arquivos obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      const [original, rejected, flags] = await Promise.all([
        parseCSV(files.original),
        parseCSV(files.rejected),
        parseCSV(files.flags)
      ]);

      // Lógica de rejeição baseada no índice (Linha do Excel - 2)
      const rejectedIndices = new Set(
        rejected.data
          .map(row => parseInt(row['Número da Linha']) - 2)
          .filter(idx => !isNaN(idx))
      );

      const validContacts = original.data.filter((_, index) => !rejectedIndices.has(index));

      const resultStats = {
        total: original.data.length,
        rejected: rejectedIndices.size,
        valid: validContacts.length,
        contacts: validContacts
      };

      setStats(resultStats);
      if (onValidationSuccess) onValidationSuccess(resultStats);

    } catch (error) {
      alert("Erro ao ler CSVs. Verifique se usam ponto e vírgula (;).");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-700">
        <CheckCircle className="text-blue-600" /> Validação de Segurança
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <UploadCard title="1. Mailing Original" file={files.original} onChange={f => handleFileChange('original', f)} icon={<FileText className="text-blue-500"/>} />
        <UploadCard title="2. Rejeitados Verify" file={files.rejected} onChange={f => handleFileChange('rejected', f)} icon={<XCircle className="text-red-500"/>} />
        <UploadCard title="3. Flags Verify" file={files.flags} onChange={f => handleFileChange('flags', f)} icon={<AlertTriangle className="text-yellow-500"/>} />
      </div>

      <button onClick={processFiles} disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
        {loading ? 'Processando...' : 'Validar e Gerar Lista Limpa'}
      </button>

      {stats && (
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
          <div className="bg-slate-50 p-2 rounded">Total: <b>{stats.total}</b></div>
          <div className="bg-red-50 p-2 rounded text-red-600">Removidos: <b>{stats.rejected}</b></div>
          <div className="bg-green-50 p-2 rounded text-green-600">Prontos: <b>{stats.valid}</b></div>
        </div>
      )}
    </div>
  );
}

function UploadCard({ title, file, onChange, icon }) {
  return (
    <div className={`border-2 border-dashed rounded p-4 text-center ${file ? 'border-green-500 bg-green-50' : 'border-slate-300'}`}>
      <div className="flex justify-center mb-2">{icon}</div>
      <p className="text-xs font-bold mb-2">{title}</p>
      <input type="file" accept=".csv" className="hidden" id={`u-${title}`} onChange={e => onChange(e.target.files[0])} />
      <label htmlFor={`u-${title}`} className="cursor-pointer text-xs bg-white border px-2 py-1 rounded">
        {file ? file.name.substring(0,15)+'...' : 'Selecionar'}
      </label>
    </div>
  );
}