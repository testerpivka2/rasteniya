document.addEventListener('DOMContentLoaded', function() {
    
    const script1 = document.createElement('script');
    script1.src = 'js/plants_data.js';
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'js/library.js';
    document.head.appendChild(script2);

    const script3 = document.createElement('script');
    script3.src = 'js/my_plants.js';
    document.head.appendChild(script3);
});