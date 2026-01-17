
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

// --- Global Declarations ---
// FIX: Uncommented to declare global variables for external libraries.
declare const html2pdf: any;
declare const XLSX: any;

// --- Constants (from constants.ts) ---
const initialServicesData = [
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

const initialLeaseContractsData = [
    { id: 1, active: '', inactive: '', notes: '' },
];

const initialCommercialLicensesData = [
    { id: 1, active: '', inactive: '', notes: '' },
];

const initialServiceContractsData = [
    { id: 1, active: '', inactive: '', notes: '' },
];

const initialMalfunctionSummaryData = [
    { id: 1, description: 'عدد طلبات الصيانة الواردة من قسم إدارة المرافق', count: '' },
    { id: 2, description: 'عدد طلبات الصيانة الواردة من الادارات الأخرى', count: '' },
];

const initialMalfunctionDetailData = [
    { id: 1, location: 'مقر انجازات', general: '', furniture: '', decor: '', fireAlarm: '', waterLeak: '', doors: '', lighting: '', flooring: '', ac: '', exterior: '', panels: '', electrical: '', elevators: '' },
    { id: 2, location: 'مقر الدوريات', general: '', furniture: '', decor: '', fireAlarm: '', waterLeak: '', doors: '', lighting: '', flooring: '', ac: '', exterior: '', panels: '', electrical: '', elevators: '' },
    { id: 3, location: 'مقر ابن بطوطة', general: '', furniture: '', decor: '', fireAlarm: '', waterLeak: '', doors: '', lighting: '', flooring: '', ac: '', exterior: '', panels: '', electrical: '', elevators: '' },
    { id: 4, location: 'مقر تقييم عجمان', general: '', furniture: '', decor: '', fireAlarm: '', waterLeak: '', doors: '', lighting: '', flooring: '', ac: '', exterior: '', panels: '', electrical: '', elevators: '' },
    { id: 5, location: 'مقر دوريات عجمان', general: '', furniture: '', decor: '', fireAlarm: '', waterLeak: '', doors: '', lighting: '', flooring: '', ac: '', exterior: '', panels: '', electrical: '', elevators: '' },
    { id: 6, location: 'التكلفة / النثرية', general: '', furniture: '', decor: '', fireAlarm: '', waterLeak: '', doors: '', lighting: '', flooring: '', ac: '', exterior: '', panels: '', electrical: '', elevators: '' },
    { id: 7, location: 'التكلفة / أمر شراء', general: '', furniture: '', decor: '', fireAlarm: '', waterLeak: '', doors: '', lighting: '', flooring: '', ac: '', exterior: '', panels: '', electrical: '', elevators: '' },
];

const initialDistributionChannels = [
    { id: 'representative', name: 'الطلبات من خلال المندوب' },
    { id: 'emiratesPost', name: 'الطلبات من خلال بريد الامارات' },
    { id: 'aramex', name: 'الطلبات من خلال ارامكس' },
    { id: 'distribution', name: 'الطلبات من خلال توزيع' },
];

const initialRequestDistributionData = [
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


const initialSecurityReportData = [
    { id: 1, metric: 'عدد الطلبات المستلمة', cardActivations: '', visitors: '', supplierVisitors: '', hallBookings: '', evacuations: '', securityReports: '', emergencies: ''},
    { id: 2, metric: 'عدد الطلبات المنفذة', cardActivations: '', visitors: '', supplierVisitors: '', hallBookings: '', evacuations: '', securityReports: '', emergencies: ''},
];

const initialTasksData = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    subject: '',
    task: '',
}));

const initialChallengesData = [
    { id: 1, challenges: '', update: '', recommendation: '' },
    { id: 2, challenges: '', update: '', recommendation: '' },
];

const initialApprovalData = [
    { id: 1, title: 'إعداد', name: 'محمد سالم احمد', role: 'ضابط اول خدمات المرافق والاصول', signatureImage: null },
    { id: 2, title: 'مراجعة واعتماد', name: 'خالد محمد سالم', role: 'رئيس قسم ادارة المرافق', signatureImage: null },
];

