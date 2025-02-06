'use client';

import { useState } from 'react';

const TEST_NUMBERS = [
  '21/AD/051',
  '21/AD/052',
  '21/AD/053',
  '21/CSE/001',
  '21/CSE/002',
];

export default function Test() {
  const [regNo, setRegNo] = useState(TEST_NUMBERS[0]);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${regNo}`;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Test QR Generator</h1>
      
      <input 
        type="text"
        value={regNo}
        onChange={(e) => setRegNo(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        placeholder="Enter registration number"
      />

      <div className="border p-4 rounded">
        <img src={qrUrl} alt="QR Code" className="mx-auto" />
      </div>

      <div className="mt-4 space-y-2">
        <h2 className="font-bold">Test Registration Numbers:</h2>
        {TEST_NUMBERS.map(num => (
          <button
            key={num}
            onClick={() => setRegNo(num)}
            className="block w-full p-2 text-left hover:bg-gray-100 rounded"
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
} 