/**
 * render.js
 * 
 * Módulo responsable de todas las funciones de renderizado.
 * Toma datos del estado y los convierte en HTML para ser insertado en el DOM.
 * Gestiona la creación y destrucción de todas las instancias de Chart.js.
 */

// --- IMPORTACIONES DE MÓDULOS ---
import { 
    db, PAGE_IDS, getVisibleAccounts, isOffBalanceMode, recentMovementsCache, 
    DEFAULT_DASHBOARD_WIDGETS, locales, currentLanguage, dataLoaded, currentUser,
    newMovementIdToHighlight, setNewMovementIdToHighlight
} from './state.js';
import { 
    select, selectOne, selectAll, formatCurrency, toSentenceCase, escapeHTML, 
    animateCountUp, t, populateAllDropdowns, parseDateStringAsUTC
} from './ui.js';
import { 
    getFilteredMovements, updateDashboardData, getYearProgress, 
    calculatePortfolioPerformance, processMovementsForRunningBalance 
} from './main.js';
import { fbDb, fetchMovementsInChunks } from './firebase.js';

// --- INSTANCIAS DE GRÁFICOS (Chart.js) ---
let conceptosChart = null;
let liquidAssetsChart = null;
let detailInvestmentChart = null;
let informesChart = null;
let assetAllocationChart = null;
let budgetTrendChart = null;

// --- ESTRUCTURA DE LA LISTA VIRTUAL ---
export const vList = {
    scrollerEl: null, 
    sizerEl: null, 
    contentEl: null, 
    items: [], 
    itemMap: [], 
    heights: {}, 
    renderBuffer: 10, 
    lastRenderedRange: { start: -1, end: -1 }, 
    isScrolling: null
};


// --- RENDERIZADORES DE PÁGINAS COMPLETAS Y VISTAS ---

/**
 * Renderiza el contenido completo de la página de Inicio.
 */
export function renderInicioPage() {
    const container = select(PAGE_IDS.INICIO);
    if (!container) return;

    if (conceptosChart) {
        conceptosChart.destroy();
        conceptosChart = null;
    }

    container.innerHTML = `
        <div id="inicio-view-switcher" class="filter-pills" style="justify-content: center;">
            <button class="filter-pill filter-pill--active" data-action="set-inicio-view" data-view="recientes">Recientes</button>
            <button class="filter-pill" data-action="set-inicio-view" data-view="resumen">Resumen</button>
        </div>

        <div id="pending-recurrents-container"></div>
        <div id="inicio-view-recientes"></div>

		<div id="inicio-view-resumen" class="hidden">
            <div class="card card--no-bg" id="dashboard-filters-widget">
                <div class="accordion-wrapper">
                    <details class="accordion">
                        <summary><h3 class="card__title" style="margin: 0; padding: 0; color: var(--c-on-surface);"><span class="material-icons">filter_list</span>Filtros</h3><span class="material-icons accordion__icon">expand_more</span></summary>
                        <div class="accordion__content" style="padding: var(--sp-3) var(--sp-4);">
                            <div class="form-group">
                                <label for="filter-periodo" class="form-label">Periodo</label>
                                <select id="filter-periodo" class="form-select">
                                    <option value="mes-actual" selected>Mes Actual</option>
                                    <option value="año-actual">Año Actual</option>
                                    <option value="custom">Personalizado</option>
                                </select>
                            </div>
                            
                            <div id="custom-date-filters" class="form-grid hidden" style="margin-bottom: var(--sp-3);">
                                <div class="form-group" style="margin-bottom: 0;">
                                    <label for="filter-fecha-inicio" class="form-label">Desde</label>
                                    <input type="date" id="filter-fecha-inicio" class="form-input" />
                                </div>
                                <div class="form-group" style="margin-bottom: 0;">
                                    <label for="filter-fecha-fin" class="form-label">Hasta</label>
                                    <input type="date" id="filter-fecha-fin" class="form-input" />
                                </div>
                            </div>

                            <div class="form-grid">
                                <div class="form-group"><label for="filter-cuenta" class="form-label">Cuenta</label><select id="filter-cuenta" class="form-select"></select></div>
                                <div class="form-group"><label for="filter-concepto" class="form-label">Concepto</label><select id="filter-concepto" class="form-select"></select></div>
                            </div>
                            <button data-action="apply-filters" class="btn btn--primary btn--full">Aplicar Filtros</button>
                        </div>
                    </details>
                </div>
            </div>
            <section id="kpi-container" class="kpi-grid" aria-label="Indicadores clave de rendimiento"></section>
            
            <div id="resumen-content-container"></div>
        </div>
    `;
    
    populateAllDropdowns();
    
    const filterPeriodo = select('filter-periodo');
    if (filterPeriodo) filterPeriodo.dispatchEvent(new Event('change')); 
    renderPendingRecurrents();
    renderInicioResumenView();
    renderInicioRecientesView();
}

