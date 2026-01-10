
import type { ServiceRequest, ContractStatus, MalfunctionSummary, MalfunctionDetail, RequestDistribution, SecurityReportItem, TaskItem, ChallengeItem, SignatureData } from './types.ts';

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


export const initialReportState = {
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
