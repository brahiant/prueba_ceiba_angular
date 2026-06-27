export interface UtilizationReportRow {
  courtId: string;
  courtName: string;
  totalReservations: number;
  reservedHours: number;
  availableHours: number;
  totalIncome: number;
  occupancyRate: number;
}

export interface UtilizationReportResponse {
  from: string;
  to: string;
  rows: UtilizationReportRow[];
}
