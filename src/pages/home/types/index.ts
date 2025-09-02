export interface ISession {
    id: string,
    device_id: string,
    time_type: "time"|"open",
    play_type: "single"|"multi",
    start_at: string,
    end_at: string
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
    type: string,
    status: boolean
}

export interface IReceipt {
    id: string,
    cashier: string,
    device_name: string,
    orders: string,
    time_orders: string,
    orders_cost: number
    end_at: string,
    total: number,
}

export interface IOuterReceipt {
    id: string,
    cashier: string,
    ordered_at: string,
    total: number,
}

export interface DevicePayload {
    name?: string,
    type?: string,
    status?: boolean
}

export interface IOrder {
    cost: number,
    quantity: string,
    product: string,
    product_name: string
}

export interface ITimeOrder {
    cost: number
    play_type: string;
    start_at: string;
    end_at: string;
    timeString: string;
}

export interface IFinance {
    finances: number;
    type: string;
    username: string;
    dailyFinances: number;
    monthlyFinances: number;
    admin: boolean;
    cashier: string; 
    cashier_id: string; 
    description: string
    added_at: string;
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