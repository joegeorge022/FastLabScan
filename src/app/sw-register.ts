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
    });
    
    window.addEventListener('offline', () => {
      document.body.classList.add('offline');
      console.log('App is offline');
    });
    
    if (!navigator.onLine) {
      document.body.classList.add('offline');
    }
  });
}