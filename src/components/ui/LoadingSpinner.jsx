import React from 'react';
import './LoadingSpinner.css'; // Create this CSS file

const LoadingSpinner = () => (
  <div className="spinner-container">
    <div className="spinner"></div>
    {/* Optional: Add text */}
    {/* <p>Loading...</p> */}
  </div>
);

export default LoadingSpinner;
