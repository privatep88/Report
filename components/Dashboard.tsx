
import React from 'react';
import type { 
    ServiceRequest, 
    ContractStatus, 
    MalfunctionSummary, 
    RequestDistribution, 
    SecurityReportItem, 
    TaskItem, 
    ChallengeItem,
    MalfunctionDetail
} from '../types.ts';

interface DashboardProps {
    data: {
        servicesData: ServiceRequest[];
        leaseContractsData: ContractStatus[];
        commercialLicensesData: ContractStatus[];
        serviceContractsData: ContractStatus[];
        malfunctionSummaryData: MalfunctionSummary[];
        malfunctionDetailData: MalfunctionDetail[];
        requestDistributionData: RequestDistribution[];
        securityReportData: SecurityReportItem[];
        tasksData: TaskItem[];
        challengesData: ChallengeItem[];
    };
}

const Card = ({ title, value, subtext, icon, colorClass = "bg-white", textColor = "text-slate-800" }: { title: string, value: string | number, subtext?: string, icon: React.ReactNode, colorClass?: string, textColor?: string }) => (
    <div className={`${colorClass} rounded-2xl shadow-sm p-5 border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex items-start justify-between relative overflow-hidden group h-full`}>
        <div className="relative z-10">
            <p className="text-slate-500 text-xs sm:text-sm font-semibold mb-2 tracking-wide">{title}</p>
            <h4 className={`text-3xl sm:text-4xl font-extrabold ${textColor} tracking-tight`}>{value}</h4>
            {subtext && <p className="text-xs text-slate-400 mt-2 font-medium">{subtext}</p>}
        </div>
        <div className="p-3 bg-white/50 rounded-xl text-[#eab308] group-hover:scale-110 transition-transform duration-300 shadow-sm backdrop-blur-sm">
            {icon}
        </div>
    </div>
);

const SectionHeader = ({ title }: { title: string }) => (
    <div className="col-span-full mt-10 mb-6 flex items-center gap-3">
        <div className="h-8 w-1.5 bg-gradient-to-b from-[#eab308] to-yellow-600 rounded-full shadow-sm"></div>
        <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h3>
    </div>
);

