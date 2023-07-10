'use client'

import {Html5QrcodeScanner} from "html5-qrcode";
import { useEffect } from 'react';

const qrcodeRegionId = "qrreaderdiv";

const Html5QrcodePlugin = ({onScanSuccess}:setQR) => {

    useEffect(() => {
          
        function onScanFailure(error:string) {}

        const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, { 
            fps: 5, 
            // qrbox: {width: 350, height: 350}
        }, false)

        html5QrcodeScanner.render(onScanSuccess, onScanFailure )
        
        return () => {
            html5QrcodeScanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner. ", error)
            });
        };
    }, []);

    return (
        <div id={qrcodeRegionId} />
    );
};

export default Html5QrcodePlugin;
