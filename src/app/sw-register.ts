if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    }).then(
      (registration) => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New service worker installed');
                newWorker.postMessage({ type: 'SKIP_WAITING' });
              }
            });
          }
        });
      },
      (err) => {
        console.log('ServiceWorker registration failed: ', err);
      }
    );
    
    window.addEventListener('online', () => {
      document.body.classList.remove('offline');
      console.log('App is online');
      window.location.reload();
    });
    
    window.addEventListener('offline', () => {
      document.body.classList.add('offline');
      console.log('App is offline');
      const offlineToast = document.createElement('div');
      offlineToast.className = 'offline-toast';
      offlineToast.textContent = 'You are offline. The app will continue to work with limited functionality.';
      document.body.appendChild(offlineToast);
      
      setTimeout(() => {
        offlineToast.style.opacity = '0';
        setTimeout(() => {
          document.body.removeChild(offlineToast);
        }, 500);
      }, 3000);
    });
    
    if (!navigator.onLine) {
      document.body.classList.add('offline');
    }
    
    if (!navigator.onLine && navigator.serviceWorker.controller) {
      console.log('Page loaded while offline, using cached version');
    }
  });
}