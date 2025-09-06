import React, { useState, useEffect } from "react";
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
  X
} from "lucide-react";

// Mock product data
const mockProducts = [
  { id: 1, name: "Sugar 1kg", price: 120, stock: 42, category: "Groceries" },
  { id: 2, name: "Bread", price: 50, stock: 30, category: "Bakery" },
  { id: 3, name: "Milk 500ml", price: 60, stock: 25, category: "Dairy" },
  { id: 4, name: "Cooking Oil 1L", price: 220, stock: 18, category: "Groceries" },
  { id: 5, name: "Rice 2kg", price: 280, stock: 15, category: "Groceries" },
  { id: 6, name: "Tea Leaves 250g", price: 150, stock: 22, category: "Beverages" },
  { id: 7, name: "Soap Bar", price: 80, stock: 40, category: "Toiletries" },
  { id: 8, name: "Toothpaste", price: 110, stock: 28, category: "Toiletries" },
  { id: 9, name: "Mineral Water 500ml", price: 40, stock: 50, category: "Beverages" },
  { id: 10, name: "Notebook", price: 75, stock: 35, category: "Stationery" },
];

// Product Search Component
const ProductSearch = ({ onAddToCart }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(mockProducts);
    } else {
      const filtered = mockProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm]);

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
          <div key={product.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px',
            borderBottom: '1px solid #f3f4f6'
          }}>
            <div>
              <div style={{ fontWeight: '500' }}>{product.name}</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                KES {product.price} • {product.category} • Stock: {product.stock}
              </div>
            </div>
            <button
              onClick={() => onAddToCart(product)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Add to Cart
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
        <div key={item.id} style={{
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
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
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
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              style={{
                padding: '4px',
                backgroundColor: '#f3f4f6',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              <Plus size={14} />
            </button>
            
            <button
              onClick={() => onRemoveItem(item.id)}
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

// Checkout Component
const Checkout = ({ cartItems, selectedPayment, onPaymentChange }) => {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const vat = subtotal * 0.16;
  const discount = cartItems.length > 0 ? 50 : 0;
  const total = subtotal + vat - discount;

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
            className={`payment-btn ${selectedPayment === 'card' ? 'active' : ''}`}
            onClick={() => onPaymentChange('card')}
          >
            <CreditCard size={20} style={{ marginBottom: '5px' }} />
            Card
          </button>
          <button 
            className={`payment-btn ${selectedPayment === 'mpesa' ? 'active' : ''}`}
            onClick={() => onPaymentChange('mpesa')}
          >
            <div style={{ fontSize: '20px', marginBottom: '5px' }}>📱</div>
            M-Pesa
          </button>
          <button 
            className={`payment-btn ${selectedPayment === 'credit' ? 'active' : ''}`}
            onClick={() => onPaymentChange('credit')}
          >
            <div style={{ fontSize: '20px', marginBottom: '5px' }}>📋</div>
            Credit
          </button>
        </div>
        
        {selectedPayment === 'mpesa' && (
          <div style={{ marginTop: '15px' }}>
            <input 
              type="tel" 
              placeholder="Enter M-Pesa number (07XX XXX XXX)"
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
        
        {selectedPayment === 'card' && (
          <div style={{ marginTop: '15px', fontSize: '14px', color: '#6b7280' }}>
            Insert card or tap when ready
          </div>
        )}
      </div>

      <div className="checkout-summary">
        <h3 className="summary-title">Order Summary</h3>
        <div className="summary-line">
          <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
          <span>KES {subtotal.toFixed(2)}</span>
        </div>
        <div className="summary-line">
          <span>VAT (16%)</span>
          <span>KES {vat.toFixed(2)}</span>
        </div>
        <div className="summary-line">
          <span>Discount</span>
          <span>-KES {discount.toFixed(2)}</span>
        </div>
        <div className="summary-line total">
          <span>Total</span>
          <span>KES {total.toFixed(2)}</span>
        </div>
        <button className="checkout-btn" disabled={cartItems.length === 0}>
          Complete Sale - KES {total.toFixed(2)}
        </button>
      </div>
    </div>
  );
};

// Main POS Component
const POSHomePage = () => {
  const [selectedPayment, setSelectedPayment] = useState("cash");
  const [cartItems, setCartItems] = useState([]);

  // Function to add product to cart
  const handleAddToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
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
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Function to remove item from cart
  const handleRemoveItem = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Rich Analytics Component
  const AnalyticsSection = () => {
    const totalSales = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const transactionCount = cartItems.length > 0 ? 1 : 0; // Simplified for demo
    const avgSale = cartItems.length > 0 ? totalSales / cartItems.reduce((sum, item) => sum + item.quantity, 0) : 0;
    const itemsSold = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
          Quick search & add to cart
        </div>
      </div>
      <div className="search-content">
        <ProductSearch onAddToCart={handleAddToCart} />
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
        <button className="quick-action-btn">
          <Receipt size={20} style={{ marginBottom: '8px' }} />
          <div>Last Receipt</div>
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
    />
  );

  return (
    <div className="pos-content-grid">
      <AnalyticsSection />
      <SearchSection />
      <QuickActionsSection />
      <CartSection />
      <CheckoutSection />
    </div>
  );
};

export default POSHomePage;