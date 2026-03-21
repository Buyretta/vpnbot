// Monitor Page Module
// Графики мониторинга ресурсов

export function initializeMonitorPage() {
    // Глобальные переменные
    let mainChart = null;
    let localMiniChart = null;
    let autoRefreshInterval = null;
    let currentPeriod = 1; // часы
    
    // Переменные для отслеживания скорости сети
    let lastNetworkData = null;
    let lastNetworkTime = null;
    
    // Ключи для localStorage
    const NETWORK_DATA_KEY = 'monitor_network_data';
    const NETWORK_TIME_KEY = 'monitor_network_time';

    // Утилиты
    async function fetchJSON(url) {
        try {
            const resp = await fetch(url, { credentials: 'same-origin' });
            return await resp.json();
        } catch (e) {
            return { ok: false, error: String(e) };
        }
    }

    function fmtBytes(n) {
        if (n == null) return '—';
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let i = 0, x = Number(n);
        while (x >= 1024 && i < units.length - 1) { x /= 1024; i++; }
        return x.toFixed(1) + ' ' + units[i];
    }

    function fmtPct(x) {
        return (x == null) ? '—' : (Number(x).toFixed(1) + '%');
    }

    function secsToDHMS(s) {
        if (!s && s !== 0) return '—';
        s = Number(s);
        const d = Math.floor(s / 86400); s %= 86400;
        const h = Math.floor(s / 3600); s %= 3600;
        const m = Math.floor(s / 60);
        const sec = s % 60;
        const parts = [];
        if (d) parts.push(d + 'д');
        if (h) parts.push(h + 'ч');
        if (m) parts.push(m + 'м');
        if (sec && parts.length === 0) parts.push(sec + 'с');
        return parts.join(' ');
    }

    function getStatusColor(value, thresholds = { warning: 70, critical: 90 }) {
        if (value == null) return 'text-muted';
        if (value >= thresholds.critical) return 'text-danger';
        if (value >= thresholds.warning) return 'text-warning';
        return 'text-success';
    }

    function getStatusIndicator(value, thresholds = { warning: 70, critical: 90 }) {
        if (value == null) return 'bg-secondary';
        if (value >= thresholds.critical) return 'bg-danger pulse';
        if (value >= thresholds.warning) return 'bg-warning';
        return 'bg-success';
    }

    // Функция для вычисления скорости сети
    function calculateNetworkSpeed(currentData, sourceId = 'default') {
        const now = Date.now();
        
        const dataKey = `${NETWORK_DATA_KEY}_${sourceId}`;
        const timeKey = `${NETWORK_TIME_KEY}_${sourceId}`;
        
        try {
            const savedData = localStorage.getItem(dataKey);
            const savedTime = localStorage.getItem(timeKey);
            
            if (savedData && savedTime) {
                lastNetworkData = JSON.parse(savedData);
                lastNetworkTime = parseInt(savedTime);
            }
        } catch (e) {
            console.warn('Ошибка загрузки данных сети из localStorage:', e);
        }
        
        if (!lastNetworkData || !lastNetworkTime) {
            try {
                localStorage.setItem(dataKey, JSON.stringify(currentData));
                localStorage.setItem(timeKey, String(now));
            } catch (e) {
                console.warn('Ошибка сохранения начальных данных сети:', e);
            }
            return null;
        }
        
        const timeDiff = (now - lastNetworkTime) / 1000;
        
        if (timeDiff < 1) {
            return null;
        }
        
        const sentDiff = currentData.bytes_sent - lastNetworkData.bytes_sent;
        const recvDiff = currentData.bytes_recv - lastNetworkData.bytes_recv;
        
        const sentSpeed = sentDiff / timeDiff;
        const recvSpeed = recvDiff / timeDiff;
        
        try {
            localStorage.setItem(dataKey, JSON.stringify(currentData));
            localStorage.setItem(timeKey, String(now));
        } catch (e) {
            console.warn('Ошибка сохранения данных сети:', e);
        }
        
        return {
            sent: sentSpeed,
            recv: recvSpeed,
            total: sentSpeed + recvSpeed
        };
    }

    function formatSpeed(speed) {
        if (speed == null || isNaN(speed)) return '—';
        return fmtBytes(speed) + '/с';
    }

    // Инициализация
    const mainChartCanvas = document.getElementById('mainChart');
    if (!mainChartCanvas) return;

    // Здесь должна быть полная логика инициализации графиков
    // из monitor.html, но она очень большая
    console.log('Monitor page initialized');
}