/**
 * Renderiza el contenido completo de la página de Patrimonio.
 */
export async function renderPatrimonioPage() {
    const container = select(PAGE_IDS.PATRIMONIO);
    if (!container) return;

    const BASE_COLORS = ['#007AFF', '#30D158', '#FFD60A', '#FF3B30', '#C084FC', '#4ECDC4', '#EF626C', '#A8D58A'];
    const visibleAccounts = getVisibleAccounts();
    const saldos = getAllSaldos();
    
    const allAccountTypes = [...new Set(visibleAccounts.map((c) => toSentenceCase(c.tipo || 'S/T')))].sort();
    const deselectedAccountTypesFilter = new Set(JSON.parse(localStorage.getItem('deselectedAccountTypesFilter') || '[]'));
    const filteredAccountTypes = new Set(allAccountTypes.filter(t => !deselectedAccountTypesFilter.has(t)));

    const colorMap = {};
    allAccountTypes.forEach((tipo, index) => {
        colorMap[tipo] = BASE_COLORS[index % BASE_COLORS.length];
    });

    const filteredAccountsForChart = visibleAccounts.filter(c => {
        const tipo = toSentenceCase(c.tipo || 'S/T');
        return filteredAccountTypes.has(tipo);
    });

    const treeData = [];
    filteredAccountsForChart.forEach(c => {
        const saldo = saldos[c.id] || 0;
        if (saldo > 0) { // Treemap only works with positive values
            treeData.push({
                tipo: toSentenceCase(c.tipo || 'S/T'),
                nombre: c.nombre,
                saldo: saldo / 100
            });
        }
    });
    
    const pillsHTML = allAccountTypes.map(t => {
        const isActive = !deselectedAccountTypesFilter.has(t);
        const color = colorMap[t];
        let style = '';
        if (isActive && color) {
            style = `style="background-color: ${color}; border-color: ${color}; color: #FFFFFF; box-shadow: 0 0 8px ${color}70;"`;
        }
        return `<button class="filter-pill ${isActive ? 'filter-pill--active' : ''}" data-action="toggle-account-type-filter" data-type="${t}" ${style}>${t}</button>`;
    }).join('') || `<p style="font-size:var(--fs-xs); color:var(--c-on-surface-secondary)">No hay cuentas en esta vista.</p>`;
    
    const totalFiltrado = filteredAccountsForChart.reduce((sum, c) => sum + (saldos[c.id] || 0), 0);

    container.innerHTML = `
        <div class="patrimonio-header-grid">
            <div class="patrimonio-header-grid__kpi">
                <h4 class="kpi-item__label">Patrimonio Neto (Seleccionado)</h4>
                <strong id="patrimonio-total-balance" class="kpi-item__value" style="font-size: 2rem; line-height: 1.1;"></strong>
            </div>
            <div class="patrimonio-header-grid__filters">
                 <h4 class="kpi-item__label">Filtros por tipo de cuenta</h4>
                 <div id="filter-account-types-pills" class="filter-pills" style="margin-bottom: 0;">${pillsHTML}</div>
            </div>
        </div>
        <div class="card card--no-bg accordion-wrapper">
            <div id="liquid-assets-chart-container" class="hidden" style="margin-bottom: 0;">
                 <details class="accordion" open>
                    <summary>
                        <h3 class="card__title" style="margin: 0; padding: 0; color: var(--c-on-surface);"><span class="material-icons">data_usage</span>Estructura del Patrimonio</h3>
                        <span class="material-icons accordion__icon">expand_more</span>
                    </summary>
                    <div class="accordion__content" style="padding: var(--sp-3) var(--sp-4);">
                        <div class="chart-container" style="height: 250px; margin-bottom: 0;">
                            <canvas id="liquid-assets-chart"></canvas>
                        </div>
                    </div>
                </details>
            </div>
        </div>
        <div class="accordion-wrapper">
            <details class="accordion" open>
                <summary><h3 class="card__title" style="margin:0; padding: 0; color: var(--c-on-surface);"><span class="material-icons">account_balance_wallet</span>Cuentas</h3><span class="material-icons accordion__icon">expand_more</span></summary>
                <div class="accordion__content" style="padding: 0;" id="patrimonio-cuentas-container"></div>
            </details>
        </div>`;
    
    animateCountUp(select('patrimonio-total-balance'), totalFiltrado);
    renderCuentas('patrimonio-cuentas-container', filteredAccountsForChart, totalFiltrado);
    
    const chartContainer = select(`liquid-assets-chart-container`);
    const chartCanvas = select(`liquid-assets-chart`);
    const chartCtx = chartCanvas ? chartCanvas.getContext('2d') : null;

    if (chartCtx && chartContainer) {
        if (liquidAssetsChart) liquidAssetsChart.destroy();
        
        if (treeData.length > 0) {
            chartContainer.classList.remove('hidden');
            setTimeout(() => {
                liquidAssetsChart = new Chart(chartCtx, {
                    type: 'treemap',
                    data: {
                        datasets: [{
                            tree: treeData,
                            key: 'saldo',
                            groups: ['tipo', 'nombre'],
                            spacing: 0.5,
                            borderWidth: 1.5,
                            borderColor: getComputedStyle(document.body).getPropertyValue('--c-background'),
                            backgroundColor: (ctx) => {
                                if (ctx.type === 'data' && ctx.raw?._data) {
                                    const node = ctx.raw._data;
                                    const baseColor = colorMap[node.tipo];
                                    return baseColor ? `${baseColor}B3` : 'grey'; // Opacity added
                                }
                                return 'transparent';
                            },
                            labels: {
                                display: true,
                                color: '#FFFFFF',
                                font: { size: 10, weight: '600' },
                                align: 'center',
                                position: 'middle'
                            }
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                callbacks: {
                                    label: (context) => {
                                        const node = context.raw?._data;
                                        const value = formatCurrency(context.raw.v * 100);
                                        if (node && node.nombre) return `${node.nombre}: ${value}`;
                                        return `${context.raw.g}: ${value}`;
                                    }
                                }
                            },
                            datalabels: { display: false }
                        }
                    }
                });
            }, 50);
        } else {
            chartContainer.classList.add('hidden');
        }
    }
}

