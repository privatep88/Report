
export interface ServiceRequest {
    id: number;
    service: string;
    received: string;
    completed: string;
}

export interface ContractStatus {
    id: number;
    active: string;
    inactive: string;
    notes: string;
}

export interface MalfunctionSummary {
    id: number;
    description: string;
    count: string;
}

export interface MalfunctionDetail {
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

export interface RequestDistribution {
    id: number;
    metric: string;
    total: string;
    values: { [key: string]: string };
}

export interface SecurityReportItem {
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

export interface TaskItem {
    id: number;
    subject: string;
    task: string;
}

export interface ChallengeItem {
    id: number;
    challenges: string;
    update: string;
    recommendation: string;
}

export interface SignatureData {
    id: number;
    title: string;
    name: string;
    role: string;
    signatureImage: string | null;
}