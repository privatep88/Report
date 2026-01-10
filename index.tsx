
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

// --- Global Declarations ---
declare const html2pdf: any;
declare const XLSX: any;

// --- Types (from types.ts) ---
interface ServiceRequest {
    id: number;
    service: string;
    received: string;
    completed: string;
}

interface ContractStatus {
    id: number;
    active: string;
    inactive: string;
    notes: string;
}

interface MalfunctionSummary {
    id: number;
    description: string;
    count: string;
}

interface MalfunctionDetail {
    id: number;
    location: string;
    general: string;
    furniture: string;
    decor: string;
    fireAlarm: string;
    waterLeak: string;
    doors: string;
    lighting: string;
    flooring: string;
    ac: string;
    exterior: string;
    panels: string;
    electrical: string;
    elevators: string;
}

interface RequestDistribution {
    id: number;
    metric: string;
    total: string;
    values: { [key: string]: string };
}

interface SecurityReportItem {
    id: number;
    metric: string;
    cardActivations: string;
    visitors: string;
    supplierVisitors: string;
    hallBookings: string;
    evacuations: string;
    securityReports: string;
    emergencies: string;
}

interface TaskItem {
    id: number;
    subject: string;
    task: string;
}

interface ChallengeItem {
    id: number;
    challenges: string;
    update: string;
    recommendation: string;
}

interface SignatureData {
    id: number;
    title: string;
    name: string;
    role: string;
    signatureImage: string | null;
}

// --- Constants (from constants.ts) ---
const initialServicesData: ServiceRequest[] = [
    { id: 1, service: 'طلبات الصيانة', received: '', completed: '' },
    { id: 2, service: 'النثرية Petty Cash', received: '', completed: '' },
    { id: 3, service: 'طلبات الدعم اللوجستي', received: '', completed: '' },
    { id: 4, service: 'خدمات الاستقبال', received: '', completed: '' },
    { id: 5, service: 'طلبات صرف', received: '', completed: '' },
    { id: 6, service: 'طلبات حركات الأصول', received: '', completed: '' },
    { id: 7, service: 'طلبات الضيافة', received: '', completed: '' },
    { id: 8, service: 'طلبات النظافة', received: '', completed: '' },
    { id: 9, service: 'طلبات ادارة النفايات', received: '', completed: '' },
    { id: 10, service: 'طلبات وخدمات حكومية', received: '', completed: '' },
];

const initialLeaseContractsData: ContractStatus[] = [
    { id: 1, active: '', inactive: '', notes: '' },
];

const initialCommercialLicensesData: ContractStatus[] = [
    { id: 1, active: '', inactive: '', notes: '' },
];

const initialServiceContractsData: ContractStatus[] = [
    { id: 1, active: '', inactive: '', notes: '' },
];

const initialMalfunctionSummaryData: MalfunctionSummary[] = [
    { id: 1, description: 'عدد طلبات الصيانة الواردة من قسم إدارة المرافق', count: '' },
    { id: 2, description: 'عدد طلبات الصيانة الواردة من الادارات الأخرى', count: '' },
];

const initialMalfunctionDetailData: MalfunctionDetail[] = [
    { id: 1, location: 'مقر انجازات', general: '', furniture: '', decor: '', fireAlarm: '', waterLeak: '', doors: '', lighting: '', flooring: '', ac: '', exterior: '', panels: '', electrical: '', elevators: '' },
    { id: 2, location: 'مقر الدوريات', general: '', furniture: '', decor: '', fireAlarm: '', waterLeak: '', doors: '', lighting: '', flooring: '', ac: '', exterior: '', panels: '', electrical: '', elevators: '' },
    { id: 3, location: 'مقر ابن بطوطة', general: '', furniture: '', decor: '', fireAlarm: '', waterLeak: '', doors: '', lighting: '', flooring: '', ac: '', exterior: '', panels: '', electrical: '', elevators: '' },
    { id: 4, location: 'مقر تقييم عجمان', general: '', furniture: '', decor: '', fireAlarm: '', waterLeak: '', doors: '', lighting: '', flooring: '', ac: '', exterior: '', panels: '', electrical: '', elevators: '' },
    { id: 5, location: 'مقر دوريات عجمان', general: '', furniture: '', decor: '', fireAlarm: '', waterLeak: '', doors: '', lighting: '', flooring: '', ac: '', exterior: '', panels: '', electrical: '', elevators: '' },
    { id: 6, location: 'التكلفة / النثرية', general: '', furniture: '', decor: '', fireAlarm: '', waterLeak: '', doors: '', lighting: '', flooring: '', ac: '', exterior: '', panels: '', electrical: '', elevators: '' },
    { id: 7, location: 'التكلفة / أمر شراء', general: '', furniture: '', decor: '', fireAlarm: '', waterLeak: '', doors: '', lighting: '', flooring: '', ac: '', exterior: '', panels: '', electrical: '', elevators: '' },
];

const initialDistributionChannels: { id: string; name: string }[] = [
    { id: 'representative', name: 'الطلبات من خلال المندوب' },
    { id: 'emiratesPost', name: 'الطلبات من خلال بريد الامارات' },
    { id: 'aramex', name: 'الطلبات من خلال ارامكس' },
    { id: 'distribution', name: 'الطلبات من خلال توزيع' },
];

