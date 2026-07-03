function getDaysUntilNext(lastDate, intervalDays) {
    if (!lastDate || !intervalDays || intervalDays >= 9999) return null;
    
    const last = new Date(lastDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    last.setHours(0, 0, 0, 0);
    
    const diffTime = last.getTime() + intervalDays * 24 * 60 * 60 * 1000 - today.getTime();
    const diffDays = Math.ceil(diffTime / (24 * 60 * 60 * 1000));
    
    return diffDays;
}

function getStatusClass(days) {
    if (days === null) return 'status-unknown';
    if (days <= 0) return 'status-critical';
    if (days <= 3) return 'status-urgent';
    if (days <= 10) return 'status-warning';
    return 'status-ok';
}

function getStatusText(days) {
    if (days === null) return 'Не указано/не требуется(см. в карточке)';
    if (days === 0) return 'Сегодня';
    if (days === 1) return 'Завтра';
    if (days <= 3) return `${days} дня`;
    if (days <= 10) return `${days} дней`;
    return `${days} дней`;
}

function loadTasks() {
    const container = document.getElementById('tasks-grid');
    const emptyState = document.getElementById('empty-state-tasks');
    const myPlantsData = JSON.parse(localStorage.getItem('myPlantsData')) || {};
    const myPlantsIds = Object.keys(myPlantsData).map(Number);
    
    
    if (myPlantsIds.length === 0) {
        if (emptyState) emptyState.classList.remove('hidden');
        if (container) container.innerHTML = '';
        return;
    }
    
    if (emptyState) emptyState.classList.add('hidden');
    
    const myPlants = plantsData.filter(p => myPlantsIds.includes(p.id));
    
    const sortedPlants = myPlants.sort((a, b) => {
        const aData = myPlantsData[a.id];
        const bData = myPlantsData[b.id];
        const aDays = getDaysUntilNext(aData.lastWatering, a.wateringInterval);
        const bDays = getDaysUntilNext(bData.lastWatering, b.wateringInterval);
        
        if (aDays === null) return 1;
        if (bDays === null) return -1;
        return aDays - bDays;
    });
    
    if (container) {
        container.innerHTML = '';
        sortedPlants.forEach(plant => {
            const plantData = myPlantsData[plant.id];
            
            const daysUntilWatering = getDaysUntilNext(plantData.lastWatering, plant.wateringInterval);
            const daysUntilTransplant = getDaysUntilNext(plantData.lastTransplant, plant.transplantInterval);
            
            const wateringClass = getStatusClass(daysUntilWatering);
            const transplantClass = getStatusClass(daysUntilTransplant);
            
            const wateringText = getStatusText(daysUntilWatering);
            const transplantText = getStatusText(daysUntilTransplant);
            
            const card = document.createElement('div');
            card.className = 'task-card';
            card.innerHTML = `
                <div class="task-header">
                    <h3 class="task-name">${plant.name}</h3>
                    <span class="task-date">Добавлено: ${plantData.addedDate}</span>
                </div>
                <div class="task-reminders">
                    <div class="task-reminder ${wateringClass}">
                        <span class="reminder-icon">💧</span>
                        <span>Полив: ${wateringText}</span>
                        <button class="task-done-btn" data-id="${plant.id}" data-type="watering">☑</button>
                    </div>
                    <div class="task-reminder ${transplantClass}">
                        <span class="reminder-icon">🔄</span>
                        <span>Пересадка: ${transplantText}</span>
                        <button class="task-done-btn" data-id="${plant.id}" data-type="transplant">☑</button>
                    </div>
                </div>
                <button class="task-note-btn" data-id="${plant.id}">📝 Заметка</button>
                <button class="task-details-btn" data-id="${plant.id}">Подробнее →</button>
            `;
            
            const detailsBtn = card.querySelector('.task-details-btn');
            detailsBtn.addEventListener('click', function() {
                showPlantDetails(plant.id);
            });

            card.querySelector('.task-note-btn')?.addEventListener('click', function(e) {
                e.stopPropagation();
                const id = parseInt(this.dataset.id);
                openNoteEditor(id);
            });
            
            card.querySelectorAll('.task-done-btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const id = parseInt(this.dataset.id);
                    const type = this.dataset.type;
                    markTaskDone(id, type);
                });
            });
            
            container.appendChild(card);
        });
    }
}

function markTaskDone(plantId, taskType) {
    console.log('markTaskDone called', plantId, taskType);
    const myPlantsData = JSON.parse(localStorage.getItem('myPlantsData')) || {};
    const today = new Date().toISOString().split('T')[0];
    
    if (myPlantsData[plantId]) {
        if (taskType === 'watering') {
            myPlantsData[plantId].lastWatering = today;
        } else if (taskType === 'transplant') {
            myPlantsData[plantId].lastTransplant = today;
        }
        localStorage.setItem('myPlantsData', JSON.stringify(myPlantsData));
        console.log('Updated data:', myPlantsData[plantId]);
        loadTasks(); 
    } else {
        console.log('Plant not found in myPlantsData');
    }
}

function openNoteEditor(plantId) {
    const plant = plantsData.find(p => p.id === plantId);
    const myPlantsData = JSON.parse(localStorage.getItem('myPlantsData')) || {};
    const currentNote = myPlantsData[plantId]?.note || '';
    
    const overlay = document.createElement('div');
    overlay.className = 'note-overlay';
    overlay.id = 'note-editor';
    
    overlay.innerHTML = `
        <div class="note-modal">
            <div class="note-modal-header">
                <h3>📝 Заметка для ${plant.name}</h3>
                <button class="note-close-btn" id="note-close-btn">&times;</button>
            </div>
            <textarea id="note-textarea" rows="6" placeholder="Введите вашу заметку о растении...">${currentNote}</textarea>
            <div class="note-modal-actions">
                <button class="note-save-btn" id="note-save-btn">💾 Сохранить</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    overlay.style.display = 'flex';
    
    const textarea = overlay.querySelector('#note-textarea');
    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    
    overlay.querySelector('#note-close-btn').addEventListener('click', function() {
        overlay.remove();
    });
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) overlay.remove();
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const el = document.getElementById('note-editor');
            if (el) el.remove();
        }
    });
    
    overlay.querySelector('#note-save-btn').addEventListener('click', function() {
        const note = textarea.value.trim();
        const data = JSON.parse(localStorage.getItem('myPlantsData')) || {};
        if (data[plantId]) {
            data[plantId].note = note;
            localStorage.setItem('myPlantsData', JSON.stringify(data));
            overlay.remove();
            loadTasks();
        }
    });
    
    textarea.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            overlay.querySelector('#note-save-btn').click();
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadTasks);
} else {
    loadTasks();
}