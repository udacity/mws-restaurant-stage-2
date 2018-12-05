// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js', {scope: '/'})
        .then(function(reg){
            console.log('Hurray!!!.. Service worker registration succeeded.');
        }).catch(function(error){
            console.log('Ouch!! Registration failed with ' + error);
        });
    });
}