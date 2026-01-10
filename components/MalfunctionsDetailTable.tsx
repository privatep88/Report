
import React from 'react';
import type { MalfunctionDetail } from '../types.ts';
import { EditableCell } from './EditableCell.tsx';

interface MalfunctionsDetailTableProps {
  data: MalfunctionDetail[];
  onUpdate: (index: number, field: keyof MalfunctionDetail, value: string) => void;
  onAdd: () => void;
  onDelete: (id: number) => void;
}

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);


export const MalfunctionsDetailTable: React.FC<MalfunctionsDetailTableProps> = ({ data, onUpdate, onAdd, onDelete }) => {
  return (
    <>
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 text-xs sm:text-sm malfunction-detail-table">
                <thead className="bg-slate-700 text-white text-center align-middle">
                    <tr>
                        <th rowSpan={2} className="py-3 px-2 border align-middle w-12">م</th>
                        <th rowSpan={2} className="py-3 px-2 border align-middle min-w-[120px]">المقرات</th>
                        <th colSpan={5} className="py-2 px-2 border bg-slate-700 font-bold">صيانة عامة</th>
                        <th colSpan={4} className="py-2 px-2 border bg-slate-700 font-bold">الأنظمة</th>
                        <th colSpan={3} className="py-2 px-2 border bg-slate-700 font-bold">البنية التحتية</th>
                        <th rowSpan={2} className="py-3 px-2 border align-middle w-24 no-print">إجراء</th>
                    </tr>
                    <tr>
                        <th className="py-2 px-2 border font-medium">اعطال عامة</th>
                        <th className="py-2 px-2 border font-medium">اثاث</th>
                        <th className="py-2 px-2 border font-medium">ديكور</th>
                        <th className="py-2 px-2 border font-medium">ارضيات</th>
                        <th className="py-2 px-2 border font-medium">ابواب</th>
                        <th className="py-2 px-2 border font-medium">انذار حريق</th>
                        <th className="py-2 px-2 border font-medium">انارة</th>
                        <th className="py-2 px-2 border font-medium">كهرباء</th>
                        <th className="py-2 px-2 border font-medium">تكييف</th>
                        <th className="py-2 px-2 border font-medium">تسريب ماء</th>
                        <th className="py-2 px-2 border font-medium">عطل اللوحات الخارجية</th>
                        <th className="py-2 px-2 border font-medium">مصاعد</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => {
                        const isHighlighted = row.location.startsWith('التكلفة /');
                        const rowClasses = `text-center text-gray-700 ${isHighlighted ? 'bg-slate-100 hover:bg-slate-200' : 'hover:bg-gray-50'}`;
                        
                        return (
                        <tr key={row.id} className={rowClasses}>
                            <td className="py-2 px-2 border bg-slate-700 text-white font-bold">{index + 1}</td>
                            <EditableCell value={row.location} onChange={(e) => onUpdate(index, 'location', e.target.value)} placeholder="أدخل المقر" className="font-semibold" />
                            {/* General Maintenance */}
                            <EditableCell type="number" value={row.general} onChange={(e) => onUpdate(index, 'general', e.target.value)} />
                            <EditableCell type="number" value={row.furniture} onChange={(e) => onUpdate(index, 'furniture', e.target.value)} />
                            <EditableCell type="number" value={row.decor} onChange={(e) => onUpdate(index, 'decor', e.target.value)} />
                            <EditableCell type="number" value={row.flooring} onChange={(e) => onUpdate(index, 'flooring', e.target.value)} />
                            <EditableCell type="number" value={row.doors} onChange={(e) => onUpdate(index, 'doors', e.target.value)} />
                            {/* Systems */}
                            <EditableCell type="number" value={row.fireAlarm} onChange={(e) => onUpdate(index, 'fireAlarm', e.target.value)} />
                            <EditableCell type="number" value={row.lighting} onChange={(e) => onUpdate(index, 'lighting', e.target.value)} />
                            <EditableCell type="number" value={row.electrical} onChange={(e) => onUpdate(index, 'electrical', e.target.value)} />
                            <EditableCell type="number" value={row.ac} onChange={(e) => onUpdate(index, 'ac', e.target.value)} />
                            {/* Infrastructure */}
                            <EditableCell type="number" value={row.waterLeak} onChange={(e) => onUpdate(index, 'waterLeak', e.target.value)} />
                            <EditableCell type="number" value={row.panels} onChange={(e) => onUpdate(index, 'panels', e.target.value)} />
                            <EditableCell type="number" value={row.elevators} onChange={(e) => onUpdate(index, 'elevators', e.target.value)} />
                            <td className="py-2 px-2 border no-print">
                                <button onClick={() => onDelete(row.id)} className="text-red-500 hover:text-red-700 p-1 mx-auto" aria-label="Delete row">
                                    <TrashIcon />
                                </button>
                            </td>
                        </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
        <button onClick={onAdd} className="no-print mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300">
            إضافة مقر جديد
        </button>
    </>
  );
};
