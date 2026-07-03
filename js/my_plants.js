

function loadMyPlants() {
    const container = document.getElementById('myPlantsGrid');
    const emptyState = document.getElementById('empty-state');
    const myPlantsIds = JSON.parse(localStorage.getItem('myPlants')) || [];
    
    if (myPlantsIds.length === 0) {
        if (emptyState) emptyState.classList.remove('hidden');
        if (container) container.innerHTML = '';
        return;
    }
    
    if (emptyState) emptyState.classList.add('hidden');
    
    const myPlants = plantsData.filter(p => myPlantsIds.includes(p.id));
    
    if (container) {
        container.innerHTML = '';
        myPlants.forEach(plant => {
            const card = createPlantCard(plant);
            container.appendChild(card);
        });
    }
}

loadMyPlants();

document.addEventListener('DOMContentLoaded', loadMyPlants);