/**
 * Renderiza el contenido completo de la página de Análisis.
 */
export function renderAnalisisPage() {
    const container = select(PAGE_IDS.ANALISIS);
    if (!container) return;

    container.innerHTML = `
        <div class="card card--no-bg accordion-wrapper">
            <details class="accordion">
                <summary>
                    <h3 class="card__title" style="margin:0; padding: 0; color: var(--c-on-surface);"><span class="material-icons">request_quote</span>Presupuestos</h3>
                    <span class="material-icons accordion__icon">expand_more</span>
                </summary>
                <div class="accordion__content" style="padding: var(--sp-3) var(--sp-4);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--sp-4);">
                        <div class="form-group" style="flex-grow: 1; margin: 0;">
                            <label for="budget-year-selector" class="form-label" style="margin: 0;">Año del Presupuesto</label>
                            <select id="budget-year-selector" class="form-select"></select>
                        </div>
                        <button data-action="update-budgets" class="btn btn--secondary" style="margin-left: var(--sp-3);"><span class="material-icons" style="font-size: 16px;">edit_calendar</span><span>Gestionar</span></button>
                    </div>
                    <div id="annual-budget-dashboard"><div id="budget-kpi-container" class="kpi-grid"></div><div class="card" style="margin-top: var(--sp-4);"><h3 class="card__title"><span class="material-icons">trending_up</span>Tendencia Ingresos y Gastos</h3><div class="card__content"><div class="chart-container" style="height: 220px;"><canvas id="budget-trend-chart"></canvas></div></div></div><div id="budget-details-list" style="margin-top: var(--sp-4);"></div></div>
                    <div id="budget-init-placeholder" class="empty-state hidden"><span class="material-icons">edit_calendar</span><h3 id="budget-placeholder-title" data-i18n="budget_empty_title">Define tu Plan Financiero</h3><p id="budget-placeholder-text" data-i18n="budget_empty_text">Establece límites de gasto y metas de ingreso para tomar el control de tu año. ¡Empieza ahora!</p><button data-action="update-budgets" class="btn btn--primary" style="margin-top: var(--sp-4);"><span class="material-icons" style="font-size: 16px;">add_circle_outline</span><span data-i18n="budget_empty_cta">Crear Presupuestos</span></button></div>
                </div>
            </details>
        </div>
        <div class="card card--no-bg accordion-wrapper">
            <details class="accordion">
                <summary>
                    <h3 class="card__title" style="margin:0; padding: 0; color: var(--c-on-surface);"><span class="material-icons">show_chart</span>Portafolio</h3>
                    <span class="material-icons accordion__icon">expand_more</span>
                </summary>
                <div class="accordion__content" id="analisis-inversiones-container" style="padding: var(--sp-3) var(--sp-4);"></div>
            </details>
        </div>
        <div class="card card--no-bg accordion-wrapper">
            <details class="accordion">
                <summary>
                    <h3 class="card__title" style="margin:0; padding: 0; color: var(--c-on-surface);"><span class="material-icons">assessment</span>Informes</h3>
                    <span class="material-icons accordion__icon">expand_more</span>
                </summary>
                <div class="accordion__content" style="padding: var(--sp-3) var(--sp-4);">
                    <div class="form-grid" style="grid-template-columns: 1fr 1fr;"><div class="form-group"><label for="informe-fecha-inicio" class="form-label">Desde</label><input type="date" id="informe-fecha-inicio" class="form-input"></div><div class="form-group"><label for="informe-fecha-fin" class="form-label">Hasta</label><input type="date" id="informe-fecha-fin" class="form-input"></div><div class="form-group"><label for="filter-cuenta-informe" class="form-label">Cuenta</label><select id="filter-cuenta-informe" class="form-select"></select></div><div class="form-group"><label for="filter-concepto-informe" class="form-label">Concepto</label><select id="filter-concepto-informe" class="form-select"></select></div></div>
                    <button data-action="apply-informe-filters" class="btn btn--primary btn--full" style="margin-top: var(--sp-2);">Generar Informe</button>
                    <div id="informe-results-container" class="hidden" style="margin-top: var(--sp-4);"><div id="informe-kpi-container" class="kpi-grid"></div><div class="chart-container" style="margin-top: var(--sp-4);"><canvas id="informes-chart"></canvas></div></div>
                    <div id="empty-informes" class="empty-state" style="border: none; background: transparent; padding-top: var(--sp-4);"><span class="material-icons">query_stats</span><h3>Define tus parámetros</h3><p>Selecciona un rango de fechas para generar tu informe personalizado.</p></div>
                </div>
            </details>
        </div>
    `;
    
    populateAllDropdowns();
    renderBudgetTracking();
    renderInversionesPage('analisis-inversiones-container');
}

