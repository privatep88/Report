
import React from 'react';
import type { MalfunctionSummary } from '../types.ts';
import { EditableCell } from './EditableCell.tsx';

interface MalfunctionsSummaryTableProps {
  data: MalfunctionSummary[];
  onUpdate: (index: number, field: keyof MalfunctionSummary, value: string) => void;
}

export const MalfunctionsSummaryTable: React.FC<MalfunctionsSummaryTableProps> = ({ data, onUpdate }) => {
    const total = data.reduce((acc, curr) => acc + (parseFloat(curr.count) || 0), 0);

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-slate-700 text-white">
                    <tr>
                        <th className="py-2 px-4 border">م</th>
                        <th className="py-2 px-4 border text-center">الوصف</th>
                        <th className="py-2 px-4 border">عدد الاعطال</th>
                        <th className="py-2 px-4 border">اجمالي عدد الاعطال</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={row.id} className="text-center text-gray-700 hover:bg-gray-50">
                            <td className="py-2 px-4 border bg-slate-700 text-white font-bold">{row.id}</td>
                            <td className="py-2 px-4 border text-center">{row.description}</td>
                            <EditableCell type="number" value={row.count} onChange={(e) => onUpdate(index, 'count', e.target.value)} />
                            {index === 0 && (
                                <td className="py-2 px-4 border font-bold" rowSpan={data.length}>
                                    {total}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
