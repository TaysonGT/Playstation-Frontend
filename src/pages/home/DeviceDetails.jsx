import React, { useState } from 'react';

const DeviceDetails = () => {
  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState('');
  const [newQuantity, setNewQuantity] = useState('');

  // Sample product list
  const productList = ['Product A', 'Product B', 'Product C'];

  const handleAddOrder = () => {
    if (newProduct.trim() !== '' && newQuantity !== '') {
      const newOrder = {
        product: newProduct,
        quantity: parseInt(newQuantity),
      };
      setOrders([...orders, newOrder]);
      setNewProduct('');
      setNewQuantity('');
    }
  };

  const handleClockTick = () => {
    // Handle clock ticking
  };

  return (
    <div dir='rtl' className="text-center fixed z-[102] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 shadow-md rounded-lg p-6 w-full max-w-screen-md">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="w-full md:w-1/3 pr-0 md:pr-2 mb-4 md:mb-0">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">طلب جديد</h2>
          <select
            value={newProduct}
            onChange={(e) => setNewProduct(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
          >
            <option value="">Select Product</option>
            {productList.map((product, index) => (
              <option key={index} value={product}>{product}</option>
            ))}
          </select>
          <input
            type="number"
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
            placeholder="Enter Quantity"
          />
          <button
            onClick={handleAddOrder}
            className="w-full bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800"
          >
            Add Order
          </button>
        </div>
        <div className="w-full md:w-1/2 px-4 mb-4 md:mb-0">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">الطلبات</h2>
          {/* Orders of the session */}
          <ul>
            {orders.map((order, index) => (
              <li key={index}>{order.product} - Quantity: {order.quantity}</li>
            ))}
          </ul>
        </div>
        <div className="w-full md:w-1/3 pl-0 md:pl-2">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">Timer</h2>
          {/* Clock with timer */}
          <div className="flex justify-center">
            <div className="text-2xl font-bold">01:30:00</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetails;
