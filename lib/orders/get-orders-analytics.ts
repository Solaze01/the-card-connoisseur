import { createSupabaseAdminClient } from "@/lib/supabase-admin";
import type {
  DailyInsight,
  MonthlyInsight,
  OrdersAnalytics,
  ProductInsight,
  StatusBreakdownItem,
} from "@/types/analytics";
import type { OrderStatus } from "@/types/order";

type DbOrderRow = {
  id: string;
  created_at: string;
  total_amount: number;
  status: OrderStatus;
};

type DbOrderItemRow = {
  product_id: string;
  product_name: string;
  quantity: number;
  line_total: number;
};

const orderedStatuses: OrderStatus[] = [
  "new",
  "confirmed",
  "processing",
  "delivered",
  "cancelled",
];

function startOfWeek(date: Date) {
  const current = new Date(date);
  const day = current.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  current.setHours(0, 0, 0, 0);
  current.setDate(current.getDate() + diff);
  return current;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function formatDayKey(dateValue: string) {
  const date = new Date(dateValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatMonthKey(dateValue: string) {
  const date = new Date(dateValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

export async function getOrdersAnalytics(): Promise<OrdersAnalytics> {
  const supabase = createSupabaseAdminClient();
  const now = new Date();
  const weekStart = startOfWeek(now);
  const monthStart = startOfMonth(now);

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("id, created_at, total_amount, status")
    .order("created_at", { ascending: false })
    .returns<DbOrderRow[]>();

  if (ordersError) {
    throw new Error(ordersError.message);
  }

  const { data: orderItems, error: orderItemsError } = await supabase
    .from("order_items")
    .select("product_id, product_name, quantity, line_total")
    .returns<DbOrderItemRow[]>();

  if (orderItemsError) {
    throw new Error(orderItemsError.message);
  }

  const safeOrders = orders ?? [];
  const safeOrderItems = orderItems ?? [];

  const totalRevenue = safeOrders.reduce(
    (sum, order) => sum + Number(order.total_amount),
    0,
  );

  const ordersThisWeek = safeOrders.filter(
    (order) => new Date(order.created_at) >= weekStart,
  ).length;

  const ordersThisMonth = safeOrders.filter(
    (order) => new Date(order.created_at) >= monthStart,
  ).length;

  const productMap = new Map<string, ProductInsight>();

  for (const item of safeOrderItems) {
    const existing = productMap.get(item.product_id);

    if (existing) {
      existing.quantitySold += item.quantity;
      existing.revenue += Number(item.line_total);
      continue;
    }

    productMap.set(item.product_id, {
      productId: item.product_id,
      productName: item.product_name,
      quantitySold: item.quantity,
      revenue: Number(item.line_total),
    });
  }

  const bestSellingProducts = Array.from(productMap.values()).sort((a, b) => {
    if (b.quantitySold !== a.quantitySold) {
      return b.quantitySold - a.quantitySold;
    }

    return b.revenue - a.revenue;
  });

  const statusCountMap = new Map<OrderStatus, number>(
    orderedStatuses.map((status) => [status, 0]),
  );

  for (const order of safeOrders) {
    statusCountMap.set(order.status, (statusCountMap.get(order.status) ?? 0) + 1);
  }

  const statusBreakdown: StatusBreakdownItem[] = orderedStatuses.map((status) => ({
    status,
    count: statusCountMap.get(status) ?? 0,
  }));

  const dailyMap = new Map<string, DailyInsight>();

  for (const order of safeOrders) {
    const key = formatDayKey(order.created_at);
    const existing = dailyMap.get(key);

    if (existing) {
      existing.orders += 1;
      existing.revenue += Number(order.total_amount);
      continue;
    }

    dailyMap.set(key, {
      date: key,
      orders: 1,
      revenue: Number(order.total_amount),
    });
  }

  const dailyInsights = Array.from(dailyMap.values()).sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  const monthlyMap = new Map<string, MonthlyInsight>();

  for (const order of safeOrders) {
    const key = formatMonthKey(order.created_at);
    const existing = monthlyMap.get(key);

    if (existing) {
      existing.orders += 1;
      existing.revenue += Number(order.total_amount);
      continue;
    }

    monthlyMap.set(key, {
      month: key,
      orders: 1,
      revenue: Number(order.total_amount),
    });
  }

  const monthlyInsights = Array.from(monthlyMap.values()).sort((a, b) =>
    b.month.localeCompare(a.month),
  );

  return {
    summary: {
      totalOrders: safeOrders.length,
      totalRevenue,
      ordersThisWeek,
      ordersThisMonth,
    },
    bestSellingProducts,
    statusBreakdown,
    dailyInsights,
    monthlyInsights,
  };
}
