import React, { useState } from 'react';
import { QrReader } from '@/components/QrReader/index';

export const QR = ({action}) => {
  

  return (
    <>
      <QrReader videoId='cam' className='video'
        onResult={(result, error) => {
            result && action(e => [
              {regNo:result?.text, time:result.getTimestamp()},
               ...e])
          }
        }
      />
    </>
  );
};

// , result.getTimestamp()