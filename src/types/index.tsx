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
    session: ISession,
    status: boolean
}

export interface IReceipt {
    id: string,
    cashier: IUser,
    device: IDevice,
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
    quantity: string,
    product: IProduct,
}

export interface ITimeOrder {
    cost: number
    play_type: string;
    started_at: string;
    ended_at: string;
    timeString: string;
}

export interface IFinanceReport{
    // Day Report
    dailyFinances: number;
    dailyGrowthLoss: number;
    dailyGrowthLossSign: boolean;
    dailyDeduction: number;
    dailyDeductionGrowthLoss: number;
    dailyDeductionGrowthLossSign: boolean;

    // Week Report
    weeklyFinances: number;
    weeklyGrowthLoss: number;
    weeklyGrowthLossSign: boolean;
    weeklyDeduction: number;
    weeklyDeductionGrowthLoss: number;
    weeklyDeductionGrowthLossSign: boolean;

    // Month Report 
    monthlyFinances: number;
    monthlyGrowthLoss: number;
    monthlyGrowthLossSign: boolean;
    monthlyDeduction: number;
    monthlyDeductionGrowthLoss: number;
    monthlyDeductionGrowthLossSign: boolean;

    // Year Report
    yearlyFinances: number;
    yearlyGrowthLoss: number;
    yearlyGrowthLossSign: boolean;
    yearlyDeduction: number;
    yearlyDeductionGrowthLoss: number;
    yearlyDeductionGrowthLossSign: boolean;
    
    // Products Report
    productsRevenue: number;
    productsGrowthLoss: number;
    productsGrowthLossSign: boolean;
}