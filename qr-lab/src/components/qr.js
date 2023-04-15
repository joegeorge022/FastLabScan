import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';

export const QR = ({updateID}) => {
  

  return (
    <>
      <QrReader
        onResult={(result, error) => {
          if (result) {
            alert(result?.text);
            updateID(result?.text);
            alert("done")
          }
        }}
        style={{ width: '100%' }}
      />
    </>
  );
};