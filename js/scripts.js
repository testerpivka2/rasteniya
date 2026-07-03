document.addEventListener('DOMContentLoaded', function() {
    const script1 = document.createElement('script');
    script1.src = 'js/plants_data.js';
    document.head.appendChild(script1);

    script1.onload = function() {
        const script2 = document.createElement('script');
        script2.src = 'js/library.js';
        document.head.appendChild(script2);

        script2.onload = function() {
            const script3 = document.createElement('script');
            script3.src = 'js/my_plants.js';
            document.head.appendChild(script3);
            
            script3.onload = function() {
                const script4 = document.createElement('script');
                script4.src = 'js/tasks.js';
                document.head.appendChild(script4);
            }
        };
    };
});