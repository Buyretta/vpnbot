// Dashboard & Charts Module
import { refreshContainerById } from './core.js';

export function initializeDashboardCharts() {
    const usersChartCanvas = document.getElementById('newUsersChart');
    if (!usersChartCanvas || typeof CHART_DATA === 'undefined') {
        return;
    }

    const keysChartCanvas = document.getElementById('newKeysChart');
    const ctxUsers = usersChartCanvas.getContext('2d');
    const ctxKeys = keysChartCanvas ? keysChartCanvas.getContext('2d') : null;

    // Prepare data
    const labels = CHART_DATA.dates || [];
    const usersData = CHART_DATA.users || [];
    const keysData = CHART_DATA.keys || [];

    // Common chart options
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    // Create users chart
    if (window.Chart) {
        new Chart(ctxUsers, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Новые пользователи',
                    data: usersData,
                    borderColor: '#206bc4',
                    backgroundColor: 'rgba(32, 107, 196, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3,
                    pointRadius: 3,
                    pointHoverRadius: 5
                }]
            },
            options: commonOptions
        });

        // Create keys chart if canvas exists
        if (ctxKeys) {
            new Chart(ctxKeys, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Новые ключи',
                        data: keysData,
                        borderColor: '#2fb344',
                        backgroundColor: 'rgba(47, 179, 68, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.3,
                        pointRadius: 3,
                        pointHoverRadius: 5
                    }]
                },
                options: commonOptions
            });
        }
    }

    // Auto-refresh charts every 10 seconds
    setInterval(refreshCharts, 10000);
}

function refreshCharts() {
    const statsContainer = document.getElementById('dash-stats');
    if (statsContainer) {
        refreshContainerById('dash-stats');
    }
}
