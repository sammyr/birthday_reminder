export interface LogEntry {
    id: number;
    action: string;
    details: string;
    timestamp: string;
    userId?: string;
}
