
import React, { useState, useEffect } from 'react';
import { ServicesTable } from './components/ServicesTable.tsx';
import { ContractsTable } from './components/ContractsTable.tsx';
import { MalfunctionsSummaryTable } from './components/MalfunctionsSummaryTable.tsx';
import { MalfunctionsDetailTable } from './components/MalfunctionsDetailTable.tsx';
import { RequestsDistributionTable } from './components/RequestsDistributionTable.tsx';
import { SecurityReportTable } from './components/SecurityReportTable.tsx';
import { TasksTable } from './components/TasksTable.tsx';
import { ChallengesTable } from './components/ChallengesTable.tsx';
import { ApprovalSection } from './components/ApprovalSection.tsx';
import { Footer } from './components/Footer.tsx';
import { CollapsibleSection } from './components/CollapsibleSection.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import type { MalfunctionDetail } from './types.ts';
import { initialReportState } from './constants.ts';

declare const html2pdf: any;
declare const XLSX: any;

const arabicMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const currentMonthIndex = new Date().getMonth();

const startYear = 2020;
const endYear = 2090;
const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => (startYear + i).toString());

// Helper type to get only keys that correspond to arrays in the app's state
type ArrayStateKey = {
  [K in keyof typeof initialReportState]: (typeof initialReportState)[K] extends any[] ? K : never
}[keyof typeof initialReportState];

