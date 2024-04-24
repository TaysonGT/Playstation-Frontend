import React from 'react';

const Revenue = () => {
  // Placeholder data
  const dailyRevenue = 1000;
  const weeklyRevenue = 7000;
  const monthlyRevenue = 30000;
  const yearlyRevenue = 360000;

  const deductionGrowthLossPercent = 10; // Example growth/loss percentage for deductions
  const productSalesGrowthLossPercent = -5; // Example growth/loss percentage for product sales

  return (
    <div dir='rtl' className="container px-36 min-h-screen bg-[#0d47a1]  pt-32">
      <h1 className="text-3xl font-semibold mb-6 text-white">لوحة المعلومات</h1>

      {/* Revenue Calculation Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Daily Revenue */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-2">الايراد اليومي</h2>
          <p className="text-2xl font-bold">{dailyRevenue}<span className='font-noto'>ج</span></p>
        </div>

        {/* Weekly Revenue */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-2">الايراد الاسبوعي</h2>
          <p className="text-2xl font-bold">{weeklyRevenue}<span className='font-noto'>ج</span></p>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-2">الايراد الشهري</h2>
          <p className="text-2xl font-bold">{monthlyRevenue}<span className='font-noto'>ج</span></p>
        </div>

        {/* Yearly Revenue */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-2">الايراد السنوي</h2>
          <div className='flex gap-4 items-end'>
            <p className="text-2xl font-bold">{yearlyRevenue}<span className='font-noto'>ج</span></p>
            <p className={`text-lg font-bold ${deductionGrowthLossPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>{deductionGrowthLossPercent}% ↑</p>
          </div>
        </div>
      </div>

      {/* Growth/Loss Percentage Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
        {/* Deduction Growth/Loss Percentage */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-2">الخصومات </h2>
          <div className='flex gap-4 items-end'>
            <p className="text-2xl font-bold">{yearlyRevenue}<span className='font-noto'>ج</span></p>
            <p className={`text-lg font-bold ${deductionGrowthLossPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>{deductionGrowthLossPercent}% ↑</p>
          </div>
        </div>

        {/* Product Sales Growth/Loss Percentage */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-2">Product Sales Growth/Loss %</h2>
          <div className='flex gap-4 items-end'>
            <p className="text-2xl font-bold">{yearlyRevenue}<span className='font-noto'>ج</span></p>
            <p className={`text-lg font-bold ${productSalesGrowthLossPercent >= 0 ?    'text-green-500' : 'text-red-500'}`}>{Math.abs(productSalesGrowthLossPercent)}% ↓</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