/**
 * Renderiza los elementos UI en la página de Configuración basados en el estado actual.
 */
export function loadConfig() { 
    const skipIntroCheckbox = select('config-skip-intro');
    if (skipIntroCheckbox) skipIntroCheckbox.checked = !!(db.config && db.config.skipIntro);
    
    const userEmailEl = select('config-user-email'); 
    if (userEmailEl && currentUser) userEmailEl.textContent = currentUser.email;
    
    const setupPinBtnText = select('setup-pin-btn-text');
    if(setupPinBtnText) {
        setupPinBtnText.textContent = localStorage.getItem('pinUserHash') ? 'Cambiar PIN de Acceso' : 'Configurar PIN de Acceso';
    }

    renderLanguageSelector();
    renderThemeSelector();
}

// --- RENDERIZADORES DE COMPONENTES Y LISTAS ---

// ... (Aquí irían todas las demás funciones de renderizado completas, como `renderCuentas`, `renderInversionesPage`, etc.)

// Como ejemplo final, aquí está `renderVirtualListItem` completa:
export function renderVirtualListItem(item) {
    if (item.type === 'date-header') {
        const dateObj = new Date(item.date + 'T12:00:00Z');
        const day = dateObj.toLocaleDateString(locales[currentLanguage], { weekday: 'short' }).toUpperCase().replace('.', '');
        const dateStr = dateObj.toLocaleDateString(locales[currentLanguage], { day: '2-digit', month: '2-digit', year: 'numeric' });
        return `
            <div class="movimiento-date-header">
                <span>${day} ${dateStr}</span>
                <span>${formatCurrency(item.total)}</span>
            </div>`;
    }

    const m = item.movement;
    let highlightClass = '';
    if (m.id === newMovementIdToHighlight) {
        highlightClass = 'highlight-animation';
        setNewMovementIdToHighlight(null);
    }

    const formattedDate = new Date(m.fecha).toLocaleDateString(locales[currentLanguage], { day: '2-digit', month: '2-digit', year: 'numeric' });
    let indicatorClass = m.tipo === 'traspaso' ? 'transaction-card__indicator--transfer' : (m.cantidad >= 0 ? 'transaction-card__indicator--income' : 'transaction-card__indicator--expense');

    if (m.tipo === 'traspaso') {
        const origen = db.cuentas.find(c => c.id === m.cuentaOrigenId);
        const destino = db.cuentas.find(c => c.id === m.cuentaDestinoId);
        return `
            <div class="transaction-card ${highlightClass}" data-action="edit-movement" data-id="${m.id}">
                <div class="transaction-card__indicator ${indicatorClass}"></div>
                <div class="transaction-card__content">
                    <div class="transaction-card__details">
                        <div class="transaction-card__concept">${escapeHTML(m.descripcion) || 'Traspaso'}</div>
                        <div class="transaction-card__description">${formattedDate}</div>
                        <div class="transaction-card__transfer-details">
                            <div class="transaction-card__transfer-row">
                                <span><span class="material-icons">arrow_upward</span> ${(origen && origen.nombre) || '?'}</span>
                                <span class="transaction-card__balance">${formatCurrency(m.runningBalanceOrigen)}</span>
                            </div>
                            <div class="transaction-card__transfer-row">
                                <span><span class="material-icons">arrow_downward</span> ${(destino && destino.nombre) || '?'}</span>
                                <span class="transaction-card__balance">${formatCurrency(m.runningBalanceDestino)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="transaction-card__figures">
                        <div class="transaction-card__amount text-info">${formatCurrency(m.cantidad)}</div>
                    </div>
                </div>
            </div>`;
    } else {
        const cuenta = db.cuentas.find(c => c.id === m.cuentaId);
        const concept = db.conceptos.find(c => c.id === m.conceptoId);
        const amountClass = m.cantidad >= 0 ? 'text-positive' : 'text-negative';
        return `
            <div class="transaction-card ${highlightClass}" data-action="edit-movement" data-id="${m.id}">
                <div class="transaction-card__indicator ${indicatorClass}"></div>
                <div class="transaction-card__content">
                    <div class="transaction-card__details">
                        <div class="transaction-card__row-1">${toSentenceCase((concept && concept.nombre) || 'S/C')}</div>
                        <div class="transaction-card__row-2">${formattedDate} • ${escapeHTML(m.descripcion)}</div>
                    </div>
                    <div class="transaction-card__figures">
                        <div class="transaction-card__amount ${amountClass}">${formatCurrency(m.cantidad)}</div>
                        <div class="transaction-card__balance">${formatCurrency(m.runningBalance)}</div>
                        <div class="transaction-card__row-2" style="text-align: right;">${escapeHTML((cuenta && cuenta.nombre) || 'S/C')}</div>
                    </div>
                </div>
            </div>`;
    }
}