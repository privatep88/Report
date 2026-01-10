
import React from 'react';
import type { SecurityReportItem } from '../types.ts';
import { EditableCell } from './EditableCell.tsx';

interface SecurityReportTableProps {
  data: SecurityReportItem[];
  onUpdate: (index: number, field: keyof SecurityReportItem, value: string) => void;
}

export const SecurityReportTable: React.FC<SecurityReportTableProps> = ({ data, onUpdate }) => {
  return (
    <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-slate-700 text-white text-sm">
                <tr>
                    <th className="py-2 px-4 border text-center">الطلبات</th>
                    <th className="py-2 px-4 border text-center">طلبات تفعيل البطاقات</th>
                    <th className="py-2 px-4 border text-center">عدد الزوار</th>
                    <th className="py-2 px-4 border text-center">عدد الزوار من الموردين</th>
                    <th className="py-2 px-4 border text-center">طلبات حجز القاعات</th>
                    <th className="py-2 px-4 border text-center">حالات الاخلاء</th>
                    <th className="py-2 px-4 border text-center">تقارير الأمنية (كاميرات + حراس أمن)</th>
                    <th className="py-2 px-4 border text-center">الحالات الطارئة</th>
                </tr>
            </thead>
            <tbody>
                {data.map((row, index) => (
                    <tr key={row.id} className="text-center text-gray-700 hover:bg-gray-50">
                        <td className="py-2 px-4 border text-center font-semibold">{row.metric}</td>
                        <EditableCell type="number" value={row.cardActivations} onChange={(e) => onUpdate(index, 'cardActivations', e.target.value)} />
                        <EditableCell type="number" value={row.visitors} onChange={(e) => onUpdate(index, 'visitors', e.target.value)} />
                        <EditableCell type="number" value={row.supplierVisitors} onChange={(e) => onUpdate(index, 'supplierVisitors', e.target.value)} />
                        <EditableCell type="number" value={row.hallBookings} onChange={(e) => onUpdate(index, 'hallBookings', e.target.value)} />
                        <EditableCell type="number" value={row.evacuations} onChange={(e) => onUpdate(index, 'evacuations', e.target.value)} />
                        <EditableCell type="number" value={row.securityReports} onChange={(e) => onUpdate(index, 'securityReports', e.target.value)} />
                        <EditableCell type="number" value={row.emergencies} onChange={(e) => onUpdate(index, 'emergencies', e.target.value)} />
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
};