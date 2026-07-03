const plantsData = [
    {
        id: 1,
        name: 'Роза',
        scientific: 'Rosa spp.',
        category: 'flowers',
        description: 'Популярное садовое растение с ароматными цветами.',
        image: 'img/rose.png', 
        tags: ['☀️ Свет', '💧 Умеренный', '🌱 Средний уход']
    },
    {
        id: 2,
        name: 'Кактус',
        scientific: 'Cactaceae',
        category: 'succulents',
        description: 'Неприхотливое растение, идеально для начинающих.',
        image: 'img/cactaceae.png',
        tags: ['☀️ Яркий свет', '💧 Редкий', '🌱 Легкий уход']
    },
    {
        id: 3,
        name: 'Орхидея',
        scientific: 'Orchidaceae',
        category: 'flowers',
        description: 'Изысканное растение с экзотическими цветами.',
        image: 'img/orchidaceae.png',
        tags: ['☀️ Рассеянный', '💧 Умеренный', '🌱 Высокий уход']
    },
    {
        id: 4,
        name: 'Базилик',
        scientific: 'Ocimum basilicum',
        category: 'herbs',
        description: 'Ароматная пряная трава для кулинарии.',
        image: 'img/basilicum.png',
        tags: ['☀️ Яркий свет', '💧 Умеренный', '🌱 Простой уход']
    },
    {
        id: 5,
        name: 'Пальма',
        scientific: 'Arecaceae',
        category: 'palms',
        description: 'Эффектное комнатное дерево с пышной кроной.',
        image: 'img/palm.png',
        tags: ['☀️ Рассеянный', '💧 Обильный', '🌱 Средний уход']
    },
    {
        id: 6,
        name: 'Алоэ вера',
        scientific: 'Aloe vera',
        category: 'succulents',
        description: 'Лечебное растение с полезными свойствами.',
        image: 'img/aloevera.png',
        tags: ['☀️ Яркий свет', '💧 Редкий', '🌱 Легкий уход']
    },
    {
        id: 7,
        name: 'Монстера',
        scientific: 'Monstera deliciosa',
        category: 'trees',
        description: 'Тропическое растение с резными листьями.',
        image: 'img/monstera.png',
        tags: ['☀️ Рассеянный', '💧 Умеренный', '🌱 Средний уход']
    },
    {
        id: 8,
        name: 'Лаванда',
        scientific: 'Lavandula',
        category: 'herbs',
        description: 'Ароматное растение с успокаивающим запахом.',
        image: 'img/lavande.png',
        tags: ['☀️ Яркий свет', '💧 Редкий', '🌱 Простой уход']
    }
];

const plantsGrid = document.getElementById('plantsGrid');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const noResults = document.getElementById('noResults');

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
    let myPlants = JSON.parse(localStorage.getItem('myPlants')) || [];
    const index = myPlants.indexOf(plantId);
    const plant = plantsData.find(p => p.id === plantId);
    const isAdded = index === -1;
    
    if (isAdded) {
        myPlants.push(plantId);
    } else {
        myPlants.splice(index, 1);
    }
    
    localStorage.setItem('myPlants', JSON.stringify(myPlants));
    updateButtonState(button, isAdded);
    
}

function updateButtonState(button, isAdded) {
    const icon = button.querySelector('i');
    icon.className = isAdded ? 'fa-solid fa-check' : 'fa-solid fa-plus';
    button.classList.toggle('added', isAdded);
}

function checkIfInList(plantId, button) {
    const myPlants = JSON.parse(localStorage.getItem('myPlants')) || [];
    updateButtonState(button, myPlants.includes(plantId));
}

function showPlantDetails(plantId) {
    const plant = plantsData.find(p => p.id === plantId);
    if (!plant) return;

    alert(
        `📚 Информация о растении: ${plant.name}\n\n` +
        `🌿 Латинское название: ${plant.scientific}\n` +
        `📋 Категория: ${plant.category}\n` +
        `📝 Описание: ${plant.description}\n\n` +
        `💡 Условия ухода:\n` +
        plant.tags.map(tag => `  • ${tag}`).join('\n') +
        `\n\n✨ Здесь будет полная информация о растении, график полива, рекомендации по пересадке и многое другое!`
    );
}

function renderPlants(plants) {
    plantsGrid.innerHTML = '';
    
    if (plants.length === 0) {
        noResults.style.display = 'flex';
        return;
    }
    
    noResults.style.display = 'none';
    
    plants.forEach(plant => {
        const card = createPlantCard(plant);
        plantsGrid.appendChild(card);
    });
}

function filterPlants() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const activeCategory = document.querySelector('.filter-btn.active')?.dataset.category || 'all';

    const filtered = plantsData.filter(plant => {
        const matchesSearch = plant.name.toLowerCase().includes(searchTerm) || 
                            plant.scientific.toLowerCase().includes(searchTerm) || 
                            plant.description.toLowerCase().includes(searchTerm);
        const matchesCategory = activeCategory === 'all' || plant.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    renderPlants(filtered);
}

renderPlants(plantsData);

searchInput.addEventListener('input', filterPlants);

filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        filterPlants();
    });
});

plantsGrid.addEventListener('click', function(e) {
    const card = e.target.closest('.plant-card');
    if (card && !e.target.closest('.btn-details') && !e.target.closest('.btn-add-to-list')) {
        const id = parseInt(card.dataset.id);
        showPlantDetails(id);
    }
});