const initialRequestDistributionData: RequestDistribution[] = [
    {
        id: 1,
        metric: 'عدد الطلبات المستلمة',
        total: '',
        values: {
            representative: '',
            emiratesPost: '',
            aramex: '',
            distribution: '',
        }
    },
    {
        id: 2,
        metric: 'الطلبات المنفذة',
        total: '',
        values: {
            representative: '',
            emiratesPost: '',
            aramex: '',
            distribution: '',
        }
    },
    {
        id: 3,
        metric: 'نسبة الإنجاز',
        total: '',
        values: {}
    },
];


const initialSecurityReportData: SecurityReportItem[] = [
    { id: 1, metric: 'عدد الطلبات المستلمة', cardActivations: '', visitors: '', supplierVisitors: '', hallBookings: '', evacuations: '', securityReports: '', emergencies: ''},
    { id: 2, metric: 'عدد الطلبات المنفذة', cardActivations: '', visitors: '', supplierVisitors: '', hallBookings: '', evacuations: '', securityReports: '', emergencies: ''},
];

const initialTasksData: TaskItem[] = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    subject: '',
    task: '',
}));

const initialChallengesData: ChallengeItem[] = [
    { id: 1, challenges: '', update: '', recommendation: '' },
    { id: 2, challenges: '', update: '', recommendation: '' },
];

const initialApprovalData: SignatureData[] = [
    { id: 1, title: 'إعداد', name: 'محمد سالم احمد', role: 'ضابط اول خدمات المرافق والاصول', signatureImage: null },
    { id: 2, title: 'مراجعة واعتماد', name: 'خالد محمد سالم', role: 'رئيس قسم ادارة المرافق', signatureImage: null },
];

const getInitialRequestColumnWidths = () => {
    const initialWidths: { [key: string]: number } = {
        metric: 120,
        total: 160,
    };
    initialDistributionChannels.forEach(channel => {
        initialWidths[channel.id] = 220;
    });
    return initialWidths;
};


const initialReportState = {
    servicesData: initialServicesData,
    leaseContractsData: initialLeaseContractsData,
    commercialLicensesData: initialCommercialLicensesData,
    serviceContractsData: initialServiceContractsData,
    malfunctionSummaryData: initialMalfunctionSummaryData,
    malfunctionDetailData: initialMalfunctionDetailData,
    requestDistributionData: initialRequestDistributionData,
    distributionChannels: initialDistributionChannels,
    securityReportData: initialSecurityReportData,
    tasksData: initialTasksData,
    challengesData: initialChallengesData,
    approvalData: initialApprovalData,
    requestTableHeaders: {
        metric: 'الطلبات',
        total: 'اجمالي عدد الطلبات'
    },
    requestColumnWidths: getInitialRequestColumnWidths(),
};

// --- Components ---

//--- Component: EditableCell.tsx ---
interface EditableCellProps {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'number';
  className?: string;
  placeholder?: string;
  suffix?: string;
}

const EditableCell: React.FC<EditableCellProps> = ({ value, onChange, type = 'text', className = '', placeholder = '0', suffix }) => {
  const hasValue = value !== '' && value !== null && value !== undefined && value !== 0 && value !== '0';

  if (suffix) {
    return (
      <td className={`p-0 border ${className}`}>
        <div className="relative w-full h-full flex items-center justify-center">
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full h-full py-2 px-4 bg-transparent border-none text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {hasValue && (
            <span className="absolute left-3 text-xs text-gray-500 pointer-events-none">
              {suffix}
            </span>
          )}
        </div>
      </td>
    );
  }

  return (
    <td className={`p-0 border ${className}`}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-full py-2 px-4 bg-transparent border-none text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </td>
  );
};

//--- Component: ServicesTable.tsx ---
interface ServicesTableProps {
  data: ServiceRequest[];
  onUpdate: (index: number, field: keyof ServiceRequest, value: string) => void;
  onAdd: () => void;
  onDelete: (id: number) => void;
}

const ServicesTable: React.FC<ServicesTableProps> = ({ data, onUpdate, onAdd, onDelete }) => {
    const TrashIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
        </svg>
    );

    const calculateCompletion = (received: string, completed: string) => {
        const receivedNum = parseFloat(received);
        const completedNum = parseFloat(completed);
        if (isNaN(receivedNum) || isNaN(completedNum) || receivedNum === 0) {
            return '0%';
        }
        return `${((completedNum / receivedNum) * 100).toFixed(0)}%`;
    };

    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-slate-700 text-white">
                        <tr>
                            <th className="py-2 px-4 border w-16">م</th>
                            <th className="py-2 px-4 border text-center">الخدمات</th>
                            <th className="py-2 px-4 border">عدد الطلبات المستلمة</th>
                            <th className="py-2 px-4 border">عدد الطلبات المنفذه</th>
                            <th className="py-2 px-4 border">نسبة الانجاز</th>
                            <th className="py-2 px-4 border w-24 no-print">إجراء</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={row.id} className="text-center text-gray-700 hover:bg-gray-50 text-sm">
                                <td className="py-2 px-4 border bg-slate-700 text-white font-bold">{index + 1}</td>
                                <EditableCell value={row.service} onChange={(e) => onUpdate(index, 'service', e.target.value)} placeholder="أدخل الخدمة" />
                                <EditableCell type="number" value={row.received} onChange={(e) => onUpdate(index, 'received', e.target.value)} />
                                <EditableCell type="number" value={row.completed} onChange={(e) => onUpdate(index, 'completed', e.target.value)} />
                                <td className="py-2 px-4 border font-semibold text-xs">{calculateCompletion(row.received, row.completed)}</td>
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
                إضافة صف جديد
            </button>
        </>
    );
};

