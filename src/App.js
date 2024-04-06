import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file

const API_URL = 'https://dummyjson.com/products';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      axios.get(API_URL)
        .then(response => {
          if (Array.isArray(response.data)) {
            setProducts(response.data);
          } else {
            // If the data is not an array, check if it contains a key that holds the array of products
            const productsData = response.data.products || [];
            setProducts(productsData);
          }
          setLoading(false);
        })
        .catch(error => console.error('Error fetching data:', error));
    }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter(product => {
    const productName = product.name ? product.name.toLowerCase() : '';
    const productCategory = product.category ? product.category.toLowerCase() : '';
    return productName.includes(searchTerm.toLowerCase()) ||
           productCategory.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h1 className="mt-5 mb-4">E-commerce Platform</h1>
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <div className="row">
        {filteredProducts.map(product => (
          <div key={product.id} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">Category: {product.category}</p>
                <p className="card-text">Price: ${product.price}</p>
                <button className="btn btn-primary" onClick={() => addToCart(product)}>Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <h2 className="mt-5">Shopping Cart</h2>
      <div className="row">
        {cart.map(item => (
          <div key={item.id} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">Price: ${item.price}</p>
                <button className="btn btn-danger" onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
