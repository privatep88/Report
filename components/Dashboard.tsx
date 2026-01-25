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

const Card = ({ title, value, subtext, icon, colorClass = "bg-white" }: { title: string, value: string | number, subtext?: string, icon: React.ReactNode, colorClass?: string }) => (
    <div className={`${colorClass} rounded-xl shadow-md p-6 border border-gray-100 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg flex items-start justify-between`}>
        <div>
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <h4 className="text-3xl font-bold text-slate-800">{value}</h4>
            {subtext && <p className="text-xs text-gray-400 mt-2">{subtext}</p>}
        </div>
        <div className="p-3 bg-slate-50 rounded-lg text-yellow-600">
            {icon}
        </div>
    </div>
);

const SectionHeader = ({ title }: { title: string }) => (
    <div className="col-span-full mt-6 mb-4 flex items-center gap-2">
        <div className="h-6 w-1 bg-yellow-500 rounded-full"></div>
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
    </div>
);

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

    // 3. Maintenance
    const totalMalfunctions = data.malfunctionSummaryData.reduce((acc, curr) => acc + (parseFloat(curr.count) || 0), 0);
    // Find location with most issues (simple approximation)
    let maxIssues = 0;
    let maxIssueLocation = 'لا يوجد';
    data.malfunctionDetailData.forEach(row => {
        if(!row.location.includes('التكلفة')) {
            // FIX: Explicitly typed reduce to return a number and typed 'val' as any/unknown to handle Object.values inference.
            const rowTotal = Object.values(row).reduce<number>((acc, val: unknown) => {
                if (typeof val === 'string' && !isNaN(parseFloat(val)) && val !== row.location) {
                    return acc + parseFloat(val);
                }
                return acc;
            }, 0);
            if (rowTotal > maxIssues) {
                maxIssues = rowTotal;
                maxIssueLocation = row.location;
            }
        }
    });

    // 4. Logistics
    const logisticsReceived = parseFloat(data.requestDistributionData[0]?.total || '0');
    const logisticsCompleted = parseFloat(data.requestDistributionData[1]?.total || '0');

    // 5. Security
    const totalVisitors = data.securityReportData.reduce((acc, curr) => acc + (parseFloat(curr.visitors) || 0), 0);
    const totalCardActivations = data.securityReportData.reduce((acc, curr) => acc + (parseFloat(curr.cardActivations) || 0), 0);

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
    const ExclamationIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;

    return (
        <div className="space-y-6 animate-fadeIn">
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
                    colorClass={serviceCompletionRate >= 90 ? "bg-green-50 border-green-200" : "bg-white"}
                />
                <Card 
                    title="إجمالي الأعطال المسجلة" 
                    value={totalMalfunctions} 
                    icon={ToolIcon}
                    subtext={maxIssues > 0 ? `الأكثر: ${maxIssueLocation}` : undefined}
                />
                <Card 
                    title="طلبات الدعم اللوجستي" 
                    value={logisticsReceived} 
                    icon={TruckIcon}
                    subtext={`تم تنفيذ ${logisticsCompleted}`}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contracts Section */}
                <div className="lg:col-span-2">
                    <SectionHeader title="العقود والرخص الفعالة" />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Card title="عقود إيجارية" value={activeLeases} icon={DocumentIcon} />
                        <Card title="رخص تجارية" value={activeLicenses} icon={DocumentIcon} />
                        <Card title="عقود خدمات" value={activeServiceContracts} icon={DocumentIcon} />
                    </div>
                </div>

                {/* Challenges Summary */}
                <div>
                    <SectionHeader title="حالة العمليات" />
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 h-full">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="text-gray-600">المهام المنجزة</span>
                                <span className="font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">{totalTasks}</span>
                            </div>
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="text-gray-600">التحديات القائمة</span>
                                <span className="font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full">{totalChallenges}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">الحالات الطارئة</span>
                                <span className="font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                                    {data.securityReportData.reduce((acc, curr) => acc + (parseFloat(curr.emergencies) || 0), 0)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Security Stats */}
            <div>
                <SectionHeader title="الملخص الأمني" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-800 text-white rounded-xl p-4 shadow-md flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-bold text-yellow-400 mb-1">{totalVisitors}</span>
                        <span className="text-sm opacity-80">إجمالي الزوار</span>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-bold text-slate-800 mb-1">{totalCardActivations}</span>
                        <span className="text-sm text-gray-500">تفعيل بطاقات</span>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-bold text-slate-800 mb-1">
                             {data.securityReportData.reduce((acc, curr) => acc + (parseFloat(curr.hallBookings) || 0), 0)}
                        </span>
                        <span className="text-sm text-gray-500">حجوزات القاعات</span>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-bold text-slate-800 mb-1">
                             {data.securityReportData.reduce((acc, curr) => acc + (parseFloat(curr.securityReports) || 0), 0)}
                        </span>
                        <span className="text-sm text-gray-500">تقارير أمنية</span>
                    </div>
                </div>
            </div>
        </div>
    );
};