//--- Component: ContractsTable.tsx ---
interface ContractsTableProps {
  title: string;
  data: ContractStatus[];
  onUpdate: (index: number, field: keyof ContractStatus, value: string) => void;
}

const ContractsTable: React.FC<ContractsTableProps> = ({ title, data, onUpdate }) => {
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

//--- Component: MalfunctionsSummaryTable.tsx ---
interface MalfunctionsSummaryTableProps {
  data: MalfunctionSummary[];
  onUpdate: (index: number, field: keyof MalfunctionSummary, value: string) => void;
}

const MalfunctionsSummaryTable: React.FC<MalfunctionsSummaryTableProps> = ({ data, onUpdate }) => {
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

//--- Component: MalfunctionsDetailTable.tsx ---
interface MalfunctionsDetailTableProps {
  data: MalfunctionDetail[];
  onUpdate: (index: number, field: keyof MalfunctionDetail, value: string) => void;
  onAdd: () => void;
  onDelete: (id: number) => void;
}

const MalfunctionsDetailTable: React.FC<MalfunctionsDetailTableProps> = ({ data, onUpdate, onAdd, onDelete }) => {
  const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
  );

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
                            <EditableCell type="number" value={row.general} onChange={(e) => onUpdate(index, 'general', e.target.value)} />
                            <EditableCell type="number" value={row.furniture} onChange={(e) => onUpdate(index, 'furniture', e.target.value)} />
                            <EditableCell type="number" value={row.decor} onChange={(e) => onUpdate(index, 'decor', e.target.value)} />
                            <EditableCell type="number" value={row.flooring} onChange={(e) => onUpdate(index, 'flooring', e.target.value)} />
                            <EditableCell type="number" value={row.doors} onChange={(e) => onUpdate(index, 'doors', e.target.value)} />
                            <EditableCell type="number" value={row.fireAlarm} onChange={(e) => onUpdate(index, 'fireAlarm', e.target.value)} />
                            <EditableCell type="number" value={row.lighting} onChange={(e) => onUpdate(index, 'lighting', e.target.value)} />
                            <EditableCell type="number" value={row.electrical} onChange={(e) => onUpdate(index, 'electrical', e.target.value)} />
                            <EditableCell type="number" value={row.ac} onChange={(e) => onUpdate(index, 'ac', e.target.value)} />
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

//--- Component: RequestsDistributionTable.tsx ---
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

const RequestsDistributionTable: React.FC<RequestsDistributionTableProps> = ({ 
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
    const newWidth = Math.max(startWidth + dx, 80);
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
                <tr key={receivedRow.id} className="text-center text-gray-700 hover:bg-gray-50 whitespace-nowrap">
                    <EditableCell
                        value={receivedRow.metric}
                        onChange={(e) => onUpdate(0, 'metric', e.target.value)}
                        className="font-semibold"
                        placeholder="أدخل المقياس"
                    />
                    <td rowSpan={3} className="p-0 border align-top">
                        <div className="h-full flex flex-col">
                            <div className="flex-1 flex items-center justify-center py-2 px-4 text-gray-700">
                                {receivedRow.total || '0'}
                            </div>
                            <div className="flex-1 border-t border-gray-200 flex items-center justify-center py-2 px-4 text-gray-700 gap-2 text-sm">
                                <span>{completedRow.total || '0'}</span>
                            </div>
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
                <tr key={completedRow.id} className="text-center text-gray-700 hover:bg-gray-50 text-sm">
                    <EditableCell
                        value={completedRow.metric}
                        onChange={(e) => onUpdate(1, 'metric', e.target.value)}
                        className="font-semibold"
                        placeholder="أدخل المقياس"
                    />
                    {channels.map(channel => (
                        <EditableCell
                            key={channel.id}
                            type="number"
                            value={completedRow.values[channel.id] || ''}
                            onChange={(e) => onUpdate(1, channel.id, e.target.value)}
                        />
                    ))}
                </tr>
                 <tr key={percentageRow.id} className="text-center text-gray-700 bg-slate-100 font-semibold whitespace-nowrap">
                    <td className="py-2 px-4 border text-center font-semibold">{percentageRow.metric}</td>
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

//--- Component: SecurityReportTable.tsx ---
interface SecurityReportTableProps {
  data: SecurityReportItem[];
  onUpdate: (index: number, field: keyof SecurityReportItem, value: string) => void;
}

const SecurityReportTable: React.FC<SecurityReportTableProps> = ({ data, onUpdate }) => {
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

//--- Component: TasksTable.tsx ---
interface TasksTableProps {
  data: TaskItem[];
  onUpdate: (index: number, field: keyof TaskItem, value: string) => void;
  onAdd: () => void;
  onDelete: (id: number) => void;
}

const TasksTable: React.FC<TasksTableProps> = ({ data, onUpdate, onAdd, onDelete }) => {
  const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
  );

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

//--- Component: ChallengesTable.tsx ---
interface ChallengesTableProps {
  data: ChallengeItem[];
  onUpdate: (index: number, field: keyof ChallengeItem, value: string) => void;
  onAdd: () => void;
  onDelete: (id: number) => void;
}

const ChallengesTable: React.FC<ChallengesTableProps> = ({ data, onUpdate, onAdd, onDelete }) => {
  const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
  );

  return (
    <>
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-slate-700 text-white">
                    <tr>
                        <th className="py-2 px-4 border w-16">م</th>
                        <th className="py-2 px-4 border">التحديات والعوائق</th>
                        <th className="py-2 px-4 border">التحديث</th>
                        <th className="py-2 px-4 border">التوصية</th>
                        <th className="py-2 px-4 border w-24 no-print">إجراء</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={row.id} className="text-center text-gray-700 hover:bg-gray-50">
                            <td className="py-2 px-4 border bg-slate-700 text-white font-bold">{index + 1}</td>
                            <EditableCell value={row.challenges} onChange={(e) => onUpdate(index, 'challenges', e.target.value)} placeholder="-" />
                            <EditableCell value={row.update} onChange={(e) => onUpdate(index, 'update', e.target.value)} placeholder="-" />
                            <EditableCell value={row.recommendation} onChange={(e) => onUpdate(index, 'recommendation', e.target.value)} placeholder="-" />
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
            إضافة صف جديد
        </button>
    </>
  );
};

//--- Component: ApprovalSection.tsx ---
interface SignatureBoxProps {
    title: string;
    name: string;
    role: string;
    signatureImage: string | null;
    onUpdate: (field: 'name' | 'role' | 'signatureImage', value: string | null) => void;
}

const SignatureBox: React.FC<SignatureBoxProps> = ({ title, name, role, signatureImage, onUpdate }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const formattedDate = new Date().toLocaleDateString('ar-AE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const handleSignatureClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                onUpdate('signatureImage', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveSignature = (e: React.MouseEvent) => {
        e.stopPropagation();
        onUpdate('signatureImage', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden flex flex-col">
            <div className="bg-slate-700 p-3 text-white text-center">
                <h3 className="font-bold text-lg">{title}</h3>
            </div>
            <div className="p-6 flex-grow flex flex-col">
                <div className="flex-grow space-y-6">
                    <div>
                        <label className="text-sm font-medium text-gray-500">الاسم</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => onUpdate('name', e.target.value)}
                            className="signature-input w-full bg-transparent border-0 border-b-2 border-gray-300 text-gray-800 p-2 focus:ring-0 focus:border-blue-500 focus:outline-none text-base transition-colors duration-300"
                            aria-label={`${title} Name`}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-500">المنصب</label>
                         <input
                            type="text"
                            value={role}
                            onChange={(e) => onUpdate('role', e.target.value)}
                            className="signature-input w-full bg-transparent border-0 border-b-2 border-gray-300 text-sm text-gray-600 p-2 focus:ring-0 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                            aria-label={`${title} Role`}
                        />
                    </div>
                </div>
                <div className="mt-10">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-800 font-semibold">التاريخ:</span>
                        <span className="w-3/5 text-center font-medium text-black">{formattedDate}</span>
                    </div>
                    <div className="flex justify-between items-start text-sm mt-6">
                        <span className="text-gray-800 font-semibold pt-4">التوقيع:</span>
                        <div 
                            className="w-3/5 h-24 border-2 border-dashed border-gray-400 rounded-md flex justify-center items-center cursor-pointer hover:bg-gray-50 relative group transition-colors duration-300"
                            onClick={handleSignatureClick}
                            role="button"
                            tabIndex={0}
                            aria-label="Add signature"
                        >
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                className="hidden" 
                                accept="image/png, image/jpeg, image/svg+xml" 
                            />
                            {signatureImage ? (
                                <>
                                    <img src={signatureImage} alt="Signature" className="max-w-full max-h-full object-contain p-2" />
                                    <button 
                                        onClick={handleRemoveSignature} 
                                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs shadow-lg hover:bg-red-700"
                                        aria-label="Remove signature"
                                    >
                                        ✕
                                    </button>
                                </>
                            ) : (
                                <span className="text-gray-500 text-xs text-center">انقر لإضافة توقيع</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface ApprovalSectionProps {
    data: SignatureData[];
    onUpdate: (index: number, field: keyof SignatureData, value: string | null) => void;
}

const ApprovalSection: React.FC<ApprovalSectionProps> = ({ data, onUpdate }) => {
  return (
    <div className="pt-8 border-t-2 border-gray-200 approval-section">
        <div className="flex flex-col md:flex-row gap-8">
            {data.map((signature, index) => (
                 <SignatureBox
                    key={signature.id}
                    title={signature.title}
                    name={signature.name}
                    role={signature.role}
                    signatureImage={signature.signatureImage}
                    onUpdate={(field, value) => onUpdate(index, field, value)}
                />
            ))}
        </div>
    </div>
  );
};

//--- Component: Footer.tsx ---
const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-900 text-gray-300 no-print">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-8">
                    <div className="lg:col-span-2">
                        <h3 className="text-lg font-bold text-white mb-2">عن SAHER</h3>
                        <div className="w-12 h-0.5 bg-yellow-400 mb-4"></div>
                        <p className="text-sm leading-relaxed">
                            شركة رائدة في تقديم الحلول والأنظمة الذكية، ملتزمون بالابتكار والجودة لتحقيق أعلى مستويات الكفاءة والخدمات الذكية.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2">روابط سريعة</h3>
                        <div className="w-12 h-0.5 bg-yellow-400 mb-4"></div>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors duration-300">الرئيسية</a></li>
                            <li><a href="#" className="hover:text-white transition-colors duration-300">خدماتنا</a></li>
                            <li><a href="#" className="hover:text-white transition-colors duration-300">تواصل معنا</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2">تواصل معنا</h3>
                        <div className="w-12 h-0.5 bg-yellow-400 mb-4"></div>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>Level 3, Baynona Building, Khalif City A</span>
                            </li>
                            <li className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="whitespace-nowrap" dir="ltr">+971 4 123 4567</span>
                            </li>
                            <li className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <a href="mailto:Logistic@saher.ae" className="hover:text-white transition-colors duration-300">Logistic@saher.ae</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col items-center text-sm text-gray-400 pb-8">
                    <p> اعداد وتصميم / خالد الجفري</p>
                    <p className="mt-2">جميع الحقوق محفوظة لشركة © {new Date().getFullYear()} SAHER FOR SMART SERVICES</p>
                </div>
            </div>
        </footer>
    );
};

//--- Component: CollapsibleSection.tsx ---
interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, isOpen, onToggle, children }) => {
    const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-6 w-6 text-white transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="2"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
    );

    return (
        <section className="mb-6 print:mb-0">
            <h2 className="hidden print:block text-xl font-bold text-gray-700">{title}</h2>
            <div className="rounded-lg shadow-md overflow-hidden no-print">
                <button
                    type="button"
                    onClick={onToggle}
                    className="w-full flex justify-between items-center p-4 text-right bg-slate-800 text-white font-bold text-xl transition-colors duration-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-expanded={isOpen}
                >
                    <span>{title}</span>
                    <ChevronIcon isOpen={isOpen} />
                </button>
                <div
                    className={`collapsible-content bg-white transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                    <div className="p-6 border-t border-slate-700">
                        {children}
                    </div>
                </div>
            </div>
            <div className="hidden print:block">
                {children}
            </div>
        </section>
    );
};


// --- Main App Component ---
const App: React.FC = () => {
    const arabicMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const currentMonthIndex = new Date().getMonth();
    const startYear = 2020;
    const endYear = 2090;
    const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => (startYear + i).toString());

    type ArrayStateKey = {
      [K in keyof typeof initialReportState]: (typeof initialReportState)[K] extends any[] ? K : never
    }[keyof typeof initialReportState];

    const [appState, setAppState] = useState(() => JSON.parse(JSON.stringify(initialReportState)));
    const [reportDate, setReportDate] = useState({
        month: arabicMonths[currentMonthIndex],
        year: new Date().getFullYear().toString(),
    });
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
        services: true,
        contracts: true,
        malfunctionsSummary: true,
        malfunctionsDetail: true,
        logistics: true,
        security: true,
        tasks: true,
        challenges: true,
        approval: true,
    });

    useEffect(() => {
        const loadData = () => {
            const key = `report-data-${reportDate.year}-${reportDate.month}`;
            const savedData = localStorage.getItem(key);
            if (savedData) {
                try {
                    const parsedData = JSON.parse(savedData);
                    if (parsedData.servicesData && parsedData.requestTableHeaders) {
                       setAppState(parsedData);
                    } else {
                       setAppState(JSON.parse(JSON.stringify(initialReportState)));
                    }
                } catch (error) {
                    console.error("Failed to parse saved data, resetting to initial state.", error);
                    setAppState(JSON.parse(JSON.stringify(initialReportState)));
                }
            } else {
                setAppState(JSON.parse(JSON.stringify(initialReportState)));
            }
        };
        loadData();
    }, [reportDate]);

    const handleSaveData = () => {
        setSaveStatus('saving');
        try {
            const key = `report-data-${reportDate.year}-${reportDate.month}`;
            const dataToSave = JSON.stringify(appState);
            localStorage.setItem(key, dataToSave);
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2500);
        } catch (error) {
            console.error("Failed to save data", error);
            alert("حدث خطأ أثناء حفظ البيانات.");
            setSaveStatus('idle');
        }
    };
    
    const saveButtonText = {
        idle: 'حفظ البيانات',
        saving: 'جاري الحفظ...',
        saved: 'تم الحفظ بنجاح!',
    };

    const toggleSection = (sectionId: string) => {
        setOpenSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
    };

    const handleStateUpdate = <K extends ArrayStateKey>(
        stateKey: K,
        index: number,
        field: keyof (typeof appState)[K][number],
        value: string | null
    ) => {
        setAppState(prev => {
            const newState = { ...prev };
            const newArray = [...newState[stateKey]];
            newArray[index] = { ...newArray[index], [field]: value };
            return { ...newState, [stateKey]: newArray };
        });
    };

    const handleAddItem = <K extends ArrayStateKey>(
        stateKey: K,
        newItemData: Omit<(typeof appState)[K][number], 'id'>
    ) => {
        setAppState(prev => {
            const newArray = [...prev[stateKey], { ...newItemData, id: Date.now() }];
            return { ...prev, [stateKey]: newArray };
        });
    };

    const handleDeleteItem = <K extends ArrayStateKey>(
        stateKey: K,
        idToDelete: number
    ) => {
         setAppState(prev => {
            const oldArray = prev[stateKey] as { id: number }[];
            const newArray = oldArray.filter((item) => item.id !== idToDelete);
            return { ...prev, [stateKey]: newArray };
        });
    };

    const handleAddMalfunctionDetailItem = () => {
        setAppState(prev => {
            const newData = [...prev.malfunctionDetailData];
            const newItem: MalfunctionDetail = {
                id: Date.now(), location: 'مقر جديد', general: '', furniture: '', decor: '', fireAlarm: '', waterLeak: '', doors: '', lighting: '', flooring: '', ac: '', exterior: '', panels: '', electrical: '', elevators: '',
            };
            newData.splice(newData.length - 2, 0, newItem);
            return { ...prev, malfunctionDetailData: newData };
        });
    };
    
    const handleRequestDistributionUpdate = (rowIndex: number, field: string, value: string) => {
        setAppState(prev => {
            const newRequestData = [...prev.requestDistributionData];
            const rowToUpdate = { ...newRequestData[rowIndex] };

            if (field === 'metric') {
                rowToUpdate.metric = value;
            } else {
                rowToUpdate.values = { ...rowToUpdate.values, [field]: value };
                if (rowIndex === 0 || rowIndex === 1) {
                    const newTotal = Object.values(rowToUpdate.values)
                                           .reduce((sum: number, val: string) => sum + (parseFloat(val) || 0), 0);
                    rowToUpdate.total = newTotal.toString();
                }
            }
            
            newRequestData[rowIndex] = rowToUpdate;
            return { ...prev, requestDistributionData: newRequestData };
        });
    };

    const handleRequestTableHeaderUpdate = (field: 'metric' | 'total', value: string) => {
        setAppState(prev => ({
            ...prev,
            requestTableHeaders: { ...prev.requestTableHeaders, [field]: value }
        }));
    };
    
    const handleChannelNameUpdate = (channelId: string, newName: string) => {
        setAppState(prev => ({
            ...prev,
            distributionChannels: prev.distributionChannels.map(ch => ch.id === channelId ? { ...ch, name: newName } : ch)
        }));
    };

    const handleRequestColumnWidthUpdate = (columnId: string, width: number) => {
        setAppState(prev => ({
            ...prev,
            requestColumnWidths: { ...prev.requestColumnWidths, [columnId]: width }
        }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setReportDate(prev => ({ ...prev, [name]: value }));
    };

    const handlePrintToPdf = () => {
        const printableArea = document.querySelector('.printable-area');
        if (!printableArea) return;
    
        const header = printableArea.querySelector('header');
        const main = printableArea.querySelector('main');
    
        const headerOriginalClasses = header?.className;
        const mainOriginalClasses = main?.className;
    
        if (header) header.classList.remove('p-6');
        if (main) main.classList.remove('p-8');
    
        const restoreClasses = () => {
            if (header && headerOriginalClasses) header.className = headerOriginalClasses;
            if (main && mainOriginalClasses) main.className = mainOriginalClasses;
        };
    
        const options = {
            margin:       0,
            filename:     `تقرير-شهر-${reportDate.month}-${reportDate.year}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, logging: false, dpi: 192, letterRendering: true },
            jsPDF:        { unit: 'mm', format: 'a3', orientation: 'landscape' },
            pagebreak:    { mode: ['css', 'avoid-all'] }
        };
    
        html2pdf().from(printableArea).set(options).save().then(restoreClasses).catch((err: any) => {
            console.error("PDF generation failed:", err);
            restoreClasses();
        });
    };

    const handleNativePrint = () => window.print();

    const handleExportToExcel = () => {
        const wb = XLSX.utils.book_new();
        const dataToExport: (string|number)[][] = [];
    
        const addSection = (title: string, headers: (string|number)[], data: (string|number)[][]) => {
            dataToExport.push([title]);
            if (headers.length > 0) {
                dataToExport.push(headers);
            }
            data.forEach(row => dataToExport.push(row));
            dataToExport.push([]);
        };
    
        addSection('ملخص التقرير', 
            ['م', 'الخدمات', 'عدد الطلبات المستلمة', 'عدد الطلبات المنفذه', 'نسبة الانجاز'],
            appState.servicesData.map((row, index) => {
                const receivedNum = parseFloat(row.received);
                const completedNum = parseFloat(row.completed);
                const completion = (isNaN(receivedNum) || isNaN(completedNum) || receivedNum === 0) ? '0%' : `${((completedNum / receivedNum) * 100).toFixed(0)}%`;
                return [index + 1, row.service, row.received, row.completed, completion];
            })
        );
    
        const contractsData = [
            ['عدد العقود الايجارية', 'فعالة', 'غير فعالة', 'الملاحظات'], ...appState.leaseContractsData.map(row => ['', row.active, row.inactive, row.notes]), [],
            ['عدد الرخص التجارية', 'فعالة', 'غير فعالة', 'الملاحظات'], ...appState.commercialLicensesData.map(row => ['', row.active, row.inactive, row.notes]), [],
            ['عدد عقود الخدمات', 'فعالة', 'غير فعالة', 'الملاحظات'], ...appState.serviceContractsData.map(row => ['', row.active, row.inactive, row.notes]),
        ];
        dataToExport.push(['العقود والرخص']);
        contractsData.forEach(row => dataToExport.push(row));
        dataToExport.push([]);
    
        const summaryTotal = appState.malfunctionSummaryData.reduce((acc, curr) => acc + (parseFloat(curr.count) || 0), 0);
        const summaryData = appState.malfunctionSummaryData.map(row => [row.description, row.count]);
        summaryData.push(['اجمالي عدد الاعطال', summaryTotal.toString()]);
        addSection('خدمات الصيانة - الملخص', ['الوصف', 'عدد الاعطال'], summaryData);
    
        addSection('خدمات الصيانة - تفصيل الأعطال', 
            ['المقرات', 'اعطال عامة', 'اثاث', 'ديكور', 'ارضيات', 'ابواب', 'انذار حريق', 'انارة', 'كهرباء', 'تكييف', 'تسريب ماء', 'عطل اللوحات الخارجية', 'مصاعد'],
            appState.malfunctionDetailData.map(row => [row.location, row.general, row.furniture, row.decor, row.flooring, row.doors, row.fireAlarm, row.lighting, row.electrical, row.ac, row.waterLeak, row.panels, row.elevators])
        );
    
        const logisticsHeaders = [appState.requestTableHeaders.metric, appState.requestTableHeaders.total, ...appState.distributionChannels.map(c => c.name)];
        const receivedRow = appState.requestDistributionData[0];
        const completedRow = appState.requestDistributionData[1];
        const percentageRow = appState.requestDistributionData[2];
        const calculateExcelPercentage = (receivedStr: string, completedStr: string) => {
            const received = parseFloat(receivedStr) || 0;
            const completed = parseFloat(completedStr) || 0;
            return (received === 0) ? '0%' : `${((completed / received) * 100).toFixed(0)}%`;
        };
        const logisticsData = [
            [receivedRow.metric, receivedRow.total, ...appState.distributionChannels.map(c => receivedRow.values[c.id] || '')],
            [completedRow.metric, completedRow.total, ...appState.distributionChannels.map(c => completedRow.values[c.id] || '')],
            [percentageRow.metric, calculateExcelPercentage(receivedRow.total, completedRow.total), ...appState.distributionChannels.map(c => calculateExcelPercentage(receivedRow.total, completedRow.values[c.id] || '0'))]
        ];
        addSection('خدمات الدعم اللوجيستي', logisticsHeaders, logisticsData);
    
        addSection('التقارير الأمنية', 
            ['الطلبات', 'طلبات تفعيل البطاقات', 'عدد الزوار', 'عدد الزوار من الموردين', 'طلبات حجز القاعات', 'حالات الاخلاء', 'تقارير الأمنية', 'الحالات الطارئة'],
            appState.securityReportData.map(row => [row.metric, row.cardActivations, row.visitors, row.supplierVisitors, row.hallBookings, row.evacuations, row.securityReports, row.emergencies])
        );
    
        addSection('المهمات المنجزة', 
            ['م', 'الموضوع', 'المهمة', 'نسبة الانجاز'],
            appState.tasksData.map((row, index) => [index + 1, row.subject, row.task, '100%'])
        );
    
        addSection('التحديات والتوصيات', 
            ['م', 'التحديات والعوائق', 'التحديث', 'التوصية'],
            appState.challengesData.map((row, index) => [index + 1, row.challenges, row.update, row.recommendation])
        );
    
        addSection('التوقيعات والاعتماد', 
            ['الصفة', 'الاسم', 'المنصب'],
            appState.approvalData.map(row => [row.title, row.name, row.role])
        );
        
        const ws = XLSX.utils.aoa_to_sheet(dataToExport);
        const maxCols = Math.max(...dataToExport.map(r => r.length > 0 ? r.length : 1), 1);
        const colWidths = Array(maxCols).fill({ wch: 20 });
        if (colWidths.length > 1) colWidths[1] = { wch: 35 };
        ws['!cols'] = colWidths;
        ws['!merges'] = [];
        dataToExport.forEach((row, r) => {
            if (row.length === 1 && typeof row[0] === 'string' && row[0].trim() !== '') {
                ws['!merges'].push({ s: { r: r, c: 0 }, e: { r: r, c: maxCols - 1 } });
                const cellRef = XLSX.utils.encode_cell({ r: r, c: 0 });
                if (ws[cellRef]) ws[cellRef].s = { alignment: { horizontal: 'center', vertical: 'center' } };
            }
        });
    
        XLSX.utils.book_append_sheet(wb, ws, "التقرير الشهري المجمع");
        XLSX.writeFile(wb, `تقرير-شهر-${reportDate.month}-${reportDate.year}.xlsx`);
    };

    return (
        <>
            <div className="max-w-7xl mx-auto p-4 sm:p-8 bg-gray-100">
                <div className="printable-area bg-white shadow-lg rounded-lg">
                    <header className="bg-slate-900 p-6 rounded-t-lg">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-white text-center sm:text-right">تقرير الأداء الشهري - قسم إدارة المرافق</h1>
                                <p className="no-print text-lg text-gray-300 text-center sm:text-right mt-1">
                                    تقرير شهر - {reportDate.month} {reportDate.year}
                                </p>
                            </div>
                            <div className="flex items-center flex-wrap justify-center gap-2">
                                <button onClick={handleNativePrint} className="no-print bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center w-40">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                    طباعة
                                </button>
                                 <button onClick={handlePrintToPdf} className="no-print bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center w-40">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    تحميل PDF
                                </button>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-y-3 no-print">
                            <div>
                                <div className="flex items-center flex-wrap gap-x-6 gap-y-3">
                                    <span className="text-white font-bold text-lg">تحديد فترة التقرير:</span>
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="month-select" className="text-white font-semibold">الشهر:</label>
                                        <select id="month-select" name="month" value={reportDate.month} onChange={handleDateChange} className="bg-slate-800 text-white border border-slate-600 rounded-md px-3 py-1 focus:ring-blue-500 focus:border-blue-500">
                                            {arabicMonths.map(month => <option key={month} value={month}>{month}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="year-select" className="text-white font-semibold">السنة:</label>
                                        <select id="year-select" name="year" value={reportDate.year} onChange={handleDateChange} className="bg-slate-800 text-white border border-slate-600 rounded-md px-3 py-1 focus:ring-blue-500 focus:border-blue-500">
                                            {years.map(year => <option key={year} value={year}>{year}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <p className="text-gray-300 text-base mt-2">شركة ساهر للخدمات الذكية</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleSaveData}
                                    disabled={saveStatus === 'saving'}
                                    className={`no-print text-white py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center w-40
                                        ${saveStatus === 'saved' ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4m0 0H9m3 0a2 2 0 012 2v2" />
                                    </svg>
                                    {saveButtonText[saveStatus]}
                                </button>
                                <button onClick={handleExportToExcel} className="no-print bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center w-40">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4m0 0h-2m2 0h-4m4 0h-6m4 0H6m6 0h2m4 6l-4-4-4 4m4-4v12" /></svg>
                                    تصدير Excel
                                </button>
                            </div>
                        </div>
                        <div className="hidden print:block pt-4 text-center">
                            <p className="text-xl font-bold">تقرير شهر {reportDate.month} {reportDate.year}</p>
                        </div>
                    </header>

                    <main className="p-8">
                        <CollapsibleSection title="ملخص التقرير" isOpen={openSections.services} onToggle={() => toggleSection('services')}>
                            <ServicesTable data={appState.servicesData} onUpdate={(index, field, value) => handleStateUpdate('servicesData', index, field, value)} onAdd={() => handleAddItem('servicesData', { service: 'خدمة جديدة', received: '', completed: '' })} onDelete={(id) => handleDeleteItem('servicesData', id)} />
                        </CollapsibleSection>
                        
                        <CollapsibleSection title="العقود والرخص" isOpen={openSections.contracts} onToggle={() => toggleSection('contracts')}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 components-grid">
                                <ContractsTable title="عدد العقود الايجارية" data={appState.leaseContractsData} onUpdate={(index, field, value) => handleStateUpdate('leaseContractsData', index, field, value)} />
                                <ContractsTable title="عدد الرخص التجارية" data={appState.commercialLicensesData} onUpdate={(index, field, value) => handleStateUpdate('commercialLicensesData', index, field, value)} />
                                <ContractsTable title="عدد عقود الخدمات" data={appState.serviceContractsData} onUpdate={(index, field, value) => handleStateUpdate('serviceContractsData', index, field, value)} />
                            </div>
                        </CollapsibleSection>

                        <CollapsibleSection title="خدمات الصيانة" isOpen={openSections.malfunctionsSummary} onToggle={() => toggleSection('malfunctionsSummary')}>
                            <MalfunctionsSummaryTable data={appState.malfunctionSummaryData} onUpdate={(index, field, value) => handleStateUpdate('malfunctionSummaryData', index, field, value)} />
                        </CollapsibleSection>

                        <CollapsibleSection title="تفصيل الأعطال حسب المقر" isOpen={openSections.malfunctionsDetail} onToggle={() => toggleSection('malfunctionsDetail')}>
                            <MalfunctionsDetailTable data={appState.malfunctionDetailData} onUpdate={(index, field, value) => handleStateUpdate('malfunctionDetailData', index, field, value)} onAdd={handleAddMalfunctionDetailItem} onDelete={(id) => handleDeleteItem('malfunctionDetailData', id)} />
                        </CollapsibleSection>

                        <CollapsibleSection title="خدمات الدعم اللوجيستي" isOpen={openSections.logistics} onToggle={() => toggleSection('logistics')}>
                            <RequestsDistributionTable data={appState.requestDistributionData} channels={appState.distributionChannels} headers={appState.requestTableHeaders} columnWidths={appState.requestColumnWidths} onUpdate={handleRequestDistributionUpdate} onHeaderUpdate={handleRequestTableHeaderUpdate} onChannelNameUpdate={handleChannelNameUpdate} onColumnWidthUpdate={handleRequestColumnWidthUpdate} />
                        </CollapsibleSection>

                        <CollapsibleSection title="طلبات تفعيل البطاقات والتقارير الأمنية" isOpen={openSections.security} onToggle={() => toggleSection('security')}>
                             <SecurityReportTable data={appState.securityReportData} onUpdate={(index, field, value) => handleStateUpdate('securityReportData', index, field, value)} />
                        </CollapsibleSection>

                        <CollapsibleSection title="المهمات المنجزة" isOpen={openSections.tasks} onToggle={() => toggleSection('tasks')}>
                            <TasksTable data={appState.tasksData} onUpdate={(index, field, value) => handleStateUpdate('tasksData', index, field, value)} onAdd={() => handleAddItem('tasksData', { subject: '', task: '' })} onDelete={(id) => handleDeleteItem('tasksData', id)} />
                        </CollapsibleSection>

                        <CollapsibleSection title="التحديات والتوصيات" isOpen={openSections.challenges} onToggle={() => toggleSection('challenges')}>
                            <ChallengesTable data={appState.challengesData} onUpdate={(index, field, value) => handleStateUpdate('challengesData', index, field, value)} onAdd={() => handleAddItem('challengesData', { challenges: '', update: '', recommendation: '' })} onDelete={(id) => handleDeleteItem('challengesData', id)} />
                        </CollapsibleSection>

                        <CollapsibleSection title="التوقيعات والاعتماد" isOpen={openSections.approval} onToggle={() => toggleSection('approval')}>
                            <ApprovalSection data={appState.approvalData} onUpdate={(index, field, value) => handleStateUpdate('approvalData', index, field, value)} />
                        </CollapsibleSection>
                    </main>
                </div>
            </div>
            <Footer />
        </>
    );
};

// --- App Mounting ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
