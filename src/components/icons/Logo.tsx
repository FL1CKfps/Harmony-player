import React from 'react';

const Logo: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      className="stroke-purple-500"
      strokeWidth="2"
    />
    <path
      d="M8.5 12.5V8.5C8.5 7.67157 9.17157 7 10 7H14C14.8284 7 15.5 7.67157 15.5 8.5V15.5C15.5 16.3284 14.8284 17 14 17H10C9.17157 17 8.5 16.3284 8.5 15.5V12.5Z"
      className="fill-purple-500"
    />
    <path
      d="M15.5 10.5L8.5 14.5M15.5 14.5L8.5 10.5"
      className="stroke-white"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default Logo; 