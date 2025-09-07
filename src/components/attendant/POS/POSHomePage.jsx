import React, { useState, useEffect, useRef, forwardRef } from "react";
import {
  TrendingUp,
  Clock,
  Scan,
  Calculator,
  Receipt,
  Package,
  CreditCard,
  Plus,
  Minus,
  Trash2,
  Search,
  X,
  Printer
} from "lucide-react";
import { useReactToPrint } from 'react-to-print';
import apiClient from '../../../services/utils/apiClient';

// Receipt Component
const ReceiptComponent = forwardRef(({ sale }, ref) => {
  if (!sale) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-KE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <>
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .receipt-container, .receipt-container * {
            visibility: visible;
          }
          .receipt-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm;
            font-size: 12px;
            font-family: 'Courier New', monospace;
          }
          .receipt-header {
            text-align: center;
            margin-bottom: 10px;
          }
          .receipt-title {
            font-size: 16px;
            font-weight: bold;
            margin: 0;
          }
          .receipt-info {
            margin: 5px 0;
            font-size: 11px;
          }
          .receipt-divider {
            border-top: 1px dashed #000;
            margin: 8px 0;
          }
          .receipt-item {
            display: flex;
            justify-content: space-between;
            margin: 3px 0;
            font-size: 11px;
          }
          .receipt-total {
            font-weight: bold;
            font-size: 12px;
            border-top: 1px solid #000;
            padding-top: 5px;
          }
          .receipt-footer {
            text-align: center;
            margin-top: 10px;
            font-size: 10px;
          }
        }
      `}</style>
      
      <div ref={ref} className="receipt-container" style={{ display: 'none' }}>
        <div className="receipt-header">
          <h2 className="receipt-title">PHARMACY RECEIPT</h2>
          <div className="receipt-info">Receipt: {sale.receiptNumber}</div>
          <div className="receipt-info">Date: {formatDate(sale.createdAt)}</div>
        </div>
        
        <div className="receipt-divider"></div>
        
        <div className="receipt-items">
          {sale.items.map((item, index) => (
            <div key={index}>
              <div className="receipt-item">
                <span>{item.productName}</span>
              </div>
              <div className="receipt-item">
                <span>{item.quantity} {item.unitType} × KES {item.unitPrice}</span>
                <span>KES {item.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="receipt-divider"></div>
        
        <div className="receipt-item">
          <span>Subtotal:</span>
          <span>KES {sale.subtotal.toFixed(2)}</span>
        </div>
        
        <div className="receipt-item receipt-total">
          <span>TOTAL:</span>
          <span>KES {sale.totalAmount.toFixed(2)}</span>
        </div>
        
        <div className="receipt-item">
          <span>Paid ({sale.paymentMethod.toUpperCase()}):</span>
          <span>KES {sale.amountPaid.toFixed(2)}</span>
        </div>
        
        {sale.changeDue > 0 && (
          <div className="receipt-item">
            <span>Change:</span>
            <span>KES {sale.changeDue.toFixed(2)}</span>
          </div>
        )}
        
        <div className="receipt-footer">
          <div>Thank you for your business!</div>
          <div>Come again soon</div>
        </div>
      </div>
    </>
  );
});

// Product Search Component
const ProductSearch = ({ onAddToCart, products, loading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
        Loading products...
      </div>
    );
  }

  return (
    <div>
      <div style={{ position: 'relative', marginBottom: '15px' }}>
        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
        <input
          type="text"
          placeholder="Search products by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 10px 10px 40px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px'
          }}
        />
        {searchTerm && (
          <X 
            size={16} 
            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', cursor: 'pointer' }}
            onClick={() => setSearchTerm("")}
          />
        )}
      </div>
      
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {filteredProducts.map(product => (
          <div key={product._id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px',
            borderBottom: '1px solid #f3f4f6'
          }}>
            <div>
              <div style={{ fontWeight: '500' }}>{product.name}</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                KES {product.pricing.pricePerUnit} • {product.category} • Stock: {product.stock.totalUnits}
              </div>
            </div>
            <button
              onClick={() => onAddToCart(product)}
              disabled={product.stock.totalUnits === 0}
              style={{
                padding: '6px 12px',
                backgroundColor: product.stock.totalUnits === 0 ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: product.stock.totalUnits === 0 ? 'not-allowed' : 'pointer',
                fontSize: '12px'
              }}
            >
              {product.stock.totalUnits === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        ))}
        
        {filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
            No products found
          </div>
        )}
      </div>
    </div>
  );
};

// Cart Summary Component
const CartSummary = ({ cartItems, onUpdateQuantity, onRemoveItem }) => {
  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
        Your cart is empty
      </div>
    );
  }

  return (
    <div>
      {cartItems.map(item => (
        <div key={item._id} style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 0',
          borderBottom: '1px solid #f3f4f6'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '500' }}>{item.name}</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              KES {item.price} × {item.quantity}
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
              style={{
                padding: '4px',
                backgroundColor: '#f3f4f6',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              <Minus size={14} />
            </button>
            
            <span style={{ minWidth: '20px', textAlign: 'center' }}>
              {item.quantity}
            </span>
            
            <button
              onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
              disabled={item.quantity >= item.availableStock}
              style={{
                padding: '4px',
                backgroundColor: item.quantity >= item.availableStock ? '#f9fafb' : '#f3f4f6',
                border: 'none',
                borderRadius: '4px',
                cursor: item.quantity >= item.availableStock ? 'not-allowed' : 'pointer',
                opacity: item.quantity >= item.availableStock ? 0.5 : 1
              }}
            >
              <Plus size={14} />
            </button>
            
            <button
              onClick={() => onRemoveItem(item._id)}
              style={{
                padding: '4px',
                backgroundColor: '#fef2f2',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                color: '#ef4444',
                marginLeft: '8px'
              }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Checkout Component with Auto Print
const Checkout = ({ cartItems, selectedPayment, onPaymentChange, onCompleteSale, loading, autoPrint, onAutoPrintChange, onPrintReceipt, lastSale }) => {
  const [mpesaNumber, setMpesaNumber] = useState("");
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal;

  const handleCompleteSale = () => {
    const paymentData = {
      paymentMethod: selectedPayment,
      amountPaid: total
    };
    
    if (selectedPayment === 'mpesa' && mpesaNumber) {
      paymentData.mpesaNumber = mpesaNumber;
    }
    
    onCompleteSale(paymentData);
  };

  return (
    <div className="checkout-section">
      <div className="payment-methods">
        <h3 className="payment-title">Payment Method</h3>
        <div className="payment-grid">
          <button 
            className={`payment-btn ${selectedPayment === 'cash' ? 'active' : ''}`}
            onClick={() => onPaymentChange('cash')}
          >
            <div style={{ fontSize: '20px', marginBottom: '5px' }}>💵</div>
            Cash
          </button>
         
          <button 
            className={`payment-btn ${selectedPayment === 'mpesa' ? 'active' : ''}`}
            onClick={() => onPaymentChange('mpesa')}
          >
            <div style={{ fontSize: '20px', marginBottom: '5px' }}>📱</div>
            M-Pesa
          </button>
         
        </div>
        
        {selectedPayment === 'mpesa' && (
          <div style={{ marginTop: '15px' }}>
            <input 
              type="tel" 
              placeholder="Enter M-Pesa number (07XX XXX XXX)"
              value={mpesaNumber}
              onChange={(e) => setMpesaNumber(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
        )}
        
        
        

        
      </div>

      <div className="checkout-summary">
        <h3 className="summary-title">Order Summary</h3>
        
        {/* Auto Print Toggle */}
        <div style={{ 
          marginBottom: '15px',
          padding: '10px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between'
          }}>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>
              Auto Print Receipt
            </span>
            <button
              onClick={() => onAutoPrintChange(!autoPrint)}
              style={{
                width: '48px',
                height: '24px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: autoPrint ? '#10b981' : '#d1d5db',
                position: 'relative',
                transition: 'background-color 0.2s'
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  position: 'absolute',
                  top: '2px',
                  left: autoPrint ? '26px' : '2px',
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}
              />
            </button>
          </div>
        </div>
        
        <div className="summary-line total">
          <span>Total ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
          <span>KES {total.toFixed(2)}</span>
        </div>
        
        <button 
          className="checkout-btn" 
          disabled={cartItems.length === 0 || loading || (selectedPayment === 'mpesa' && !mpesaNumber)}
          onClick={handleCompleteSale}
        >
          {loading ? 'Processing...' : `Complete Sale - KES ${total.toFixed(2)}`}
        </button>
        
        {/* Manual Print Receipt Button */}
        {autoPrint && lastSale && (
          <button 
            onClick={onPrintReceipt}
            style={{
              width: '100%',
              marginTop: '10px',
              padding: '10px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Printer size={16} />
            Print Receipt
          </button>
        )}
      </div>
    </div>
  );
};

// Main POS Component
const POSHomePage = () => {
  const [selectedPayment, setSelectedPayment] = useState("cash");
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [todaysSales, setTodaysSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saleLoading, setSaleLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Receipt printing states
  const [autoPrint, setAutoPrint] = useState(false);
  const [lastSale, setLastSale] = useState(null);
  const receiptRef = useRef();
  
  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    onAfterPrint: () => {
      // Clear sale state after printing
      setLastSale(null);
    }
  });

  // Function to fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await apiClient.get('/inventory/products');
      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError('Failed to load products. Please check your connection.');
    }
  };

  // Function to fetch today's sales
  const fetchTodaysSales = async () => {
    try {
      const response = await apiClient.get('/pos/sales?date=today');
      if (response.data.success) {
        setTodaysSales(response.data.data);
      } else {
        throw new Error('Failed to fetch sales');
      }
    } catch (error) {
      console.error('Failed to fetch sales:', error);
      setError('Failed to load sales data. Please check your connection.');
    }
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([fetchProducts(), fetchTodaysSales()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Function to add product to cart
  const handleAddToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id);
      
      if (existingItem) {
        if (existingItem.quantity >= product.stock.totalUnits) {
          alert('Cannot add more items. Stock limit reached.');
          return prevItems;
        }
        
        return prevItems.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { 
          _id: product._id,
          name: product.name,
          price: product.pricing.pricePerUnit,
          quantity: 1,
          availableStock: product.stock.totalUnits,
          unitType: product.unitType
        }];
      }
    });
  };

  // Function to update item quantity
  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item._id === productId) {
          if (newQuantity > item.availableStock) {
            alert('Cannot exceed available stock.');
            return item;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Function to remove item from cart
  const handleRemoveItem = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
  };

  // Function to complete sale with receipt printing
  const handleCompleteSale = async (paymentData) => {
    if (cartItems.length === 0) return;

    setSaleLoading(true);
    
    try {
      const saleData = {
        items: cartItems.map(item => ({
          productId: item._id,
          quantity: item.quantity
        })),
        paymentMethod: paymentData.paymentMethod,
        amountPaid: paymentData.amountPaid
      };

      if (paymentData.mpesaNumber) {
        saleData.mpesaNumber = paymentData.mpesaNumber;
      }

      const response = await apiClient.post('/pos/sales', saleData);
      
      if (response.data.success) {
        // Clear cart and refresh data
        setCartItems([]);
        await fetchTodaysSales();
        await fetchProducts();
        
        // Handle receipt printing based on autoPrint setting
        if (autoPrint) {
          setLastSale(response.data.data.sale);
          // Trigger print after a short delay to ensure component is mounted
          setTimeout(() => {
            handlePrint();
          }, 100);
        } else {
          // Just show success alert if not auto-printing
          alert(`Sale completed successfully! Receipt: ${response.data.data.sale.receiptNumber}`);
        }
      } else {
        throw new Error(response.data.message || 'Sale failed');
      }
    } catch (error) {
      console.error('Sale failed:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Sale failed due to network error';
      alert(`Sale failed: ${errorMessage}`);
    } finally {
      setSaleLoading(false);
    }
  };

  // Function to manually print receipt
  const handlePrintReceipt = () => {
    if (lastSale) {
      handlePrint();
    }
  };

  // Rich Analytics Component
  const AnalyticsSection = () => {
    const totalSales = todaysSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const transactionCount = todaysSales.length;
    const avgSale = transactionCount > 0 ? totalSales / transactionCount : 0;
    const itemsSold = todaysSales.reduce((sum, sale) => 
      sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );

    return (
      <div className="analytics-section">
        <div className="analytics-header">
          <h3 className="analytics-title">Today's Overview</h3>
          <TrendingUp size={20} />
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">KES {totalSales.toFixed(2)}</div>
            <div className="stat-label">Sales Today</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{transactionCount}</div>
            <div className="stat-label">Transactions</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">KES {avgSale.toFixed(2)}</div>
            <div className="stat-label">Avg. Sale</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{itemsSold}</div>
            <div className="stat-label">Items Sold</div>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Product Search Section
  const SearchSection = () => (
    <div className="search-section">
      <div className="search-header">
        <h3 className="search-title">Product Search</h3>
        <div style={{ fontSize: '12px', color: '#ff6b35' }}>
          
          Quick search & add to cart
        </div>
      </div>
      <div className="search-content">
        <ProductSearch 
          onAddToCart={handleAddToCart} 
          products={products} 
          loading={loading}
        />
      </div>
    </div>
  );

  // Quick Actions Section
  const QuickActionsSection = () => (
    <div className="quick-actions-section">
      <h3 className="quick-actions-title">Quick Actions</h3>
      <div className="quick-actions-grid">
        <button className="quick-action-btn">
          <Scan size={20} style={{ marginBottom: '8px' }} />
          <div>Scan Barcode</div>
        </button>
        <button className="quick-action-btn">
          <Calculator size={20} style={{ marginBottom: '8px' }} />
          <div>Manual Entry</div>
        </button>
        <button 
          className="quick-action-btn"
          onClick={() => window.location.reload()}
        >
          <Receipt size={20} style={{ marginBottom: '8px' }} />
          <div>Refresh Data</div>
        </button>
        <button className="quick-action-btn">
          <Package size={20} style={{ marginBottom: '8px' }} />
          <div>Check Stock</div>
        </button>
      </div>
    </div>
  );

  // Enhanced Cart Section
  const CartSection = () => (
    <div className="cart-section">
      <div className="cart-header">
        <h3 className="cart-title">Shopping Cart</h3>
        <div className="cart-count">
          {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        </div>
      </div>
      <div className="cart-content">
        <CartSummary 
          cartItems={cartItems} 
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />
      </div>
    </div>
  );

  // Enhanced Checkout Section
  const CheckoutSection = () => (
    <Checkout 
      cartItems={cartItems}
      selectedPayment={selectedPayment}
      onPaymentChange={setSelectedPayment}
      onCompleteSale={handleCompleteSale}
      loading={saleLoading}
      autoPrint={autoPrint}
      onAutoPrintChange={setAutoPrint}
      onPrintReceipt={handlePrintReceipt}
      lastSale={lastSale}
    />
  );

  // Loading state
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div>Loading POS data...</div>
        {error && <div style={{ color: '#ef4444', fontSize: '14px' }}>{error}</div>}
      </div>
    );
  }

  // Error state
  if (error && products.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div style={{ color: '#ef4444' }}>Error: {error}</div>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="pos-content-grid">
        <AnalyticsSection />
        <SearchSection />
        <QuickActionsSection />
        <CartSection />
        <CheckoutSection />
      </div>
      
      {/* Hidden Receipt Component for Printing */}
      {lastSale && (
        <ReceiptComponent ref={receiptRef} sale={lastSale} />
      )}
    </>
  );
};

export default POSHomePage;