const getInitialRequestColumnWidths = () => {
    const initialWidths = {
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
const EditableCell = ({ value, onChange, type = 'text', className = '', placeholder = '0', suffix }) => {
  const hasValue = value !== '' && value !== null && value !== undefined && value !== 0 && value !== '0';

  if (suffix) {
    return (
      React.createElement("td", { className: `p-0 border ${className}` },
        React.createElement("div", { className: "relative w-full h-full flex items-center justify-center" },
          React.createElement("input", {
            type: type,
            value: value,
            onChange: onChange,
            placeholder: placeholder,
            className: "w-full h-full py-2 px-4 bg-transparent border-none text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
          }),
          hasValue && (
            React.createElement("span", { className: "absolute left-3 text-xs text-gray-500 pointer-events-none" },
              suffix
            )
          )
        )
      )
    );
  }

  return (
    React.createElement("td", { className: `p-0 border ${className}` },
      React.createElement("input", {
        type: type,
        value: value,
        onChange: onChange,
        placeholder: placeholder,
        className: "w-full h-full py-2 px-4 bg-transparent border-none text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
      })
    )
  );
};

//--- Component: ServicesTable.tsx ---
const ServicesTable = ({ data, onUpdate, onAdd, onDelete }) => {
    const TrashIcon = () => (
        React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor" },
            React.createElement("path", { fillRule: "evenodd", d: "M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z", clipRule: "evenodd" })
        )
    );

    const calculateCompletion = (received, completed) => {
        const receivedNum = parseFloat(received);
        const completedNum = parseFloat(completed);
        if (isNaN(receivedNum) || isNaN(completedNum) || receivedNum === 0) {
            return '0%';
        }
        return `${((completedNum / receivedNum) * 100).toFixed(0)}%`;
    };

    return (
        React.createElement(React.Fragment, null,
            React.createElement("div", { className: "overflow-x-auto" },
                React.createElement("table", { className: "min-w-full bg-white border border-gray-200" },
                    React.createElement("thead", { className: "bg-slate-700 text-white" },
                        React.createElement("tr", null,
                            React.createElement("th", { className: "py-2 px-4 border w-16" }, "م"),
                            React.createElement("th", { className: "py-2 px-4 border text-center" }, "الخدمات"),
                            React.createElement("th", { className: "py-2 px-4 border" }, "عدد الطلبات المستلمة"),
                            React.createElement("th", { className: "py-2 px-4 border" }, "عدد الطلبات المنفذه"),
                            React.createElement("th", { className: "py-2 px-4 border" }, "نسبة الانجاز"),
                            React.createElement("th", { className: "py-2 px-4 border w-24 no-print" }, "إجراء")
                        )
                    ),
                    React.createElement("tbody", null,
                        data.map((row, index) => (
                            React.createElement("tr", { key: row.id, className: "text-center text-gray-700 hover:bg-gray-50 text-sm" },
                                React.createElement("td", { className: "py-2 px-4 border bg-slate-700 text-white font-bold" }, index + 1),
                                React.createElement(EditableCell, { value: row.service, onChange: (e) => onUpdate(index, 'service', e.target.value), placeholder: "أدخل الخدمة" }),
                                React.createElement(EditableCell, { type: "number", value: row.received, onChange: (e) => onUpdate(index, 'received', e.target.value) }),
                                React.createElement(EditableCell, { type: "number", value: row.completed, onChange: (e) => onUpdate(index, 'completed', e.target.value) }),
                                React.createElement("td", { className: "py-2 px-4 border font-semibold text-xs" }, calculateCompletion(row.received, row.completed)),
                                React.createElement("td", { className: "py-2 px-4 border no-print" },
                                    React.createElement("button", { onClick: () => onDelete(row.id), className: "text-red-500 hover:text-red-700 p-1 mx-auto", "aria-label": "Delete row" },
                                        React.createElement(TrashIcon, null)
                                    )
                                )
                            )
                        ))
                    )
                )
            ),
            React.createElement("button", { onClick: onAdd, className: "no-print mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300" },
                "إضافة صف جديد"
            )
        )
    );
};

//--- Component: ContractsTable.tsx ---
const ContractsTable = ({ title, data, onUpdate }) => {
  return (
    React.createElement("div", null,
        React.createElement("h3", { className: "bg-slate-800 text-white text-center font-bold text-md py-2 px-4 rounded-lg shadow-lg mb-3" }, title),
        React.createElement("div", { className: "overflow-x-auto" },
            React.createElement("table", { className: "min-w-full bg-white border border-gray-200" },
                React.createElement("thead", { className: "bg-slate-700 text-white text-sm" },
                    React.createElement("tr", null,
                        React.createElement("th", { className: "py-2 px-4 border text-center" }, "م"),
                        React.createElement("th", { className: "py-2 px-4 border text-center" }, "فعالة"),
                        React.createElement("th", { className: "py-2 px-4 border text-center" }, "غير فعالة"),
                        React.createElement("th", { className: "py-2 px-4 border text-center" }, "الملاحظات")
                    )
                ),
                React.createElement("tbody", null,
                    data.map((row, index) => (
                        React.createElement("tr", { key: row.id, className: "text-center text-gray-700 hover:bg-gray-50 text-[10px]" },
                            React.createElement("td", { className: "py-2 px-4 border bg-slate-700 text-white font-bold" }, row.id),
                            React.createElement(EditableCell, { type: "number", value: row.active, onChange: (e) => onUpdate(index, 'active', e.target.value) }),
                            React.createElement(EditableCell, { type: "number", value: row.inactive, onChange: (e) => onUpdate(index, 'inactive', e.target.value) }),
                            React.createElement(EditableCell, { value: row.notes, onChange: (e) => onUpdate(index, 'notes', e.target.value), placeholder: "-" })
                        )
                    ))
                )
            )
        )
    )
  );
};

//--- Component: MalfunctionsSummaryTable.tsx ---
const MalfunctionsSummaryTable = ({ data, onUpdate }) => {
    const total = data.reduce((acc, curr) => acc + (parseFloat(curr.count) || 0), 0);

    return (
        React.createElement("div", { className: "overflow-x-auto" },
            React.createElement("table", { className: "min-w-full bg-white border border-gray-200" },
                React.createElement("thead", { className: "bg-slate-700 text-white" },
                    React.createElement("tr", null,
                        React.createElement("th", { className: "py-2 px-4 border" }, "م"),
                        React.createElement("th", { className: "py-2 px-4 border text-center" }, "الوصف"),
                        React.createElement("th", { className: "py-2 px-4 border" }, "عدد الاعطال"),
                        React.createElement("th", { className: "py-2 px-4 border" }, "اجمالي عدد الاعطال")
                    )
                ),
                React.createElement("tbody", null,
                    data.map((row, index) => (
                        React.createElement("tr", { key: row.id, className: "text-center text-gray-700 hover:bg-gray-50" },
                            React.createElement("td", { className: "py-2 px-4 border bg-slate-700 text-white font-bold" }, row.id),
                            React.createElement("td", { className: "py-2 px-4 border text-center" }, row.description),
                            React.createElement(EditableCell, { type: "number", value: row.count, onChange: (e) => onUpdate(index, 'count', e.target.value) }),
                            index === 0 && (
                                React.createElement("td", { className: "py-2 px-4 border font-bold", rowSpan: data.length },
                                    total
                                )
                            )
                        )
                    ))
                )
            )
        )
    );
};

//--- Component: MalfunctionsDetailTable.tsx ---
const MalfunctionsDetailTable = ({ data, onUpdate, onAdd, onDelete }) => {
  const TrashIcon = () => (
    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor" },
        React.createElement("path", { fillRule: "evenodd", d: "M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z", clipRule: "evenodd" })
    )
  );

  return (
    React.createElement(React.Fragment, null,
        React.createElement("div", { className: "overflow-x-auto" },
            React.createElement("table", { className: "min-w-full bg-white border border-gray-200 text-xs sm:text-sm malfunction-detail-table" },
                React.createElement("thead", { className: "bg-slate-700 text-white text-center align-middle" },
                    React.createElement("tr", null,
                        React.createElement("th", { rowSpan: 2, className: "py-3 px-2 border align-middle w-12" }, "م"),
                        React.createElement("th", { rowSpan: 2, className: "py-3 px-2 border align-middle min-w-[120px]" }, "المقرات"),
                        React.createElement("th", { colSpan: 5, className: "py-2 px-2 border bg-slate-700 font-bold" }, "صيانة عامة"),
                        React.createElement("th", { colSpan: 4, className: "py-2 px-2 border bg-slate-700 font-bold" }, "الأنظمة"),
                        React.createElement("th", { colSpan: 3, className: "py-2 px-2 border bg-slate-700 font-bold" }, "البنية التحتية"),
                        React.createElement("th", { rowSpan: 2, className: "py-3 px-2 border align-middle w-24 no-print" }, "إجراء")
                    ),
                    React.createElement("tr", null,
                        React.createElement("th", { className: "py-2 px-2 border font-medium" }, "اعطال عامة"),
                        React.createElement("th", { className: "py-2 px-2 border font-medium" }, "اثاث"),
                        React.createElement("th", { className: "py-2 px-2 border font-medium" }, "ديكور"),
                        React.createElement("th", { className: "py-2 px-2 border font-medium" }, "ارضيات"),
                        React.createElement("th", { className: "py-2 px-2 border font-medium" }, "ابواب"),
                        React.createElement("th", { className: "py-2 px-2 border font-medium" }, "انذار حريق"),
                        React.createElement("th", { className: "py-2 px-2 border font-medium" }, "انارة"),
                        React.createElement("th", { className: "py-2 px-2 border font-medium" }, "كهرباء"),
                        React.createElement("th", { className: "py-2 px-2 border font-medium" }, "تكييف"),
                        React.createElement("th", { className: "py-2 px-2 border font-medium" }, "تسريب ماء"),
                        React.createElement("th", { className: "py-2 px-2 border font-medium" }, "عطل اللوحات الخارجية"),
                        React.createElement("th", { className: "py-2 px-2 border font-medium" }, "مصاعد")
                    )
                ),
                React.createElement("tbody", null,
                    data.map((row, index) => {
                        const isHighlighted = row.location.startsWith('التكلفة /');
                        const rowClasses = `text-center text-gray-700 ${isHighlighted ? 'bg-slate-100 hover:bg-slate-200' : 'hover:bg-gray-50'}`;
                        
                        return (
                        React.createElement("tr", { key: row.id, className: rowClasses },
                            React.createElement("td", { className: "py-2 px-2 border bg-slate-700 text-white font-bold" }, index + 1),
                            React.createElement(EditableCell, { value: row.location, onChange: (e) => onUpdate(index, 'location', e.target.value), placeholder: "أدخل المقر", className: "font-semibold" }),
                            React.createElement(EditableCell, { type: "number", value: row.general, onChange: (e) => onUpdate(index, 'general', e.target.value) }),
                            React.createElement(EditableCell, { type: "number", value: row.furniture, onChange: (e) => onUpdate(index, 'furniture', e.target.value) }),
                            React.createElement(EditableCell, { type: "number", value: row.decor, onChange: (e) => onUpdate(index, 'decor', e.target.value) }),
                            React.createElement(EditableCell, { type: "number", value: row.flooring, onChange: (e) => onUpdate(index, 'flooring', e.target.value) }),
                            React.createElement(EditableCell, { type: "number", value: row.doors, onChange: (e) => onUpdate(index, 'doors', e.target.value) }),
                            React.createElement(EditableCell, { type: "number", value: row.fireAlarm, onChange: (e) => onUpdate(index, 'fireAlarm', e.target.value) }),
                            React.createElement(EditableCell, { type: "number", value: row.lighting, onChange: (e) => onUpdate(index, 'lighting', e.target.value) }),
                            React.createElement(EditableCell, { type: "number", value: row.electrical, onChange: (e) => onUpdate(index, 'electrical', e.target.value) }),
                            React.createElement(EditableCell, { type: "number", value: row.ac, onChange: (e) => onUpdate(index, 'ac', e.target.value) }),
                            React.createElement(EditableCell, { type: "number", value: row.waterLeak, onChange: (e) => onUpdate(index, 'waterLeak', e.target.value) }),
                            React.createElement(EditableCell, { type: "number", value: row.panels, onChange: (e) => onUpdate(index, 'panels', e.target.value) }),
                            React.createElement(EditableCell, { type: "number", value: row.elevators, onChange: (e) => onUpdate(index, 'elevators', e.target.value) }),
                            React.createElement("td", { className: "py-2 px-2 border no-print" },
                                React.createElement("button", { onClick: () => onDelete(row.id), className: "text-red-500 hover:text-red-700 p-1 mx-auto", "aria-label": "Delete row" },
                                    React.createElement(TrashIcon, null)
                                )
                            )
                        )
                        );
                    })
                )
            )
        ),
        React.createElement("button", { onClick: onAdd, className: "no-print mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300" },
            "إضافة مقر جديد"
        )
    )
  );
};

