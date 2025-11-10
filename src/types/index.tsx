export interface IProduct {
    id: string
    name: string
    stock: number
    price: number
    consumed: number
}

export interface ProductPayload {
    name?: string
    stock?: number
    price?: number
    consumed?: number
}

export interface IAuthContext {
  currentUser: IUser | null;
  isLoading: boolean;
  loginUser: (username: string, password: string) => Promise<void>;
  firstLogin: (username: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  newUser: boolean;
}

export interface ISession {
    id: string,
    device: IDevice,
    time_type: "time"|"open",
    play_type: "single"|"multi",
    started_at: string,
    ended_at: string
}

export interface IDeviceType {
    id: string;
    name: string;
    single_price: number;
    multi_price: number;
} 

export interface IDevice {
    id: string,
    name: string,
    type: IDeviceType,
    session?: ISession,
    status: boolean
}

export interface ICollection {
    id: string,
    timestamp: string,
    cash_over_short: number,
    amount_collected: number,
    cash_counted: number,
    expected_cash: number,
    float_remaining: number,
    collected_by: IUser
}

export interface IEmployeeReport{
    id: string,
    username: string,
    firstReceipt: string,
    total: number
}

export interface IReceipt {
    id: string,
    cashier: IUser,
    device: IDevice,
    description: string,
    orders: IOrder[],
    time_orders: ITimeOrder[],
    orders_cost: number
    type: 'deduction'|'session'|'outer'
    ended_at: string,
    created_at: string,
    total: number,
}

export interface IUser{
    id: string;
    username: string;
    role: 'admin'|'employee';
}

export interface IUserFinances extends IUser{
    dailyFinances: number;
    monthlyFinances: number;
}

export interface DevicePayload {
    name?: string,
    type?: string,
    status?: boolean
}

export interface IOrder {
    cost: number,
    quantity: number,
    product: IProduct,
}

export interface ITimeOrder {
    cost: number
    play_type: string;
    started_at: string;
    ended_at: string;
    time: string;
    device: IDevice
}

export interface IFinanceReport{
    // Day Report
    today: number;
    todayGrowthLoss: number;
    todayDeduction: number;
    todayDeductionGrowthLoss: number;

    // Week Report
    currentWeek: number;
    currentWeekGrowthLoss: number;
    currentWeekDeduction: number;
    currentWeekDeductionGrowthLoss: number;

    // Month Report 
    currentMonth: number;
    currentMonthGrowthLoss: number;
    currentMonthDeduction: number;
    currentMonthDeductionGrowthLoss: number;

    // Year Report
    currentYear: number;
    currentYearGrowthLoss: number;
    currentYearDeduction: number;
    currentYearDeductionGrowthLoss: number;

    // Products Report
    productsRevenue: number;
    productsGrowthLoss: number;
}