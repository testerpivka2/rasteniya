const plantsGrid = document.getElementById('plants-grid');
const searchInput = document.getElementById('search-input');
const filterBtns = document.querySelectorAll('.filter-btn');
const no_results = document.getElementById('no-results');



function createPlantCard(plant) {
    const card = document.createElement('div');
    card.className = 'plant-card';
    card.dataset.category = plant.category;
    card.dataset.id = plant.id;

    const tagsHtml = plant.tags.map(tag => {
        let tagClass = 'tag';
        if (tag.includes('☀️')) tagClass += ' tag-light';
        else if (tag.includes('💧')) tagClass += ' tag-water';
        else if (tag.includes('🌱')) tagClass += ' tag-care';
        return `<span class="${tagClass}">${tag}</span>`;
    }).join('');

    card.innerHTML = `
        <div class="plant-image">
            <img src="${plant.image}" alt="${plant.name}">
            <button class="btn-add-to-list" data-id="${plant.id}">
                <i class="fa-solid fa-plus"></i>
            </button>
        </div>
        <div class="plant-info">
            <h3 class="plant-name">${plant.name}</h3>
            <p class="plant-scientific">${plant.scientific}</p>
            <div class="plant-tags">${tagsHtml}</div>
            <div class="plant-description">${plant.description}</div>
            <button class="btn-details" data-id="${plant.id}">Подробнее →</button>
        </div>
    `;

    const detailsBtn = card.querySelector('.btn-details');
    detailsBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showPlantDetails(plant.id);
    });

   const addBtn = card.querySelector('.btn-add-to-list');
    addBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        togglePlantInList(plant.id, this);
    });

    checkIfInList(plant.id, addBtn);

    return card;
}

function togglePlantInList(plantId, button) {
    let myPlantsData = JSON.parse(localStorage.getItem('myPlantsData')) || {};
    const plant = plantsData.find(p => p.id === plantId);
    const isAdded = !!myPlantsData[plantId];
    const today = new Date().toISOString().split('T')[0];
    
    if (isAdded) {
        delete myPlantsData[plantId];
    } else {
        myPlantsData[plantId] = {
            addedDate: today,
            note: '',
            lastWatering: today,
            lastTransplant: today
        };
    }
    
    localStorage.setItem('myPlantsData', JSON.stringify(myPlantsData));
    updateButtonState(button, !isAdded);
    
    const modalAddBtn = document.querySelector('.modal-add-btn');
    if (modalAddBtn) {
        if (!isAdded) {
            modalAddBtn.classList.add('added');
            modalAddBtn.innerHTML = '<i class="fa-solid fa-check"></i> В моих растениях';
        } else {
            modalAddBtn.classList.remove('added');
            modalAddBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Добавить в мои растения';
        }
    }
}

function updateButtonState(button, isAdded) {
    const icon = button.querySelector('i');
    icon.className = isAdded ? 'fa-solid fa-check' : 'fa-solid fa-plus';
    button.classList.toggle('added', isAdded);
}

function checkIfInList(plantId, button) {
    const myPlantsData = JSON.parse(localStorage.getItem('myPlantsData')) || {};
    const isAdded = !!myPlantsData[plantId];
    updateButtonState(button, isAdded);
}

let modalLoaded = false;

function loadModal() {

    if (modalLoaded) return;
    if (document.getElementById('plant-modal')) return;

    fetch('plants_description.html')
        .then(response => response.text())
        .then(html => {
            const div = document.createElement('div');
            div.innerHTML = html;
            document.body.appendChild(div.firstElementChild);
            modalLoaded = true;
        })
}

