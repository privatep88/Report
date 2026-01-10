
import React from 'react';
import type { TaskItem } from '../types.ts';
import { EditableCell } from './EditableCell.tsx';

interface TasksTableProps {
  data: TaskItem[];
  onUpdate: (index: number, field: keyof TaskItem, value: string) => void;
  onAdd: () => void;
  onDelete: (id: number) => void;
}

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);


export const TasksTable: React.FC<TasksTableProps> = ({ data, onUpdate, onAdd, onDelete }) => {
  return (
    <>
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-slate-700 text-white">
                    <tr>
                        <th className="py-2 px-4 border w-16">م</th>
                        <th className="py-2 px-4 border">الموضوع</th>
                        <th className="py-2 px-4 border">المهمة</th>
                        <th className="py-2 px-4 border w-32">نسبة الانجاز</th>
                        <th className="py-2 px-4 border w-24 no-print">إجراء</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={row.id} className="text-center text-gray-700 hover:bg-gray-50 text-sm">
                            <td className="py-2 px-4 border bg-slate-700 text-white font-bold">{index + 1}</td>
                            <EditableCell value={row.subject} onChange={(e) => onUpdate(index, 'subject', e.target.value)} placeholder="أدخل الموضوع" />
                            <EditableCell value={row.task} onChange={(e) => onUpdate(index, 'task', e.target.value)} placeholder="أدخل المهمة" />
                            <td className="py-2 px-4 border font-semibold text-xs">100%</td>
                            <td className="py-2 px-4 border no-print">
                                <button onClick={() => onDelete(row.id)} className="text-red-500 hover:text-red-700 p-1 mx-auto" aria-label="Delete row">
                                    <TrashIcon />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <button onClick={onAdd} className="no-print mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300">
            إضافة مهمة جديدة
        </button>
    </>
  );
};
