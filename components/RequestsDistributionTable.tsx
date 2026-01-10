
import React, { useRef, useCallback, useEffect } from 'react';
import type { RequestDistribution } from '../types.ts';
import { EditableCell } from './EditableCell.tsx';

interface RequestsDistributionTableProps {
  data: RequestDistribution[];
  channels: { id: string; name: string }[];
  headers: { metric: string; total: string };
  columnWidths: { [key: string]: number };
  onUpdate: (index: number, field: 'metric' | 'total' | string, value: string) => void;
  onHeaderUpdate: (field: 'metric' | 'total', value: string) => void;
  onChannelNameUpdate: (channelId: string, newName: string) => void;
  onColumnWidthUpdate: (columnId: string, width: number) => void;
}

export const RequestsDistributionTable: React.FC<RequestsDistributionTableProps> = ({ 
    data, 
    channels, 
    headers, 
    columnWidths,
    onUpdate, 
    onHeaderUpdate, 
    onChannelNameUpdate,
    onColumnWidthUpdate
}) => {
  const resizingColumnRef = useRef<{ id: string, startX: number, startWidth: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent, columnId: string) => {
    e.preventDefault();
    resizingColumnRef.current = {
      id: columnId,
      startX: e.clientX,
      startWidth: columnWidths[columnId] || 200,
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!resizingColumnRef.current) return;
    const { id, startX, startWidth } = resizingColumnRef.current;
    const dx = e.clientX - startX;
    const newWidth = Math.max(startWidth + dx, 80); // Set a minimum width
    onColumnWidthUpdate(id, newWidth);
  }, [onColumnWidthUpdate]);

  const handleMouseUp = useCallback(() => {
    resizingColumnRef.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);
  
  const calculateCompletionPercentage = (receivedStr: string, completedStr: string) => {
    const received = parseFloat(receivedStr) || 0;
    const completed = parseFloat(completedStr) || 0;
    if (received === 0) {
      return '0%';
    }
    return `${((completed / received) * 100).toFixed(0)}%`;
  };

  if (data.length < 3) {
      return (
          <p>البيانات غير كافية لعرض الجدول.</p>
      )
  }

  const receivedRow = data[0];
  const completedRow = data[1];
  const percentageRow = data[2];

  const Resizer = ({ onMouseDown }: { onMouseDown: (e: React.MouseEvent) => void }) => (
    <div
      onMouseDown={onMouseDown}
      className="absolute top-0 -right-1 h-full w-2 cursor-col-resize z-10"
      style={{ touchAction: 'none' }}
    />
  );

  return (
    <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200" style={{ tableLayout: 'fixed' }}>
             <colgroup>
                <col style={{ width: `${columnWidths.metric || 120}px` }} />
                <col style={{ width: `${columnWidths.total || 160}px` }} />
                {channels.map(channel => (
                    <col key={channel.id} style={{ width: `${columnWidths[channel.id] || 220}px` }} />
                ))}
            </colgroup>
            <thead className="bg-slate-700 text-white text-sm">
                <tr className="whitespace-nowrap">
                    <th className="p-0 border text-center relative">
                       <input
                            type="text"
                            value={headers.metric}
                            onChange={(e) => onHeaderUpdate('metric', e.target.value)}
                            className="w-full h-full py-2 px-4 bg-transparent border-none text-center font-semibold text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <Resizer onMouseDown={(e) => handleMouseDown(e, 'metric')} />
                    </th>
                    <th className="p-0 border text-center relative">
                        <input
                            type="text"
                            value={headers.total}
                            onChange={(e) => onHeaderUpdate('total', e.target.value)}
                            className="w-full h-full py-2 px-4 bg-transparent border-none text-center font-semibold text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <Resizer onMouseDown={(e) => handleMouseDown(e, 'total')} />
                    </th>
                    {channels.map(channel => (
                        <th key={channel.id} className="p-0 border text-center relative">
                            <input
                                type="text"
                                value={channel.name}
                                onChange={(e) => onChannelNameUpdate(channel.id, e.target.value)}
                                className="w-full h-full py-2 px-4 bg-transparent border-none text-center font-semibold text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <Resizer onMouseDown={(e) => handleMouseDown(e, channel.id)} />
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {/* Row 1: Received (Editable) */}
                <tr key={receivedRow.id} className="text-center text-gray-700 hover:bg-gray-50 whitespace-nowrap">
                    <EditableCell
                        value={receivedRow.metric}
                        onChange={(e) => onUpdate(0, 'metric', e.target.value)}
                        className="font-semibold"
                        placeholder="أدخل المقياس"
                    />
                    
                    {/* MERGED CELL STARTS HERE */}
                    <td rowSpan={3} className="p-0 border align-top">
                        <div className="h-full flex flex-col">
                            {/* Display for received total */}
                            <div className="flex-1 flex items-center justify-center py-2 px-4 text-gray-700">
                                {receivedRow.total || '0'}
                            </div>
                            {/* Display for completed total */}
                            <div className="flex-1 border-t border-gray-200 flex items-center justify-center py-2 px-4 text-gray-700 gap-2 text-sm">
                                <span>{completedRow.total || '0'}</span>
                            </div>
                            {/* Display for percentage */}
                            <div className="flex-1 border-t border-gray-200 bg-slate-100 font-semibold flex items-center justify-center py-2 px-4">
                                {calculateCompletionPercentage(receivedRow.total, completedRow.total)}
                            </div>
                        </div>
                    </td>

                    {channels.map(channel => (
                        <EditableCell
                            key={channel.id}
                            type="number"
                            value={receivedRow.values[channel.id] || ''}
                            onChange={(e) => onUpdate(0, channel.id, e.target.value)}
                        />
                    ))}
                </tr>
                 {/* Row 2: Completed (Editable) */}
                <tr key={completedRow.id} className="text-center text-gray-700 hover:bg-gray-50 text-sm">
                    <EditableCell
                        value={completedRow.metric}
                        onChange={(e) => onUpdate(1, 'metric', e.target.value)}
                        className="font-semibold"
                        placeholder="أدخل المقياس"
                    />
                    {/* Total cell removed because of rowspan */}
                    {channels.map(channel => (
                        <EditableCell
                            key={channel.id}
                            type="number"
                            value={completedRow.values[channel.id] || ''}
                            onChange={(e) => onUpdate(1, channel.id, e.target.value)}
                        />
                    ))}
                </tr>
                {/* Row 3: Percentage (Calculated) */}
                 <tr key={percentageRow.id} className="text-center text-gray-700 bg-slate-100 font-semibold whitespace-nowrap">
                    <td className="py-2 px-4 border text-center font-semibold">{percentageRow.metric}</td>
                    {/* Total cell removed because of rowspan */}
                    {channels.map(channel => (
                         <td key={channel.id} className="py-2 px-4 border">
                             {calculateCompletionPercentage(
                                receivedRow.total, 
                                completedRow.values[channel.id] || '0'
                             )}
                         </td>
                    ))}
                </tr>
            </tbody>
        </table>
    </div>
  );
};