function closeModal() {
    const modal = document.getElementById('plant-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('click', function(e) {
    const is_close_btn = e.target.closest('#modal-close');
    const is_overlay = e.target === document.getElementById('plant-modal');

    if (is_close_btn || is_overlay) {
        closeModal();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
});

function showPlantDetails(plantId) {
    const plant = plantsData.find(p => p.id === plantId);
    if (!plant) return;

    const modal = document.getElementById('plant-modal');
    const content = document.getElementById('modal-content');

    if (!modal || !content) {
        loadModal();
        setTimeout(() => showPlantDetails(plantId), 100);
        return;
    }

    const tagsHtml = plant.tags.map(tag => {
        let tagClass = 'tag';
        if (tag.includes('☀️')) tagClass += ' tag-light';
        else if (tag.includes('💧')) tagClass += ' tag-water';
        else if (tag.includes('🌱')) tagClass += ' tag-care';
        return `<span class="${tagClass}">${tag}</span>`;
    }).join('');

    const poisonousHtml = plant.poisonous.includes('Ядовито') 
        ? `<span class="poisonous-badge">⚠️ Ядовито!</span>` 
        : `<span class="safe-badge">✅ Не ядовито</span>`;

    content.innerHTML = `
        <div class="modal-plant-image">
            <img src="${plant.image}" alt="${plant.name}">
        </div>
        <div class="modal-body">
            <div class="modal-header">
                <h2 class="modal-plant-name">${plant.name}</h2>
                ${poisonousHtml}
            </div>
            <p class="modal-plant-scientific">${plant.scientific}</p>
            <div class="modal-plant-tags">${tagsHtml}</div>
            <p class="modal-plant-description">${plant.description}</p>
            
            <div class="modal-plant-details">
                <div class="detail-item">
                    <span class="detail-icon">💧</span>
                    <div>
                        <strong>Полив</strong>
                        <p>${plant.watering}</p>
                    </div>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">☀️</span>
                    <div>
                        <strong>Освещение</strong>
                        <p>${plant.lighting}</p>
                    </div>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">🔄</span>
                    <div>
                        <strong>Пересадка</strong>
                        <p>${plant.transplant}</p>
                    </div>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">⚠️</span>
                    <div>
                        <strong>Ядовитость</strong>
                        <p>${plant.poisonous}</p>
                    </div>
                </div>
                ${plant.features ? `
                <div class="detail-item">
                    <span class="detail-icon">✨</span>
                    <div>
                        <strong>Особенности ухода</strong>
                        <p>${plant.features}</p>
                    </div>
                </div>
                ` : ''}
            </div>

            <button class="modal-add-btn" data-id="${plant.id}">
                <i class="fa-solid fa-plus"></i> Добавить в мои растения
            </button>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    const addBtn = content.querySelector('.modal-add-btn');
    if (addBtn) {
        const myPlantsData = JSON.parse(localStorage.getItem('myPlantsData')) || {};
        if (myPlantsData[plant.id]) {
            addBtn.classList.add('added');
            addBtn.innerHTML = '<i class="fa-solid fa-check"></i> В моих растениях';
        }

        addBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            togglePlantInList(plant.id, this);
        });
    }
}

function filterPlants() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activeCategory = document.querySelector('.filter-btn.active')?.dataset.category || 'all';

    const filtered = plantsData.filter(plant => {
        const matchesSearch = !searchTerm ||
            plant.name.toLowerCase().includes(searchTerm) ||
            plant.scientific.toLowerCase().includes(searchTerm) ||
            plant.description.toLowerCase().includes(searchTerm);
        const matchesCategory = activeCategory === 'all' || plant.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    renderPlants(filtered);
}

function renderPlants(plants) {
    if(!plantsGrid) return;

    plantsGrid.innerHTML = '';
    
    if (plants.length === 0) {
        no_results.style.display = 'flex';
        return;
    }
    
    if(no_results) {
        no_results.style.display = 'none';
    }
    
    plants.forEach(plant => {
        const card = createPlantCard(plant);
        plantsGrid.appendChild(card);
    });
}

if (plantsGrid) {
    renderPlants(plantsData);
}

if (searchInput) {
    searchInput.addEventListener('input', filterPlants);
}

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterPlants();
        });
    });
}

if (plantsGrid) {
    plantsGrid.addEventListener('click', function(e) {
        const card = e.target.closest('.plant-card');
        if (card && !e.target.closest('.btn-details') && !e.target.closest('.btn-add-to-list')) {
            const id = parseInt(card.dataset.id);
            showPlantDetails(id);
        }
    });
}

if (plantsGrid) {
    renderPlants(plantsData);
}