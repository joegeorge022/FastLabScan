if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    }).then(
      (registration) => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      },
      (err) => {
        console.log('ServiceWorker registration failed: ', err);
      }
    );
    
    window.addEventListener('online', () => {
      document.body.classList.remove('offline');
    });
    
    window.addEventListener('offline', () => {
      document.body.classList.add('offline');
    });
    
    if (!navigator.onLine) {
      document.body.classList.add('offline');
    }
  });
}