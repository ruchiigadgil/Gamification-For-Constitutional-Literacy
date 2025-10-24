// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// // Monkey patch to handle Google Translate DOM mutations
// if (typeof Node === 'function' && Node.prototype) {
//   const originalRemoveChild = Node.prototype.removeChild;
//   Node.prototype.removeChild = function (child) {
//     try {
//       return originalRemoveChild.call(this, child);
//     } catch (error) {
//       if (error.name === 'NotFoundError' || error.message.includes('The node to be removed is not a child')) {
//         console.warn('Google Translate interference detected in removeChild:', error);
//         return child; // Ignore the error to prevent crash
//       }
//       throw error;
//     }
//   };

//   const originalInsertBefore = Node.prototype.insertBefore;
//   Node.prototype.insertBefore = function (newNode, referenceNode) {
//     try {
//       return originalInsertBefore.call(this, newNode, referenceNode);
//     } catch (error) {
//       if (error.name === 'NotFoundError' || error.message.includes('The node before which the new node is to be inserted is not a child')) {
//         console.warn('Google Translate interference detected in insertBefore:', error);
//         // Fallback to append if insert fails
//         return this.appendChild(newNode);
//       }
//       throw error;
//     }
//   };
// }
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Error Boundary to catch and recover from unhandled errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please refresh or try again later.</h1>;
    }
    return this.props.children;
  }
}

// Monkey patch to handle Google Translate DOM mutations (only on client side)
if (typeof window !== 'undefined' && typeof Node === 'function' && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function (child) {
    try {
      return originalRemoveChild.call(this, child);
    } catch (error) {
      if (error.name === 'NotFoundError' || error.message.includes('The node to be removed is not a child')) {
        console.warn('Google Translate interference detected in removeChild:', error);
        return child; // Ignore the error to prevent crash
      }
      throw error;
    }
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (newNode, referenceNode) {
    try {
      return originalInsertBefore.call(this, newNode, referenceNode);
    } catch (error) {
      if (error.name === 'NotFoundError' || error.message.includes('The node before which the new node is to be inserted is not a child')) {
        console.warn('Google Translate interference detected in insertBefore:', error);
        // Fallback to append if insert fails
        return this.appendChild(newNode);
      }
      throw error;
    }
  };
}

const root = ReactDOM.createRoot(document.getElementById('root'));
// Temporarily disable StrictMode for testing, re-enable later
root.render(
  // <React.StrictMode>
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();