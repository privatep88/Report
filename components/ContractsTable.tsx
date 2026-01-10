
import React from 'react';
import type { ContractStatus } from '../types.ts';
import { EditableCell } from './EditableCell.tsx';

interface ContractsTableProps {
  title: string;
  data: ContractStatus[];
  onUpdate: (index: number, field: keyof ContractStatus, value: string) => void;
}

export const ContractsTable: React.FC<ContractsTableProps> = ({ title, data, onUpdate }) => {
  return (
    <div>
        <h3 className="bg-slate-800 text-white text-center font-bold text-md py-2 px-4 rounded-lg shadow-lg mb-3">{title}</h3>
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-slate-700 text-white text-sm">
                    <tr>
                        <th className="py-2 px-4 border text-center">م</th>
                        <th className="py-2 px-4 border text-center">فعالة</th>
                        <th className="py-2 px-4 border text-center">غير فعالة</th>
                        <th className="py-2 px-4 border text-center">الملاحظات</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={row.id} className="text-center text-gray-700 hover:bg-gray-50 text-[10px]">
                            <td className="py-2 px-4 border bg-slate-700 text-white font-bold">{row.id}</td>
                            <EditableCell type="number" value={row.active} onChange={(e) => onUpdate(index, 'active', e.target.value)} />
                            <EditableCell type="number" value={row.inactive} onChange={(e) => onUpdate(index, 'inactive', e.target.value)} />
                            <EditableCell value={row.notes} onChange={(e) => onUpdate(index, 'notes', e.target.value)} placeholder="-" />
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};
