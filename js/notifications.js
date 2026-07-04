document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.section-notifications') || 
                      document.querySelector('.notifications-list') || 
                      document.getElementById('notifications-container');
    
    const notifications = JSON.parse(localStorage.getItem('myNotifications')) || [];

    if (!container) return;

    if (notifications.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; margin-top: 40px; color: #64748b;">
                <p style="font-size: 16px; font-weight: 500;">У вас нет новых уведомлений 🎉</p>
                <p style="font-size: 13px;">Все ваши растения вовремя политы!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    const listBlock = document.createElement('div');
    listBlock.className = 'notifications-wrapper';
    listBlock.style.display = 'flex';
    listBlock.style.flexDirection = 'column';
    listBlock.style.gap = '12px';

    notifications.forEach(item => {
        const itemHtml = document.createElement('div');
        itemHtml.className = `notification-item notif-${item.type}`;
        
        itemHtml.innerHTML = `
            <div class="notif-icon">
                <i class="${item.type === 'danger' ? 'fa-solid fa-triangle-exclamation' : 'fa-solid fa-droplet'}"></i>
            </div>
            <div class="notif-content">
                <div class="notif-header">
                    <span class="notif-title">${item.title}</span>
                    <span class="notif-time">${item.date}</span>
                </div>
                <p class="notif-text">${item.text}</p>
            </div>
        `;
        listBlock.appendChild(itemHtml);
    });

    container.appendChild(listBlock);
});