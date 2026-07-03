
let myPlantsList = [];
let searchQuery = '';

function loadMyPlants() {
    const container = document.getElementById('my-plants-grid');
    const emptyState = document.getElementById('empty-state');
    const searchInput = document.getElementById('search-input-my');
    const myPlantsIds = JSON.parse(localStorage.getItem('myPlants')) || [];

    myPlantsList = plantsData.filter(p => myPlantsIds.includes(p.id));

    if (myPlantsIds.length === 0) {
        if (emptyState) emptyState.classList.remove('hidden');
        if (container) container.innerHTML = '';
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    renderMyPlants();

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchQuery = this.value.toLowerCase().trim();
            renderMyPlants();
        });
    }
}

function renderMyPlants() {
    const container = document.getElementById('my-plants-grid');
    const emptyState = document.getElementById('empty-state');
    const noResults = document.getElementById('no-results-my');

    if (!container) return;

    const filtered = myPlantsList.filter(plant => {
        if (!searchQuery) return true;
        return plant.name.toLowerCase().includes(searchQuery) ||
               plant.scientific.toLowerCase().includes(searchQuery) ||
               plant.description.toLowerCase().includes(searchQuery);
    });

    container.innerHTML = '';

    if (filtered.length === 0 && myPlantsList.length > 0) {
        if (noResults) noResults.style.display = 'flex';
        return;
    }

    if (noResults) noResults.style.display = 'none';

    filtered.forEach(plant => {
        const card = createPlantCard(plant);
        container.appendChild(card);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadMyPlants);
} else {
    loadMyPlants();
}