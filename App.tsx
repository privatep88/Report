
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
import type { MalfunctionDetail, SignatureData } from './types.ts';
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

export default App;