//--- Component: RequestsDistributionTable.tsx ---
const RequestsDistributionTable = ({ 
    data, 
    channels, 
    headers, 
    columnWidths,
    onUpdate, 
    onHeaderUpdate, 
    onChannelNameUpdate,
    onColumnWidthUpdate
}) => {
  const resizingColumnRef = useRef(null);

  const handleMouseDown = (e, columnId) => {
    e.preventDefault();
    resizingColumnRef.current = {
      id: columnId,
      startX: e.clientX,
      startWidth: columnWidths[columnId] || 200,
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = useCallback((e) => {
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
  
  const calculateCompletionPercentage = (receivedStr, completedStr) => {
    const received = parseFloat(receivedStr) || 0;
    const completed = parseFloat(completedStr) || 0;
    if (received === 0) {
      return '0%';
    }
    return `${((completed / received) * 100).toFixed(0)}%`;
  };

  if (data.length < 3) {
      return (
          React.createElement("p", null, "البيانات غير كافية لعرض الجدول.")
      )
  }

  const receivedRow = data[0];
  const completedRow = data[1];
  const percentageRow = data[2];

  const Resizer = ({ onMouseDown }) => (
    React.createElement("div", {
      onMouseDown: onMouseDown,
      className: "absolute top-0 -right-1 h-full w-2 cursor-col-resize z-10",
      style: { touchAction: 'none' }
    })
  );

  return (
    React.createElement("div", { className: "overflow-x-auto" },
        React.createElement("table", { className: "min-w-full bg-white border border-gray-200", style: { tableLayout: 'fixed' } },
             React.createElement("colgroup", null,
                React.createElement("col", { style: { width: `${columnWidths.metric || 120}px` } }),
                React.createElement("col", { style: { width: `${columnWidths.total || 160}px` } }),
                channels.map(channel => (
                    React.createElement("col", { key: channel.id, style: { width: `${columnWidths[channel.id] || 220}px` } })
                ))
            ),
            React.createElement("thead", { className: "bg-slate-700 text-white text-sm" },
                React.createElement("tr", { className: "whitespace-nowrap" },
                    React.createElement("th", { className: "p-0 border text-center relative" },
                       React.createElement("input", {
                            type: "text",
                            value: headers.metric,
                            onChange: (e) => onHeaderUpdate('metric', e.target.value),
                            className: "w-full h-full py-2 px-4 bg-transparent border-none text-center font-semibold text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        }),
                        React.createElement(Resizer, { onMouseDown: (e) => handleMouseDown(e, 'metric') })
                    ),
                    React.createElement("th", { className: "p-0 border text-center relative" },
                        React.createElement("input", {
                            type: "text",
                            value: headers.total,
                            onChange: (e) => onHeaderUpdate('total', e.target.value),
                            className: "w-full h-full py-2 px-4 bg-transparent border-none text-center font-semibold text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        }),
                        React.createElement(Resizer, { onMouseDown: (e) => handleMouseDown(e, 'total') })
                    ),
                    channels.map(channel => (
                        React.createElement("th", { key: channel.id, className: "p-0 border text-center relative" },
                            React.createElement("input", {
                                type: "text",
                                value: channel.name,
                                onChange: (e) => onChannelNameUpdate(channel.id, e.target.value),
                                className: "w-full h-full py-2 px-4 bg-transparent border-none text-center font-semibold text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            }),
                            React.createElement(Resizer, { onMouseDown: (e) => handleMouseDown(e, channel.id) })
                        )
                    ))
                )
            ),
            React.createElement("tbody", null,
                React.createElement("tr", { key: receivedRow.id, className: "text-center text-gray-700 hover:bg-gray-50 whitespace-nowrap" },
                    React.createElement(EditableCell, {
                        value: receivedRow.metric,
                        onChange: (e) => onUpdate(0, 'metric', e.target.value),
                        className: "font-semibold",
                        placeholder: "أدخل المقياس"
                    }),
                    React.createElement("td", { rowSpan: 3, className: "p-0 border align-top" },
                        React.createElement("div", { className: "h-full flex flex-col" },
                            React.createElement("div", { className: "flex-1 flex items-center justify-center py-2 px-4 text-gray-700" },
                                receivedRow.total || '0'
                            ),
                            React.createElement("div", { className: "flex-1 border-t border-gray-200 flex items-center justify-center py-2 px-4 text-gray-700 gap-2 text-sm" },
                                React.createElement("span", null, completedRow.total || '0')
                            ),
                            React.createElement("div", { className: "flex-1 border-t border-gray-200 bg-slate-100 font-semibold flex items-center justify-center py-2 px-4" },
                                calculateCompletionPercentage(receivedRow.total, completedRow.total)
                            )
                        )
                    ),
                    channels.map(channel => (
                        React.createElement(EditableCell, {
                            key: channel.id,
                            type: "number",
                            value: receivedRow.values[channel.id] || '',
                            onChange: (e) => onUpdate(0, channel.id, e.target.value)
                        })
                    ))
                ),
                React.createElement("tr", { key: completedRow.id, className: "text-center text-gray-700 hover:bg-gray-50 text-sm" },
                    React.createElement(EditableCell, {
                        value: completedRow.metric,
                        onChange: (e) => onUpdate(1, 'metric', e.target.value),
                        className: "font-semibold",
                        placeholder: "أدخل المقياس"
                    }),
                    channels.map(channel => (
                        React.createElement(EditableCell, {
                            key: channel.id,
                            type: "number",
                            value: completedRow.values[channel.id] || '',
                            onChange: (e) => onUpdate(1, channel.id, e.target.value)
                        })
                    ))
                ),
                 React.createElement("tr", { key: percentageRow.id, className: "text-center text-gray-700 bg-slate-100 font-semibold whitespace-nowrap" },
                    React.createElement("td", { className: "py-2 px-4 border text-center font-semibold" }, percentageRow.metric),
                    channels.map(channel => (
                         React.createElement("td", { key: channel.id, className: "py-2 px-4 border" },
                             calculateCompletionPercentage(
                                receivedRow.total, 
                                completedRow.values[channel.id] || '0'
                             )
                         )
                    ))
                )
            )
        )
    )
  );
};

//--- Component: SecurityReportTable.tsx ---
const SecurityReportTable = ({ data, onUpdate }) => {
  return (
    React.createElement("div", { className: "overflow-x-auto" },
        React.createElement("table", { className: "min-w-full bg-white border border-gray-200" },
            React.createElement("thead", { className: "bg-slate-700 text-white text-sm" },
                React.createElement("tr", null,
                    React.createElement("th", { className: "py-2 px-4 border text-center" }, "الطلبات"),
                    React.createElement("th", { className: "py-2 px-4 border text-center" }, "طلبات تفعيل البطاقات"),
                    React.createElement("th", { className: "py-2 px-4 border text-center" }, "عدد الزوار"),
                    React.createElement("th", { className: "py-2 px-4 border text-center" }, "عدد الزوار من الموردين"),
                    React.createElement("th", { className: "py-2 px-4 border text-center" }, "طلبات حجز القاعات"),
                    React.createElement("th", { className: "py-2 px-4 border text-center" }, "حالات الاخلاء"),
                    React.createElement("th", { className: "py-2 px-4 border text-center" }, "تقارير الأمنية (كاميرات + حراس أمن)"),
                    React.createElement("th", { className: "py-2 px-4 border text-center" }, "الحالات الطارئة")
                )
            ),
            React.createElement("tbody", null,
                data.map((row, index) => (
                    React.createElement("tr", { key: row.id, className: "text-center text-gray-700 hover:bg-gray-50" },
                        React.createElement("td", { className: "py-2 px-4 border text-center font-semibold" }, row.metric),
                        React.createElement(EditableCell, { type: "number", value: row.cardActivations, onChange: (e) => onUpdate(index, 'cardActivations', e.target.value) }),
                        React.createElement(EditableCell, { type: "number", value: row.visitors, onChange: (e) => onUpdate(index, 'visitors', e.target.value) }),
                        React.createElement(EditableCell, { type: "number", value: row.supplierVisitors, onChange: (e) => onUpdate(index, 'supplierVisitors', e.target.value) }),
                        React.createElement(EditableCell, { type: "number", value: row.hallBookings, onChange: (e) => onUpdate(index, 'hallBookings', e.target.value) }),
                        React.createElement(EditableCell, { type: "number", value: row.evacuations, onChange: (e) => onUpdate(index, 'evacuations', e.target.value) }),
                        React.createElement(EditableCell, { type: "number", value: row.securityReports, onChange: (e) => onUpdate(index, 'securityReports', e.target.value) }),
                        React.createElement(EditableCell, { type: "number", value: row.emergencies, onChange: (e) => onUpdate(index, 'emergencies', e.target.value) })
                    )
                ))
            )
        )
    )
  );
};

//--- Component: TasksTable.tsx ---
const TasksTable = ({ data, onUpdate, onAdd, onDelete }) => {
  const TrashIcon = () => (
    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor" },
        React.createElement("path", { fillRule: "evenodd", d: "M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z", clipRule: "evenodd" })
    )
  );

  return (
    React.createElement(React.Fragment, null,
        React.createElement("div", { className: "overflow-x-auto" },
            React.createElement("table", { className: "min-w-full bg-white border border-gray-200" },
                React.createElement("thead", { className: "bg-slate-700 text-white" },
                    React.createElement("tr", null,
                        React.createElement("th", { className: "py-2 px-4 border w-16" }, "م"),
                        React.createElement("th", { className: "py-2 px-4 border" }, "الموضوع"),
                        React.createElement("th", { className: "py-2 px-4 border" }, "المهمة"),
                        React.createElement("th", { className: "py-2 px-4 border w-32" }, "نسبة الانجاز"),
                        React.createElement("th", { className: "py-2 px-4 border w-24 no-print" }, "إجراء")
                    )
                ),
                React.createElement("tbody", null,
                    data.map((row, index) => (
                        React.createElement("tr", { key: row.id, className: "text-center text-gray-700 hover:bg-gray-50 text-sm" },
                            React.createElement("td", { className: "py-2 px-4 border bg-slate-700 text-white font-bold" }, index + 1),
                            React.createElement(EditableCell, { value: row.subject, onChange: (e) => onUpdate(index, 'subject', e.target.value), placeholder: "أدخل الموضوع" }),
                            React.createElement(EditableCell, { value: row.task, onChange: (e) => onUpdate(index, 'task', e.target.value), placeholder: "أدخل المهمة" }),
                            React.createElement("td", { className: "py-2 px-4 border font-semibold text-xs" }, "100%"),
                            React.createElement("td", { className: "py-2 px-4 border no-print" },
                                React.createElement("button", { onClick: () => onDelete(row.id), className: "text-red-500 hover:text-red-700 p-1 mx-auto", "aria-label": "Delete row" },
                                    React.createElement(TrashIcon, null)
                                )
                            )
                        )
                    ))
                )
            )
        ),
        React.createElement("button", { onClick: onAdd, className: "no-print mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300" },
            "إضافة مهمة جديدة"
        )
    )
  );
};

//--- Component: ChallengesTable.tsx ---
const ChallengesTable = ({ data, onUpdate, onAdd, onDelete }) => {
  const TrashIcon = () => (
    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor" },
        React.createElement("path", { fillRule: "evenodd", d: "M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z", clipRule: "evenodd" })
    )
  );

  return (
    React.createElement(React.Fragment, null,
        React.createElement("div", { className: "overflow-x-auto" },
            React.createElement("table", { className: "min-w-full bg-white border border-gray-200" },
                React.createElement("thead", { className: "bg-slate-700 text-white" },
                    React.createElement("tr", null,
                        React.createElement("th", { className: "py-2 px-4 border w-16" }, "م"),
                        React.createElement("th", { className: "py-2 px-4 border" }, "التحديات والعوائق"),
                        React.createElement("th", { className: "py-2 px-4 border" }, "التحديث"),
                        React.createElement("th", { className: "py-2 px-4 border" }, "التوصية"),
                        React.createElement("th", { className: "py-2 px-4 border w-24 no-print" }, "إجراء")
                    )
                ),
                React.createElement("tbody", null,
                    data.map((row, index) => (
                        React.createElement("tr", { key: row.id, className: "text-center text-gray-700 hover:bg-gray-50" },
                            React.createElement("td", { className: "py-2 px-4 border bg-slate-700 text-white font-bold" }, index + 1),
                            React.createElement(EditableCell, { value: row.challenges, onChange: (e) => onUpdate(index, 'challenges', e.target.value), placeholder: "-" }),
                            React.createElement(EditableCell, { value: row.update, onChange: (e) => onUpdate(index, 'update', e.target.value), placeholder: "-" }),
                            React.createElement(EditableCell, { value: row.recommendation, onChange: (e) => onUpdate(index, 'recommendation', e.target.value), placeholder: "-" }),
                            React.createElement("td", { className: "py-2 px-4 border no-print" },
                                React.createElement("button", { onClick: () => onDelete(row.id), className: "text-red-500 hover:text-red-700 p-1 mx-auto", "aria-label": "Delete row" },
                                    React.createElement(TrashIcon, null)
                                )
                            )
                        )
                    ))
                )
            )
        ),
        React.createElement("button", { onClick: onAdd, className: "no-print mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300" },
            "إضافة صف جديد"
        )
    )
  );
};

//--- Component: ApprovalSection.tsx ---
const SignatureBox = ({ title, name, role, signatureImage, onUpdate }) => {
    const fileInputRef = useRef(null);
    
    const formattedDate = new Date().toLocaleDateString('ar-AE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const handleSignatureClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                onUpdate('signatureImage', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveSignature = (e) => {
        e.stopPropagation();
        onUpdate('signatureImage', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        React.createElement("div", { className: "flex-1 bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden flex flex-col" },
            React.createElement("div", { className: "bg-slate-700 p-3 text-white text-center" },
                React.createElement("h3", { className: "font-bold text-lg" }, title)
            ),
            React.createElement("div", { className: "p-6 flex-grow flex flex-col" },
                React.createElement("div", { className: "flex-grow space-y-6" },
                    React.createElement("div", null,
                        React.createElement("label", { className: "text-sm font-medium text-gray-500" }, "الاسم"),
                        React.createElement("input", {
                            type: "text",
                            value: name,
                            onChange: (e) => onUpdate('name', e.target.value),
                            className: "signature-input w-full bg-transparent border-0 border-b-2 border-gray-300 text-gray-800 p-2 focus:ring-0 focus:border-blue-500 focus:outline-none text-base transition-colors duration-300",
                            "aria-label": `${title} Name`
                        })
                    ),
                    React.createElement("div", null,
                        React.createElement("label", { className: "text-sm font-medium text-gray-500" }, "المنصب"),
                         React.createElement("input", {
                            type: "text",
                            value: role,
                            onChange: (e) => onUpdate('role', e.target.value),
                            className: "signature-input w-full bg-transparent border-0 border-b-2 border-gray-300 text-sm text-gray-600 p-2 focus:ring-0 focus:border-blue-500 focus:outline-none transition-colors duration-300",
                            "aria-label": `${title} Role`
                        })
                    )
                ),
                React.createElement("div", { className: "mt-10" },
                    React.createElement("div", { className: "flex justify-between items-center text-sm" },
                        React.createElement("span", { className: "text-gray-800 font-semibold" }, "التاريخ:"),
                        React.createElement("span", { className: "w-3/5 text-center font-medium text-black" }, formattedDate)
                    ),
                    React.createElement("div", { className: "flex justify-between items-start text-sm mt-6" },
                        React.createElement("span", { className: "text-gray-800 font-semibold pt-4" }, "التوقيع:"),
                        React.createElement("div", { 
                            className: "w-3/5 h-24 border-2 border-dashed border-gray-400 rounded-md flex justify-center items-center cursor-pointer hover:bg-gray-50 relative group transition-colors duration-300",
                            onClick: handleSignatureClick,
                            role: "button",
                            tabIndex: 0,
                            "aria-label": "Add signature"
                        },
                            React.createElement("input", { 
                                type: "file", 
                                ref: fileInputRef, 
                                onChange: handleFileChange, 
                                className: "hidden", 
                                accept: "image/png, image/jpeg, image/svg+xml" 
                            }),
                            signatureImage ? (
                                React.createElement(React.Fragment, null,
                                    React.createElement("img", { src: signatureImage, alt: "Signature", className: "max-w-full max-h-full object-contain p-2" }),
                                    React.createElement("button", { 
                                        onClick: handleRemoveSignature, 
                                        className: "absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs shadow-lg hover:bg-red-700",
                                        "aria-label": "Remove signature"
                                    },
                                        "✕"
                                    )
                                )
                            ) : (
                                React.createElement("span", { className: "text-gray-500 text-xs text-center" }, "انقر لإضافة توقيع")
                            )
                        )
                    )
                )
            )
        )
    );
};

const ApprovalSection = ({ data, onUpdate }) => {
  return (
    React.createElement("div", { className: "pt-8 border-t-2 border-gray-200 approval-section" },
        React.createElement("div", { className: "flex flex-col md:flex-row gap-8" },
            data.map((signature, index) => (
                 React.createElement(SignatureBox, {
                    key: signature.id,
                    title: signature.title,
                    name: signature.name,
                    role: signature.role,
                    signatureImage: signature.signatureImage,
                    onUpdate: (field, value) => onUpdate(index, field, value)
                })
            ))
        )
    )
  );
};

//--- Component: Footer.tsx ---
const Footer = () => {
    return (
        React.createElement("footer", { className: "bg-slate-900 text-gray-300 no-print" },
            React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" },
                React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-8" },
                    React.createElement("div", { className: "lg:col-span-2" },
                        React.createElement("h3", { className: "inline-block text-lg font-bold text-white mb-4 pb-1 border-b-2 border-yellow-400" }, "عن SAHER"),
                        React.createElement("p", { className: "text-sm leading-relaxed" },
                            "شركة رائدة في تقديم الحلول والأنظمة الذكية، ملتزمون بالابتكار والجودة لتحقيق أعلى مستويات الكفاءة والخدمات الذكية."
                        )
                    ),
                    React.createElement("div", null,
                        React.createElement("h3", { className: "inline-block text-lg font-bold text-white mb-4 pb-1 border-b-2 border-yellow-400" }, "روابط سريعة"),
                        React.createElement("ul", { className: "space-y-2 text-sm" },
                            React.createElement("li", null, React.createElement("a", { href: "#", className: "hover:text-white transition-colors duration-300" }, "الرئيسية")),
                            React.createElement("li", null, React.createElement("a", { href: "#", className: "hover:text-white transition-colors duration-300" }, "خدماتنا")),
                            React.createElement("li", null, React.createElement("a", { href: "#", className: "hover:text-white transition-colors duration-300" }, "تواصل معنا"))
                        )
                    ),
                    React.createElement("div", null,
                        React.createElement("h3", { className: "inline-block text-lg font-bold text-white mb-4 pb-1 border-b-2 border-yellow-400" }, "تواصل معنا"),
                        React.createElement("ul", { className: "space-y-3 text-sm" },
                            React.createElement("li", { className: "flex items-start" },
                                React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 me-3 mt-0.5 flex-shrink-0", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2" },
                                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" }),
                                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z" })
                                ),
                                React.createElement("span", null, "Level 3, Baynona Building, Khalif City A")
                            ),
                            React.createElement("li", { className: "flex items-center" },
                                React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 me-3 flex-shrink-0", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2" },
                                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" })
                                ),
                                React.createElement("span", { className: "whitespace-nowrap", dir: "ltr" }, "+971 4 123 4567")
                            ),
                            React.createElement("li", { className: "flex items-center" },
                                React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 me-3 flex-shrink-0", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2" },
                                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" })
                                ),
                                React.createElement("a", { href: "mailto:Logistic@saher.ae", className: "hover:text-white transition-colors duration-300" }, "Logistic@saher.ae")
                            )
                        )
                    )
                ),
                React.createElement("div", { className: "mt-8 pt-8 border-t border-slate-800 flex flex-col items-center text-sm text-gray-400 pb-8" },
                    React.createElement("p", { className: "border border-[#12244d] px-4 py-2 rounded-lg inline-block" }, " اعداد وتصميم / خالد الجفري"),
                    React.createElement("p", { className: "mt-2" }, `جميع الحقوق محفوظة لشركة © ${new Date().getFullYear()} SAHER FOR SMART SERVICES`)
                )
            )
        )
    );
};

// --- Icon Components ---
const iconProps = { className: "h-7 w-7 text-white flex-shrink-0" };
const SummaryIcon = () => React.createElement("svg", { ...iconProps, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "1.5" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }));
const ContractsIcon = () => React.createElement("svg", { ...iconProps, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "1.5" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" }));
const MaintenanceIcon = () => React.createElement("svg", { ...iconProps, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "1.5" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a3.375 3.375 0 000-4.773L6.75 3.75l-2.472 2.472a3.375 3.375 0 000 4.773l5.143 5.143z" }));
const LocationIcon = () => React.createElement("svg", { ...iconProps, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "1.5" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" }));
const LogisticsIcon = () => React.createElement("svg", { ...iconProps, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "1.5" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9.75L3 7.5M12 2.25v9.75m-9 5.25v-9l9-5.25" }));
const SecurityIcon = () => React.createElement("svg", { ...iconProps, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "1.5" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036V6.75" }));
const TasksIcon = () => React.createElement("svg", { ...iconProps, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "1.5" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }));
const ChallengesIcon = () => React.createElement("svg", { ...iconProps, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "1.5" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 18v-5.25m0 0a3 3 0 006 0 3 3 0 00-6 0zm0 0a3 3 0 00-6 0 3 3 0 006 0zm0 0V6.75" }));
const ApprovalIcon = () => React.createElement("svg", { ...iconProps, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "1.5" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" }));


//--- Component: CollapsibleSection.tsx ---
const CollapsibleSection = ({ title, isOpen, onToggle, children, icon }) => {
    const ChevronIcon = ({ isOpen }) => (
        React.createElement("svg", { 
            xmlns: "http://www.w3.org/2000/svg", 
            className: `h-6 w-6 text-white transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`, 
            fill: "none", 
            viewBox: "0 0 24 24", 
            stroke: "currentColor", 
            strokeWidth: "2"
        },
            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 9l-7 7-7-7" })
        )
    );
    
    const printIcon = icon ? React.cloneElement(icon, { className: 'h-6 w-6 text-slate-800' }) : null;

    return (
        React.createElement("section", { className: "mb-6 print:mb-0" },
             React.createElement("h2", { className: "hidden print:flex items-center gap-3 text-xl font-bold text-gray-700" },
                printIcon,
                title
            ),
            React.createElement("div", { className: "rounded-lg shadow-md overflow-hidden no-print" },
                React.createElement("button", {
                    type: "button",
                    onClick: onToggle,
                    className: "w-full flex justify-between items-center p-4 text-right bg-slate-800 text-white font-bold text-xl transition-colors duration-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                    "aria-expanded": isOpen
                },
                    React.createElement("div", { className: "flex items-center gap-3" },
                        icon,
                        React.createElement("span", null, title)
                    ),
                    React.createElement(ChevronIcon, { isOpen: isOpen })
                ),
                React.createElement("div", {
                    className: `collapsible-content bg-white transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`
                },
                    React.createElement("div", { className: "p-6 border-t border-slate-700" },
                        children
                    )
                )
            ),
            React.createElement("div", { className: "hidden print:block" },
                children
            )
        )
    );
};


// --- Main App Component ---
const App = () => {
    const arabicMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const currentMonthIndex = new Date().getMonth();
    const startYear = 2020;
    const endYear = 2090;
    const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => (startYear + i).toString());

    const [appState, setAppState] = useState(() => JSON.parse(JSON.stringify(initialReportState)));
    const [reportDate, setReportDate] = useState({
        month: arabicMonths[currentMonthIndex],
        year: new Date().getFullYear().toString(),
    });
    const [saveStatus, setSaveStatus] = useState('idle');
    const [openSections, setOpenSections] = useState({
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

    const toggleSection = (sectionId) => {
        setOpenSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
    };

    const handleStateUpdate = (stateKey, index, field, value) => {
        setAppState(prev => {
            const newState = { ...prev };
            const newArray = [...newState[stateKey]];
            newArray[index] = { ...newArray[index], [field]: value };
            return { ...newState, [stateKey]: newArray };
        });
    };

    const handleAddItem = (stateKey, newItemData) => {
        setAppState(prev => {
            const newArray = [...prev[stateKey], { ...newItemData, id: Date.now() }];
            return { ...prev, [stateKey]: newArray };
        });
    };

    const handleDeleteItem = (stateKey, idToDelete) => {
         setAppState(prev => {
            const oldArray = prev[stateKey];
            const newArray = oldArray.filter((item) => item.id !== idToDelete);
            return { ...prev, [stateKey]: newArray };
        });
    };

    const handleAddMalfunctionDetailItem = () => {
        setAppState(prev => {
            const newData = [...prev.malfunctionDetailData];
            const newItem = {
                id: Date.now(), location: 'مقر جديد', general: '', furniture: '', decor: '', fireAlarm: '', waterLeak: '', doors: '', lighting: '', flooring: '', ac: '', exterior: '', panels: '', electrical: '', elevators: '',
            };
            newData.splice(newData.length - 2, 0, newItem);
            return { ...prev, malfunctionDetailData: newData };
        });
    };
    
    const handleRequestDistributionUpdate = (rowIndex, field, value) => {
        setAppState(prev => {
            const newRequestData = [...prev.requestDistributionData];
            const rowToUpdate = { ...newRequestData[rowIndex] };

            if (field === 'metric') {
                rowToUpdate.metric = value;
            } else {
                rowToUpdate.values = { ...rowToUpdate.values, [field]: value };
                if (rowIndex === 0 || rowIndex === 1) {
                    // FIX: Explicitly typed the arguments of the reduce callback to resolve errors where `val` is inferred as `unknown`.
                    const newTotal = Object.values(rowToUpdate.values)
                                           .reduce((sum: number, val: any) => sum + (parseFloat(val) || 0), 0);
                    rowToUpdate.total = newTotal.toString();
                }
            }
            
            newRequestData[rowIndex] = rowToUpdate;
            return { ...prev, requestDistributionData: newRequestData };
        });
    };

    const handleRequestTableHeaderUpdate = (field, value) => {
        setAppState(prev => ({
            ...prev,
            requestTableHeaders: { ...prev.requestTableHeaders, [field]: value }
        }));
    };
    
    const handleChannelNameUpdate = (channelId, newName) => {
        setAppState(prev => ({
            ...prev,
            distributionChannels: prev.distributionChannels.map(ch => ch.id === channelId ? { ...ch, name: newName } : ch)
        }));
    };

    const handleRequestColumnWidthUpdate = (columnId, width) => {
        setAppState(prev => ({
            ...prev,
            requestColumnWidths: { ...prev.requestColumnWidths, [columnId]: width }
        }));
    };

    const handleDateChange = (e) => {
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
    
        html2pdf().from(printableArea).set(options).save().then(restoreClasses).catch((err) => {
            console.error("PDF generation failed:", err);
            restoreClasses();
        });
    };

    const handleNativePrint = () => window.print();

    const handleExportToExcel = () => {
        const wb = XLSX.utils.book_new();
        const dataToExport = [];
    
        const addSection = (title, headers, data) => {
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
        const calculateExcelPercentage = (receivedStr, completedStr) => {
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
        React.createElement(React.Fragment, null,
            React.createElement("div", { className: "max-w-7xl mx-auto p-4 sm:p-8 bg-gray-100" },
                React.createElement("div", { className: "printable-area bg-white shadow-lg rounded-lg" },
                    React.createElement("header", { className: "bg-slate-900 p-6 rounded-t-lg" },
                        React.createElement("div", { className: "flex flex-col sm:flex-row justify-between items-center gap-4" },
                             React.createElement("div", null,
                                React.createElement("h1", { className: "text-3xl font-bold text-white text-center sm:text-right" },
                                    "تقرير الأداء الشهري - قسم إدارة المرافق",
                                    React.createElement("span", { className: "no-print block text-lg font-normal text-gray-300 mt-1" }, `تقرير شهر - ${reportDate.month} ${reportDate.year}`)
                                )
                            ),
                            React.createElement("div", { className: "flex items-center flex-wrap justify-center gap-2" },
                                React.createElement("button", { onClick: handleNativePrint, className: "no-print bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center w-40" },
                                    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 me-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" })),
                                    "طباعة"
                                ),
                                 React.createElement("button", { onClick: handlePrintToPdf, className: "no-print bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center w-40" },
                                    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 me-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" })),
                                    "تحميل PDF"
                                )
                            )
                        ),
                        React.createElement("div", { className: "mt-4 pt-4 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-y-3 no-print" },
                            React.createElement("div", null,
                                React.createElement("div", { className: "flex items-center flex-wrap gap-x-6 gap-y-3" },
                                    React.createElement("span", { className: "text-white font-bold text-lg" }, "تحديد فترة التقرير:"),
                                    React.createElement("div", { className: "flex items-center gap-2" },
                                        React.createElement("label", { htmlFor: "month-select", className: "text-white font-semibold" }, "الشهر:"),
                                        React.createElement("select", { id: "month-select", name: "month", value: reportDate.month, onChange: handleDateChange, className: "bg-slate-800 text-white border border-slate-600 rounded-md px-3 py-1 focus:ring-blue-500 focus:border-blue-500" },
                                            arabicMonths.map(month => React.createElement("option", { key: month, value: month }, month))
                                        )
                                    ),
                                    React.createElement("div", { className: "flex items-center gap-2" },
                                        React.createElement("label", { htmlFor: "year-select", className: "text-white font-semibold" }, "السنة:"),
                                        React.createElement("select", { id: "year-select", name: "year", value: reportDate.year, onChange: handleDateChange, className: "bg-slate-800 text-white border border-slate-600 rounded-md px-3 py-1 focus:ring-blue-500 focus:border-blue-500" },
                                            years.map(year => React.createElement("option", { key: year, value: year }, year))
                                        )
                                    )
                                ),
                                React.createElement("div", { className: "mt-2" },
                                    React.createElement("p", { className: "text-gray-300 text-base" }, "شركة ساهر للخدمات الذكية")
                                )
                            ),
                            React.createElement("div", { className: "flex items-center gap-2" },
                                React.createElement("button", {
                                    onClick: handleSaveData,
                                    disabled: saveStatus === 'saving',
                                    className: `no-print text-white py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center w-40 ${saveStatus === 'saved' ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`
                                },
                                    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 me-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 },
                                      React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4m0 0H9m3 0a2 2 0 012 2v2" })
                                    ),
                                    saveButtonText[saveStatus]
                                ),
                                React.createElement("button", { onClick: handleExportToExcel, className: "no-print bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center w-40" },
                                    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 me-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2" }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4m0 0h-2m2 0h-4m4 0h-6m4 0H6m6 0h2m4 6l-4-4-4 4m4-4v12" })),
                                    "تصدير Excel"
                                )
                            )
                        ),
                        React.createElement("div", { className: "hidden print:block pt-4 text-center" },
                            React.createElement("p", { className: "text-xl font-bold" }, `تقرير شهر ${reportDate.month} ${reportDate.year}`)
                        )
                    ),

                    React.createElement("main", { className: "p-8" },
                        React.createElement(CollapsibleSection, { title: "ملخص التقرير", isOpen: openSections.services, onToggle: () => toggleSection('services'), icon: React.createElement(SummaryIcon, null) },
                            React.createElement(ServicesTable, { data: appState.servicesData, onUpdate: (index, field, value) => handleStateUpdate('servicesData', index, field, value), onAdd: () => handleAddItem('servicesData', { service: 'خدمة جديدة', received: '', completed: '' }), onDelete: (id) => handleDeleteItem('servicesData', id) })
                        ),
                        
                        React.createElement(CollapsibleSection, { title: "العقود والرخص", isOpen: openSections.contracts, onToggle: () => toggleSection('contracts'), icon: React.createElement(ContractsIcon, null) },
                            React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 components-grid" },
                                React.createElement(ContractsTable, { title: "عدد العقود الايجارية", data: appState.leaseContractsData, onUpdate: (index, field, value) => handleStateUpdate('leaseContractsData', index, field, value) }),
                                React.createElement(ContractsTable, { title: "عدد الرخص التجارية", data: appState.commercialLicensesData, onUpdate: (index, field, value) => handleStateUpdate('commercialLicensesData', index, field, value) }),
                                React.createElement(ContractsTable, { title: "عدد عقود الخدمات", data: appState.serviceContractsData, onUpdate: (index, field, value) => handleStateUpdate('serviceContractsData', index, field, value) })
                            )
                        ),

                        React.createElement(CollapsibleSection, { title: "خدمات الصيانة", isOpen: openSections.malfunctionsSummary, onToggle: () => toggleSection('malfunctionsSummary'), icon: React.createElement(MaintenanceIcon, null) },
                            React.createElement(MalfunctionsSummaryTable, { data: appState.malfunctionSummaryData, onUpdate: (index, field, value) => handleStateUpdate('malfunctionSummaryData', index, field, value) })
                        ),

                        React.createElement(CollapsibleSection, { title: "تفصيل الأعطال حسب المقر", isOpen: openSections.malfunctionsDetail, onToggle: () => toggleSection('malfunctionsDetail'), icon: React.createElement(LocationIcon, null) },
                            React.createElement(MalfunctionsDetailTable, { data: appState.malfunctionDetailData, onUpdate: (index, field, value) => handleStateUpdate('malfunctionDetailData', index, field, value), onAdd: handleAddMalfunctionDetailItem, onDelete: (id) => handleDeleteItem('malfunctionDetailData', id) })
                        ),

                        React.createElement(CollapsibleSection, { title: "خدمات الدعم اللوجيستي", isOpen: openSections.logistics, onToggle: () => toggleSection('logistics'), icon: React.createElement(LogisticsIcon, null) },
                            React.createElement(RequestsDistributionTable, { data: appState.requestDistributionData, channels: appState.distributionChannels, headers: appState.requestTableHeaders, columnWidths: appState.requestColumnWidths, onUpdate: handleRequestDistributionUpdate, onHeaderUpdate: handleRequestTableHeaderUpdate, onChannelNameUpdate: handleChannelNameUpdate, onColumnWidthUpdate: handleRequestColumnWidthUpdate })
                        ),

                        React.createElement(CollapsibleSection, { title: "طلبات تفعيل البطاقات والتقارير الأمنية", isOpen: openSections.security, onToggle: () => toggleSection('security'), icon: React.createElement(SecurityIcon, null) },
                             React.createElement(SecurityReportTable, { data: appState.securityReportData, onUpdate: (index, field, value) => handleStateUpdate('securityReportData', index, field, value) })
                        ),

                        React.createElement(CollapsibleSection, { title: "المهمات المنجزة", isOpen: openSections.tasks, onToggle: () => toggleSection('tasks'), icon: React.createElement(TasksIcon, null) },
                            React.createElement(TasksTable, { data: appState.tasksData, onUpdate: (index, field, value) => handleStateUpdate('tasksData', index, field, value), onAdd: () => handleAddItem('tasksData', { subject: '', task: '' }), onDelete: (id) => handleDeleteItem('tasksData', id) })
                        ),

                        React.createElement(CollapsibleSection, { title: "التحديات والتوصيات", isOpen: openSections.challenges, onToggle: () => toggleSection('challenges'), icon: React.createElement(ChallengesIcon, null) },
                            React.createElement(ChallengesTable, { data: appState.challengesData, onUpdate: (index, field, value) => handleStateUpdate('challengesData', index, field, value), onAdd: () => handleAddItem('challengesData', { challenges: '', update: '', recommendation: '' }), onDelete: (id) => handleDeleteItem('challengesData', id) })
                        ),

                        React.createElement(CollapsibleSection, { title: "التوقيعات والاعتماد", isOpen: openSections.approval, onToggle: () => toggleSection('approval'), icon: React.createElement(ApprovalIcon, null) },
                            React.createElement(ApprovalSection, { data: appState.approvalData, onUpdate: (index, field, value) => handleStateUpdate('approvalData', index, field, value) })
                        )
                    )
                )
            ),
            React.createElement(Footer, null)
        )
    );
};

// --- App Mounting ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  React.createElement(React.StrictMode, null,
    React.createElement(App, null)
  )
);
