import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';

export const QR = ({updateID}) => {
  

  return (
    <>
      <QrReader
        onResult={(result, error) => result && updateID(result?.text, result.getTimestamp())}
        style={{ width: '100%' }}
      />
    </>
  );
};