const LocationBar: React.FC<{ name: string; count: number; max: number }> = ({ name, count, max }) => {
    const percentage = max > 0 ? (count / max) * 100 : 0;
    return (
        <div className="mb-4">
            <div className="flex justify-between items-end mb-1">
                <span className="text-sm font-bold text-slate-700">{name}</span>
                <span className="text-xs font-semibold text-slate-500">{count} عطل</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
    // --- Calculations ---

    // 1. Services
    const totalServicesReceived = data.servicesData.reduce((acc, curr) => acc + (parseFloat(curr.received) || 0), 0);
    const totalServicesCompleted = data.servicesData.reduce((acc, curr) => acc + (parseFloat(curr.completed) || 0), 0);
    const serviceCompletionRate = totalServicesReceived > 0 ? Math.round((totalServicesCompleted / totalServicesReceived) * 100) : 0;

    // 2. Contracts (Active)
    const activeLeases = data.leaseContractsData.reduce((acc, curr) => acc + (parseFloat(curr.active) || 0), 0);
    const activeLicenses = data.commercialLicensesData.reduce((acc, curr) => acc + (parseFloat(curr.active) || 0), 0);
    const activeServiceContracts = data.serviceContractsData.reduce((acc, curr) => acc + (parseFloat(curr.active) || 0), 0);

    // 3. Maintenance Analysis
    const totalMalfunctions = data.malfunctionSummaryData.reduce((acc, curr) => acc + (parseFloat(curr.count) || 0), 0);
    
    // Process locations to find top issues
    const locationMalfunctions = data.malfunctionDetailData
        .filter(row => !row.location.includes('التكلفة') && row.location.trim() !== '')
        .map(row => {
            const total = Object.entries(row).reduce((sum, [key, val]) => {
                if (key !== 'id' && key !== 'location' && typeof val === 'string') {
                    return sum + (parseFloat(val) || 0);
                }
                return sum;
            }, 0);
            return { location: row.location, count: total };
        })
        .sort((a, b) => b.count - a.count);
    
    const maxLocationCount = locationMalfunctions.length > 0 ? locationMalfunctions[0].count : 0;
    const topLocations = locationMalfunctions.slice(0, 5); // Top 5 locations

    // 4. Logistics
    const logisticsReceived = parseFloat(data.requestDistributionData[0]?.total || '0');
    const logisticsCompleted = parseFloat(data.requestDistributionData[1]?.total || '0');

    // 5. Security Extended Stats
    const totalVisitors = data.securityReportData.reduce((acc, curr) => acc + (parseFloat(curr.visitors) || 0), 0);
    const totalSupplierVisitors = data.securityReportData.reduce((acc, curr) => acc + (parseFloat(curr.supplierVisitors) || 0), 0);
    const totalCardActivations = data.securityReportData.reduce((acc, curr) => acc + (parseFloat(curr.cardActivations) || 0), 0);
    const hallBookings = data.securityReportData.reduce((acc, curr) => acc + (parseFloat(curr.hallBookings) || 0), 0);
    const securityReports = data.securityReportData.reduce((acc, curr) => acc + (parseFloat(curr.securityReports) || 0), 0);
    const totalEvacuations = data.securityReportData.reduce((acc, curr) => acc + (parseFloat(curr.evacuations) || 0), 0);
    const totalEmergencies = data.securityReportData.reduce((acc, curr) => acc + (parseFloat(curr.emergencies) || 0), 0);

    // 6. Tasks & Challenges
    const totalTasks = data.tasksData.filter(t => t.task.trim() !== '').length;
    const totalChallenges = data.challengesData.filter(c => c.challenges.trim() !== '').length;

    // --- Icons (SVGs) ---
    const ChartIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
    const CheckCircleIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    const DocumentIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
    const ToolIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
    const TruckIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>;
    const ShieldIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
    const UserGroupIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
    const BellAlertIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
    const ExclamationTriangleIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
    const FireIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>;

    return (
        <div className="space-y-8 animate-fadeIn pb-10">
            {/* Top Level KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card 
                    title="إجمالي طلبات الخدمات" 
                    value={totalServicesReceived} 
                    icon={ChartIcon} 
                    subtext={`تم إنجاز ${totalServicesCompleted} طلب`}
                />
                <Card 
                    title="نسبة الإنجاز العامة" 
                    value={`${serviceCompletionRate}%`} 
                    icon={CheckCircleIcon}
                    colorClass={serviceCompletionRate >= 90 ? "bg-gradient-to-br from-green-50 to-white border-green-200 ring-1 ring-green-100" : "bg-white"}
                    textColor={serviceCompletionRate >= 90 ? "text-green-700" : "text-slate-800"}
                />
                 <Card 
                    title="طلبات الدعم اللوجستي" 
                    value={logisticsReceived} 
                    icon={TruckIcon}
                    subtext={`تم تنفيذ ${logisticsCompleted}`}
                />
                <Card 
                    title="إجمالي العقود والرخص" 
                    value={activeLeases + activeLicenses + activeServiceContracts} 
                    icon={DocumentIcon}
                    subtext="فعالة حالياً"
                />
            </div>

            {/* Maintenance Analysis Section (New Request) */}
            <div>
                <SectionHeader title="تحليل الصيانة والأعطال" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Summary Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white h-full shadow-lg relative overflow-hidden">
                            <div className="relative z-10 flex flex-col justify-between h-full">
                                <div>
                                    <h4 className="text-lg font-bold text-gray-300 mb-2">إجمالي خدمات الصيانة</h4>
                                    <p className="text-5xl font-black text-[#eab308] tracking-tight">{totalMalfunctions}</p>
                                    <p className="text-sm text-gray-400 mt-2">عطل مسجل خلال الشهر</p>
                                </div>
                                <div className="mt-8 pt-8 border-t border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-700 rounded-lg">
                                            {ToolIcon}
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">المقر الأكثر تضرراً</p>
                                            <p className="font-bold text-white">{topLocations[0]?.location || 'لا يوجد بيانات'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                             {/* Decorative Background */}
                             <div className="absolute top-0 left-0 w-32 h-32 bg-[#eab308] rounded-full filter blur-[60px] opacity-10"></div>
                        </div>
                    </div>

                    {/* Malfunction Breakdown By Location (New Request) */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                             <span className="w-2 h-6 bg-red-500 rounded-full"></span>
                            تفصيل الأعطال حسب المقر (الأكثر تكراراً)
                        </h4>
                        {topLocations.length > 0 ? (
                            <div className="space-y-1">
                                {topLocations.map((loc, idx) => (
                                    <LocationBar key={idx} name={loc.location} count={loc.count} max={maxLocationCount} />
                                ))}
                            </div>
                        ) : (
                            <div className="h-40 flex items-center justify-center text-gray-400">
                                لا توجد بيانات أعطال مسجلة
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Security & Safety Section (Expanded as Requested) */}
            <div>
                <SectionHeader title="إحصائيات الأمن والسلامة" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     {/* Visitors */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                        <span className="mb-3 p-3 bg-blue-50 text-blue-600 rounded-full">{UserGroupIcon}</span>
                        <span className="text-3xl font-bold text-slate-800 mb-1">{totalVisitors}</span>
                        <span className="text-xs text-slate-500 font-bold uppercase">إجمالي الزوار</span>
                    </div>

                     {/* Supplier Visitors (New) */}
                     <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
                        <span className="mb-3 p-3 bg-indigo-50 text-indigo-600 rounded-full">{TruckIcon}</span>
                        <span className="text-3xl font-bold text-slate-800 mb-1">{totalSupplierVisitors}</span>
                        <span className="text-xs text-slate-500 font-bold uppercase">زوار من الموردين</span>
                    </div>

                    {/* Security Reports (Cameras + Guards) */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-slate-800"></div>
                        <span className="mb-3 p-3 bg-slate-100 text-slate-700 rounded-full">{ShieldIcon}</span>
                        <span className="text-3xl font-bold text-slate-800 mb-1">{securityReports}</span>
                        <span className="text-xs text-slate-500 font-bold uppercase">تقارير أمنية (كاميرات + حراس)</span>
                    </div>

                    {/* Emergencies (New) */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
                        <span className="mb-3 p-3 bg-red-50 text-red-600 rounded-full">{BellAlertIcon}</span>
                        <span className="text-3xl font-bold text-slate-800 mb-1">{totalEmergencies}</span>
                        <span className="text-xs text-slate-500 font-bold uppercase">الحالات الطارئة</span>
                    </div>

                    {/* Evacuations (New) */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-orange-500"></div>
                        <span className="mb-3 p-3 bg-orange-50 text-orange-600 rounded-full">{FireIcon}</span>
                        <span className="text-3xl font-bold text-slate-800 mb-1">{totalEvacuations}</span>
                        <span className="text-xs text-slate-500 font-bold uppercase">حالات الإخلاء</span>
                    </div>

                    {/* Card Activations */}
                     <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                        <span className="mb-3 p-3 bg-emerald-50 text-emerald-600 rounded-full">{CheckCircleIcon}</span>
                        <span className="text-3xl font-bold text-slate-800 mb-1">{totalCardActivations}</span>
                        <span className="text-xs text-slate-500 font-bold uppercase">تفعيل بطاقات</span>
                    </div>

                     {/* Hall Bookings */}
                     <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center relative overflow-hidden lg:col-span-2">
                        <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500"></div>
                        <div className="flex items-center justify-between w-full px-4">
                            <div className="text-right">
                                <span className="text-3xl font-bold text-slate-800 block mb-1">{hallBookings}</span>
                                <span className="text-xs text-slate-500 font-bold uppercase">حجوزات القاعات</span>
                            </div>
                            <span className="p-4 bg-cyan-50 text-cyan-600 rounded-full">{DocumentIcon}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Operational Status Section */}
            <div>
                 <SectionHeader title="حالة العمليات العامة" />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-green-500 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 font-medium">المهام المنجزة</p>
                            <h4 className="text-2xl font-bold text-slate-800">{totalTasks}</h4>
                        </div>
                        <div className="p-3 bg-green-100 text-green-600 rounded-full">
                            {CheckCircleIcon}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-red-500 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 font-medium">التحديات القائمة</p>
                            <h4 className="text-2xl font-bold text-slate-800">{totalChallenges}</h4>
                        </div>
                         <div className="p-3 bg-red-100 text-red-600 rounded-full">
                            {ExclamationTriangleIcon}
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    );
};