const App: React.FC = () => {
    const [appState, setAppState] = useState(() => JSON.parse(JSON.stringify(initialReportState)));
    const [reportDate, setReportDate] = useState({
        month: arabicMonths[currentMonthIndex],
        year: new Date().getFullYear().toString(),
    });
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [activeTab, setActiveTab] = useState<'dashboard' | 'report'>('report');
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
                    // Basic validation to ensure data structure is not corrupted
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
            // Insert new item before the "Cost" rows
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
            } else { // It's a channel value update, field is the channel id
                rowToUpdate.values = { ...rowToUpdate.values, [field]: value };
                
                // If it's the 'received' or 'completed' row, recalculate its total
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
        // No separate tabs container to hide anymore
    
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

    // Modern Islamic Geometric Pattern - Subtle Slate Gray
    const islamicPatternStyle = {
        backgroundColor: '#f3f4f6', // fallback/base color
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231e293b' fill-opacity='0.04'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    };

    return (
        <>
            <div className="max-w-7xl mx-auto p-4 sm:p-8 min-h-screen" style={islamicPatternStyle}>
                <div className="printable-area bg-white shadow-lg rounded-lg overflow-hidden">
                    
                    {/* Main Header */}
                    <header className="bg-slate-900 h-auto sm:h-32 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between px-6 py-4 rounded-t-lg border-b-4 border-[#eab308] no-print-padding">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                        {/* Right Side: Date (Visual Right in RTL) */}
                        <div className="z-10 flex items-center mb-4 sm:mb-0 order-3 sm:order-1">
                            <div className="border border-slate-600 bg-slate-800/80 rounded-lg px-4 py-2 flex items-center gap-3 shadow-sm">
                                <span className="text-yellow-500 font-bold text-xl">{reportDate.year}</span>
                                <div className="h-5 w-px bg-slate-600"></div>
                                <span className="text-white font-medium text-lg">{reportDate.month}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>

                        {/* Center: Title */}
                        <div className="z-10 text-center flex flex-col items-center mb-4 sm:mb-0 order-1 sm:order-2">
                            <div className="inline-block bg-[#1e293b] border border-slate-600 rounded-full px-6 py-1 mb-2">
                                <span className="text-[#eab308] text-xs sm:text-sm font-bold tracking-wide">إدارة الخدمات العامة / قسم إدارة المرافق</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">تقرير الأداء الشهري</h1>
                        </div>

                        {/* Left Side: Logo (Visual Left in RTL) */}
                        <div className="z-10 flex items-center gap-3 order-2 sm:order-3">
                            <div className="text-left">
                                <h1 className="text-3xl font-black text-white tracking-tight leading-none font-sans">SAHER</h1>
                                <p className="text-[9px] text-gray-400 tracking-[0.25em] uppercase font-semibold text-right">FOR SMART SERVICE</p>
                            </div>
                            <div className="relative bg-blue-600 h-10 w-10 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                                <span className="text-white font-black text-2xl sm:text-3xl italic font-sans pr-1">S</span>
                                <span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-yellow-400 rounded-full border-2 border-slate-900"></span>
                            </div>
                        </div>
                    </header>

                    {/* Toolbar Section (Below Header) */}
                    <div className="bg-gray-50 border-b border-gray-200 p-4 flex flex-col xl:flex-row items-center justify-between gap-4 no-print">
                         <div className="flex items-center gap-4 bg-white p-2 rounded-lg border border-gray-200 shadow-sm flex-wrap justify-center">
                            {/* Dashboard / Report Tabs */}
                            <div className="flex p-1 bg-gray-100 rounded-lg">
                                <button
                                    onClick={() => setActiveTab('report')}
                                    className={`py-2 px-6 rounded-md transition-all duration-200 text-sm font-bold flex items-center gap-2 ${
                                        activeTab === 'report' 
                                        ? 'bg-[#334155] text-white shadow-sm' 
                                        : 'text-gray-500 hover:text-slate-700 hover:bg-gray-200/50'
                                    }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${activeTab === 'report' ? 'text-[#eab308]' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    التقرير التفصيلي
                                </button>
                                <button
                                    onClick={() => setActiveTab('dashboard')}
                                    className={`py-2 px-6 rounded-md transition-all duration-200 text-sm font-bold flex items-center gap-2 ${
                                        activeTab === 'dashboard' 
                                        ? 'bg-[#334155] text-white shadow-sm' 
                                        : 'text-gray-500 hover:text-slate-700 hover:bg-gray-200/50'
                                    }`}
                                >
                                     <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${activeTab === 'dashboard' ? 'text-[#eab308]' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                    لوحة المعلومات
                                </button>
                            </div>

                            <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>

                            {/* Date Selection */}
                            <div className="flex items-center gap-2">
                                <label htmlFor="month-select" className="text-gray-600 font-medium text-sm">الشهر:</label>
                                <select id="month-select" name="month" value={reportDate.month} onChange={handleDateChange} className="bg-gray-50 text-gray-800 border-gray-200 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-[#eab308] focus:border-[#eab308]">
                                    {arabicMonths.map(month => <option key={month} value={month}>{month}</option>)}
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <label htmlFor="year-select" className="text-gray-600 font-medium text-sm">السنة:</label>
                                <select id="year-select" name="year" value={reportDate.year} onChange={handleDateChange} className="bg-gray-50 text-gray-800 border-gray-200 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-[#eab308] focus:border-[#eab308]">
                                    {years.map(year => <option key={year} value={year}>{year}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                             <button
                                onClick={handleSaveData}
                                disabled={saveStatus === 'saving'}
                                className={`text-white py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center text-sm font-bold shadow-sm hover:shadow-md min-w-[120px]
                                    ${saveStatus === 'saved' ? 'bg-green-600' : 'bg-[#eab308] hover:bg-yellow-600 text-slate-900'}`}
                            >
                                {saveButtonText[saveStatus]}
                            </button>
                             <div className="h-8 w-px bg-gray-300 mx-1"></div>
                             <button onClick={handleNativePrint} className="bg-slate-700 text-white py-2 px-4 rounded-lg hover:bg-slate-800 transition-all duration-200 flex items-center text-sm font-medium shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                طباعة
                            </button>
                             <button onClick={handlePrintToPdf} className="bg-slate-700 text-white py-2 px-4 rounded-lg hover:bg-slate-800 transition-all duration-200 flex items-center text-sm font-medium shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                PDF
                            </button>
                            <button onClick={handleExportToExcel} className="bg-slate-700 text-white py-2 px-4 rounded-lg hover:bg-slate-800 transition-all duration-200 flex items-center text-sm font-medium shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Excel
                            </button>
                        </div>
                    </div>

                    <main className="p-8">
                        {activeTab === 'dashboard' ? (
                             <div className="animate-fadeIn">
                                <Dashboard data={appState} />
                             </div>
                        ) : (
                            <div className="animate-fadeIn space-y-2">
                                <CollapsibleSection title="ملخص التقرير" isOpen={openSections.services} onToggle={() => toggleSection('services')} icon={<svg className="h-7 w-7 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}>
                                    <ServicesTable data={appState.servicesData} onUpdate={(index, field, value) => handleStateUpdate('servicesData', index, field, value)} onAdd={() => handleAddItem('servicesData', { service: 'خدمة جديدة', received: '', completed: '' })} onDelete={(id) => handleDeleteItem('servicesData', id)} />
                                </CollapsibleSection>
                                
                                <CollapsibleSection title="العقود والرخص" isOpen={openSections.contracts} onToggle={() => toggleSection('contracts')} icon={<svg className="h-7 w-7 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>}>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 components-grid">
                                        <ContractsTable title="عدد العقود الايجارية" data={appState.leaseContractsData} onUpdate={(index, field, value) => handleStateUpdate('leaseContractsData', index, field, value)} />
                                        <ContractsTable title="عدد الرخص التجارية" data={appState.commercialLicensesData} onUpdate={(index, field, value) => handleStateUpdate('commercialLicensesData', index, field, value)} />
                                        <ContractsTable title="عدد عقود الخدمات" data={appState.serviceContractsData} onUpdate={(index, field, value) => handleStateUpdate('serviceContractsData', index, field, value)} />
                                    </div>
                                </CollapsibleSection>

                                <CollapsibleSection title="خدمات الصيانة" isOpen={openSections.malfunctionsSummary} onToggle={() => toggleSection('malfunctionsSummary')} icon={<svg className="h-7 w-7 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a3.375 3.375 0 000-4.773L6.75 3.75l-2.472 2.472a3.375 3.375 0 000 4.773l5.143 5.143z" /></svg>}>
                                    <MalfunctionsSummaryTable data={appState.malfunctionSummaryData} onUpdate={(index, field, value) => handleStateUpdate('malfunctionSummaryData', index, field, value)} />
                                </CollapsibleSection>

                                <CollapsibleSection title="تفصيل الأعطال حسب المقر" isOpen={openSections.malfunctionsDetail} onToggle={() => toggleSection('malfunctionsDetail')} icon={<svg className="h-7 w-7 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>}>
                                    <MalfunctionsDetailTable data={appState.malfunctionDetailData} onUpdate={(index, field, value) => handleStateUpdate('malfunctionDetailData', index, field, value)} onAdd={handleAddMalfunctionDetailItem} onDelete={(id) => handleDeleteItem('malfunctionDetailData', id)} />
                                </CollapsibleSection>

                                <CollapsibleSection title="خدمات الدعم اللوجيستي" isOpen={openSections.logistics} onToggle={() => toggleSection('logistics')} icon={<svg className="h-7 w-7 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9.75L3 7.5M12 2.25v9.75m-9 5.25v-9l9-5.25" /></svg>}>
                                    <RequestsDistributionTable data={appState.requestDistributionData} channels={appState.distributionChannels} headers={appState.requestTableHeaders} columnWidths={appState.requestColumnWidths} onUpdate={handleRequestDistributionUpdate} onHeaderUpdate={handleRequestTableHeaderUpdate} onChannelNameUpdate={handleChannelNameUpdate} onColumnWidthUpdate={handleRequestColumnWidthUpdate} />
                                </CollapsibleSection>

                                <CollapsibleSection title="طلبات تفعيل البطاقات والتقارير الأمنية" isOpen={openSections.security} onToggle={() => toggleSection('security')} icon={<svg className="h-7 w-7 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036V6.75" /></svg>}>
                                     <SecurityReportTable data={appState.securityReportData} onUpdate={(index, field, value) => handleStateUpdate('securityReportData', index, field, value)} />
                                </CollapsibleSection>

                                <CollapsibleSection title="المهمات المنجزة" isOpen={openSections.tasks} onToggle={() => toggleSection('tasks')} icon={<svg className="h-7 w-7 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
                                    <TasksTable data={appState.tasksData} onUpdate={(index, field, value) => handleStateUpdate('tasksData', index, field, value)} onAdd={() => handleAddItem('tasksData', { subject: '', task: '' })} onDelete={(id) => handleDeleteItem('tasksData', id)} />
                                </CollapsibleSection>

                                <CollapsibleSection title="التحديات والتوصيات" isOpen={openSections.challenges} onToggle={() => toggleSection('challenges')} icon={<svg className="h-7 w-7 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a3 3 0 006 0 3 3 0 00-6 0zm0 0a3 3 0 00-6 0 3 3 0 006 0zm0 0V6.75" /></svg>}>
                                    <ChallengesTable data={appState.challengesData} onUpdate={(index, field, value) => handleStateUpdate('challengesData', index, field, value)} onAdd={() => handleAddItem('challengesData', { challenges: '', update: '', recommendation: '' })} onDelete={(id) => handleDeleteItem('challengesData', id)} />
                                </CollapsibleSection>

                                <CollapsibleSection title="التوقيعات والاعتماد" isOpen={openSections.approval} onToggle={() => toggleSection('approval')} icon={<svg className="h-7 w-7 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>}>
                                    <ApprovalSection data={appState.approvalData} onUpdate={(index, field, value) => handleStateUpdate('approvalData', index, field, value)} />
                                </CollapsibleSection>
                            </div>
                        )}
                    </main>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default App;
