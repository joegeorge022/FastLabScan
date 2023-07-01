import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';

export const QR = ({updateID}) => {
  

  return (
    <>
      <QrReader videoId='cam' className='video'
        onResult={(result, error) => {
            result && updateID(e => [
              {regNo:result?.text, time:result.getTimestamp()},
               ...e])
          }
        }
      />
    </>
  );
};

// , result.getTimestamp()