// src/components/admin/SubjectManager.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function SubjectManager() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [levelTarget, setLevelTarget] = useState('Primary,JHS,SHS');

  useEffect(()=>{ fetchSubjects(); }, []);

  async function fetchSubjects() {
    const { data } = await supabase.from('subjects').select('*').order('id');
    setSubjects(data || []);
  }

  async function addSubject() {
    await supabase.from('subjects').insert([{ name, code, level_target: levelTarget }]);
    setName(''); setCode('');
    fetchSubjects();
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold">Subjects</h3>
      <div className="space-y-2 my-3">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Subject name" className="p-2 border rounded" />
        <input value={code} onChange={e=>setCode(e.target.value)} placeholder="Code e.g. ENG" className="p-2 border rounded" />
        <input value={levelTarget} onChange={e=>setLevelTarget(e.target.value)} placeholder="Level target" className="p-2 border rounded" />
        <button onClick={addSubject} className="p-2 rounded bg-blue-600 text-white">Add Subject</button>
      </div>
      <ul>
        {subjects.map(s => <li key={s.id}>{s.code} - {s.name} ({s.level_target})</li>)}
      </ul>
    </div>
  );
}
