import type { OrderStatus } from "@/types/order";

export type AnalyticsSummary = {
  totalOrders: number;
  totalRevenue: number;
  ordersThisWeek: number;
  ordersThisMonth: number;
};

export type ProductInsight = {
  productId: string;
  productName: string;
  quantitySold: number;
  revenue: number;
};

export type StatusBreakdownItem = {
  status: OrderStatus;
  count: number;
};

export type DailyInsight = {
  date: string;
  orders: number;
  revenue: number;
};

export type MonthlyInsight = {
  month: string;
  orders: number;
  revenue: number;
};

export type OrdersAnalytics = {
  summary: AnalyticsSummary;
  bestSellingProducts: ProductInsight[];
  statusBreakdown: StatusBreakdownItem[];
  dailyInsights: DailyInsight[];
  monthlyInsights: MonthlyInsight[];
};
