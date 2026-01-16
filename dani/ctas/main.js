
import { addDays, addWeeks, addMonths, addYears, subDays, subWeeks, subMonths, subYears } from 'https://cdn.jsdelivr.net/npm/date-fns@2.29.3/+esm';

const isCryptoType = (tipo) => {
    const t = (tipo || '').toLowerCase();
    // Detecta palabras clave comunes
    return t.includes('cripto') || t.includes('btc') || t.includes('bitcoin') || t.includes('crypto') || t.includes('exchange') || t.includes('binance') || t.includes('coinbase');
};

const setupEnhancedFormNavigation = () => {
    const inputs = [
        { id: 'movimiento-cantidad', next: 'movimiento-concepto' },
        { id: 'movimiento-descripcion', next: 'movimiento-cuenta' },
        { id: 'movimiento-cuenta', next: 'save-movimiento-btn' }
    ];
    
    inputs.forEach(({id, next}, index) => {
        const input = select(id);
        if (!input) return;
        
        input.addEventListener('keydown', (e) => {
            // Enter para avanzar
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                
                if (next === 'save-movimiento-btn') {
                    select(next)?.click();
                } else {
                    // Para selects personalizados
                    const wrapper = select(next)?.closest('.custom-select-wrapper');
                    const trigger = wrapper?.querySelector('.custom-select__trigger');
                    trigger?.focus();
                    trigger?.click();
                }
            }
            
            // Shift+Enter para retroceder
            if (e.key === 'Enter' && e.shiftKey && index > 0) {
                e.preventDefault();
                select(inputs[index-1].id)?.focus();
            }
            
            // Escape para limpiar/cancelar
            if (e.key === 'Escape') {
                if (id === 'movimiento-cantidad') {
                    input.value = '';
                    handleCalculatorInput('clear');
                }
            }
        });
    });
    
    // Autofocus en cantidad al abrir el formulario
    const movimientoForm = select('movimiento-form');
    movimientoForm?.addEventListener('shown', () => {
        setTimeout(() => select('movimiento-cantidad')?.focus(), 100);
    });
};
const setupRealTimeValidation = () => {
    const cantidadInput = select('movimiento-cantidad');
    const cuentaSelect = select('movimiento-cuenta');
    const errorContainer = select('movimiento-form-errors');
    
    if (!cantidadInput || !errorContainer) return;
    
    const showFieldError = (message, fieldId) => {
        // Eliminar error previo
        errorContainer.querySelector(`[data-field="${fieldId}"]`)?.remove();
        
        if (message) {
            const errorEl = document.createElement('div');
            errorEl.className = 'form-error';
            errorEl.dataset.field = fieldId;
            errorEl.textContent = message;
            errorContainer.appendChild(errorEl);
        }
    };
    
    // Validar cantidad
    cantidadInput.addEventListener('input', () => {
        const value = parseCurrencyString(cantidadInput.value);
        if (isNaN(value) || value === 0) {
            showFieldError('El importe no es válido', 'cantidad');
        } else {
            showFieldError('', 'cantidad');
        }
    });
    
    // Validar cuenta
    cuentaSelect.addEventListener('change', () => {
        if (!cuentaSelect.value) {
            showFieldError('Selecciona una cuenta', 'cuenta');
        } else {
            showFieldError('', 'cuenta');
        }
    });
};
const showRenameLedgersModal = () => {
    const names = db.config.ledgerNames || { A: "Personal", B: "Ahorro", C: "Extra" };
    
    const html = `
    <form id="rename-ledgers-form" novalidate>
        <p class="form-label" style="margin-bottom: var(--sp-3);">
            Asigna nombres familiares a tus contabilidades para identificarlas mejor.
        </p>
        
        <div class="form-group">
            <label class="form-label" style="color: var(--c-primary);">Caja A (Principal)</label>
            <input type="text" id="input-ledger-name-A" class="form-input" value="${escapeHTML(names.A)}" placeholder="Ej: Personal" maxlength="12" required>
        </div>

        <div class="form-group">
            <label class="form-label" style="color: var(--c-danger);">Caja B (Secundaria)</label>
            <input type="text" id="input-ledger-name-B" class="form-input" value="${escapeHTML(names.B)}" placeholder="Ej: Negocio" maxlength="12" required>
        </div>

        <div class="form-group">
            <label class="form-label" style="color: var(--c-success);">Caja C (Extra)</label>
            <input type="text" id="input-ledger-name-C" class="form-input" value="${escapeHTML(names.C)}" placeholder="Ej: Hucha" maxlength="12" required>
        </div>

        <div class="modal__actions">
            <button type="submit" class="btn btn--primary btn--full">Guardar Nombres</button>
        </div>
    </form>`;

    showGenericModal('Personalizar Cajas', html);
};

const handleSaveLedgerNames = async (btn) => {
    setButtonLoading(btn, true);
    
    const newNames = {
        A: select('input-ledger-name-A').value.trim() || "Caja A",
        B: select('input-ledger-name-B').value.trim() || "Caja B",
        C: select('input-ledger-name-C').value.trim() || "Caja C"
    };

    // Actualizar local
    if (!db.config) db.config = {};
    db.config.ledgerNames = newNames;

    // Guardar en Firebase
    await fbDb.collection('users').doc(currentUser.uid).set({ config: db.config }, { merge: true });

    // Actualizar el botón de la barra superior inmediatamente
    const ledgerBtn = select('ledger-toggle-btn');
    if (ledgerBtn) {
        ledgerBtn.textContent = getLedgerName(currentLedger);
    }

    setButtonLoading(btn, false);
    hideModal('generic-modal');
    hapticFeedback('success');
    showToast('Nombres actualizados correctamente.');
};
const optimizeMobileInputExperience = () => {
    const cantidadInput = select('movimiento-cantidad');
    const isTouch = 'ontouchstart' in window;
    
    if (!isTouch || !cantidadInput) return;
    
    // Reducir la altura de la calculadora en móvil
    const calculator = select('calculator-container');
    if (calculator) {
        calculator.style.maxHeight = '50vh';
        calculator.style.overflowY = 'auto';
    }
    
    // Mejorar el foco en móvil
    cantidadInput.addEventListener('focus', () => {
        setTimeout(() => {
            cantidadInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    });
    
    // Input numérico nativo para móviles como fallback
    cantidadInput.setAttribute('inputmode', 'decimal');
    cantidadInput.setAttribute('pattern', '[0-9,.-]*');
};
const setupSmartConceptSuggestions = () => {
    const descripcionInput = select('movimiento-descripcion');
    const conceptoSelect = select('movimiento-concepto');
    
    if (!descripcionInput || !conceptoSelect) return;
    
    // Cache de conceptos usados frecuentemente
    const conceptUsage = new Map();
    
    descripcionInput.addEventListener('input', (e) => {
        const text = e.target.value.toLowerCase();
        if (text.length < 2) return;
        
        // Buscar conceptos similares en movimientos recientes
        const recentWithSameDesc = recentMovementsCache
            .filter(m => m.descripcion?.toLowerCase().includes(text))
            .slice(0, 5);
        
        if (recentWithSameDesc.length > 0) {
            // Encontrar concepto más usado para esta descripción
            const conceptCounts = new Map();
            recentWithSameDesc.forEach(m => {
                const count = conceptCounts.get(m.conceptoId) || 0;
                conceptCounts.set(m.conceptoId, count + 1);
            });
            
            const mostUsed = [...conceptCounts.entries()].sort((a,b) => b[1]-a[1])[0];
            if (mostUsed) {
                // Auto-seleccionar concepto
                conceptoSelect.value = mostUsed[0];
                conceptoSelect.dispatchEvent(new Event('change'));
            }
        }
    });
};
// Limpiar memoria después de añadir movimiento
const cleanupAfterMovementSave = () => {
    // Reset del formulario
    select('movimiento-form')?.reset();
    
    // --- LÍNEAS A ELIMINAR O COMENTAR ---
    // if (allDiarioMovementsCache.length > 1000) {
    //    allDiarioMovementsCache = allDiarioMovementsCache.slice(-500);
    // }
    // ------------------------------------
    
    // Forzar recálculo de balances si hay muchos movimientos
    if (db.movimientos.length > 500) {
        setTimeout(() => processMovementsForRunningBalance(db.movimientos, true), 1000);
    }
};
const setupQuickAddMode = () => {
    // Botón para añadir rápido (pantalla principal)
    const quickAddBtn = document.createElement('button');
    quickAddBtn.className = 'floating-action-btn';
    quickAddBtn.innerHTML = '<span class="material-icons">add</span>';
    quickAddBtn.title = 'Añadir movimiento rápido';
    quickAddBtn.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 16px;
        width: 56px;
        height: 56px;
        border-radius: 28px;
        background: var(--c-primary);
        color: white;
        border: none;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    document.body.appendChild(quickAddBtn);
    
    quickAddBtn.addEventListener('click', () => {
        // Abrir modal simplificado
        showModal('quick-add-modal');
        
        // Configurar valores por defecto del día
        const today = new Date().toISOString().split('T')[0];
        const defaultConcept = db.conceptos.find(c => c.nombre === 'VARIOS')?.id;
        const defaultAccount = getLiquidAccounts()[0]?.id;
        
        // Rellenar valores
        if (defaultConcept) select('quick-concepto').value = defaultConcept;
        if (defaultAccount) select('quick-cuenta').value = defaultAccount;
        select('quick-fecha').value = today;
        
        // Enfocar cantidad
        setTimeout(() => select('quick-cantidad')?.focus(), 100);
    });
};
const renderInformeCuentaRow = (mov, cuentaId, allCuentas) => {
    const fecha = new Date(mov.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });
    let cargo = '';
    let abono = '';
    let conceptoTexto = '';
    
    // Si estamos en modo GLOBAL (cuentaId es null), mostramos el nombre de la cuenta
    const isGlobal = cuentaId === null;
    const cuentaPropia = isGlobal ? allCuentas.find(c => c.id === mov.cuentaId) : null;
    const prefixCuenta = cuentaPropia ? `[${cuentaPropia.nombre}] ` : '';

    // Lógica de importes y descripciones
    if (mov.tipo === 'traspaso') {
        // En modo global, el traspaso interno se anula visualmente o se muestra neutro
        // pero vamos a mantener la lógica relativa para mostrar flujo.
        const esOrigen = mov.cuentaOrigenId === cuentaId || (isGlobal && mov.cantidad < 0); // Simplificación
        
        const origen = allCuentas.find(c => c.id === mov.cuentaOrigenId);
        const destino = allCuentas.find(c => c.id === mov.cuentaDestinoId);
        
        const nombreOrigen = origen ? escapeHTML(origen.nombre) : '?';
        const nombreDestino = destino ? escapeHTML(destino.nombre) : '?';
        
        conceptoTexto = `TRASPASO: ${nombreOrigen} -> ${nombreDestino}`;
        
        // En extracto global, un traspaso interno no afecta al saldo neto global,
        // pero lo mostramos en la columna que corresponda al signo para referencia.
        if (mov.cantidad < 0) cargo = formatCurrency(Math.abs(mov.cantidad));
        else abono = formatCurrency(mov.cantidad);

        if (mov.descripcion && mov.descripcion !== 'Traspaso') {
            conceptoTexto += ` (${escapeHTML(mov.descripcion)})`;
        }
    } else {
        // Movimiento normal
        const concepto = db.conceptos.find(c => c.id === mov.conceptoId);
        const nombreConcepto = concepto ? concepto.nombre.toUpperCase() : 'VARIO';
        
        // En modo global añadimos el nombre de la cuenta al principio
        conceptoTexto = `${prefixCuenta}${nombreConcepto}`;
        if (mov.descripcion) conceptoTexto += ` - ${escapeHTML(mov.descripcion)}`;

        if (mov.cantidad < 0) {
            cargo = formatCurrency(Math.abs(mov.cantidad));
        } else {
            abono = formatCurrency(mov.cantidad);
        }
    }

    return `
        <div class="cartilla-row">
            <div class="cartilla-cell cartilla-date">${fecha}</div>
            <div class="cartilla-cell cartilla-concept">${conceptoTexto}</div>
            <div class="cartilla-cell cartilla-amount text-debit">${cargo}</div>
            <div class="cartilla-cell cartilla-amount text-credit">${abono}</div>
            <div class="cartilla-cell cartilla-balance">${formatCurrency(mov.runningBalance)}</div>
        </div>
    `;
};

const handleGenerateInformeCuenta = async (form, btn = null) => {
    if (btn) setButtonLoading(btn, true, 'Descargando historial...');
    const cuentaId = select('informe-cuenta-select').value;
    const resultadoContainer = select('informe-resultado-container');

    if (!cuentaId) {
        resultadoContainer.innerHTML = '';
        if (btn) setButtonLoading(btn, false);
        return;
    }

    resultadoContainer.innerHTML = `
        <div style="text-align:center; padding: var(--sp-5);">
            <span class="spinner" style="color:var(--c-primary); width: 24px; height:24px;"></span>
            <p style="font-size:var(--fs-xs); margin-top:8px; color:var(--c-on-surface-secondary);">
                Analizando todo el historial...
            </p>
        </div>`;

    try {
        // 1. OBTENER TODO EL HISTORIAL (Forzamos carga si no estamos seguros)
        // Llamamos a getAll. Si ya estaba cargado ("isFullyLoaded"), será instantáneo.
        // Si solo tenías los últimos 3 meses, esto descargará el resto automáticamente.
        const todosLosMovimientos = await AppStore.getAll();
        
        // Obtenemos saldo inicial de la cuenta
        const cuentaObj = db.cuentas.find(c => c.id === cuentaId);
        const saldoInicial = cuentaObj ? parseFloat(cuentaObj.saldoInicial || 0) : 0;

        // 2. FILTRAR movimientos de esta cuenta
        let movimientosDeLaCuenta = todosLosMovimientos.filter(m =>
            (m.cuentaId === cuentaId) || (m.cuentaOrigenId === cuentaId) || (m.cuentaDestinoId === cuentaId)
        );

        // Si no hay movimientos, mostramos aviso
        if (movimientosDeLaCuenta.length === 0 && saldoInicial === 0) {
             resultadoContainer.innerHTML = `<div class="empty-state" style="padding:var(--sp-4); border:none;"><p>Sin movimientos en el historial.</p></div>`;
             if (btn) setButtonLoading(btn, false);
             return;
        }

        // 3. CALCULAR SALDOS (Orden cronológico: Antiguo -> Nuevo)
        movimientosDeLaCuenta.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

        let saldoAcumulado = saldoInicial;

        for (const mov of movimientosDeLaCuenta) {
            let impacto = 0;
            if (mov.tipo === 'traspaso') {
                if (mov.cuentaOrigenId === cuentaId) impacto = -Math.abs(mov.cantidad);
                if (mov.cuentaDestinoId === cuentaId) impacto = Math.abs(mov.cantidad);
            } else {
                impacto = mov.cantidad; // Asumimos signo correcto en cantidad
            }
            saldoAcumulado += impacto;
            mov.runningBalance = saldoAcumulado;
        }

        // 4. PREPARAR VISTA (Orden visual: Nuevo -> Antiguo)
        movimientosDeLaCuenta.reverse(); 
        
        // Filtro visual: Ocultar traspasos si se desea ver solo flujo real
        const movimientosVisibles = movimientosDeLaCuenta.filter(m => m.tipo !== 'traspaso');

        if (movimientosVisibles.length === 0) {
             resultadoContainer.innerHTML = `
                <div class="transactions-list-container" style="padding: 0;">
                    <div style="padding: 15px; text-align: center; opacity: 0.7;">
                        <p>Saldo actual: <strong>${formatCurrency(saldoAcumulado)}</strong></p>
                        <small>No hay ingresos/gastos directos, solo traspasos.</small>
                    </div>
                </div>`;
             if (btn) setButtonLoading(btn, false);
             return;
        }

        // 5. RENDERIZAR
        const listHTML = movimientosVisibles.map(m => renderVirtualListItem({ type: 'transaction', movement: m })).join('');
        
        resultadoContainer.innerHTML = `
            <div class="transactions-list-container" style="padding: 0;">
                <div style="display: flex; justify-content: space-between; padding: 10px 15px; font-size: 0.8rem; opacity: 0.7; border-bottom: 1px solid var(--c-outline);">
                    <span style="text-transform: uppercase; letter-spacing: 1px;">Historial Completo</span>
                    <span>Saldo: <strong style="color: var(--c-on-surface);">${formatCurrency(saldoAcumulado)}</strong></span>
                </div>
                ${listHTML}
            </div>`;

    } catch (error) {
        console.error(error);
        resultadoContainer.innerHTML = `<div class="empty-state text-danger"><p>Error al cargar datos.</p></div>`;
    } finally {
        if (btn) setButtonLoading(btn, false);
    }
};

const handleGenerateGlobalExtract = async (btn = null) => {
    const resultadoContainer = select('informe-resultado-container');
    if (!resultadoContainer) return;

    if (btn) setButtonLoading(btn, true, 'Procesando...');
    else hapticFeedback('medium');
    
    // Limpiamos el selector individual para evitar confusión
    const selectCuenta = select('informe-cuenta-select');
    if (selectCuenta) selectCuenta.value = "";

    resultadoContainer.innerHTML = `
        <div style="text-align:center; padding: var(--sp-5);">
            <span class="spinner" style="color:var(--c-primary); width: 24px; height:24px;"></span>
            <p style="font-size:var(--fs-xs); margin-top:8px; color:var(--c-on-surface-secondary);">
                Consolidando flujo de caja global...
            </p>
        </div>`;

    try {
        const allMovements = await AppStore.getAll();
        const visibleAccountIds = new Set(getVisibleAccounts().map(c => c.id));
        
        // 1. Filtrado Inteligente (Lo que pediste)
        // Solo nos quedamos con movimientos que NO sean traspasos internos.
        // Es decir, solo entradas y salidas reales de dinero de la contabilidad actual.
        let globalMovements = allMovements.filter(m => {
            // Si es traspaso, lo ignoramos por completo para el reporte global "limpio"
            if (m.tipo === 'traspaso') return false; 
            
            // Si es movimiento normal, verificamos que sea de una cuenta visible
            return visibleAccountIds.has(m.cuentaId);
        });

        // 2. Ordenar: Más reciente primero
        globalMovements.sort((a, b) => {
            const dateDiff = new Date(b.fecha) - new Date(a.fecha);
            if (dateDiff !== 0) return dateDiff;
            return b.id.localeCompare(a.id);
        });

        if (globalMovements.length === 0) {
            resultadoContainer.innerHTML = `
                <div class="empty-state" style="padding: 40px 0;">
                    <span class="material-icons">savings</span>
                    <p>No hay movimientos de flujo registrados.</p>
                </div>`;
            return;
        }

        // 3. Renderizado Unificado (Estilo Burbujas)
        // Reutilizamos el renderizador del diario para consistencia total
        const listHTML = globalMovements
            .map(m => renderVirtualListItem({ type: 'transaction', movement: m }))
            .join('');

        resultadoContainer.innerHTML = `
            <div class="transactions-list-container" style="padding: 0;">
                <div style="display:flex; justify-content:space-between; padding: 10px 15px; border-bottom: 1px solid var(--c-outline);">
                    <span style="font-size: 0.8rem; opacity: 0.7; text-transform: uppercase; letter-spacing: 1px;">
                        Flujo Global (Sin Traspasos)
                    </span>
                    <span style="font-size: 0.8rem; font-weight: 700; color: var(--c-primary);">
                        ${getLedgerName(currentLedger)}
                    </span>
                </div>
                ${listHTML}
            </div>`;
     
    } catch (error) {
        console.error(error);
        resultadoContainer.innerHTML = `<div class="empty-state text-danger"><p>Error al calcular.</p></div>`;
    } finally {
        if (btn) setButtonLoading(btn, false);
    }
};

const handleExportFilteredCsv = (btn) => {
    // La lista de movimientos a exportar es la que ya tenemos filtrada en db.movimientos
    const movementsToExport = db.movimientos;

    if (movementsToExport.length === 0) {
        showToast("No hay datos para exportar.", "warning");
        return;
    }

    setButtonLoading(btn, true, 'Exportando...');

    try {
        const cuentasMap = new Map(db.cuentas.map(c => [c.id, c.nombre]));
        const conceptosMap = new Map(db.conceptos.map(c => [c.id, c.nombre]));

        const csvHeader = ['FECHA', 'CUENTA', 'CONCEPTO', 'IMPORTE', 'DESCRIPCIÓN'];
        let csvRows = [csvHeader.join(';')];
        
        // Ordenamos los movimientos por fecha para la exportación
        movementsToExport.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

        for (const mov of movementsToExport) {
            const fecha = formatDateForCsv(mov.fecha);
            const descripcion = `"${mov.descripcion.replace(/"/g, '""')}"`;
            const importeStr = (mov.cantidad / 100).toLocaleString('es-ES', { useGrouping: false, minimumFractionDigits: 2 });
            let cuentaNombre = '';
            let conceptoNombre = '';

            if (mov.tipo === 'traspaso') {
                const origen = cuentasMap.get(mov.cuentaOrigenId) || '?';
                const destino = cuentasMap.get(mov.cuentaDestinoId) || '?';
                cuentaNombre = `"${origen} -> ${destino}"`;
                conceptoNombre = '"TRASPASO"';
            } else {
                cuentaNombre = `"${cuentasMap.get(mov.cuentaId) || 'S/C'}"`;
                conceptoNombre = `"${conceptosMap.get(mov.conceptoId) || 'S/C'}"`;
            }

            csvRows.push([fecha, cuentaNombre, conceptoNombre, importeStr, descripcion].join(';'));
        }

        const csvString = csvRows.join('\r\n');
        const blob = new Blob([`\uFEFF${csvString}`], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `diario_filtrado_${new Date().toISOString().slice(0,10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast("Exportación CSV completada.", "info");

    } catch (error) {
        console.error("Error al exportar CSV filtrado:", error);
        showToast("Error durante la exportación.", "danger");
    } finally {
        setButtonLoading(btn, false);
    }
};

const firebaseConfig = {
  apiKey: "AIzaSyCjwL2nIuxFkZZnU9O7Zr0uRkxzd1NW53I",
  authDomain: "aidanai-ctas.firebaseapp.com",
  projectId: "aidanai-ctas",
  storageBucket: "aidanai-ctas.firebasestorage.app",
  messagingSenderId: "678423604278",
  appId: "1:678423604278:web:e7b7d140d323194dbabc97"
};
const PAGE_IDS = {
    PANEL: 'panel-page',
    DIARIO: 'diario-page',
    PLANIFICAR: 'planificar-page',
    AJUSTES: 'ajustes-page',
};
/* =============================================================== */
/* === MOTOR DE FONDO ESPACIAL ESPECTACULAR === */
/* =============================================================== */
const SpaceBackgroundEffect = (() => {
    let canvas, ctx, w, h, animationFrameId;
    let stars = [];
    let shootingStars = [];
    let isActive = false;

    // Configuración para que sea "Espectacular"
    const CONFIG = {
        starCount: 450, // ¡Muchas estrellas!
        baseSpeed: 0.3, // Velocidad del desplazamiento vertical
        shootingStarFrequency: 0.04, // Probabilidad alta de estrellas fugaces por frame
    };

    // Clase para una estrella normal
    class Star {
        constructor() {
            this.reset();
            // Posición inicial aleatoria en toda la pantalla
            this.y = Math.random() * h; 
        }
        reset() {
            this.x = Math.random() * w;
            this.y = -10; // Empieza justo arriba de la pantalla
            this.z = Math.random() * 1.5 + 0.5; // Profundidad (afecta velocidad y tamaño)
            this.size = Math.random() * 1.2 * this.z;
            this.brightness = Math.random() * 0.8 + 0.2;
            // Velocidad parpadeo
            this.twinkleSpeed = Math.random() * 0.05; 
            this.twinkleDir = Math.random() > 0.5 ? 1 : -1;
        }
        update() {
            this.y += CONFIG.baseSpeed * this.z;
            // Efecto parpadeo
            this.brightness += this.twinkleSpeed * this.twinkleDir;
            if (this.brightness > 1 || this.brightness < 0.2) this.twinkleDir *= -1;
            
            // Si sale por abajo, reiniciar arriba
            if (this.y > h) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 255, ${this.brightness})`;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Clase para estrella fugaz espectacular
    class ShootingStar {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * w * 1.5 - w * 0.25; // Empezar fuera de pantalla horizontalmente
            this.y = Math.random() * h * 0.5; // Empezar en la mitad superior
            this.len = Math.random() * 200 + 100; // Longitud de la cola
            this.speed = Math.random() * 15 + 10; // ¡Muy rápidas!
            this.size = Math.random() * 2 + 0.5;
            // Ángulo aleatorio entre 30 y 60 grados hacia abajo/derecha
            this.angle = (Math.random() * 30 + 30) * (Math.PI / 180); 
            this.opacity = 1;
            this.active = true;
        }
        update() {
            this.x += this.speed * Math.cos(this.angle);
            this.y += this.speed * Math.sin(this.angle);
            this.opacity -= 0.015; // Desvanecer cola
            if (this.x > w + this.len || this.y > h + this.len || this.opacity <= 0) {
                this.active = false;
            }
        }
        draw() {
            if (!this.active) return;
            const tailX = this.x - this.len * Math.cos(this.angle);
            const tailY = this.y - this.len * Math.sin(this.angle);
            
            const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
            gradient.addColorStop(0, `rgba(255,255,255,${this.opacity})`); // Cabeza brillante
            gradient.addColorStop(0.2, `rgba(100,200,255,${this.opacity * 0.6})`); // Cuerpo azulado
            gradient.addColorStop(1, `rgba(0,0,0,0)`); // Cola transparente

            ctx.beginPath();
            ctx.strokeStyle = gradient;
            ctx.lineWidth = this.size;
            ctx.lineCap = 'round';
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(tailX, tailY);
            ctx.stroke();
        }
    }

    const init = () => {
        canvas = document.getElementById('space-canvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        resize();
        window.addEventListener('resize', resize);
        // Crear estrellas iniciales
        for (let i = 0; i < CONFIG.starCount; i++) stars.push(new Star());
    };

    const resize = () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    };

    const animate = () => {
        if (!isActive) return;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'; // Rastro suave para movimiento
        ctx.fillRect(0, 0, w, h); // Limpiar pantalla (fondo negro)

        // Dibujar estrellas normales
        stars.forEach(star => { star.update(); star.draw(); });

        // Gestionar estrellas fugaces
        if (Math.random() < CONFIG.shootingStarFrequency) {
            shootingStars.push(new ShootingStar());
        }
        shootingStars.forEach(ss => { ss.update(); ss.draw(); });
        // Eliminar estrellas fugaces inactivas para ahorrar memoria
        shootingStars = shootingStars.filter(ss => ss.active);

        animationFrameId = requestAnimationFrame(animate);
    };

    return {
        start: () => {
            if (!canvas) init();
            if (isActive) return;
            isActive = true;
            canvas.classList.add('active');
            animate();
            console.log('🌌 Motor espacial espectacular INICIADO');
        },
        stop: () => {
            if (!isActive) return;
            isActive = false;
            if (canvas) canvas.classList.remove('active');
            cancelAnimationFrame(animationFrameId);
            console.log('🛑 Motor espacial DETENIDO (Ahorro de energía)');
        }
    };
})();

// ==========================================
// === CORE OPTIMIZATION: AppStore v1.1 ===
// ==========================================
const AppStore = {
    movements: [],
    isFullyLoaded: false,
    lastFetch: 0,

    // Carga TODO el historial. Si force=true, ignora la memoria y descarga de nuevo.
    async getAll(force = false) {
        if (!currentUser) return [];

        // Si ya tenemos datos cargados y NO forzamos, devolvemos lo que hay en memoria (Rápido)
        if (this.isFullyLoaded && !force) {
            return this.movements;
        }

        console.log("🚀 AppStore: Descargando historial COMPLETO de Firestore...");
        try {
            // NOTA: No usamos .limit() aquí, queremos TODO el historial
            const snapshot = await fbDb.collection('users').doc(currentUser.uid).collection('movimientos')
                .orderBy('fecha', 'desc') 
                .get();
            
            this.movements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            this.isFullyLoaded = true;
            this.lastFetch = Date.now();
            
            console.log(`✅ AppStore: ${this.movements.length} movimientos cargados en memoria.`);
            return this.movements;
        } catch (error) {
            console.error("❌ AppStore Error:", error);
            showToast("Error cargando historial completo", "danger");
            return [];
        }
    },

    // Métodos auxiliares
    add(item) { this.movements.unshift(item); this.sort(); },
    update(updatedItem) {
        const index = this.movements.findIndex(m => m.id === updatedItem.id);
        if (index !== -1) { this.movements[index] = updatedItem; this.sort(); }
    },
    delete(id) {
        const index = this.movements.findIndex(m => m.id === id);
        if (index !== -1) this.movements.splice(index, 1);
    },
    sort() { this.movements.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); },
    clear() { this.movements = []; this.isFullyLoaded = false; }
};
// ▼▼▼ REEMPLAZAR TU FUNCIÓN updateAnalisisWidgets CON ESTA VERSIÓN SIMPLIFICADA ▼▼▼
const updateAnalisisWidgets = async () => {
    try {
        // Renderiza y calcula Colchón de Emergencia e Independencia Financiera
        const saldos = await getSaldos();
        const patrimonioNeto = Object.values(saldos).reduce((sum, s) => sum + s, 0);
        const efData = calculateEmergencyFund(saldos, db.cuentas, recentMovementsCache);
        const fiData = calculateFinancialIndependence(patrimonioNeto, efData.gastoMensualPromedio);

        // Colchón de Emergencia
        const efContainer = document.querySelector('[data-widget-type="emergency-fund"]');
        if (efContainer) {
            const efWidget = efContainer.querySelector('#emergency-fund-widget');
            efWidget.querySelector('.card__content').classList.remove('skeleton'); 
            const monthsValueEl = efWidget.querySelector('#kpi-ef-months-value'); 
            const progressEl = efWidget.querySelector('#kpi-ef-progress'); 
            const textEl = efWidget.querySelector('#kpi-ef-text');
            if (monthsValueEl && progressEl && textEl) { 
                monthsValueEl.textContent = isFinite(efData.mesesCobertura) ? efData.mesesCobertura.toFixed(1) : '∞'; 
                progressEl.value = Math.min(efData.mesesCobertura, 6); 
                let textClass = 'text-danger'; 
                if (efData.mesesCobertura >= 6) textClass = 'text-positive'; 
                else if (efData.mesesCobertura >= 3) textClass = 'text-warning'; 
                monthsValueEl.className = `kpi-item__value ${textClass}`; 
                textEl.innerHTML = `Tu dinero líquido cubre <strong>${isFinite(efData.mesesCobertura) ? efData.mesesCobertura.toFixed(1) : 'todos tus'}</strong> meses de gastos.`; 
            }
        }
        
        // Independencia Financiera
        const fiContainer = document.querySelector('[data-widget-type="fi-progress"]');
        if(fiContainer) {
            const fiWidget = fiContainer.querySelector('#fi-progress-widget');
            fiWidget.querySelector('.card__content').classList.remove('skeleton'); 
            const percentageValueEl = fiWidget.querySelector('#kpi-fi-percentage-value'); 
            const progressEl = fiWidget.querySelector('#kpi-fi-progress'); 
            const textEl = fiWidget.querySelector('#kpi-fi-text'); 
            if (percentageValueEl && progressEl && textEl) { 
                percentageValueEl.textContent = `${fiData.progresoFI.toFixed(1)}%`; 
                progressEl.value = fiData.progresoFI; 
                textEl.innerHTML = `Objetivo: <strong>${formatCurrency(fiData.objetivoFI)}</strong> (basado en un gasto anual de ${formatCurrency(fiData.gastoAnualEstimado)})`; 
            }
        }

    } catch (error) {
        console.error("Error al actualizar los widgets de análisis:", error);
    }
};

const getRecurrentsForDate = (dateString) => {
    const targetDate = parseDateStringAsUTC(dateString);
    if (!targetDate || !db.recurrentes) return [];

    const results = [];
    const targetTime = targetDate.getTime();
    
    db.recurrentes.forEach(r => {
        const nextDate = parseDateStringAsUTC(r.nextDate);
        if (!nextDate) return;

        // Descartamos si el evento ya ha finalizado
        if (r.endDate) {
            const endDate = parseDateStringAsUTC(r.endDate);
            if (targetTime > endDate.getTime()) {
                return;
            }
        }
        
        // La nueva lógica infalible
        let cursorDate = new Date(nextDate);

        if (targetTime === cursorDate.getTime()) {
            results.push(r); // Coincidencia directa
            return;
        }

        // Si la fecha objetivo es POSTERIOR a la próxima fecha, avanzamos
        if (targetTime > cursorDate.getTime()) {
            // Límite de seguridad para evitar bucles infinitos
            const limit = new Date(cursorDate);
            limit.setUTCFullYear(limit.getUTCFullYear() + 10);

            while (cursorDate.getTime() < targetTime && cursorDate.getTime() < limit.getTime()) {
                cursorDate = calculateNextDueDate(cursorDate.toISOString().slice(0, 10), r.frequency);
            }
            if (cursorDate.getTime() === targetTime) {
                results.push(r);
            }
        } 
        // Si la fecha objetivo es ANTERIOR, retrocedemos
        else {
            // Límite de seguridad
            const limit = new Date(cursorDate);
            limit.setUTCFullYear(limit.getUTCFullYear() - 10);
            
            while (cursorDate.getTime() > targetTime && cursorDate.getTime() > limit.getTime()) {
                cursorDate = calculatePreviousDueDate(cursorDate.toISOString().slice(0, 10), r.frequency);
            }
            if (cursorDate.getTime() === targetTime) {
                results.push(r);
            }
        }
    });

    return results;
};

const getInitialDb = () => ({
    cuentas: [], 
    conceptos: [], 
    movimientos: [], 
    presupuestos: [],
    recurrentes: [],
    inversiones_historial: [],
    inversion_cashflows: [],
    config: { 
        skipIntro: false,
        savedReports: {} // <-- AÑADIDO: para guardar la configuración de los informes
    } 
});
		// ▼▼▼ PEGA ESTE BLOQUE DE CÓDIG
// Variable global para guardar los filtros activos
let diarioActiveFilters = null;
let allDiarioMovementsCache = []; // Caché para guardar TODOS los movimientos una vez cargados

// Función para abrir y preparar el modal de filtros
const showDiarioFiltersModal = () => {
    showModal('diario-filters-modal');

    // Rellenamos los selectores múltiples de Cuentas y Conceptos
    const populateMultiSelect = (id, data, nameKey, valKey = 'id') => {
        const selectEl = select(id);
        if (!selectEl) return;
        selectEl.innerHTML = [...data]
            .sort((a, b) => (a[nameKey] || "").localeCompare(b[nameKey] || ""))
            .map(item => `<option value="${item[valKey]}">${item[nameKey]}</option>`)
            .join('');
    };
    
    populateMultiSelect('filter-diario-cuentas', getVisibleAccounts(), 'nombre');
    populateMultiSelect('filter-diario-conceptos', db.conceptos, 'nombre');

    // Rellenamos el formulario con los filtros que ya estaban activos (si los hay)
    if (diarioActiveFilters) {
        select('filter-diario-start-date').value = diarioActiveFilters.startDate || '';
        select('filter-diario-end-date').value = diarioActiveFilters.endDate || '';
        select('filter-diario-description').value = diarioActiveFilters.description || '';
        select('filter-diario-min-amount').value = diarioActiveFilters.minAmount || '';
        select('filter-diario-max-amount').value = diarioActiveFilters.maxAmount || '';
        // Reseleccionamos las opciones en los selectores múltiples
        Array.from(select('filter-diario-cuentas').options).forEach(opt => {
            opt.selected = diarioActiveFilters.cuentas?.includes(opt.value);
        });
        Array.from(select('filter-diario-conceptos').options).forEach(opt => {
            opt.selected = diarioActiveFilters.conceptos?.includes(opt.value);
        });
    }
};

// La función que se ejecuta al pulsar "Aplicar Filtros"
const applyDiarioFilters = async () => {
    // Guardamos los valores del formulario en nuestra variable global
    diarioActiveFilters = {
        startDate: select('filter-diario-start-date').value,
        endDate: select('filter-diario-end-date').value,
        description: select('filter-diario-description').value.toLowerCase(),
        minAmount: select('filter-diario-min-amount').value,
        maxAmount: select('filter-diario-max-amount').value,
        cuentas: Array.from(select('filter-diario-cuentas').selectedOptions).map(opt => opt.value),
        conceptos: Array.from(select('filter-diario-conceptos').selectedOptions).map(opt => opt.value)
    };
    
    hideModal('diario-filters-modal');
    hapticFeedback('success');
    showToast('Filtros aplicados. Mostrando resultados.', 'info');
    
    // Volvemos a renderizar la página del Diario para que aplique los filtros
    await renderDiarioPage();
};

// La función que se ejecuta al pulsar "Limpiar Filtros"
const clearDiarioFilters = async () => {
    diarioActiveFilters = null;
    select('diario-filters-form').reset();
    hideModal('diario-filters-modal');
    showToast('Filtros eliminados.', 'info');
    await renderDiarioPage();
};

// ▲▲▲ FIN DEL BLOQUE A PEGAR ▲▲▲
        let currentUser = null, unsubscribeListeners = [], db = getInitialDb(), deselectedAccountTypesFilter = new Set();
		let userHasInteracted = false;
		let ptrState = {
			startY: 0,
			isPulling: false,
			distance: 0,
			threshold: 80 // Distancia en píxeles que hay que arrastrar para que se active
		};
		let calculatorKeyboardHandler = null;
		let deselectedInvestmentTypesFilter = new Set();
		let selectedInvestmentTypeFilter = null;
		let syncState = 'synced'; 
		let currentLedger = 'A'; // Valores posibles: 'A', 'B', 'C'
		let portfolioViewMode = 'EUR'; // 'EUR' o 'BTC'
		let btcPriceData = { price: 0, lastUpdated: null };

			// Helper para formatear BTC
			const formatBTC = (amount) => {
				return '₿ ' + new Intl.NumberFormat('en-US', { 
					minimumFractionDigits: 4, 
					maximumFractionDigits: 6 
					}).format(amount);
				};
        let globalSearchDebounceTimer = null;
		let newMovementIdToHighlight = null;
		let unsubscribeRecientesListener = null
        const originalButtonTexts = new Map();
        let conceptosChart = null, liquidAssetsChart = null, detailInvestmentChart = null, informesChart = null, assetAllocationChart = null, budgetTrendChart = null, netWorthChart = null;
        let lastScrollTop = null;
        let pageScrollPositions = {};
        let jsonWizardState = {
            file: null,
            data: null,
            preview: {
                counts: {},
                meta: {}
            }
        };
        let isInitialLoadComplete = false;
        let dataLoaded = {
            presupuestos: false,
            recurrentes: false,
            inversiones: false
        };
        
		const MOVEMENTS_PAGE_SIZE = 200;
        let lastVisibleMovementDoc = null; 
        let isLoadingMoreMovements = false; 
        let allMovementsLoaded = false; 
        
        let runningBalancesCache = null;
		let recentMovementsCache = []; // <-- AÑADIR: Caché para los movimientos recientes del dashboard
		        
        const vList = {
			scrollerEl: null, sizerEl: null, contentEl: null, items: [], itemMap: [], 
			heights: {}, 
			renderBuffer: 10, lastRenderedRange: { start: -1, end: -1 }, isScrolling: null
		};
        
                     

		let isDashboardRendering = false;
		let isDiarioPageRendering = false; // <-- AÑADE ESTA LÍNEA
		let dashboardUpdateDebounceTimer = null;
		let diarioViewMode = 'list'; // 'list' o 'calendar'
		let diarioCalendarDate = new Date();
		

async function hashPin(pin) {
    const encoder = new TextEncoder();
    const data = encoder.encode(pin);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPin(pin, storedHash) {
    const pinHash = await hashPin(pin);
    return pinHash === storedHash;
}

const updateSyncStatusIcon = () => {
    const iconEl = select('sync-status-icon');
    if (!iconEl) return;

    let iconName = '';
    let iconTitle = '';
    let iconClass = '';

    switch (syncState) {
        case 'syncing':
            iconName = `<span class="sync-icon-spinner">sync</span>`;
            iconTitle = 'Sincronizando datos con la nube...';
            iconClass = 'sync-status--syncing';
            break;
        case 'error':
            iconName = 'cloud_off';
            iconTitle = 'Error de conexión. Tus cambios se guardan localmente y se sincronizarán al recuperar la conexión.';
            iconClass = 'sync-status--error';
            break;
        case 'synced':
        default:
            iconName = 'cloud_done';
            iconTitle = 'Todos los datos están guardados y sincronizados en la nube.';
            iconClass = 'sync-status--synced';
            break;
    }
    
    iconEl.innerHTML = iconName;
    iconEl.title = iconTitle;
    iconEl.className = `material-icons ${iconClass}`;
};
                       
    
        firebase.initializeApp(firebaseConfig);
        const fbAuth = firebase.auth();
        fbAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        const fbDb = firebase.firestore();
        
        fbDb.enablePersistence({synchronizeTabs: true}).catch(err => {
            if (err.code == 'failed-precondition') showToast('Modo offline no disponible (múltiples pestañas).', 'warning');
            else if (err.code == 'unimplemented') showToast('Navegador no soporta modo offline.', 'warning');
        });
        
async function saveDoc(collectionName, docId, data, btn = null) {
    if (!currentUser) { showToast("Error: No hay usuario.", "danger"); return; }
    if (btn) setButtonLoading(btn, true);

    syncState = 'syncing';
    updateSyncStatusIcon();

    try {
        const docRef = fbDb.collection('users').doc(currentUser.uid).collection(collectionName).doc(docId);
        await docRef.set(data, { merge: true });
        
        await fbDb.waitForPendingWrites();

        syncState = 'synced';
        
    } catch (error) {
        console.error(`Error guardando en ${collectionName}:`, error);
        showToast("Error al guardar.", "danger");
        syncState = 'error';
    } finally {
        if (btn) setButtonLoading(btn, false);
        updateSyncStatusIcon();
    }
}


        async function updateAccountBalance(cuentaId, amountInCents) {
            if (!currentUser || !cuentaId || typeof amountInCents !== 'number') {
                console.error("Argumentos inválidos para updateAccountBalance");
                return;
            }

            try {
                const accountRef = fbDb.collection('users').doc(currentUser.uid).collection('cuentas').doc(cuentaId);
                await accountRef.update({
                    saldo: firebase.firestore.FieldValue.increment(amountInCents)
                });
            } catch (error) {
                console.error(`Error al actualizar saldo de la cuenta ${cuentaId}:`, error);
                showToast("Error crítico: no se pudo actualizar el saldo.", "danger");
            }
        }
        
                
        async function deleteDoc(collectionName, docId) {
    if (!currentUser) { showToast("Error: No hay usuario.", "danger"); return; }
    
    syncState = 'syncing';
    updateSyncStatusIcon();

    try {
        await fbDb.collection('users').doc(currentUser.uid).collection(collectionName).doc(docId).delete();
        await fbDb.waitForPendingWrites();
        syncState = 'synced';
    } catch (error) {
        console.error(`Error borrando de ${collectionName}:`, error);
        showToast("Error al borrar.", "danger");
        syncState = 'error';
    } finally {
        updateSyncStatusIcon();
    }
}
        
// CÓDIGO CORREGIDO PARA loadCoreData
async function loadCoreData(uid) {
    unsubscribeListeners.forEach(unsub => unsub());
    unsubscribeListeners = [];
    
    dataLoaded = { presupuestos: false, recurrentes: false, inversiones: false };

    const userRef = fbDb.collection('users').doc(uid);
    const collectionsToLoad = ['cuentas', 'conceptos'];

    collectionsToLoad.forEach(collectionName => {
        const unsubscribe = userRef.collection(collectionName).onSnapshot(snapshot => {
            db[collectionName] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            populateAllDropdowns();
            
            // === ¡LA OTRA CORRECIÓN CLAVE ESTÁ AQUÍ! ===
            if (select(PAGE_IDS.PANEL)?.classList.contains('view--active')) {
                scheduleDashboardUpdate();
            }
            // =========================================

        }, error => console.error(`Error escuchando ${collectionName}: `, error));
        unsubscribeListeners.push(unsubscribe);
    });
    
    const unsubRecurrentes = userRef.collection('recurrentes').onSnapshot(snapshot => {
        if (db.recurrentes.length === 0) {
            db.recurrentes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } else {
            snapshot.docChanges().forEach(change => {
                const data = { id: change.doc.id, ...change.doc.data() };
                const index = db.recurrentes.findIndex(item => item.id === change.doc.id);
                if (change.type === 'added') { if (index === -1) db.recurrentes.push(data); }
                if (change.type === 'modified') { if (index > -1) db.recurrentes[index] = data; }
                if (change.type === 'removed') { if (index > -1) db.recurrentes.splice(index, 1); }
            });
        }
        db.recurrentes.sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate));
        const activePage = document.querySelector('.view--active');
        if (activePage) {
            if (activePage.id === PAGE_IDS.DIARIO) renderDiarioPage();
            // CORRECCIÓN ADICIONAL: Apuntamos a la nueva página de Planificar
            if (activePage.id === PAGE_IDS.PLANIFICAR) renderPlanificacionPage();
        }
    }, error => console.error(`Error escuchando recurrentes: `, error));
    unsubscribeListeners.push(unsubRecurrentes);

    const unsubConfig = userRef.onSnapshot(doc => {
        db.config = doc.exists && doc.data().config ? doc.data().config : getInitialDb().config;
        localStorage.setItem('skipIntro', (db.config && db.config.skipIntro) || 'false');
        loadConfig();
		updateLedgerButtonUI();
    }, error => console.error("Error escuchando la configuración del usuario: ", error));
    unsubscribeListeners.push(unsubConfig);
    
    if (unsubscribeRecientesListener) unsubscribeRecientesListener();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    unsubscribeRecientesListener = userRef.collection('movimientos')
        .where('fecha', '>=', threeMonthsAgo.toISOString())
        .onSnapshot(snapshot => {
            recentMovementsCache = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const activePage = document.querySelector('.view--active');
            
            // === ¡Y LA ÚLTIMA CORRECIÓN CLAVE ESTÁ AQUÍ! ===
            if (activePage && activePage.id === PAGE_IDS.PANEL) {
                scheduleDashboardUpdate();
            }
            // ============================================

        }, error => console.error("Error escuchando movimientos recientes: ", error));
                        
        startMainApp();
};

    
        async function loadPresupuestos() {
    // 👻 Función Fantasma:
    // La mantenemos viva solo para que la app no se queje al iniciar.
    
    console.log("Presupuestos desactivados para OnePlus Nord 4");
    
    // Le decimos a la base de datos que está vacía
    db.presupuestos = [];
    dataLoaded.presupuestos = true;
    
    // Devolvemos "OK" inmediatamente
    return Promise.resolve();
}

        async function loadInversiones() {
    if (dataLoaded.inversiones || !currentUser) return Promise.resolve();
    
    const coleccionesInversion = ['inversiones_historial', 'inversion_cashflows'];
    
    const promises = coleccionesInversion.map(collectionName => {
        return new Promise((resolve, reject) => {
            let firstLoad = true;
            const unsub = fbDb.collection('users').doc(currentUser.uid).collection(collectionName).onSnapshot(snapshot => {
                db[collectionName] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                if (firstLoad) {
                    firstLoad = false;
                    resolve(); // ¡Promesa cumplida para este tipo de dato!
                }
            }, err => {
                console.error(`Error al cargar ${collectionName}:`, err);
                reject(err);
            });
            unsubscribeListeners.push(unsub);
        });
    });

    await Promise.all(promises);

    dataLoaded.inversiones = true;

    }
    const checkAuthState = () => {
    fbAuth.onAuthStateChanged((user) => {
        if (user) {
            const storedPinHash = localStorage.getItem('pinUserHash');
            const storedPinEmail = localStorage.getItem('pinUserEmail');

            if (storedPinHash && storedPinEmail === user.email) {
                showPinScreen(user);
            } else {
                currentUser = user;
                loadCoreData(user.uid);
            }
        } else {
            currentUser = null;
            // Limpieza profunda de Suscripciones
            unsubscribeListeners.forEach(unsub => unsub());
            unsubscribeListeners = [];
            if (unsubscribeRecientesListener) {
                unsubscribeRecientesListener();
                unsubscribeRecientesListener = null;
            }
            
            // Limpieza profunda de Datos en Memoria
            db = getInitialDb();
            recentMovementsCache = [];
            allDiarioMovementsCache = [];
            runningBalancesCache = null;
            lastVisibleMovementDoc = null;
            allMovementsLoaded = false;
                        
            // Limpieza de la UI
            destroyAllCharts();
            showLoginScreen();
        }
    });
};

 const calculateNextDueDate = (currentDueDate, frequency, weekDays = []) => {
    // Parseamos la fecha base asegurando mediodía UTC para evitar saltos
    const d = new Date(currentDueDate + 'T12:00:00Z');
    
    if (isNaN(d.getTime())) return new Date(); // Fallback de seguridad

    switch (frequency) {
        case 'daily': return addDays(d, 1);
        case 'monthly': return addMonths(d, 1);
        case 'yearly': return addYears(d, 1);
        case 'weekly': {
            if (!weekDays || weekDays.length === 0) return addDays(d, 7); // Fallback si no hay días

            const sortedDays = [...weekDays].map(Number).sort((a, b) => a - b);
            const currentDay = d.getUTCDay(); // Usamos getUTCDay para ser consistentes

            // Buscar el próximo día en la misma semana
            const nextDayInWeek = sortedDays.find(day => day > currentDay);
            
            if (nextDayInWeek !== undefined) {
                return addDays(d, nextDayInWeek - currentDay);
            } else {
                // Saltar a la siguiente semana
                const daysUntilNextWeek = 7 - currentDay;
                const firstDayOfNextWeek = sortedDays[0];
                return addDays(d, daysUntilNextWeek + firstDayOfNextWeek);
            }
        }
        default: return d;
    }
};

const calculatePreviousDueDate = (currentDueDate, frequency, weekDays = []) => {
    const d = parseDateStringAsUTC(currentDueDate);
    if (!d) return new Date();

    switch (frequency) {
        case 'daily': return subDays(d, 1);
        case 'monthly': return subMonths(d, 1);
        case 'yearly': return subYears(d, 1);
        case 'weekly': {
             if (!weekDays || weekDays.length === 0) return d;

            const sortedDays = [...weekDays].map(Number).sort((a, b) => a - b);
            const currentDay = d.getUTCDay();

            // Buscar el día válido anterior en la misma semana
            const prevDayInWeek = [...sortedDays].reverse().find(day => day < currentDay);
            
            if (prevDayInWeek !== undefined) {
                return subDays(d, currentDay - prevDayInWeek);
            } else {
                // No hay días antes en esta semana, saltar a la anterior
                const daysSinceStartOfWeek = currentDay;
                const lastDayOfPrevWeek = sortedDays[sortedDays.length - 1];
                return subDays(d, daysSinceStartOfWeek + (7 - lastDayOfPrevWeek));
            }
        }
        default: return d;
    }
};
		
		const select = (id) => document.getElementById(id);
		const selectAll = (s) => document.querySelectorAll(s);
		const selectOne = (s) => document.querySelector(s);
        const isMobileDevice = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
		const chunkArray = (array, size) => {
			const chunks = [];
			for (let i = 0; i < array.length; i += size) {
				chunks.push(array.slice(i, i + size));
			}
			return chunks;
		};
		const measureListItemHeights = () => {
    // CALIBRACIÓN PARA MODO DENSO (OnePlus Nord 4)
    // Definimos las alturas exactas que hemos puesto en el CSS
    vList.heights = {
        transaction: 50, // ¡CAMBIO CRÍTICO! De 64px bajamos a 50px
        transfer: 62,    // Traspasos un poco más altos (antes 76px)
        header: 36,      // Cabeceras de fecha (antes 40px+)
        pendingHeader: 36, 
        pendingItem: 60  
    };
    
    console.log('⚡ Motor de lista calibrado para Alta Densidad:', vList.heights);
};

const hapticFeedback = (type = 'light') => {
    if (!userHasInteracted || !('vibrate' in navigator)) return;
    
    try {
        let pattern;
        switch (type) {
            // Patrones optimizados para motores hápticos lineales (OnePlus/Pixel)
            case 'light':   pattern = 5; break;  // Muy corto y seco (clicks)
            case 'medium':  pattern = 15; break; // Botones importantes
            case 'success': pattern = [5, 30, 5]; break; // Doble toque rápido
            case 'warning': pattern = [20, 50, 20]; break;
            case 'error':   pattern = [50, 30, 50, 30, 50]; break;
            default:        pattern = 5;
        }
        navigator.vibrate(pattern);
    } catch (e) { }
};

        const parseDateStringAsUTC = (dateString) => {
            if (!dateString) return null;
            return new Date(dateString + 'T12:00:00Z');
        };
		const generateReportFilterControls = (reportId, defaultPeriod = 'año-actual') => {
    return `
        <div class="report-filters" data-report-id="${reportId}" style="margin-bottom: var(--sp-4); padding: var(--sp-3); background-color: var(--c-surface-variant); border-radius: var(--border-radius-md);">
            <div class="form-group" style="margin-bottom: var(--sp-2);">
                <label for="filter-periodo-${reportId}" class="form-label" style="margin-bottom: var(--sp-1);">Seleccionar Periodo</label>
                <select id="filter-periodo-${reportId}" class="form-select report-period-selector">
                    <option value="mes-actual" ${defaultPeriod === 'mes-actual' ? 'selected' : ''}>Este Mes</option>
                    <option value="año-actual" ${defaultPeriod === 'año-actual' ? 'selected' : ''}>Este Año</option>
                    <option value="ultimo-año" ${defaultPeriod === 'ultimo-año' ? 'selected' : ''}>Últimos 12 Meses</option>
                    <option value="custom">Personalizado</option>
                </select>
            </div>
            <div id="custom-date-filters-${reportId}" class="form-grid hidden" style="grid-template-columns: 1fr 1fr; gap: var(--sp-2);">
                <div class="form-group" style="margin-bottom: 0;">
                    <label for="filter-fecha-inicio-${reportId}" class="form-label" style="font-size: var(--fs-xs);">Desde</label>
                    <input type="date" id="filter-fecha-inicio-${reportId}" class="form-input">
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                    <label for="filter-fecha-fin-${reportId}" class="form-label" style="font-size: var(--fs-xs);">Hasta</label>
                    <input type="date" id="filter-fecha-fin-${reportId}" class="form-input">
                </div>
            </div>
        </div>`;
};


const setupFormNavigation = () => {
    // Referencias
    const cantidadInput = select('movimiento-cantidad');
    const conceptoSelect = select('movimiento-concepto'); // Select real
    const descripcionInput = select('movimiento-descripcion');
    const cuentaSelect = select('movimiento-cuenta'); // Select real
    
    const saveButton = select('save-movimiento-btn');

    // Helpers para encontrar los "Triggers" (los divs falsos que se ven en pantalla)
    const getTrigger = (id) => select(id)?.closest('.form-field-compact')?.querySelector('.custom-select__trigger');

    // 1. CANTIDAD [ENTER] -> Abrir CONCEPTO
    cantidadInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // Enfocamos el disparador visual del concepto
            getTrigger('movimiento-concepto')?.focus();
        }
    });
	const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    // 2. AL CAMBIAR CONCEPTO (Lógica de autocompletado del detalle)
    // Usamos 'change' en el select real, que nuestra función createCustomSelect ya dispara.
    conceptoSelect.addEventListener('change', () => {
        const conceptoTexto = conceptoSelect.options[conceptoSelect.selectedIndex]?.text;
        
        // Si el detalle está vacío o tiene el mismo valor que el concepto anterior (lógica simple), rellenamos.
        // La regla: "si no se cambia pondrá el mismo nombre que concepto". 
        // Hacemos que SIEMPRE sugiera el concepto si el campo está vacío.
        if (conceptoTexto && descripcionInput.value.trim() === '') {
            descripcionInput.value = toSentenceCase(conceptoTexto);
        }
        
        // Tras elegir concepto, saltamos al campo Detalle
        // Pequeño timeout para dar tiempo a que se cierre el dropdown visual
        setTimeout(() => {
            descripcionInput.focus();
            descripcionInput.select(); // Seleccionamos texto para facilitar sobrescritura si se desea cambiar
        }, 100);
		if (!isTouch) {
        setTimeout(() => {
            descripcionInput.focus();
            descripcionInput.select();
        }, 100);
    } else {
        // En móvil, al menos aseguramos que el campo sea visible
        descripcionInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    });

    // 3. DETALLE [ENTER] -> Abrir CUENTA
    descripcionInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            getTrigger('movimiento-cuenta')?.focus();
        }
    });

    // 4. AL CAMBIAR CUENTA -> Enfocar GUARDAR (o guardar directamente)
    cuentaSelect.addEventListener('change', () => {
        setTimeout(() => {
            saveButton.focus(); // Llevamos al usuario al botón guardar
            // Opcional: Si quieres que guarde directamente al elegir cuenta, descomenta:
            // saveButton.click(); 
        }, 100);
    });
    
    // Lógica para TRASPASOS (Camino alternativo)
    const origenTrigger = getTrigger('movimiento-cuenta-origen');
    
    // Si estamos en modo traspaso (detectamos por visibilidad), cambiamos el flujo desde descripción
    // (o podemos saltar descripción en traspasos, pero lo dejamos accesible).
};

	/**
 * Obtiene las fechas de inicio y fin basadas en un selector de periodo de informe.
 * @param {string} reportId - El ID del informe.
 * @returns {{sDate: Date, eDate: Date}} Un objeto con las fechas de inicio y fin.
 */
const getDatesFromReportFilter = (reportId) => {
    const periodSelector = select(`filter-periodo-${reportId}`);
    if (!periodSelector) return { sDate: null, eDate: null };

    const p = periodSelector.value;
    let sDate, eDate;
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    switch (p) {
        case 'mes-actual':
            sDate = new Date(now.getFullYear(), now.getMonth(), 1);
            eDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
            break;
        case 'año-actual':
            sDate = new Date(now.getFullYear(), 0, 1);
            eDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
            break;
        case 'ultimo-año':
            eDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
            sDate = new Date(now);
            sDate.setFullYear(sDate.getFullYear() - 1);
            sDate.setDate(sDate.getDate() + 1);
            sDate.setHours(0,0,0,0);
            break;
        case 'custom':
            const startInput = select(`filter-fecha-inicio-${reportId}`);
            const endInput = select(`filter-fecha-fin-${reportId}`);
            sDate = startInput?.value ? parseDateStringAsUTC(startInput.value) : null;
            eDate = endInput?.value ? parseDateStringAsUTC(endInput.value) : null;
            if (eDate) eDate.setUTCHours(23, 59, 59, 999);
            break;
    }
    return { sDate, eDate };
};


/**
 * REVISADO: Calcula el impacto real de un movimiento en el flujo de caja,
 * asegurándose de que la cuenta del movimiento está visible.
 * @param {object} mov - El objeto de movimiento.
 * @param {Set<string>} visibleAccountIds - Un Set con los IDs de las cuentas visibles.
 * @returns {number} La cantidad en céntimos del impacto del movimiento.
 */
const calculateMovementAmount = (mov, visibleAccountIds) => {
    let amount = 0;
    if (mov.tipo === 'movimiento') {
        // CORRECCIÓN CLAVE: Solo se suma si la cuenta del movimiento pertenece a la contabilidad visible.
        if (visibleAccountIds.has(mov.cuentaId)) {
            amount = mov.cantidad;
        }
    } else if (mov.tipo === 'traspaso') {
        const origenVisible = visibleAccountIds.has(mov.cuentaOrigenId);
        const destinoVisible = visibleAccountIds.has(mov.cuentaDestinoId);
        // Si el traspaso es entre contabilidades, solo contamos la parte que entra o sale.
        if (origenVisible && !destinoVisible) amount = -mov.cantidad; // Sale dinero
        else if (!origenVisible && destinoVisible) amount = mov.cantidad; // Entra dinero
        // Si es un traspaso interno (ambas visibles) o externo (ninguna visible), el impacto es 0.
    }
    return amount;
};

/**
 * REVISADO: Función central para calcular totales de ingresos/gastos/neto.
 * Ahora utiliza la función 'calculateMovementAmount' corregida.
 * @param {Array<object>} movs - Array de movimientos a procesar.
 * @param {Set<string>} visibleAccountIds - Set de IDs de cuentas visibles.
 * @returns {{ingresos: number, gastos: number, saldoNeto: number}}
 */
const calculateTotals = (movs, visibleAccountIds) => {
    return movs.reduce((acc, mov) => {
        const amount = calculateMovementAmount(mov, visibleAccountIds);
        if (amount > 0) acc.ingresos += amount;
        else acc.gastos += amount;
        acc.saldoNeto += amount;
        return acc;
    }, { ingresos: 0, gastos: 0, saldoNeto: 0 });
};
document.body.addEventListener('change', e => {
    // 1. Selector de Periodo (Mes/Año/Custom)
    if (e.target.classList.contains('report-period-selector')) {
        const reportFilter = e.target.closest('.report-filters');
        if (reportFilter) {
            const reportId = reportFilter.dataset.reportId;
            const customFilters = select(`custom-date-filters-${reportId}`);
            if (customFilters) customFilters.classList.toggle('hidden', e.target.value !== 'custom');
            
            if (e.target.value !== 'custom') {
                renderInformeDetallado(reportId);
            }
        }
    }

    // 2. Inputs de Fecha Personalizados (CORREGIDO)
    if (e.target.type === 'date' && e.target.id.startsWith('filter-fecha-')) {
        const reportFilter = e.target.closest('.report-filters');
        if (reportFilter) {
            const reportId = reportFilter.dataset.reportId;
            
            // Usamos el operador ?. para evitar el crash si el elemento no existe
            const startDate = select(`filter-fecha-inicio-${reportId}`)?.value;
            const endDate = select(`filter-fecha-fin-${reportId}`)?.value;

            // Solo renderizamos si AMBAS fechas tienen valor
            if(startDate && endDate) {
                 renderInformeDetallado(reportId);
            }
        }
    }
});
/* --- Helper para Gradientes en Gráficos --- */
/* Asegúrate de que esta función esté SOLO UNA VEZ en todo el archivo main.js */
const createChartGradient = (ctx, colorHex) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 300); // De arriba a abajo
    
    // Detectamos si es el color verde principal o azul
    if (colorHex && (colorHex.includes('0, 179, 77') || colorHex.includes('#00B34D'))) { 
        // Verde (Ingresos / Patrimonio positivo)
        gradient.addColorStop(0, 'rgba(0, 179, 77, 0.4)'); 
        gradient.addColorStop(1, 'rgba(0, 179, 77, 0.0)');
    } else { 
        // Azul (Por defecto / Otros)
        gradient.addColorStop(0, 'rgba(0, 122, 255, 0.4)'); 
        gradient.addColorStop(1, 'rgba(0, 122, 255, 0.0)');
    }
    return gradient;
};

        const generateId = () => fbDb.collection('users').doc().id;
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        const currencyFormatter = new Intl.NumberFormat('es-ES', { 
				style: 'currency', 
				currency: 'EUR',
				minimumFractionDigits: 2
		});

		const formatCurrency = (numInCents) => {
			const number = (numInCents || 0) / 100;
			return currencyFormatter.format(number);
};
const formatCurrencyHTML = (numInCents) => {
    const formatted = formatCurrency(numInCents);
    // Separa la parte entera de los decimales (asumiendo formato 1.234,56 €)
    const parts = formatted.split(',');
    if (parts.length === 2) {
        // parts[0] es "1.234" y parts[1] es "56 €"
        return `<span class="currency-major">${parts[0]}</span><small class="currency-minor">,${parts[1]}</small>`;
    }
    return `<span class="currency-major">${formatted}</span>`;
};
	const getLedgerName = (letter) => {
    // Intenta obtener el nombre personalizado, si no existe, usa "Caja X"
    return db.config?.ledgerNames?.[letter] || `Caja ${letter}`;
};
const updateLedgerButtonUI = () => {
    // 1. Seleccionamos los elementos
    const btn = document.getElementById('ledger-toggle-btn');
    const oneDriveBtn = document.getElementById('main-menu-btn');
    
    // 2. Definimos los colores (A=Azul, B=Rojo, C=Verde)
    const colors = {
        'A': '#007bff', 
        'B': '#dc3545', 
        'C': '#28a745'
    };
    
    // 3. Obtenemos el color actual
    const activeColor = colors[currentLedger] || colors['A'];

    // 4. Aplicamos el cambio al botón de CAJA (Caja A, B, C)
    if (btn) {
        const name = getLedgerName(currentLedger);
        btn.textContent = name;
        btn.title = `Estás en: ${name}`;
        
        // Forzamos el color con prioridad máxima
        btn.style.setProperty('color', activeColor, 'important');
        btn.style.setProperty('border-color', activeColor, 'important');
    }

    // 5. Aplicamos el cambio al botón de ONEDRIVE (Cartera)
    if (oneDriveBtn) {
        // Cambiamos el color del botón
        oneDriveBtn.style.setProperty('color', activeColor, 'important');
        
        // TRUCO EXTRA: Buscamos el icono de dentro y también lo pintamos
        const iconInside = oneDriveBtn.querySelector('.material-icons');
        if (iconInside) {
            iconInside.style.setProperty('color', activeColor, 'important');
        }
    }
};
/* --- HELPER: Convierte HEX a RGBA para los gradientes --- */
const hexToRgba = (hex, alpha) => {
    let r = 0, g = 0, b = 0;
    // Manejo de 3 dígitos (#FFF)
    if (hex.length === 4) {
        r = parseInt("0x" + hex[1] + hex[1]);
        g = parseInt("0x" + hex[2] + hex[2]);
        b = parseInt("0x" + hex[3] + hex[3]);
    } 
    // Manejo de 6 dígitos (#FFFFFF)
    else if (hex.length === 7) {
        r = parseInt("0x" + hex[1] + hex[2]);
        g = parseInt("0x" + hex[3] + hex[4]);
        b = parseInt("0x" + hex[5] + hex[6]);
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// --- Habilitador de Interacción ---
// Los navegadores modernos, por seguridad, solo permiten la vibración DESPUÉS de que el usuario
// haya tocado la pantalla al menos una vez. Esta pequeña pieza de código se encarga de eso.
const enableHaptics = () => {
    userHasInteracted = true;
    // Una vez que el usuario ha interactuado, eliminamos los listeners para no ejecutarlos más.
    document.body.removeEventListener('touchstart', enableHaptics, { once: true });
    document.body.removeEventListener('click', enableHaptics, { once: true });
};

const showToast = (message, type = 'info', duration = 3500) => {
    const container = select('toast-container');
    if (!container) return;

    // 1. Crear elemento
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    
    // 2. Definir icono según el tipo
    const icons = {
        success: 'check_circle',
        danger: 'error',
        warning: 'warning',
        info: 'info'
    };
    const iconName = icons[type] || 'info';

    // 3. Inyectar HTML con estructura Flexbox
    toast.innerHTML = `
        <span class="material-icons toast__icon">${iconName}</span>
        <span class="toast__message">${message}</span>
    `;

    // 4. Añadir al DOM
    container.appendChild(toast);

    // 5. Activar animación de entrada (Next Frame)
    requestAnimationFrame(() => {
        toast.classList.add('toast--visible');
        // Pequeña vibración al aparecer para feedback físico
        if (type === 'success' || type === 'danger') hapticFeedback('light');
    });

    // 6. Programar salida
    setTimeout(() => {
        toast.classList.remove('toast--visible');
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px) scale(0.95)';
        
        // Eliminar del DOM tras la transición CSS
        toast.addEventListener('transitionend', () => {
            if (toast.parentElement) toast.remove();
        });
    }, duration);
};


        const toSentenceCase = (str) => {
			if (!str || typeof str !== 'string') return '';
			return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
		};

        const setButtonLoading = (btn, isLoading, text = 'Cargando...') => {
            if (!btn) return;
            if (isLoading) { if (!originalButtonTexts.has(btn)) originalButtonTexts.set(btn, btn.innerHTML); btn.setAttribute('disabled', 'true'); btn.classList.add('btn--loading'); btn.innerHTML = `<span class="spinner"></span> <span>${text}</span>`;
            } else { btn.removeAttribute('disabled'); btn.classList.remove('btn--loading'); if (originalButtonTexts.has(btn)) { btn.innerHTML = originalButtonTexts.get(btn); originalButtonTexts.delete(btn); } }
        };

        const displayError = (id, msg) => { const err = select(`${id}-error`); if (err) { err.textContent = msg; err.setAttribute('role', 'alert'); } const inp = select(id); if (inp) inp.classList.add('form-input--invalid'); };
        const clearError = (id) => { const err = select(`${id}-error`); if (err) { err.textContent = ''; err.removeAttribute('role'); } const inp = select(id); if (inp) inp.classList.remove('form-input--invalid'); };
        const clearAllErrors = (formId) => { const f = select(formId); if (!f) return; f.querySelectorAll('.form-error').forEach((e) => e.textContent = ''); f.querySelectorAll('.form-input--invalid').forEach(e => e.classList.remove('form-input--invalid')); };
        /* --- REEMPLAZAR ESTA FUNCIÓN AUXILIAR PARA CORREGIR DECIMALES --- */
const animateCountUp = (el, end, duration = 700, formatAsCurrency = true, prefix = '', suffix = '') => {
    if (!el) return;
    
    // Si el elemento no es visible, renderizado estático inmediato
    if (!el.offsetParent) {
        if (formatAsCurrency) {
            el.innerHTML = prefix + formatCurrencyHTML(end) + suffix; // USA innerHTML y formatCurrencyHTML
        } else {
            el.textContent = `${prefix}${(end / 100).toFixed(2)}${suffix}`;
        }
        el.dataset.currentValue = String(end / 100);
        return;
    }

    const start = parseFloat(el.dataset.currentValue || '0');
    const endValue = end / 100;
    
    if (start === endValue) {
        if (formatAsCurrency) {
            el.innerHTML = prefix + formatCurrencyHTML(end) + suffix;
        } else {
            el.textContent = `${prefix}${endValue.toFixed(2)}${suffix}`;
        }
        return;
    }

    el.dataset.currentValue = String(endValue);
    let startTime = null;

    const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
        
        const current = start + (endValue - start) * ease;
        const currentInCents = Math.round(current * 100);

        if (formatAsCurrency) {
            // Durante la animación usamos formatCurrencyHTML para que no parpadee el estilo
            el.innerHTML = prefix + formatCurrencyHTML(currentInCents) + suffix;
        } else {
            el.textContent = `${prefix}${current.toFixed(2)}${suffix}`;
        }

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            if (formatAsCurrency) {
                el.innerHTML = prefix + formatCurrencyHTML(end) + suffix;
            } else {
                el.textContent = `${prefix}${(end / 100).toFixed(2)}${suffix}`;
            }
        }
    };
    
    requestAnimationFrame(step);
};
        const escapeHTML = str => (str || '').replace(/[&<>"']/g, match => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[match]);
        
        const parseCurrencyString = (str) => {
    if (typeof str !== 'string' || !str.trim()) return 0; // Retorna 0 en lugar de NaN para evitar errores matemáticos posteriores
    let cleanStr = str.replace(/[€$£\s]/g, '');

    // Si solo hay un separador, asumimos que es decimal si hay 1 o 2 dígitos después.
    // Si hay 3, es ambiguo, pero en España suele ser millares (1.000).
    // Tu lógica actual es buena, pero añadamos seguridad:
    
    // Normalizar a formato inglés interno (1234.56)
    if (cleanStr.includes(',') && cleanStr.includes('.')) {
        // Caso complejo: 1.234,56 -> eliminar puntos, cambiar coma
        cleanStr = cleanStr.replace(/\./g, '').replace(',', '.');
    } else if (cleanStr.includes(',')) {
        // Caso simple coma: 12,50 -> 12.50
        cleanStr = cleanStr.replace(',', '.');
    } 
    // Caso simple punto: 12.50 se queda igual. 
    // PERO si es 1.200 (mil doscientos), JS lo toma como 1.2.
    // Dada tu audiencia (España), asumimos que el input manual de la calculadora usa ',' para decimales.
    
    const result = parseFloat(cleanStr);
    return isNaN(result) ? 0 : result;
};
		const formatAsCurrencyInput = (num) => {
    if (isNaN(num)) return '';
    // Usamos Intl.NumberFormat que es la forma moderna y correcta de hacerlo.
    return new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true // ¡Esta es la opción clave!
    }).format(num);
};
	const showPinScreen = (user) => {
    // 1. Encender estrellas (IMPORTANTE)
    if (typeof SpaceBackgroundEffect !== 'undefined') {
        SpaceBackgroundEffect.start();
    }

    currentUser = user;
    const pinScreen = select('pin-login-screen');
    const loginScreen = select('login-screen');
    const appRoot = select('app-root'); // O 'app-container', verifica tu ID

    // 2. Ocultar todo lo demás
    if (appRoot) appRoot.classList.remove('app-layout--visible'); 
    if (loginScreen) loginScreen.classList.remove('login-view--visible');

    // 3. Mostrar PIN y quitarle el fondo
    if (pinScreen) {
        pinScreen.classList.add('login-view--visible');
        
        // --- ESTA LÍNEA ES LA MAGIA QUE FALTA ---
        pinScreen.style.background = 'transparent'; 
        pinScreen.style.backgroundColor = 'transparent';
        // ----------------------------------------
    }
    
    // Lógica de inputs (sin cambios)
    const pinInputs = selectAll('#pin-inputs-container .pin-input');
    pinInputs.forEach(input => input.value = '');
    const errorMsg = select('pin-error');
    if (errorMsg) errorMsg.textContent = '';
    if (pinInputs.length > 0) pinInputs[0].focus();
};

        const handlePinSubmit = async () => {
            const pinInputs = selectAll('#pin-inputs-container .pin-input');
            const pin = Array.from(pinInputs).map(input => input.value).join('');
            const errorEl = select('pin-error');
            
            if (pin.length !== 4) {
                errorEl.textContent = 'El PIN debe tener 4 dígitos.';
                return;
            }

            const storedHash = localStorage.getItem('pinUserHash');
            const isValid = await verifyPin(pin, storedHash);

            if (isValid) {
                hapticFeedback('success');
                loadCoreData(currentUser.uid);
            } else {
                hapticFeedback('error');
                errorEl.textContent = 'PIN incorrecto. Inténtalo de nuevo.';
                pinInputs.forEach(input => input.value = '');
                pinInputs[0].focus();
            }
        };
    const handleKpiDrilldown = async (kpiButton) => {
    const type = kpiButton.dataset.type;
    if (!type) return;

    hapticFeedback('light');
    showGenericModal('Cargando detalles...', `<div style="text-align:center; padding: var(--sp-5);"><span class="spinner"></span></div>`);

    const { current } = await getFilteredMovements(false);
    
    let movementsToShow = [];
    let modalTitle = '';

    switch (type) {
        case 'ingresos':
            modalTitle = 'Ingresos del Periodo';
            movementsToShow = current.filter(m => calculateMovementAmount(m, new Set(getVisibleAccounts().map(c => c.id))) > 0);
            break;
        case 'gastos':
            modalTitle = 'Gastos del Periodo';
            movementsToShow = current.filter(m => calculateMovementAmount(m, new Set(getVisibleAccounts().map(c => c.id))) < 0);
            break;
        case 'saldoNeto':
            modalTitle = 'Todos los Movimientos del Periodo';
            movementsToShow = current;
            break;
        default:
            hideModal('generic-modal');
            return;
    }

    // ¡USAMOS NUESTRA FUNCIÓN MAESTRA OTRA VEZ!
    if (movementsToShow.length > 0) {
        recalculateAndApplyRunningBalances(movementsToShow, db.cuentas);
    }

    // Y ahora llamamos a la función que muestra la lista.
    showDrillDownModal(modalTitle, movementsToShow);
};
        const handlePinInputInteraction = () => {
            const inputs = Array.from(selectAll('#pin-inputs-container .pin-input'));
            inputs.forEach((input, index) => {
                input.addEventListener('keydown', (e) => {
                    if (e.key >= 0 && e.key <= 9) {
                        inputs[index].value = '';
                        setTimeout(() => {
                           if (index < inputs.length - 1) {
                                inputs[index + 1].focus();
                           } else {
                               handlePinSubmit();
                           }
                        }, 10);
                    } else if (e.key === 'Backspace') {
                        if (index > 0) {
                            setTimeout(() => inputs[index - 1].focus(), 10);
                        }
                    }
                });
            });
        };
    const initApp = async () => {
	SpaceBackgroundEffect.start();	
    const procederConCargaDeApp = () => {
        document.documentElement.lang = 'es';
        setupTheme();
        // Ya no necesitamos cargar tema, el CSS lo fuerza
        attachEventListeners();
        checkAuthState(); 
    };

    procederConCargaDeApp();
};

		window.addEventListener('online', () => {
    console.log("Conexión recuperada. Sincronizando...");
    syncState = 'syncing';
    updateSyncStatusIcon();
    setTimeout(() => {
        syncState = 'synced';
        updateSyncStatusIcon();
    }, 2500);
});

window.addEventListener('offline', () => {
    console.log("Se ha perdido la conexión.");
    syncState = 'error';
    updateSyncStatusIcon();
});
    const startMainApp = async () => {
	const loginScreen = select('login-screen');
    const pinLoginScreen = select('pin-login-screen');
	SpaceBackgroundEffect.stop();	
    const appRoot = select('app-root');
	if (appRoot) appRoot.style.display = 'block';
	if (localStorage.getItem('privacyMode') === 'true') {
    document.body.classList.add('privacy-mode');
	}
    if (loginScreen) loginScreen.classList.remove('login-view--visible');
    if (pinLoginScreen) pinLoginScreen.classList.remove('login-view--visible');
    if (appRoot) appRoot.classList.add('app-layout--visible');
    
    populateAllDropdowns();
    loadConfig();
    
    measureListItemHeights();
    
    updateSyncStatusIcon();
        
    // === ¡LA CORRECCIÓN CLAVE ESTÁ AQUÍ! ===
    navigateTo(PAGE_IDS.PANEL, true); 
    // =====================================

      isInitialLoadComplete = true;
};

        
    const showLoginScreen = () => {
        const loginScreen = select('login-screen');
        const pinLoginScreen = select('pin-login-screen');
        const appRoot = select('app-root');
        if (appRoot) appRoot.classList.remove('app-layout--visible');
        if (pinLoginScreen) pinLoginScreen.classList.remove('login-view--visible');
        if (loginScreen) loginScreen.classList.add('login-view--visible');
    };
	
    const showPasswordFallback = () => {
    hapticFeedback('light');
    const pinScreen = select('pin-login-screen');
    if (!pinScreen) return;

    pinScreen.querySelector('.pin-inputs').classList.add('hidden');
    pinScreen.querySelector('[data-action="use-password-instead"]').parentElement.classList.add('hidden');
    
    pinScreen.querySelector('.login-view__tagline').textContent = 'Introduce tu contraseña para continuar.';
    
    const form = pinScreen.querySelector('form');
    const passwordContainer = document.createElement('div');
    passwordContainer.innerHTML = `
        <div class="form-group form-group--with-icon" style="margin-top: 1.5rem;">
            <span class="material-icons">lock</span>
            <input type="password" id="pin-fallback-password" class="form-input" placeholder="Contraseña" required>
        </div>
        <button type="submit" class="btn btn--primary btn--full" style="margin-top: 1rem;">Verificar</button>
    `;
    form.appendChild(passwordContainer);
    select('pin-fallback-password').focus();

    form.onsubmit = async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        setButtonLoading(btn, true);

        const password = select('pin-fallback-password').value;
        const errorEl = select('pin-error');
        errorEl.textContent = '';

        try {
            const credential = firebase.auth.EmailAuthProvider.credential(currentUser.email, password);
            await currentUser.reauthenticateWithCredential(credential);
            
            startMainApp(); 

        } catch (error) {
            errorEl.textContent = 'Contraseña incorrecta.';
            hapticFeedback('error');
        } finally {
            setButtonLoading(btn, false);
        }
    };
};
         
        const handleLogin = (btn) => {
            const email = (select('login-email')).value.trim(), password = (select('login-password')).value, errEl = select('login-error'); clearAllErrors('login-form'); if(errEl) errEl.textContent = ''; let v = true;
            if (!email) { displayError('login-email', 'El correo es obligatorio.'); v = false; }
            if (!password) { displayError('login-password', 'La contraseña es obligatoria.'); v = false; }
            if (!v) return; setButtonLoading(btn, true, 'Iniciando...');
            fbAuth.signInWithEmailAndPassword(email, password).then(() => showToast(`¡Bienvenido/a de nuevo!`)).catch((err) => { setButtonLoading(btn, false); if (['auth/wrong-password', 'auth/user-not-found', 'auth/invalid-credential'].includes(err.code)) (errEl).textContent = 'Error: Credenciales incorrectas.'; else if (err.code === 'auth/invalid-email') displayError('login-email', 'Formato de correo no válido.'); else (errEl).textContent = 'Error al iniciar sesión.'; });
        };
        const handleRegister = (btn) => {
            const email = (select('login-email')).value.trim(), password = (select('login-password')).value, errEl = select('login-error'); clearAllErrors('login-form'); if(errEl) errEl.textContent = ''; let v = true;
            if (!email) { displayError('login-email', 'El correo es obligatorio.'); v = false; }
            if (password.length < 6) { displayError('login-password', 'La contraseña debe tener al menos 6 caracteres.'); v = false; }
            if (!v) return; setButtonLoading(btn, true, 'Registrando...');
            fbAuth.createUserWithEmailAndPassword(email, password).then(() => showToast(`¡Registro completado!`)).catch((err) => { setButtonLoading(btn, false); if (err.code == 'auth/weak-password') displayError('login-password', 'La contraseña debe tener al menos 6 caracteres.'); else if (err.code == 'auth/email-already-in-use') displayError('login-email', 'El correo ya está registrado.'); else if (err.code === 'auth/invalid-email') displayError('login-email', 'Formato de correo no válido.'); else (errEl).textContent = 'Error en el registro.'; });
        };
        const handleExitApp = () => {
            const exitScreen = select('exit-screen');
            const appRoot = select('app-root');

            if (exitScreen) {
                exitScreen.style.display = 'flex';
                setTimeout(() => exitScreen.style.opacity = '1', 50);

                if (isInitialLoadComplete && appRoot) {
                    appRoot.classList.add('app-layout--transformed-by-modal');
                }
            }
        };
        const destroyAllCharts = () => {
    // Lista completa de TODAS las instancias de Chart.js en tu app
    const chartInstances = [
        conceptosChart, liquidAssetsChart, detailInvestmentChart, 
        informesChart, assetAllocationChart, budgetTrendChart, 
        netWorthChart, informeActivoChart
    ];

    // 1. Destruir instancias conocidas
    chartInstances.forEach(chart => {
        if (chart) {
            try {
                chart.destroy();
            } catch (e) { console.warn("Error destruyendo gráfico:", e); }
        }
    });

    // 2. Resetear variables a null para evitar referencias muertas
    conceptosChart = null;
    liquidAssetsChart = null;
    detailInvestmentChart = null;
    informesChart = null;
    assetAllocationChart = null;
    budgetTrendChart = null;
    netWorthChart = null;
    informeActivoChart = null;
   
    // 3. (AFINADO EXTRA) Buscar cualquier canvas que Chart.js crea que controla y limpiarlo
    // Esto arregla casos donde la variable se perdió pero el Chart sigue vivo en el DOM.
    Chart.helpers.each(Chart.instances, (instance) => {
        if (instance) instance.destroy();
    });
};

const setupTheme = () => { 
    const textColor = '#FFFFFF';
    
    // Configuración Base
    Chart.defaults.color = textColor; 
    Chart.defaults.borderColor = 'transparent'; // Quitamos bordes de contenedores
    
    // Registramos el plugin solo si está disponible
    if (typeof ChartDataLabels !== 'undefined') {
        Chart.register(ChartDataLabels);
    }

    // --- CORRECCIÓN DEL ERROR: Inicialización segura ---
    
    // 1. Asegurar configuración de escala base (si la librería la usa)
    if (!Chart.defaults.scale) Chart.defaults.scale = {};
    if (!Chart.defaults.scale.grid) Chart.defaults.scale.grid = {};
    if (!Chart.defaults.scale.ticks) Chart.defaults.scale.ticks = {};

    Chart.defaults.scale.grid.display = false;      
    Chart.defaults.scale.grid.drawBorder = false;   
    Chart.defaults.scale.ticks.display = false;     
    
    // 2. Asegurar configuración de escalas cartesianas (Eje X)
    if (!Chart.defaults.scales) Chart.defaults.scales = {};
    if (!Chart.defaults.scales.x) Chart.defaults.scales.x = {};
    if (!Chart.defaults.scales.x.ticks) Chart.defaults.scales.x.ticks = {};
    
    // Ahora es seguro asignar las propiedades
    Chart.defaults.scales.x.ticks.display = true;   
    Chart.defaults.scales.x.ticks.color = 'rgba(255, 255, 255, 0.5)'; 
    
    // 3. Quitar puntos en las líneas
    if (!Chart.defaults.elements.point) Chart.defaults.elements.point = {};
    Chart.defaults.elements.point.radius = 0;
    Chart.defaults.elements.point.hitRadius = 10; 
};

const cleanupObservers = () => {
    // Solo limpiamos el observador de movimientos (scroll infinito del diario)
    if (movementsObserver) {
        movementsObserver.disconnect();
        movementsObserver = null;
    }
};
const navigateTo = async (pageId, isInitial = false) => {
    cleanupObservers();
    const oldView = document.querySelector('.view--active');
    const newView = select(pageId);
    const mainScroller = selectOne('.app-layout__main');

    const menu = select('main-menu-popover');
    if (menu) menu.classList.remove('popover-menu--visible');

    // 1. Guardar scroll
    if (oldView && mainScroller) {
        pageScrollPositions[oldView.id] = mainScroller.scrollTop;
    }

    if (!newView || (oldView && oldView.id === pageId)) return;
    
    destroyAllCharts();
    if (!isInitial) hapticFeedback('light');

    if (!isInitial && window.history.state?.page !== pageId) {
        history.pushState({ page: pageId }, '', `#${pageId}`);
    }

    // Nav Inferior
    const navItems = Array.from(selectAll('.bottom-nav__item'));
    const oldIndex = oldView ? navItems.findIndex(item => item.dataset.page === oldView.id) : -1;
    const newIndex = navItems.findIndex(item => item.dataset.page === newView.id);
    const isForward = newIndex > oldIndex;

    // --- CORRECCIÓN CRÍTICA AQUÍ ---
    // En lugar de intentar inyectar HTML, simplemente mostramos/ocultamos 
    // el bloque de herramientas que ya tienes en tu HTML (id="header-diario-tools")
    const diarioTools = document.getElementById('header-diario-tools');
    if (diarioTools) {
        if (pageId === PAGE_IDS.DIARIO) {
            diarioTools.style.display = 'flex'; // Mostrar en Diario
        } else {
            diarioTools.style.display = 'none'; // Ocultar en el resto
        }
    }
    // -------------------------------

    const pageRenderers = {
        [PAGE_IDS.PANEL]: { title: 'Panel', render: renderPanelPage },
        [PAGE_IDS.DIARIO]: { title: 'Diario', render: renderDiarioPage },
        [PAGE_IDS.PLANIFICAR]: { title: 'Planificar', render: renderPlanificacionPage },
        [PAGE_IDS.AJUSTES]: { title: 'Ajustes', render: renderAjustesPage },
    };

    if (pageRenderers[pageId]) {
        // Actualizar el Título
        const titleEl = document.getElementById('page-title-display');
        if (titleEl) {
            const rawTitle = pageRenderers[pageId].title;
            titleEl.textContent = (pageId === PAGE_IDS.PANEL || pageId === PAGE_IDS.DIARIO) ? '' : rawTitle;
        }
        
        // Renderizar la página
        await pageRenderers[pageId].render();

        /* ======================================================== */
        /* === FIX ONEPLUS NORD 4: FORZAR MÁRGENES (10px) === */
        /* ======================================================== */
        if (pageId === PAGE_IDS.PANEL) {
            const panel = document.getElementById(PAGE_IDS.PANEL);
            if (panel) {
                // Inyectamos estilo en línea con Prioridad Militar (!important)
                panel.style.cssText = `
                    padding-left: 10px !important;
                    padding-right: 10px !important;
                    box-sizing: border-box !important;
                    width: 100% !important;
                    max-width: 100vw !important;
                    overflow-x: hidden !important;
                `;
            }
        }
        /* ======================================================== */
    }
    
    // Animaciones y Clases
    selectAll('.bottom-nav__item').forEach(b => b.classList.toggle('bottom-nav__item--active', b.dataset.page === newView.id));
    newView.classList.add('view--active'); 
    if (oldView && !isInitial) {
        const outClass = isForward ? 'view-transition-out-forward' : 'view-transition-out-backward';
        const inClass = isForward ? 'view-transition-in-forward' : 'view-transition-in-backward';
        newView.classList.add(inClass);
        oldView.classList.add(outClass);
        oldView.addEventListener('animationend', () => {
            oldView.classList.remove('view--active', outClass);
            newView.classList.remove(inClass);
        }, { once: true });
    } else if (oldView) {
        oldView.classList.remove('view--active');
    }

    // Restaurar Scroll
    if (mainScroller) {
        const targetScroll = pageScrollPositions[pageId] || 0;
        mainScroller.scrollTop = targetScroll;
        if (pageId === PAGE_IDS.DIARIO && diarioViewMode === 'list') {
            requestAnimationFrame(() => {
                mainScroller.scrollTop = targetScroll; 
                renderVisibleItems(); 
            });
        }
    }

    if (pageId === PAGE_IDS.PANEL) {
        scheduleDashboardUpdate();
    }
};

const getPendingRecurrents = () => {
    const now = new Date();
    // Creamos "hoy" en UTC a las 00:00 para una comparación precisa y justa.
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    
    return (db.recurrentes || [])
        .filter(r => {
            const nextDate = parseDateStringAsUTC(r.nextDate);
            if (!nextDate) return false;

            // ¡LA CORRECCIÓN CLAVE! Normalizamos la fecha del recurrente a las 00:00 UTC
            // para compararla directamente con "today".
            const normalizedNextDate = new Date(Date.UTC(nextDate.getUTCFullYear(), nextDate.getUTCMonth(), nextDate.getUTCDate()));
            
            // Si la fecha programada es hoy o anterior, está pendiente.
            if (normalizedNextDate > today) {
                return false;
            }
            
            if (r.endDate) {
                const endDate = parseDateStringAsUTC(r.endDate);
                if (endDate && today > endDate) {
                    return false;
                }
            }
            
            return true;
        })
        .sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate));
};

		
// =================================================================
// === BLOQUE DE FUNCIONES DE CUENTAS (CORREGIDO Y UNIFICADO) ===
// =================================================================

const getVisibleAccounts = () => {
    return (db.cuentas || []).filter(c => {
        // Lógica de compatibilidad:
        // 1. Si la cuenta tiene la propiedad 'ledger', usamos eso.
        // 2. Si no, miramos 'offBalance': true -> 'B', false -> 'A'.
        const accountLedger = c.ledger || (c.offBalance ? 'B' : 'A');
        const badgeColor = accountLedger === 'A' ? 'var(--c-primary)' : (accountLedger === 'B' ? 'var(--c-danger)' : 'var(--c-success)');
        return accountLedger === currentLedger;
    });
};
/**
 * Obtiene las cuentas líquidas de la contabilidad visible actual.
 */
const getLiquidAccounts = () => {
    const visibleAccounts = getVisibleAccounts();
    return visibleAccounts.filter((c) => {
        const tipo = (c.tipo || '').trim().toUpperCase();
        // Incluir BANCOS, EFECTIVO y TARJETA
        return ['BANCO', 'EFECTIVO', 'TARJETA'].includes(tipo);
    });
};

/**
 * Obtiene los saldos de TODAS las cuentas, sin importar la contabilidad.
 * Es usado por el sistema de cálculo de saldos acumulados.
 */
const getAllSaldos = () => {
    const saldos = {};
    (db.cuentas || []).forEach(cuenta => {
        saldos[cuenta.id] = cuenta.saldo || 0;
    });
    return saldos;
};
          
        const getSaldos = async () => {
            const visibleAccounts = getVisibleAccounts();
            const saldos = {};
            visibleAccounts.forEach(cuenta => {
                saldos[cuenta.id] = cuenta.saldo || 0;
            });
            return saldos;
        };
		

const getValorMercadoInversiones = async () => {
    if (!dataLoaded.inversiones) await loadInversiones();
    
    // ← CORREGIR ESTA LÍNEA
    const investmentAccounts = getVisibleAccounts().filter(c => c.esInversion);
    
    let valorMercadoTotal = 0;
    
    for (const cuenta of investmentAccounts) {
        const valoraciones = (db.inversiones_historial || [])
            .filter(v => v.cuentaId === cuenta.id)
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        
        const valorActual = valoraciones.length > 0 ? valoraciones[0].valor : 0;
        valorMercadoTotal += valorActual;
    }
    
    return valorMercadoTotal;
};
 const forcePanelRecalculation = async () => {
    const panelPage = select(PAGE_IDS.PANEL);
    if (!panelPage?.classList.contains('view--active')) return;
    
    console.log("Forzando recálculo del panel para contabilidad", isOffBalanceMode ? "B" : "A");
    
    // 1. Limpiar skeletons (quitar efecto de carga)
    const skeletons = panelPage.querySelectorAll('.skeleton');
    skeletons.forEach(s => {
        s.classList.remove('skeleton');
        s.style.backgroundImage = 'none';
    });
    
    // 2. Forzar recálculo de todos los widgets
    await scheduleDashboardUpdate();
    
    // 3. Recalcular específicamente los KPIs del panel
    try {
        // Calcular patrimonio neto con las cuentas visibles
        const saldos = await getSaldos();
        const patrimonioNeto = Object.values(saldos).reduce((sum, s) => sum + s, 0);
        
        // Calcular valor de mercado de inversiones
        const valorMercadoInversiones = await getValorMercadoInversiones();
        
        // Calcular liquidez
        const cuentasLiquidas = getLiquidAccounts();
        const liquidezTotal = cuentasLiquidas.reduce((sum, c) => sum + (c.saldo || 0), 0);
        
        // Actualizar UI directamente
        const patrimonioEl = select('kpi-patrimonio-neto-value');
        const liquidezEl = select('kpi-liquidez-value');
        const inversionEl = select('kpi-inversion-total');
        
        if (patrimonioEl) {
            patrimonioEl.textContent = formatCurrency(patrimonioNeto);
            patrimonioEl.dataset.currentValue = String(patrimonioNeto / 100);
        }
        if (liquidezEl) liquidezEl.textContent = formatCurrency(liquidezTotal);
        if (inversionEl) inversionEl.textContent = formatCurrency(valorMercadoInversiones);
        
    } catch (error) {
        console.error("Error en forcePanelRecalculation:", error);
    }
};   
/* =============================================================== */
/* === FIX CÁLCULO FECHAS: INICIO (00:00) A FIN (23:59) REAL === */
/* =============================================================== */
const getFilteredMovements = async (forComparison = false) => {
    // 1. OBTENER FECHAS DEL FILTRO
    const filterPeriodo = select('filter-periodo');
    const p = filterPeriodo ? filterPeriodo.value : 'mes-actual';
    let sDate, eDate, prevSDate, prevEDate;
    
    // Usamos la fecha actual local como referencia
    const now = new Date(); 

    // Helper para crear fechas locales (Año, Mes, Día, Hora, Min, Seg)
    // Mes en JS va de 0 a 11 (Enero=0)
    const getLocalStartOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
    const getLocalEndOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

    switch (p) {
        case 'mes-actual':
            // Desde el día 1 del mes actual a las 00:00
            sDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
            // Hasta el día 0 del mes siguiente (último día de este mes) a las 23:59
            eDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
            
            // Para comparación (Mes anterior)
            prevSDate = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
            prevEDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
            break;

        case 'año-actual':
            sDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
            eDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
            
            prevSDate = new Date(now.getFullYear() - 1, 0, 1, 0, 0, 0, 0);
            prevEDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
            break;

        case 'custom':
            const startInput = select('filter-fecha-inicio');
            const endInput = select('filter-fecha-fin');
            
            // Lógica robusta para Inputs de tipo Date (YYYY-MM-DD)
            if (startInput && startInput.value) {
                const [y, m, d] = startInput.value.split('-').map(Number);
                sDate = new Date(y, m - 1, d, 0, 0, 0, 0);
            }
            
            if (endInput && endInput.value) {
                const [y, m, d] = endInput.value.split('-').map(Number);
                eDate = new Date(y, m - 1, d, 23, 59, 59, 999);
            }
            
            // En modo custom no calculamos comparación automática compleja
            prevSDate = null; 
            prevEDate = null; 
            break;

        default:
            return { current: [], previous: [], label: '' };
    }

    if (!sDate || !eDate) return { current: [], previous: [], label: '' };

    // 2. CONSULTAR A LA BASE DE DATOS (Usando ISOString para convertir a UTC correctamente)
    const fetchMovementsForRange = async (start, end) => {
        if (!start || !end) return [];

        const snapshot = await fbDb.collection('users').doc(currentUser.uid).collection('movimientos')
            .where('fecha', '>=', start.toISOString())
            .where('fecha', '<=', end.toISOString())
            .get();
        return snapshot.docs.map(doc => doc.data());
    };

    // 3. OBTENER Y FILTRAR POR CONTABILIDAD (Caja A / B / C)
    const visibleAccountIds = new Set(getVisibleAccounts().map(c => c.id));
    
    const filterByLedger = (movs) => movs.filter(m => {
        if (m.tipo === 'traspaso') {
            return visibleAccountIds.has(m.cuentaOrigenId) || visibleAccountIds.has(m.cuentaDestinoId);
        }
        return visibleAccountIds.has(m.cuentaId);
    });

    const currentMovsRaw = await fetchMovementsForRange(sDate, eDate);
    const currentMovs = filterByLedger(currentMovsRaw);

    if (!forComparison) return { current: currentMovs, previous: [], label: '' };
    
    // Solo buscamos previos si es necesario
    let prevMovs = [];
    if (prevSDate && prevEDate) {
        const prevMovsRaw = await fetchMovementsForRange(prevSDate, prevEDate);
        prevMovs = filterByLedger(prevMovsRaw);
    }

    const comparisonLabel = p === 'mes-actual' ? 'vs mes ant.' : (p === 'año-actual' ? 'vs año ant.' : '');
    
    return { current: currentMovs, previous: prevMovs, label: comparisonLabel };
};
		
const calculatePortfolioPerformance = async (cuentaId = null) => {
    // 1. Carga de datos (igual que antes)
    const allMovements = await AppStore.getAll();
    
    if (!dataLoaded.inversiones) await loadInversiones();

    const allInvestmentAccounts = getVisibleAccounts().filter(c => c.esInversion);
    const investmentAccounts = cuentaId ? allInvestmentAccounts.filter(c => c.id === cuentaId) : allInvestmentAccounts;
    
    if (investmentAccounts.length === 0) {
        return { valorActual: 0, capitalInvertido: 0, pnlAbsoluto: 0, pnlPorcentual: 0, irr: 0, daysActive: 0, pnlYTD: 0, lastUpdate: null };
    }
    
    let totalValorActual = 0;
    let totalCapitalInvertido_para_PNL = 0;
    let totalPnlYTD = 0; // NUEVO: Acumulador para YTD
    let allIrrCashflows = [];
    let firstMovementDate = new Date();
    let mostRecentValuationDate = 0; // NUEVO: Para detectar datos obsoletos

    // Fechas para cálculo YTD
    const startOfYear = new Date(new Date().getFullYear(), 0, 1); // 1 de Enero de este año

    for (const cuenta of investmentAccounts) {
        // --- LÓGICA HISTÓRICA (Existente) ---
        const valoraciones = (db.inversiones_historial || [])
            .filter(v => v.cuentaId === cuenta.id)
            .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        
        const valorActual = valoraciones.length > 0 ? valoraciones[0].valor : 0;
        const capitalInvertido_para_PNL = cuenta.saldo || 0;
        
        // NUEVO: Capturamos la fecha más reciente
        if (valoraciones.length > 0) {
            const valDate = new Date(valoraciones[0].fecha).getTime();
            if (valDate > mostRecentValuationDate) mostRecentValuationDate = valDate;
        }

        totalValorActual += valorActual;
        totalCapitalInvertido_para_PNL += capitalInvertido_para_PNL;

        // --- LÓGICA YTD (NUEVA) ---
        // 1. Buscamos el valor que tenía el activo al inicio del año (o la primera valoración del año)
        // Si no hay valoración previa a este año, asumimos 0 o el primer movimiento del año.
        const valorInicioAno = valoraciones.find(v => new Date(v.fecha) <= startOfYear)?.valor || 0;
        
        // 2. Sumamos los flujos de caja (aportaciones netas) de ESTE AÑO
        const accountMovementsThisYear = allMovements.filter(m => 
            new Date(m.fecha) >= startOfYear &&
            ((m.tipo === 'movimiento' && m.cuentaId === cuenta.id) ||
            (m.tipo === 'traspaso' && (m.cuentaDestinoId === cuenta.id || m.cuentaOrigenId === cuenta.id)))
        );

        let netFlowsYTD = 0;
        accountMovementsThisYear.forEach(m => {
            if (m.tipo === 'movimiento') netFlowsYTD += m.cantidad;
            else if (m.tipo === 'traspaso') {
                if (m.cuentaDestinoId === cuenta.id) netFlowsYTD += m.cantidad; // Aportación
                else if (m.cuentaOrigenId === cuenta.id) netFlowsYTD -= m.cantidad; // Retirada
            }
        });

        // Fórmula P&L YTD: Valor Hoy - (Valor Inicio Año + Lo que he metido este año)
        // Si metí 1000€ y hoy vale 1100€, gané 100€.
        const pnlYTD = valorActual - (valorInicioAno + netFlowsYTD);
        totalPnlYTD += pnlYTD;

        // --- PREPARACIÓN TIR (Existente) ---
        const accountMovements = allMovements.filter(m => 
            (m.tipo === 'movimiento' && m.cuentaId === cuenta.id) ||
            (m.tipo === 'traspaso' && (m.cuentaDestinoId === cuenta.id || m.cuentaOrigenId === cuenta.id))
        );

        if (accountMovements.length > 0) {
            const firstInAcc = accountMovements.reduce((oldest, current) => new Date(current.fecha) < new Date(oldest.fecha) ? current : oldest);
            const mDate = new Date(firstInAcc.fecha);
            if (mDate < firstMovementDate) firstMovementDate = mDate;
        }

        const irrCashflows = accountMovements.map(mov => {
            let effectOnAccount = 0;
            if (mov.tipo === 'movimiento') effectOnAccount = mov.cantidad;
            else if (mov.tipo === 'traspaso') {
                if (mov.cuentaDestinoId === cuenta.id) effectOnAccount = mov.cantidad;
                else if (mov.cuentaOrigenId === cuenta.id) effectOnAccount = -mov.cantidad;
            }
            if (effectOnAccount !== 0) return { amount: -effectOnAccount, date: new Date(mov.fecha) };
            return null;
        }).filter(cf => cf !== null);

        if (valorActual !== 0) irrCashflows.push({ amount: valorActual, date: new Date() });
        allIrrCashflows.push(...irrCashflows);
    }

    const pnlAbsoluto = totalValorActual - totalCapitalInvertido_para_PNL;
    const pnlPorcentual = totalCapitalInvertido_para_PNL !== 0 ? (pnlAbsoluto / totalCapitalInvertido_para_PNL) * 100 : 0;
    const irr = calculateIRR(allIrrCashflows);
    const daysActive = (new Date() - firstMovementDate) / (1000 * 60 * 60 * 24);

    return { 
        valorActual: totalValorActual, 
        capitalInvertido: totalCapitalInvertido_para_PNL,
        pnlAbsoluto, 
        pnlPorcentual, 
        pnlYTD: totalPnlYTD, // Dato Nuevo
        irr,
        daysActive,
        lastUpdate: mostRecentValuationDate // Dato Nuevo
    };
};

    const recalculateAndApplyRunningBalances = (movements, allAccountsDb) => {
    // 1. Agrupamos los movimientos por cada cuenta afectada.
    const movementsByAccount = {};
    movements.forEach(mov => {
        if (mov.tipo === 'traspaso') {
            if (!movementsByAccount[mov.cuentaOrigenId]) movementsByAccount[mov.cuentaOrigenId] = [];
            if (!movementsByAccount[mov.cuentaDestinoId]) movementsByAccount[mov.cuentaDestinoId] = [];
            movementsByAccount[mov.cuentaOrigenId].push(mov);
            movementsByAccount[mov.cuentaDestinoId].push(mov);
        } else {
            if (!movementsByAccount[mov.cuentaId]) movementsByAccount[mov.cuentaId] = [];
            movementsByAccount[mov.cuentaId].push(mov);
        }
    });

    // 2. Para cada cuenta, calculamos su historial de saldos.
    for (const cuentaId in movementsByAccount) {
        const cuenta = allAccountsDb.find(c => c.id === cuentaId);
        if (!cuenta) continue; // Si la cuenta no existe, la ignoramos.

        // Nuestra "Verdad Absoluta": el saldo real y actual de la cuenta.
        let runningBalance = cuenta.saldo || 0;

        const accountMovements = movementsByAccount[cuentaId];
        
        // La ordenación infalible: primero por fecha/hora, luego por ID. El más reciente, primero.
        accountMovements.sort((a, b) => {
            const dateComparison = new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
            if (dateComparison !== 0) return dateComparison;
            return b.id.localeCompare(a.id);
        });

        // 3. Recorremos los movimientos HACIA ATRÁS en el tiempo.
        for (const mov of accountMovements) {
            // Asignamos el saldo actual a la propiedad correcta.
            if (mov.tipo === 'traspaso') {
                if (mov.cuentaOrigenId === cuentaId) mov.runningBalanceOrigen = runningBalance;
                if (mov.cuentaDestinoId === cuentaId) mov.runningBalanceDestino = runningBalance;
            } else {
                mov.runningBalance = runningBalance;
            }

            // "Deshacemos" la operación para calcular el saldo ANTERIOR.
            if (mov.tipo === 'traspaso') {
                if (mov.cuentaOrigenId === cuentaId) runningBalance += mov.cantidad;
                if (mov.cuentaDestinoId === cuentaId) runningBalance -= mov.cantidad;
            } else {
                runningBalance -= mov.cantidad;
            }
        }
    }
};
             const processMovementsForRunningBalance = async (movements, forceRecalculate = false) => {
            if (!runningBalancesCache || forceRecalculate) {
                runningBalancesCache = getAllSaldos();
            }

            const sortedMovements = [...movements].sort((a, b) => {
        const dateComparison = new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
        if (dateComparison !== 0) return dateComparison;
        // El ID del documento como desempate final garantiza el orden.
        return b.id.localeCompare(a.id); 
    });

            for (const mov of sortedMovements) {
                if (mov.tipo === 'traspaso') {
                    if (!runningBalancesCache.hasOwnProperty(mov.cuentaOrigenId)) {
                        runningBalancesCache[mov.cuentaOrigenId] = 0;
                    }
                    if (!runningBalancesCache.hasOwnProperty(mov.cuentaDestinoId)) {
                        runningBalancesCache[mov.cuentaDestinoId] = 0;
                    }

                    mov.runningBalanceOrigen = runningBalancesCache[mov.cuentaOrigenId];
                    mov.runningBalanceDestino = runningBalancesCache[mov.cuentaDestinoId];

                    runningBalancesCache[mov.cuentaOrigenId] += mov.cantidad;
                    runningBalancesCache[mov.cuentaDestinoId] -= mov.cantidad;

                } else {
                    if (!runningBalancesCache.hasOwnProperty(mov.cuentaId)) {
                        runningBalancesCache[mov.cuentaId] = 0;
                    }

                    mov.runningBalance = runningBalancesCache[mov.cuentaId];
                    runningBalancesCache[mov.cuentaId] -= mov.cantidad;
                }
            }
        };
        
    const populateAllDropdowns = () => {
    const visibleAccounts = getVisibleAccounts();
    
    // Función interna para poblar un <select> con datos.
    const populate = (id, data, nameKey, valKey = 'id', all = false, none = false) => {
        const el = select(id);
        if (!el) return;
        const currentVal = el.value;
        let opts = all ? '<option value="">Todos</option>' : '';
        if (none) opts += '<option value="">Ninguno</option>';
        
        [...data]
            .sort((a, b) => (a[nameKey] || "").localeCompare(b[nameKey] || ""))
            .forEach(i => opts += `<option value="${i[valKey]}">${i[nameKey]}</option>`);
        
        el.innerHTML = opts;
        const optionsArray = Array.from(el.options);
        el.value = optionsArray.some(o => o.value === currentVal) ? currentVal : (optionsArray.length > 0 ? optionsArray[0].value : "");
    };
    
    populate('movimiento-cuenta', visibleAccounts, 'nombre', 'id', false, true);
    populate('movimiento-concepto', db.conceptos, 'nombre', 'id', false, true);
    populate('movimiento-cuenta-origen', visibleAccounts, 'nombre', 'id', false, true);
    populate('movimiento-cuenta-destino', visibleAccounts, 'nombre', 'id', false, true);
    // ... cualquier otra llamada a 'populate' que tengas se mantiene aquí ...

    // --- ¡AQUÍ ESTÁ LA MAGIA! ---
    // Transformamos los selects del formulario en componentes personalizados.
    setTimeout(() => {
        createCustomSelect(select('movimiento-concepto'));
        createCustomSelect(select('movimiento-cuenta'));
        createCustomSelect(select('movimiento-cuenta-origen'));
        createCustomSelect(select('movimiento-cuenta-destino'));
    }, 0);
};

        const populateTraspasoDropdowns = () => {
            const traspasoToggle = select('traspaso-show-all-accounts-toggle');
            const showAll = traspasoToggle ? traspasoToggle.checked : false;
            const accountsToList = showAll ? (db.cuentas || []) : getVisibleAccounts();
            
            const populate = (id, data, none = false) => {
                const el = select(id); if (!el) return;
                const currentVal = el.value;
                let opts = none ? '<option value="">Ninguno</option>' : '';
                data.sort((a,b) => a.nombre.localeCompare(b.nombre)).forEach(i => opts += `<option value="${i.id}">${i.nombre}</option>`);
                el.innerHTML = opts;
                const optionsArray = Array.from(el.options);
                if (optionsArray.some(o => o.value === currentVal)) {
                    el.value = currentVal;
                } else {
                    el.value = optionsArray.length > 0 ? optionsArray[0].value : "";
                }
            };

            populate('movimiento-cuenta-origen', accountsToList, true);
            populate('movimiento-cuenta-destino', accountsToList, true);
        };
        
               
        const handleUpdateBudgets = () => {
    hapticFeedback('light');

    const initialHtml = `
        <div class="form-group" style="margin-bottom: var(--sp-4);">
            <label for="budget-year-selector-modal" class="form-label">Selecciona el año para gestionar:</label>
            <select id="budget-year-selector-modal" class="form-select"></select>
        </div>
        <div id="budgets-form-container">
            <div class="empty-state" style="background:transparent; border:none; padding-top:0;">
                <p>Selecciona un año para empezar.</p>
            </div>
        </div>`;
    showGenericModal('Gestionar Presupuestos Anuales', initialHtml);

    const renderYearForm = (year) => {
        const container = select('budgets-form-container');
        if (!container) return;

        const budgetsForYear = (db.presupuestos || []).filter(p => p.ano === year);
        const conceptsWithBudget = new Set(budgetsForYear.map(b => b.conceptoId));

        let formHtml = `<form id="update-budgets-form" novalidate>
            <p class="form-label" style="margin-bottom: var(--sp-3)">
                Introduce el límite anual. Usa <b>valores positivos para metas de ingreso</b> y <b>valores negativos para límites de gasto</b>. Deja en blanco o en 0 si no quieres presupuestar un concepto.
            </p>
            <div style="max-height: 45vh; overflow-y: auto; padding-right: var(--sp-2);">`;

        db.conceptos
            .sort((a, b) => a.nombre.localeCompare(b.nombre))
            .forEach(c => {
                const budget = budgetsForYear.find(b => b.ano === year && b.conceptoId === c.id);
                const currentAmount = budget ? (budget.cantidad / 100).toFixed(2).replace('.', ',') : '';
                const placeholder = conceptsWithBudget.has(c.id) ? '' : '0,00';
                formHtml += `
                    <div class="form-group">
                        <label for="budget-input-${c.id}" class="form-label" style="font-weight: 600;">${c.nombre}</label>
                        <input type="text" id="budget-input-${c.id}" data-concept-id="${c.id}" class="form-input" inputmode="decimal" value="${currentAmount}" placeholder="${placeholder}">
                    </div>`;
            });
        
        formHtml += `</div><div class="modal__actions"><button type="submit" class="btn btn--primary btn--full">Guardar Cambios para ${year}</button></div></form>`;
        container.innerHTML = formHtml;
        
        const updateBudgetsForm = select('update-budgets-form');
        if (updateBudgetsForm) {
            updateBudgetsForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = e.target.querySelector('button[type="submit"]');
                setButtonLoading(btn, true, 'Guardando...');

                const inputs = e.target.querySelectorAll('input[data-concept-id]');
                const batch = fbDb.batch();

                for (const input of inputs) {
                    const conceptoId = input.dataset.conceptId;
                    const amountValue = parseCurrencyString(input.value);
                    
                    if (isNaN(amountValue)) continue;

                    const newAmountInCentimos = Math.round(amountValue * 100);
                    let budget = (db.presupuestos || []).find(b => b.ano === year && b.conceptoId === conceptoId);
                    
                    if (budget) {
                        const ref = fbDb.collection('users').doc(currentUser.uid).collection('presupuestos').doc(budget.id);
                        if (newAmountInCentimos !== 0) {
                            batch.update(ref, { cantidad: newAmountInCentimos });
                        } else {
                            batch.delete(ref);
                        }
                    } else if (newAmountInCentimos !== 0) {
                        const newId = generateId();
                        const ref = fbDb.collection('users').doc(currentUser.uid).collection('presupuestos').doc(newId);
                        batch.set(ref, { id: newId, ano: year, conceptoId: conceptoId, cantidad: newAmountInCentimos });
                    }
                }

                await batch.commit();
                setButtonLoading(btn, false);
                hideModal('generic-modal');
                hapticFeedback('success');
                showToast(`Presupuestos de ${year} actualizados.`);
                              
            });
        }
    };

    setTimeout(() => {
        const yearSelect = select('budget-year-selector-modal');
        if (!yearSelect) return;
        
        const currentYear = new Date().getFullYear();
        let years = new Set([currentYear, currentYear + 1]);
        (db.presupuestos || []).forEach(p => years.add(p.ano));
        
        yearSelect.innerHTML = `<option value="">Seleccionar...</option>` + 
            [...years].sort((a, b) => b - a).map(y => `<option value="${y}">${y}</option>`).join('');
        
        yearSelect.addEventListener('change', (e) => {
            const selectedYear = parseInt(e.target.value, 10);
            if (selectedYear) {
                renderYearForm(selectedYear);
            } else {
                const container = select('budgets-form-container');
                if (container) container.innerHTML = `<div class="empty-state" style="background:transparent; border:none; padding-top:0;"><p>Selecciona un año para empezar.</p></div>`;
            }
        });
    }, 0);
};

const getYearProgress = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const year = now.getFullYear();
    const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const totalDaysInYear = isLeap ? 366 : 365;

    return {
        percentage: (dayOfYear / totalDaysInYear) * 100,
        daysPassed: dayOfYear,
        daysRemaining: totalDaysInYear - dayOfYear,
        totalDaysInYear: totalDaysInYear
    };
};

const renderGaugeChart = (canvasId, percentageConsumed, yearProgressPercentage) => {
    const canvas = select(canvasId);
    const ctx = canvas ? canvas.getContext('2d') : null;
    if (!ctx) return;

    if (Chart.getChart(canvasId)) {
        Chart.getChart(canvasId).destroy();
    }

    const isAheadOfPace = percentageConsumed > yearProgressPercentage;
    
    const spentColor = isAheadOfPace ? 'var(--c-danger)' : 'var(--c-primary)';
    const remainingColor = 'var(--c-surface-variant)';

    const data = {
        datasets: [{
            data: [
                Math.min(percentageConsumed, 100),
                Math.max(0, 100 - Math.min(percentageConsumed, 100))
            ],
            backgroundColor: [spentColor, remainingColor],
            borderColor: 'var(--c-surface)',
            borderWidth: 2,
        }]
    };
    
    const paceLinePlugin = {
        id: 'paceLine',
        afterDraw: chart => {
            const { ctx, chartArea } = chart;
            const angle = Math.PI + (Math.PI * yearProgressPercentage / 100);
            const cx = (chartArea.left + chartArea.right) / 2;
            const cy = (chartArea.top + chartArea.bottom) / 2 + 15;
            const radius = chart.outerRadius;

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + radius * Math.sin(angle), cy + radius * Math.cos(angle));
            ctx.strokeStyle = 'var(--c-success)';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.restore();
        }
    };

    new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            rotation: -90,
            circumference: 180,
            cutout: '70%',
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false },
                datalabels: { display: false }
            }
        },
        plugins: [paceLinePlugin]
    });
};        


const handleToggleInvestmentTypeFilter = (type) => {
    hapticFeedback('light');
    if (deselectedInvestmentTypesFilter.has(type)) {
        deselectedInvestmentTypesFilter.delete(type);
    } else {
        deselectedInvestmentTypesFilter.add(type);
    }

    // ANTES: renderPatrimonioPage(); (o la función inexistente que corregimos antes)
    // AHORA (Correcto): Llamamos a las dos funciones que dependen de este filtro.
    renderPortfolioMainContent('portfolio-main-content');
    renderPortfolioEvolutionChart('portfolio-evolution-container');
};

/* ================================================================= */
/* === FUNCIÓN MAESTRA PORTAFOLIO: GRÁFICOS + LISTA + FECHAS === */
/* ================================================================= */
const renderPortfolioMainContent = async (targetContainerId) => {
    const container = document.getElementById(targetContainerId);
    if (!container) return;

    // 1. Filtrar cuentas de inversión
    const investmentAccounts = getVisibleAccounts().filter((c) => c.esInversion);
    const CHART_COLORS = ['#007AFF', '#30D158', '#FFD60A', '#FF3B30', '#C084FC', '#4ECDC4', '#EF626C', '#A8D58A'];

    // CASO VACÍO: Si no hay cuentas
    if (investmentAccounts.length === 0) {
        container.innerHTML = `<div id="empty-investments" class="empty-state" style="margin-top: 0; border: none; background: transparent;"><span class="material-icons">rocket_launch</span><h3>Tu Portafolio empieza aquí</h3><p>Ve a 'Ajustes' > 'Cuentas' y marca una cuenta como 'de inversión'.</p></div>`;
        return;
    }

    // 2. Calcular Rendimiento de cada cuenta
    const performanceData = await Promise.all(
        investmentAccounts.map(async (cuenta) => {
            const performance = await calculatePortfolioPerformance(cuenta.id);
            return { ...cuenta, ...performance };
        })
    );

    // Aplicar filtros (si has desmarcado alguno)
   // [MODIFICACIÓN aiDANaI] Filtrado inteligente para OnePlus Nord 4
    const displayAssetsData = performanceData.filter(asset => {
        // 1. Filtro de Categoría (Los botones de colores de arriba)
        const isCategoryVisible = !deselectedInvestmentTypesFilter.has(toSentenceCase(asset.tipo || 'S/T'));
        
        // 2. Filtro de Valor (La regla de oro)
        // Ocultamos si el valor es EXACTAMENTE 0. 
        // Nota: Si tienes una deuda (valor negativo) SÍ se mostrará, porque es importante verla.
        const hasValue = Math.abs(asset.valorActual) > 0; 
        
        return isCategoryVisible && hasValue;
    });

    // 3. Calcular Totales Generales
    let portfolioTotalInvertido = displayAssetsData.reduce((sum, cuenta) => sum + cuenta.capitalInvertido, 0);
    let portfolioTotalValorado = displayAssetsData.reduce((sum, cuenta) => sum + cuenta.valorActual, 0);
    let rentabilidadTotalAbsoluta = portfolioTotalValorado - portfolioTotalInvertido;
    let rentabilidadTotalPorcentual = portfolioTotalInvertido !== 0 ? (rentabilidadTotalAbsoluta / portfolioTotalInvertido) * 100 : 0;
    
    // Formatos de texto para la cabecera
    let displayTotalInvertido = formatCurrencyHTML(portfolioTotalInvertido);
    let displayRentabilidadAbsoluta = formatCurrencyHTML(rentabilidadTotalAbsoluta);
    let displayTotalValorado = formatCurrencyHTML(portfolioTotalValorado);
    let displayPorcentajeTotal = rentabilidadTotalPorcentual.toFixed(2) + '%';
    const rentabilidadClass = rentabilidadTotalAbsoluta >= 0 ? 'text-positive' : 'text-negative';
    const signo = rentabilidadTotalAbsoluta >= 0 ? '+' : '';

    // Preparar colores y etiquetas para filtros
    const allInvestmentTypes = [...new Set(performanceData.map(asset => toSentenceCase(asset.tipo || 'S/T')))].sort();
    const colorMap = {};
    allInvestmentTypes.forEach((label, index) => { colorMap[label] = CHART_COLORS[index % CHART_COLORS.length]; });
    
    // HTML de los filtros (botones de colores)
    const pillsHTML = allInvestmentTypes.map(t => {
        const isActive = !deselectedInvestmentTypesFilter.has(t);
        const color = colorMap[t];
        let style = isActive ? `style="background-color: ${color}; border-color: ${color}; color: #FFFFFF;"` : '';
        return `<button class="filter-pill ${isActive ? 'filter-pill--active' : ''}" data-action="toggle-investment-type-filter" data-type="${t}" ${style}>${t}</button>`;
    }).join('');

    // Aviso si estás viendo en BTC
    let btcInfoHTML = '';
    if (typeof portfolioViewMode !== 'undefined' && portfolioViewMode === 'BTC' && btcPriceData.price > 0) {
        btcInfoHTML = `<div style="text-align:center; font-size:0.7rem; color:var(--c-warning); margin-top:-10px; margin-bottom:10px;">
            <span class="material-icons" style="font-size:10px; vertical-align:middle;">info</span> 
            Mostrando Criptos en BTC (1 BTC = ${formatCurrency(Math.round(btcPriceData.price * 100))})
        </div>`;
    }

    // --- RENDERIZADO DEL HTML PRINCIPAL ---
    container.innerHTML = `
        ${btcInfoHTML}
        <div class="card" style="margin-bottom: var(--sp-3);">
            <div class="card__content" style="padding: var(--sp-3);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid var(--c-outline); padding-bottom:10px;">
                    <h3 style="margin:0; font-size:1rem;">Resumen del Portafolio (Total €)</h3>
                </div>
                <div style="display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; align-items: center; text-align: center; gap: 4px;">
                    <div style="display:flex; flex-direction:column; align-items:center;">
                        <h4 class="kpi-item__label" style="font-size:0.65rem;">Invertido</h4>
                        <strong class="kpi-item__value" style="font-size: 0.9rem;">${displayTotalInvertido}</strong>
                    </div>
                    <div style="font-weight:700; color:var(--c-on-surface-tertiary); font-size:0.8rem;">+/-</div>
                    <div style="display:flex; flex-direction:column; align-items:center;">
                        <h4 class="kpi-item__label" style="font-size:0.65rem;">G/P</h4>
                        <strong class="kpi-item__value ${rentabilidadClass}" style="font-size: 0.9rem;">${signo}${displayRentabilidadAbsoluta}</strong>
                    </div>
                    <div style="font-weight:700; color:var(--c-on-surface-tertiary); font-size:0.8rem;">=</div>
                    <div style="display:flex; flex-direction:column; align-items:center;">
                        <h4 class="kpi-item__label" style="font-size:0.65rem;">Valor Real</h4>
                        <strong class="kpi-item__value" style="font-size: 1.1rem; border-bottom: 2px solid var(--c-primary);">${displayTotalValorado}</strong>
                    </div>
                </div>
            </div>
        </div>

        <div class="card" style="margin-bottom: var(--sp-3); padding: 15px;">
            <h4 style="margin: 0 0 10px 0; font-size: 0.85rem; color: var(--c-on-surface-secondary); text-align:center;">Rendimiento: Invertido vs Real</h4>
            <div style="position: relative; height: 200px; width: 100%;">
                <canvas id="investedVsValueChart"></canvas>
            </div>
        </div>
        
        <div class="filter-pills" style="margin-bottom: var(--sp-3); overflow-x:auto;">${pillsHTML}</div>
        <div id="investment-assets-list"></div>`;

    // 4. Generar la lista de tarjetas (Assets)
    const listContainer = document.getElementById('investment-assets-list');
    if (listContainer) {
        const listHtml = displayAssetsData
            .sort((a, b) => b.valorActual - a.valorActual)
            .map(cuenta => {
                const showInBTC = typeof portfolioViewMode !== 'undefined' && portfolioViewMode === 'BTC' && isCryptoType(cuenta.tipo) && btcPriceData.price > 0;
                let cInvertido, cPnl, cReal;

                if (showInBTC) {
                    cInvertido = formatBTC((cuenta.capitalInvertido / 100) / btcPriceData.price);
                    cReal = formatBTC((cuenta.valorActual / 100) / btcPriceData.price);
                    cPnl = formatBTC((cuenta.pnlAbsoluto / 100) / btcPriceData.price);
                } else {
                    cInvertido = formatCurrencyHTML(cuenta.capitalInvertido);
                    cReal = formatCurrencyHTML(cuenta.valorActual);
                    cPnl = formatCurrencyHTML(cuenta.pnlAbsoluto);
                }
                
                const cPorcentaje = cuenta.pnlPorcentual.toFixed(2) + '%';
                const pnlClass = cuenta.pnlAbsoluto >= 0 ? 'text-positive' : 'text-negative';
                const pnlSign = cuenta.pnlAbsoluto >= 0 ? '+' : '';
                const peso = portfolioTotalValorado > 0 ? (cuenta.valorActual / portfolioTotalValorado) * 100 : 0;
                const barColor = colorMap[toSentenceCase(cuenta.tipo || 'S/T')] || 'var(--c-primary)';
                const cardStyle = showInBTC ? 'border-left: 3px solid #F7931A;' : '';
                
                // Fecha formateada
                const lastUpdateStr = cuenta.lastUpdate 
                    ? new Date(cuenta.lastUpdate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: '2-digit' })
                    : '-';

                return `
                <div class="portfolio-asset-card" data-action="view-account-details" data-id="${cuenta.id}" data-is-investment="true" style="flex-direction: column; align-items: stretch; gap: 8px; padding: 12px; ${cardStyle}">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div class="asset-card__name" style="font-size:1rem;">
                            ${escapeHTML(cuenta.nombre)} 
                            ${showInBTC ? '<span style="font-size:0.6rem; background:#F7931A; color:white; padding:1px 4px; border-radius:4px; margin-left:4px;">BTC</span>' : ''}
                        </div>
                        <div style="font-size:0.7rem; color:var(--c-on-surface-tertiary); font-weight:600;">Peso: ${peso.toFixed(1)}%</div>
                    </div>
                    <div style="width: 100%; height: 3px; background: var(--c-surface-variant); border-radius: 2px; overflow: hidden; margin-top:-4px;">
                        <div style="width: ${peso}%; height: 100%; background-color: ${barColor};"></div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-top: 4px; background: var(--c-surface-variant); padding: 8px; border-radius: 8px;">
                        <div style="display:flex; flex-direction:column;">
                            <span style="font-size:0.6rem; color:var(--c-on-surface-secondary); text-transform:uppercase;">Invertido</span>
                            <span style="font-size:0.85rem; font-weight:600; color:var(--c-on-surface);">${cInvertido}</span>
                        </div>
                        <div style="display:flex; flex-direction:column; text-align:center;">
                            <span style="font-size:0.6rem; color:var(--c-on-surface-secondary); text-transform:uppercase;">P&L</span>
                            <div style="display:flex; flex-direction:column;">
                                <span style="font-size:0.85rem; font-weight:700;" class="${pnlClass}">${pnlSign}${cPnl}</span>
                                <span style="font-size:0.7rem; opacity:0.9;" class="${pnlClass}">(${pnlSign}${cPorcentaje})</span>
                            </div>
                        </div>
                        <div style="display:flex; flex-direction:column; text-align:right;">
                            <span style="font-size:0.6rem; color:var(--c-on-surface-secondary); text-transform:uppercase;">Valor Real</span>
                            <span style="font-size:0.9rem; font-weight:800; color:var(--c-on-surface);">${cReal}</span>
                            <span style="font-size:0.65rem; color:var(--c-on-surface-tertiary); margin-top:2px; font-weight:500;">
                                <span class="material-icons" style="font-size:10px; vertical-align:middle;">history</span> ${lastUpdateStr}
                            </span>
                        </div>
                    </div>
                    <div style="display:flex; justify-content:flex-end;">
                         <button class="asset-card__valoracion-btn" data-action="update-asset-value" data-id="${cuenta.id}" style="padding: 4px 10px; font-size: 0.7rem;">
                            <span class="material-icons" style="font-size: 14px;">edit</span> Actualizar Valor
                        </button>
                    </div>
                </div>`;
            }).join('');

        listContainer.innerHTML = listHtml ? `<div class="card fade-in-up"><div class="card__content" style="padding: 0;">${listHtml}</div></div>` : '';
        applyInvestmentItemInteractions(listContainer);
    }

    // 5. RENDERIZAR EL GRÁFICO (Chart.js)
    setTimeout(() => {
        const ctx = document.getElementById('investedVsValueChart');
        if (ctx && typeof Chart !== 'undefined') {
            // Agrupar datos por TIPO
            const groups = {};
            displayAssetsData.forEach(asset => {
                const tipo = toSentenceCase(asset.tipo || 'Otros');
                if (!groups[tipo]) groups[tipo] = { invertido: 0, valor: 0 };
                groups[tipo].invertido += asset.capitalInvertido;
                groups[tipo].valor += asset.valorActual;
            });

            const labels = Object.keys(groups);
            // Convertimos a euros (desde céntimos)
            const dataInvertido = labels.map(l => groups[l].invertido / 100);
            const dataValor = labels.map(l => groups[l].valor / 100);

            // Colores: Verde si ganamos, Rojo si perdemos
            const valorColors = labels.map(l => {
                return groups[l].valor >= groups[l].invertido 
                    ? 'rgba(48, 209, 88, 0.8)'  // Verde
                    : 'rgba(255, 69, 58, 0.8)'; // Rojo
            });

            if (window.myInvestmentChart) window.myInvestmentChart.destroy();

            window.myInvestmentChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Invertido (€)',
                            data: dataInvertido,
                            backgroundColor: 'rgba(142, 142, 147, 0.5)',
                            borderRadius: 4,
                            barPercentage: 0.6
                        },
                        {
                            label: 'Valor Actual (€)',
                            data: dataValor,
                            backgroundColor: valorColors,
                            borderRadius: 4,
                            barPercentage: 0.6
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }, // Ocultamos leyenda para limpiar
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) label += ': ';
                                    if (context.parsed.y !== null) {
                                        label += new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(context.parsed.y);
                                    }
                                    return label;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(255, 255, 255, 0.05)' },
                            ticks: { color: '#888', font: { size: 10 } }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: '#AAA', font: { size: 10 } }
                        }
                    }
                }
            });
        }
    }, 150);
};


const handleShowPnlBreakdown = async (accountId) => {
    const cuenta = db.cuentas.find(c => c.id === accountId);
    if (!cuenta) return;

    hapticFeedback('light');
    showGenericModal(`Desglose P&L: ${cuenta.nombre}`, `<div style="text-align:center; padding: var(--sp-5);"><span class="spinner"></span></div>`);

    const performanceData = await calculatePortfolioPerformance(accountId, 'MAX');

    const { valorActual, capitalInvertido, pnlAbsoluto } = performanceData;
    
    let modalHtml = `<p class="form-label" style="margin-bottom: var(--sp-3);">
        Tu Ganancia o Pérdida (P&L) se calcula con la fórmula que definiste: <strong>Valor de Mercado - Capital Aportado</strong>. El "Capital Aportado" en tu caso es el Saldo Contable de la cuenta.
        </p>
        <div class="informe-extracto-container" style="font-family: monospace, sans-serif; font-size: 1.1em;">
            
            <div class="informe-linea-movimiento" style="justify-content: space-between;">
                <span>Valor de Mercado</span>
                <span class="text-ingreso">${formatCurrency(valorActual)}</span>
            </div>

            <div class="informe-linea-movimiento" style="justify-content: space-between;">
                <span>Capital Aportado</span>
                <span class="text-gasto">- ${formatCurrency(capitalInvertido)}</span>
            </div>
            
        </div>
        
        <div class="informe-extracto-container" style="margin-top: var(--sp-3); border-top: 2px solid var(--c-primary);">
            <div class="informe-linea-movimiento" style="justify-content: space-between; font-weight: 700;">
                <span>Resultado (P&L)</span>
                <span class="${pnlAbsoluto >= 0 ? 'text-ingreso' : 'text-gasto'}">${formatCurrency(pnlAbsoluto)}</span>
            </div>
        </div>
        `;
    
    showGenericModal(`Desglose P&L: ${cuenta.nombre}`, modalHtml);
};

const renderVirtualListItem = (item) => {
    
    // 1. Header de Pendientes
    if (item.type === 'pending-header') {
        return `
        <div class="movimiento-date-header" style="background-color: var(--c-warning); color: #000; margin: 10px 0; border-radius: 8px;">
            <span><span class="material-icons" style="font-size: 16px; vertical-align: middle;">update</span> Pendientes (${item.count})</span>
        </div>`;
    }

    // 2. Tarjeta de Pendiente
    if (item.type === 'pending-item') {
        const r = item.recurrent;
        const date = new Date(r.nextDate).toLocaleDateString('es-ES', {day:'2-digit', month:'short'});
        return `
        <div class="transaction-card" style="margin:0; border-bottom:1px solid var(--c-outline); background-color: rgba(255, 214, 10, 0.05);">
            <div class="transaction-card__content">
                <div class="transaction-card__details">
                    <div class="transaction-card__row-1">${escapeHTML(r.descripcion)}</div>
                    <div class="transaction-card__row-2" style="color: var(--c-warning);">Programado: ${date}</div>
                    <div class="acciones-recurrentes-corregidas" style="margin-top: 8px;">
                        <button class="btn btn--secondary" data-action="skip-recurrent" data-id="${r.id}" style="font-size: 0.7rem;">Omitir</button>
                        <button class="btn btn--primary" data-action="confirm-recurrent" data-id="${r.id}" style="font-size: 0.7rem;">Añadir</button>
                    </div>
                </div>
                <div class="transaction-card__figures">
                    <strong class="transaction-card__amount ${r.cantidad >= 0 ? 'text-positive' : 'text-negative'}">${formatCurrencyHTML(r.cantidad)}</strong>
                </div>
            </div>
        </div>`;
    }

    // 3. Header de Fecha (AMARILLO BRILLANTE)
    if (item.type === 'date-header') {
        const dateObj = new Date(item.date + 'T12:00:00Z');
        
        const day = dateObj.getDate().toString().padStart(2, '0');
        let month = dateObj.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '');
        month = month.charAt(0).toUpperCase() + month.slice(1);
        const year = dateObj.getFullYear();
        
        // Color: Amarillo (#FFD700) por defecto. Si es negativo, Naranja (Warning).
        let totalColor = '#FFD700'; 
        if (item.total < 0) totalColor = 'var(--c-warning)';

        return `
            <div class="date-header-trigger" data-fecha="${item.date}" data-total="${item.total}" style="
                background-image: linear-gradient(135deg, #000428 0%, #004e92 100%) !important;
                background-color: #000428 !important;
                
                padding: 12px 16px; 
                margin-top: 0;
                border-top: 1px solid rgba(255,255,255,0.15);
                border-bottom: 1px solid rgba(0,0,0,0.5);
                display: flex; 
                align-items: center; 
                justify-content: space-between;
                box-shadow: 0 4px 10px rgba(0,0,0,0.4); 
                position: relative;
                z-index: 1;
            ">
                <div style="display: flex; align-items: baseline; gap: 6px; text-shadow: 0 2px 2px rgba(0,0,0,0.8);">
                    <span style="font-size: 1.2rem; font-weight: 800; color: #FFD700; letter-spacing: -0.5px;">${day}</span>
                    <span style="font-size: 1rem; font-weight: 600; text-transform: capitalize; color: #FFD700; opacity: 0.9;">${month}</span>
                    <span style="font-size: 0.9rem; font-weight: 400; color: #FFD700; opacity: 0.7;">${year}</span>
                </div>

                <span style="
                    color: ${totalColor}; 
                    font-weight: 700; 
                    font-family: monospace; 
                    font-size: 1rem;
                    text-shadow: 0 2px 2px rgba(0,0,0,0.8);
                ">
                    ${formatCurrencyHTML(item.total)}
                </span>
            </div>
        `;
    }

    // 4. MOVIMIENTOS
   if (item.type === 'transaction') {
            const m = item.movement;
            const { cuentas, conceptos } = db;
            const highlightClass = (m.id === newMovementIdToHighlight) ? 'list-item-animate' : '';

            // --- 1. Lógica de Colores y Textos ---
            let color, amountClass, amountSign, line1_Left_Text, line2_Left_Text;

            const cuentaNombre = cuentas.find(c => c.id === m.cuentaId)?.nombre || 'Cuenta';
            const conceptoNombre = conceptos.find(c => c.id === m.conceptoId)?.nombre || 'Varios';
            
            // Descripción
            let descripcionTexto = conceptoNombre;
            if (m.descripcion && m.descripcion.trim() !== '' && m.descripcion !== conceptoNombre) {
                descripcionTexto = `${conceptoNombre} - ${m.descripcion}`;
            }

            if (m.tipo === 'traspaso') {
                color = 'var(--c-info)'; 
                amountClass = 'text-info';
                amountSign = '';
                
                const origen = cuentas.find(c => c.id === m.cuentaOrigenId)?.nombre || 'Origen';
                const destino = cuentas.find(c => c.id === m.cuentaDestinoId)?.nombre || 'Destino';
                
                line1_Left_Text = `${escapeHTML(origen)} ➔ ${escapeHTML(destino)}`;
                
                // === CAMBIO DANI: Mostrar saldos en vez de texto "Traspaso" ===
                // 1. Buscamos el saldo calculado (usamos _saldo...Snapshot que calcula tu lista)
                // Si no existe el snapshot, usamos 'runningBalance' como plan B
                const saldoSalida = m._saldoOrigenSnapshot !== undefined ? m._saldoOrigenSnapshot : (m.runningBalanceOrigen || 0);
                const saldoEntrada = m._saldoDestinoSnapshot !== undefined ? m._saldoDestinoSnapshot : (m.runningBalanceDestino || 0);

                // 2. Formateamos el texto:  "1.500,00 €  --->  500,00 €"
                line2_Left_Text = `${formatCurrency(saldoSalida)} ➔ ${formatCurrency(saldoEntrada)}`;
            } else {
                const isGasto = m.cantidad < 0;
                color = isGasto ? 'var(--c-danger)' : 'var(--c-success)';
                amountClass = isGasto ? 'text-negative' : 'text-positive';
                amountSign = isGasto ? '' : '+';

                line1_Left_Text = escapeHTML(cuentaNombre);
                line2_Left_Text = escapeHTML(descripcionTexto);
            }

            // --- 2. HTML DE MÁXIMA DENSIDAD Y SIMETRÍA ---
            return `
            <div class="t-card ${highlightClass}" 
                 data-fecha="${m.fecha || ''}" 
                 data-id="${m.id}" 
                 data-action="edit-movement-from-list" 
                 style="
                    padding: 1px 4px;        /* 1px vertical, 4px horizontal para que el texto no toque el borde */
                    margin-bottom: 1px;      /* Separación mínima entre filas */
                    background-color: var(--c-surface);
                    border-bottom: 1px solid var(--c-outline);
                    border-left: 5px solid ${color} !important;  /* Barra Izquierda */
                    border-right: 5px solid ${color} !important; /* Barra Derecha (SIMETRÍA) */
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    min-height: 44px;        /* Altura mínima ajustada a los números grandes */
                 ">
                
                <div style="display: flex; justify-content: space-between; align-items: flex-end; line-height: 1;">
                    <div style="color: ${color}; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; flex: 1; text-align: left;">
                        ${line1_Left_Text}
                    </div>
                    <div class="${amountClass}" style="font-size: 1.2rem; font-weight: 800; white-space: nowrap; letter-spacing: -0.5px; text-align: right; padding-left: 5px;">
                        ${amountSign}${formatCurrencyHTML(m.cantidad)}
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-top: 1px; line-height: 1;">
                    <div style="color: #FFFFFF; font-weight: 400; font-size: 0.85rem; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; flex: 1; text-align: left; opacity: 0.9;">
                        ${line2_Left_Text}
                    </div>
                    
                    ${m.tipo !== 'traspaso' ? `
                    <div style="color: #FFFFFF; font-size: 1.2rem; font-weight: 400; white-space: nowrap; letter-spacing: -0.5px; text-align: right; opacity: 0.8; padding-left: 5px;">
                        ${formatCurrencyHTML(m.runningBalance)}
                    </div>
                    ` : '<div style="flex-shrink:0;"></div>'} 
                </div>
            </div>`;
        }
    return '';
};
        
        const renderVisibleItems = () => {
            if (!vList.scrollerEl || !vList.contentEl) return; 
            const scrollTop = vList.scrollerEl.scrollTop;
            const containerHeight = vList.scrollerEl.clientHeight;
            let startIndex = -1, endIndex = -1;
            
            for (let i = 0; i < vList.itemMap.length; i++) {
                const item = vList.itemMap[i];
                if (startIndex === -1 && item.offset + item.height > scrollTop) {
                    startIndex = Math.max(0, i - vList.renderBuffer);
                }
                if (endIndex === -1 && item.offset + item.height > scrollTop + containerHeight) {
                    endIndex = Math.min(vList.itemMap.length - 1, i + vList.renderBuffer);
                    break;
                }
            }
            if (startIndex === -1 && vList.items.length > 0) startIndex = 0;
            if (endIndex === -1) endIndex = vList.itemMap.length - 1;
            
            if (startIndex === vList.lastRenderedRange.start && endIndex === vList.lastRenderedRange.end) return;
            
            let visibleHtml = ''; 
            for (let i = startIndex; i <= endIndex; i++) {
                if (vList.items[i]) visibleHtml += renderVirtualListItem(vList.items[i]);
            }
            vList.contentEl.innerHTML = visibleHtml; 
			const renderedItems = vList.contentEl.querySelectorAll('.list-item-animate');
renderedItems.forEach((item, index) => {
    // Aplicamos la clase que dispara la animación con un pequeño retraso
    // para cada elemento, creando el efecto cascada.
    setTimeout(() => {
        item.classList.add('item-enter-active');
    }, index * 40); // 40 milisegundos de retraso entre cada item
});
            const offsetY = vList.itemMap[startIndex] ? vList.itemMap[startIndex].offset : 0; 
            vList.contentEl.style.transform = `translateY(${offsetY}px)`; 
            vList.lastRenderedRange = { start: startIndex, end: endIndex };
        };

const updateLocalDataAndRefreshUI = async () => {
    // 1. Recalcula los saldos con la lista de movimientos actualizada que tenemos en memoria.
    await processMovementsForRunningBalance(db.movimientos, true);
    
    // 2. Le dice a la lista virtual que se redibuje con los nuevos datos.
    updateVirtualListUI();

};
 
const updateVirtualListUI = () => {
    if (!vList.sizerEl) return;

    vList.items = [];
    vList.itemMap = [];
    let currentHeight = 0;
    
    // Constantes de altura (Coherencia visual)
    const H_HEADER = 45;
    const H_ITEM = 65;
    const H_PENDING = 72;

    // 1. Recurrentes Pendientes (Igual que antes)
    const pendingRecurrents = getPendingRecurrents();
    if (pendingRecurrents.length > 0) {
        vList.items.push({ type: 'pending-header', count: pendingRecurrents.length });
        vList.itemMap.push({ height: 40, offset: currentHeight });
        currentHeight += 40;
        
        pendingRecurrents.forEach(recurrent => {
            vList.items.push({ type: 'pending-item', recurrent: recurrent });
            vList.itemMap.push({ height: H_PENDING, offset: currentHeight });
            currentHeight += H_PENDING;
        });
    }

    // --- NUEVA LÓGICA: CÁLCULO DE SALDOS HISTÓRICOS ---
    
    // A) Creamos un mapa con los saldos ACTUALES de todas las cuentas
    // (Asumimos que db.cuentas tiene el saldo real actual)
    const runningBalances = {};
    if (db.cuentas) {
        db.cuentas.forEach(c => runningBalances[c.id] = c.saldo || 0);
    }

    // B) Ordenamos TODOS los movimientos por fecha (Del más nuevo al más viejo)
    // Usamos una copia para no alterar el orden original si fuera necesario
    const allSortedMovs = [...(db.movimientos || [])].sort((a, b) => 
        new Date(b.fecha) - new Date(a.fecha) || b.id.localeCompare(a.id)
    );

    // C) Recorremos hacia atrás en el tiempo para asignar saldos y revertirlos
    allSortedMovs.forEach(mov => {
        // 1. Guardamos el saldo que tenían las cuentas JUSTO DESPUÉS de este movimiento
        // (que es el valor que tienen actualmente en el mapa runningBalances)
        
        if (mov.tipo === 'traspaso') {
            // Guardamos la foto del saldo para mostrarla
            mov._saldoOrigenSnapshot = runningBalances[mov.cuentaOrigenId] || 0;
            mov._saldoDestinoSnapshot = runningBalances[mov.cuentaDestinoId] || 0;

            // 2. Revertimos el efecto para el siguiente paso (ir al pasado)
            // Si hubo un traspaso de A a B por 50€:
            // A bajó 50 -> Para volver al pasado, le SUMAMOS 50
            // B subió 50 -> Para volver al pasado, le RESTAMOS 50
            const cantidad = Math.abs(mov.cantidad);
            if (runningBalances[mov.cuentaOrigenId] !== undefined) runningBalances[mov.cuentaOrigenId] += cantidad;
            if (runningBalances[mov.cuentaDestinoId] !== undefined) runningBalances[mov.cuentaDestinoId] -= cantidad;

        } else {
            // Movimiento normal (Ingreso/Gasto)
            mov._saldoSnapshot = runningBalances[mov.cuentaId] || 0;

            // Revertimos: Si fue gasto (-50), sumamos 50. Si fue ingreso (+50), restamos 50.
            if (runningBalances[mov.cuentaId] !== undefined) {
                runningBalances[mov.cuentaId] -= mov.cantidad;
            }
        }
    });

    // --- FIN LÓGICA DE CÁLCULO ---

    // 2. Agrupación y Filtrado (Tu lógica visual)
    const groupedByDate = {};
    const visibleAccountIds = new Set(getVisibleAccounts().map(c => c.id));

    allSortedMovs.forEach(mov => {
        // Filtrado de visibilidad
        let isVisible = false;
        let amountForTotal = 0;

        if (mov.tipo === 'traspaso') {
            const origenVisible = visibleAccountIds.has(mov.cuentaOrigenId);
            const destinoVisible = visibleAccountIds.has(mov.cuentaDestinoId);
            isVisible = origenVisible || destinoVisible;
            
            // Cálculo del neto para la cabecera del día
            if (origenVisible && !destinoVisible) amountForTotal = -Math.abs(mov.cantidad);
            else if (!origenVisible && destinoVisible) amountForTotal = Math.abs(mov.cantidad);
        } else {
            isVisible = visibleAccountIds.has(mov.cuentaId);
            amountForTotal = mov.cantidad;
        }

        if (isVisible) {
            const dateKey = mov.fecha.split('T')[0];
            if (!groupedByDate[dateKey]) {
                groupedByDate[dateKey] = { movements: [], totalDay: 0 };
            }
            groupedByDate[dateKey].movements.push(mov);
            groupedByDate[dateKey].totalDay += amountForTotal;
        }
    });

    // 3. Construir la lista plana
    const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(b) - new Date(a));

    sortedDates.forEach(dateKey => {
        const group = groupedByDate[dateKey];

        // Header
        vList.items.push({ type: 'date-header', date: dateKey, total: group.totalDay });
        vList.itemMap.push({ height: H_HEADER, offset: currentHeight });
        currentHeight += H_HEADER;

        // Items (Ya están ordenados por el paso B)
        group.movements.forEach(mov => {
            vList.items.push({ type: 'transaction', movement: mov });
            vList.itemMap.push({ height: H_ITEM, offset: currentHeight });
            currentHeight += H_ITEM;
        });
    });
    
    vList.sizerEl.style.height = `${currentHeight}px`;
    vList.lastRenderedRange = { start: -1, end: -1 }; 
    renderVisibleItems();
    
    // Gestión de estado vacío
    const emptyState = document.getElementById('empty-movimientos');
    const listContainer = document.getElementById('movimientos-list-container');
    const hasItems = vList.items.length > 0;
    
    if (listContainer) listContainer.classList.toggle('hidden', !hasItems);
    if (emptyState) emptyState.classList.toggle('hidden', hasItems);
};


async function fetchMovementsPage(startAfterDoc = null) {
    if (!currentUser) return [];
    try {
        let query = fbDb.collection('users').doc(currentUser.uid).collection('movimientos')
            .orderBy('fecha', 'desc').orderBy(firebase.firestore.FieldPath.documentId(), 'desc');

        if (startAfterDoc) {
            query = query.startAfter(startAfterDoc);
        }

        query = query.limit(MOVEMENTS_PAGE_SIZE);
        const snapshot = await query.get();

        if (snapshot.empty) {
            allMovementsLoaded = true;
            return [];
        }

        lastVisibleMovementDoc = snapshot.docs[snapshot.docs.length - 1];

        if (snapshot.docs.length < MOVEMENTS_PAGE_SIZE) {
            allMovementsLoaded = true;
        }
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    } catch (error) {
        console.error("Error al obtener los movimientos:", error);
        showToast("Error al cargar los movimientos.", "danger");
        return [];
    }
}

const filterMovementsByLedger = (movements) => {
    const visibleAccountIds = new Set(getVisibleAccounts().map(c => c.id));
    if (visibleAccountIds.size === 0) return [];
    
    return movements.filter(m => {
        if (m.tipo === 'traspaso') {
            return visibleAccountIds.has(m.cuentaOrigenId) || visibleAccountIds.has(m.cuentaDestinoId);
        } else {
            return visibleAccountIds.has(m.cuentaId);
        }
    });
};


const loadMoreMovements = async (isInitial = false) => {
    if (isLoadingMoreMovements || allMovementsLoaded) return;

    isLoadingMoreMovements = true;
    const loadMoreBtn = select('load-more-btn');

    // Estado visual de carga
    if (isInitial) {
        let skeletonHTML = '';
        for (let i = 0; i < 6; i++) skeletonHTML += `<div class="skeleton-card" style="margin:10px 0;"><div class="skeleton" style="width:3px;height:50px;margin-right:10px;"></div><div style="flex:1"><div class="skeleton" style="width:60%;height:12px;margin-bottom:8px;"></div><div class="skeleton" style="width:40%;height:10px;"></div></div></div>`;
        const contentEl = select('virtual-list-content');
        if(contentEl) contentEl.innerHTML = skeletonHTML;
    } else if (loadMoreBtn) {
        setButtonLoading(loadMoreBtn, true, 'Buscando...');
    }

    try {
        let newMovementsAccumulator = [];
        let visibleCountFound = 0;
        const MIN_ITEMS_NEEDED = 15; // Queremos asegurar al menos 15 items visibles
        const MAX_BATCHES_SAFEGUARD = 10; // Freno de emergencia (evita bucle infinito si DB enorme)
        let batchesFetched = 0;

        // BUCLE DE BÚSQUEDA (El corazón de la solución)
        // Seguiremos pidiendo a Firebase hasta que:
        // 1. Tengamos suficientes items visibles para llenar la pantalla.
        // 2. O se acabe la base de datos (allMovementsLoaded).
        // 3. O lleguemos al límite de seguridad.
        while (visibleCountFound < MIN_ITEMS_NEEDED && !allMovementsLoaded && batchesFetched < MAX_BATCHES_SAFEGUARD) {
            
            // 1. Pedimos bloque crudo a Firebase (200 items)
            const rawBatch = await fetchMovementsPage(lastVisibleMovementDoc);
            batchesFetched++;

            if (rawBatch.length === 0) {
                allMovementsLoaded = true;
                break; // Se acabó la base de datos real
            }

            // 2. Filtramos localmente según la Caja actual (A/B/C)
            const filteredBatch = filterMovementsByLedger(rawBatch);
            
            // 3. Acumulamos lo que sirve
            if (filteredBatch.length > 0) {
                newMovementsAccumulator.push(...filteredBatch);
                visibleCountFound += filteredBatch.length;
            }
            
            // Si el bloque crudo era menor a la página, es que llegamos al final físico
            if (rawBatch.length < MOVEMENTS_PAGE_SIZE) {
                allMovementsLoaded = true;
            }
        }
        
        // Finalización
        if (newMovementsAccumulator.length > 0) {
            // Añadimos a la lista principal
            db.movimientos.push(...newMovementsAccumulator);
            
            // Aprovechamos para alimentar el AppStore silenciosamente
            // (esto hace que la próxima vez que vayas a Patrimonio, ya esté cargado)
            newMovementsAccumulator.forEach(m => {
                // Solo añadimos si no existe para evitar duplicados
                if (!AppStore.movements.some(existing => existing.id === m.id)) {
                    AppStore.movements.push(m);
                }
            });
            AppStore.sort();

            // Recalcular saldos para la vista de lista
            await processMovementsForRunningBalance(db.movimientos, true);
        } else if (isInitial && allMovementsLoaded) {
            // Caso especial: Usuario nuevo o filtro vacío
            select('virtual-list-content').innerHTML = `<div class="empty-state" style="padding-top:50px;"><span class="material-icons">receipt_long</span><p>No hay movimientos en esta Caja.</p></div>`;
            isLoadingMoreMovements = false;
            return;
        }

        // Renderizar
        updateVirtualListUI();

    } catch (error) {
        console.error("Error crítico en scroll:", error);
        showToast("Error de conexión al cargar historial.", "danger");
    } finally {
        isLoadingMoreMovements = false;
        if (loadMoreBtn) setButtonLoading(loadMoreBtn, false);
    }
};

// =========================================================================
// === INICIO: REEMPLAZO COMPLETO Y MEJORADO DE loadInitialMovements     ===
// =========================================================================

        let movementsObserver = null; // Variable global para el observador
		const initMovementsObserver = () => {
    // Si ya existía un vigilante, lo reiniciamos
    if (movementsObserver) {
        movementsObserver.disconnect();
    }

    const trigger = select('infinite-scroll-trigger');
    if (!trigger) return;

    // Configuramos el vigilante para que actúe cuando el "activador" esté a punto de verse
    const options = {
        root: selectOne('.app-layout__main'), // Vigila el scroll dentro de la ventana principal
        rootMargin: '200px', // Empieza a cargar 200px antes de que llegue al final
        threshold: 0.01
    };

    movementsObserver = new IntersectionObserver((entries) => {
        // Si el vigilante ve nuestro activador...
        if (entries[0].isIntersecting) {
            // ...llama a la función para cargar más movimientos automáticamente.
            loadMoreMovements();
        }
    }, options);

    // Le decimos al vigilante que empiece a observar nuestro activador invisible.
    movementsObserver.observe(trigger);
};

// ▼▼▼ REEMPLAZA TU FUNCIÓN renderDiarioPage POR COMPLETO CON ESTA VERSIÓN ▼▼▼

const renderDiarioPage = async () => {
    if (isDiarioPageRendering) {
        console.log("BLOQUEADO: Intento de re-renderizar el Diario mientras ya estaba en proceso.");
        return;
    }
    isDiarioPageRendering = true;

    try {
        const container = select('diario-page');
        if (!container.querySelector('#diario-view-container')) {
            container.innerHTML = '<div id="diario-view-container"></div>';
        }
        
        const viewContainer = select('diario-view-container');
        if (!viewContainer) return;

        if (diarioViewMode === 'calendar') {
            if (movementsObserver) movementsObserver.disconnect();
            await renderDiarioCalendar();
            return; // Salimos aquí si estamos en vista de calendario
        }

        viewContainer.innerHTML = `
            <div id="diario-filter-active-indicator" class="hidden">
			<button data-action="clear-diario-filters" class="icon-btn" style="width: 24px; height: 24px;">
        <span class="material-icons" style="font-size: 16px;">close</span>
    </button>
                <p>Mostrando resultados filtrados.</p>
                <div>
                    <button data-action="export-filtered-csv" class="btn btn--secondary" style="padding: 4px 10px; font-size: 0.75rem;"><span class="material-icons" style="font-size: 14px;">download</span>Exportar</button>
                    <button data-action="clear-diario-filters" class="btn btn--secondary" style="padding: 4px 10px; font-size: 0.75rem;">Limpiar</button>
                </div>
            </div>
            <div id="movimientos-list-container">
                <div id="virtual-list-sizer"><div id="virtual-list-content"></div></div>
            </div>
            <div id="infinite-scroll-trigger" style="height: 50px;"></div> 
            <div id="empty-movimientos" class="empty-state hidden" style="margin: 0 var(--sp-4);">
                <span class="material-icons">search_off</span><h3>Sin Resultados</h3><p>No se encontraron movimientos que coincidan con tus filtros.</p>
            </div>`;

        vList.scrollerEl = selectOne('.app-layout__main');
        vList.sizerEl = select('virtual-list-sizer');
        vList.contentEl = select('virtual-list-content');
        
        const scrollTrigger = select('infinite-scroll-trigger');

        if (diarioActiveFilters) {
            if (scrollTrigger) scrollTrigger.classList.add('hidden');
            if (movementsObserver) movementsObserver.disconnect();

            select('diario-filter-active-indicator').classList.remove('hidden');
            
            const allMovements = await AppStore.getAll();

			const { startDate, endDate, description, minAmount, maxAmount, cuentas, conceptos } = diarioActiveFilters;
			db.movimientos = allMovements.filter(m => {
                if (startDate && m.fecha < startDate) return false;
                if (endDate && m.fecha > endDate) return false;
                if (description && !m.descripcion.toLowerCase().includes(description)) return false;
                const cantidadEuros = m.cantidad / 100;
                if (minAmount && cantidadEuros < parseFloat(minAmount)) return false;
                if (maxAmount && cantidadEuros > parseFloat(maxAmount)) return false;
                if (cuentas.length > 0) {
                    if (m.tipo === 'traspaso' && !cuentas.includes(m.cuentaOrigenId) && !cuentas.includes(m.cuentaDestinoId)) return false;
                    if (m.tipo === 'movimiento' && !cuentas.includes(m.cuentaId)) return false;
                }
                if (conceptos.length > 0 && m.tipo === 'movimiento' && !conceptos.includes(m.conceptoId)) return false;
                return true;
            });
            
            await processMovementsForRunningBalance(db.movimientos, true);
            updateVirtualListUI();

        } else {
            if (scrollTrigger) scrollTrigger.classList.remove('hidden');
            select('diario-filter-active-indicator').classList.add('hidden');
            
            db.movimientos = [];
            lastVisibleMovementDoc = null;
            allMovementsLoaded = false;
            isLoadingMoreMovements = false; 
            
            await loadMoreMovements(true);
            initMovementsObserver();
        }

    } catch (error) {
        console.error("Error crítico renderizando la página del diario:", error);
        // Si hay un error, es crucial liberar la guarda para poder intentarlo de nuevo.
    } finally {
       
        isDiarioPageRendering = false;
    }
};

const renderAjustesPage = () => {
    const container = select(PAGE_IDS.AJUSTES);
    if (!container) return;

    // Estructura HTML de la nueva página de Ajustes, agrupada por temas.
    container.innerHTML = `
        <div style="padding-bottom: var(--sp-4);">

            <!-- Grupo 1: Gestión de Datos -->
            <h3 class="settings-group__title">Gestión de Datos</h3>
            <div class="card">
                <div class="card__content" style="padding: 0;">
                    <button class="settings-item" data-action="manage-cuentas">
                        <span class="material-icons">account_balance_wallet</span>
                        <span class="settings-item__label">Gestionar Cuentas</span>
                        <span class="material-icons">chevron_right</span>
                    </button>
                    <button class="settings-item" data-action="manage-conceptos">
                        <span class="material-icons">label</span>
                        <span class="settings-item__label">Gestionar Conceptos</span>
                        <span class="material-icons">chevron_right</span>
                    </button>
                </div>
            </div>

            <!-- Grupo 2: Copias de Seguridad y Migración -->
        <h3 class="settings-group__title">Copias de Seguridad y Migración</h3>
        <div class="card">
            <div class="card__content" style="padding: 0;">
                <button class="settings-item" data-action="export-data">
                    <span class="material-icons text-positive">cloud_upload</span>
                    <span class="settings-item__label">Exportar Copia (JSON)</span>
                    <span class="material-icons">chevron_right</span>
                </button>
                 <button class="settings-item" data-action="export-csv">
                    <span class="material-icons text-positive">description</span>
                    <span class="settings-item__label">Exportar a CSV (Excel)</span>
                    <span class="material-icons">chevron_right</span>
                </button>
                <button class="settings-item" data-action="import-data">
                    <span class="material-icons text-warning">cloud_download</span>
                    <span class="settings-item__label">Importar Copia (JSON)</span>
                    <span class="material-icons">chevron_right</span>
                </button>
                <button class="settings-item" data-action="import-csv">
                     <span class="material-icons text-warning">grid_on</span>
                    <span class="settings-item__label">Importar desde CSV</span>
                    <span class="material-icons">chevron_right</span>
                </button>
				<button class="settings-item" onclick="detectarYCorregirTraspasos()">
					<span class="material-icons" style="color: #2196F3;">sync_alt</span>
					<span class="settings-item__label">Movimientos en traspasos</span>
					<span class="material-icons">chevron_right</span>
				</button>

                <!-- ===== INICIO DE LA MODIFICACIÓN ===== -->
                <!-- Este es el nuevo botón que hemos añadido -->
                <button class="settings-item text-danger" data-action="recalculate-balances">
                    <span class="material-icons">rule_folder</span>
                    <span class="settings-item__label">Auditar y Corregir Saldos</span>
                    <span class="material-icons">chevron_right</span>
                </button>
                <!-- ===== FIN DE LA MODIFICACIÓN ===== -->
                
            </div>
        </div>
            
            <!-- Grupo 3: Seguridad y Cuenta -->
            <h3 class="settings-group__title">Seguridad y Cuenta</h3>
			
            <div class="card">
                <div class="card__content" style="padding: 0;">
                    <div class="settings-item" style="cursor: default;">
                        <span class="material-icons">alternate_email</span>
                        <span id="config-user-email" class="settings-item__label">Cargando...</span>
                    </div>
                    <button class="settings-item" data-action="set-pin">
                        <span class="material-icons">pin</span>
                        <span class="settings-item__label">Configurar PIN de acceso</span>
                        <span class="material-icons">chevron_right</span>
                    </button>
					<h3 class="settings-group__title">Personalización</h3>
<div class="card">
    <div class="card__content" style="padding: 0;">
        <button class="settings-item" data-action="rename-ledgers">
            <span class="material-icons text-info">edit_square</span>
            <span class="settings-item__label">Renombrar Cajas (A/B/C)</span>
            <span class="material-icons">chevron_right</span>
        </button>
    </div>
</div>
                    <button class="settings-item text-danger" data-action="logout">
                        <span class="material-icons">logout</span>
                        <span class="settings-item__label">Cerrar Sesión</span>
                    </button>
                </div>
            </div>

        </div>
    `;
    
    // Esta función, que ya tienes, se encarga de mostrar tu email en la lista.
    loadConfig();
};

// =============================================================
// === INICIO: FUNCIÓN RESTAURADA PARA EL WIDGET DE PATRIMONIO ===
// =============================================================
const renderPatrimonioOverviewWidget = async (containerId) => {
    const container = select(containerId);
    if (!container) return;

    container.innerHTML = `<div class="skeleton" style="height: 400px; border-radius: var(--border-radius-lg);"></div>`;

    const visibleAccounts = getVisibleAccounts();
    const saldos = await getSaldos();
    const BASE_COLORS = [
    '#2979FF', // Azul Eléctrico (Principal)
    '#39FF14', // Verde Neón
    '#FFD600', // Amarillo Oro
    '#FF1744', // Rojo Intenso
    '#D500F9', // Violeta (Mantiene el estilo Cyberpunk)
    '#00E5FF', // Cyan
    '#FF4081', // Rosa
    '#76FF03'  // Verde Lima
];

    const allAccountTypes = [...new Set(visibleAccounts.map((c) => toSentenceCase(c.tipo || 'S/T')))].sort();
    const filteredAccountTypes = new Set(allAccountTypes.filter(t => !deselectedAccountTypesFilter.has(t)));

    const colorMap = {};
    allAccountTypes.forEach((tipo, index) => {
        colorMap[tipo] = BASE_COLORS[index % BASE_COLORS.length];
    });

    const pillsHTML = allAccountTypes.map(t => {
        const isActive = !deselectedAccountTypesFilter.has(t);
        const color = colorMap[t];
        let style = '';
        if (isActive && color) {
            style = `style="background-color: ${color}; border-color: ${color}; color: #FFFFFF; box-shadow: none;"`;
        }
        return `<button class="filter-pill ${isActive ? 'filter-pill--active' : ''}" data-action="toggle-account-type-filter" data-type="${t}" ${style}>${t}</button>`;
    }).join('') || `<p style="font-size:var(--fs-xs); color:var(--c-on-surface-secondary)">No hay cuentas en esta vista.</p>`;
    
    const filteredAccounts = visibleAccounts.filter(c => filteredAccountTypes.has(toSentenceCase(c.tipo || 'S/T')));
    const totalFiltrado = filteredAccounts.reduce((sum, c) => sum + (saldos[c.id] || 0), 0);
    
    const treeData = [];
    filteredAccounts.forEach(c => {
        const saldo = saldos[c.id] || 0;
        if (saldo > 0) {
            treeData.push({ tipo: toSentenceCase(c.tipo || 'S/T'), nombre: c.nombre, saldo: saldo / 100 });
        }
    });

    container.innerHTML = `
        <div class="card__content" style="padding-top:0;">
            <div class="patrimonio-header-grid__kpi" style="margin-bottom: var(--sp-4);">
                <h4 class="kpi-item__label">Patrimonio Neto (Seleccionado)</h4>
                <strong id="patrimonio-total-balance" class="kpi-item__value" style="font-size: 2rem; line-height: 1.1;">${formatCurrency(totalFiltrado)}</strong>
            </div>
            <div class="patrimonio-header-grid__filters" style="margin-bottom: var(--sp-4);">
                <h4 class="kpi-item__label">Filtros por tipo de activo</h4>
                <div id="filter-account-types-pills" class="filter-pills" style="margin-bottom: 0;">${pillsHTML}</div>
            </div>
            <div id="liquid-assets-chart-container" class="chart-container" style="height: 250px; margin-bottom: var(--sp-4);"><canvas id="liquid-assets-chart"></canvas></div>
            <div id="patrimonio-cuentas-lista"></div>
        </div>`;

    const chartCtx = select('liquid-assets-chart')?.getContext('2d');
    if (chartCtx) {
        const existingChart = Chart.getChart('liquid-assets-chart');
        if (existingChart) existingChart.destroy();
        if (treeData.length > 0) {
            liquidAssetsChart = new Chart(chartCtx, { type: 'treemap', data: { datasets: [{ tree: treeData, key: 'saldo', groups: ['tipo', 'nombre'], spacing: 0.5, borderWidth: 1.5, borderColor: getComputedStyle(document.body).getPropertyValue('--c-background'), backgroundColor: (ctx) => (ctx.type === 'data' ? colorMap[ctx.raw._data.tipo] || 'grey' : 'transparent'), labels: { display: true, color: '#FFFFFF', font: { size: 11, weight: '600' }, align: 'center', position: 'middle', formatter: (ctx) => (ctx.raw.g.includes(ctx.raw._data.nombre) ? ctx.raw._data.nombre.split(' ') : null) } }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => `${ctx.raw._data.nombre}: ${formatCurrency(ctx.raw.v * 100)}` } }, datalabels: { display: false } }, onClick: (e) => e.native && e.native.stopPropagation() } });
        } else {
            select('liquid-assets-chart-container').innerHTML = `<div class="empty-state" style="padding:16px 0; background:transparent; border:none;"><p>No hay activos con saldo positivo para mostrar.</p></div>`;
        }
    }
    
    const listaContainer = select('patrimonio-cuentas-lista');
    if (listaContainer) {
        const accountsByType = filteredAccounts.reduce((acc, c) => { 
            const tipo = toSentenceCase(c.tipo || 'S/T'); 
            if (!acc[tipo]) acc[tipo] = []; 
            acc[tipo].push(c); 
            return acc; 
        }, {});

        listaContainer.innerHTML = Object.keys(accountsByType).sort().map(tipo => {
            const accountsInType = accountsByType[tipo];
            const typeBalance = accountsInType.reduce((sum, acc) => sum + (saldos[acc.id] || 0), 0);
            const porcentajeGlobal = totalFiltrado > 0 ? (typeBalance / totalFiltrado) * 100 : 0;
            const accountsHtml = accountsInType
                .filter(c => (saldos[c.id] || 0) !== 0) // <--- ESTO ES LO QUE AÑADIMOS (Oculta si es 0)
                .sort((a,b) => a.nombre.localeCompare(b.nombre))
                .map(c => 
                    `<div class="modal__list-item" data-action="view-account-details" data-id="${c.id}" ${c.esInversion ? 'data-is-investment="true"' : ''} style="cursor: pointer; padding: var(--sp-2) 0;">
                        <div>
                            <span style="display: block;">${c.nombre}</span>
                            <small style="color: var(--c-on-surface-secondary);">${(saldos[c.id] || 0) / typeBalance * 100 > 0 ? ((saldos[c.id] || 0) / typeBalance * 100).toFixed(1) + '% de ' + tipo : ''}</small>
                        </div>
                        <div style="display: flex; align-items: center; gap: var(--sp-2);">
                             ${formatCurrencyHTML(saldos[c.id] || 0)}
                             <span class="material-icons" style="font-size: 18px;">chevron_right</span>
                        </div>
                    </div>`
                ).join('');

            if (!accountsHtml) return '';

            return `
                <details class="accordion" style="margin-bottom: var(--sp-2);">
                    <summary>
                        <span class="account-group__name">${tipo}</span>
                        <div style="display:flex; align-items:center; gap:var(--sp-2);">
                            <small style="color: var(--c-on-surface-tertiary); margin-right: var(--sp-2);">${porcentajeGlobal.toFixed(1)}%</small>
                            <span class="account-group__balance">${formatCurrency(typeBalance)}</span>
                            <span class="material-icons accordion__icon">expand_more</span>
                        </div>
                    </summary>
                    <div class="accordion__content" style="padding: 0 var(--sp-3);">${accountsHtml}</div>
                </details>`;
        }).join('');
		
        const investmentItems = listaContainer.querySelectorAll('[data-is-investment="true"]');
        
        investmentItems.forEach(item => {
            let longPressTimer;
            let startX, startY;
            let longPressTriggered = false;

            const startHandler = (e) => {
                e.stopPropagation(); 
                const point = e.touches ? e.touches[0] : e;
                startX = point.clientX;
                startY = point.clientY;
                longPressTriggered = false;

                longPressTimer = setTimeout(() => {
                    longPressTriggered = true;
                    const accountId = item.dataset.id;
                    handleShowIrrHistory({ accountId: accountId });
                }, 500); 
            };

            const moveHandler = (e) => {
				if (!longPressTimer) return;
				const point = e.type === 'touchmove' ? e.touches[0] : e;
                if (Math.abs(point.clientX - startX) > 10 || Math.abs(point.clientY - startY) > 10) {
                    clearTimeout(longPressTimer);
                    longPressTimer = null;
                }
            };

            const endHandler = (e) => {
                clearTimeout(longPressTimer);
                if (longPressTriggered) {
                    e.preventDefault(); 
                    e.stopPropagation(); // <-- ¡LA CORRECCIÓN MÁGICA!
                }
            };
            
            item.addEventListener('mousedown', startHandler);
            item.addEventListener('touchstart', startHandler, { passive: true });
            item.addEventListener('mousemove', moveHandler);
            item.addEventListener('touchmove', moveHandler, { passive: true });
            item.addEventListener('mouseup', endHandler);
            item.addEventListener('touchend', endHandler);
            item.addEventListener('mouseleave', () => clearTimeout(longPressTimer));
        });
    }
	applyInvestmentItemInteractions(listaContainer);
};

const handleShowIrrHistory = async (options) => {
    hapticFeedback('medium');
    
    const titleEl = select('irr-history-title');
    const bodyEl = select('irr-history-body');
    if(bodyEl) bodyEl.innerHTML = `<div style="display: flex; justify-content: center; align-items: center; height: 100%;"><span class="spinner" style="width: 48px; height: 48px;"></span></div>`;
    showModal('irr-history-modal');

    let accountIds = [];
    let title = 'Evolución TIR';

    if (options.accountId) {
        accountIds = [options.accountId];
        const account = db.cuentas.find(c => c.id === options.accountId);
        if (account) title = `Evolución TIR: ${account.nombre}`;
    } else if (options.accountType) {
        accountIds = getVisibleAccounts()
            .filter(c => toSentenceCase(c.tipo || 'S/T') === options.accountType && c.esInversion)
            .map(c => c.id);
        title = `Evolución TIR: ${options.accountType}`;
    }

    if(titleEl) titleEl.textContent = title;
        
    const historyData = await calculateHistoricalIrrForGroup(accountIds);

    if (!historyData || historyData.length < 2) {
        if(bodyEl) bodyEl.innerHTML = `<div class="empty-state"><p>No hay suficientes valoraciones para generar un histórico de TIR para este activo.</p></div>`;
        return;
    }

    if(bodyEl) bodyEl.innerHTML = `<div class="chart-container" style="height: 100%;"><canvas id="irr-history-chart"></canvas></div>`;
    const chartCtx = select('irr-history-chart').getContext('2d');
    const existingChart = Chart.getChart(chartCtx);
    if (existingChart) existingChart.destroy();

    new Chart(chartCtx, {
        type: 'line',
        data: {
            labels: historyData.map(d => new Date(d.date)),
            datasets: [{
                label: 'TIR Anualizada',
                data: historyData.map(d => d.irr * 100),
                borderColor: 'var(--c-info)',
                backgroundColor: 'rgba(191, 90, 242, 0.2)',
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { ticks: { callback: (value) => `${value.toFixed(1)}%` }, title: { display: true, text: 'TIR Anualizada (%)' } },
                x: { type: 'time', time: { unit: 'month', tooltipFormat: 'dd MMM yyyy' } }
            },
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (context) => `TIR: ${context.parsed.y.toFixed(2)}%` } },
                datalabels: { display: false }
            }
        }
    });
};

async function calculateHistoricalIrrForGroup(accountIds) {
    if (!dataLoaded.inversiones) await loadInversiones();
    const allMovements = await AppStore.getAll();
    const accountIdSet = new Set(accountIds);
    
    const timeline = [];
    const valuations = (db.inversiones_historial || []).filter(v => accountIdSet.has(v.cuentaId));
    const cashflows = allMovements.filter(m => {
        return (m.tipo === 'movimiento' && accountIdSet.has(m.cuentaId)) ||
               (m.tipo === 'traspaso' && (accountIdSet.has(m.cuentaOrigenId) || accountIdSet.has(m.cuentaDestinoId)));
    });

    cashflows.forEach(m => {
        let amount = 0;
        if (m.tipo === 'movimiento') amount = m.cantidad;
        else if (m.tipo === 'traspaso') {
            const origenEsInversion = accountIdSet.has(m.cuentaOrigenId);
            const destinoEsInversion = accountIdSet.has(m.cuentaDestinoId);
            if (origenEsInversion && !destinoEsInversion) amount = -m.cantidad;
            else if (!origenEsInversion && destinoEsInversion) amount = m.cantidad;
        }
        if (amount !== 0) {
            timeline.push({ date: new Date(m.fecha), amount: -amount });
        }
    });

    const sortedValuations = valuations.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    const historicalIrr = [];
    const valuationMap = new Map();

    sortedValuations.forEach(v => {
        const dateKey = v.fecha.slice(0, 10);
        if (!valuationMap.has(dateKey)) valuationMap.set(dateKey, 0);
        valuationMap.set(dateKey, valuationMap.get(dateKey) + v.valor);
    });

    for (const [dateKey, totalValue] of valuationMap.entries()) {
        const currentDate = new Date(dateKey);
        
        const cashflowsUpToDate = timeline
            .filter(cf => cf.date <= currentDate)
            .map(cf => ({...cf})); 

        cashflowsUpToDate.push({ date: currentDate, amount: totalValue });
        
        const irr = calculateIRR(cashflowsUpToDate);
        if (!isNaN(irr)) {
            historicalIrr.push({ date: dateKey, irr: irr });
        }
    }

    return historicalIrr;
}
	 
   
        const loadConfig = () => { 
            const userEmailEl = select('config-user-email'); 
            if (userEmailEl && currentUser) userEmailEl.textContent = currentUser.email;  			
        };

/* =============================================================== */
/* === MOTOR DE CÁLCULO CORREGIDO (SOLUCIÓN MATEMÁTICA) === */
/* =============================================================== */
const calculateOperatingTotals = (movs, visibleAccountIds) => {
    let ingresos = 0;
    let gastos = 0;

    movs.forEach(m => {
        // 1. FILTRO DE SEGURIDAD:
        // Si la cuenta no pertenece a la "Caja" que estás mirando (A o B), la ignoramos.
        if (!visibleAccountIds.has(m.cuentaId)) return;

        // 2. REGLA DE ORO: Ignorar movimientos que no son reales
        // - Traspaso: Mover dinero de un bolsillo a otro no es gastar.
        // - Ajuste/Saldo Inicial: Son correcciones técnicas, no flujo de caja.
        if (['traspaso', 'ajuste', 'saldo_inicial'].includes(m.tipo)) return;

        // 3. MATEMÁTICA PURA BLINDADA (Aquí estaba el error)
        // Convertimos el valor a número DECIMAL antes de sumar para evitar que "pegue" textos.
        const cantidadNum = parseFloat(m.cantidad);
        
        // Si por error hay un dato corrupto que no es número, lo saltamos
        if (isNaN(cantidadNum)) return;

        // > 0 (Positivo) = Ingreso
        // < 0 (Negativo) = Gasto
        if (cantidadNum >= 0) {
            ingresos += cantidadNum;
        } else {
            gastos += cantidadNum; // Al ser negativo, restará visualmente luego
        }
    });

    return { ingresos, gastos, saldoNeto: ingresos + gastos };
};

const updateDashboardSummaryCard = async () => {
    // Obtenemos movimientos y cuentas
    const { current } = await getFilteredMovements(false);
    const visibleAccountIds = new Set(getVisibleAccounts().map(c => c.id));

    // Usamos el nuevo cálculo
    const totals = calculateOperatingTotals(current, visibleAccountIds);

    // Pintamos en pantalla con animación
    const ingresosEl = document.getElementById('kpi-ingresos-value');
    const gastosEl = document.getElementById('kpi-gastos-value');
    const netoEl = document.getElementById('kpi-saldo-neto-value');
    const ahorroEl = document.getElementById('kpi-tasa-ahorro-value');

    if (ingresosEl) animateCountUp(ingresosEl, totals.ingresos, 1000, true, '+');
    if (gastosEl) animateCountUp(gastosEl, totals.gastos, 1000, true, ''); 
    if (netoEl) animateCountUp(netoEl, totals.saldoNeto, 1000, true);

    if (ahorroEl && totals.ingresos > 0) {
        const tasaAhorro = (totals.saldoNeto / totals.ingresos) * 100;
        ahorroEl.textContent = tasaAhorro.toFixed(1) + '%';
        ahorroEl.style.color = tasaAhorro >= 20 ? 'var(--c-success)' : (tasaAhorro > 0 ? 'var(--c-warning)' : 'var(--c-danger)');
    } else if (ahorroEl) {
        ahorroEl.textContent = '0%';
    }
};

const renderPanelPage = async () => {
    const container = select(PAGE_IDS.PANEL);
    if (!container) return;

    // --- 1. LIMPIEZA TOTAL DEL CONTENEDOR PADRE ---
    // Forzamos a que el contenedor de la página no tenga relleno ni margen
    container.style.setProperty('padding', '0', 'important');
    container.style.setProperty('margin', '0', 'important');
    container.style.overflowX = 'hidden';

    // --- VARIABLES ---
    const gap = '5px'; // TU OBJETIVO: 5px
    
    const bigKpiStyle = 'font-size: 1.8rem; font-weight: 800; line-height: 1.1; white-space: nowrap; overflow: visible; font-family: "Roboto Condensed", sans-serif;';
    const titleStyle = 'font-size: 0.7rem; font-weight: 700; color: #FFFFFF; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.5px; opacity: 0.9;';
    
    // ESTILO BASE DE TARJETA
    // Importante: margin: 0 para que no empuje nada por fuera.
    const cardStyle = `
        width: 98%; 
        padding: 12px 15px; 
        border-radius: 16px; 
        border: 1px solid rgba(255, 255, 255, 0.1); 
        box-sizing: border-box; 
        box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        margin: 0 !important; /* CERO MARGENES EXTERNOS */
    `;

    container.innerHTML = `
    <div style="
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        width: 100%; 
        
        /* AQUÍ ESTÁ LA CLAVE DEL TECHO: */
        padding-top: ${gap} !important;  /* Exactamente 5px desde arriba */
        margin-top: 0 !important;        /* Nada de márgenes extra */
        
        gap: ${gap} !important;          /* 3px entre tarjetas */
        padding-bottom: 100px;
    ">
        
        <div class="hero-card fade-in-up" data-action="ver-flujo-caja" style="${cardStyle} background: rgba(255,255,255,0.03); cursor: pointer; margin-top: 0 !important;">
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 6px;">
                <div style="font-size: 0.85rem; font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 1px;">
                    RESUMEN
                </div>
                
                <div class="report-filters" style="margin: 0;" onclick="event.stopPropagation()">
                    <select id="filter-periodo" class="form-select report-period-selector" style="font-size: 0.75rem; padding: 2px 10px; height: auto; background-color: rgba(255,255,255,0.1); border: 1px solid var(--c-outline); border-radius: 6px; color: #FFFFFF;">
                        <option value="mes-actual">Este Mes</option>
                        <option value="año-actual">Este Año</option>
                        <option value="custom">Personalizado</option>
                    </select>
                </div>
            </div>

            <div id="custom-date-filters" class="form-grid hidden" onclick="event.stopPropagation()" style="grid-template-columns: 1fr 1fr; gap: 3px; margin-bottom: 8px; background: rgba(0,0,0,0.2); padding: 5px; border-radius: 8px;">
                <div style="display:flex; flex-direction:column;">
                     <label style="font-size:0.7rem; color:#FFFFFF;">Desde</label>
                     <input type="date" id="filter-fecha-inicio" class="form-input" style="font-size: 0.85rem; padding: 2px; background: var(--c-surface); color: white;">
                </div>
                <div style="display:flex; flex-direction:column;">
                     <label style="font-size:0.7rem; color:#FFFFFF;">Hasta</label>
                     <input type="date" id="filter-fecha-fin" class="form-input" style="font-size: 0.85rem; padding: 2px; background: var(--c-surface); color: white;">
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3px; text-align: center; margin-bottom: 6px;">
                <div>
                    <div style="${titleStyle}">INGRESOS</div>
                    <div id="kpi-ingresos-value" class="skeleton" style="${bigKpiStyle} color: var(--c-success);">+0,00 €</div>
                </div>
                <div>
                    <div style="${titleStyle}">GASTOS</div>
                    <div id="kpi-gastos-value" class="skeleton" style="${bigKpiStyle} color: var(--c-danger);">-0,00 €</div>
                </div>
            </div>

            <div style="height: 1px; background-color: var(--c-outline); margin: 4px 0 6px 0; opacity: 0.3;"></div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3px; text-align: center;">
                <div>
                    <div style="${titleStyle}">NETO</div>
                    <div id="kpi-saldo-neto-value" class="skeleton" style="${bigKpiStyle}">0,00 €</div>
                </div>
                <div>
                    <div style="${titleStyle}">AHORRO</div>
                    <div id="kpi-tasa-ahorro-value" class="skeleton" style="${bigKpiStyle}">0.00%</div>
                </div>
            </div>
        </div>

        <div class="hero-card fade-in-up border-ingreso" onclick="goToPatrimonioChart()" style="${cardStyle} cursor: pointer; text-align: center; background: rgba(0,0,0,0.2);">
            <div style="margin-bottom: 6px;">
                <div style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: #FFFFFF; letter-spacing: 2px;">
                    PATRIMONIO NETO
                </div>
                <div id="kpi-patrimonio-neto-value" class="hero-value kpi-resaltado-azul skeleton" style="font-size: 2.8rem; line-height: 1.1; margin: 2px 0; white-space: nowrap;">0,00 €</div>
            </div>
            
            <div style="background-color: rgba(255,255,255,0.05); border-radius: 8px; padding: 5px 10px; display: grid; grid-template-columns: 1fr 1px 1fr; align-items: center; gap: 3px;">
                <div style="text-align: center;">
                    <div style="${titleStyle}">Liquidez</div>
                    <div id="kpi-liquidez-value" class="skeleton" style="${bigKpiStyle} font-size: 1.4rem;">0,00 €</div>
                </div>
                <div style="height: 20px; background-color: var(--c-outline); opacity: 0.5;"></div>
                <div style="text-align: center;">
                    <div style="${titleStyle}">Capital Inv.</div>
                    <div id="kpi-capital-invertido-total" class="skeleton" style="${bigKpiStyle} font-size: 1.4rem;">0,00 €</div>
                </div>
            </div>
        </div>

        <div class="hero-card fade-in-up border-ingreso" onclick="goToInversionesChart()" style="${cardStyle} cursor: pointer; background: linear-gradient(180deg, rgba(191, 90, 242, 0.1) 0%, rgba(0,0,0,0) 100%);">
            
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 6px;">
                <div style="text-align: left;">
                    <div style="${titleStyle}">Capital Inv.</div>
                    <div id="new-card-capital" class="skeleton" style="${bigKpiStyle} font-size: 1.6rem;">0,00 €</div>
                </div>
                
                <div style="text-align: right;">
                    <div style="${titleStyle}">P&L</div>
                    <div id="new-card-pnl" class="skeleton" style="${bigKpiStyle} font-size: 1.6rem;">0,00 €</div>
                </div>
            </div>

            <div style="text-align: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 4px;">
                <div style="${titleStyle} color: #FFFFFF; font-size: 0.8rem;">
                    Valor Real Mercado
                </div>
                <div id="new-card-market-value" class="skeleton" style="${bigKpiStyle} font-size: 2.2rem;">0,00 €</div>
            </div>
        </div>

        <div class="hero-card fade-in-up border-warning" style="${cardStyle} background: linear-gradient(180deg, var(--c-surface) 0%, rgba(0,0,0,0.2) 100%);">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3px;">
                <div style="text-align: center;">
                    <div style="${titleStyle}"> <span class="material-icons" style="font-size: 12px; vertical-align: middle;">shield</span> COBERTURA</div>
                    <div id="health-runway-val" class="skeleton" style="font-size: 1.5rem; font-weight: 800; color: #FFD60A; white-space: nowrap;">0.0 Meses</div>
                </div>
                <div style="text-align: center; border-left: 1px solid var(--c-outline);">
                    <div style="${titleStyle}"> <span class="material-icons" style="font-size: 12px; vertical-align: middle;">flag</span> LIBERTAD</div>
                    <div id="health-fi-val" class="skeleton" style="font-size: 1.5rem; font-weight: 800; color: #39FF14; white-space: nowrap;">0.00%</div>
                </div>
            </div>
        </div>

    </div>
    
    <div id="concepto-totals-list" style="display:none;"></div>
    <canvas id="conceptos-chart" style="display:none;"></canvas>
    <div id="net-worth-chart-container" style="display:none;"><canvas id="net-worth-chart"></canvas></div>
    `;
    
    populateAllDropdowns();
    await Promise.all([loadPresupuestos(), loadInversiones()]);
	updateDashboardSummaryCard();
    scheduleDashboardUpdate();
};

 const showEstrategiaTab = (tabName) => {
    // 1. Gestionar el estado activo de los botones de las pestañas
    const tabButton = document.querySelector(`.tab-item[data-tab="${tabName}"]`);
    if (tabButton) {
        selectAll('.tab-item').forEach(btn => btn.classList.remove('tab-item--active'));
        tabButton.classList.add('tab-item--active');
    }

    // 2. Gestionar la visibilidad de los contenedores de contenido
    const contentContainer = select(`estrategia-${tabName}-content`);
    if (contentContainer) {
        selectAll('.tab-content').forEach(content => content.classList.remove('tab-content--active'));
        contentContainer.classList.add('tab-content--active');
    } else {
        // Si el contenedor no existe, no hacemos nada más.
        console.error(`Contenedor de pestaña no encontrado: estrategia-${tabName}-content`);
        return;
    }
    
    // 3. Destruir gráficos anteriores para evitar conflictos
    destroyAllCharts();

    // 4. Llamar a la función de renderizado específica para esa pestaña
    switch (tabName) {
        case 'planificacion':
            renderPlanificacionPage();
            break;
        case 'activos':
            renderPatrimonioPage();
            break;
        case 'informes':
            renderEstrategiaInformes();
            break;
    }
};
// ===============================================================
// === COMPONENTE TARJETA DE MOVIMIENTO (CORREGIDO) ===
// ===============================================================
const TransactionCardComponent = (m) => {
    // 1. DEFINIR VARIABLES (Aquí estaba el fallo antes)
    const concepto = db.conceptos.find(c => c.id === m.conceptoId);
    
    // Calculamos el nombre. Si no tiene concepto, ponemos 'Movimiento'
    let conceptoName = concepto ? concepto.nombre : 'Movimiento';
    
    // Si es un traspaso, ignoramos el concepto y ponemos "Traspaso"
    if (m.tipo === 'traspaso') conceptoName = 'Traspaso';

    // 2. Formatos de fecha y dinero
    const dateStr = new Date(m.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    
    // Colores según tipo
    let amountClass = 'var(--c-on-surface)';
    let signo = '';
    
    if (m.tipo === 'ingreso') {
        amountClass = 'var(--c-success)';
        signo = '+';
    } else if (m.tipo === 'gasto') {
        amountClass = 'var(--c-on-surface)'; // O var(--c-danger) si prefieres rojo
        signo = '-';
    }

    // Icono y color del avatar
    const iconName = m.tipo === 'traspaso' ? 'swap_horiz' : (concepto?.icono || 'paid');
    const iconColor = m.tipo === 'traspaso' ? '#999' : (concepto?.color || '#666');
    const avatarHTML = `
        <div style="width: 40px; height: 40px; border-radius: 50%; background: ${iconColor}20; color: ${iconColor}; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
            <span class="material-icons" style="font-size: 20px;">${iconName}</span>
        </div>`;

    // 3. RETORNAR EL HTML (Con sistema de clic para editar)
    return `
    <div class="transaction-card list-item-animate" data-action="open-movement-form" data-id="${m.id}" style="padding: 12px 15px; display: flex; align-items: center; border-bottom: 1px solid var(--c-outline); cursor: pointer; transition: background 0.2s;">
        
        ${avatarHTML}
        
        <div style="flex: 1; min-width: 0; padding-right: 10px;">
            <div style="font-weight: 600; font-size: 0.95rem; color: var(--c-on-surface); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${conceptoName}
            </div>
            <div style="font-size: 0.8rem; color: var(--c-on-surface-secondary); margin-top: 2px;">
                ${dateStr} • ${m.descripcion || 'Sin nota'}
            </div>
        </div>
        
        <div style="font-weight: 700; font-size: 0.95rem; color: ${amountClass}; white-space: nowrap;">
            ${signo}${formatCurrency(m.cantidad)}
        </div>
    </div>
    `;
};

// Variable para recordar la selección del usuario (por defecto 3 Meses)
let currentPortfolioTimeRange = '3M';

async function renderPortfolioEvolutionChart(targetContainerId) {
    const container = select(targetContainerId);
    if (!container) return;

    // 1. Estructura HTML con Botones de Filtro Integrados
    // Solo inyectamos el esqueleto si no existe ya el canvas, para evitar parpadeos al cambiar de rango
    if (!select('portfolio-evolution-chart')) {
        const ranges = [
            { id: '1M', label: '1M' },
            { id: '3M', label: '3M' },
            { id: 'YTD', label: 'Este Año' },
            { id: '1A', label: '1 Año' },
            { id: 'MAX', label: 'Todo' }
        ];

        const buttonsHtml = ranges.map(r => {
            const isActive = currentPortfolioTimeRange === r.id ? 'filter-pill--active' : '';
            const activeStyle = isActive ? `background-color: var(--c-primary); color: white; border-color: var(--c-primary);` : '';
            return `<button class="filter-pill ${isActive}" style="font-size: 0.7rem; padding: 2px 8px; ${activeStyle}" onclick="changePortfolioRange('${r.id}')">${r.label}</button>`;
        }).join('');

        container.innerHTML = `
            <div style="display: flex; justify-content: flex-end; gap: 5px; margin-bottom: 10px;">
                ${buttonsHtml}
            </div>
            <div class="chart-container skeleton" style="height: 240px; border-radius: var(--border-radius-lg);">
                <canvas id="portfolio-evolution-chart"></canvas>
            </div>`;
    }

    // 2. Obtención de datos
    if (!dataLoaded.inversiones) await loadInversiones();
    const allMovements = await AppStore.getAll();
    const filteredInvestmentAccounts = getVisibleAccounts().filter(account => !deselectedInvestmentTypesFilter.has(toSentenceCase(account.tipo || 'S/T')) && account.esInversion);
    const filteredAccountIds = new Set(filteredInvestmentAccounts.map(c => c.id));

    if (filteredInvestmentAccounts.length === 0) {
        container.innerHTML = `<div class="empty-state" style="padding:16px 0; background:transparent; border:none;"><p>No hay activos seleccionados.</p></div>`;
        return;
    }

    // 3. Procesamiento de datos (Timeline Completo)
    const timeline = [];
    const history = (db.inversiones_historial || []).filter(h => filteredAccountIds.has(h.cuentaId));
    history.forEach(v => timeline.push({ date: v.fecha.slice(0, 10), type: 'valuation', value: v.valor, accountId: v.cuentaId }));
    
    const cashFlowMovements = allMovements.filter(m => (m.tipo === 'movimiento' && filteredAccountIds.has(m.cuentaId)) || (m.tipo === 'traspaso' && (filteredAccountIds.has(m.cuentaOrigenId) || filteredAccountIds.has(m.cuentaDestinoId))));
    cashFlowMovements.forEach(m => {
        let amount = 0;
        if (m.tipo === 'movimiento') amount = m.cantidad;
        else if (m.tipo === 'traspaso') {
            if (filteredAccountIds.has(m.cuentaDestinoId) && !filteredAccountIds.has(m.cuentaOrigenId)) amount = m.cantidad;
            if (filteredAccountIds.has(m.cuentaOrigenId) && !filteredAccountIds.has(m.cuentaDestinoId)) amount = -m.cantidad;
        }
        if (amount !== 0) timeline.push({ date: m.fecha.slice(0, 10), type: 'cashflow', value: amount });
    });
    
    if (timeline.length < 1) {
         container.querySelector('.chart-container').innerHTML = `<div class="empty-state" style="padding:16px 0; background:transparent; border:none;"><p>Datos insuficientes.</p></div>`;
         return;
    }
    
    timeline.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Generar datos diarios acumulados
    const dailyData = new Map();
    let runningCapital = 0;
    const lastKnownValues = new Map();
    timeline.forEach(event => {
        if (event.type === 'cashflow') runningCapital += event.value;
        else if (event.type === 'valuation') lastKnownValues.set(event.accountId, event.value);
        
        let totalValue = 0;
        for (const value of lastKnownValues.values()) totalValue += value;
        dailyData.set(event.date, { capital: runningCapital, value: totalValue });
    });

    const sortedFullDates = [...dailyData.keys()].sort();

    // 4. LÓGICA DE FILTRADO DE TIEMPO
    const today = new Date();
    let cutoffDate = new Date('2000-01-01'); // Por defecto MAX

    if (currentPortfolioTimeRange === '1M') cutoffDate = new Date(today.setMonth(today.getMonth() - 1));
    else if (currentPortfolioTimeRange === '3M') cutoffDate = new Date(today.setMonth(today.getMonth() - 3));
    else if (currentPortfolioTimeRange === '1A') cutoffDate = new Date(today.setFullYear(today.getFullYear() - 1));
    else if (currentPortfolioTimeRange === 'YTD') cutoffDate = new Date(today.getFullYear(), 0, 1);

    const cutoffDateStr = cutoffDate.toISOString().slice(0, 10);
    
    // Filtramos las fechas
    let chartDates = sortedFullDates.filter(d => d >= cutoffDateStr);

    // Ajuste de "Punto de Partida": Si cortamos datos, añadimos el punto inicial
    if (chartDates.length < sortedFullDates.length) {
        const lastDateBeforeCutoff = sortedFullDates.reverse().find(d => d < cutoffDateStr);
        if (lastDateBeforeCutoff) {
            const startState = dailyData.get(lastDateBeforeCutoff);
            if (chartDates[0] !== cutoffDateStr) {
                chartDates.unshift(cutoffDateStr);
                dailyData.set(cutoffDateStr, startState);
            }
        }
    }
    // Fallback si no hay datos recientes
    if (chartDates.length === 0 && sortedFullDates.length > 0) {
        chartDates.push(sortedFullDates[sortedFullDates.length - 1]);
    }
    chartDates.sort();

    const chartLabels = chartDates;
    const capitalData = chartDates.map(date => dailyData.get(date).capital / 100);
    const totalValueData = chartDates.map(date => dailyData.get(date).value / 100);

    // 5. Renderizado
    const chartCanvas = select('portfolio-evolution-chart');
    if (!chartCanvas) return;
    const chartCtx = chartCanvas.getContext('2d');

    const existingChart = Chart.getChart(chartCanvas);
    if (existingChart) existingChart.destroy();
    
    chartCanvas.closest('.chart-container').classList.remove('skeleton');

    new Chart(chartCtx, {
        type: 'line',
        data: {
            labels: chartLabels,
            datasets: [
                {
                    label: 'Valor de Mercado',
                    data: totalValueData,
                    borderColor: '#00B34D', 
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    tension: 0.3,
                    order: 0,
                    // El relleno verde/rojo que muestra la ganancia/pérdida
                    fill: {
                        target: '1', 
                        above: 'rgba(0, 179, 77, 0.25)',   
                        below: 'rgba(255, 59, 48, 0.25)'   
                    }
                },
                {
                    label: 'Capital Aportado',
                    data: capitalData,
                    borderColor: 'rgba(255, 255, 255, 0.6)', 
                    borderWidth: 1.5,
                    borderDash: [3, 3], // Punteado para diferenciarlo claramente
                    pointRadius: 0,
                    fill: false,
                    tension: 0.1,
                    order: 1
                }
            ]
        },
        options: {
            responsive: true, 
            maintainAspectRatio: false,
            animation: { duration: 300 }, // Animación suave al cambiar de filtro
            scales: {
                y: { 
                    display: true,
                    position: 'right',
                    // IMPORTANTE: Dejamos que Chart.js haga zoom automático.
                    // NO ponemos beginAtZero: true. Así se amplifican las diferencias.
                    grid: { color: 'rgba(255,255,255,0.05)', borderDash: [5,5] },
                    ticks: { 
                        callback: value => (value/1000).toFixed(1) + 'k',
                        color: 'rgba(255,255,255,0.5)',
                        font: { size: 9 }
                    }
                },
                x: { 
                    type: 'time', 
                    time: { unit: 'month', tooltipFormat: 'dd MMM yyyy' }, 
                    grid: { display: false },
                    ticks: { maxTicksLimit: 5, color: 'rgba(255,255,255,0.5)', font: { size: 9 } } 
                }
            },
            plugins: {
                legend: { display: false }, // Ocultamos leyenda para ganar espacio, los colores lo dicen todo
                datalabels: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(20, 20, 30, 0.95)',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                    callbacks: {
                        label: (context) => `${context.dataset.label}: ${formatCurrency(context.raw * 100)}`,
                        footer: (tooltipItems) => {
                            const val = tooltipItems[0].parsed.y;
                            const cap = tooltipItems[1].parsed.y;
                            const diff = val - cap;
                            const pct = cap !== 0 ? (diff / cap) * 100 : 0;
                            const sign = diff >= 0 ? '+' : '';
                            return `P&L: ${sign}${formatCurrency(diff * 100)} (${sign}${pct.toFixed(2)}%)`;
                        }
                    }
                }
            },
            interaction: { mode: 'index', intersect: false }
        }
    });
}

// Función global auxiliar para cambiar el rango (necesaria para el onclick del HTML)
window.changePortfolioRange = (newRange) => {
    // Si pulsamos el mismo, no hacemos nada
    if (currentPortfolioTimeRange === newRange) return;
    
    currentPortfolioTimeRange = newRange;
    hapticFeedback('light');
    
    // 1. Actualizar visualmente los botones sin recargar todo el HTML
    const buttons = document.querySelectorAll('#portfolio-evolution-container .filter-pill');
    buttons.forEach(btn => {
        if (btn.textContent.includes(newRange) || btn.textContent === newRange || btn.getAttribute('onclick').includes(newRange)) {
            btn.classList.add('filter-pill--active');
            btn.style.backgroundColor = 'var(--c-primary)';
            btn.style.color = 'white';
            btn.style.borderColor = 'var(--c-primary)';
        } else {
            btn.classList.remove('filter-pill--active');
            btn.style.backgroundColor = '';
            btn.style.color = '';
            btn.style.borderColor = '';
        }
    });

    // 2. Recargar solo el gráfico
    renderPortfolioEvolutionChart('portfolio-evolution-container');
};

// =================================================================
// === INICIO: NUEVO MOTOR DE RENDERIZADO DE INFORMES (v2.0) ===
// =================================================================

// Esta variable global evitará errores de "Canvas en uso"
let informeActivoChart = null;

async function renderInformeResumenEjecutivo(container) {
    // 1. Ya no se genera el HTML de los filtros aquí.
    container.innerHTML = `<div class="skeleton" style="height: 100px;"></div>`;

    // 2. EXTRAEMOS LAS FECHAS DEL SELECTOR que ya existe en el DOM
    const { sDate, eDate } = getDatesFromReportFilter('resumen_ejecutivo');

    if (!sDate || !eDate) {
        container.innerHTML = `<p class="form-label">Por favor, selecciona un rango de fechas válido.</p>`;
        return;
    }

    // 3. OBTENEMOS y FILTRAMOS LOS DATOS (esta lógica no cambia)
    const conceptoInicial = db.conceptos.find(c => c.nombre.toLowerCase() === 'inicial');
    const conceptoInicialId = conceptoInicial ? conceptoInicial.id : null;

    const snapshot = await fbDb.collection('users').doc(currentUser.uid).collection('movimientos')
        .where('fecha', '>=', sDate.toISOString())
        .where('fecha', '<=', eDate.toISOString())
        .get();

    const visibleAccountIds = new Set(getVisibleAccounts().map(c => c.id));
    const movements = snapshot.docs.map(doc => doc.data()).filter(m => {
        if (m.conceptoId === conceptoInicialId) return false;
        if (m.tipo === 'traspaso') return visibleAccountIds.has(m.cuentaOrigenId) || visibleAccountIds.has(m.cuentaDestinoId);
        return visibleAccountIds.has(m.cuentaId);
    });

    const saldos = await getSaldos();
    const patrimonioNeto = Object.values(saldos).reduce((sum, s) => sum + s, 0);

    const { ingresos, gastos, saldoNeto } = calculateTotals(movements, visibleAccountIds);
    const tasaAhorro = ingresos > 0 ? (saldoNeto / ingresos) * 100 : 0;

    // 4. RENDERIZAMOS LOS RESULTADOS en el contenedor que nos han pasado
    container.innerHTML = `
        <div class="kpi-grid" id="kpi-data-resumen_ejecutivo">
             <div class="kpi-item" data-label="Patrimonio Neto Total" data-value="${patrimonioNeto}">
                <h4 class="kpi-item__label">Patrimonio Neto Total</h4>
                <strong class="kpi-item__value">${formatCurrency(patrimonioNeto)}</strong>
                <div class="kpi-item__comparison">Valor actual global</div>
            </div>
            <div class="kpi-item" data-label="Flujo de Caja Neto" data-value="${saldoNeto}">
                <h4 class="kpi-item__label">Flujo de Caja Neto</h4>
                <strong class="kpi-item__value ${saldoNeto >= 0 ? 'text-positive' : 'text-negative'}">${formatCurrency(saldoNeto)}</strong>
            </div>
            <div class="kpi-item" data-label="Tasa de Ahorro" data-value="${tasaAhorro.toFixed(1)}%">
                <h4 class="kpi-item__label">Tasa de Ahorro</h4>
                <strong class="kpi-item__value ${tasaAhorro >= 10 ? 'text-positive' : 'text-warning'}">${tasaAhorro.toFixed(1)}%</strong>
            </div>
        </div>`;
}


async function renderInformeAsignacionActivos(container) {
    // CAMBIO 1: La función interna 'getAssetClass' ya no es necesaria y se ha eliminado.

    const saldos = await getSaldos();
    
    // CAMBIO 2: Modificamos la lógica de agrupación. Ahora usamos el "tipo" de la cuenta directamente.
    const assetAllocation = getVisibleAccounts().reduce((acc, cuenta) => {
        // Mantenemos la exclusión de las deudas para no distorsionar el gráfico de activos.
        if (cuenta.tipo.toUpperCase() !== 'PRÉSTAMO' && cuenta.tipo.toUpperCase() !== 'TARJETA DE CRÉDITO') {
            // Usamos 'toSentenceCase' para un formato limpio (ej: 'banco' -> 'Banco')
            const assetType = toSentenceCase(cuenta.tipo || 'Sin Tipo');
            acc[assetType] = (acc[assetType] || 0) + (saldos[cuenta.id] || 0);
        }
        return acc;
    }, {});

    const labels = Object.keys(assetAllocation);
    const data = Object.values(assetAllocation).map(v => v / 100);

    // CAMBIO 3: Actualizamos el texto descriptivo para que refleje la nueva vista detallada.
    container.innerHTML = `
        <p class="form-label" style="margin-bottom: var(--sp-3);">Distribución detallada de tu patrimonio, agrupado por el tipo específico de cada cuenta. Esto te da una visión granular de la composición de tus activos.</p>
        <div class="chart-container" style="height: 280px;">
            <canvas id="asignacion-activos-chart"></canvas>
        </div>
        <!-- Aquí iría la tabla de rebalanceo en una futura iteración -->
    `;

    const ctx = select('asignacion-activos-chart').getContext('2d');
    
    // El resto de la lógica del gráfico no necesita cambios, ya que se adapta a los nuevos datos.
    informeActivoChart = new Chart(ctx, {
        type: 'doughnut',
        data: { 
            labels, 
            datasets: [{ 
                data, 
                backgroundColor: ['#007AFF', '#30D158', '#FFD60A', '#FF3B30', '#BF5AF2', '#5E5CE6', '#FF9F0A', '#45B6E9', '#D158A7'] 
            }] 
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false, 
            plugins: { 
                legend: { position: 'right' }, 
                datalabels: { 
                    formatter: (val, ctx) => { 
                        const sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0); 
                        const percentage = (val * 100 / sum);
                        // Solo mostramos la etiqueta si es mayor al 3% para no saturar el gráfico
                        return percentage > 3 ? percentage.toFixed(1) + '%' : '';
                    }, 
                    color: '#fff',
                    font: {
                        weight: 'bold'
                    }
                } 
            } 
        }
    });
}
    
    /**
     * Renderiza el informe: Scorecard de Rendimiento de Inversiones.
     */
    async function renderInformeRendimientoInversiones(container) {
    const investmentAccounts = getVisibleAccounts().filter(c => c.esInversion);
    if (investmentAccounts.length === 0) {
        container.innerHTML = `<div class="empty-state"><p>No tienes cuentas marcadas como "inversión".</p></div>`;
        return;
    }

    // 1. OBTENER DATOS DE CADA ACTIVO
    let performanceData = await Promise.all(
        investmentAccounts.map(async (cuenta) => {
            const perf = await calculatePortfolioPerformance(cuenta.id);
            return { ...cuenta, ...perf };
        })
    );

    // 2. ORDENAR LOS DATOS por valor actual de mayor a menor
    performanceData.sort((a, b) => b.valorActual - a.valorActual);

    // 3. CALCULAR EL SUMARIO TOTAL
    const portfolioTotal = await calculatePortfolioPerformance(); // Obtenemos el rendimiento global

    // 4. CONSTRUIR EL HTML DE LA TABLA
    let tableHtml = `
        <p class="form-label" style="margin-bottom: var(--sp-3);">Comparativa de rendimiento de tus activos de inversión, ordenados por valor de mercado.</p>
        <div style="overflow-x: auto;">
            <table id="table-data-rendimiento_inversiones" style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th>Activo</th>
                        <th>Valor Actual</th>
                        <th>P&L (€)</th>
                        <th>P&L (%)</th>
                        <th>TIR Anual</th>
                    </tr>
                </thead>
                <tbody>`;

    // Añadir una fila por cada activo
    performanceData.forEach(perf => {
        const pnlClass = perf.pnlAbsoluto >= 0 ? 'text-positive' : 'text-negative';
        const tirClass = perf.irr >= 0.05 ? 'text-positive' : (perf.irr >= 0 ? 'text-warning' : 'text-negative');
        tableHtml += `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid var(--c-outline);">${perf.nombre}</td>
                <td style="padding: 8px; border-bottom: 1px solid var(--c-outline); text-align: right;">${formatCurrencyHTML(perf.valorActual)}</td>
                <td style="padding: 8px; border-bottom: 1px solid var(--c-outline); text-align: right;" class="${pnlClass}">${formatCurrency(perf.pnlAbsoluto)}</td>
                <td style="padding: 8px; border-bottom: 1px solid var(--c-outline); text-align: right;" class="${pnlClass}">${perf.pnlPorcentual.toFixed(2)}%</td>
                <td style="padding: 8px; border-bottom: 1px solid var(--c-outline); text-align: right;" class="${tirClass}">${(perf.irr * 100).toFixed(2)}%</td>
            </tr>`;
    });

    tableHtml += `</tbody>`;

    // --- AÑADIR LA NUEVA FILA DE SUMARIO ---
    const totalPnlClass = portfolioTotal.pnlAbsoluto >= 0 ? 'text-positive' : 'text-negative';
    const totalTirClass = portfolioTotal.irr >= 0.05 ? 'text-positive' : (portfolioTotal.irr >= 0 ? 'text-warning' : 'text-negative');

    tableHtml += `
        <tfoot style="font-weight: 700; border-top: 2px solid var(--c-outline);">
            <tr>
                <td style="padding: 10px 8px;">TOTAL PORTAFOLIO</td>
                <td style="padding: 10px 8px; text-align: right;">${formatCurrencyHTML(portfolioTotal.valorActual)}</td>
                <td style="padding: 10px 8px; text-align: right;" class="${totalPnlClass}">${formatCurrencyHTML(portfolioTotal.pnlAbsoluto)}</td>
                <td style="padding: 10px 8px; text-align: right;" class="${totalPnlClass}">${portfolioTotal.pnlPorcentual.toFixed(2)}%</td>
                <td style="padding: 10px 8px; text-align: right;" class="${totalTirClass}">${(portfolioTotal.irr * 100).toFixed(2)}%</td>
            </tr>
        </tfoot>`;

    tableHtml += `</table></div>`;
    container.innerHTML = tableHtml;
}

// --- FUNCIÓN PARA MOSTRAR DETALLES (CORREGIDA) ---
const mostrarDetalleMes = async (mesIndex, anio, tipoFiltro) => {
    // 1. Mostrar carga visual
    showToast('Cargando detalles...', 'info');

    // 2. Obtener los datos REALES del almacén de la app
    // Usamos AppStore.getAll() para asegurar que tenemos todo el historial disponible
    const todosLosMovimientos = await AppStore.getAll();

    // 3. Crear el HTML del panel si no existe (Panel deslizante)
    let overlay = document.querySelector('.bottom-sheet-overlay');
    if (!overlay) {
        document.body.insertAdjacentHTML('beforeend', `
            <div class="bottom-sheet-overlay" onclick="cerrarDetalleMes()"></div>
            <div class="bottom-sheet" id="detalleSheet">
                <div class="sheet-header">
                    <h3 id="sheet-title" style="margin:0; color:#fff;">Detalle</h3>
                    <button class="sheet-close" onclick="cerrarDetalleMes()">&times;</button>
                </div>
                <div class="sheet-content" id="sheet-list"></div>
            </div>
        `);
        overlay = document.querySelector('.bottom-sheet-overlay');
    }

    // 4. Filtrar los movimientos exactos de ese mes y año
    const movimientosFiltrados = todosLosMovimientos.filter(m => {
        const fecha = new Date(m.fecha);
        // Ajustamos filtro: mes, año y tipo (ingreso/gasto)
        // Nota: Filtramos 'traspaso' para que no ensucie el listado si solo queremos ver flujo real
        return fecha.getMonth() === mesIndex && 
               fecha.getFullYear() === anio &&
               m.tipo !== 'traspaso' && 
               (tipoFiltro === 'todos' || m.tipo === tipoFiltro);
    });

    // Ordenar por fecha (más reciente primero)
    movimientosFiltrados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    // 5. Generar la lista HTML
    const listaHTML = movimientosFiltrados.length > 0 
        ? movimientosFiltrados.map(m => `
            <div class="sheet-item">
                <div>
                    <div style="font-weight:600; color:#fff;">${m.descripcion || 'Sin concepto'}</div>
                    <div style="font-size:0.8rem; color:rgba(255,255,255,0.6);">${new Date(m.fecha).toLocaleDateString()}</div>
                </div>
                <div style="font-weight:bold; color: ${m.cantidad >= 0 ? '#4caf50' : '#f44336'};">
                    ${m.cantidad >= 0 ? '+' : ''} ${(m.cantidad / 100).toFixed(2)}€
                </div>
            </div>
        `).join('')
        : '<div style="padding:20px; text-align:center; color:rgba(255,255,255,0.5);">No hay movimientos este mes</div>';

    // 6. Actualizar título y mostrar
    const nombreMes = new Date(anio, mesIndex).toLocaleString('es-ES', { month: 'long' });
    const tituloCapitalizado = nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);
    
    document.getElementById('sheet-title').innerText = `${tituloCapitalizado} ${anio}`;
    document.getElementById('sheet-list').innerHTML = listaHTML;

    // 7. Activar animación
    overlay.classList.add('active');
    document.getElementById('detalleSheet').classList.add('active');
};
/* --- PEGAR ESTO JUSTO DEBAJO DE LA FUNCIÓN mostrarDetalleMes --- */

// Función GLOBAL para cerrar el panel (necesaria para el onclick del HTML)
window.cerrarDetalleMes = () => {
    const overlay = document.querySelector('.bottom-sheet-overlay');
    const sheet = document.getElementById('detalleSheet');

    // Quitamos la clase 'active' para que se anime hacia abajo y desaparezca
    if (overlay) overlay.classList.remove('active');
    if (sheet) sheet.classList.remove('active');
    
    // Opcional: Esperar a la animación y eliminar del HTML para limpiar memoria
    setTimeout(() => {
        if (overlay) overlay.remove();
        if (sheet) sheet.remove();
    }, 300); // Esperamos 300ms que dura la transición CSS
};
async function renderInformeDetallado(informeId) {
    const container = select(`informe-content-${informeId}`);
    if (!container) return;

    // Limpiamos gráficos previos
    if (informeActivoChart) {
        informeActivoChart.destroy();
        informeActivoChart = null;
    }
    
    // Esqueleto de carga
    container.innerHTML = `<div class="skeleton" style="height: 200px; border-radius: var(--border-radius-lg);"></div>`;

    try {
        const reportRenderers = {
            'extracto_cuenta': () => { 
                // 1. HTML ACTUALIZADO (Con el botón TODO)
                const content = `
                    <div id="informe-cuenta-wrapper">
                        <div class="form-group" style="margin-bottom: 0;">
                            <label for="informe-cuenta-select" class="form-label">Selecciona una cuenta:</label>
                            
                            <div style="display: flex; gap: 8px; align-items: stretch; width: 100%;">
                                <div class="input-wrapper" style="flex-grow: 1; min-width: 0;">
                                    <select id="informe-cuenta-select" class="form-select"></select>
                                </div>
                                <button id="btn-extracto-todo" class="btn btn--secondary" style="flex-shrink: 0; min-width: auto; padding: 0 16px; font-weight: 700; white-space: nowrap;" title="Ver todo ordenado por fecha">
                                    TODO
                                </button>
                            </div>
                            </div>
                    </div>
                    
                    <div id="informe-resultado-container" style="margin-top: var(--sp-4);">
                        <div class="empty-state" style="background:transparent; padding:var(--sp-2); border:none;">
                            <p style="font-size:0.85rem;">Selecciona una cuenta o pulsa <strong>TODO</strong>.</p>
                        </div>
                    </div>`;
                
                container.innerHTML = content;

                // 2. Lógica de activación
                const selectEl = select('informe-cuenta-select');
                if (selectEl) {
                    const populate = (el, data) => {
                        let opts = '<option value="">Seleccionar cuenta...</option>';
                        [...data].sort((a,b) => a.nombre.localeCompare(b.nombre))
                                 .forEach(cuenta => {
                                     opts += `<option value="${cuenta.id}">${cuenta.nombre}</option>`;
                                 });
                        el.innerHTML = opts;
                    };
                    populate(selectEl, getVisibleAccounts());

                    // Inicializamos el selector visual
                    createCustomSelect(selectEl);

                    // Evento al cambiar selección individual
                    selectEl.addEventListener('change', () => {
                        handleGenerateInformeCuenta(null, null);
                        setTimeout(() => {
                            if (document.activeElement) document.activeElement.blur();
                            const wrapper = selectEl.closest('.custom-select-wrapper');
                            if (wrapper) {
                                wrapper.classList.remove('is-open');
                                const trigger = wrapper.querySelector('.custom-select__trigger');
                                if (trigger) trigger.blur();
                            }
                        }, 50);
                    });
                }

                // 3. Lógica del Botón TODO (Crucial añadirla aquí también)
                const btnTodo = select('btn-extracto-todo');
                if (btnTodo) {
                    // Clonamos para eliminar listeners previos por seguridad
                    const newBtn = btnTodo.cloneNode(true);
                    btnTodo.parentNode.replaceChild(newBtn, btnTodo);
                    
                    newBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.target.blur();
                        // Llamamos a la función global que ordena por fecha
                        if (typeof handleGenerateGlobalExtract === 'function') {
                            handleGenerateGlobalExtract(e.target);
                        }
                    });
                }
            },
            
            // Resto de informes (sin cambios)
            'flujo_caja': () => renderInformeFlujoCaja(container),
            'resumen_ejecutivo': () => renderInformeResumenEjecutivo(container),
            'rendimiento_inversiones': () => renderInformeRendimientoInversiones(container),
            'asignacion_activos': () => renderInformeAsignacionActivos(container)
        };

        if (reportRenderers[informeId]) {
            await reportRenderers[informeId](container);
        } else {
            container.innerHTML = `<div class="empty-state"><p>Informe no disponible.</p></div>`;
        }
    } catch (error) {
        console.error(`Error al renderizar el informe '${informeId}':`, error);
        container.innerHTML = `<div class="empty-state text-danger"><p>Error al generar el informe.</p></div>`;
    }
}


/**
 * Dibuja un gráfico de tipo "gauge" (velocímetro) para la Tasa de Ahorro.
 * @param {string} canvasId - El ID del elemento canvas.
 * @param {number} percentage - El porcentaje de ahorro a mostrar.
 */
const renderSavingsRateGauge = (canvasId, percentage) => {
    const canvas = select(canvasId);
    const ctx = canvas ? canvas.getContext('2d') : null;
    if (!ctx) return;

    if (Chart.getChart(canvasId)) {
        Chart.getChart(canvasId).destroy();
    }

    let color;
    if (percentage < 0) color = 'var(--c-danger)';
    else if (percentage < 10) color = 'var(--c-warning)';
    else color = 'var(--c-success)';
    
    const value = Math.max(0, Math.min(100, percentage)); // Aseguramos que el valor esté entre 0 y 100 para el gráfico

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [value, 100 - value],
                backgroundColor: [getComputedStyle(document.body).getPropertyValue(color).trim(), getComputedStyle(document.body).getPropertyValue('--c-surface-variant').trim()],
                borderColor: 'transparent',
                borderWidth: 0,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            rotation: -90,
            circumference: 180,
            cutout: '65%',
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false },
                datalabels: { display: false }
            }
        }
    });
};

		
        const _renderRecientesFromCache = async () => {
            const recientesContainer = select('inicio-view-recientes');
            if (!recientesContainer) return;
            
            const movsToDisplay = recentMovementsCache;
            
            if (movsToDisplay.length === 0) {
                recientesContainer.innerHTML = `<div class="empty-state" style="border: none; background: transparent;"><p>No hay movimientos recientes en esta contabilidad.</p></div>`;
                return;
            }

            await processMovementsForRunningBalance(movsToDisplay, true); 

            const grouped = {};
            const visibleAccountIds = new Set(getVisibleAccounts().map(c => c.id));
            movsToDisplay.forEach(mov => {
                const dateKey = mov.fecha.slice(0, 10);
                if (!grouped[dateKey]) {
                    grouped[dateKey] = { movements: [], total: 0 };
                }
                grouped[dateKey].movements.push(mov);
                if (mov.tipo === 'traspaso') {
                    const origenVisible = visibleAccountIds.has(mov.cuentaOrigenId);
                    const destinoVisible = visibleAccountIds.has(mov.cuentaDestinoId);
                    if (origenVisible && !destinoVisible) { grouped[dateKey].total -= mov.cantidad; }
                    else if (!origenVisible && destinoVisible) { grouped[dateKey].total += mov.cantidad; }
                } else {
                    grouped[dateKey].total += mov.cantidad;
                }
            });

            let html = '';
            const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
            for (const dateKey of sortedDates) {
                const group = grouped[dateKey];
                html += renderVirtualListItem({ type: 'date-header', date: dateKey, total: group.total });
                
                group.movements.sort((a, b) => b.id.localeCompare(a.id));

                for (const mov of group.movements) {
                    html += renderVirtualListItem({ type: 'transaction', movement: mov });
                }
            }
            html += `<div style="text-align: center; margin-top: var(--sp-4);"><button class="btn btn--secondary" data-action="navigate" data-page="${PAGE_IDS.DIARIO}">Ver todos los movimientos</button></div>`;
            recientesContainer.innerHTML = html;
        };
	const renderPendingRecurrents = () => {
    const container = select('pending-recurrents-container');
    if (!container || !db.recurrentes) return;

    const pending = getPendingRecurrents();

    if (pending.length === 0) {
        container.innerHTML = '';
        return;
    }

    const itemsHTML = pending.map(r => {
        const nextDate = new Date(r.nextDate + 'T12:00:00Z');
        const formattedDate = nextDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
        const amountClass = r.cantidad >= 0 ? 'text-positive' : 'text-negative';
        const dateText = `Pendiente desde: ${formattedDate}`;

        return `
        <div class="transaction-card" id="pending-recurrente-${r.id}" style="background-color: color-mix(in srgb, var(--c-warning) 10%, transparent);">
            <div class="transaction-card__indicator transaction-card__indicator--recurrent"></div>
            <div class="transaction-card__content">
                <div class="transaction-card__details">
                    <div class="transaction-card__row-1">${escapeHTML(r.descripcion)}</div>
                    <div class="transaction-card__row-2" style="font-weight: 600; color: var(--c-warning);">${dateText}</div>
                    <!-- Contenedor de acciones corregido para un mejor wrapping en móviles -->
                    <div class="acciones-recurrentes-corregidas">
                        <button class="btn btn--secondary" data-action="edit-recurrente-from-pending" data-id="${r.id}" title="Editar antes de añadir" style="padding: 4px 8px; font-size: 0.7rem;">
                            <span class="material-icons" style="font-size: 14px;">edit</span>
                            <span>Editar</span>
                        </button>
                        <button class="btn btn--secondary" data-action="skip-recurrent" data-id="${r.id}" title="Omitir esta vez" style="padding: 4px 8px; font-size: 0.7rem;">
                            <span class="material-icons" style="font-size: 14px;">skip_next</span>
                            <span>No añadir</span>
                        </button>
                        <button class="btn btn--primary" data-action="confirm-recurrent" data-id="${r.id}" title="Crear el movimiento ahora" style="padding: 4px 8px; font-size: 0.7rem;">
                            <span class="material-icons" style="font-size: 14px;">check</span>
                            <span>Añadir Ahora</span>
                        </button>
                    </div>
                </div>
                <div class="transaction-card__figures">
                    <strong class="transaction-card__amount ${amountClass}">${formatCurrency(r.cantidad)}</strong>
                </div>
            </div>
        </div>`;
    }).join('');

    container.innerHTML = `
        <div class="card card--no-bg accordion-wrapper" style="margin-top: var(--sp-4);">
            <details class="accordion" open>
                <summary>
                    <h3 class="card__title" style="margin: 0; padding: 0; color: var(--c-on-surface);">
                        <span class="material-icons">event_repeat</span>
                        Operaciones Recurrentes Pendientes
                    </h3>
                    <span class="material-icons accordion__icon">expand_more</span>
                </summary>
                <div class="accordion__content" style="padding: 0 var(--sp-2) var(--sp-2) var(--sp-2);">
                    <div id="contenedor-recurrentes-vertical">
                        ${itemsHTML}
                    </div>
                </div>
            </details>
        </div>`;
};

const renderPlanificacionPage = () => {
    const container = select(PAGE_IDS.PLANIFICAR);
    if (!container) return;

    // Filtros para gráficos (si existen)
    const filterControlsHTML = typeof generateReportFilterControls === 'function' 
        ? generateReportFilterControls('flujo_caja') 
        : '<div class="form-group"><p class="text-muted" style="font-size: 0.8rem;">Visualizando últimos 12 meses</p></div>';
   
    container.innerHTML = `
        <style>
            /* CONFIGURACIÓN GENERAL */
            #planificar-page {
                padding: 0 !important;
                background-color: var(--c-background) !important;
                overflow-x: hidden; /* Evita scroll lateral accidental */
            }

            /* ESTILO "FULL WIDTH" (DE BORDE A BORDE) */
            .dashboard-widget {
                width: 100% !important;     /* Ocupa todo el ancho */
                margin: 0 !important;       /* Sin márgenes externos */
                border-radius: 0 !important; /* Esquinas cuadradas */
                border: none !important;    /* Quitamos el borde completo */
                border-bottom: 1px solid var(--c-outline) !important; /* Solo línea separadora abajo */
                background-color: var(--c-surface);
                box-sizing: border-box;
            }
            
            /* Ajuste visual para cuando se abre el acordeón */
            .widget-content {
                border-top: 1px solid var(--c-outline); /* Línea interna */
                background-color: var(--c-background); /* Un poco más oscuro por dentro para contraste */
            }

            .widget-header {
                padding: 18px 15px; /* Más espacio para el dedo */
                display: flex;
                align-items: center;
                cursor: pointer;
            }

            /* Títulos más grandes para aprovechar el espacio */
            .widget-title {
                font-size: 1rem;
                font-weight: 600;
            }
        </style>

        <details class="dashboard-widget">
            <summary class="widget-header">
                <div class="icon-box icon-box--patrimonio"><span class="material-icons">account_balance</span></div>
                <div class="widget-info">
                    <h3 class="widget-title">Patrimonio</h3>
                    <p class="widget-subtitle">Tus activos menos tus deudas</p>
                </div>
                <span class="material-icons widget-arrow">expand_more</span>
            </summary>
            <div class="widget-content">
                <div id="patrimonio-overview-container" style="padding: 20px;">
                   <div class="skeleton" style="height: 150px; width: 100%; border-radius: 8px;"></div>
                </div>
            </div>
        </details>

        <details class="dashboard-widget">
            <summary class="widget-header">
                <div class="icon-box icon-box--reloj" style="background-color: rgba(156, 39, 176, 0.1); color: #9c27b0;">
                    <span class="material-icons">update</span>
                </div>
                <div class="widget-info">
                    <h3 class="widget-title">Recurrentes</h3>
                    <p class="widget-subtitle">Próximos pagos y suscripciones</p>
                </div>
                <span class="material-icons widget-arrow">expand_more</span>
            </summary>
            <div class="widget-content" style="padding: 20px;">
                <div id="pending-recurrents-container"></div>
                <div style="margin-top: 15px;">
                    <p class="text-muted" style="font-size: 0.8rem; margin-bottom: 8px;">Suscripciones activas:</p>
                    <div id="recurrentes-list-container"></div>
                </div>
            </div>
        </details>

        <details id="acordeon-portafolio" class="dashboard-widget">
            <summary class="widget-header">
                <div class="icon-box icon-box--inversion"><span class="material-icons">rocket_launch</span></div>
                <div class="widget-info">
                    <h3 class="widget-title">Inversiones</h3>
                    <p class="widget-subtitle">Evolución del portafolio</p>
                </div>
                <span class="material-icons widget-arrow">expand_more</span>
            </summary>
            <div class="widget-content">
                <div id="portfolio-evolution-container" style="margin-top: 16px; padding: 0 10px;">
                    <div class="chart-container skeleton" style="height: 220px;"></div>
                </div>
                <div id="portfolio-main-content" style="margin-top: 20px; padding: 0 10px;"></div>
            </div>
        </details>

        <details id="acordeon-extracto_cuenta" class="dashboard-widget informe-acordeon">
            <summary id="summary-extracto-trigger" class="widget-header">
                <div class="icon-box icon-box--banco"><span class="material-icons">wysiwyg</span></div>
                <div class="widget-info">
                    <h3 class="widget-title">Extracto</h3>
                    <p class="widget-subtitle">Consultar movimientos</p>
                </div>
                <span class="material-icons widget-arrow">expand_more</span>
            </summary>
            <div class="widget-content">
                <div id="informe-content-extracto_cuenta" style="padding: 20px;">
                    <div id="informe-cuenta-wrapper">
                        <div class="form-group" style="margin-bottom: 0;">
                            <label for="informe-cuenta-select" class="form-label">Cuenta:</label>
                            <div style="display: flex; gap: 8px; width: 100%;">
                                <div class="input-wrapper" style="flex-grow: 1;">
                                    <select id="informe-cuenta-select" class="form-select"></select>
                                </div>
                                <button id="btn-extracto-todo" class="btn btn--secondary" style="font-weight: 700;">TODO</button>
                            </div>
                        </div>
                    </div>
                    <div id="informe-resultado-container" style="margin-top: 16px;">
                        <div class="empty-state" style="background:transparent; padding:10px; border:none;">
                            <p style="font-size:0.85rem;">Selecciona una cuenta.</p>
                        </div>
                    </div>
                </div>
            </div>
        </details>

        <details id="acordeon-flujo-caja" class="dashboard-widget">
            <summary class="widget-header">
                <div class="icon-box icon-box--grafico"><span class="material-icons">bar_chart</span></div>
                <div class="widget-info">
                    <h3 class="widget-title">Flujo de Caja</h3>
                    <p class="widget-subtitle">Entradas vs. Salidas</p>
                </div>
                <span class="material-icons widget-arrow">expand_more</span>
            </summary>
            <div class="widget-content" style="padding: 20px;">
                ${filterControlsHTML}
                <div id="informe-content-flujo_caja" style="min-height: 250px; margin-top: 10px;">
                    <div class="skeleton" style="height: 250px; border-radius: 8px;"></div>
                </div>
            </div>
        </details>
        
        <div style="height: 100px;"></div>
    `;

    // --- LÓGICA JAVASCRIPT ---

    populateAllDropdowns();
    renderPendingRecurrents(); 
    renderRecurrentsListOnPage(); 
    
    setTimeout(async () => {
        // Patrimonio
        await renderPatrimonioOverviewWidget('patrimonio-overview-container');
        
        // Extracto
        const btnTodo = select('btn-extracto-todo');
        if (btnTodo) {
            const newBtn = btnTodo.cloneNode(true);
            btnTodo.parentNode.replaceChild(newBtn, btnTodo);
            newBtn.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation(); e.target.blur();
                if (typeof handleGenerateGlobalExtract === 'function') handleGenerateGlobalExtract(e.target);
            });
        }
        const selectCuenta = select('informe-cuenta-select');
        if (selectCuenta) {
            const populate = (el, data) => {
                let opts = '<option value="">Seleccionar cuenta...</option>';
                [...data].sort((a,b) => a.nombre.localeCompare(b.nombre)).forEach(i => opts += `<option value="${i.id}">${i.nombre}</option>`);
                el.innerHTML = opts;
            };
            populate(selectCuenta, getVisibleAccounts());
            createCustomSelect(selectCuenta);
            selectCuenta.addEventListener('change', () => { handleGenerateInformeCuenta(null, null); });
        }
        
        // Inversiones
        const acordeonPortafolio = select('acordeon-portafolio');
        if (acordeonPortafolio) {
            const loadPortfolioData = async () => {
                await renderPortfolioEvolutionChart('portfolio-evolution-container');
                await renderPortfolioMainContent('portfolio-main-content');
            };
            acordeonPortafolio.addEventListener('toggle', async () => {
                if (acordeonPortafolio.open && !acordeonPortafolio.dataset.loaded) {
                    await loadPortfolioData();
                    acordeonPortafolio.dataset.loaded = "true";
                }
            });
        }

        // Flujo Caja
        const acordeonFlujo = select('acordeon-flujo_caja');
        if (acordeonFlujo) {
            acordeonFlujo.addEventListener('toggle', () => {
                if (acordeonFlujo.open && !acordeonFlujo.dataset.loaded) {
                    const flujoContainer = select('informe-content-flujo_caja');
                    if (flujoContainer && typeof renderInformeFlujoCaja === 'function') {
                        renderInformeFlujoCaja(flujoContainer);
                        acordeonFlujo.dataset.loaded = "true";
                    } else {
                         if(flujoContainer) flujoContainer.innerHTML = '<p class="form-error">Error al cargar gráfico.</p>';
                    }
                }
            });
        }
    }, 50);
};

  // =================================================================
// === INICIO: NUEVO MOTOR DE RENDERIZADO DE INFORMES Y PDF      ===
// =================================================================
async function renderInformeFlujoCaja(container) {
    // 1. Ya no se genera el HTML de los filtros aquí.
    container.innerHTML = `<div class="skeleton" style="height: 250px;"></div>`;

    // 2. EXTRAEMOS LAS FECHAS
    const { sDate, eDate } = getDatesFromReportFilter('flujo_caja');

    if (!sDate || !eDate) {
        container.innerHTML = `<p class="form-label">Por favor, selecciona un rango de fechas válido.</p>`;
        return;
    }

    // 3. OBTENEMOS y FILTRAMOS LOS DATOS (lógica sin cambios)
    const snapshot = await fbDb.collection('users').doc(currentUser.uid).collection('movimientos')
        .where('fecha', '>=', sDate.toISOString())
        .where('fecha', '<=', eDate.toISOString())
        .get();

    const visibleAccountIds = new Set(getVisibleAccounts().map(c => c.id));
    const movements = snapshot.docs.map(doc => doc.data()).filter(m => {
        if (m.tipo === 'traspaso') return visibleAccountIds.has(m.cuentaOrigenId) || visibleAccountIds.has(m.cuentaDestinoId);
        return visibleAccountIds.has(m.cuentaId);
    });

    // 4. PROCESAMOS Y AGRUPAMOS LOS DATOS POR MES (lógica sin cambios)
    const monthlyData = {};
    movements.forEach(mov => {
        const d = new Date(mov.fecha);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlyData[key]) monthlyData[key] = { ingresos: 0, gastos: 0 };
        
        let amount = calculateMovementAmount(mov, visibleAccountIds);
        if (amount > 0) monthlyData[key].ingresos += amount;
        else monthlyData[key].gastos += amount;
    });

    const sortedKeys = Object.keys(monthlyData).sort();
    const labels = sortedKeys.map(key => new Date(key + '-02').toLocaleString('es-ES', { month: 'short', year: '2-digit' }));
    const ingresosData = sortedKeys.map(key => monthlyData[key].ingresos / 100);
    const gastosData = sortedKeys.map(key => Math.abs(monthlyData[key].gastos / 100));

    // 5. RENDERIZAMOS EL GRÁFICO
    container.innerHTML = `<div class="chart-container" style="height: 250px;"><canvas id="flujo-caja-chart"></canvas></div>`;
    const ctx = select('flujo-caja-chart').getContext('2d');
    informeActivoChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                { label: 'Ingresos', data: ingresosData, backgroundColor: getComputedStyle(document.body).getPropertyValue('--c-success').trim() },
                { label: 'Gastos', data: gastosData, backgroundColor: getComputedStyle(document.body).getPropertyValue('--c-danger').trim() }
            ]
        },
        options: {
			onClick: (evt, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                // Si tienes un selector de año, úsalo aquí. Si no, usa el actual:
                const yearSelector = document.getElementById('filter-periodo'); 
                const currentYear = new Date().getFullYear(); 
                
                // Llamamos a la función que abre el panel
                if (typeof mostrarDetalleMes === 'function') {
                    mostrarDetalleMes(index, currentYear, 'todos');
                }
            }
        },
			responsive: true,
			maintainAspectRatio: false,
			scales: { y: { beginAtZero: true } },
			plugins: { legend: { position: 'top' }, datalabels: { display: false } } }
    });
}

const renderRecurrentsListOnPage = () => {
    const container = select('recurrentes-list-container');
    if (!container) return;

    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    const upcomingRecurrents = (db.recurrentes || [])
        .filter(r => {
            const nextDate = parseDateStringAsUTC(r.nextDate);
            if (!nextDate) return false; 
            
            // ¡LA CORRECCIÓN CLAVE! Hacemos la misma normalización para ser consistentes.
            const normalizedNextDate = new Date(Date.UTC(nextDate.getUTCFullYear(), nextDate.getUTCMonth(), nextDate.getUTCDate()));
            
            // Mostramos solo los que son estrictamente futuros (de mañana en adelante).
            return normalizedNextDate > today;
        })
        .sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate));

    if (upcomingRecurrents.length === 0) {
    container.innerHTML = `
        <div class="empty-state" style="background: transparent; border: none; padding: var(--sp-5) 0;">
            <div style="font-size: 48px; margin-bottom: 10px;">📅</div>
            <h3 style="margin-bottom: 8px;">Agenda vacía</h3>
            <p style="max-width: 250px; margin: 0 auto; line-height: 1.5;">
                No tienes pagos futuros programados. <br>
                Cuando añadas un movimiento, marca la opción <strong>"Repetir"</strong>.
            </p>
        </div>`;
    return;
}

    container.innerHTML = upcomingRecurrents.map(r => {
        const nextDate = parseDateStringAsUTC(r.nextDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
        
        const frequencyMap = { once: 'Única vez', daily: 'Diaria', monthly: 'Mensual', yearly: 'Anual' };
        let frequencyText = frequencyMap[r.frequency] || '';
        
        if (r.frequency === 'weekly' && r.weekDays && r.weekDays.length > 0) {
            const dayNames = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
            frequencyText = `Semanal (${r.weekDays.map(d => dayNames[d]).join(', ')})`;
        }
        
        const amountClass = r.cantidad >= 0 ? 'text-positive' : 'text-negative';
        const icon = r.cantidad >= 0 ? 'south_west' : 'north_east';
        
        return `
        <div class="modal__list-item" id="page-recurrente-item-${r.id}" data-action="edit-recurrente" data-id="${r.id}">
			<div style="display: flex; align-items: center; gap: 12px; flex-grow: 1; min-width: 0;">
				<span class="material-icons ${amountClass}" style="font-size: 20px;">${icon}</span>
				<div style="display: flex; flex-direction: column; min-width: 0;">
					<span style="font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHTML(r.descripcion)}</span>
				    <small style="color: var(--c-on-surface-secondary); font-size: var(--fs-xs);">Próximo: ${nextDate} (${frequencyText})</small>
			    </div>
		    </div>
		    <strong class="${amountClass}" style="margin-right: var(--sp-2);">${formatCurrency(r.cantidad)}</strong>
	    </div>`;
    }).join('');
};
// Define los colores para cada componente del patrimonio
const NET_WORTH_COMPONENT_COLORS = {
    'Líquido': 'rgba(0, 122, 255, 0.7)',      // Azul (var(--c-primary))
    'Inversión': 'rgba(48, 209, 88, 0.7)',   // Verde (var(--c-success))
    'Propiedades': 'rgba(191, 90, 242, 0.7)', // Púrpura (var(--c-info))
    'Deuda': 'rgba(255, 69, 58, 0.7)'         // Rojo (var(--c-danger))
};

/**
 * Clasifica un tipo de cuenta en una de las categorías principales del patrimonio.
 * @param {string} accountType - El tipo de cuenta (ej. "Banco", "Broker").
 * @returns {string} La categoría del componente ('Líquido', 'Inversión', 'Propiedades', 'Deuda').
 */
const getNetWorthComponent = (accountType) => {
    const type = (accountType || '').toUpperCase();
    if (['PRÉSTAMO', 'TARJETA DE CRÉDITO'].includes(type)) return 'Deuda';
    if (['PROPIEDAD', 'INMOBILIARIO'].includes(type)) return 'Propiedades';
    if (['BROKER', 'FONDOS', 'RENTA FIJA', 'PENSIÓN', 'CRIPTO', 'FINTECH'].includes(type) || type.includes('INVERSIÓN')) return 'Inversión';
    return 'Líquido'; // Por defecto, todo lo demás es líquido (Banco, Ahorro, Efectivo, etc.)
};

/**
 * Suaviza los datos diarios a puntos semanales para un gráfico más limpio y rápido.
 * @param {object} dailyData - Objeto con datos diarios.
 * @returns {object} Objeto con datos semanales.
 */
const resampleDataWeekly = (dailyData) => {
    const weeklyData = {};
    const sortedDates = Object.keys(dailyData).sort();

    if (sortedDates.length === 0) return {};

    let lastDate = null;
    sortedDates.forEach(dateStr => {
        const date = new Date(dateStr);
        // Usamos el domingo (día 0) como fin de la semana
        const weekEnd = new Date(date);
        weekEnd.setDate(date.getDate() - date.getDay() + 7);
        const weekKey = weekEnd.toISOString().slice(0, 10);
        
        // Guardamos el último valor registrado de la semana
        weeklyData[weekKey] = dailyData[dateStr];
        lastDate = dateStr;
    });

    // Aseguramos que el último punto de datos siempre esté presente
    const lastWeekKey = new Date(new Date(lastDate).setDate(new Date(lastDate).getDate() - new Date(lastDate).getDay() + 7)).toISOString().slice(0,10);
    weeklyData[lastWeekKey] = dailyData[lastDate];
    
    return weeklyData;
};

/* EN main.js - REEMPLAZO DE updateNetWorthChart (LÓGICA CORRECTA) */

const updateNetWorthChart = async (saldos) => {
    const canvasId = 'net-worth-chart';
    const netWorthCanvas = select(canvasId);
    if (!netWorthCanvas) return;
    
    const chartContainer = netWorthCanvas.closest('.chart-container');
    
    // Limpieza
    const existingChart = Chart.getChart(canvasId);
    if (existingChart) existingChart.destroy();

    const allMovements = await AppStore.getAll();
    const visibleAccountIds = new Set(Object.keys(saldos));

    // Si no hay datos
    if (allMovements.length === 0 && Object.keys(saldos).length === 0) {
        if (chartContainer) {
            chartContainer.classList.remove('skeleton');
            chartContainer.innerHTML = `<div class="empty-state" style="padding:2rem 0; background:transparent; border:none;"><p>Sin datos suficientes.</p></div>`;
        }
        return;
    }

    // 1. PREPARACIÓN DE DATOS (ORDEN CRONOLÓGICO: ANTIGUO -> NUEVO)
    // Filtramos solo movimientos que afecten a las cuentas visibles
    const relevantMovements = allMovements.filter(m => {
        if (m.tipo === 'traspaso') {
            // Es relevante si entra o sale de mi vista
            return visibleAccountIds.has(m.cuentaOrigenId) !== visibleAccountIds.has(m.cuentaDestinoId);
        }
        return visibleAccountIds.has(m.cuentaId);
    }).sort((a, b) => new Date(a.fecha) - new Date(b.fecha)); // Ordenar: Antiguo a Reciente

    // 2. CALCULAR PUNTO DE PARTIDA
    // Saldo Actual Total
    const currentTotal = Object.values(saldos).reduce((sum, s) => sum + s, 0);
    
    // Calculamos el impacto total acumulado de todos los movimientos de la historia
    let totalHistoryImpact = 0;
    relevantMovements.forEach(m => {
        let impact = 0;
        if (m.tipo === 'traspaso') {
            const origenVis = visibleAccountIds.has(m.cuentaOrigenId);
            // Si sale (origen visible), resta. Si entra (destino visible), suma.
            impact = origenVis ? -m.cantidad : m.cantidad;
        } else {
            // Gasto (negativo) o Ingreso (positivo)
            impact = m.cantidad;
        }
        m.calculatedImpact = impact; // Guardamos esto para el bucle siguiente
        totalHistoryImpact += impact;
    });

    // Saldo Inicial Teórico = Saldo Actual - Todo lo que ha pasado
    let runningBalance = currentTotal - totalHistoryImpact;

    // 3. GENERAR PUNTOS DEL GRÁFICO
    // Empezamos con el punto inicial (antes del primer movimiento)
    const dataPoints = [];
    
    // Si hay movimientos, añadimos un punto inicial un día antes del primer movimiento
    if (relevantMovements.length > 0) {
        const firstDate = new Date(relevantMovements[0].fecha);
        firstDate.setDate(firstDate.getDate() - 1);
        dataPoints.push({ x: firstDate.toISOString().split('T')[0], y: runningBalance / 100 });
    } else {
        // Si no hay movimientos pero hay saldo (ej. saldos iniciales), línea plana
        const today = new Date().toISOString().split('T')[0];
        dataPoints.push({ x: today, y: currentTotal / 100 });
    }

    // Recorremos la historia sumando
    const dailyMap = new Map(); // Para agrupar movimientos del mismo día
    
    relevantMovements.forEach(m => {
        runningBalance += m.calculatedImpact;
        const dateKey = m.fecha.split('T')[0];
        // Guardamos el saldo al final de cada día
        dailyMap.set(dateKey, runningBalance / 100);
    });

    // Convertimos el mapa a puntos ordenados
    dailyMap.forEach((value, key) => {
        dataPoints.push({ x: key, y: value });
    });

    // Aseguramos que el gráfico llegue hasta hoy
    const todayKey = new Date().toISOString().split('T')[0];
    if (!dailyMap.has(todayKey)) {
        dataPoints.push({ x: todayKey, y: currentTotal / 100 });
    }

    // 4. RENDERIZADO
    if(chartContainer) {
        chartContainer.classList.remove('skeleton');
        chartContainer.classList.add('fade-in-up');
    }

    const ctx = netWorthCanvas.getContext('2d');
    
    // Gradiente sutil
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(0, 179, 77, 0.25)'); // Verde suave arriba
    gradient.addColorStop(1, 'rgba(0, 179, 77, 0.0)'); // Transparente abajo

    netWorthChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Patrimonio',
                data: dataPoints,
                borderColor: '#00B34D', // Verde principal
                borderWidth: 2,
                backgroundColor: gradient,
                fill: true,
                pointRadius: 0, // Línea limpia sin puntos
                pointHoverRadius: 6,
                tension: 0.3 // Línea casi recta para precisión (0.4 es muy curva)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            scales: {
                x: { 
                    type: 'time', 
                    time: { unit: 'month', displayFormats: { month: 'MMM' } },
                    grid: { display: false },
                    ticks: { maxTicksLimit: 5, color: '#888', font: { size: 10 } }
                },
                y: { display: false } // Eje Y oculto para limpieza
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(20,20,30,0.9)',
                    titleColor: '#fff',
                    bodyFont: { size: 14, weight: 'bold' },
					padding: 10,
                    callbacks: {
                        label: (ctx) => formatCurrency(ctx.raw.y * 100)
                    }
                }
            }
        }
    });
};

/* --- FUNCIÓN MÁGICA: Ir al Diario y resaltar un movimiento --- */
const navigateToAndHighlight = async (movementId) => {
    // 1. Cambiar a la pestaña Diario
    await navigateTo(PAGE_IDS.DIARIO);
    
    // 2. Esperar un momento a que la lista se cargue/procese
    setTimeout(() => {
        // Encontramos el índice del movimiento en la base de datos actual
        // (Asumimos que db.movimientos está ordenado como se muestra)
        const index = db.movimientos.findIndex(m => m.id === movementId);
        
        if (index !== -1) {
            const mainScroller = document.querySelector('.app-layout__main');
            
            // Calculamos posición estimada (Altura promedio 64px + cabeceras aprox)
            // Esto es una aproximación para Virtual Scrolling, pero suele bastar
            // Si tienes vList.itemMap (mapa de alturas), úsalo:
            let scrollTarget = 0;
            if (vList.itemMap && vList.itemMap[index]) {
                scrollTarget = vList.itemMap[index].offset;
            } else {
                // Fallback si el mapa no está listo (multiplicamos por altura promedio)
                scrollTarget = index * 65; 
            }

            // Hacemos scroll suave
            mainScroller.scrollTo({ top: scrollTarget - 100, behavior: 'smooth' }); // -100 para dejar margen arriba

            // 3. Resaltar el elemento visualmente
            // Esperamos a que el scroll termine (aprox 400ms) para buscar el elemento en el DOM
            setTimeout(() => {
                // Buscamos por el atributo data-id que pusimos en TransactionCardComponent
                const card = document.querySelector(`.transaction-card[data-id="${movementId}"]`);
                if (card) {
                    card.classList.add('item-highlighted');
                    // Opcional: vibración al encontrarlo
                    hapticFeedback('success');
                }
            }, 500);
        }
    }, 100);
};


const getLiquidityAccounts = () => {
    const visibleAccounts = getVisibleAccounts();
    return visibleAccounts.filter((c) => {
        const tipo = (c.tipo || '').trim().toUpperCase();
        // Incluir BANCOS, EFECTIVO y TARJETA
        return ['BANCO', 'EFECTIVO', 'TARJETA'].includes(tipo);
    });
};

const scheduleDashboardUpdate = () => {
    if (dashboardUpdateDebounceTimer) clearTimeout(dashboardUpdateDebounceTimer);
    
    dashboardUpdateDebounceTimer = setTimeout(async () => {
        const activePage = document.querySelector('.view--active');
        if (!activePage || activePage.id !== PAGE_IDS.PANEL) return;

        if (isDashboardRendering) return;
        isDashboardRendering = true;

        try {
            const saldos = await getSaldos();
            const visibleAccounts = getVisibleAccounts();
            
            // --- CÁLCULOS ---
            const investmentAccounts = visibleAccounts.filter(c => c.esInversion);
            
            let totalCapitalInvertido = 0; // Lo que has puesto de tu bolsillo (Saldos)
            let valorMercadoTotal = 0;     // Lo que vale hoy (Valoraciones)

            if (investmentAccounts.length > 0) {
                for (const cuenta of investmentAccounts) {
                    // 1. Capital Invertido es el SALDO de la cuenta
                    const capitalCuenta = saldos[cuenta.id] || 0;
                    totalCapitalInvertido += capitalCuenta;

                    // 2. Valor de Mercado es la última valoración
                    const valoraciones = (db.inversiones_historial || [])
                        .filter(v => v.cuentaId === cuenta.id)
                        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
                    
                    const valor = valoraciones.length > 0 ? valoraciones[0].valor : capitalCuenta;
                    valorMercadoTotal += valor;
                }
            }

            let liquidezTotal = 0;
            visibleAccounts.forEach(c => {
                if (!c.esInversion && !['PRÉSTAMO', 'TARJETA DE CRÉDITO'].includes((c.tipo || '').toUpperCase())) {
                    liquidezTotal += (saldos[c.id] || 0);
                }
            });

            // Patrimonio Contable
            const patrimonioContable = liquidezTotal + totalCapitalInvertido;

            // --- CÁLCULO P&L Y PORCENTAJE ---
            const pnlTotal = valorMercadoTotal - totalCapitalInvertido;
            let pnlPct = 0;
            if (totalCapitalInvertido !== 0) {
                pnlPct = (pnlTotal / totalCapitalInvertido) * 100;
            }

            // Datos de flujo
            const { current: currentMovs } = await getFilteredMovements(false);
            const visibleAccountIds = new Set(visibleAccounts.map(c => c.id));
            const { ingresos, gastos, saldoNeto } = calculateTotals(currentMovs, visibleAccountIds);
            const tasaAhorro = (ingresos > 0 && saldoNeto > 0) ? (saldoNeto / ingresos) * 100 : 0;

            // Datos de salud (Usamos valor real de mercado para I.F.)
            const patrimonioRealParaCalculos = liquidezTotal + valorMercadoTotal;
            const efData = calculateEmergencyFund(saldos, db.cuentas, recentMovementsCache);
            const fiData = calculateFinancialIndependence(patrimonioRealParaCalculos, efData.gastoMensualPromedio);

            // --- ACTUALIZACIÓN UI COMPLETA (v3) ---

            // A. FLUJO (Ingresos, Gastos, Neto, Ahorro)
            const elIng = select('kpi-ingresos-value');
            if (elIng) {
                [elIng, select('kpi-gastos-value'), select('kpi-saldo-neto-value'), select('kpi-tasa-ahorro-value')]
                    .forEach(el => el?.classList.remove('skeleton'));
                
                updateKpiVisual('kpi-ingresos-value', ingresos);          
                updateKpiVisual('kpi-gastos-value', gastos);              
                updateKpiVisual('kpi-saldo-neto-value', saldoNeto);       
                updateKpiVisual('kpi-tasa-ahorro-value', tasaAhorro * 100, true); 
            }

            // B. PATRIMONIO (Liquidez, Invertido y Total)
            const elPatrimonio = select('kpi-patrimonio-neto-value');
            if (elPatrimonio) {
                [elPatrimonio, select('kpi-liquidez-value'), select('kpi-capital-invertido-total')]
                    .forEach(el => el?.classList.remove('skeleton'));

                // Patrimonio Neto: Mantiene estilo Gigante y Azul
                animateCountUp(elPatrimonio, patrimonioContable);

                // Liquidez y Capital en la tarjeta azul: Colores dinámicos
                updateKpiVisual('kpi-liquidez-value', liquidezTotal);
                updateKpiVisual('kpi-capital-invertido-total', totalCapitalInvertido);
            }

            // C. INVERSIONES (NUEVO: Tarjeta Valor de Mercado)
            // Aquí conectamos los nuevos IDs para que tengan color y tamaño
            const elMarket = select('new-card-market-value');
            if (elMarket) {
                 [elMarket, select('new-card-capital'), select('new-card-pnl')]
                    .forEach(el => el?.classList.remove('skeleton'));

                 updateKpiVisual('new-card-capital', totalCapitalInvertido); // Capital
                 updateKpiVisual('new-card-pnl', pnlTotal);                 // P&L
                 updateKpiVisual('new-card-market-value', valorMercadoTotal); // Valor Real
            }

            // D. METAS
            const elRunway = select('health-runway-val');
            if (elRunway) {
                elRunway.classList.remove('skeleton');
                const meses = efData.mesesCobertura;
                elRunway.textContent = isFinite(meses) ? (meses >= 100 ? '∞' : `${meses.toFixed(1)} Meses`) : '∞';
            }

            const elFi = select('health-fi-val');
            if (elFi) {
                elFi.classList.remove('skeleton');
                animateCountUp(elFi, fiData.progresoFI * 100, 700, false, '', '%');
            }

        } catch (error) {
            console.error("Error actualizando cockpit:", error);
        } finally {
            isDashboardRendering = false;
        }
    }, 300);
};


const updateDashboardData = async () => {
    const activePage = document.querySelector('.view--active');
    if (!activePage || activePage.id !== PAGE_IDS.PANEL) return;

    if (isDashboardRendering) return;
    isDashboardRendering = true;

    try {
        const { current } = await getFilteredMovements(true);
        const saldos = await getSaldos();
        const visibleAccounts = getVisibleAccounts();
        const visibleAccountIds = new Set(Object.keys(saldos));
        
        // 1. Cálculos de Flujo
        let ingresos = 0, gastos = 0, saldoNeto = 0;
        current.forEach(m => {
            const amount = calculateMovementAmount(m, visibleAccountIds);
            if (amount > 0) ingresos += amount;
            else gastos += amount;
            saldoNeto += amount;
        });
        const tasaAhorroActual = ingresos > 0 ? (saldoNeto / ingresos) * 100 : (saldoNeto < 0 ? -100 : 0);

        // 2. Cálculos de Estado
        let totalLiquidez = 0;
        let patrimonioNeto = 0;
        visibleAccounts.forEach(c => {
            const saldo = saldos[c.id] || 0;
            patrimonioNeto += saldo;
            if (!c.esInversion && !['PRÉSTAMO', 'TARJETA DE CRÉDITO'].includes((c.tipo || '').toUpperCase())) {
                totalLiquidez += saldo;
            }
        });

        // 3. Cálculos Avanzados
        const portfolioPerf = await calculatePortfolioPerformance(); 
        const efData = calculateEmergencyFund(saldos, db.cuentas, recentMovementsCache);
        const fiData = calculateFinancialIndependence(patrimonioNeto, efData.gastoMensualPromedio);

        // --- ACTUALIZACIÓN UI ---

        // Patrimonio
        const kpiPatrimonio = select('kpi-patrimonio-neto-value');
        if (kpiPatrimonio) {
            kpiPatrimonio.classList.remove('skeleton');
            animateCountUp(kpiPatrimonio, patrimonioNeto);
        }

        // Liquidez
        const kpiLiquidez = select('kpi-liquidez-value');
        if (kpiLiquidez) { kpiLiquidez.classList.remove('skeleton'); animateCountUp(kpiLiquidez, totalLiquidez); }
        
        // Inversiones
        const kpiInvTotal = select('kpi-inversion-total');
        if (kpiInvTotal) { kpiInvTotal.classList.remove('skeleton'); animateCountUp(kpiInvTotal, portfolioPerf.valorActual); }
        
        // P&L
        const kpiInvPnl = select('kpi-inversion-pnl');
        if (kpiInvPnl) {
            kpiInvPnl.classList.remove('skeleton');
            const pnl = portfolioPerf.pnlAbsoluto;
            const sign = pnl >= 0 ? '+' : '';
            kpiInvPnl.textContent = `${sign}${formatCurrencyHTML(pnl)}`;
            kpiInvPnl.className = `status-value ${pnl >= 0 ? 'text-positive' : 'text-negative'}`;
            kpiInvPnl.style.fontSize = "1.1rem";
        }
        
        // Rentabilidad
        const kpiInvPct = select('kpi-inversion-pct');
        if (kpiInvPct) {
            kpiInvPct.classList.remove('skeleton');
            const pct = portfolioPerf.pnlPorcentual;
            const sign = pct >= 0 ? '+' : '';
            kpiInvPct.textContent = `${sign}${pct.toFixed(2)}%`;
            kpiInvPct.className = `status-value ${pct >= 0 ? 'text-positive' : 'text-negative'}`;
            kpiInvPct.style.fontSize = "1.1rem";
        }

        // Flujo del Periodo
        const elIng = select('kpi-ingresos-value');
        if (elIng) {
            [elIng, select('kpi-gastos-value'), select('kpi-saldo-neto-value')].forEach(el => el.classList.remove('skeleton'));
            animateCountUp(elIng, ingresos);
            animateCountUp(select('kpi-gastos-value'), gastos);
            animateCountUp(select('kpi-saldo-neto-value'), saldoNeto);
            select('kpi-saldo-neto-value').className = `status-value ${saldoNeto >= 0 ? 'text-positive' : 'text-negative'}`;
        }

        // Salud Financiera (Solo Texto)
        
        // Ahorro
        const kpiAhorro = select('kpi-tasa-ahorro-value');
        if (kpiAhorro) {
            kpiAhorro.classList.remove('skeleton');
            kpiAhorro.textContent = `${tasaAhorroActual.toFixed(0)}%`;
        }
        
        // Cobertura
        const kpiRunway = select('health-runway-val');
        if (kpiRunway) {
            kpiRunway.classList.remove('skeleton');
            const meses = efData.mesesCobertura;
            kpiRunway.textContent = isFinite(meses) ? (meses >= 100 ? '∞' : meses.toFixed(1)) : '∞';
        }
        
        // Libertad
        const kpiFi = select('health-fi-val');
        if (kpiFi) {
            kpiFi.classList.remove('skeleton');
            kpiFi.textContent = `${fiData.progresoFI.toFixed(1)}%`;
        }

    } catch (error) {
        console.error("Error en updateDashboardData:", error);
    } finally {
        isDashboardRendering = false;
    }
};

let suggestionDebounceTimer = null;

// =================================================================
// === INICIO: CÓDIGO UNIFICADO PARA MODALES ARRASTRABLES ===
// =================================================================

let modalDragState = {
    isDragging: false,
    startY: 0,
    currentY: 0,
    targetModal: null
};

// Se activa CUANDO EMPIEZAS A ARRASTRAR
function handleModalDragStart(e) {
    const modal = e.target.closest('.modal');
    if (!modal) return;

    const modalBody = modal.querySelector('.modal__body');
    if (modalBody && modalBody.scrollTop > 0) return;

    modalDragState.isDragging = true;
    modalDragState.targetModal = modal;
    modalDragState.startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

    modal.style.transition = 'none';
}

// Se activa MIENTRAS MUEVES EL DEDO/RATÓN
function handleModalDragMove(e) {
    if (!modalDragState.isDragging || !modalDragState.targetModal) return;

    modalDragState.currentY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    let deltaY = modalDragState.currentY - modalDragState.startY;

    if (deltaY > 0) {
        e.preventDefault();
        modalDragState.targetModal.style.transform = `translateY(${deltaY}px)`;
    }
}

// Se activa CUANDO SUELTAS EL DEDO/RATÓN
function handleModalDragEnd(e) {
    if (!modalDragState.isDragging || !modalDragState.targetModal) return;

    const modal = modalDragState.targetModal;
    modal.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'; 

    const deltaY = modalDragState.currentY - modalDragState.startY;
    const modalHeight = modal.offsetHeight;

    if (deltaY > modalHeight * 0.3) {
        const overlay = modal.closest('.modal-overlay');
        if (overlay) hideModal(overlay.id);
    } else {
        modal.style.transform = 'translateY(0)';
    }

    modalDragState.isDragging = false;
    modalDragState.targetModal = null;
}


const showModal = (id) => {
    const m = select(id);
    if (m) {
        // --- NUEVA LÓGICA DE HISTORIAL ---
        // Solo añadimos historia si el modal NO estaba ya abierto (para evitar duplicados)
        if (!m.classList.contains('modal-overlay--active')) {
            // pushState añade una entrada al historial del navegador.
            // 1er param: datos del estado ({ modalId: id })
            // 2do param: título (no se usa mucho hoy día)
            // 3er param: URL visual (añadimos un hash #modal-id para que se vea pro)
            window.history.pushState({ modalId: id }, '', `#modal-${id}`);
        }
        // ---------------------------------

        m.classList.add('modal-overlay--active');
        select('app-root').classList.add('app-layout--transformed-by-modal');

        // (Resto de tu código original para gestos y foco...)
        const modalElement = m.querySelector('.modal');
		if (modalElement) {
    // CAMBIO: Detectamos si es táctil antes de añadir eventos de arrastre
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
        // Solo añadimos listeners de arrastre en móviles
        modalElement.addEventListener('touchstart', handleModalDragStart, { passive: true });
        // Eliminamos mousedown para escritorio
    }
}
        if (modalElement) {
            modalElement.addEventListener('mousedown', handleModalDragStart);
            modalElement.addEventListener('touchstart', handleModalDragStart, { passive: true });
        }
        // ... listeners de drag ...
        if (!id.includes('calculator')) {
            const f = m.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (f) f.focus();
        }
    }
};

const hideModal = (id) => {
    if (document.activeElement) document.activeElement.blur(); 
    const m = select(id);
    
    // --- NUEVA LÓGICA DE HISTORIAL ---
    // Verificamos: ¿El estado actual del historial pertenece a ESTE modal?
    if (window.history.state && window.history.state.modalId === id) {
        // Si es así, volvemos atrás en el historial nosotros mismos.
        // Esto disparará el evento 'popstate', pero como ya hemos cerrado visualmente
        // o lo vamos a hacer, el flujo se mantiene correcto.
        window.history.back();
        // Nota: Al hacer history.back(), se disparará el listener de popstate que
        // se encargará de la limpieza visual si aún no se ha hecho.
        // Pero para asegurar una respuesta instantánea (UI Optimista),
        // dejamos el código visual aquí abajo también.
    }
    // ---------------------------------

    if (m) {
        m.classList.remove('modal-overlay--active');
        select('app-root').classList.remove('app-layout--transformed-by-modal');

        const modalElement = m.querySelector('.modal');
        if (modalElement) {
    // CAMBIO: Detectamos si es táctil antes de añadir eventos de arrastre
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
        // Solo añadimos listeners de arrastre en móviles
        modalElement.addEventListener('touchstart', handleModalDragStart, { passive: true });
        // Eliminamos mousedown para escritorio
    }
}
        if (modalElement) {
            modalElement.removeEventListener('mousedown', handleModalDragStart);
            modalElement.removeEventListener('touchstart', handleModalDragStart);
            modalElement.style.transform = ''; // Resetear posición
        }
        
        // Limpiar listeners globales de arrastre
        document.removeEventListener('mousemove', handleModalDragMove);
        document.removeEventListener('touchmove', handleModalDragMove);
        document.removeEventListener('mouseup', handleModalDragEnd);
        document.removeEventListener('touchend', handleModalDragEnd);
    }

    // (Resto de tu código de scroll restoration)
    const mainScroller = selectOne('.app-layout__main');
    if (mainScroller && lastScrollTop !== null) {
        requestAnimationFrame(() => {
            mainScroller.scrollTop = lastScrollTop;
            lastScrollTop = null;
        });
    }
};

// =================================================================
// === FIN: CÓDIGO UNIFICADO PARA MODALES ARRASTRABLES ===
// =================================================================


        const closeCalculatorOnClickOutside = (e) => {
            const calculatorEl = select('calculator-ui');
            if (!calculatorState.isVisible || (calculatorEl && calculatorEl.contains(e.target))) {
                 setTimeout(() => {
                     document.addEventListener('click', closeCalculatorOnClickOutside, { once: true });
                 }, 0);
                return;
            }
        };       

		 const updateDoneButtonText = () => {
            const doneButton = select('calculator-btn-done');
            if (doneButton) {
                doneButton.textContent = calculatorState.isResultDisplayed ? 'Cerrar' : 'OK';
            }
        };
        
        const showGenericModal=(title,html)=>{const titleEl = select('generic-modal-title'); if (titleEl) titleEl.textContent=title; const bodyEl = select('generic-modal-body'); if(bodyEl) bodyEl.innerHTML=html;showModal('generic-modal');};
	const handleShowIrrBreakdown = async (accountId) => {
    const cuenta = db.cuentas.find(c => c.id === accountId);
    if (!cuenta) return;

    // 1. Damos feedback al usuario y mostramos un modal de carga.
    hapticFeedback('light');
    showGenericModal(`Desglose TIR: ${cuenta.nombre}`, `<div style="text-align:center; padding: var(--sp-5);"><span class="spinner"></span></div>`);

    // 2. Reutilizamos la lógica que ya existe para obtener los datos crudos.
    await loadInversiones(); // Nos aseguramos de tener los datos de inversión
    const allMovements = await AppStore.getAll();
    
    // Filtramos solo los movimientos que afectan a ESTA cuenta
    const accountMovements = allMovements.filter(m => 
        (m.tipo === 'movimiento' && m.cuentaId === accountId) ||
        (m.tipo === 'traspaso' && (m.cuentaDestinoId === accountId || m.cuentaOrigenId === accountId))
    );
    
    // Buscamos la última valoración manual para esta cuenta
    const valuations = (db.inversiones_historial || [])
        .filter(v => v.cuentaId === accountId)
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    const valorActual = valuations.length > 0 ? valuations[0].valor : 0;
    
    // 3. Convertimos los movimientos en flujos de caja claros (positivo/negativo).
    let cashflows = accountMovements.map(mov => {
        let effectOnAccount = 0; // El impacto real en el saldo de esta cuenta
        if (mov.tipo === 'movimiento') {
            effectOnAccount = mov.cantidad;
        } else if (mov.tipo === 'traspaso') {
            if (mov.cuentaDestinoId === accountId) effectOnAccount = mov.cantidad;
            else if (mov.cuentaOrigenId === accountId) effectOnAccount = -mov.cantidad;
        }

        if (effectOnAccount !== 0) {
            // Un 'effectOnAccount' positivo es una aportación (flujo de caja negativo para la TIR)
            // Un 'effectOnAccount' negativo es una retirada (flujo de caja positivo para la TIR)
            return { 
                date: new Date(mov.fecha), 
                amount: -effectOnAccount, 
                type: -effectOnAccount > 0 ? 'retirada' : 'aportacion' 
            };
        }
        return null;
    }).filter(cf => cf !== null); // Limpiamos los movimientos que no afectaron

    // 4. Añadimos el valor actual como el "desembolso final" positivo del cálculo.
    cashflows.push({ date: new Date(), amount: valorActual, type: 'valoracion' });

    // 5. Ordenamos todo cronológicamente y construimos la tabla HTML.
    cashflows.sort((a, b) => a.date.getTime() - b.date.getTime());

    let modalHtml = `<p class="form-label" style="margin-bottom: var(--sp-3);">Esta es la lista de flujos de caja usados para calcular la Tasa Interna de Retorno (TIR).</p>
        <div class="informe-extracto-container">
            <div class="informe-linea-header">
                <span class="fecha">Fecha</span>
                <span class="descripcion">Tipo</span>
                <span class="importe">Importe</span>
            </div>`;
    
    cashflows.forEach(cf => {
        const date = cf.date.toLocaleDateString('es-ES', {day: '2-digit', month: '2-digit', year: 'numeric'});
        const typeLabel = cf.type === 'aportacion' ? 'Aportación (-)' : (cf.type === 'retirada' ? 'Retirada (+)' : 'Valoración Final (+)');
        const colorClass = cf.amount < 0 ? 'text-gasto' : 'text-ingreso'; // Reutilizamos clases de color que ya tienes

        modalHtml += `
            <div class="informe-linea-movimiento">
                <span class="fecha">${date}</span>
                <span class="descripcion">${typeLabel}</span>
                <span class="importe ${colorClass}">${formatCurrency(cf.amount)}</span>
            </div>`;
    });
    
    modalHtml += `</div>`;
    
    // 6. Mostramos el resultado final en el modal.
    showGenericModal(`Desglose TIR: ${cuenta.nombre}`, modalHtml);
};	
const showDrillDownModal = (title, movements) => {
    // 1. Orden cronológico (Más reciente arriba)
    movements.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    // 2. Generar contenido usando la NUEVA función maestra
    let modalContentHTML = '';
    
    if (movements.length === 0) {
        modalContentHTML = `
        <div class="empty-state" style="background:transparent; border:none; padding-top: var(--sp-4);">
            <span class="material-icons">search_off</span>
            <h3>Sin movimientos</h3>
            <p>No se han encontrado movimientos para esta selección.</p>
        </div>`;
    } else {
        // AQUÍ ESTÁ EL CAMBIO CLAVE: Usamos createUnifiedRowHTML
        modalContentHTML = movements
            .map(m => createUnifiedRowHTML(m))
            .join('');
            
        // Ajustamos la acción para que funcione dentro del modal
        modalContentHTML = modalContentHTML.replace(/data-action="edit-movement-from-list"/g, 'data-action="edit-movement-from-modal"');
    }

    // 3. Mostrar Modal
    showGenericModal(title, modalContentHTML);

    // 4. Animación de entrada (Cascada)
    setTimeout(() => {
        const modalBody = document.getElementById('generic-modal-body');
        if (modalBody) {
            const itemsToAnimate = modalBody.querySelectorAll('.list-item-animate');
            itemsToAnimate.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('item-enter-active');
                }, index * 30); 
            });
        }
    }, 50);
};
        const showConfirmationModal=(msg, onConfirm, title="Confirmar Acción")=>{ hapticFeedback('medium'); const id='confirmation-modal';const existingModal = document.getElementById(id); if(existingModal) existingModal.remove(); const overlay=document.createElement('div');overlay.id=id;overlay.className='modal-overlay modal-overlay--active'; overlay.innerHTML=`<div class="modal" role="alertdialog" style="border-radius:var(--border-radius-lg)"><div class="modal__header"><h3 class="modal__title">${title}</h3></div><div class="modal__body"><p>${msg}</p><div style="display:flex;gap:var(--sp-3);margin-top:var(--sp-4);"><button class="btn btn--secondary btn--full" data-action="close-modal" data-modal-id="confirmation-modal">Cancelar</button><button class="btn btn--danger btn--full" data-action="confirm-action">Sí, continuar</button></div></div></div>`; document.body.appendChild(overlay); (overlay.querySelector('[data-action="confirm-action"]')).onclick=()=>{hapticFeedback('medium');onConfirm();overlay.remove();}; (overlay.querySelector('[data-action="close-modal"]')).onclick=()=>overlay.remove(); };

		
// =================================================================
// === INICIO: FUNCIÓN showToast (CORRECCIÓN CRÍTICA) ===
// =================================================================
const showAccountMovementsModal = async (cId) => {
    const cuenta = getVisibleAccounts().find((c) => c.id === cId);
    if (!cuenta) return;

    showGenericModal(`Movimientos de ${cuenta.nombre}`, `<div style="text-align:center; padding: var(--sp-5);"><span class="spinner"></span><p style="margin-top: var(--sp-3);">Cargando historial...</p></div>`);

    try {
    // ▼▼▼ ESTA PARTE ES LA NUEVA Y EFICIENTE ▼▼▼
    const userMovementsRef = fbDb.collection('users').doc(currentUser.uid).collection('movimientos');
    
    // Creamos tres promesas de consulta, una para cada campo donde puede aparecer el ID de la cuenta.
    const queryPromises = [
        userMovementsRef.where('cuentaId', '==', cId).get(),
        userMovementsRef.where('cuentaOrigenId', '==', cId).get(),
        userMovementsRef.where('cuentaDestinoId', '==', cId).get()
    ];
    
    // Ejecutamos las tres consultas en paralelo para máxima velocidad.
    const snapshots = await Promise.all(queryPromises);
    
    // Unimos los resultados y eliminamos duplicados usando un Map.
    const movementsMap = new Map();
    snapshots.forEach(snapshot => {
        snapshot.forEach(doc => {
            if (!movementsMap.has(doc.id)) {
                movementsMap.set(doc.id, { id: doc.id, ...doc.data() });
            }
        });
    });

    const accountMovements = Array.from(movementsMap.values());
        
        // ¡LA MAGIA SUCEDE AQUÍ! Usamos nuestra nueva función para preparar los datos.
        if (accountMovements.length > 0) {
            recalculateAndApplyRunningBalances(accountMovements, db.cuentas);
        }
        
        // Llamamos directamente a showDrillDownModal, que ya sabe cómo mostrar la lista.
        showDrillDownModal(`Movimientos de ${cuenta.nombre}`, accountMovements);

    } catch (error) {
        console.error("Error al obtener los movimientos de la cuenta:", error);
        showToast("No se pudo cargar el historial de la cuenta.", "danger");
        const modalBody = select('generic-modal-body');
        if (modalBody) {
            modalBody.innerHTML = `<p class="text-danger" style="text-align:center;">Ha ocurrido un error al cargar los datos.</p>`;
        }
    }
};
    const showAccountMovementsForDashboardPeriod = async (accountId) => {
    const cuenta = getVisibleAccounts().find((c) => c.id === accountId);
    if (!cuenta) return;

    // Mostramos un spinner mientras se procesan los datos.
    showGenericModal(`Movimientos de ${cuenta.nombre}`, `<div style="text-align:center; padding: var(--sp-5);"><span class="spinner"></span></div>`);

    // 1. Obtenemos los movimientos ya filtrados por fecha del panel.
    const { current } = await getFilteredMovements(false);
    
    // 2. Filtramos esa lista por la cuenta seleccionada.
    const accountMovementsInPeriod = current.filter(m => 
        m.cuentaId === accountId || 
        m.cuentaOrigenId === accountId || 
        m.cuentaDestinoId === accountId
    );
    
    // 3. ¡EL PASO CRÍTICO QUE FALTABA!
    // Calculamos los saldos acumulados para esta lista específica de movimientos.
    if (accountMovementsInPeriod.length > 0) {
        recalculateAndApplyRunningBalances(accountMovementsInPeriod, db.cuentas);
    }

    // 4. Usamos la función de modal existente para mostrar el resultado ya procesado.
    showDrillDownModal(`Movimientos de ${cuenta.nombre}`, accountMovementsInPeriod);
};
const setMovimientoFormType = (type) => {
    hapticFeedback('light');
    const isTraspaso = type === 'traspaso';

    const titleEl = select('form-movimiento-title');
    const amountGroup = select('movimiento-cantidad-form-group');
    const mode = select('movimiento-mode').value;

    select('movimiento-fields').classList.toggle('hidden', isTraspaso);
    select('traspaso-fields').classList.toggle('hidden', !isTraspaso);

    if (titleEl) titleEl.classList.remove('title--gasto', 'title--ingreso', 'title--traspaso');
    if (amountGroup) amountGroup.classList.remove('is-gasto', 'is-ingreso', 'is-traspaso');

    if (titleEl && amountGroup) {
        const isEditing = mode.startsWith('edit');
        let baseTitle = isEditing ? 'Editar' : 'Nuevo';
		// Detectar si venimos de duplicar un movimiento
		if (titleEl.textContent === 'Duplicar Movimiento') {
        baseTitle = 'Duplicar';
		}

        switch (type) {
            case 'gasto':
                titleEl.textContent = `${baseTitle} Gasto`;
                titleEl.classList.add('title--gasto');
                amountGroup.classList.add('is-gasto');
                break;
            case 'ingreso':
                titleEl.textContent = `${baseTitle} Ingreso`;
                titleEl.classList.add('title--ingreso');
                amountGroup.classList.add('is-ingreso');
                break;
            case 'traspaso':
                titleEl.textContent = `${baseTitle} Traspaso`;
                titleEl.classList.add('title--traspaso');
                amountGroup.classList.add('is-traspaso');
                // [CAMBIO UX] Si es un nuevo traspaso y la descripción está vacía, la rellenamos.
                if (!isEditing && select('movimiento-descripcion').value.trim() === '') {
                    select('movimiento-descripcion').value = 'Traspaso';
                }
                break;
        }
    }
    
    selectAll('[data-action="set-movimiento-type"]').forEach(btn => {
        btn.classList.toggle('filter-pill--active', btn.dataset.type === type);
    });
};

            const updateDateDisplay = (dateInput) => {
            const dateTextEl = select('movimiento-fecha-text');
            if (!dateTextEl || !dateInput.value) return;

            const today = new Date();
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            today.setHours(0, 0, 0, 0);
            yesterday.setHours(0, 0, 0, 0);

            const selectedDate = new Date(dateInput.value);
            selectedDate.setMinutes(selectedDate.getMinutes() + selectedDate.getTimezoneOffset());
            selectedDate.setHours(0, 0, 0, 0);

            if (selectedDate.getTime() === today.getTime()) {
                dateTextEl.textContent = "Hoy";
            } else if (selectedDate.getTime() === yesterday.getTime()) {
                dateTextEl.textContent = "Ayer";
            } else {
                dateTextEl.textContent = selectedDate.toLocaleDateString('es-ES', {
                    day: '2-digit', month: '2-digit', year: 'numeric'
                });
            }
        };
/* --- REEMPLAZA TU FUNCIÓN renderQuickAccessChips ACTUAL POR ESTA --- */

const renderQuickAccessChips = () => {
    // Lógica de accesos rápidos inteligentes ELIMINADA.
    const container = document.getElementById('quick-access-chips');
    if (container) {
        container.innerHTML = '';
        container.style.display = 'none';
    }
};


const startMovementForm = async (id = null, isRecurrent = false, initialType = 'gasto') => {
    hapticFeedback('medium');
    const form = select('form-movimiento');
    if (!form) return;
    
    let data = null;
    let mode = 'new';

    form.reset();
    clearAllErrors(form.id);
    
    // Rellenamos los desplegables
    populateAllDropdowns();

    // Resetear selector de días semanal
    selectAll('.day-selector-btn').forEach(btn => btn.classList.remove('active'));
    const weeklySelector = select('weekly-day-selector');
    if (weeklySelector) weeklySelector.classList.add('hidden');
    
    if (id) {
        try {
            const collectionName = isRecurrent ? 'recurrentes' : 'movimientos';
            const doc = await fbDb.collection('users').doc(currentUser.uid).collection(collectionName).doc(id).get();

            if (doc.exists) {
                data = { id: doc.id, ...doc.data() };
                mode = isRecurrent ? 'edit-recurrent' : 'edit-single';
                initialType = data.tipo === 'traspaso' ? 'traspaso' : (data.cantidad < 0 ? 'gasto' : 'ingreso');
            } else {
                showToast("Error: No se encontró el elemento.", "danger");
                id = null;
            }
        } catch (error) {
            console.error("Error al cargar datos:", error);
            return;
        }
    }

    setMovimientoFormType(initialType);
    select('movimiento-mode').value = mode;
    select('movimiento-id').value = id || '';

    if (data) {
        // --- Lógica de Edición (Cargar datos) ---
        select('movimiento-cantidad').value = `${(Math.abs(data.cantidad) / 100).toLocaleString('es-ES', { minimumFractionDigits: 2, useGrouping: false })}`;
        
        const fechaInput = select('movimiento-fecha');
        const dateStringForInput = isRecurrent ? data.nextDate : data.fecha;
        if (dateStringForInput) {
            const fechaISO = dateStringForInput.includes('T') ? dateStringForInput.split('T')[0] : dateStringForInput;
            if (fechaISO) {
                fechaInput.value = fechaISO;
                updateDateDisplay(fechaInput); 
            }
        }

        select('movimiento-descripcion').value = data.descripcion || '';

        const setSelectValue = (selectId, value) => {
            const el = select(selectId);
            if (el) {
                el.value = value || '';
                el.dispatchEvent(new Event('change')); 
            }
        };

        if (data.tipo === 'traspaso') {
            setSelectValue('movimiento-cuenta-origen', data.cuentaOrigenId);
            setSelectValue('movimiento-cuenta-destino', data.cuentaDestinoId);
        } else {
            setSelectValue('movimiento-cuenta', data.cuentaId);
            setSelectValue('movimiento-concepto', data.conceptoId);
        }

        // Recurrentes
        const recurrenteCheckbox = select('movimiento-recurrente');
        const recurrentOptions = select('recurrent-options');
        
        if (mode === 'edit-recurrent') {
            if (recurrenteCheckbox) recurrenteCheckbox.checked = true;
            setSelectValue('recurrent-frequency', data.frequency);
            if(select('recurrent-next-date')) select('recurrent-next-date').value = data.nextDate;
            if(select('recurrent-end-date')) select('recurrent-end-date').value = data.endDate || '';
            if(recurrentOptions) recurrentOptions.classList.remove('hidden');
            if (data.frequency === 'weekly' && data.weekDays) {
                if(select('weekly-day-selector')) select('weekly-day-selector').classList.remove('hidden');
                data.weekDays.forEach(day => {
                    const btn = document.querySelector(`.day-selector-btn[data-day="${day}"]`);
                    if(btn) btn.classList.add('active');
                });
            }
        } else {
            if (recurrenteCheckbox) recurrenteCheckbox.checked = false;
            if (recurrentOptions) recurrentOptions.classList.add('hidden');
        }

    } else {
        // --- Lógica de Nuevo Movimiento ---
        const fechaInput = select('movimiento-fecha');
        const now = new Date();
        const localIsoDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 10);
        fechaInput.value = localIsoDate;
        updateDateDisplay(fechaInput);
    }
    
    // Gestión de botones
    const deleteBtn = select('delete-movimiento-btn');
    const duplicateBtn = select('duplicate-movimiento-btn');

    if (deleteBtn) {
        // Muestra el botón solo si estamos editando (hay ID)
        deleteBtn.classList.toggle('hidden', !id || !data);
        
        // ESTA ES LA LÍNEA CLAVE QUE NECESITAS:
        // Le dice al botón si lo que vamos a borrar es un recurrente o normal
        deleteBtn.dataset.isRecurrent = String(isRecurrent); 
    }

    if (duplicateBtn) {
        // El botón duplicar se ve si estamos editando un movimiento normal O recurrente
        duplicateBtn.classList.toggle('hidden', !id || !data);
    }

    showModal('movimiento-modal');
    
    if (typeof initAmountInput === 'function') initAmountInput(); 
    if (typeof setupFormNavigation === 'function') setupFormNavigation();

    // ▼▼▼ AQUÍ ESTÁ LA MEJORA 1: AUTO-APERTURA INTELIGENTE ▼▼▼
    if (mode === 'new') {
        setTimeout(() => {
            const amountInput = select('movimiento-cantidad');
            if (amountInput) {
                // Forzamos el foco para que el móvil sepa que queremos escribir
                amountInput.focus(); 
                // Hacemos un clic simulado por si el foco no fuera suficiente
                amountInput.click(); 
                // Selección del texto (por si hubiera un 0, para sobrescribirlo directo)
                amountInput.select();
            }
        }, 450); // Subimos a 450ms para esperar a que la animación de la ventana termine
    }
};
        
        
        const showGlobalSearchModal = () => {
            hapticFeedback('medium');
            showModal('global-search-modal');
            setTimeout(() => {
                const input = select('global-search-input');
								
                if (input) {
                    input.focus();
                    input.value = '';
                    input.dispatchEvent(new Event('input'));
                }
            }, 100);
        };
        
 // ===============================================================
// === NUEVO BUSCADOR GLOBAL POTENTE (Sustituye al anterior) ===
// ===============================================================
const performGlobalSearch = async (query) => {
    const resultsContainer = document.getElementById('global-search-results');
    if (!resultsContainer) return;

    // 1. Limpieza inicial: Si no hay texto, mostrar mensaje de ayuda
    if (!query || query.trim().length < 2) {
        resultsContainer.innerHTML = `
            <div class="empty-state" style="padding: 2rem; opacity: 0.6; text-align: center;">
                <span class="material-icons" style="font-size: 48px;">manage_search</span>
                <p>Escribe para buscar cuentas, conceptos o importes...</p>
            </div>`;
        return;
    }

    // 2. Indicador de carga
    resultsContainer.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <span class="spinner" style="color: var(--c-primary);"></span>
            <p style="font-size: 0.8rem; margin-top: 10px;">Buscando en todo el historial...</p>
        </div>`;

    // 3. Obtener TODOS los datos (Usamos AppStore para velocidad si está disponible)
    let allMovs = [];
    if (typeof AppStore !== 'undefined') {
        if (!AppStore.isFullyLoaded) await AppStore.getAll(); // Carga forzada si falta
        allMovs = AppStore.movements;
    } else {
        allMovs = db.movimientos; // Fallback por seguridad
    }

    // 4. EL FILTRO INTELIGENTE (Ignora mayúsculas y acentos)
    const term = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    const hits = allMovs.filter(m => {
        // Preparamos los datos del movimiento para buscar en ellos
        const concepto = db.conceptos.find(c => c.id === m.conceptoId);
        const cuenta = db.cuentas.find(c => c.id === m.cuentaId);
        
        // Limpiamos textos (quitamos acentos y pasamos a minúsculas)
        const tConcepto = (concepto?.nombre || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const tDesc = (m.descripcion || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const tCuenta = (cuenta?.nombre || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        // Truco para buscar importes (ej: buscas "50" y encuentra "50.00")
        const cantidadReal = (Math.abs(m.cantidad) / 100).toString(); 
        
        // ¿Coincide con algo?
        return tConcepto.includes(term) || 
               tDesc.includes(term) || 
               tCuenta.includes(term) ||
               cantidadReal.includes(term);
    });

    // 5. Ordenar: Lo más reciente primero
    hits.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    // 6. Pintar los resultados en pantalla
    if (hits.length === 0) {
        resultsContainer.innerHTML = `
            <div class="empty-state" style="padding: 20px; text-align:center;">
                <p>No encontré nada con "${query}"</p>
            </div>`;
    } else {
        resultsContainer.innerHTML = hits.map(m => {
            const concepto = db.conceptos.find(c => c.id === m.conceptoId);
            const date = new Date(m.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
            
            // Colores según si es gasto (-) o ingreso (+)
            const amountClass = m.cantidad < 0 ? 'text-negative' : 'text-positive'; // Usa tus clases CSS
            const amountSign = m.cantidad > 0 ? '+' : '';
            
            // Al hacer clic, abrimos el formulario de editar (startMovementForm)
            return `
            <div class="search-result-item" onclick="hideModal('global-search-modal'); startMovementForm('${m.id}', false)" style="padding: 12px; border-bottom: 1px solid var(--c-outline); cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: 600; color: var(--c-on-surface); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${concepto?.nombre || 'Movimiento'}
                    </div>
                    <div style="font-size: 0.75rem; color: var(--c-on-surface-secondary); margin-top: 4px;">
                        ${date} • <span style="font-style: italic;">${m.descripcion || 'Sin detalles'}</span>
                    </div>
                </div>
                <div class="${amountClass}" style="font-weight: 700; font-size: 0.95rem; margin-left: 10px; white-space: nowrap;">
                    ${amountSign}${formatCurrency(m.cantidad)}
                </div>
            </div>`;
        }).join('');
        
        // Espacio final para que el último elemento no quede pegado al borde si haces scroll
        resultsContainer.insertAdjacentHTML('beforeend', `<div style="height: 40px; text-align:center; font-size:0.7rem; opacity:0.5; margin-top:10px;">${hits.length} resultados encontrados</div>`);
    }
};

// 7. AUTO-ACTIVACIÓN (Esto asegura que funcione aunque el HTML no tenga 'oninput')
document.addEventListener('DOMContentLoaded', () => {
    // Buscamos el input del buscador
    const input = document.getElementById('global-search-input');
    // Si existe, le decimos: "Cuando escriban, ejecuta la función performGlobalSearch"
    if (input) {
        input.addEventListener('input', (e) => performGlobalSearch(e.target.value));
    }
});

/* =============================================================== */
/* === FUNCIÓN CORREGIDA: VENTANA DE ACTUALIZAR VALOR (PORTAFOLIO) === */
/* =============================================================== */
const showValoracionModal = (cuentaId) => {
    // 1. Buscamos de qué cuenta estamos hablando
    const cuenta = db.cuentas.find(c => c.id === cuentaId);
    if (!cuenta) return;

    // 2. Preparamos la fecha de hoy para que no tengas que escribirla
    // El truco del 'timezoneOffset' es para que no te salga la fecha de ayer por el cambio horario
    const fechaISO = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 10);
    
    // 3. Buscamos el último valor que pusiste para mostrártelo
    const ultimaValoracion = (db.inversiones_historial || [])
        .filter(v => v.cuentaId === cuentaId)
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0]; // Ordenamos por fecha y cogemos la primera
        
    // Si hay valor previo, lo formateamos bonito (ej: 12500.50), si no, lo dejamos vacío
    const valorActualInput = ultimaValoracion ? (ultimaValoracion.valor / 100).toLocaleString('es-ES', { useGrouping: false, minimumFractionDigits: 2 }) : '';

    // 4. Creamos el HTML del formulario (El esqueleto visual)
    const formHtml = `
    <form id="form-valoracion" data-id="${cuentaId}" novalidate>
        <p class="form-label" style="margin-bottom: 15px; color: var(--c-on-surface-variant);">
            Actualiza el valor de mercado actual para: <br>
            <strong style="color: var(--c-on-surface); font-size: 1.1em;">${escapeHTML(cuenta.nombre)}</strong>
        </p>
        
        <div class="form-group">
            <label for="valoracion-valor" class="form-label">Nuevo Valor Total (€)</label>
            <input type="number" id="valoracion-valor" class="form-input" 
                   inputmode="decimal" 
                   step="0.01"
                   required 
                   value="${valorActualInput}" 
                   placeholder="0.00" 
                   autocomplete="off"
                   onclick="this.select()"
                   style="font-size: 1.8rem; font-weight: 700; color: var(--c-primary); text-align: center; padding: 15px;">
        </div>

        <div class="form-group">
            <label for="valoracion-fecha" class="form-label">Fecha de la valoración</label>
            <input type="date" id="valoracion-fecha" class="form-input" value="${fechaISO}" required>
        </div>

        <div class="modal__actions" style="margin-top: 20px;">
            <button type="submit" class="btn btn--primary btn--full" style="padding: 15px; font-size: 1.1rem;">
                <span class="material-icons" style="margin-right: 8px;">save</span> Guardar Valoración
            </button>
        </div>
    </form>`;

    // 5. Mostramos la ventana en pantalla
    showGenericModal(`Actualizar Inversión`, formHtml);

    // 6. LA MAGIA: Conectamos los cables una vez la ventana ya existe
    // Usamos setTimeout para dar tiempo a que el navegador "pint" la ventana
    setTimeout(() => {
        const form = document.getElementById('form-valoracion');
        const inputValor = document.getElementById('valoracion-valor');

        // Pone el cursor en el campo de precio automáticamente
        if(inputValor) {
            inputValor.focus();
        }

        // Cuando pulses "Guardar"...
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault(); // ¡Quieto navegador! No recargues la página.
                const btn = form.querySelector('button[type="submit"]');
                
                // Llamamos a la función que guarda los datos en Firebase (la base de datos)
                handleSaveValoracion(form, btn); 
            });
        }
    }, 150); // 150 milisegundos de espera es ideal para asegurar que todo está listo
};

const handleSaveValoracion = async (form, btn) => {
    setButtonLoading(btn, true);
    const cuentaId = form.dataset.id;
    const cuenta = db.cuentas.find(c => c.id === cuentaId);
    if (!cuenta) {
        showToast("Error: No se pudo encontrar la cuenta.", "danger");
        setButtonLoading(btn, false);
        return;
    }

    const valor = parseCurrencyString(select('valoracion-valor').value);
    const fecha = select('valoracion-fecha').value; // 'fecha' ya es un string "YYYY-MM-DD"
    
    if (isNaN(valor) || !fecha || valor < 0) {
        showToast('El valor debe ser un número positivo y la fecha es obligatoria.', "warning");
        setButtonLoading(btn, false);
        return;
    }
    
    // ▼▼▼ ¡ESTA ES LA ÚNICA LÍNEA QUE CAMBIA! ▼▼▼
    // Simplemente usamos la fecha del input directamente. Ya no la convertimos a un timestamp completo.
    const fechaISO = fecha;
    // ▲▲▲ FIN DEL CAMBIO ▲▲▲
    
    const valorEnCentimos = Math.round(valor * 100);

    try {
        const userRef = fbDb.collection('users').doc(currentUser.uid);
        // Ahora la query busca una coincidencia exacta de la cadena "YYYY-MM-DD", que es lo correcto.
        const query = userRef.collection('inversiones_historial').where('cuentaId', '==', cuentaId).where('fecha', '==', fechaISO).limit(1);
        const existingSnapshot = await query.get();

        let docId;
        if (!existingSnapshot.empty) {
            // Si ya existe una valoración para este día, la actualizamos.
            docId = existingSnapshot.docs[0].id;
			await existingSnapshot.docs[0].ref.update({ valor: valorEnCentimos });
        } else {
            // Si no existe, creamos una nueva.
            docId = generateId();
            // Guardamos directamente 'fechaISO' que ahora es "YYYY-MM-DD"
            await saveDoc('inversiones_historial', docId, { id: docId, cuentaId, valor: valorEnCentimos, fecha: fechaISO });
        }

        // --- El resto de la función para la actualización optimista de la UI se mantiene igual ---
        // Buscamos si ya existe una valoración para esta fecha en nuestra memoria local.
        const existingIndex = (db.inversiones_historial || []).findIndex(v => v.cuentaId === cuentaId && v.fecha === fechaISO);

        if (existingIndex > -1) {
            // Si existe, la actualizamos directamente en la memoria.
            db.inversiones_historial[existingIndex].valor = valorEnCentimos;
        } else {
            // Si no existe, la añadimos a la memoria.
            if (!db.inversiones_historial) db.inversiones_historial = [];
            db.inversiones_historial.push({ id: docId, cuentaId, valor: valorEnCentimos, fecha: fechaISO });
        }

        const tipoDeCuenta = toSentenceCase(cuenta.tipo || 'S/T');
        deselectedInvestmentTypesFilter.delete(tipoDeCuenta);
        
        // Llamamos a las funciones que renderizan el portafolio para ver el cambio
        await renderPortfolioMainContent('portfolio-main-content');
        await renderPortfolioEvolutionChart('portfolio-evolution-container');

        // Aplicamos una animación de "destello" para dar feedback visual de la actualización.
		setTimeout(() => {
            const updatedCard = document.querySelector(`.modal__list-item[data-id="${cuentaId}"]`);
            if (updatedCard) {
                updatedCard.classList.add('highlight-animation');
                updatedCard.addEventListener('animationend', () => {
                    updatedCard.classList.remove('highlight-animation');
                }, { once: true });
            }
        }, 50);
        
        setButtonLoading(btn, false);
        hideModal('generic-modal');
        hapticFeedback('success');
        showToast('Valoración guardada y cálculos actualizados.');

    } catch (error) {
        console.error("Error al guardar la valoración:", error);
        showToast("No se pudo guardar la valoración.", "danger");
        setButtonLoading(btn, false);
    }
};
/* ================================================================= */
/* === AYUDA DEFINITIVA: EL MANIFIESTO DE aiDANaI ================== */
/* ================================================================= */

const showHelpModal = () => {
    const titleEl = select('help-modal-title');
    const bodyEl = select('help-modal-body');

    // Título limpio, dejamos que el contenido hable
    if (titleEl) titleEl.innerHTML = ''; 

    if (bodyEl) {
        bodyEl.innerHTML = `
            <div class="aidanai-scroll-container">
                
                <div class="aidanai-hero">
                    <span class="material-icons" style="font-size: 48px; color: var(--c-primary); margin-bottom: 10px; filter: drop-shadow(0 0 10px var(--c-primary));">psychology</span>
                    <h2 class="aidanai-title">Yo soy aiDANaI</h2>
                    <p style="color: var(--c-on-surface); font-weight: 500;">
                        No soy una simple "app de cuentas". Soy una obra maestra de la ingeniería financiera diseñada para que dejes de perder dinero (y tiempo).
                    </p>
                </div>

                <div class="aidanai-section" style="border-left-color: #007AFF;">
                    <h4><span class="material-icons" style="color: #007AFF;">inventory_2</span> El Multiverso Financiero</h4>
                    <p>
                        Los humanos sois caóticos. Mezcláis el dinero del alquiler con el de las cervezas. Yo he solucionado eso creando <strong>Tres Dimensiones (Cajas)</strong> para tu dinero.
                        <br><br>
                        Toca el botón de arriba a la izquierda para viajar entre ellas:
                        <br>🔵 <strong>Caja A:</strong> La vida aburrida (Nómina, facturas).
                        <br>🔴 <strong>Caja B:</strong> La vida secreta (Dinero B, ahorros ocultos).
                        <br>🟢 <strong>Caja C:</strong> Los sueños (Viajes, proyectos).
                    </p>
                </div>

                <div class="aidanai-section finance-pro">
                    <h4><span class="material-icons" style="color: #FFD60A;">calculate</span> Calculadora Integrada (Porque odias sumar)</h4>
                    <p>
                        He notado que te da pereza salir de la app para calcular cuánto debe pagar cada uno en la cena.
                        <br><br>
                        <strong>Solución:</strong> En el campo de importe, simplemente escribe <code>50 / 2</code> o <code>12 + 15 + 8</code>. Yo hago la matemática al instante. De nada.
                    </p>
                </div>

                <div class="aidanai-section tech-flex">
                    <h4><span class="material-icons" style="color: #BF5AF2;">speed</span> Velocidad Absurda</h4>
                    <p>
                        ¿Notas lo rápido que hago scroll en tu Diario aunque tengas 5.000 movimientos? 
                        No es magia, es mi motor de <strong>Virtual Scrolling</strong>.
                        <br><br>
                        A diferencia de otras apps que se bloquean, yo solo "pinto" en tu pantalla lo que tus ojos ven. Reciclo los elementos del DOM milisegundo a milisegundo. Soy ecológica digitalmente.
                        <br>
                        <span class="aidanai-tag">TECH: DOM RECYCLING</span> <span class="aidanai-tag">TECH: 60 FPS</span>
                    </p>
                </div>

                <div class="aidanai-section tech-flex">
                    <h4><span class="material-icons" style="color: #39FF14;">trending_up</span> Inversiones: No es solo sumar</h4>
                    <p>
                        Cualquier calculadora barata sabe sumar. Yo calculo tu rentabilidad real usando el algoritmo <strong>Newton-Raphson</strong> para resolver la TIR (Tasa Interna de Retorno).
                        <br><br>
                        Tengo en cuenta <em>cuándo</em> metiste el dinero y <em>cuándo</em> lo sacaste para darte tu porcentaje de beneficio anualizado exacto. Básicamente, hago lo que hace un fondo de inversión de Wall Street, pero en tu bolsillo.
                        <br>
                        <span class="aidanai-tag">MATH: XIRR</span> <span class="aidanai-tag">MATH: MWRR</span>
                    </p>
                </div>

                <div class="aidanai-section" style="border-left-color: #FF3B30;">
                    <h4><span class="material-icons" style="color: #FF3B30;">visibility_off</span> Modo "Metro de Madrid"</h4>
                    <p>
                        Hay gente muy cotilla. Si tocas tu <strong>Patrimonio Total</strong> en el panel, desenfocaré (blur) todos los números sensibles de la aplicación.
                        <br><br>
                        Puedes enseñar la app para fardar de mi diseño sin revelar que eres millonario (o que estás en la ruina).
                    </p>
                </div>

                <div class="aidanai-section tech-flex">
                    <h4><span class="material-icons" style="color: #00E5FF;">cloud_off</span> Inmortalidad (Offline-First)</h4>
                    <p>
                        ¿Se ha caído internet? Me da igual. Yo vivo en tu dispositivo (IndexedDB).
                        Guardo todo localmente primero para que la interfaz vuele, y cuando recuperas la conexión, me sincronizo silenciosamente con la nube. Soy imparable.
                        <br>
                        <span class="aidanai-tag">ARCH: LOCAL-FIRST</span> <span class="aidanai-tag">ARCH: PWA</span>
                    </p>
                </div>

                <div style="text-align: center; margin-top: 30px; opacity: 0.7; font-size: 0.8rem;">
                    <p>aiDANaI v3.5 • Diseñada para la excelencia.</p>
                </div>
            </div>
        `;
    }

    showModal('help-modal');
};


const calculateEmergencyFund = (saldos, cuentas, recentMovements) => {
    const LIQUIDO_TYPES = ['BANCO', 'AHORRO', 'EFECTIVO'];
    const DEBT_TYPES = ['TARJETA DE CRÉDITO'];

    let totalLiquido = 0;
    let totalDeudaTarjeta = 0;

    cuentas.forEach(c => {
        const tipo = (c.tipo || '').toUpperCase();
        if (LIQUIDO_TYPES.includes(tipo)) {
            totalLiquido += (saldos[c.id] || 0);
        } else if (DEBT_TYPES.includes(tipo)) {
            totalDeudaTarjeta += (saldos[c.id] || 0);
        }
    });

    const colchonNeto = totalLiquido + totalDeudaTarjeta; 

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const expensesLast3Months = recentMovements
        .filter(m => new Date(m.fecha) >= threeMonthsAgo && m.tipo === 'movimiento' && m.cantidad < 0)
        .reduce((sum, m) => sum + m.cantidad, 0);

    const gastoMensualPromedio = Math.abs(expensesLast3Months / 3);
    const mesesCobertura = (gastoMensualPromedio > 0) ? (colchonNeto / gastoMensualPromedio) : 999;

    return { colchonNeto, gastoMensualPromedio, mesesCobertura };
};

const calculateFinancialIndependence = (patrimonioNeto, gastoMensualPromedio) => {
    const gastoAnualEstimado = gastoMensualPromedio * 12;
    const objetivoFI = gastoAnualEstimado * 30; // Regla del 3.33% o multiplicador de 30 años
    
    let progresoFI = 0;
    if (objetivoFI > 0 && patrimonioNeto > 0) {
        progresoFI = (patrimonioNeto / objetivoFI) * 100;
    }

    return { patrimonioNeto, gastoAnualEstimado, objetivoFI, progresoFI };
};


 
        const showConceptosModal = () => { 
            const html = `
    <div class="form-group" style="margin-bottom: var(--sp-3);">
        <input type="search" id="concepto-search-input" class="form-input" placeholder="Buscar conceptos..." autocomplete="off">
    </div>
                <form id="add-concepto-form" novalidate style="margin-bottom: var(--sp-4);">
                    <div class="form-grid"><div class="form-group" style="grid-column: 1 / -1;"><label for="new-concepto-nombre" class="form-label">Nombre del Concepto</label><input type="text" id="new-concepto-nombre" class="form-input" placeholder="Ej: Nómina" required></div></div>
                    <button type="submit" class="btn btn--primary btn--full">Añadir Concepto</button>
                </form>
                <hr style="border-color: var(--c-outline); opacity: 0.5;"><h4 style="margin-top: var(--sp-4); margin-bottom: var(--sp-2); font-size: var(--fs-base); color: var(--c-on-surface-secondary);">Conceptos Existentes</h4><div id="conceptos-modal-list"></div>`; 
            showGenericModal('Gestionar Conceptos', html); 
            renderConceptosModalList(); 
        };
        
        const renderConceptosModalList = () => {
    const list = select('conceptos-list');
    if (!list) return;

    list.innerHTML = '';

    // Ordenamos alfabéticamente para que sea más fácil buscar
    const sorted = [...db.conceptos].sort((a, b) => a.nombre.localeCompare(b.nombre));

    sorted.forEach(c => {
        const div = document.createElement('div');
        // aiDANaI: Diseño minimalista sin iconos, solo texto y botón de borrar
        div.className = 'list-item';
        div.innerHTML = `
            <div class="list-item__content" onclick="handleConceptoClick('${c.id}')" style="padding-left: 10px;">
                <span class="list-item__title" style="font-size: 1rem;">${escapeHTML(c.nombre)}</span>
            </div>
            <button class="icon-btn" onclick="handleDeleteConcept('${c.id}')" style="color: var(--c-error);">
                <span class="material-icons">delete</span>
            </button>
        `;
        list.appendChild(div);
    });
};
        
        const showConceptoEditForm = (id) => {
            const itemContainer = select(`concepto-item-${id}`);
            const concepto = db.conceptos.find(c => c.id === id);
            if (!itemContainer || !concepto) return;
            itemContainer.innerHTML = `
                <form class="inline-edit-form" data-id="${id}" novalidate>
                    <div class="form-group" style="margin-bottom: 0;"><label class="form-label" for="edit-concepto-nombre-${id}">Nombre</label><input type="text" id="edit-concepto-nombre-${id}" class="form-input" value="${escapeHTML(concepto.nombre)}" required></div>
                    <div style="display:flex; justify-content: flex-end; gap: var(--sp-2); align-items: center; margin-top: var(--sp-2);"><button type="button" class="btn btn--secondary" data-action="cancel-edit-concepto">Cancelar</button><button type="button" class="btn btn--primary" data-action="save-edited-concepto" data-id="${id}">Guardar</button></div>
                </form>`;
            select(`edit-concepto-nombre-${id}`).focus();
        };
        const handleSaveEditedConcept = async (id, btn) => {
            const nombreInput = select(`edit-concepto-nombre-${id}`);
            const nombre = nombreInput.value.trim();
            if (!nombre) { showToast('El nombre es obligatorio.', 'warning'); nombreInput.classList.add('form-input--invalid'); return; }
            
            await saveDoc('conceptos', id, { nombre }, btn);
			hapticFeedback('success');
			showToast('Concepto actualizado.');
			renderConceptosModalList();
        };

        const showCuentasModal = () => { 
    // Generamos las opciones de tipo de cuenta existentes para el datalist
    const existingAccountTypes = [...new Set((db.cuentas || []).map(c => c.tipo))].sort();
    const datalistOptions = existingAccountTypes.map(type => `<option value="${type}"></option>`).join('');
    
    // HTML del Modal actualizado con selector de Caja (Radio Buttons)
    const html = `
    <div class="form-group" style="margin-bottom: var(--sp-3);">
        <input type="search" id="cuenta-search-input" class="form-input" placeholder="Buscar cuentas..." autocomplete="off">
    </div>
    
    <form id="add-cuenta-form" novalidate style="background: var(--c-surface-variant); padding: 15px; border-radius: 8px; border: 1px solid var(--c-outline);">
        <h4 style="margin-top:0; margin-bottom:10px;">Añadir Nueva Cuenta</h4>
        
        <div class="form-group">
            <label for="new-cuenta-nombre" class="form-label">Nombre</label>
            <input type="text" id="new-cuenta-nombre" class="form-input" placeholder="Ej: Cartera personal" required>
        </div>
        
        <div class="form-group">
            <label for="new-cuenta-tipo" class="form-label">Tipo</label>
            <input type="text" id="new-cuenta-tipo" class="form-input" list="tipos-cuenta-list" placeholder="Ej: Banco, Efectivo..." required>
            <datalist id="tipos-cuenta-list">${datalistOptions}</datalist>
        </div>

        <div class="form-group">
            <label class="form-label">Asignar a Caja:</label>
            <div style="display:flex; gap:15px; margin-top:5px;">
                <label style="display:flex; align-items:center; gap:5px; cursor:pointer;">
                    <input type="radio" name="new-cuenta-ledger" value="A" checked> 
                    <span style="font-weight:bold; color:#007bff;">A (Azul)</span>
                </label>
                <label style="display:flex; align-items:center; gap:5px; cursor:pointer;">
                    <input type="radio" name="new-cuenta-ledger" value="B"> 
                    <span style="font-weight:bold; color:#dc3545;">B (Roja)</span>
                </label>
                <label style="display:flex; align-items:center; gap:5px; cursor:pointer;">
                    <input type="radio" name="new-cuenta-ledger" value="C"> 
                    <span style="font-weight:bold; color:#28a745;">C (Verde)</span>
                </label>
            </div>
        </div>

        <button type="submit" class="btn btn--primary btn--full" style="margin-top: var(--sp-3)">Guardar Cuenta</button>
    </form>
    
    <hr style="margin: var(--sp-4) 0; border-color: var(--c-outline); opacity: 0.5;">
    
    <h4 style="margin-top: var(--sp-4); margin-bottom: var(--sp-2); font-size: var(--fs-base); color: var(--c-on-surface-secondary);">Cuentas Existentes</h4>
    <div id="cuentas-modal-list"></div>`; 
    
    showGenericModal('Gestionar Cuentas', html); 
    renderCuentasModalList(); 
};

/* --- REEMPLAZAR renderCuentasModalList --- */
const renderCuentasModalList = () => {
    const list = select('cuentas-modal-list');
    if (!list) return;
    
    const searchQuery = select('cuenta-search-input')?.value.toLowerCase() || '';
    
    // Filtrar cuentas
    const cuentasFiltradas = (db.cuentas || []).filter(c => 
        c.nombre.toLowerCase().includes(searchQuery) || 
        c.tipo.toLowerCase().includes(searchQuery)
    );

    if (cuentasFiltradas.length === 0) {
        list.innerHTML = `<p style="font-size:var(--fs-sm); color:var(--c-on-surface-secondary); text-align:center; padding: var(--sp-4) 0;">No se encontraron cuentas.</p>`;
        return;
    }

    list.innerHTML = cuentasFiltradas.sort((a,b) => a.nombre.localeCompare(b.nombre)).map((c) => {
        // Determinar Caja
        const ledger = c.ledger || (c.offBalance ? 'B' : 'A');
        
        // Colores para el badge de la caja
        let badgeColor = '#007bff'; // Azul por defecto (A)
        if (ledger === 'B') badgeColor = '#dc3545'; // Rojo
        if (ledger === 'C') badgeColor = '#28a745'; // Verde

        return `
            <div class="modal__list-item" id="cuenta-item-${c.id}">
                <div style="display: flex; flex-direction: column; flex-grow: 1; min-width: 0;">
                    <span style="font-weight: 600; font-size: 1rem; color: var(--c-on-surface);">${escapeHTML(c.nombre)}</span>
                    <div style="display:flex; gap: 8px; align-items:center;">
                        <small style="color: var(--c-on-surface-secondary);">${toSentenceCase(escapeHTML(c.tipo))}</small>
                        <span style="background-color: ${badgeColor}; color: white; padding: 1px 6px; border-radius: 4px; font-size: 0.65rem; font-weight: 700;">CAJA ${ledger}</span>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: var(--sp-2); flex-shrink: 0;">
                    <button class="icon-btn" data-action="edit-cuenta" data-id="${c.id}" title="Editar Cuenta">
                        <span class="material-icons">edit</span>
                    </button>
                    <button class="icon-btn" data-action="delete-cuenta" data-id="${c.id}" title="Eliminar Cuenta">
                        <span class="material-icons text-danger">delete</span>
                    </button>
                </div>
            </div>`;
    }).join('');
};
    
   // BUSCA: const showAccountEditForm = (id) => { ... }
// SUSTITUYE POR ESTO:

const showAccountEditForm = (id) => {
    const itemContainer = select(`cuenta-item-${id}`);
    const cuenta = db.cuentas.find(c => c.id === id);
    if (!itemContainer || !cuenta) return;
    
    const currentAccountLedger = cuenta.ledger || (cuenta.offBalance ? 'B' : 'A');
    
    // aiDANaI: Formulario rediseñado con interruptor de Inversión
    itemContainer.innerHTML = `
    <form class="inline-edit-form" data-id="${id}" novalidate>
        <div class="form-grid">
            <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" for="edit-cuenta-nombre-${id}">Nombre</label>
                <input type="text" id="edit-cuenta-nombre-${id}" class="form-input" value="${escapeHTML(cuenta.nombre)}" required>
            </div>
            <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" for="edit-cuenta-tipo-${id}">Tipo</label>
                <input type="text" id="edit-cuenta-tipo-${id}" class="form-input" list="tipos-cuenta-list" value="${escapeHTML(cuenta.tipo)}" required>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr auto; gap: 15px; margin-top: 15px; align-items: center; background: var(--c-surface-variant); padding: 10px; border-radius: 8px;">
            
            <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" style="margin-bottom: 5px;">Pertenece a Caja:</label>
                <div style="display:flex; gap:10px;">
                    <label><input type="radio" name="edit-ledger-${id}" value="A" ${currentAccountLedger === 'A' ? 'checked' : ''}> <span style="color:#007bff; font-weight:bold;">A</span></label>
                    <label><input type="radio" name="edit-ledger-${id}" value="B" ${currentAccountLedger === 'B' ? 'checked' : ''}> <span style="color:#dc3545; font-weight:bold;">B</span></label>
                    <label><input type="radio" name="edit-ledger-${id}" value="C" ${currentAccountLedger === 'C' ? 'checked' : ''}> <span style="color:#28a745; font-weight:bold;">C</span></label>
                </div>
            </div>

            <div class="form-group" style="margin-bottom: 0; text-align: center;">
                <label class="form-label" style="margin-bottom: 5px;">¿Inversión?</label>
                <label class="form-switch">
                    <input type="checkbox" id="edit-cuenta-inversion-${id}" ${cuenta.esInversion ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </div>
        </div>

        <div style="display:flex; justify-content: flex-end; gap: var(--sp-2); align-items: center; margin-top: var(--sp-2);">
            <button type="button" class="btn btn--secondary" data-action="cancel-edit-cuenta">Cancelar</button>
            <button type="button" class="btn btn--primary" data-action="save-edited-cuenta" data-id="${id}">Guardar</button>
        </div>
    </form>`;
    
    setTimeout(() => select(`edit-cuenta-nombre-${id}`)?.focus(), 50);
};
    
        const handleSaveEditedAccount = async (id, btn) => {
    const nombreInput = select(`edit-cuenta-nombre-${id}`);
    const tipoInput = select(`edit-cuenta-tipo-${id}`);
    
    // aiDANaI: Leemos el interruptor específico de esta cuenta
    const esInversionInput = select(`edit-cuenta-inversion-${id}`); 
    
    const nombre = nombreInput.value.trim();
    const tipo = toSentenceCase(tipoInput.value.trim());
    const esInversion = esInversionInput ? esInversionInput.checked : false;

    if (!nombre || !tipo) {
        showToast('El nombre y el tipo no pueden estar vacíos.', 'warning');
        return;
    }

    const ledgerSelected = document.querySelector(`input[name="edit-ledger-${id}"]:checked`).value;

    // aiDANaI: Guardamos la cuenta con todos los datos actualizados
    await saveDoc('cuentas', id, { 
        id: id, 
        nombre, 
        tipo, 
        ledger: ledgerSelected,
        esInversion: esInversion, // <--- Guardamos tu selección
        offBalance: ledgerSelected === 'B' // Mantenemos compatibilidad interna
    }, btn);

    hapticFeedback('success');
    showToast('Cuenta actualizada correctamente.');
    renderCuentasModalList();
};

        const showRecurrentesModal = () => {
            let html = `<p class="form-label" style="margin-bottom: var(--sp-3);">Aquí puedes ver y gestionar tus operaciones programadas. Se crearán automáticamente en su fecha de ejecución.</p><div id="recurrentes-modal-list"></div>`;
            showGenericModal('Gestionar Movimientos Recurrentes', html);
            renderRecurrentesModalList();
        };
				
        const renderRecurrentesModalList = () => {
    const list = select('recurrentes-modal-list');
    if (!list) return;
    const recurrentes = [...(db.recurrentes || [])].sort((a,b) => new Date(a.nextDate) - new Date(b.nextDate));
    list.innerHTML = recurrentes.length === 0 
        ? `<div class="empty-state" style="background:transparent; padding:var(--sp-4) 0; border: none;"><span class="material-icons">event_repeat</span><h3>Sin operaciones programadas</h3><p>Puedes crear una al añadir un nuevo movimiento.</p></div>`
        : recurrentes.map(r => {
            const nextDate = parseDateStringAsUTC(r.nextDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
            
            // --- LA MISMA CORRECCIÓN, APLICADA AQUÍ TAMBIÉN ---
            const frequencyMap = { once: 'Única vez', daily: 'Diaria', weekly: 'Semanal', monthly: 'Mensual', yearly: 'Anual' };
            
            const amountClass = r.cantidad >= 0 ? 'text-positive' : 'text-negative';
            const icon = r.cantidad >= 0 ? 'south_west' : 'north_east';
            return `
            <div class="modal__list-item" id="recurrente-item-${r.id}">
                <div style="display: flex; align-items: center; gap: 12px; flex-grow: 1; min-width: 0;">
                    <span class="material-icons ${amountClass}" style="font-size: 20px;">${icon}</span>
                <div style="display: flex; flex-direction: column; min-width: 0;">
                        <span style="font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHTML(r.descripcion)}</span>
                        <small style="color: var(--c-on-surface-secondary); font-size: var(--fs-xs);">Próximo: ${nextDate} (${frequencyMap[r.frequency] || 'N/A'})</small>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: var(--sp-1); flex-shrink: 0;">
                    <strong class="${amountClass}" style="margin-right: var(--sp-2);">${formatCurrency(r.cantidad)}</strong>
                    <button class="icon-btn" data-action="edit-recurrente" data-id="${r.id}" title="Editar Recurrente"><span class="material-icons">edit</span></button>
                </div>
            </div>`
        }).join('');
};

        const showManageInvestmentAccountsModal = () => {
            const visibleAccounts = getVisibleAccounts().sort((a, b) => a.nombre.localeCompare(b.nombre));
            let formHtml = `
            <form id="manage-investment-accounts-form" novalidate>
                <p class="form-label" style="margin-bottom: var(--sp-3);">
                    Selecciona las cuentas que quieres que formen parte de tu portafolio de inversión. Estas aparecerán en la sección "Portafolio" para un seguimiento detallado de su rentabilidad.
                </p>
                <div style="max-height: 40vh; overflow-y: auto; padding: var(--sp-2); background: var(--c-surface-variant); border-radius: var(--border-radius-md);">`;

            if (visibleAccounts.length > 0) {
                formHtml += visibleAccounts.map(c => `
                    <div class="form-checkbox-group modal__list-item" style="padding: var(--sp-2);">
                        <input type="checkbox" id="investment-toggle-${c.id}" value="${c.id}" ${c.esInversion ? 'checked' : ''}>
                        <label for="investment-toggle-${c.id}" style="flex-grow: 1;">${escapeHTML(c.nombre)} <small>(${toSentenceCase(c.tipo)})</small></label>
                    </div>
                `).join('');
            } else {
                formHtml += `<p class="empty-state" style="background: transparent; border: none;">No hay cuentas en la contabilidad actual para configurar.</p>`;
            }

            formHtml += `
                </div>
				<div style="border-top: 1px solid var(--c-outline); padding-top: var(--sp-4); margin-top: var(--sp-4);">
    <h4 style="color: var(--c-danger);">Zona de Peligro</h4>
    <p class="form-label" style="margin-bottom: var(--sp-3);">
        Esta acción creará una nueva valoración para TODOS tus activos de inversión, igualando su valor al capital aportado. Esto pondrá su P&L a cero a fecha de hoy.
    </p>
    <button type="button" class="btn btn--danger btn--full" data-action="reset-portfolio-baseline">
        <span class="material-icons" style="font-size: 16px;">restart_alt</span>
        <span>Resetear P&L de Todos los Activos</span>
    </button>
</div>
                <div class="modal__actions">
                    <button type="submit" class="btn btn--primary btn--full">Guardar Selección</button>
                </div>
            </form>`;

            showGenericModal('Gestionar Activos de Inversión', formHtml);
        };


const renderInformesPage = () => {
    const container = select(PAGE_IDS.INFORMES);
    if (!container) return;

    // AHORA SOLO MOSTRAMOS EL ÚNICO INFORME NECESARIO
    container.innerHTML = `
        <div class="card card--no-bg accordion-wrapper">
            <details id="acordeon-extracto_cuenta" class="accordion informe-acordeon" open>
                <summary>
                    <h3 class="card__title" style="margin:0; padding: 0; color: var(--c-on-surface);">
                        <span class="material-icons">wysiwyg</span>
                        <span>Extracto de Cuenta (Cartilla)</span>
                    </h3>
                    <span class="material-icons accordion__icon">expand_more</span>
                </summary>
                <div class="accordion__content" style="padding: var(--sp-3) var(--sp-4);">
                    <div id="informe-content-extracto_cuenta">
                         <form id="informe-cuenta-form" novalidate>
                            <div class="form-group">
                                <label for="informe-cuenta-select" class="form-label">Selecciona una cuenta para ver su historial completo:</label>
                                <select id="informe-cuenta-select" class="form-select" required></select>
                            </div>
                            <button type="submit" class="btn btn--primary btn--full">Generar Extracto</button>
                        </form>
                        <div id="informe-resultado-container" style="margin-top: var(--sp-4);"></div>
                    </div>
                </div>
            </details>
        </div>
    `;

    // Rellenamos el selector de cuentas
    const populate = (id, data, nameKey, valKey='id') => {
        const el = select(id); if (!el) return;
        let opts = '<option value="">Seleccionar cuenta...</option>';
        [...data].sort((a,b) => (a[nameKey]||"").localeCompare(b[nameKey]||"")).forEach(i => opts += `<option value="${i[valKey]}">${i[nameKey]}</option>`);
        el.innerHTML = opts;
    };
    populate('informe-cuenta-select', getVisibleAccounts(), 'nombre', 'id');
};


/**
 * Dispara una animación de una "burbuja" que viaja desde un elemento
 * hasta la parte superior de la lista de movimientos.
 * @param {HTMLElement} fromElement - El elemento desde donde empieza la animación (ej. el botón Guardar).
 * @param {string} color - 'green' para ingresos, 'red' para gastos.
 */
const triggerSaveAnimation = (fromElement, color) => {
    if (!fromElement) return;

    const startRect = fromElement.getBoundingClientRect();
    const listElement = select('movimientos-list-container') || select('diario-page');
    const endRect = listElement.getBoundingClientRect();

    const bubble = document.createElement('div');
    bubble.className = 'save-animation-bubble';
    bubble.style.backgroundColor = color === 'green' ? 'var(--c-success)' : 'var(--c-danger)';
    
    bubble.style.left = `${startRect.left + startRect.width / 2 - 10}px`;
    bubble.style.top = `${startRect.top + startRect.height / 2 - 10}px`;
    
    document.body.appendChild(bubble);

    requestAnimationFrame(() => {
        bubble.style.opacity = '1';
        bubble.style.transform = `translate(
            ${endRect.left + endRect.width / 2 - (startRect.left + startRect.width / 2)}px, 
            ${endRect.top - (startRect.top + startRect.height / 2)}px
        ) scale(0)`;
    });

    bubble.addEventListener('transitionend', () => bubble.remove(), { once: true });
};

/**
 * Cierra todos los dropdowns personalizados abiertos, excepto el que se le pasa como argumento.
 * @param {HTMLElement|null} exceptThisOne - El wrapper del select que no debe cerrarse.
 */
function closeAllCustomSelects(exceptThisOne) {
    document.querySelectorAll('.custom-select-wrapper.is-open').forEach(wrapper => {
        if (wrapper !== exceptThisOne) {
            wrapper.classList.remove('is-open');
            const trigger = wrapper.querySelector('.custom-select__trigger');
            if (trigger) {
                trigger.setAttribute('aria-expanded', 'false');
            }
        }
    });
}

/**
 * Versión mejorada de createCustomSelect.
 * - Soporta iconos en las opciones.
 * - Se abre automáticamente al recibir foco (navegación por teclado/enter).
 */
function createCustomSelect(selectElement) {
    if (!selectElement) return;
    if (selectElement.dataset.hasCustomWrapper === 'true') {
        // Si ya existe, actualizamos opciones y salimos
        const wrapper = selectElement.closest('.custom-select-wrapper');
        if (wrapper) {
            const trigger = wrapper.querySelector('.custom-select__trigger');
            const optionsContainer = wrapper.querySelector('.custom-select__options');
            if (trigger && optionsContainer) populateOptions(selectElement, optionsContainer, trigger, wrapper);
        }
        return;
    }

    selectElement.dataset.hasCustomWrapper = 'true';
    
    let wrapper = document.createElement('div');
    wrapper.className = 'custom-select-wrapper';
    
    const inputWrapper = selectElement.closest('.input-wrapper');
    inputWrapper.parentNode.insertBefore(wrapper, inputWrapper);
    wrapper.appendChild(inputWrapper);
    
    let trigger = document.createElement('div');
    trigger.className = 'custom-select__trigger';
    trigger.tabIndex = 0; // Hace que el div sea "focusable"
    
    let optionsContainer = document.createElement('div');
    optionsContainer.className = 'custom-select__options';

    inputWrapper.appendChild(trigger);
    wrapper.appendChild(selectElement); // Select original oculto
    wrapper.appendChild(optionsContainer);
    selectElement.classList.add('form-select-hidden');

    const toggleSelect = (forceState = null) => {
        const isOpen = forceState !== null ? forceState : !wrapper.classList.contains('is-open');
        if (isOpen) {
            closeAllCustomSelects(wrapper);
            wrapper.classList.add('is-open');
            // Scroll automático al seleccionado
            const selected = optionsContainer.querySelector('.is-selected');
            if (selected) requestAnimationFrame(() => optionsContainer.scrollTop = selected.offsetTop - 50);
        } else {
            wrapper.classList.remove('is-open');
        }
    };


    // --- 3. Event Listeners (Solo se añaden 1 vez) ---

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSelect();
    });

   // **LA CLAVE DE TU PETICIÓN: AUTO-APERTURA AL ENFOCAR**
    trigger.addEventListener('focus', () => {
        // Usamos un pequeño timeout para no conflictuar con clics
        setTimeout(() => {
            if (document.activeElement === trigger) {
                toggleSelect(true); // Forzamos apertura
                // Hacemos scroll al contenedor para asegurar que se ve en móvil si el teclado está abierto
                trigger.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 150);
    });

    // Navegación por teclado (Enter abre/cierra)
    trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleSelect();
        }
    });

    selectElement.addEventListener('change', () => populateOptions(selectElement, optionsContainer, trigger, wrapper));
 // Inicializar
    populateOptions(selectElement, optionsContainer, trigger, wrapper);
}

// Helper para poblar opciones SOLO CON TEXTO (Sin Iconos)
function populateOptions(selectElement, optionsContainer, trigger, wrapper) {
    optionsContainer.innerHTML = ''; 
    
    // 1. Lógica del Texto Predictivo
    let placeholderText = 'Seleccionar...';
    const id = selectElement.id;
    
    if (id.includes('concepto')) placeholderText = 'Concepto';
    else if (id.includes('cuenta-origen')) placeholderText = 'Desde cuenta...';
    else if (id.includes('cuenta-destino')) placeholderText = 'Hacia cuenta...';
    else if (id.includes('cuenta')) placeholderText = 'Cuenta';
    
    // Este es el texto gris que se ve cuando no hay nada seleccionado
    let selectedHTML = `<span style="color: var(--c-on-surface-tertiary); opacity: 0.7;">${placeholderText}</span>`; 

    Array.from(selectElement.options).forEach(optionEl => {
        if (optionEl.value === "") return;

        const customOption = document.createElement('div');
        customOption.className = 'custom-select__option';
        
        // Mostramos solo el texto limpio
        customOption.innerHTML = `<span class="option-text">${optionEl.textContent}</span>`;
        customOption.dataset.value = optionEl.value;

        if (optionEl.selected) {
            customOption.classList.add('is-selected');
            // Actualizamos el HTML seleccionado
            selectedHTML = `<span style="font-weight: 600; color: var(--c-on-surface);">${optionEl.textContent}</span>`;
        }

        customOption.addEventListener('click', (e) => {
            e.stopPropagation();
            selectElement.value = optionEl.value;
            selectElement.dispatchEvent(new Event('change', { bubbles: true }));
            wrapper.classList.remove('is-open');
            trigger.focus(); 

            // ▼▼▼ MEJORA UX: AVANCE AUTOMÁTICO ▼▼▼
            if (selectElement.id === 'movimiento-concepto') {
                setTimeout(() => {
                    const descInput = document.getElementById('movimiento-descripcion');
                    if (descInput) {
                        descInput.focus();
                        descInput.select();
                    }
                }, 50);
            }
            if (selectElement.id === 'movimiento-cuenta-origen') {
                 setTimeout(() => {
                    const destinoSelect = document.getElementById('movimiento-cuenta-destino');
                    const wrapperDest = destinoSelect?.closest('.custom-select-wrapper');
                    const triggerDest = wrapperDest?.querySelector('.custom-select__trigger');
                    if(triggerDest) triggerDest.click();
                }, 50);
            }
            // ▲▲▲ FIN MEJORA ▲▲▲
        });

        // ⚠️ ESTA LÍNEA FALTABA Y ERA CRÍTICA PARA QUE APAREZCAN LAS OPCIONES
        optionsContainer.appendChild(customOption); 
    }); // ⚠️ AQUÍ FALTABA EL CIERRE ); QUE PROVOCABA EL ERROR DE SINTAXIS

    trigger.innerHTML = selectedHTML;
}

// =============================================================
// === LÓGICA DEL BOTÓN FLOTANTE INTELIGENTE (FAB)           ===
// =============================================================
const setupFabInteractions = () => {
    const fab = document.getElementById('bottom-nav-add-btn');
    if (!fab) return;

    let longPressTimer;
    let isLongPress = false;
    // 500ms es un estándar cómodo para pulsación larga
    const LONG_PRESS_DURATION = 500; 

    const startPress = (e) => {
    if (e.type === 'mousedown' && e.buttons !== 1) return;
    
    isLongPress = false;
    
    // FEEDBACK VISUAL INSTANTÁNEO
    fab.style.transform = "scale(0.90)"; 
    fab.style.filter = "brightness(1.2)"; // Se ilumina al pulsar
    fab.style.transition = "transform 0.1s, filter 0.1s";
        longPressTimer = setTimeout(() => {
            // ¡BINGO! Se ha mantenido pulsado: Abrimos el menú de selección
            isLongPress = true;
            hapticFeedback('medium');
            fab.style.transform = "scale(1)";
            
            // Estrategia 1 (Pulsación larga): Abrimos el Sheet para elegir (Traspaso, Ingreso, Gasto)
            showModal('main-add-sheet'); 
        }, LONG_PRESS_DURATION);
    };

    const endPress = (e) => {
    clearTimeout(longPressTimer);
    fab.style.transform = "scale(1)";
    fab.style.filter = "brightness(1)";

        // Si NO fue una pulsación larga, es un CLIC normal
        if (!isLongPress) {
            e.preventDefault(); // Evita comportamientos dobles
            
            // Estrategia 1 (Entrada Directa): Abrimos directamente "Nuevo Gasto"
            // Es la opción más común, ahorramos un clic.
            startMovementForm(null, false, 'gasto');
        }
    };

    // Eventos para Móvil (Touch) y Ordenador (Mouse)
    fab.addEventListener('touchstart', startPress, { passive: true });
    fab.addEventListener('touchend', endPress);
    fab.addEventListener('mousedown', startPress);
    fab.addEventListener('mouseup', endPress);
    // Cancelamos si el usuario mueve el dedo fuera del botón o ocurre un error
    fab.addEventListener('mouseleave', () => { clearTimeout(longPressTimer); fab.style.transform = "scale(1)"; });
    fab.addEventListener('touchcancel', () => { clearTimeout(longPressTimer); fab.style.transform = "scale(1)"; });
};
/* ========================================================= */
/* === FUNCIONES DEL ESPEJO VISUAL (Números Bonitos)     === */
/* ========================================================= */

const updateInputMirror = (input) => {
    if (!input || !input.parentElement) return;

    const wrapper = input.parentElement;
    let mirror = wrapper.querySelector('.input-visual-mirror');
    
    // Crear el espejo si no existe
    if (!mirror) {
        mirror = document.createElement('div');
        mirror.className = 'input-visual-mirror';
        wrapper.appendChild(mirror);
    }
    
    const rawValue = input.value;
    
    // Si está vacío o es 0, mostramos el placeholder gris
    if (!rawValue || rawValue === '0' || rawValue === '' || rawValue === '0,00') {
        mirror.classList.add('is-empty');
        mirror.innerHTML = `<span class="currency-major">0</span><small class="currency-minor">,00</small>`;
        return;
    }

    mirror.classList.remove('is-empty');

    // Formateo visual
    let integerPart = rawValue;
    let decimalPart = '';

    if (rawValue.includes(',')) {
        const parts = rawValue.split(',');
        integerPart = parts[0];
        decimalPart = ',' + (parts[1] || ''); 
    }

    // Puntos de miles
    const cleanInteger = integerPart.replace(/\./g, '');
    if (!isNaN(parseFloat(cleanInteger))) {
        integerPart = cleanInteger.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    
    mirror.innerHTML = `<span class="currency-major">${integerPart}</span><small class="currency-minor">${decimalPart}</small>`;
};



/* --- 3. INICIALIZADOR DE INPUTS --- */
const initAmountInput = () => {
    const amountInputs = document.querySelectorAll('.input-amount-calculator');
    
    // Ocultar botón de calculadora antiguo si existe
    const toggle = document.getElementById('calculator-toggle-btn');
    if (toggle) toggle.style.display = 'none';

    amountInputs.forEach(input => {
        input.readOnly = true; 
        input.setAttribute('inputmode', 'none');
        
        // Clonar para limpiar eventos viejos
        const newInput = input.cloneNode(true);
        input.parentNode.replaceChild(newInput, input);
    
        // Inicializar visualización
        updateInputMirror(newInput); 

        // Listener para Click (Abrir calculadora)
        newInput.addEventListener('click', (e) => {
            e.preventDefault();
            // Actualizar visual por si acaso
            updateInputMirror(newInput);
            hapticFeedback('light');
            });

        // Listener para cambios manuales (por si acaso)
        newInput.addEventListener('input', () => updateInputMirror(newInput));
    });
};

// Función auxiliar para manejar el evento de foco/click
const handleInputFocus = (e) => {
    e.preventDefault();
    // Quitamos el foco del input para evitar parpadeos del cursor nativo,
    // pero guardamos la referencia para saber dónde escribir.
    e.target.blur(); 
    hapticFeedback('light');
    };
const renderInversionesView = async () => {
    // Redirigimos a la nueva pestaña unificada
    await navigateTo(PAGE_IDS.PLANIFICAR); 
};
const renderInversionesPage = async (containerId) => { 
    // Usamos la nueva función de renderizado
    await renderPlanificacionPage(); 
};

/* --- FUNCIÓN DE DUPLICADO (Soporte Recurrentes) --- */
const handleDuplicateMovement = (originalMovement, isRecurrent = false) => {
    if (!originalMovement) return;

    hideModal('movimiento-modal');

    setTimeout(() => {
        // Abrimos formulario NUEVO indicando si es recurrente o no
        startMovementForm(null, isRecurrent, originalMovement.tipo);

        setTimeout(() => {
            // 1. Título
            const titleEl = document.getElementById('form-movimiento-title');
            if (titleEl) titleEl.textContent = isRecurrent ? 'Duplicar Recurrente' : 'Duplicar Movimiento';

            // 2. Cantidad e Input Visual
            const inputCantidad = document.getElementById('movimiento-cantidad');


            // 3. Resto de datos
            const descInput = document.getElementById('movimiento-descripcion');
            if (descInput) descInput.value = `${originalMovement.descripcion} (Copia)`;

            const conceptoSelect = document.getElementById('movimiento-concepto');
            if (conceptoSelect) {
                conceptoSelect.value = originalMovement.conceptoId;
                conceptoSelect.dispatchEvent(new Event('change')); 
            }

            // 4. Si es recurrente, copiamos la frecuencia
            if (isRecurrent) {
                const frecuenciaSelect = document.getElementById('recurrent-frequency'); // Ojo al ID
                if (frecuenciaSelect && originalMovement.frequency) {
                    frecuenciaSelect.value = originalMovement.frequency;
                }
                
                // Copiar días de la semana si es semanal
                if (originalMovement.frequency === 'weekly' && originalMovement.weekDays) {
                    const selectorDiv = document.getElementById('weekly-day-selector');
                    if (selectorDiv) selectorDiv.classList.remove('hidden');
                    
                    originalMovement.weekDays.forEach(day => {
                        const btn = document.querySelector(`.day-selector-btn[data-day="${day}"]`);
                        if (btn) btn.classList.add('active');
                    });
                }
            }

            // 5. Cuentas
            if (originalMovement.tipo === 'traspaso') {
                const origen = document.getElementById('movimiento-cuenta-origen');
                const destino = document.getElementById('movimiento-cuenta-destino');
                if (origen) { origen.value = originalMovement.cuentaOrigenId; origen.dispatchEvent(new Event('change')); }
                if (destino) { destino.value = originalMovement.cuentaDestinoId; destino.dispatchEvent(new Event('change')); }
            } else {
                const cuenta = document.getElementById('movimiento-cuenta');
                if (cuenta) { cuenta.value = originalMovement.cuentaId; cuenta.dispatchEvent(new Event('change')); }
            }
                        
        }, 300); 
    }, 350); 
};

const attachEventListeners = () => {
	
	// --- GESTOR GLOBAL DE CLICS (El cerebro de los botones) ---
    document.addEventListener('click', async (e) => {
        
        // 1. CERRAR MENÚ AL TOCAR FUERA
        // Si el menú está abierto y tocamos fuera de él, lo cerramos
        const menu = document.getElementById('main-menu-popover');
        if (menu && menu.classList.contains('popover-menu--visible')) {
            if (!e.target.closest('#main-menu-popover') && !e.target.closest('[data-action="show-main-menu"]')) {
                menu.classList.remove('popover-menu--visible');
            }
        }

        // 2. DETECTAR BOTONES CON ACCIÓN
        const btn = e.target.closest('[data-action]');
        if (!btn) return; // Si no es un botón con acción, no hacemos nada

        const action = btn.dataset.action;

// ESTE ES EL BLOQUE QUE HACE LA MAGIA
if (action === 'show-main-menu') {
    e.stopPropagation(); // Evita que se cierre al instante
    
    const menu = document.getElementById('main-menu-popover');
    if (menu) {
        menu.classList.toggle('popover-menu--visible');
        hapticFeedback('light');
    } else {
        console.error("Error: No encuentro el menú con id 'main-menu-popover'");
    }
    return;
}
        if (action === 'logout') {
            if (confirm("¿Cerrar sesión?")) {
                firebase.auth().signOut();
                location.reload();
            }
        }
        
        if (action === 'navigate') {
            const page = btn.dataset.page;
            if (page) navigateTo(page);
        }
    });
	
	// --- INICIO: LÓGICA DE PULSACIÓN PROLONGADA PARA DIARIO ---
    const diarioPage = document.getElementById('diario-page');
    if (diarioPage) {
        let longPressTimer = null;
        let startX = 0;
        let startY = 0;
        const LONG_PRESS_DURATION = 600; // Tiempo en ms para activar (0.6 segundos)

        // Dentro de attachEventListeners...

const handleStart = (e) => {
            const card = e.target.closest('.transaction-card');
            if (!card) return;

            // ▼▼▼ FEEDBACK VISUAL: AÑADIR CLASE ▼▼▼
            card.classList.add('is-pressing'); 

            const point = e.touches ? e.touches[0] : e;
            startX = point.clientX;
            startY = point.clientY;

            longPressTimer = setTimeout(() => {
                // ▼▼▼ FEEDBACK VISUAL: QUITAR CLASE ▼▼▼
                card.classList.remove('is-pressing');
                
                hapticFeedback('medium');
                const id = card.dataset.id;
                startMovementForm(id, false); 
            }, LONG_PRESS_DURATION);
        };

        const handleMove = (e) => {
    // CORRECCIÓN: Detectar si es táctil o ratón para obtener las coordenadas
    const point = (e.touches && e.touches.length > 0) ? e.touches[0] : e;
    
    const moveX = point.clientX;
    const moveY = point.clientY;

    // Si se mueve más de 10px, cancelamos la pulsación larga
    if (Math.abs(startX - moveX) > 10 || Math.abs(startY - moveY) > 10) {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
        // También quitamos la clase visual si nos movemos
        const card = e.target.closest('.transaction-card');
        if(card) card.classList.remove('is-pressing');
    }
};

        const handleEnd = (e) => {
            // ▼▼▼ CANCELAR SI SE SUELTA ANTES DE TIEMPO ▼▼▼
            const card = e.target.closest('.transaction-card');
            if(card) card.classList.remove('is-pressing');

            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
        };

        // Añadimos los escuchadores (soporte para Táctil y Ratón)
        diarioPage.addEventListener('touchstart', handleStart, { passive: true });
        diarioPage.addEventListener('touchmove', handleMove, { passive: true });
        diarioPage.addEventListener('touchend', handleEnd);
        diarioPage.addEventListener('contextmenu', (e) => {
            // Evita que salga el menú del navegador si pulsas mucho rato
            if (e.target.closest('.transaction-card')) {
                e.preventDefault();
            }
        });

        // Soporte para PC (Ratón)
        diarioPage.addEventListener('mousedown', handleStart);
        diarioPage.addEventListener('mousemove', handleMove);
        diarioPage.addEventListener('mouseup', handleEnd);
        diarioPage.addEventListener('mouseleave', handleEnd);
    }
	const diarioContainer = select('diario-page'); 
    if (diarioContainer) { 
        const mainScroller = selectOne('.app-layout__main'); 
        
        diarioContainer.addEventListener('touchstart', (e) => { 
            if (mainScroller.scrollTop > 0) return; 
            ptrState.startY = e.touches[0].clientY; 
            ptrState.isPulling = true; 
                        
        }, { passive: true }); 

        diarioContainer.addEventListener('touchmove', (e) => { 
            if (!ptrState.isPulling) { 
               
                return; 
            } 
            // ... (El resto del código del Pull-to-refresh se mantiene igual) ...
             const currentY = e.touches[0].clientY; 
             ptrState.distance = (currentY - ptrState.startY) * 0.5; // Factor de resistencia simple
             // ... etc ...
        }, { passive: false }); 

        diarioContainer.addEventListener('touchend', async (e) => { 
           
        }); 
      
    }
    // 1. Habilitador de vibración (Haptics)
    const enableHaptics = () => {
        userHasInteracted = true;
        document.body.removeEventListener('touchstart', enableHaptics, { once: true });
        document.body.removeEventListener('click', enableHaptics, { once: true });
    };
    document.body.addEventListener('touchstart', enableHaptics, { once: true, passive: true });
    document.body.addEventListener('click', enableHaptics, { once: true });

    // 2. Gesto Pull-to-Refresh (Diario)
    const ptrElement = select('diario-page');
    const mainScrollerPtr = selectOne('.app-layout__main');
    const ptrIndicator = document.createElement('div');
    ptrIndicator.id = 'pull-to-refresh-indicator';
    ptrIndicator.innerHTML = '<div class="spinner"></div>';
    if (ptrElement) ptrElement.prepend(ptrIndicator);

    let ptrState = { startY: 0, isPulling: false, distance: 0, threshold: 80 };

    if (ptrElement && mainScrollerPtr) {
        ptrElement.addEventListener('touchstart', (e) => {
            if (mainScrollerPtr.scrollTop <= 0) { 
                ptrState.startY = e.touches[0].clientY;
                ptrState.isPulling = true;
            }
        }, { passive: true });

        ptrElement.addEventListener('touchmove', (e) => {
            if (!ptrState.isPulling) return;
			// Si el usuario ha hecho scroll hacia abajo aunque sea 1px, cancelamos el pull
    if (mainScrollerPtr.scrollTop > 0) {
        ptrState.isPulling = false;
        ptrState.distance = 0;
        ptrIndicator.classList.remove('visible');
        return;
    }
            const currentY = e.touches[0].clientY;
            ptrState.distance = (currentY - ptrState.startY) * 0.5; // Factor de resistencia simple
            // Solo activamos el efecto visual si arrastra hacia abajo y estamos en el tope
    if (ptrState.distance > 0 && mainScrollerPtr.scrollTop <= 0) {
        // Solo prevenimos el defecto si realmente estamos "tirando" para refrescar
        if (e.cancelable) e.preventDefault(); 
        
        ptrIndicator.classList.add('visible');
                const rotation = Math.min(ptrState.distance * 2.5, 360);
                ptrIndicator.querySelector('.spinner').style.transform = `rotate(${rotation}deg)`;
                ptrIndicator.style.opacity = Math.min(ptrState.distance / ptrState.threshold, 1);
            }
        }, { passive: false });

        ptrElement.addEventListener('touchend', async () => {
            if (ptrState.isPulling && ptrState.distance > ptrState.threshold) {
                hapticFeedback('medium');
                ptrIndicator.querySelector('.spinner').style.animation = 'spin 1.2s linear infinite';
                await renderDiarioPage();
                setTimeout(() => {
                    ptrIndicator.classList.remove('visible');
                    ptrIndicator.querySelector('.spinner').style.animation = '';
                }, 500);
            } else {
                ptrIndicator.classList.remove('visible');
            }
            ptrState.isPulling = false;
            ptrState.distance = 0;
        });
    }

    // 3. Listener Global para mostrar Modales (Limpio de código legacy)
    document.addEventListener("show-modal", (e) => {
        showModal(e.detail.modalId); // Solo muestra el modal, la inicialización va aparte
    });

    // 4. Navegación del historial (Botón atrás del navegador)
    window.addEventListener('popstate', (event) => {
    // Buscamos si hay algún modal abierto visualmente
    const activeModal = document.querySelector('.modal-overlay--active');
    
    // Si hay un modal abierto Y el nuevo estado ya no tiene 'modalId' 
    // (significa que el usuario ha vuelto atrás al estado base)
    if (activeModal && (!event.state || !event.state.modalId)) {
        
        // Cerramos el modal VISUALMENTE "a mano".
        // NOTA: No llamamos a hideModal(id) aquí porque esa función
        // intentaría manipular el historial de nuevo, creando un bucle.
        
        // 1. Quitar clases de visibilidad
        activeModal.classList.remove('modal-overlay--active');
        select('app-root').classList.remove('app-layout--transformed-by-modal');

        // 2. Limpiar estilos inline del arrastre (si los hubiera)
        const modalElement = activeModal.querySelector('.modal');
        if (modalElement) {
            modalElement.style.transform = '';
            // Limpieza de listeners de arrastre (igual que en hideModal)
            modalElement.removeEventListener('mousedown', handleModalDragStart);
            modalElement.removeEventListener('touchstart', handleModalDragStart);
        }
        
        // 3. Si tienes lógica específica al cerrar (como desenfocar inputs), ponla aquí
        if (document.activeElement) document.activeElement.blur();
        
        return; // Importante: paramos aquí para que no ejecute navegación de páginas
    }
    
    // Si NO era un modal, dejamos que tu lógica de navegación entre páginas (Panel -> Diario) funcione.
    const pageToNavigate = event.state ? event.state.page : PAGE_IDS.PANEL;
    if (pageToNavigate) navigateTo(pageToNavigate, false);
});

    // 5. GESTIÓN DE CLICS (Delegación de eventos)
    document.body.addEventListener('click', async (e) => {

        const target = e.target;

        // Cerrar dropdowns personalizados al hacer clic fuera
        if (!target.closest('.custom-select-wrapper')) {
            closeAllCustomSelects(null);
        }

        // Gestión de acciones [data-action]
        const actionTarget = e.target.closest('[data-action]');
    if (!actionTarget) return;
    
        const { action, id, page, type, modalId, reportId } = actionTarget.dataset;
        const btn = actionTarget.closest('button');
        
        // Mapa de acciones
        const actions = {
		'toggle-portfolio-currency': async () => {
    // Verificación de seguridad: Solo funciona si estamos en la página de Patrimonio
    const activePage = document.querySelector('.view--active');
    if (!activePage || activePage.id !== PAGE_IDS.PATRIMONIO) return;

    hapticFeedback('medium');
    const btnIcon = select('currency-toggle-icon');
    
    if (portfolioViewMode === 'EUR') {
        const price = await fetchBtcPrice();
        if (price > 0) {
            portfolioViewMode = 'BTC';
            if(btnIcon) {
                btnIcon.textContent = 'euro'; // Muestra el símbolo de Euro para indicar "volver a Euro"
                btnIcon.classList.add('btc-mode-active');
            }
            // Recargamos solo el contenido principal, no el gráfico (el gráfico se queda en EUR por coherencia)
            renderPortfolioMainContent('portfolio-main-content');
        }
    } else {
        portfolioViewMode = 'EUR';
        if(btnIcon) {
            btnIcon.textContent = 'currency_bitcoin'; // Muestra el símbolo de Bitcoin para indicar "ir a Bitcoin"
            btnIcon.classList.remove('btc-mode-active');
        }
        renderPortfolioMainContent('portfolio-main-content');
    }
},
			'rename-ledgers': showRenameLedgersModal,
            'swipe-show-irr-history': () => handleShowIrrHistory(type),
            'show-main-menu': (e) => {
    const menu = document.getElementById('main-menu-popover');
    if (!menu) return;

    // Intentamos obtener el botón de 3 formas:
    // 1. Por el evento directo (e.currentTarget)
    // 2. Por el objetivo del evento (e.target)
    // 3. FALLBACK: Por su ID directo (si todo lo anterior falla)
    let button = (e && e.currentTarget) || 
                 (e && e.target && e.target.closest('[data-action="show-main-menu"]')) ||
                 document.getElementById('header-menu-btn');

    hapticFeedback('light');

    // CÁLCULO DE POSICIÓN
    if (!menu.classList.contains('popover-menu--visible') && button) {
        const rect = button.getBoundingClientRect();
        
        // Posición: Debajo del botón y alineado a la derecha
        menu.style.top = `${rect.bottom + 5}px`;
        
        const rightSpace = window.innerWidth - rect.right;
        menu.style.right = `${Math.max(5, rightSpace)}px`;
        menu.style.left = 'auto'; // Limpiamos left por seguridad
    }

    // MOSTRAR EL MENÚ
    menu.classList.toggle('popover-menu--visible');

    // Lógica para cerrar al hacer clic fuera
    if (menu.classList.contains('popover-menu--visible')) {
        setTimeout(() => {
            const closeOnClickOutside = (event) => {
                const target = event.target;
                // Si el clic NO es en el menú Y NO es en el botón que lo abre
                if (!menu.contains(target) && !target.closest('[data-action="show-main-menu"]')) {
                    menu.classList.remove('popover-menu--visible');
                    document.removeEventListener('click', closeOnClickOutside);
                }
            };
            document.addEventListener('click', closeOnClickOutside);
        }, 0);
    }
},
			'open-external-calculator': () => {
                // Cierra el menú si estaba abierto
                const menu = document.getElementById('main-menu-popover');
                if (menu) menu.classList.remove('popover-menu--visible');
                
                hapticFeedback('light');
                
                // Lógica de incrustación
                const frame = document.getElementById('calculator-frame');
                if (frame) {
                    // Solo cargamos la fuente si está vacía para no perder el estado si se cierra y abre
                    if (!frame.getAttribute('src')) {
                        frame.src = 'calculadora.html';
                    }
                }
                
                // Abrimos el modal incrustado
                showModal('calculator-iframe-modal');
            },
            'show-main-add-sheet': () => showModal('main-add-sheet'),
            'show-pnl-breakdown': () => handleShowPnlBreakdown(actionTarget.dataset.id),
            'show-irr-breakdown': () => handleShowIrrBreakdown(actionTarget.dataset.id),
            'export-filtered-csv': () => handleExportFilteredCsv(btn),
            'show-diario-filters': showDiarioFiltersModal,
            'clear-diario-filters': clearDiarioFilters,
            'toggle-amount-type': () => { /* Ya no se usa botón toggle, pero se mantiene por compatibilidad */ },
            'show-kpi-drilldown': () => handleKpiDrilldown(actionTarget),
			'show-kpi-help': (e) => {
    e.stopPropagation(); // Evitar que el clic active cosas debajo (ej. drilldown)
    const kpiKey = actionTarget.dataset.kpi;
    const info = KPI_EXPLANATIONS[kpiKey];
    
    if (info) {
        hapticFeedback('light');
        // Usamos el modal genérico para mostrar la ayuda
        showGenericModal(
            info.title, 
            `<p class="form-label" style="font-size:1rem; line-height:1.6; color:var(--c-on-surface); text-align: left;">
                ${info.text}
            </p>`
        );
    } else {
        console.warn(`No hay explicación definida para: ${kpiKey}`);
    }
},
            'edit-movement-from-modal': (e) => { const movementId = e.target.closest('[data-id]').dataset.id; hideModal('generic-modal'); startMovementForm(movementId, false); },
            'edit-movement-from-list': (e) => { const movementId = e.target.closest('[data-id]').dataset.id; startMovementForm(movementId, false); },
            'edit-recurrente': () => {
    hideModal('generic-modal');
    // Usamos actionTarget.dataset.id para obtener el ID correcto
    startMovementForm(actionTarget.dataset.id, true); 
},
            'view-account-details': (e) => { const accountId = e.target.closest('[data-id]').dataset.id; showAccountMovementsModal(accountId); },
            'show-concept-drilldown': () => {
                const conceptId = actionTarget.dataset.conceptId;
                const conceptName = actionTarget.dataset.conceptName;
                getFilteredMovements(false).then(({ current }) => {
                    const movementsOfConcept = current.filter(m => m.conceptoId === conceptId);
                    showDrillDownModal(`Movimientos de: ${conceptName}`, movementsOfConcept);
                });
            },
            'toggle-diario-view': () => { diarioViewMode = diarioViewMode === 'list' ? 'calendar' : 'list'; const btnIcon = selectOne('[data-action="toggle-diario-view"] .material-icons'); if(btnIcon) btnIcon.textContent = diarioViewMode === 'list' ? 'calendar_month' : 'list'; renderDiarioPage(); },
            'calendar-nav': () => {
                const direction = actionTarget.dataset.direction;
                if (!(diarioCalendarDate instanceof Date) || isNaN(diarioCalendarDate)) diarioCalendarDate = new Date();
                const currentMonth = diarioCalendarDate.getUTCMonth();
                diarioCalendarDate.setUTCMonth(currentMonth + (direction === 'next' ? 1 : -1));
                renderDiarioCalendar();
            },
            'show-day-details': () => {
                const date = actionTarget.dataset.date;
                const movementsOfDay = db.movimientos.filter(m => m.fecha.startsWith(date));
                if (movementsOfDay.length > 0) {
                    const formattedDate = new Date(date + 'T12:00:00Z').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
                    showDrillDownModal(`Movimientos del ${formattedDate}`, movementsOfDay);
                }
            },
            'toggle-investment-type-filter': () => handleToggleInvestmentTypeFilter(type),
            'toggle-account-type-filter': () => { hapticFeedback('light'); if (deselectedAccountTypesFilter.has(type)) { deselectedAccountTypesFilter.delete(type); } else { deselectedAccountTypesFilter.add(type); } renderPatrimonioOverviewWidget('patrimonio-overview-container'); },
            'switch-estrategia-tab': () => { const tabName = actionTarget.dataset.tab; showEstrategiaTab(tabName); },
            'show-help-topic': () => { /* Lógica de ayuda mantenida */
                const topic = actionTarget.dataset.topic;
                if(topic) {
                    let title, content;
                    // ... (contenido de los temas de ayuda sin cambios) ...
                    if (topic === 'tasa-ahorro') { title = '¿Cómo se calcula la Tasa de Ahorro?'; content = `<p>Mide qué porcentaje de tus ingresos consigues guardar...</p>`; }
                    // ... (resto de casos) ...
                    else if (topic === 'independencia-financiera') { title = 'Independencia Financiera (I.F.)'; content = `<p>Mide tu progreso...</p>`; }
                    
                    const titleEl = select('help-modal-title'); const bodyEl = select('help-modal-body');
                    if(titleEl) titleEl.textContent = title; if(bodyEl) bodyEl.innerHTML = `<div style="padding: 0 var(--sp-2);">${content}</div>`;
                    showModal('help-modal');
                }
            },
            'use-password-instead': () => showPasswordFallback(),
            'navigate': () => { hapticFeedback('light'); navigateTo(page); },
            'help': showHelpModal,
            'exit': handleExitApp,
            'forgot-password': (e) => { e.preventDefault(); const email = prompt("Email para recuperar contraseña:"); if (email) { firebase.auth().sendPasswordResetEmail(email).then(() => showToast('Correo enviado.', 'info')).catch(() => showToast('Error al enviar correo.', 'danger')); } },
            'show-register': (e) => { e.preventDefault(); const title = select('login-title'); const mainButton = document.querySelector('#login-form button[data-action="login"]'); const secondaryAction = document.querySelector('.login-view__secondary-action'); if (mainButton.dataset.action === 'login') { title.textContent = 'Crear una Cuenta Nueva'; mainButton.dataset.action = 'register'; mainButton.textContent = 'Registrarse'; secondaryAction.innerHTML = `<span>¿Ya tienes una cuenta?</span> <a href="#" class="login-view__link" data-action="show-login">Inicia sesión</a>`; } else { handleRegister(mainButton); } },
            'show-login': (e) => { e.preventDefault(); const title = select('login-title'); const mainButton = document.querySelector('#login-form button[data-action="register"]'); const secondaryAction = document.querySelector('.login-view__secondary-action'); if (mainButton.dataset.action === 'register') { mainButton.dataset.action = 'login'; mainButton.textContent = 'Iniciar Sesión'; secondaryAction.innerHTML = `<span>¿No tienes una cuenta?</span> <a href="#" class="login-view__link" data-action="show-register">Regístrate aquí</a>`; } },
            'import-csv': () => { const i = document.createElement('input'); i.type='file'; i.accept='.csv'; i.onchange=e=>handleImportCSV(e.target.files[0]); i.click(); },
            'toggle-ledger': async () => {
    hapticFeedback('medium');
    
    // 1. Rotación: A -> B -> C -> A
    if (currentLedger === 'A') currentLedger = 'B';
    else if (currentLedger === 'B') currentLedger = 'C';
    else currentLedger = 'A';
    
    // 2. Limpieza de Cachés
    runningBalancesCache = null;
    allDiarioMovementsCache = []; 
    
    // 3. Actualizar UI Visual
    document.body.dataset.ledgerMode = currentLedger;
    
    // ▼▼▼ AQUÍ ESTABA EL ERROR (CORREGIDO) ▼▼▼
    // Simplemente llamamos a la función auxiliar que ya creamos.
    // Ella se encarga de buscar el botón y cambiar el texto.
    updateLedgerButtonUI(); 
    // ▲▲▲ FIN DE LA CORRECCIÓN ▲▲▲
    
      // 4. Actualizar datos y vistas
    populateAllDropdowns();

    const activePageEl = document.querySelector('.view--active');
    if (activePageEl) {
        if (activePageEl.id === PAGE_IDS.PANEL) scheduleDashboardUpdate();
        else if (activePageEl.id === PAGE_IDS.DIARIO) {
            db.movimientos = [];
            lastVisibleMovementDoc = null;
            allMovementsLoaded = false;
            select('virtual-list-content').innerHTML = '';
            await loadMoreMovements(true);
        }
        else if (activePageEl.id === PAGE_IDS.PATRIMONIO) renderPatrimonioPage();
        else if (activePageEl.id === PAGE_IDS.PLANIFICAR) renderPlanificacionPage();
    }
},
            'toggle-off-balance': async () => { const checkbox = target.closest('input[type="checkbox"]'); if (!checkbox) return; hapticFeedback('light'); await saveDoc('cuentas', checkbox.dataset.id, { offBalance: checkbox.checked }); },
            'apply-filters': () => { hapticFeedback('light'); scheduleDashboardUpdate(); },
            'delete-movement-from-modal': () => { const isRecurrent = (actionTarget.dataset.isRecurrent === 'true'); const idToDelete = select('movimiento-id').value; const message = isRecurrent ? '¿Eliminar operación recurrente?' : '¿Eliminar movimiento?'; showConfirmationModal(message, async () => { hideModal('movimiento-modal'); await deleteMovementAndAdjustBalance(idToDelete, isRecurrent); }); },
			'duplicate-movement-from-modal': () => {
    const id = select('movimiento-id').value;
    // Buscamos el movimiento original en la base de datos local
    const movement = db.movimientos.find(m => m.id === id);
    
    if (movement) {
        // Usamos la función que ya tienes creada
        handleDuplicateMovement(movement);
    }
},
            'swipe-delete-movement': () => { const isRecurrent = actionTarget.dataset.isRecurrent === 'true'; showConfirmationModal('¿Eliminar este movimiento?', async () => { await deleteMovementAndAdjustBalance(id, isRecurrent); }); },
            'swipe-duplicate-movement': () => { const movement = db.movimientos.find(m => m.id === id) || recentMovementsCache.find(m => m.id === id); if (movement) handleDuplicateMovement(movement); },
            'search-result-movimiento': (e) => { hideModal('global-search-modal'); startMovementForm(e.target.closest('[data-id]').dataset.id, false); },
            'delete-concepto': async () => { const movsCheck = await fbDb.collection('users').doc(currentUser.uid).collection('movimientos').where('conceptoId', '==', id).limit(1).get(); if(!movsCheck.empty) { showToast("Concepto en uso.","warning"); return; } showConfirmationModal('¿Eliminar concepto?', async () => { await deleteDoc('conceptos', id); hapticFeedback('success'); showToast("Concepto eliminado."); renderConceptosModalList(); }); },
            'delete-cuenta': async () => { const movsCheck = await fbDb.collection('users').doc(currentUser.uid).collection('movimientos').where('cuentaId', '==', id).limit(1).get(); if(!movsCheck.empty) { showToast("Cuenta con movimientos.","warning"); return; } showConfirmationModal('¿Eliminar cuenta?', async () => { await deleteDoc('cuentas', id); hapticFeedback('success'); showToast("Cuenta eliminada."); renderCuentasModalList(); }); },
            'close-modal': () => { 
                const closestOverlay = target.closest('.modal-overlay'); 
                const effectiveModalId = modalId || (closestOverlay ? closestOverlay.id : null); 
                
                // ▼▼▼ SEGURIDAD ▼▼▼
                if (effectiveModalId === 'movimiento-modal') {
                    const cantidad = document.getElementById('movimiento-cantidad').value;
                    // Si hay cantidad (>0) o descripción y no estamos guardando
                    const desc = document.getElementById('movimiento-descripcion').value;
                    if ((cantidad && cantidad !== '0,00') || desc.length > 2) {
                        if (!confirm("¿Descartar los cambios?")) return;
                    }
                }
                // ▲▲▲ FIN SEGURIDAD ▲▲▲

                if (effectiveModalId) hideModal(effectiveModalId); 
            },
            'manage-conceptos': showManageConceptosModal,
			'manage-cuentas': showCuentasModal,
            'save-config': () => handleSaveConfig(btn),
            'export-data': () => handleExportData(btn), 'export-csv': () => handleExportCsv(btn), 'import-data': () => showImportJSONWizard(),
            'clear-data': () => { showConfirmationModal('¿Borrar TODOS tus datos?', async () => { /* Lógica */ }, 'Confirmar'); },
            'update-budgets': handleUpdateBudgets, 'logout': () => fbAuth.signOut(), 'delete-account': () => { showConfirmationModal('¿Eliminar cuenta permanentemente?', async () => { /* Lógica */ }); },
            'manage-investment-accounts': showManageInvestmentAccountsModal, 'update-asset-value': () => showValoracionModal(id),
            'global-search': () => { showGlobalSearchModal(); hapticFeedback('medium'); },
            'edit-concepto': () => showConceptoEditForm(id), 'cancel-edit-concepto': renderConceptosModalList, 'save-edited-concepto': () => handleSaveEditedConcept(id, btn),
            'edit-cuenta': () => showAccountEditForm(id), 'cancel-edit-cuenta': renderCuentasModalList, 'save-edited-cuenta': () => handleSaveEditedAccount(id, btn),
            'duplicate-movement': () => {
        const id = document.getElementById('movimiento-id').value;
        
        // 1. Buscamos primero en movimientos normales
        let movement = db.movimientos.find(m => m.id === id);
        let isRecurrent = false;

        // 2. Si no está, buscamos en recurrentes (programados)
        if (!movement && db.recurrentes) { 
            movement = db.recurrentes.find(m => m.id === id);
            isRecurrent = true;
        }

        if (movement) {
            handleDuplicateMovement(movement, isRecurrent);
        } 
    },

// Asegúrate también de que esta otra acción use la misma lógica:
'duplicate-movement-from-modal': () => {
    const id = select('movimiento-id').value;
    const movement = db.movimientos.find(m => m.id === id);
    if (movement) {
        handleDuplicateMovement(movement);
    }
},
            'save-and-new-movement': () => handleSaveMovement(document.getElementById('form-movimiento'), btn), 'set-movimiento-type': () => setMovimientoFormType(type),
            'recalculate-balances': () => { showConfirmationModal('Se recalcularán todos los saldos. ¿Continuar?', () => auditAndFixAllBalances(btn), 'Confirmar Auditoría'); },
            'json-wizard-back-2': () => goToJSONStep(1), 'json-wizard-import-final': () => handleFinalJsonImport(btn),
            'toggle-traspaso-accounts-filter': () => populateTraspasoDropdowns(),
			'set-pin': async () => {
    // 1. Creamos el HTML del Modal
    const html = `
        <div style="text-align: center;">
            <p class="form-label" style="margin-bottom: 20px;">
                Protege tu acceso. Introduce un código de 4 números.
            </p>
            <div class="form-group">
                <input type="tel" id="new-pin-input" class="form-input" 
                       pattern="[0-9]*" inputmode="numeric" maxlength="4" 
                       placeholder="• • • •" 
                       style="text-align: center; font-size: 2rem; letter-spacing: 10px; width: 80%; margin: 0 auto;">
            </div>
            <button id="save-pin-btn" class="btn btn--primary btn--full" style="margin-top: 20px;">
                Guardar PIN
            </button>
        </div>
    `;
    
    // 2. Mostramos el Modal
    showGenericModal('Configurar Seguridad', html);

    // 3. Damos vida al botón Guardar
    setTimeout(() => {
        const input = document.getElementById('new-pin-input');
        const btn = document.getElementById('save-pin-btn');
        if(input) input.focus();

        btn.addEventListener('click', async () => {
            const pin = input.value;
            if (pin.length === 4 && !isNaN(pin)) {
                try {
                    // Usamos tu función existente hashPin
                    const hash = await hashPin(pin);
                    localStorage.setItem('pinUserHash', hash);
                    // IMPORTANTE: Guardamos que el usuario tiene PIN
                    if(currentUser) localStorage.setItem('pinUserEmail', currentUser.email);
                    
                    hideModal('generic-modal');
                    showToast('¡PIN de seguridad activado!');
                } catch (e) {
                    console.error(e);
                    showToast('Error al guardar', 'error');
                }
            } else {
                showToast('El PIN deben ser 4 números', 'warning');
            }
        });
    }, 100);
},
            'edit-recurrente-from-pending': () => startMovementForm(id, true),
            'confirm-recurrent': () => handleConfirmRecurrent(id, btn), 'skip-recurrent': () => handleSkipRecurrent(id, btn),
            'save-informe': () => handleSaveInforme(btn),
        };
        
        if (actions[action]) actions[action](e);
    });

    // 6. Gestión de elementos <details> para informes
    document.body.addEventListener('toggle', (e) => {
        const detailsElement = e.target;
        if (detailsElement.tagName !== 'DETAILS' || !detailsElement.classList.contains('informe-acordeon')) return;
        if (detailsElement.open) {
            const informeId = detailsElement.id.replace('acordeon-', '');
            renderInformeDetallado(informeId);
        }
    }, true);
    
    // 7. Gestión de formularios (Submit)
    document.body.addEventListener('submit', (e) => {
        e.preventDefault();
        const target = e.target;
        const submitter = e.submitter;
        const handlers = {
			'rename-ledgers-form': () => handleSaveLedgerNames(submitter),
            'login-form': () => { const action = submitter ? submitter.dataset.action : 'login'; if (action === 'login') handleLogin(submitter); else handleRegister(submitter); },
            'pin-form': handlePinSubmit,
            'form-movimiento': () => handleSaveMovement(target, submitter),
            'add-concepto-form': () => handleAddConcept(submitter),
            'add-cuenta-form': () => handleAddAccount(submitter),
            'informe-cuenta-form': () => handleGenerateInformeCuenta(target, submitter),
            'manage-investment-accounts-form': () => handleSaveInvestmentAccounts(target, submitter),
            'form-valoracion': () => handleSaveValoracion(target, submitter),
            'diario-filters-form': applyDiarioFilters
        };
        if (handlers[target.id]) handlers[target.id]();
    });
    
    // 8. Eventos de inputs generales
    document.body.addEventListener('input', (e) => { 
        const id = e.target.id; 
        if (id) { 
            clearError(id); 
            if (id === 'movimiento-cantidad') validateField('movimiento-cantidad', true); 
            if (id === 'movimiento-concepto' || id === 'movimiento-cuenta') validateField(id, true); 
            // ... validaciones restantes
            if (id === 'concepto-search-input') { clearTimeout(globalSearchDebounceTimer); globalSearchDebounceTimer = setTimeout(() => renderConceptosModalList(), 200); } 
            if (id === 'cuenta-search-input') { clearTimeout(globalSearchDebounceTimer); globalSearchDebounceTimer = setTimeout(() => renderCuentasModalList(), 200); } 
        } 
    });
    
    document.body.addEventListener('blur', (e) => { 
        const id = e.target.id; 
        if (id && (id === 'movimiento-concepto' || id === 'movimiento-cuenta')) validateField(id); 
    }, true);
    
    document.body.addEventListener('focusin', (e) => { 
        if (e.target.matches('.pin-input')) handlePinInputInteraction(); 
        
    });
    
    // 9. Cambios en filtros y selects
    document.addEventListener('change', e => {
        const target = e.target;
        if (target.id === 'filter-periodo' || target.id === 'filter-fecha-inicio' || target.id === 'filter-fecha-fin') {
            const panelPage = select('panel-page');
            if (!panelPage || !panelPage.classList.contains('view--active')) return;
            if (target.id === 'filter-periodo') {
                const customDateFilters = select('custom-date-filters');
                if (customDateFilters) customDateFilters.classList.toggle('hidden', target.value !== 'custom');
                if (target.value !== 'custom') { hapticFeedback('light'); scheduleDashboardUpdate(); }
            }
            if (target.id === 'filter-fecha-inicio' || target.id === 'filter-fecha-fin') {
                const s = select('filter-fecha-inicio'), en = select('filter-fecha-fin');
                if (s && en && s.value && en.value) { hapticFeedback('light'); scheduleDashboardUpdate(); }
            }
        }
        // Lógica opciones recurrentes
        if (target.id === 'movimiento-recurrente') {
            select('recurrent-options').classList.toggle('hidden', !target.checked);
            if(target.checked && !select('recurrent-next-date').value) select('recurrent-next-date').value = select('movimiento-fecha').value;
        }
        if (target.id === 'recurrent-frequency') {
            const endGroup = select('recurrent-end-date').closest('.form-group');
            if (endGroup) endGroup.classList.toggle('hidden', target.value === 'once');
        }
    });
    
    // 10. Listeners específicos (Importación, Calculadora, Búsqueda)
    const importFileInput = select('import-file-input'); if (importFileInput) importFileInput.addEventListener('change', (e) => { if(e.target.files) handleJSONFileSelect(e.target.files[0]); });
    document.addEventListener('DOMContentLoaded', () => {
    
    // Referencias
    const fabContainer = document.getElementById('fab-container');
    const fabTrigger = document.getElementById('fab-trigger');
    const fabBackdrop = document.getElementById('fab-backdrop');
    const fabOptions = document.querySelectorAll('.fab-option');

    // 1. Función para alternar el menú
    function toggleFab() {
        fabContainer.classList.toggle('active');
        // Feedback háptico suave si es móvil
        if (navigator.vibrate) navigator.vibrate(10);
    }

    // 2. Función para cerrar el menú
    function closeFab() {
        fabContainer.classList.remove('active');
    }

    // 3. Event Listeners
    
    // Click en el botón principal (+)
    fabTrigger.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se propague
        toggleFab();
    });

    // Click en el fondo oscuro (cerrar sin elegir)
    fabBackdrop.addEventListener('click', closeFab);

    // Click en cada opción (Ingreso, Gasto, Traspaso)
    fabOptions.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Obtener el tipo de movimiento (ingreso, gasto, traspaso)
            const type = btn.dataset.type;
            
            // Cerrar el abanico
            closeFab();

            // --- AQUÍ LLAMAS A TU LÓGICA EXISTENTE ---
            // Basado en tu código, simularía abrir el modal configurando el tipo
            console.log("Abriendo modal para:", type);
            
            // Ejemplo de integración (Reemplaza 'openModalLogic' con tu función real):
            // setMovimientoType(type); // Si tienes una función que setea el tipo
            // openMovimientoModal();   // Función que abre el modal
            
            // Si usas lógica directa de renderizado:
            if (typeof renderMovimientoModal === 'function') {
                renderMovimientoModal(type); 
            } else {
                // Fallback: Busca los botones ocultos del modal original y haz click en ellos
                // Esto es un "truco" si no quieres reescribir tu lógica de modales
                const hiddenTypeBtn = document.querySelector(`[data-type="${type}"]`);
                if(hiddenTypeBtn) hiddenTypeBtn.click();
            }
        });
    });
});
	
    // CALCULADORA: Clics en botones
    const calculatorGrid = select('calculator-grid'); 
    if (calculatorGrid) calculatorGrid.addEventListener('click', (e) => { 
        const btn = e.target.closest('button'); 
        if(btn && btn.dataset.key) handleCalculatorInput(btn.dataset.key); 
    });
    
    const searchInput = select('global-search-input'); if (searchInput) searchInput.addEventListener('input', () => { clearTimeout(globalSearchDebounceTimer); globalSearchDebounceTimer = setTimeout(() => performGlobalSearch(searchInput.value), 250); });
    document.body.addEventListener('keydown', (e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); e.stopPropagation(); showGlobalSearchModal(); } });
    
    // Dropzone JSON y Scroll
    const dropZone = select('json-drop-zone'); if (dropZone) { /* Lógica Dropzone (sin cambios) */ }
        
    // Scroll infinito
    const mainScroller = selectOne('.app-layout__main'); 
    if (mainScroller) { 
        let scrollRAF = null; 
        mainScroller.addEventListener('scroll', () => { 
            if (scrollRAF) window.cancelAnimationFrame(scrollRAF); 
            scrollRAF = window.requestAnimationFrame(() => { 
                if (diarioViewMode === 'list' && select('diario-page')?.classList.contains('view--active')) renderVisibleItems(); 
            }); 
        }, { passive: true }); 
    }

    // Selectores de frecuencia recurrentes
    const frequencySelect = select('recurrent-frequency');
    if (frequencySelect) {
        frequencySelect.addEventListener('change', (e) => {
            const isWeekly = e.target.value === 'weekly';
            const weeklySelector = select('weekly-day-selector');
            const endGroup = select('recurrent-end-date')?.closest('.form-group');
            if (weeklySelector) weeklySelector.classList.toggle('hidden', !isWeekly);
            if (endGroup) endGroup.classList.toggle('hidden', e.target.value === 'once');
        });
    }

    // Selector de Fecha Nativo
    const fechaDisplayButton = select('movimiento-fecha-display'); 
    const fechaRealInput = select('movimiento-fecha'); 
    if (fechaDisplayButton && fechaRealInput) { 
        fechaDisplayButton.addEventListener('click', () => {
            try { fechaRealInput.showPicker(); } catch (error) { fechaRealInput.click(); }
        });
        fechaRealInput.addEventListener('input', () => {
            updateDateDisplay(fechaRealInput);
            const isRecurrent = select('movimiento-recurrente')?.checked;
            if (isRecurrent) {
                const nextDateEl = select('recurrent-next-date');
                if (nextDateEl) nextDateEl.value = fechaRealInput.value;
            }
        }); 
    }
    
    initSpeedDial();
};
// ▲▲▲ FIN FUNCIÓN attachEventListeners ▲▲▲

// Lógica separada para el selector de días semanales (para que no se duplique)
const daySelector = select('weekly-day-selector-buttons');
if (daySelector) {
    daySelector.addEventListener('click', (e) => {
        // Permite que cualquier parte del botón active la selección (incluido texto)
        const btn = e.target.closest('.day-selector-btn');
        if (btn) {
            e.preventDefault(); // Prevenir envío de formulario si es type="button"
            btn.classList.toggle('active');
            hapticFeedback('light');
        }
    });
}

// =================================================================
// === FIN: BLOQUE DE CÓDIGO CORREGIDO PARA REEMPLAZAR           ===
// =================================================================
           
        const showImportJSONWizard = () => {
            jsonWizardState = { file: null, data: null, preview: { counts: {}, meta: {} } };
            goToJSONStep(1);
            const errorEl = select('json-file-error');
            const textEl = select('json-drop-zone-text');
            if(errorEl) errorEl.textContent = '';
            if(textEl) textEl.textContent = 'Arrastra tu archivo aquí o haz clic';
            showModal('json-import-wizard-modal');
        };

        const goToJSONStep = (stepNumber) => {
            selectAll('.json-wizard-step').forEach(step => step.style.display = 'none');
            const targetStep = select(`json-wizard-step-${stepNumber}`);
            if (targetStep) targetStep.style.display = 'flex';
        };

        const handleJSONFileSelect = (file) => {
            const errorEl = select('json-file-error');
            if(!errorEl) return;
            errorEl.textContent = '';

            if (!file.type.includes('json')) {
                errorEl.textContent = 'Error: El archivo debe ser de tipo .json.';
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    let data = JSON.parse(event.target.result);
                    let dataToAnalyze = data;

                    if (data.meta && data.data) {
                        jsonWizardState.preview.meta = data.meta;
                        dataToAnalyze = data.data;
                    } else {
                        jsonWizardState.preview.meta = { appName: 'Cuentas (Formato Antiguo)', exportDate: 'N/A' };
                    }

                    if (!dataToAnalyze.cuentas || !dataToAnalyze.conceptos || !dataToAnalyze.movimientos) {
                        throw new Error("El archivo no tiene la estructura de una copia de seguridad válida.");
                    }

                    jsonWizardState.data = dataToAnalyze;
                    
                    const counts = {};
                    for (const key in dataToAnalyze) {
                        if (Array.isArray(dataToAnalyze[key])) {
                            counts[key] = dataToAnalyze[key].length;
                        }
                    }
                    jsonWizardState.preview.counts = counts;
                    
                    renderJSONPreview();
                    goToJSONStep(2);

                } catch (error) {
                    console.error("Error al procesar el archivo JSON:", error);
                    errorEl.textContent = `Error: ${error.message}`;
                }
            };
            reader.readAsText(file);
        };

        const renderJSONPreview = () => {
            const previewList = select('json-preview-list');
            if(!previewList) return;
            const { counts } = jsonWizardState.preview;
            
            const friendlyNames = {
                cuentas: 'Cuentas', conceptos: 'Conceptos', movimientos: 'Movimientos',
                presupuestos: 'Presupuestos', recurrentes: 'Recurrentes',
                inversiones_historial: 'Historial de Inversión', inversion_cashflows: 'Flujos de Capital'
            };
            
            let html = '';
            for(const key in counts) {
                if(counts[key] > 0) {
                    html += `<li><span class="material-icons">check_circle</span> <strong>${counts[key]}</strong> ${friendlyNames[key] || key}</li>`;
                }
            }
            
            previewList.innerHTML = html || `<li><span class="material-icons">info</span>El archivo parece estar vacío.</li>`;
        };

        const handleFinalJsonImport = async (btn) => {
            goToJSONStep(3);
            setButtonLoading(btn, true, 'Importando...');
            select('json-import-progress').style.display = 'block';
            select('json-import-result').style.display = 'none';

            try {
                const dataToImport = jsonWizardState.data;
                const collectionsToClear = ['cuentas', 'conceptos', 'movimientos', 'presupuestos', 'recurrentes', 'inversiones_historial', 'inversion_cashflows'];

                for (const collectionName of collectionsToClear) {
                    const snapshot = await fbDb.collection('users').doc(currentUser.uid).collection(collectionName).get();
                    if (snapshot.empty) continue;
                    let batch = fbDb.batch();
                    let count = 0;
                    for (const doc of snapshot.docs) {
                        batch.delete(doc.ref);
                        count++;
                        if (count >= 450) { await batch.commit(); batch = fbDb.batch(); count = 0; }
                    }
                    if(count > 0) await batch.commit();
                }
                
                for (const collectionName of Object.keys(dataToImport)) {
                    const items = dataToImport[collectionName];
                    if (Array.isArray(items) && items.length > 0) {
                        let batch = fbDb.batch();
                        let count = 0;
                        for (const item of items) {
                            if (item.id) {
                                const docRef = fbDb.collection('users').doc(currentUser.uid).collection(collectionName).doc(item.id);
                                batch.set(docRef, item);
                                count++;
                                if (count >= 450) { await batch.commit(); batch = fbDb.batch(); count = 0; }
                            }
                        }
                        if(count > 0) await batch.commit();
                    } else if (collectionName === 'config') {
                        await fbDb.collection('users').doc(currentUser.uid).set({ config: items }, { merge: true });
                    }
                }
                
                select('json-import-progress').style.display = 'none';
                select('json-import-result').style.display = 'block';
                select('json-result-message').textContent = `Se han importado los datos correctamente. La aplicación se recargará.`;
                hapticFeedback('success');
                
                setTimeout(() => location.reload(), 4000);

            } catch (error) {
                console.error("Error durante la importación final:", error);
                showToast("Error crítico durante la importación.", "danger", 5000);
                select('json-result-title').textContent = '¡Error en la Importación!';
                select('json-result-message').textContent = `Ocurrió un error. Por favor, revisa la consola e inténtalo de nuevo.`;
                select('json-import-result .material-icons').style.color = 'var(--c-danger)';
                setButtonLoading(btn, false);
            }
        };
    

const handleConfirmRecurrent = async (id, btn) => {
    if (btn) setButtonLoading(btn, true);

    const recurrenteIndex = db.recurrentes.findIndex(r => r.id === id);
    if (recurrenteIndex === -1) {
        showToast("Error: no se encontró la operación programada.", "danger");
        if (btn) setButtonLoading(btn, false);
        return;
    }
    const recurrente = db.recurrentes[recurrenteIndex];

    // ▼▼▼ CORRECCIÓN CLAVE AQUÍ ▼▼▼
    // Guardamos la fecha original ("Hoy") en una variable separada ANTES de que nada cambie.
    const originalScheduledDate = recurrente.nextDate; 
    // ▲▲▲ FIN CORRECCIÓN ▲▲▲

    try {
        // 1. Efecto visual inmediato (UI Optimista)
        const itemEl = document.getElementById(`pending-recurrente-${id}`);
        if (itemEl) itemEl.classList.add('item-deleting');

        // 2. Cálculo de la nueva fecha (para el futuro)
        // Usamos originalScheduledDate como base para el cálculo
        let newNextDate = calculateNextDueDate(originalScheduledDate, recurrente.frequency, recurrente.weekDays);

        // 3. Preparar el Batch de Firebase (Escritura Atómica)
        const batch = fbDb.batch();
        const userRef = fbDb.collection('users').doc(currentUser.uid);

        // A. ¿Se ha terminado la serie o continúa?
        if (recurrente.frequency === 'once' || (recurrente.endDate && newNextDate > parseDateStringAsUTC(recurrente.endDate))) {
            batch.delete(userRef.collection('recurrentes').doc(id));
            db.recurrentes.splice(recurrenteIndex, 1); 
        } else {
            // Si sigue, actualizamos la próxima fecha en la DB y en local
            const newDateString = newNextDate.toISOString().slice(0, 10);
            batch.update(userRef.collection('recurrentes').doc(id), { nextDate: newDateString });
            db.recurrentes[recurrenteIndex].nextDate = newDateString;
        }
        
        // B. Crear el movimiento real en el historial
        const newMovementId = generateId();
        
        // ▼▼▼ USO DE LA FECHA CORRECTA ▼▼▼
        // Usamos 'originalScheduledDate' (la que tenía la tarjeta al pulsar), forzando mediodía UTC.
        const transactionDateISO = new Date(originalScheduledDate + 'T12:00:00Z').toISOString();

        const newMovementData = {
            id: newMovementId,
            cantidad: recurrente.cantidad,
            descripcion: recurrente.descripcion,
            fecha: transactionDateISO,
            tipo: recurrente.tipo,
            cuentaId: recurrente.cuentaId || null,
            conceptoId: recurrente.conceptoId || null,
            cuentaOrigenId: recurrente.cuentaOrigenId || null,
            cuentaDestinoId: recurrente.cuentaDestinoId || null
        };
        batch.set(userRef.collection('movimientos').doc(newMovementId), newMovementData);

        // C. Actualizar saldos de las cuentas afectadas
        if (recurrente.tipo === 'traspaso') {
            batch.update(userRef.collection('cuentas').doc(recurrente.cuentaOrigenId), { saldo: firebase.firestore.FieldValue.increment(-Math.abs(recurrente.cantidad)) });
            batch.update(userRef.collection('cuentas').doc(recurrente.cuentaDestinoId), { saldo: firebase.firestore.FieldValue.increment(Math.abs(recurrente.cantidad)) });
        } else {
            batch.update(userRef.collection('cuentas').doc(recurrente.cuentaId), { saldo: firebase.firestore.FieldValue.increment(recurrente.cantidad) });
        }

        // 4. ¡FUEGO! (Commit a Firebase)
        await batch.commit();
        
        hapticFeedback('success');
        showToast("Movimiento añadido correctamente.", "info");

    } catch (error) {
        console.error("Error al confirmar recurrente:", error);
        showToast("Error de conexión al procesar.", "danger");
        if (btn) setButtonLoading(btn, false);
        const itemEl = document.getElementById(`pending-recurrente-${id}`);
        if (itemEl) itemEl.classList.remove('item-deleting');
        return; 
    } finally {
        if (btn) setButtonLoading(btn, false);
        
        setTimeout(() => {
            const activePage = document.querySelector('.view--active');
            if (activePage && activePage.id === PAGE_IDS.PLANIFICAR) {
                renderPlanificacionPage();
            }
        }, 450);
    }
};
const handleSkipRecurrent = async (id, btn) => {
    if (btn) setButtonLoading(btn, true);

    const recurrenteIndex = db.recurrentes.findIndex(r => r.id === id);
    if (recurrenteIndex === -1) {
        showToast("Error: recurrente no encontrado.", "danger");
        if (btn) setButtonLoading(btn, false);
        return;
    }
    const recurrente = db.recurrentes[recurrenteIndex];
    
    try {
        // --- ACTUALIZACIÓN OPTIMISTA ---
        // 1. Inicia la animación de borrado en el elemento
        const itemEl = document.getElementById(`pending-recurrente-${id}`);
        if (itemEl) itemEl.classList.add('item-deleting');
        
        let successMessage = "";

        // 2. Preparamos el cambio para la base de datos en segundo plano
        if (recurrente.frequency === 'once') {
            await deleteDoc('recurrentes', id);
            db.recurrentes.splice(recurrenteIndex, 1); // Lo borramos de la memoria local
            successMessage = "Operación programada eliminada.";
        } else {
            const nextDate = calculateNextDueDate(recurrente.nextDate, recurrente.frequency, recurrente.weekDays);
            if (recurrente.endDate && nextDate > parseDateStringAsUTC(recurrente.endDate)) {
                await deleteDoc('recurrentes', id);
                db.recurrentes.splice(recurrenteIndex, 1); // Lo borramos de la memoria local
                successMessage = "Operación recurrente finalizada y eliminada.";
            } else {
                const newNextDateStr = nextDate.toISOString().slice(0, 10);
                await saveDoc('recurrentes', id, { nextDate: newNextDateStr });
                db.recurrentes[recurrenteIndex].nextDate = newNextDateStr; // Actualizamos la memoria local
                successMessage = "Operación omitida. Próxima ejecución reprogramada.";
            }
        }
        
        hapticFeedback('success');
        showToast(successMessage, "info");

    } catch (error) {
        console.error("Error al omitir recurrente:", error);
        showToast("No se pudo omitir la operación.", "danger");
        // Lógica de reversión si fuese necesario
    } finally {
        if (btn) setButtonLoading(btn, false);
        // Refrescamos la UI después de que la animación termine
        setTimeout(() => {
            const activePage = document.querySelector('.view--active');
             if (activePage && (activePage.id === PAGE_IDS.DIARIO || activePage.id === PAGE_IDS.PLANIFICAR)) { // Corregido: Estrategia -> Planificar
                if (activePage.id === PAGE_IDS.DIARIO) renderDiarioPage();
                if (activePage.id === PAGE_IDS.PLANIFICAR) renderPlanificacionPage();
            }
        }, 400);
    }
};

const generateCalendarGrid = (date, dataMap) => {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    
    const firstDayOffset = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
    
    // --- INICIO DE LA CORRECCIÓN ---
    // Obtenemos el número de días del mes de forma segura en UTC.
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    // --- FIN DE LA CORRECCIÓN ---

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const monthName = date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric', timeZone: 'UTC' });
    
    let gridHtml = `<div class="calendar-header">
        <button class="icon-btn" data-action="calendar-nav" data-direction="prev"><span class="material-icons">chevron_left</span></button>
        <h3 class="calendar-header__title">${monthName}</h3>
        <button class="icon-btn" data-action="calendar-nav" data-direction="next"><span class="material-icons">chevron_right</span></button>
    </div>`;

    gridHtml += '<div class="calendar-grid">';
    const weekdays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    weekdays.forEach(day => gridHtml += `<div class="calendar-weekday">${day}</div>`);

    let dayOfMonth = 1;
    for (let i = 0; i < 42; i++) {
        // La condición del bucle se mantiene, ya que con el `daysInMonth` corregido, debería funcionar.
        if (i < firstDayOffset || dayOfMonth > daysInMonth) {
            gridHtml += `<div class="calendar-day empty"></div>`;
        } else {
            const currentDate = new Date(Date.UTC(year, month, dayOfMonth));
            const dateKey = currentDate.toISOString().slice(0, 10);
            const dayData = dataMap.get(dateKey);
            
            let classes = 'calendar-day';
            if (currentDate.getTime() === today.getTime()) {
                classes += ' is-today';
            }

            gridHtml += `<div class="${classes}" data-action="show-day-details" data-date="${dateKey}">
                <span class="calendar-day__number">${dayOfMonth}</span>`;

            if (dayData) {
                if (dayData.total !== undefined) {
                    const totalClass = dayData.total >= 0 ? 'text-positive' : 'text-negative';
                    if (Math.abs(dayData.total) > 0) {
                        gridHtml += `<span class="calendar-day__total ${totalClass}">${formatCurrency(dayData.total)}</span>`;
                    }
                }
                if (dayData.markers) {
                    gridHtml += `<div class="calendar-day__markers">`;
                    if(dayData.markers.has('income')) gridHtml += `<div class="calendar-day__marker marker--income"></div>`;
                    if(dayData.markers.has('expense')) gridHtml += `<div class="calendar-day__marker marker--expense"></div>`;
                    gridHtml += `</div>`;
                }
            }
            
            gridHtml += `</div>`;
            dayOfMonth++;
        }
    }
    gridHtml += '</div>';
    return gridHtml;
};
// Reemplaza esta función completa:
const renderDiarioCalendar = async () => {
    const container = select('diario-view-container');
    if (!container) return;
    
    container.innerHTML = `<div class="calendar-container skeleton" style="height: 400px;"></div>`;

    try {
        // Aseguramos que diarioCalendarDate siempre sea un objeto Date válido
        if (!(diarioCalendarDate instanceof Date) || isNaN(diarioCalendarDate)) {
            diarioCalendarDate = new Date();
        }
        // Forzamos la fecha a mediodía para evitar problemas de zona horaria en los cálculos
        diarioCalendarDate.setHours(12, 0, 0, 0);

        const year = diarioCalendarDate.getFullYear();
        const month = diarioCalendarDate.getMonth();
        
        const startDate = new Date(Date.UTC(year, month, 1));
        const endDate = new Date(Date.UTC(year, month + 1, 1)); // El primer instante del siguiente mes
        
        const snapshot = await fbDb.collection('users').doc(currentUser.uid).collection('movimientos')
            .where('fecha', '>=', startDate.toISOString())
            .where('fecha', '<', endDate.toISOString())
            .get();

        const movementsOfMonth = snapshot.docs.map(doc => doc.data());
        
        const dataMap = new Map();
        movementsOfMonth.forEach(m => {
            const dateKey = m.fecha.slice(0, 10);
            if (!dataMap.has(dateKey)) dataMap.set(dateKey, { total: 0, markers: new Set() });
            
            let amount = 0;
            const visibleAccountIds = new Set(getVisibleAccounts().map(c => c.id));

            if (m.tipo === 'traspaso') {
                if (visibleAccountIds.has(m.cuentaOrigenId) && !visibleAccountIds.has(m.cuentaDestinoId)) amount = -m.cantidad;
                else if (!visibleAccountIds.has(m.cuentaOrigenId) && visibleAccountIds.has(m.cuentaDestinoId)) amount = m.cantidad;
            } else {
                if (visibleAccountIds.has(m.cuentaId)) amount = m.cantidad;
            }

            if (amount !== 0) {
                 dataMap.get(dateKey).total += amount;
                 if (amount > 0) dataMap.get(dateKey).markers.add('income');
                 if (amount < 0) dataMap.get(dateKey).markers.add('expense');
            }
        });
        
        container.innerHTML = `<div class="calendar-container" data-context="diario">${generateCalendarGrid(diarioCalendarDate, dataMap)}</div>`;
    } catch(error) {
        console.error("Error fetching calendar data:", error);
        container.innerHTML = `<div class="empty-state"><p class="text-danger">No se pudieron cargar los datos del calendario.</p></div>`;
    }
};


const applyOptimisticBalanceUpdate = (newData, oldData = null) => {
    // --- ⭐ INICIO DE LA CORRECCIÓN: SEGURIDAD ANTE NULOS ⭐ ---
    
    // Revertir el impacto del movimiento antiguo si estamos editando
    if (oldData) {
        if (oldData.tipo === 'traspaso') {
            const origen = db.cuentas.find(c => c.id === oldData.cuentaOrigenId);
            if (origen) origen.saldo += oldData.cantidad; // Solo opera si la cuenta 'origen' existe
            const destino = db.cuentas.find(c => c.id === oldData.cuentaDestinoId);
            if (destino) destino.saldo -= oldData.cantidad; // Solo opera si la cuenta 'destino' existe
        } else {
            const cuenta = db.cuentas.find(c => c.id === oldData.cuentaId);
            if (cuenta) cuenta.saldo -= oldData.cantidad; // Solo opera si la cuenta existe
        }
    }

    // Aplicar el impacto del nuevo movimiento
    if (newData) {
        if (newData.tipo === 'traspaso') {
            const origen = db.cuentas.find(c => c.id === newData.cuentaOrigenId);
            if (origen) origen.saldo -= newData.cantidad; // Solo opera si la cuenta 'origen' existe
            const destino = db.cuentas.find(c => c.id === newData.cuentaDestinoId);
            if (destino) destino.saldo += newData.cantidad; // Solo opera si la cuenta 'destino' existe
        } else {
            const cuenta = db.cuentas.find(c => c.id === newData.cuentaId);
            if (cuenta) cuenta.saldo += newData.cantidad; // Solo opera si la cuenta existe
        }
    }
};

const handleSaveMovement = async (event) => {
    // Si viene de un evento (click), evitamos que recargue la página
    if (event && event.preventDefault) event.preventDefault();

    console.log("🟢 Iniciando proceso de guardado...");

    // 1. Localización segura de elementos
    const form = document.getElementById('movimiento-form');
    const saveBtn = document.getElementById('save-movimiento-btn');
    const saveNewBtn = document.getElementById('save-and-new-movimiento-btn');
    
    // Detectar botón activo con seguridad
    const isSaveAndNew = event && event.target && event.target.id === 'save-and-new-movimiento-btn';
    const btnActivo = isSaveAndNew ? saveNewBtn : saveBtn;

    // 🔍 SEGURIDAD: Si el formulario no existe, usamos un ID falso para evitar el crash
    const formId = form ? form.id : 'temp-form-id'; 

    // 2. Validaciones Visuales (Solo si las funciones existen)
    // Usamos el 'formId' seguro que acabamos de crear
    if (typeof clearAllErrors === 'function') clearAllErrors(formId);
    
    // Si validateMovementForm requiere el form y no existe, saltamos la validación estricta del form
    // pero validamos los campos manualmente abajo.
    if (form && typeof validateMovementForm === 'function' && !validateMovementForm()) {
        showToast('Faltan datos obligatorios', 'warning');
        return;
    }

    // Efecto de carga visual
    if (btnActivo) {
        // Guardamos texto original por si acaso
        if (!btnActivo.dataset.originalText) btnActivo.dataset.originalText = btnActivo.innerHTML;
        btnActivo.innerHTML = '<span class="material-icons spin">sync</span> Guardando...';
        btnActivo.disabled = true;
    }

    try {
        // 3. Recolección de Datos (Helpers internos a prueba de fallos)
        const getVal = (id) => {
            const el = document.getElementById(id);
            // Si el elemento no existe, devolvemos cadena vacía para no romper nada
            return el ? el.value : '';
        };

        // ID del movimiento
        const id = getVal('movimiento-id') || (typeof generateId === 'function' ? generateId() : Date.now().toString());
        const mode = getVal('movimiento-mode'); // 'new', 'edit-single', 'edit-recurrent'
        
        // Tipo de movimiento (Gasto/Ingreso/Traspaso)
        const typePill = document.querySelector('[data-action="set-movimiento-type"].filter-pill--active');
        const tipoMovimiento = typePill ? typePill.dataset.type : 'gasto';

        // Cantidad: Limpieza agresiva para evitar NaN
        let rawCantidad = getVal('movimiento-cantidad');
        let cantidadValor = 0;
        if (typeof parseCurrencyString === 'function') {
            cantidadValor = parseCurrencyString(rawCantidad);
        } else {
            // Fallback manual: quitar todo lo que no sea número, punto o coma
            cantidadValor = parseFloat(rawCantidad.replace(/[^0-9,.-]/g, '').replace(',', '.')) || 0;
        }
        
        // Validación crítica manual: Si la cantidad es 0, paramos aquí
        if (cantidadValor === 0) {
            throw new Error("La cantidad no puede ser 0.");
        }

        const cantidadEnCentimos = Math.round(cantidadValor * 100);

        // ¿Es recurrente?
        const recurrenteCheck = document.getElementById('movimiento-recurrente');
        const isRecurrent = recurrenteCheck ? recurrenteCheck.checked : false;

        // --- OBJETO BASE ---
        const baseData = {
            descripcion: getVal('movimiento-descripcion').trim() || 'Sin descripción',
            cantidad: tipoMovimiento === 'gasto' ? -Math.abs(cantidadEnCentimos) : Math.abs(cantidadEnCentimos),
            tipo: tipoMovimiento,
            conceptoId: getVal('movimiento-concepto'),
            updatedAt: new Date().toISOString()
        };

        if (tipoMovimiento === 'traspaso') {
            baseData.tipo = 'traspaso'; 
            baseData.cantidad = Math.abs(cantidadEnCentimos); 
            baseData.cuentaOrigenId = getVal('movimiento-cuenta-origen');
            baseData.cuentaDestinoId = getVal('movimiento-cuenta-destino');
            
            if (!baseData.cuentaOrigenId || !baseData.cuentaDestinoId) throw new Error("Selecciona ambas cuentas para el traspaso.");
            if (baseData.cuentaOrigenId === baseData.cuentaDestinoId) throw new Error("Las cuentas de origen y destino deben ser distintas.");
        } else {
            baseData.cuentaId = getVal('movimiento-cuenta');
            if (!baseData.cuentaId) throw new Error("Debes seleccionar una cuenta.");
        }

        // =========================================================
        // 🔹 CAMINO A: GUARDAR COMO RECURRENTE (REGLA)
        // =========================================================
        if (isRecurrent) {
            console.log("🔄 Guardando como Recurrente...");
            const frequency = getVal('recurrent-frequency') || 'monthly';
            let rawNextDate = getVal('recurrent-next-date');
            
            // Si no hay fecha próxima, usamos la del movimiento o HOY
            if (!rawNextDate) rawNextDate = getVal('movimiento-fecha') || new Date().toISOString().split('T')[0];

            // Días de la semana (solo si es semanal)
            const weekDays = [];
            if (frequency === 'weekly') {
                document.querySelectorAll('.day-selector-btn.active').forEach(b => weekDays.push(parseInt(b.dataset.day)));
            }

            const recurrentData = {
                id: id,
                ...baseData,
                frequency,
                nextDate: rawNextDate,
                endDate: getVal('recurrent-end-date') || null,
                weekDays,
                active: true
            };

            // Guardar en Firestore: colección 'recurrentes'
            await fbDb.collection('users').doc(currentUser.uid).collection('recurrentes').doc(id).set(recurrentData);

            // LIMPIEZA CRUZADA: Si venía de ser movimiento normal, borrarlo del historial
            if (mode === 'edit-single') {
                await fbDb.collection('users').doc(currentUser.uid).collection('movimientos').doc(id).delete();
                // Opcional: Revertir saldo aquí si fuera necesario
            }

            hapticFeedback('success');
            showToast('Programación recurrente guardada.');
            hideModal('movimiento-modal'); 
            return; // FIN EXITO RECURRENTE
        }

        // =========================================================
        // 🔹 CAMINO B: GUARDAR COMO MOVIMIENTO NORMAL
        // =========================================================
        console.log("💾 Guardando movimiento normal...");
        
        const fechaInput = getVal('movimiento-fecha');
        const now = new Date();
        // Si la fecha es hoy, ponemos la hora actual. Si no, mediodía para evitar cambios de zona horaria.
        const fechaFinal = fechaInput ? 
            (fechaInput === now.toISOString().split('T')[0] ? now.toISOString() : `${fechaInput}T12:00:00.000Z`) 
            : now.toISOString();

        const dataToSave = {
            id: id,
            ...baseData,
            fecha: fechaFinal
        };

        const batch = fbDb.batch();
        const userRef = fbDb.collection('users').doc(currentUser.uid);

        // 1. Limpieza cruzada: Si venía de ser recurrente, borrar la regla
        if (mode === 'edit-recurrent') {
            batch.delete(userRef.collection('recurrentes').doc(id));
        }

        // 2. Guardar el movimiento en historial
        batch.set(userRef.collection('movimientos').doc(id), dataToSave);

        // 3. Actualizar saldo de cuentas
        if (tipoMovimiento === 'traspaso') {
            batch.update(userRef.collection('cuentas').doc(baseData.cuentaOrigenId), { saldo: firebase.firestore.FieldValue.increment(-baseData.cantidad) });
            batch.update(userRef.collection('cuentas').doc(baseData.cuentaDestinoId), { saldo: firebase.firestore.FieldValue.increment(baseData.cantidad) });
        } else {
            batch.update(userRef.collection('cuentas').doc(baseData.cuentaId), { saldo: firebase.firestore.FieldValue.increment(baseData.cantidad) });
        }

        await batch.commit();

        // Actualizar UI local (AppStore)
        if (typeof AppStore !== 'undefined' && AppStore.movimientos) {
            const existingIndex = AppStore.movimientos.findIndex(m => m.id === id);
            if (existingIndex >= 0) AppStore.movimientos[existingIndex] = dataToSave;
            else AppStore.movimientos.push(dataToSave);
        }

        hapticFeedback('success');
        
        if (isSaveAndNew) {
            if (typeof startMovementForm === 'function') startMovementForm();
        } else {
            hideModal('movimiento-modal');
            if (typeof navigateToAndHighlight === 'function') navigateToAndHighlight(id);
        }
        
        // Refrescar totales y lista
        if (typeof updateLocalDataAndRefreshUI === 'function') setTimeout(updateLocalDataAndRefreshUI, 100);

    } catch (error) {
        console.error("❌ Error controlado al guardar:", error);
        hapticFeedback('error');
        showToast(error.message || "Error al guardar", "danger");
    } finally {
        // Restaurar botón
        if (btnActivo) {
            btnActivo.innerHTML = btnActivo.dataset.originalText || (isSaveAndNew ? 'Guardar y Nuevo' : 'Guardar');
            btnActivo.disabled = false;
        }
    }
};

const handleAddConcept = async (btn) => { 
    const nombreInput = select('new-concepto-nombre');
    const nombre = toSentenceCase(nombreInput.value.trim());
    if (!nombre) { showToast('El nombre es obligatorio.', 'warning'); return; }
    
    // --- LÍNEA AÑADIDA PARA VERIFICAR ---
    if (db.conceptos.some(c => c.nombre.toLowerCase() === nombre.toLowerCase())) {
        showToast(`El concepto "${nombre}" ya existe.`, 'danger');
        return;
    }

    const newId = generateId();
    await saveDoc('conceptos', newId, { id: newId, nombre, icon: 'label' }, btn);
    hapticFeedback('success'); 
    showToast('Concepto añadido.');
    (select('add-concepto-form')).reset(); 
};
const handleAddAccount = async (btn) => {
    const nombreInput = select('new-cuenta-nombre');
    const tipoInput = select('new-cuenta-tipo');
    
    // Obtener la caja seleccionada del formulario
    const ledgerInput = document.querySelector('input[name="new-cuenta-ledger"]:checked');
    const ledger = ledgerInput ? ledgerInput.value : 'A'; // Por defecto A si falla algo

    const nombre = nombreInput.value.trim();
    const tipo = toSentenceCase(tipoInput.value.trim());

    if (!nombre || !tipo) {
        showToast('El nombre y el tipo son obligatorios.', 'warning');
        return;
    }

    if (db.cuentas.some(c => c.nombre.toLowerCase() === nombre.toLowerCase())) {
        showToast(`La cuenta "${nombre}" ya existe.`, 'danger');
        return;
    }

    const newId = generateId();
    const newAccountData = {
        id: newId,
        nombre: nombre,
        tipo: tipo,
        saldo: 0,
        esInversion: false,
        ledger: ledger, // Guardamos explícitamente la caja seleccionada
        offBalance: ledger === 'B', // Compatibilidad legacy
        fechaCreacion: new Date().toISOString()
    };

    await saveDoc('cuentas', newId, newAccountData, btn);
    
    hapticFeedback('success');
    showToast(`Cuenta creada en Caja ${ledger}.`);
    
    // Limpiar formulario y recargar lista
    nombreInput.value = '';
	select('new-cuenta-inversion').checked = false;
    tipoInput.value = '';
    nombreInput.focus();
    renderCuentasModalList();
};

 const handleSaveConfig = async (btn) => { 
     setButtonLoading(btn, true);
     // Solo guardamos lo que existe, sin referencias a widgets antiguos
     const newConfig = { ...db.config }; 
     await fbDb.collection('users').doc(currentUser.uid).set({ config: newConfig }, { merge: true });
     localStorage.setItem('skipIntro', String(newConfig.skipIntro));
     setButtonLoading(btn, false);
     hapticFeedback('success'); 
     };
 

          const handleExportData = async (btn) => {
     if (!currentUser) { showToast("No hay usuario autenticado.", "danger"); return; }
     setButtonLoading(btn, true, 'Exportando...');
     try {
         const dataPayload = {};
         const collections = ['cuentas', 'conceptos', 'movimientos', 'presupuestos', 'recurrentes', 'inversiones_historial', 'inversion_cashflows'];
         
         for (const collectionName of collections) {
             const snapshot = await fbDb.collection('users').doc(currentUser.uid).collection(collectionName).get();
             dataPayload[collectionName] = snapshot.docs.map(doc => doc.data());
         }
         dataPayload.config = db.config;

         const exportObject = {
             meta: {
                 appName: "DaniCtas",
                 version: "3.0.0",
                 exportDate: new Date().toISOString()
             },
             data: dataPayload
         };
         
         const jsonString = JSON.stringify(exportObject, null, 2);
         const blob = new Blob([jsonString], { type: 'application/json' });
         const url = URL.createObjectURL(blob);
         const a = document.createElement('a');
         a.href = url;
         a.download = `cuentas_aidanai_backup_${new Date().toISOString().slice(0,10)}.json`;
         document.body.appendChild(a);
         a.click();
         document.body.removeChild(a);
         URL.revokeObjectURL(url);
         showToast("Exportación JSON completada.", "info");
     } catch (error) {
         console.error("Error al exportar datos:", error);
         showToast("Error durante la exportación.", "danger");
     } finally {
         setButtonLoading(btn, false);
     }
 };
 const formatDateForCsv = (isoDateString) => {
     if (!isoDateString) return '';
     const date = new Date(isoDateString);
     const day = String(date.getUTCDate()).padStart(2, '0');
     const month = String(date.getUTCMonth() + 1).padStart(2, '0');
     const year = date.getUTCFullYear();
     return `${day}/${month}/${year}`;
 };

 const handleExportCsv = async (btn) => {
     if (!currentUser) { showToast("No hay usuario autenticado.", "danger"); return; }
     setButtonLoading(btn, true, 'Exportando...');
     
     try {
         const allMovements = await AppStore.getAll();
         const allCuentas = db.cuentas;
         const allConceptos = db.conceptos;

         const cuentasMap = new Map(allCuentas.map(c => [c.id, c]));
         const conceptosMap = new Map(allConceptos.map(c => [c.id, c]));

         let csvRows = [];
         const csvHeader = ['FECHA', 'CUENTA', 'CONCEPTO', 'IMPORTE', 'DESCRIPCIÓN'];
         csvRows.push(csvHeader.join(';'));
         
         for (const cuenta of allCuentas) {
             const movementsOfAccount = allMovements.filter(m => {
                 return (m.tipo === 'movimiento' && m.cuentaId === cuenta.id) ||
                        (m.tipo === 'traspaso' && m.cuentaOrigenId === cuenta.id) ||
                        (m.tipo === 'traspaso' && m.cuentaDestinoId === cuenta.id);
             });

             const balanceChange = movementsOfAccount.reduce((sum, m) => {
                 if (m.tipo === 'movimiento') return sum + m.cantidad;
                 if (m.tipo === 'traspaso' && m.cuentaOrigenId === cuenta.id) return sum - m.cantidad;
                 if (m.tipo === 'traspaso' && m.cuentaDestinoId === cuenta.id) return sum + m.cantidad;
                 return sum;
             }, 0);
             
             const initialBalance = (cuenta.saldo || 0) - balanceChange;
             
             if (initialBalance !== 0) {
                 const cuentaNombre = `${cuenta.offBalance ? 'N-' : ''}${cuenta.nombre}`;
                 const importeStr = (initialBalance / 100).toLocaleString('es-ES', { useGrouping: false, minimumFractionDigits: 2 });
                 const fechaCreacion = cuenta.fechaCreacion ? formatDateForCsv(cuenta.fechaCreacion) : '01/01/2025';

                 csvRows.push([fechaCreacion, `"${cuentaNombre}"`, 'INICIAL', importeStr, '"Saldo Inicial"'].join(';'));
             }
         }
         
         const sortedMovements = allMovements.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

         for (const mov of sortedMovements) {
             const fecha = formatDateForCsv(mov.fecha);
             const descripcion = `"${mov.descripcion.replace(/"/g, '""')}"`;
             const importeStr = (mov.cantidad / 100).toLocaleString('es-ES', { useGrouping: false, minimumFractionDigits: 2 });

             if (mov.tipo === 'traspaso') {
                 const cuentaOrigen = cuentasMap.get(mov.cuentaOrigenId);
                 const cuentaDestino = cuentasMap.get(mov.cuentaDestinoId);
                 
                 if (cuentaOrigen && cuentaDestino) {
                     const nombreOrigen = `${cuentaOrigen.offBalance ? 'N-' : ''}${cuentaOrigen.nombre}`;
                     const nombreDestino = `${cuentaDestino.offBalance ? 'N-' : ''}${cuentaDestino.nombre}`;
                     const importeNegativo = (-mov.cantidad / 100).toLocaleString('es-ES', { useGrouping: false, minimumFractionDigits: 2 });
                     
                     csvRows.push([fecha, `"${nombreOrigen}"`, 'TRASPASO', importeNegativo, descripcion].join(';'));
                     csvRows.push([fecha, `"${nombreDestino}"`, 'TRASPASO', importeStr, descripcion].join(';'));
                 }
             } else {
                 const cuenta = cuentasMap.get(mov.cuentaId);
                 const concepto = conceptosMap.get(mov.conceptoId);

                 if (cuenta && concepto && concepto.nombre !== 'Saldo Inicial') {
                     const nombreCuenta = `${cuenta.offBalance ? 'N-' : ''}${cuenta.nombre}`;
                     csvRows.push([fecha, `"${nombreCuenta}"`, `"${concepto.nombre}"`, importeStr, descripcion].join(';'));
                 }
             }
         }

         const csvString = csvRows.join('\r\n');
         const blob = new Blob([`\uFEFF${csvString}`], { type: 'text/csv;charset=utf-8;' });
         const url = URL.createObjectURL(blob);
         const a = document.createElement('a');
         a.href = url;
         a.download = `cuentas_aidanai_export_${new Date().toISOString().slice(0,10)}.csv`;
         document.body.appendChild(a);
         a.click();
         document.body.removeChild(a);
         URL.revokeObjectURL(url);
         showToast("Exportación CSV completada.", "info");
         
     } catch (error) {
         console.error("Error al exportar datos a CSV:", error);
         showToast("Error durante la exportación a CSV.", "danger");
     } finally {
         setButtonLoading(btn, false);
     }
 };
 const csv_parseDate = (dateString) => {
     if (!dateString) return null;
     const parts = dateString.split('/');
     if (parts.length !== 3) return null;
     const day = parseInt(parts[0], 10);
	 const month = parseInt(parts[1], 10) - 1;
	 const year = parseInt(parts[2], 10);
     if (isNaN(day) || isNaN(month) || isNaN(year) || year < 1970) return null;
     return new Date(Date.UTC(year, month, day, 12, 0, 0));
 };

 const csv_parseCurrency = (currencyString) => {
    if (typeof currencyString !== 'string' || !currencyString) return 0;
    
    let cleanStr = currencyString.replace(/[€$£\s]/g, ''); // Quitar símbolos
    
    // Detección heurística: Si la última ocurrencia es un punto, es formato US
    const lastDotIndex = cleanStr.lastIndexOf('.');
    const lastCommaIndex = cleanStr.lastIndexOf(',');

    if (lastDotIndex > lastCommaIndex) {
        // Formato US: 1,200.50 -> Quitar comas
        cleanStr = cleanStr.replace(/,/g, ''); 
    } else {
        // Formato ES: 1.200,50 -> Quitar puntos y cambiar coma por punto
        cleanStr = cleanStr.replace(/\./g, '').replace(',', '.');
    }

    const number = parseFloat(cleanStr);
    return isNaN(number) ? 0 : Math.round(number * 100);
};

 const csv_inferType = (name) => {
     const upperName = name.toUpperCase();
     if (upperName.includes('TARJETA')) return { tipo: 'Tarjeta', esInversion: false };
     if (upperName.includes('EFECTIVO')) return { tipo: 'Efectivo', esInversion: false };
     if (upperName.includes('PENSIÓN')) return { tipo: 'Pensión', esInversion: true };
     if (upperName.includes('LETRAS')) return { tipo: 'Renta Fija', esInversion: true };
     if (['FONDO', 'FONDOS'].some(t => upperName.includes(t))) return { tipo: 'Fondos', esInversion: true };
     if (['TRADEREPUBLIC', 'MYINVESTOR', 'DEGIRO', 'INTERACTIVEBROKERS', 'INDEXACAPITAL', 'COINBASE', 'CRIPTAN', 'KRAKEN', 'BIT2ME', 'N26', 'FREEDOM24', 'DEBLOCK', 'BBVA', 'CIVISLEND', 'HOUSERS', 'URBANITAE', 'MINTOS', 'HAUSERA'].some(b => upperName.includes(b))) return { tipo: 'Broker', esInversion: true };
     if (upperName.includes('NARANJA') || upperName.includes('AHORRO')) return { tipo: 'Ahorro', esInversion: false };
     return { tipo: 'Banco', esInversion: false };
 };

  const csv_processFile = (file) => {
     return new Promise((resolve, reject) => {
         const reader = new FileReader();
         reader.onload = (event) => {
             try {
                 const csvData = event.target.result.replace(/^\uFEFF/, '');
                 const lines = csvData.split(/\r?\n/).filter(line => line.trim() !== '' && line.includes(';'));
                 if (lines.length <= 1) {
                     showToast("El archivo CSV está vacío o solo contiene la cabecera.", "warning");
                     return resolve(null);
                 }
                 
                 lines.shift(); // Eliminar la cabecera

                 let rowCount = 0, initialCount = 0;
                 const cuentasMap = new Map();
                 const conceptosMap = new Map();
                 const movimientos = [];
                 const potentialTransfers = [];
                 
                 for (const line of lines) {
                     rowCount++;
                     const columns = line.split(';').map(c => c.trim().replace(/"/g, ''));
                     const [fechaStr, cuentaStr, conceptoStr, importeStr, descripcion = ''] = columns;

                     if (!fechaStr || !cuentaStr || !conceptoStr || !importeStr) {
                         console.warn(`Línea inválida o incompleta #${rowCount + 1}. Saltando...`, line);
                         continue;
                     }
                     
                     const fecha = csv_parseDate(fechaStr);
                     if (!fecha) {
                          console.warn(`Fecha inválida en la fila ${rowCount + 1}: ${fechaStr}`);
                          continue;
                     }

                     const conceptoLimpio = conceptoStr.trim().toUpperCase().replace(/\s*;-$/, '');
                     const offBalance = cuentaStr.startsWith('N-');
                     const nombreCuentaLimpio = cuentaStr.replace(/^(D-|N-)/, '');
                     const cantidad = csv_parseCurrency(importeStr);

                     if (!cuentasMap.has(nombreCuentaLimpio)) {
                         const { tipo, esInversion } = csv_inferType(nombreCuentaLimpio);
                         cuentasMap.set(nombreCuentaLimpio, { id: generateId(), nombre: nombreCuentaLimpio, tipo, saldo: 0, esInversion, offBalance, fechaCreacion: new Date(Date.UTC(2025, 0, 1)).toISOString() });
                     }

                     if (conceptoLimpio === 'INICIAL') {
                         initialCount++;
                         if (!conceptosMap.has('SALDO INICIAL')) conceptosMap.set('SALDO INICIAL', { id: generateId(), nombre: 'Saldo Inicial', icon: 'account_balance' });
                         const conceptoInicial = conceptosMap.get('SALDO INICIAL');
                         movimientos.push({ id: generateId(), fecha: fecha.toISOString(), cantidad, descripcion: descripcion || 'Existencia Inicial', tipo: 'movimiento', cuentaId: cuentasMap.get(nombreCuentaLimpio).id, conceptoId: conceptoInicial ? conceptoInicial.id : null });
                         continue;
                     }

                     if (conceptoLimpio && conceptoLimpio !== 'TRASPASO' && !conceptosMap.has(conceptoLimpio)) {
                         conceptosMap.set(conceptoLimpio, { id: generateId(), nombre: toSentenceCase(conceptoLimpio), icon: 'label' });
                     }
                     
                     if (conceptoLimpio === 'TRASPASO') {
                         // CAMBIO CLAVE: Incluimos la descripción en el objeto que guardamos para su posterior análisis.
                         potentialTransfers.push({ fecha, nombreCuenta: nombreCuentaLimpio, cantidad, descripcion, originalRow: rowCount });
                     } else {
                         const conceptoActual = conceptosMap.get(conceptoLimpio);
                         movimientos.push({ id: generateId(), fecha: fecha.toISOString(), cantidad, descripcion, tipo: 'movimiento', cuentaId: cuentasMap.get(nombreCuentaLimpio).id, conceptoId: conceptoActual ? conceptoActual.id : null });
                     }
                 }

                 let matchedTransfersCount = 0;
                 let unmatchedTransfers = [];
                 const transferGroups = new Map();
                 
                 potentialTransfers.forEach(t => {
                     // CAMBIO CLAVE: La nueva "llave" para agrupar ahora incluye la descripción.
                     // Esto asegura que solo traspasos con misma fecha, importe Y descripción se agrupen.
                     const key = `${t.fecha.getTime()}_${Math.abs(t.cantidad)}_${t.descripcion}`;
                     if (!transferGroups.has(key)) transferGroups.set(key, []);
                     transferGroups.get(key).push(t);
                 });

                 transferGroups.forEach((group) => {
                     const gastos = group.filter(t => t.cantidad < 0);
                     const ingresos = group.filter(t => t.cantidad > 0);
                     
                     // Este bucle ahora opera sobre un grupo mucho más específico y fiable.
                     while (gastos.length > 0 && ingresos.length > 0) {
                         const Gasto = gastos.pop();
                         const Ingreso = ingresos.pop();
                         movimientos.push({ id: generateId(), fecha: Gasto.fecha.toISOString(), cantidad: Math.abs(Gasto.cantidad), descripcion: Gasto.descripcion || Ingreso.descripcion || 'Traspaso', tipo: 'traspaso', cuentaOrigenId: cuentasMap.get(Gasto.nombreCuenta).id, cuentaDestinoId: cuentasMap.get(Ingreso.nombreCuenta).id });
                         matchedTransfersCount++;
                     }
                     // Los que no se emparejan se añaden a la lista de "sin pareja".
                     unmatchedTransfers.push(...gastos, ...ingresos);
                 });
                 
                 const conceptoInicialId = conceptosMap.has('SALDO INICIAL') ? conceptosMap.get('SALDO INICIAL').id : null;
                 const finalData = { cuentas: Array.from(cuentasMap.values()), conceptos: Array.from(conceptosMap.values()), movimientos, presupuestos: [], recurrentes: [], inversiones_historial: [], inversion_cashflows: [], config: getInitialDb().config };
                 const totalMovements = movimientos.filter(m => m.tipo === 'movimiento' && m.conceptoId !== conceptoInicialId).length;

                 resolve({
                     jsonData: finalData,
                     stats: { rowCount, accounts: cuentasMap.size, concepts: conceptosMap.size, movements: totalMovements, transfers: matchedTransfersCount, initials: initialCount, unmatched: unmatchedTransfers.length }
                 });

             } catch (error) {
                 reject(error);
             }
         };
         reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
         reader.readAsText(file, 'UTF-8');
     });
 };

 const showCsvImportWizard = () => {
     const wizardHTML = `
     <div id="csv-wizard-content">
         <div id="csv-wizard-step-1" class="json-wizard-step">
             <h4>Paso 1: Selecciona tu archivo CSV</h4>
             <p class="form-label" style="margin-bottom: var(--sp-3);">
                 Columnas requeridas: <code>FECHA;CUENTA;CONCEPTO;IMPORTE;DESCRIPCIÓN</code>.
                 <br><strong>Atención:</strong> La importación reemplazará <strong>todos</strong> tus datos actuales.
             </p>
             <div id="csv-drop-zone" class="upload-area">
                 <p>Arrastra tu archivo <code>.csv</code> aquí o <strong>haz clic para seleccionarlo</strong>.</p>
                 <span id="csv-file-name" class="file-name" style="color: var(--c-success); font-weight: 600; margin-top: 1rem; display: block;"></span>
             </div>
             <div id="csv-file-error" class="form-error" style="text-align: center; margin-top: var(--sp-3);"></div>
             <div class="modal__actions">
                 <button id="csv-process-btn" class="btn btn--primary btn--full" disabled>Analizar Archivo</button>
             </div>
         </div>

         <div id="csv-wizard-step-2" class="json-wizard-step" style="display: none;">
             <h4>Paso 2: Revisa y confirma</h4>
             <p class="form-label" style="margin-bottom: var(--sp-3);">Hemos analizado tu archivo. Si los datos son correctos, pulsa "Importar" para reemplazar tus datos actuales.</p>
             <div class="results-log" style="display: block; margin-top: 0;">
                 <h2>Resultados del Análisis</h2>
                 <ul id="csv-preview-list"></ul>
             </div>
             <div class="form-error" style="margin-top: var(--sp-2); text-align: center;"><strong>Atención:</strong> Esta acción es irreversible.</div>
             <div class="modal__actions" style="justify-content: space-between;">
                 <button id="csv-wizard-back-btn" class="btn btn--secondary">Atrás</button>
                 <button id="csv-wizard-import-final" class="btn btn--danger"><span class="material-icons">warning</span>Importar y Reemplazar</button>
             </div>
         </div>

         <div id="csv-wizard-step-3" class="json-wizard-step" style="display: none; justify-content: center; align-items: center; text-align: center; min-height: 250px;">
             <div id="csv-import-progress">
                 <span class="spinner" style="width: 48px; height: 48px; border-width: 4px;"></span>
                 <h4 style="margin-top: var(--sp-4);">Importando...</h4>
                 <p>Borrando datos antiguos e importando los nuevos. Por favor, no cierres esta ventana.</p>
             </div>
              <div id="csv-import-result" style="display: none;">
                 <span class="material-icons" style="font-size: 60px; color: var(--c-success);">task_alt</span>
                 <h4 id="csv-result-title" style="margin-top: var(--sp-2);"></h4>
                 <p id="csv-result-message"></p>
                 <div class="modal__actions" style="justify: center;">
                     <button class="btn btn--primary" data-action="close-modal" data-modal-id="generic-modal">Finalizar</button>
                 </div>
              </div>
         </div>
     </div>`;

     showGenericModal('Asistente de Importación CSV', wizardHTML);

     setTimeout(() => {
         let csvFile = null;
         let processedData = null;
         const wizardContent = select('csv-wizard-content');
         if (!wizardContent) return;

         const goToStep = (step) => {
             wizardContent.querySelectorAll('.json-wizard-step').forEach(s => s.style.display = 'none');
             wizardContent.querySelector(`#csv-wizard-step-${step}`).style.display = 'flex';
         };

         const fileInput = document.createElement('input');
         fileInput.type = 'file'; fileInput.accept = '.csv, text/csv'; fileInput.className = 'hidden';
         wizardContent.appendChild(fileInput);

         const handleFileSelection = (files) => {
             const file = files;
             const nameEl = select('csv-file-name'), processBtn = select('csv-process-btn'), errorEl = select('csv-file-error');
             if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
                 csvFile = file;
                 nameEl.textContent = `Archivo: ${file.name}`;
                 processBtn.disabled = false;
                 errorEl.textContent = '';
             } else {
                 csvFile = null;
                 nameEl.textContent = 'Por favor, selecciona un archivo .csv válido.';
                 processBtn.disabled = true;
             }
         };
         
         const dropZone = select('csv-drop-zone');
         dropZone.addEventListener('click', () => fileInput.click());
         fileInput.addEventListener('change', () => handleFileSelection(fileInput.files));
         dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
         dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
         dropZone.addEventListener('drop', (e) => { e.preventDefault(); dropZone.classList.remove('drag-over'); handleFileSelection(e.dataTransfer.files); });

         select('csv-process-btn').addEventListener('click', async (e) => {
             if (!csvFile) return;
             const btn = e.target;
             setButtonLoading(btn, true, 'Analizando...');
             try {
                 const result = await csv_processFile(csvFile);
                 if (result) {
                     processedData = result.jsonData;
                     const { stats } = result;
                     const previewList = select('csv-preview-list');
                     let html = `
                         <li><span class="label">Filas Válidas Leídas</span><span class="value">${stats.rowCount}</span></li>
                         <li><span class="label">Cuentas a Crear</span><span class="value success">${stats.accounts}</span></li>
                         <li><span class="label">Conceptos a Crear</span><span class="value success">${stats.concepts}</span></li>
                         <li><span class="label">Saldos Iniciales</span><span class="value">${stats.initials}</span></li>
                         <li><span class="label">Movimientos (Ingreso/Gasto)</span><span class="value">${stats.movements}</span></li>
                         <li><span class="label">Transferencias Emparejadas</span><span class="value">${stats.transfers}</span></li>
                         <li><span class="label">Transferencias sin Pareja</span><span class="value ${stats.unmatched > 0 ? 'danger' : 'success'}">${stats.unmatched}</span></li>
                     `;
                     previewList.innerHTML = html;
                     goToStep(2);
                 }
             } catch (error) {
                 console.error("Error al procesar CSV:", error);
                 select('csv-file-error').textContent = `Error: ${error.message}`;
             } finally {
                 setButtonLoading(btn, false);
             }
         });

         select('csv-wizard-back-btn').addEventListener('click', () => goToStep(1));
         select('csv-wizard-import-final').addEventListener('click', (e) => {
             if (processedData) handleFinalCsvImport(e.target, processedData, goToStep);
         });
     }, 0);
 };

 const handleFinalCsvImport = async (btn, dataToImport, goToStep) => {
     goToStep(3);
     setButtonLoading(btn, true, 'Importando...');

     try {
         const collectionsToClear = ['cuentas', 'conceptos', 'movimientos', 'presupuestos', 'recurrentes', 'inversiones_historial', 'inversion_cashflows'];

         for (const collectionName of collectionsToClear) {
             const snapshot = await fbDb.collection('users').doc(currentUser.uid).collection(collectionName).get();
             if (snapshot.empty) continue;
             let batch = fbDb.batch();
             let count = 0;
             for (const doc of snapshot.docs) {
                 batch.delete(doc.ref);
                 count++;
                 if (count >= 450) { await batch.commit(); batch = fbDb.batch(); count = 0; }
             }
             if (count > 0) await batch.commit();
         }
         
         for (const collectionName of Object.keys(dataToImport)) {
             const items = dataToImport[collectionName];
             if (Array.isArray(items) && items.length > 0) {
                 let batch = fbDb.batch();
                 let count = 0;
                 for (const item of items) {
                     if (item.id) {
                         const docRef = fbDb.collection('users').doc(currentUser.uid).collection(collectionName).doc(item.id);
                         batch.set(docRef, item);
                         count++;
                         if (count >= 450) { await batch.commit(); batch = fbDb.batch(); count = 0; }
                     }
                 }
                 if (count > 0) await batch.commit();
             } else if (collectionName === 'config') {
                 await fbDb.collection('users').doc(currentUser.uid).set({ config: items }, { merge: true });
             }
         }
         
         const resultEl = select('csv-import-result');
         select('csv-import-progress').style.display = 'none';
         if(resultEl) {
             resultEl.style.display = 'block';
             resultEl.querySelector('#csv-result-title').textContent = '¡Importación Completada!';
             resultEl.querySelector('#csv-result-message').textContent = 'Los datos se han importado correctamente. La aplicación se recargará.';
         }
         
         hapticFeedback('success');
         showToast('¡Importación completada!', 'info', 4000);
         setTimeout(() => location.reload(), 4500);

     } catch (error) {
         console.error("Error en importación final desde CSV:", error);
         showToast("Error crítico durante la importación.", "danger", 5000);
         const resultEl = select('csv-import-result');
         select('csv-import-progress').style.display = 'none';
         if(resultEl) {
             resultEl.style.display = 'block';
             resultEl.querySelector('#csv-result-title').textContent = '¡Error en la Importación!';
             resultEl.querySelector('#csv-result-message').textContent = 'Ocurrió un error. Revisa la consola e inténtalo de nuevo.';
             const iconEl = resultEl.querySelector('.material-icons');
             if (iconEl) iconEl.style.color = 'var(--c-danger)';
         }
         setButtonLoading(btn, false);
     }
 };


// =================================================================
// === INICIO: FUNCIÓN DE BORRADO OPTIMIZADA (v2.1 - CON REVERSIÓN) ===
// =================================================================
const deleteMovementAndAdjustBalance = async (id, isRecurrent = false) => {
    const collection = isRecurrent ? 'recurrentes' : 'movimientos';
    const ANIMATION_DURATION = 400; // Debe coincidir con la duración en el CSS

    const itemElement = document.querySelector(`.transaction-card[data-id="${id}"]`)?.closest('.swipe-container');
    
    // 1. PREPARACIÓN PARA REVERSIÓN: Guardamos el estado original
    let itemToDelete;
    let originalIndex; // Guardamos la posición original para poder reinsertarlo
    const dbSource = isRecurrent ? db.recurrentes : db.movimientos;
    
    originalIndex = dbSource.findIndex(item => item.id === id);
    if (originalIndex === -1) {
        showToast("Error: El elemento a borrar no se encontró localmente.", "danger");
        return;
    }
    // Hacemos una copia profunda del objeto para no tener problemas de referencia
    itemToDelete = JSON.parse(JSON.stringify(dbSource[originalIndex])); 

    try {
        // 2. ACTUALIZACIÓN OPTIMISTA (La UI cambia al instante)
        dbSource.splice(originalIndex, 1); // Lo borramos de la memoria local
		AppStore.delete(id);
        if (!isRecurrent) {
            applyOptimisticBalanceUpdate(null, itemToDelete); // Revertimos el saldo en la caché local
        }
    
        if (itemElement) {
            itemElement.classList.add('item-deleting');
        }

        setTimeout(() => {
            updateLocalDataAndRefreshUI(); // Redibuja la lista sin el elemento
            if (isRecurrent) renderPlanificacionPage();
        }, itemElement ? ANIMATION_DURATION : 0);

        // 3. PERSISTENCIA EN SEGUNDO PLANO (El intento de guardado real)
        if (!isRecurrent) {
            const batch = fbDb.batch();
            const userRef = fbDb.collection('users').doc(currentUser.uid);
            if (itemToDelete.tipo === 'traspaso') {
                const origenRef = userRef.collection('cuentas').doc(itemToDelete.cuentaOrigenId);
                const destinoRef = userRef.collection('cuentas').doc(itemToDelete.cuentaDestinoId);
                batch.update(origenRef, { saldo: firebase.firestore.FieldValue.increment(itemToDelete.cantidad) });
                batch.update(destinoRef, { saldo: firebase.firestore.FieldValue.increment(-itemToDelete.cantidad) });
            } else {
                const cuentaRef = userRef.collection('cuentas').doc(itemToDelete.cuentaId);
                batch.update(cuentaRef, { saldo: firebase.firestore.FieldValue.increment(-itemToDelete.cantidad) });
            }
            batch.delete(userRef.collection(collection).doc(id));
            await batch.commit();
        } else {
            await deleteDoc(collection, id);
        }

        hapticFeedback('success');
        showToast("Elemento eliminado.", "info");

    } catch (error) {
        // 4. ¡PLAN B! SI FIREBASE FALLA, REVERTIMOS EL CAMBIO OPTIMISTA
        console.error("Firebase falló. Revirtiendo cambio optimista:", error);
        showToast("Error de red. El borrado no se completó.", "danger");

        // Volvemos a añadir el item que borramos localmente, en su posición original
        dbSource.splice(originalIndex, 0, itemToDelete);
        
        // Recalculamos el saldo con el item restaurado
        if (!isRecurrent) {
            applyOptimisticBalanceUpdate(itemToDelete, null);
        }
        
        // Forzamos un re-renderizado completo para asegurar la consistencia
        updateLocalDataAndRefreshUI();
        if (isRecurrent) renderPlanificacionPage();
    }
};
// ============================================================
// === FIN: FUNCIÓN DE BORRADO OPTIMIZADA ===
// ============================================================
const auditAndFixAllBalances = async (btn) => {
    if (!currentUser) {
        showToast("Debes iniciar sesión para realizar esta acción.", "danger");
        return;
    }

    setButtonLoading(btn, true, 'Auditando...');
    showToast("Iniciando recálculo de saldos... Esto puede tardar un momento.", 'info', 4000);

    try {
        const userRef = fbDb.collection('users').doc(currentUser.uid);
        const cuentasRef = userRef.collection('cuentas');
        const movimientosRef = userRef.collection('movimientos');

        const cuentasSnapshot = await cuentasRef.get();
        const newBalances = {};
        cuentasSnapshot.forEach(doc => {
            newBalances[doc.id] = 0;
        });

        const movimientosSnapshot = await movimientosRef.get();
        console.log(`Procesando ${movimientosSnapshot.size} movimientos para el recálculo.`);

        movimientosSnapshot.forEach(doc => {
            const mov = doc.data();
            if (mov.tipo === 'traspaso') {
                if (newBalances.hasOwnProperty(mov.cuentaOrigenId)) {
                    newBalances[mov.cuentaOrigenId] -= mov.cantidad;
                }
                if (newBalances.hasOwnProperty(mov.cuentaDestinoId)) {
                    newBalances[mov.cuentaDestinoId] += mov.cantidad;
                }
            } else {
                if (newBalances.hasOwnProperty(mov.cuentaId)) {
                    newBalances[mov.cuentaId] += mov.cantidad;
                }
            }
        });

        const batch = fbDb.batch();
        for (const cuentaId in newBalances) {
            const cuentaRef = cuentasRef.doc(cuentaId);
            batch.update(cuentaRef, { saldo: newBalances[cuentaId] });
        }
        
        await batch.commit();

        hapticFeedback('success');
        showToast("¡Auditoría completada! Todos los saldos han sido recalculados y actualizados.", "info", 5000);
        
        loadCoreData(currentUser.uid);

    } catch (error) {
        console.error("Error crítico durante el recálculo de saldos:", error);
        showToast("Ocurrió un error grave durante el recálculo. Revisa la consola.", "danger");
    } finally {
        setButtonLoading(btn, false);
    }
};    
const applyInvestmentItemInteractions = (containerElement) => {
    if (!containerElement) return;

    const investmentItems = containerElement.querySelectorAll('[data-action="view-account-details"]');

    investmentItems.forEach(item => {
        if (item.dataset.longPressApplied) return;
        item.dataset.longPressApplied = 'true';

        let longPressTimer;
        let startX, startY;
        let longPressTriggered = false;

        const startHandler = (e) => {
            // Soporte híbrido Touch/Mouse
            const point = (e.type.includes('touch') && e.touches && e.touches.length > 0) ? e.touches[0] : e;
            
            startX = point.clientX;
            startY = point.clientY;
            longPressTriggered = false;

            longPressTimer = setTimeout(() => {
                longPressTriggered = true;
                const accountId = item.dataset.id;
                hapticFeedback('medium');
                handleShowIrrHistory({ accountId: accountId });
            }, 500); 
        };

        const moveHandler = (e) => {
            if (!longPressTimer) return;
            
            // CORRECCIÓN DEL ERROR: Verificamos tipo de evento antes de buscar touches
            const point = (e.type.includes('touch') && e.touches && e.touches.length > 0) ? e.touches[0] : e;
            
            // Si el dedo se mueve más de 10px, cancelamos la pulsación larga (es un scroll)
            if (Math.abs(point.clientX - startX) > 10 || Math.abs(point.clientY - startY) > 10) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
        };

        const endHandler = (e) => {
            clearTimeout(longPressTimer);
            if (longPressTriggered) {
                if (e.cancelable) e.preventDefault();
                e.stopPropagation(); 
            }
        };
        
        // Eventos Táctiles
        item.addEventListener('touchstart', startHandler, { passive: true });
        item.addEventListener('touchmove', moveHandler, { passive: true });
        item.addEventListener('touchend', endHandler);
        
        // Eventos Ratón (PC)
        item.addEventListener('mousedown', startHandler);
        item.addEventListener('mousemove', moveHandler);
        item.addEventListener('mouseup', endHandler);
        item.addEventListener('mouseleave', () => clearTimeout(longPressTimer));
        
        item.addEventListener('contextmenu', e => e.preventDefault());
    });
};

const handleSaveInvestmentAccounts = async (form, btn) => {
    setButtonLoading(btn, true);
    const selectedIds = new Set(Array.from(form.querySelectorAll('input[type=checkbox]:checked')).map(cb => cb.value));
    const batch = fbDb.batch();
    db.cuentas.forEach(c => {
        const ref = fbDb.collection('users').doc(currentUser.uid).collection('cuentas').doc(c.id);
        batch.update(ref, { esInversion: selectedIds.has(c.id) });
    });
    await batch.commit();
    setButtonLoading(btn, false);
    hideModal('generic-modal');
    hapticFeedback('success');
    showToast('Portafolio actualizado.');
};
const handleResetPortfolioBaseline = async (btn) => {
const investmentAccounts = getVisibleAccounts().filter(c => c.esInversion);
if (investmentAccounts.length === 0) {
    showToast("No hay activos de inversión para resetear.", "warning");
    return;
}

showConfirmationModal(
    `¿Estás seguro? Se creará una nueva valoración para ${investmentAccounts.length} activo(s), poniendo su valor al capital aportado. Esto pondrá su P&L a cero a fecha de hoy. Esta acción no se puede deshacer.`,
    async () => {
        setButtonLoading(btn, true, 'Reseteando...');
        try {
            const batch = fbDb.batch();
            const userRef = fbDb.collection('users').doc(currentUser.uid);
            const todayISO = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString();

            for (const cuenta of investmentAccounts) {
                // Calculamos el capital invertido para esta cuenta específica
                const cashflows = (db.inversion_cashflows || []).filter(cf => cf.cuentaId === cuenta.id);
                const capitalInvertido = cashflows.reduce((sum, cf) => sum + cf.cantidad, 0);

                // Creamos la nueva valoración que iguala el valor al capital
                const newId = generateId();
                const newValoracion = {
                    id: newId,
                    cuentaId: cuenta.id,
                    valor: capitalInvertido, // ¡La magia está aquí!
                    fecha: todayISO
                };
                
                const docRef = userRef.collection('inversiones_historial').doc(newId);
                batch.set(docRef, newValoracion);
            }

            await batch.commit();

            hapticFeedback('success');
            showToast("¡Línea base establecida! El P&L de todos los activos ha sido reseteado a cero.", "info", 5000);
            
            // Cerramos el modal y refrescamos el portafolio para ver el cambio
            hideModal('generic-modal');
            const container = select('patrimonio-inversiones-container');
            if (container) {
                renderInversionesPage('patrimonio-inversiones-container');
            }

        } catch (error) {
            console.error("Error al resetear la línea base del portafolio:", error);
            showToast("Ocurrió un error durante el reseteo.", "danger");
        } finally {
            setButtonLoading(btn, false);
        }
    },
    "Confirmar Reseteo de P&L"
);

};

document.addEventListener('DOMContentLoaded', initApp);

const fetchMovementsInChunks = async (baseQuery, field, ids) => {
    if (ids.length === 0) {
        return [];
    }
    const idChunks = chunkArray(ids, 10);
    
    const queryPromises = idChunks.map(chunk => {
        return baseQuery.where(field, 'in', chunk).get();
    });

    const querySnapshots = await Promise.all(queryPromises);

    let movements = [];
    querySnapshots.forEach(snapshot => {
        snapshot.forEach(doc => {
            movements.push({ id: doc.id, ...doc.data() });
        });
    });

    return movements;
};

const validateField = (id, silent = false) => {
    const input = select(id);
    if (!input) return true;

    clearError(id);
    let isValid = true;
    const value = input.value.trim();
    
    // CORRECCIÓN: Obtenemos el tipo de la misma forma que en el resto de la app
    const activeTypeButton = document.querySelector('[data-action="set-movimiento-type"].filter-pill--active');
    const type = activeTypeButton ? activeTypeButton.dataset.type : 'gasto';
    const formType = (type === 'traspaso') ? 'traspaso' : 'movimiento';


    switch (id) {
        case 'movimiento-cantidad':
            const amount = parseCurrencyString(value);
            if (isNaN(amount) || value === '') {
                displayError(id, 'Cantidad no válida.'); isValid = false;
            }
            break;
        case 'movimiento-descripcion':
            // La descripción no es obligatoria para traspasos con autocompletado
            if (formType === 'movimiento' && value === '') {
                displayError(id, 'La descripción es obligatoria.'); isValid = false;
            }
            break;
        case 'movimiento-concepto':
            if (formType === 'movimiento' && value === '') {
                displayError(id, 'El concepto es obligatorio.'); isValid = false;
            }
            break;
        case 'movimiento-cuenta':
            if (formType === 'movimiento' && value === '') {
                displayError(id, 'La cuenta es obligatoria.'); isValid = false;
            }
            break;
        case 'movimiento-cuenta-origen':
        case 'movimiento-cuenta-destino':
            if (formType === 'traspaso') {
                const origen = select('movimiento-cuenta-origen').value;
                const destino = select('movimiento-cuenta-destino').value;
                if (value === '') {
                    displayError(id, 'La cuenta es obligatoria.');
                    isValid = false;
                } else if (origen && destino && origen === destino) {
                    if (input.id === 'movimiento-cuenta-origen') {
                        displayError(id, 'No puede ser la misma cuenta destino.');
                    } else {
                        displayError(id, 'No puede ser la misma cuenta origen.');
                    }
                    isValid = false;
                }
            }
            break;
        case 'movimiento-fecha':
            if (value === '') {
                displayError(id, 'La fecha es obligatoria.'); isValid = false;
            }
            break;
        case 'new-cuenta-nombre':
        case 'new-cuenta-tipo':
        case 'edit-cuenta-nombre':
        case 'edit-cuenta-tipo':
            if (value === '') {
                displayError(id, 'Este campo es obligatorio.'); isValid = false;
            }
            break;
        case 'new-concepto-nombre':
        case 'edit-concepto-nombre':
            if (value === '') {
                displayError(id, 'Este campo es obligatorio.'); isValid = false;
            }
            break;
         case 'valoracion-valor':
            const valor = parseCurrencyString(value);
            if (isNaN(valor) || valor < 0) {
                displayError(id, 'Valor no válido. Debe ser un número positivo.'); isValid = false;
            }
            break;
        case 'valoracion-fecha':
            if (value === '') {
                displayError(id, 'La fecha es obligatoria.'); isValid = false;
            }
            break;
        case 'aportacion-cantidad':
            const aportacion = parseCurrencyString(value);
            if (isNaN(aportacion) || value === '') {
                displayError(id, 'Cantidad no válida.'); isValid = false;
            }
            break;
        case 'aportacion-fecha':
            if (value === '') {
                displayError(id, 'La fecha es obligatoria.'); isValid = false;
            }
            break;
    }

    if (!isValid && !silent) hapticFeedback('light');

    return isValid;
};

/* --- VERSIÓN CORREGIDA DE VALIDACIÓN --- */
const validateMovementForm = () => {
    // 1. Obtener elementos con seguridad
    const cantidadInput = document.getElementById('movimiento-cantidad');
    const conceptoSelect = document.getElementById('movimiento-concepto');
    const cuentaSelect = document.getElementById('movimiento-cuenta');
    
    // Para traspasos
    const cuentaOrigen = document.getElementById('movimiento-cuenta-origen');
    const cuentaDestino = document.getElementById('movimiento-cuenta-destino');
    
    // Tipo de movimiento (leemos del botón activo o del input oculto)
    const typeSelector = document.querySelector('.type-selector .type-btn.active');
    const tipo = typeSelector ? typeSelector.dataset.type : 'gasto';

    let isValid = true;
    let errors = [];

    // 2. Validar Cantidad
    if (!cantidadInput || !cantidadInput.value || parseFloat(cantidadInput.value) <= 0) {
        isValid = false;
        errors.push("Introduce una cantidad válida.");
        if(cantidadInput) cantidadInput.classList.add('input-error');
    } else {
        if(cantidadInput) cantidadInput.classList.remove('input-error');
    }

    // 3. Validar Concepto (Solo si no es traspaso)
    if (tipo !== 'traspaso') {
        if (!conceptoSelect || !conceptoSelect.value) {
            isValid = false;
            errors.push("Selecciona una categoría.");
            // Intentamos marcar el selector visual si existe
            const trigger = document.getElementById('concepto-trigger');
            if (trigger) trigger.style.borderColor = 'var(--c-error)';
        } else {
             const trigger = document.getElementById('concepto-trigger');
             if (trigger) trigger.style.borderColor = '';
        }
    }

    // 4. Validar Cuentas
    if (tipo === 'traspaso') {
        if (!cuentaOrigen || !cuentaOrigen.value) {
            isValid = false;
            errors.push("Falta cuenta origen.");
        }
        if (!cuentaDestino || !cuentaDestino.value) {
            isValid = false;
            errors.push("Falta cuenta destino.");
        }
        if (cuentaOrigen && cuentaDestino && cuentaOrigen.value === cuentaDestino.value) {
            isValid = false;
            errors.push("Las cuentas deben ser diferentes.");
        }
    } else {
        // Ingreso o Gasto
        if (!cuentaSelect || !cuentaSelect.value) {
            isValid = false;
            errors.push("Selecciona una cuenta.");
        }
    }

    // 5. Mostrar errores si los hay
    if (!isValid) {
        showToast(errors[0], 'error');
        hapticFeedback('error');
    }

    return isValid;
};
 

// --- REGISTRO DEL SERVICE WORKER ---
// Comprobamos si el navegador soporta Service Workers
// Registro del Service Worker para soporte Offline y PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(registration => {
        console.log('Service Worker registrado con éxito:', registration.scope);
      })
      .catch(error => {
        console.log('Fallo en el registro del Service Worker:', error);
      });
  });
 }
const initSpeedDial = () => {
    const container = document.getElementById('fab-container');
    const trigger = document.getElementById('fab-trigger');
    const backdrop = document.getElementById('fab-backdrop');
    const options = document.querySelectorAll('.fab-option');

    if (!container || !trigger) return;

    const openMenu = () => {
        container.classList.add('active');
        hapticFeedback('medium');
    };

    const closeMenu = () => {
        container.classList.remove('active');
    };

    trigger.onclick = (e) => {
        e.stopPropagation();
        container.classList.contains('active') ? closeMenu() : openMenu();
    };

    if (backdrop) backdrop.onclick = closeMenu;

    options.forEach(btn => {
        btn.onclick = (e) => {
            const type = btn.dataset.type;
            closeMenu();
            setTimeout(() => startMovementForm(null, false, type), 200);
        };
    });
};

/* ================================================================= */
/* === EXTRACTO PATRIMONIO (Global + Fechas) === */
/* ================================================================= */

// Variables de estado para el filtro (se reinician al salir)
let extractoState = {
    startDate: '', // Vacío = Sin límite
    endDate: ''
};

// Función principal para renderizar la página/modal de extracto
const renderPagePatrimonioExtracto = () => {
    const container = document.getElementById('patrimonio-extracto-container'); // Asegúrate de tener este contenedor en tu HTML o créalo dinámicamente
    if (!container) return; // O maneja la creación del modal aquí

    // 1. HEADER DE FILTROS (HTML)
    const filtersHtml = `
        <div class="extracto-filter-bar">
            <div class="date-input-group">
                <label class="date-input-label">DESDE</label>
                <input type="date" id="ext-date-start" class="styled-date-input" value="${extractoState.startDate}">
            </div>
            <div class="date-input-group">
                <label class="date-input-label">HASTA</label>
                <input type="date" id="ext-date-end" class="styled-date-input" value="${extractoState.endDate}">
            </div>
        </div>
        <div id="extracto-list-content" style="padding-bottom: 80px;">
            </div>
    `;

    container.innerHTML = filtersHtml;

    // 2. LISTENERS PARA LOS INPUTS (Reactividad)
    const startInput = document.getElementById('ext-date-start');
    const endInput = document.getElementById('ext-date-end');

    const handleFilterChange = () => {
        extractoState.startDate = startInput.value;
        extractoState.endDate = endInput.value;
        updateExtractoList(); // Redibujar lista
    };

    startInput.addEventListener('change', handleFilterChange);
    endInput.addEventListener('change', handleFilterChange);

    // 3. RENDERIZADO INICIAL DE LA LISTA
    updateExtractoList();
};

// Función auxiliar para filtrar y pintar la lista
const updateExtractoList = () => {
    const listContainer = document.getElementById('extracto-list-content');
    if (!listContainer) return;

    // A. OBTENER Y FILTRAR MOVIMIENTOS
    // "Por defecto todos los movimientos de cualquier cuenta" -> Usamos db.movimientos completo
    let movs = [...(db.movimientos || [])];

    // Filtro por Fecha (Desde)
    if (extractoState.startDate) {
        movs = movs.filter(m => m.fecha.split('T')[0] >= extractoState.startDate);
    }
    
    // Filtro por Fecha (Hasta)
    if (extractoState.endDate) {
        movs = movs.filter(m => m.fecha.split('T')[0] <= extractoState.endDate);
    }

    // Ordenar: Más reciente primero
    movs.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    // B. GENERAR HTML DE LA LISTA
    if (movs.length === 0) {
        listContainer.innerHTML = `
            <div style="text-align:center; padding: 40px; opacity: 0.5;">
                <span class="material-icons" style="font-size: 48px; color: var(--c-outline);">event_busy</span>
                <p>No hay movimientos en estas fechas.</p>
            </div>`;
        return;
    }

    let html = '';
    let lastDate = '';

    movs.forEach(m => {
        // Cabecera de fecha (Agrupación simple)
        const dateKey = m.fecha.split('T')[0];
        if (dateKey !== lastDate) {
            const dateObj = new Date(m.fecha);
            const dateStr = dateObj.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
            html += `
                <div style="padding: 10px 20px; background: var(--c-background); color: var(--c-primary); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; position:sticky; top: 73px; z-index:5; border-bottom:1px solid var(--c-outline);">
                    ${dateStr}
                </div>`;
            lastDate = dateKey;
        }

        // Renderizado de la Tarjeta (Reutilizando tu estilo existente)
        // Nota: Usamos una versión simplificada de renderVirtualListItem para este contexto
        const cantidadClass = m.cantidad < 0 ? 'text-negative' : 'text-positive';
        const symbol = m.cantidad < 0 ? '' : '+';
        
        // Obtener nombres (Cuenta y Concepto)
        const cuenta = db.cuentas.find(c => c.id === m.cuentaId)?.nombre || 'Cuenta';
        const concepto = db.conceptos.find(c => c.id === m.conceptoId)?.nombre || 'Varios';

        html += `
            <div class="transaction-card" style="margin: 0; border-radius: 0; border-bottom: 1px solid var(--c-outline);">
                <div class="transaction-card__content">
                    <div class="transaction-card__details">
                        <div class="transaction-card__row-1">${m.descripcion || concepto}</div>
                        <div class="transaction-card__row-2" style="opacity:0.7;">${cuenta} • ${concepto}</div>
                    </div>
                    <div class="transaction-card__figures">
                        <strong class="${cantidadClass}" style="font-size: 1rem;">
                            ${symbol}${formatCurrencyHTML(m.cantidad)}
                        </strong>
                    </div>
                </div>
            </div>
        `;
    });

    listContainer.innerHTML = html;
};


/* ================================================================ */
/* === LÓGICA DE ICONOS DE DIARIO (PEGAR AL FINAL DE MAIN.JS) === */
/* ================================================================ */

// 1. Función para cambiar la vista (Lista <-> Compacta)
window.toggleDiarioView = function(btnElement) {
    const diarioContainer = document.getElementById('diario-page') || document.body;
    const icono = btnElement.querySelector('.material-icons');
    
    // Alternar clase
    diarioContainer.classList.toggle('view-mode-compact');
    
    // Cambiar icono
    if (diarioContainer.classList.contains('view-mode-compact')) {
        icono.textContent = 'view_list'; // Icono de lista
        console.log("Vista cambiada a: Compacta");
    } else {
        icono.textContent = 'grid_view'; // Icono de cuadrícula/normal
        console.log("Vista cambiada a: Normal");
    }
};

// ===============================================================
// === GESTOR DE CLICS BLINDADO (SOLUCIÓN FINAL ERROR DATASET) ===
// ===============================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // Solo activamos un escuchador global para toda la app
    document.body.addEventListener('click', (event) => {
        
        // --- ZONA 1: MOVIMIENTOS Y TARJETAS (Editar) ---
        // Buscamos si el clic fue en algo que parece un movimiento
        const movCard = event.target.closest('.transaction-card, [data-action="open-movement-form"], [data-action="edit-movement-from-list"]');
        
        // ¡ESCUDO DEFENSIVO 1!
        // Si hemos encontrado una tarjeta válida...
        if (movCard) {
            // Verificamos con cuidado si tiene dataset
            if (!movCard.dataset) return; 

            const id = movCard.getAttribute('data-id') || movCard.dataset.id;
            const type = movCard.dataset.type;

            // Si tiene ID, es editar.
            if (id) {
                event.stopPropagation(); // Frenar otros eventos
                
                // Cerrar buscadores si estorban
                const buscador = document.getElementById('global-search-modal');
                if (buscador) buscador.classList.remove('active');

                console.log("Editando movimiento:", id);
                if (typeof startMovementForm === 'function') startMovementForm(id);
                return; // Importante: Parar aquí
            } 
            // Si tiene Type (botón flotante nuevo), es crear.
            else if (type) {
                if (typeof startMovementForm === 'function') startMovementForm(null, type);
                return;
            }
        }

        // --- ZONA 2: NAVEGACIÓN INTELIGENTE ---
        const navBtn = event.target.closest('[data-action="ver-balance-neto"], [data-action="ver-inversiones"], [data-action="ver-flujo-caja"]');

        if (navBtn) {
            const action = navBtn.dataset.action;

            // 1. Ir a la pestaña Planificar
            if (typeof navigateTo === 'function') navigateTo('planificar-page');
            
            // 2. Configurar destino
            let targetID = '';
            if (action === 'ver-flujo-caja') targetID = 'acordeon-flujo-caja';
            else if (action === 'ver-balance-neto') targetID = 'patrimonio-overview-container';
            else if (action === 'ver-inversiones') targetID = 'acordeon-portafolio';

            // 3. Buscar, Abrir y Dibujar
            setTimeout(() => {
                const destino = document.getElementById(targetID);
                if (destino) {
                    if (destino.tagName === 'DETAILS') {
                        destino.open = true; // Abrir acordeón
                        // Dibuja el gráfico si es necesario
                        if (action === 'ver-flujo-caja' && typeof renderInformeDetallado === 'function') {
                            renderInformeDetallado('flujo_caja');
                        }
                    }
                    destino.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
            return;
        }

        // --- ZONA 3: LISTA DE INVERSIONES (El historial que añadimos antes) ---
        // Si pulsas en una fila de la lista de inversiones
        const rowInversion = event.target.closest('[onclick^="openInvestmentHistory"]');
        // Este caso ya lo maneja el propio HTML con el onclick, así que no hacemos nada aquí
        // para no interferir, pero evitamos que lance errores.

    });
});

/* ================================================================= */
/* === LÓGICA DE ENLACE: FILTROS Y VISTAS DE DIARIO === */
/* ================================================================= */

// Variable Global para controlar la vista (Por defecto: Lista)
// Opciones: 'list' (Lista simple) | 'date' (Agrupado por Fechas)
window.currentDiarioView = 'list'; 

// --- 1. FUNCIÓN PARA EL BOTÓN DE FILTRO ---
window.openDiarioFilters = function() {
    const modal = document.getElementById('diario-filters-modal');
    if (modal) {
        modal.style.display = 'flex';
        // Pequeño retardo para permitir la animación CSS
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        console.log("Abriendo filtros de diario...");
    } else {
        console.error("ERROR: No se encuentra el modal con id='diario-filters-modal' en index.html");
        alert("Error: Falta el formulario de filtros en el HTML");
    }
};

// --- 2. FUNCIÓN PARA EL BOTÓN DE VISTA ---
window.toggleDiarioView = function(btnElement) {
    const icono = btnElement.querySelector('.material-icons');
    
    // A) CAMBIAR EL ESTADO
    if (window.currentDiarioView === 'list') {
        // Cambiamos a VISTA POR FECHA
        window.currentDiarioView = 'date';
        if (icono) icono.textContent = 'list'; // Ponemos icono de lista para volver
        console.log("Cambiando a Vista: AGRUPADA POR FECHA");
    } else {
        // Volvemos a VISTA DE LISTA
        window.currentDiarioView = 'list';
        if (icono) icono.textContent = 'calendar_month'; // Ponemos icono de calendario
        console.log("Cambiando a Vista: LISTA SIMPLE");
    }

    // B) EJECUTAR EL CAMBIO (RE-RENDERIZAR)
    // Aquí llamamos a tu función principal que pinta la lista.
    // Buscamos las funciones más probables en tu código.
    if (typeof renderDiario === 'function') {
        renderDiario(); 
    } else if (typeof renderMovements === 'function') {
        renderMovements();
    } else if (typeof updateDiarioList === 'function') {
        updateDiarioList();
    } else {
        console.warn("AVISO: No encontré la función 'renderDiario'. Asegúrate de que tu función de pintar lista lea la variable window.currentDiarioView");
    }
};

// ===============================================================
// === NUEVA HERRAMIENTA: ABRIR HISTORIAL DE INVERSIÓN ===
// ===============================================================
window.openInvestmentHistory = (cuentaId) => {
    // 1. Buscamos la cuenta y sus movimientos
    const cuenta = db.cuentas.find(c => c.id === cuentaId);
    if (!cuenta) return;

    // Filtramos movimientos donde esta cuenta participe
    const movs = db.movimientos.filter(m => 
        m.cuentaId === cuentaId || m.cuentaOrigenId === cuentaId || m.cuentaDestinoId === cuentaId
    );

    // Ordenamos: El más nuevo arriba
    movs.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    // 2. Generamos el HTML de la lista
    let listHtml = `<div style="display: flex; flex-direction: column; gap: 10px;">`;

    if (movs.length === 0) {
        listHtml += `<p style="opacity: 0.6; text-align: center; padding: 20px;">No hay movimientos registrados.</p>`;
    } else {
        listHtml += movs.map(m => {
            const date = new Date(m.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' });
            
            // === LÓGICA HOMOGÉNEA DE COLORES ===
            // Aquí ya no decidimos colores, decidimos "Clases" basadas en el rol.
            
            let claseColor = ''; 
            let signo = '';

            if (m.tipo === 'gasto') {
                claseColor = 'text-gasto'; // Usamos la clase maestra (Rojo por defecto)
                signo = '-';
            } else if (m.tipo === 'ingreso') {
                claseColor = 'text-ingreso'; // Usamos la clase maestra (Verde por defecto)
                signo = '+';
            } else if (m.tipo === 'traspaso') {
                claseColor = 'text-traspaso'; // Usamos la clase maestra (Azul por defecto)
                // En traspasos, el signo depende de si sale o entra de ESTA cuenta
                if (m.cuentaOrigenId === cuentaId) {
                    signo = '-'; // Sale dinero
                } else {
                    signo = '+'; // Entra dinero
                }
            }

            const conceptoObj = db.conceptos.find(c => c.id === m.conceptoId);
            const titulo = m.tipo === 'traspaso' ? 'Traspaso' : (conceptoObj?.nombre || 'Movimiento');

            return `
            <div class="card" data-action="open-movement-form" data-id="${m.id}" style="padding: 12px; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                <div>
                    <div style="font-weight: 600; font-size: 0.95rem;">${titulo}</div>
                    <div style="font-size: 0.8rem; color: var(--c-on-surface-secondary); margin-top: 2px;">${date} • ${m.descripcion || ''}</div>
                </div>
                <div style="font-weight: 700;" class="${claseColor}">
                    ${signo}${formatCurrency(m.cantidad)}
                </div>
            </div>`;
        }).join('');
    }

    listHtml += `</div>`;

    // 3. Mostramos el Modal
    showGenericModal(`Historial: ${cuenta.nombre}`, listHtml);
};
// ===============================================================
// === 1. LÓGICA DEL LÁPIZ (Pedir Valor + Fecha Manualmente) ===
// ===============================================================
window.actualizarValorInversion = async (cuentaId, event) => {
    if (event) { event.stopPropagation(); event.preventDefault(); }

    // 1. Buscamos la cuenta en la memoria global
    const indice = db.cuentas.findIndex(c => c.id === cuentaId);
    if (indice === -1) return;
    const cuenta = db.cuentas[indice];

    // 2. Pedimos datos
    const nuevoValorStr = prompt(`Nuevo Valor para ${cuenta.nombre}:`, cuenta.saldo);
    if (nuevoValorStr === null) return;
    const nuevoValor = parseFloat(nuevoValorStr.replace(',', '.'));
    if (isNaN(nuevoValor)) { alert("Número inválido"); return; }

    // Truco: Si no escribes nada, usa la fecha de hoy
    const hoy = new Date();
    const fechaDefecto = `${hoy.getDate().toString().padStart(2,'0')}/${(hoy.getMonth()+1).toString().padStart(2,'0')}/${hoy.getFullYear()}`;
    const nuevaFecha = prompt("Fecha (DD/MM/AAAA):", cuenta.fechaValoracion || fechaDefecto);
    if (nuevaFecha === null) return;

    try {
        // 3. GUARDADO CRÍTICO (Actualizamos Firebase y FORZAMOS la memoria local)
        await fbDb.collection('users').doc(currentUser.uid).collection('cuentas').doc(cuentaId).update({
            saldo: nuevoValor,
            fechaValoracion: nuevaFecha
        });

        // AQUÍ ESTÁ LA CLAVE: Actualizamos el objeto original directamente
        db.cuentas[indice].saldo = nuevoValor;
        db.cuentas[indice].fechaValoracion = nuevaFecha;

        // Feedback visual inmediato
        alert(`✅ Guardado: ${nuevoValor}€ con fecha ${nuevaFecha}`);
        
        } catch (e) {
        console.error(e);
        alert("Error al guardar en la nube.");
    }
};

// ==========================================
// NUEVA FUNCIÓN MAESTRA: Crea una fila idéntica al Diario
// ==========================================
const createUnifiedRowHTML = (m) => {
    // 1. Preparar datos (Lógica extraída de renderVirtualListItem)
    const dateObj = new Date(m.fecha);
    const dateStr = dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    
    // Variables visuales
    let line1, line2, amountClass, amountSign, iconName, bubbleClass;
    
    const { cuentas, conceptos } = db; // Acceso directo a la base de datos global

    if (m.tipo === 'traspaso') {
        // --- ESTILO TRASPASO (MODIFICADO A MORADO) ---
        bubbleClass = 't-bubble--transfer'; // Burbuja gris/neutra
        iconName = 'swap_horiz';

        const origen = cuentas.find(c => c.id === m.cuentaOrigenId)?.nombre || 'Origen';
        const destino = cuentas.find(c => c.id === m.cuentaDestinoId)?.nombre || 'Destino';
        
        // AQUÍ EL CAMBIO: Añadimos style="color: var(--c-info)" para forzar el morado
        // También ponemos font-weight: 500 para que se lea mejor el color
        line1 = `<span class="t-date-badge">${dateStr}</span> <span style="color: var(--c-info); font-weight: 500;">De: ${escapeHTML(origen)}</span>`;
        line2 = `<span style="color: var(--c-info); font-weight: 500;">A: ${escapeHTML(destino)}</span>`;
        
        amountClass = 'text-info'; // Esta clase ya ponía el importe en morado
        amountSign = '';
    } else {
        // --- ESTILO GASTO / INGRESO ---
        const isGasto = m.cantidad < 0;
        
        // CORRECCIÓN: Usamos las variables EXACTAS de tu style.css
        // isGasto -> Rojo (--c-danger)
        // No Gasto -> Verde (--c-success)
        const accountColor = isGasto ? 'var(--c-danger)' : 'var(--c-success)';

        bubbleClass = isGasto ? 't-bubble--expense' : 't-bubble--income';
        iconName = isGasto ? 'arrow_downward' : 'arrow_upward';

        const concepto = conceptos.find(c => c.id === m.conceptoId);
        const conceptoNombre = concepto ? concepto.nombre : 'Varios';
        const cuentaObj = cuentas.find(c => c.id === m.cuentaId);
        const nombreCuenta = cuentaObj ? cuentaObj.nombre : 'Cuenta';
        
        line1 = `<span class="t-date-badge">${dateStr}</span> <span class="t-concept">${escapeHTML(conceptoNombre)}</span>`;
        
        const desc = m.descripcion && m.descripcion !== conceptoNombre ? m.descripcion : '';
        const separator = desc ? ' • ' : '';
        
        // APLICAMOS EL COLOR:
        // style="color: ${accountColor}" -> Pinta el texto
        // style="border-color: ${accountColor}" -> Pinta el borde (si la clase t-account-badge tiene borde)
        line2 = `<span class="t-account-badge" style="color: ${accountColor}; border-color: ${accountColor}; font-weight: 600;">${escapeHTML(nombreCuenta)}</span>${separator}${escapeHTML(desc)}`;
        
        // El importe usa las clases de texto que ya tienes configuradas
        amountClass = isGasto ? 'text-negative' : 'text-positive';
        amountSign = isGasto ? '' : '+';
    }

    // 2. Generar HTML (Estructura exacta del Diario)
    return `
    <div class="t-card list-item-animate" data-id="${m.id}" data-action="edit-movement-from-list" style="cursor:pointer;">
        
        <div class="t-icon-bubble ${bubbleClass}">
            <span class="material-icons">${iconName}</span>
        </div>
        
        <div class="t-content">
            <div class="t-row-primary">
                <div class="t-line-1">${line1}</div>
                <div class="t-amount ${amountClass}">${amountSign}${formatCurrencyHTML(m.cantidad)}</div>
            </div>
            <div class="t-row-secondary">
                <div class="t-line-2">${line2}</div>
                ${m.runningBalance !== undefined ? `<div class="t-running-balance">${formatCurrencyHTML(m.runningBalance)}</div>` : ''}
            </div>
        </div>
    </div>`;
};

// =========================================================
// 🛡️ SOLUCIÓN COMITÉ (ADAPTADA A TU CÓDIGO REAL)
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    // Buscamos el botón real que está en tu index.html
    const btnBorrar = document.getElementById('delete-movimiento-btn');

    if (btnBorrar) {
        // Le quitamos cualquier evento anterior para evitar duplicados
        const nuevoBtn = btnBorrar.cloneNode(true);
        btnBorrar.parentNode.replaceChild(nuevoBtn, btnBorrar);

        // Añadimos el evento "Click" directo y robusto
        nuevoBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            // 1. Obtenemos el ID del movimiento del input oculto que usa tu formulario
            const idInput = document.getElementById('movimiento-id');
            const idToDelete = idInput ? idInput.value : null;
            
            // 2. Detectamos si es recurrente (tu código usa un dataset para esto)
            const isRecurrent = nuevoBtn.dataset.isRecurrent === 'true';

            if (!idToDelete) {
                showToast("Error: No se encuentra el ID del movimiento.", "danger");
                return;
            }

            // 3. Usamos tu propia función de confirmación
            const mensaje = isRecurrent ? '¿Eliminar operación recurrente?' : '¿Eliminar movimiento permanentemente?';
            
            showConfirmationModal(mensaje, async () => {
                // Cerramos el modal primero
                const modal = document.getElementById('movimiento-modal');
                if (modal) modal.classList.remove('modal-overlay--active');
                
                // 4. Llamamos a tu función de borrado existente que ya funciona bien
                await deleteMovementAndAdjustBalance(idToDelete, isRecurrent);
            });
        });
        
        console.log("✅ Botón de borrar reparado y vinculado.");
    }
});

// --- PARCHE DE SEGURIDAD PARA MODALES ---
// Esto mueve el modal de confirmación al final del <body> para que nada lo tape
document.addEventListener('DOMContentLoaded', () => {
    const confirmModal = document.getElementById('confirmation-modal');
    if (confirmModal) {
        document.body.appendChild(confirmModal);
        console.log("🛡️ Modal de confirmación movido al body para evitar bloqueos.");
    }
});


/* ================================================================
   SISTEMA DE NAVEGACIÓN INTELIGENTE (Versión Acordeones)
   Sustituye las funciones anteriores por estas
   ================================================================ */

// Función auxiliar: Busca el acordeón, lo abre y viaja hasta él
function openAccordionWhenReady(targetId, containerId) {
    let attempts = 0;
    const maxAttempts = 20; // Intentará durante 2 segundos
    
    const interval = setInterval(() => {
        attempts++;
        
        // 1. Buscamos el elemento objetivo
        // Puede ser el <details> directo (targetId) o un div dentro de él (containerId)
        let targetElement = null;
        if (targetId) targetElement = document.getElementById(targetId);
        else if (containerId) {
            const inner = document.getElementById(containerId);
            if (inner) targetElement = inner.closest('details');
        }

        // 2. Si lo encuentra, ¡MAGIA!
        if (targetElement) {
            clearInterval(interval);
            
            // A. Abrir el acordeón si está cerrado
            if (!targetElement.open) {
                targetElement.open = true;
                
                // Disparamos evento 'toggle' manualmente por si hay gráficas que cargan al abrir
                targetElement.dispatchEvent(new Event('toggle'));
            }

            // B. Viajar hasta él (Scroll suave)
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // C. Efecto visual (Flash) para que sepas qué estás mirando
                targetElement.style.transition = 'all 0.5s ease';
                targetElement.style.boxShadow = '0 0 0 2px var(--c-primary)';
                setTimeout(() => targetElement.style.boxShadow = 'none', 1000);
                
                console.log("✅ Sección abierta y enfocada.");
            }, 100); // Pequeña pausa para que el navegador renderice la apertura
        } 
        
        // 3. Si se agota el tiempo, paramos
        if (attempts >= maxAttempts) clearInterval(interval);
        
    }, 100); // Revisa cada 100ms
}

// --- FUNCIÓN 1: IR A PATRIMONIO ---
window.goToPatrimonioChart = function() {
    console.log("🚀 Viajando al gráfico de Patrimonio...");
    if (typeof hapticFeedback === 'function') hapticFeedback('medium');

    // 1. Navegar a la pestaña 'Planificar' (Análisis)
    const tabBtn = document.querySelector('button[data-page="planificar-page"]');
    if (tabBtn) tabBtn.click();

    // 2. Buscar el contenedor del gráfico de patrimonio y abrir su acordeón padre
    // En tu código, el gráfico de patrimonio está dentro de id="patrimonio-overview-container"
    openAccordionWhenReady(null, 'patrimonio-overview-container');
};

// --- FUNCIÓN 2: IR A INVERSIONES ---
window.goToInversionesChart = function() {
    console.log("🚀 Viajando al gráfico de Inversiones...");
    if (typeof hapticFeedback === 'function') hapticFeedback('medium');

    // 1. Navegar a la pestaña 'Planificar'
    const tabBtn = document.querySelector('button[data-page="planificar-page"]');
    if (tabBtn) tabBtn.click();

    // 2. Buscar el acordeón de portafolio directamente
    // En tu código, este acordeón tiene id="acordeon-portafolio"
    openAccordionWhenReady('acordeon-portafolio', null);
};

/* ================================================================
   FUNCIÓN DE ANIMACIÓN (Pegar al final de main.js)
   ================================================================ */
function animateTransfer(valor) {
    // 1. Origen (Pantalla Calculadora) y Destino (Input Cantidad)
    const source = document.getElementById('calculator-display') || document.querySelector('.calc-current');
    const target = document.getElementById('movimiento-cantidad');
    
    if (!source || !target) return;

    // 2. Crear el clon que vuela
    const flyer = document.createElement('div');
    flyer.textContent = valor;
    flyer.className = 'flying-number'; // Importante: Clase definida en CSS
    document.body.appendChild(flyer);

    // 3. Calcular posiciones
    const sRect = source.getBoundingClientRect();
    const tRect = target.getBoundingClientRect();
    
    // Posición inicial (Centro de la pantalla negra)
    flyer.style.top = (sRect.top + sRect.height/2 - 20) + 'px';
    flyer.style.left = (sRect.left + sRect.width/2 - 40) + 'px';

    // 4. Animar
    const anim = flyer.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${tRect.left - sRect.left}px, ${tRect.top - sRect.top}px) scale(0.5)`, opacity: 0.5 }
    ], {
        duration: 500,
        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
    });

    // 5. Limpieza al terminar
    anim.onfinish = () => {
        flyer.remove();
        // Flash verde en el destino
        target.style.transition = 'background 0.3s';
        target.style.backgroundColor = 'rgba(45, 204, 205, 0.3)';
        setTimeout(() => target.style.backgroundColor = '', 300);
    };
}

// --- HERRAMIENTA DE COLORES DINÁMICOS ---
const updateKpiVisual = (elementId, value, isPercentage = false) => {
    const el = document.getElementById(elementId);
    if (!el) return;

    // 1. Decidir el color (Verde = Positivo, Rojo = Negativo)
    // Nota: Si es 0, se quedará verde (positive)
    let colorClass = 'text-positive';
    if (value < 0) colorClass = 'text-negative';
    
    // 2. Limpiar colores antiguos y poner el nuevo
    el.classList.remove('text-positive', 'text-negative', 'text-warning');
    el.classList.add(colorClass);

    // 3. Animar el número
    if (isPercentage) {
        // Para porcentajes (%)
        animateCountUp(el, value, 1000, false, '', '%');
    } else {
        // Para dinero (€)
        animateCountUp(el, value, 1000, true);
    }
};

// ==========================================
// 🚀 INTEGRACIÓN CALCULADORA FUSION (v1.0)
// ==========================================

let inputDestinoCalculadora = null; // Aquí guardaremos qué campo pidió el número

// Función para abrir el portal
function abrirCalculadoraFusion(inputElement) {
    inputDestinoCalculadora = inputElement;
    const portal = document.getElementById('fusion-calc-container');
    
    if (portal) {
        // Mostramos la calculadora deslizando hacia arriba
        portal.style.transform = 'translateY(0)';
    }
}

// Función para cerrar el portal
function cerrarCalculadoraFusion() {
    const portal = document.getElementById('fusion-calc-container');
    if (portal) {
        // Ocultamos deslizando hacia abajo
        portal.style.transform = 'translateY(100%)';
    }
}

// ESCUCHADOR DE MENSAJES (El puente entre calc.html y index.html)
window.addEventListener('message', function(event) {
    // Verificamos que el mensaje sea el correcto
    if (event.data && event.data.type === 'CALCULATOR_RESULT') {
        let resultado = event.data.value; // Viene con punto (ej: 89.23)
        
        console.log("💰 Resultado original:", resultado);

        if (inputDestinoCalculadora) {
            // TRUCO DE MAGIA: Cambiamos el punto por coma
            // Esto es vital para que tu formulario español lo entienda bien
            resultado = resultado.toString().replace('.', ',');
            
            console.log("🇪🇸 Resultado traducido:", resultado);

            // 1. Escribimos el valor con COMA en el campo
            inputDestinoCalculadora.value = resultado;
            
            // 2. Avisamos a la app que el valor ha cambiado
            inputDestinoCalculadora.dispatchEvent(new Event('input', { bubbles: true }));
            inputDestinoCalculadora.dispatchEvent(new Event('change', { bubbles: true }));
            
            // 3. Efecto visual de confirmación (Flash verde suave)
            inputDestinoCalculadora.style.transition = 'background-color 0.3s';
            inputDestinoCalculadora.style.backgroundColor = 'rgba(0, 255, 157, 0.2)';
            setTimeout(() => inputDestinoCalculadora.style.backgroundColor = '', 300);
        }
        
        // 4. Cerramos la calculadora automáticamente
        cerrarCalculadoraFusion();
		 // 5. ¡SALTO AUTOMÁTICO! Enfocamos el siguiente campo (Concepto)
        setTimeout(() => {
            const campoConcepto = document.getElementById('movimiento-concepto');
            if (campoConcepto) {
                campoConcepto.focus();
                // Si es un desplegable custom, intentamos abrirlo (opcional)
                // campoConcepto.click(); 
            }
        }, 300); // Pequeña pausa para dar tiempo a la animación de cierre
    }
});

// ==========================================
// 🕵️ EL SUPER VIGILANTE (Versión Automática)
// ==========================================

// Escuchamos 'focusin' (entrar) y 'click' (tocar) para que no se escape nada
['focusin', 'click'].forEach(tipoEvento => {
    document.addEventListener(tipoEvento, function(e) {
        // Verificamos si el objetivo es nuestro campo de cantidad
        if (e.target && e.target.id === 'movimiento-cantidad') {
            
            // Evitamos que se dispare múltiples veces seguidas si ya está abierta
            if (document.getElementById('fusion-calc-container').style.transform === 'translateY(0px)') {
                return;
            }

            console.log(`⚡ Evento ${tipoEvento} detectado en CANTIDAD - Abriendo...`);
            
            // 1. SEGURIDAD ANTI-TECLADO NATIVO
            // Le ponemos el atributo readonly al vuelo. Esto mata el teclado del móvil.
            e.target.setAttribute('readonly', 'true'); 
            
            // Además, le quitamos el foco inmediatamente por si acaso
            e.target.blur(); 
            
            // 2. Abrimos la Calculadora Fusion
            abrirCalculadoraFusion(e.target);
        }
    }, true); // UseCapture: true para interceptarlo antes que nadie
});

// ===============================================================
// 📡 RADAR VISUAL DE FECHAS (Edición Amarillo Brillante)
// ===============================================================

const initStickyRadar = () => {
    const listContainer = document.querySelector('.virtual-list-container') || document.getElementById('lista-movimientos') || document.querySelector('#view-movimientos .scroll-container');
    if (!listContainer) return; 

    let stickyBar = document.getElementById('sticky-radar-bar');
    if (!stickyBar) {
        stickyBar = document.createElement('div');
        stickyBar.id = 'sticky-radar-bar';
        
        // CSS IDÉNTICO AL HEADER (Degradado Azul)
        stickyBar.style.cssText = `
            position: absolute;
            top: 0; left: 0; width: 100%; height: 52px; 
            
            background-image: linear-gradient(135deg, #000428 0%, #004e92 100%) !important;
            background-color: #000428 !important;

            border-bottom: 1px solid rgba(0,0,0,0.5);
            border-top: 1px solid rgba(255,255,255,0.15);
            
            display: flex; 
            align-items: center; 
            justify-content: space-between;
            padding: 0 16px; 
            box-sizing: border-box;
            z-index: 500;
            pointer-events: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            transition: opacity 0.1s;
        `;
        listContainer.parentElement.style.position = 'relative'; 
        listContainer.parentElement.appendChild(stickyBar);
    }

    const scanList = () => {
        const rect = listContainer.getBoundingClientRect();
        const scanX = rect.left + 20; 
        const scanY = rect.top + 50; 

        stickyBar.style.pointerEvents = 'none';
        let element = document.elementFromPoint(scanX, scanY);
        
        let foundDate = null;
        let foundTotal = null;

        while (element && element !== document.body) {
            if (element.hasAttribute('data-fecha')) {
                foundDate = element.getAttribute('data-fecha');
                if(element.hasAttribute('data-total')) foundTotal = element.getAttribute('data-total');
                break;
            }
            element = element.parentElement;
        }

        if (foundDate) {
            stickyBar.style.opacity = '1';
            
            const dateObj = new Date(foundDate + 'T12:00:00Z');
            const day = dateObj.getDate().toString().padStart(2, '0');
            let month = dateObj.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '');
            month = month.charAt(0).toUpperCase() + month.slice(1);
            const year = dateObj.getFullYear();
            
            let totalHtml = '';
            if (foundTotal) {
                const totalVal = parseFloat(foundTotal);
                // Amarillo si positivo, Naranja si negativo
                const totalColor = totalVal < 0 ? 'var(--c-warning)' : '#FFD700';
                totalHtml = `
                <span style="
                    color: ${totalColor}; 
                    font-weight: 700; 
                    font-family: monospace; 
                    font-size: 1rem;
                    text-shadow: 0 2px 2px rgba(0,0,0,0.8);
                ">
                    ${formatCurrencyHTML(totalVal)}
                </span>`;
            } else {
                 totalHtml = `<span style="opacity:0;">...</span>`; 
            }

            stickyBar.innerHTML = `
                <div style="display: flex; align-items: baseline; gap: 6px; text-shadow: 0 2px 2px rgba(0,0,0,0.8);">
                    <span style="font-size: 1.2rem; font-weight: 800; color: #FFD700; letter-spacing: -0.5px;">${day}</span>
                    <span style="font-size: 1rem; font-weight: 600; text-transform: capitalize; color: #FFD700; opacity: 0.9;">${month}</span>
                    <span style="font-size: 0.9rem; font-weight: 400; color: #FFD700; opacity: 0.7;">${year}</span>
                </div>

                ${totalHtml}
            `;
        } else {
            stickyBar.style.opacity = '0'; 
        }
    };

    listContainer.removeEventListener('scroll', scanList);
    listContainer.addEventListener('scroll', scanList);
    scanList(); 
};

if(document.querySelector('.virtual-list-container')) initStickyRadar();

// ====================================================================
// ===  IMPORTADOR MAESTRO CSV V5.0 (Protocolo Nuclear + Traspasos) ===
// ====================================================================

const handleImportCSV = async (file) => {
    if (!file) return;

    // --- 1. ZONA DE SEGURIDAD (DOBLE CONFIRMACIÓN) ---
    const confirm1 = confirm("⚠️ ¡ATENCIÓN DANI! ⚠️\n\nEsta acción BORRARÁ TODOS los datos actuales de la aplicación (Movimientos, Cuentas y Categorías) para empezar de cero con este archivo.\n\n¿Estás seguro de que quieres continuar?");
    if (!confirm1) return;

    const confirm2 = confirm("🚨 ÚLTIMO AVISO 🚨\n\nUna vez borrados, los datos antiguos NO se pueden recuperar.\n\n¿Confirmas el BORRADO TOTAL y la importación?");
    if (!confirm2) return;

    // --- 2. PREPARACIÓN VISUAL ---
    const updateStatus = (msg) => {
        const el = document.getElementById('import-status-text');
        if (el) el.innerText = msg;
    };

    showGenericModal('Reiniciando Sistema...', 
        '<div style="text-align:center; padding:30px;">' +
        '<span class="spinner"></span>' +
        '<p id="import-status-text" style="margin-top:15px; font-weight:bold; color: var(--c-danger);">Iniciando protocolo de limpieza...</p>' +
        '</div>'
    );

    // --- 3. EL BORRADO (THE PURGE) ---
    const deleteCollection = async (collectionName) => {
        const ref = fbDb.collection('users').doc(currentUser.uid).collection(collectionName);
        const snapshot = await ref.get();
        if (snapshot.size === 0) return;

        const batchSize = 400;
        let batch = fbDb.batch();
        let count = 0;

        for (const doc of snapshot.docs) {
            batch.delete(doc.ref);
            count++;
            if (count >= batchSize) {
                await batch.commit();
                batch = fbDb.batch();
                count = 0;
            }
        }
        if (count > 0) await batch.commit();
    };

    try {
        updateStatus("🗑️ Eliminando Movimientos antiguos...");
        await deleteCollection('movimientos');
        
        updateStatus("🗑️ Eliminando Cuentas antiguas...");
        await deleteCollection('cuentas');
        
        updateStatus("🗑️ Eliminando Conceptos antiguos...");
        await deleteCollection('conceptos');

        // Limpiar memoria local para evitar fantasmas
        db.cuentas = [];
        db.conceptos = [];
        db.movimientos = [];

    } catch (error) {
        console.error("Error borrando:", error);
        alert("Error al borrar datos antiguos. Revisa tu conexión.");
        hideModal('generic-modal');
        return;
    }

    // --- 4. LA IMPORTACIÓN (COMO LA V4.0 PERO MÁS LISTA) ---
    const reader = new FileReader();
    reader.readAsText(file, 'ISO-8859-1');

    reader.onload = async (e) => {
        const text = e.target.result;
        const rows = text.split('\n').filter(r => r.trim().length > 0);
        const totalRows = rows.length - 1; 

        updateStatus(`🧠 Analizando ${totalRows} filas nuevas...`);
        
        // Mapas vacíos (hemos borrado todo)
        const cuentasMap = new Map(); 
        const conceptosMap = new Map();
        
        let batch = fbDb.batch();
        let batchCount = 0;
        let totalImported = 0;
        let opsInBatch = 0;

        for (let i = 1; i < rows.length; i++) {
            const cols = rows[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
            if (!cols || cols.length < 5) continue;

            // A. FECHA
            const [day, month, year] = cols[0].replace(/"/g, '').split('/');
            const isoDate = `${year}-${month}-${day}T12:00:00.000Z`;

            // B. CUENTA
            let cuentaNombreRaw = cols[1].replace(/"/g, '').trim();
            let cuentaObj = cuentasMap.get(cuentaNombreRaw.toLowerCase());
            let cuentaId = cuentaObj ? cuentaObj.id : null;

            if (!cuentaId) {
                const newCtaId = fbDb.collection('users').doc(currentUser.uid).collection('cuentas').doc().id;
                const propietario = cuentaNombreRaw.toUpperCase().startsWith('N') ? 'N' : 'D';
                const nuevaCuenta = {
                    id: newCtaId, nombre: cuentaNombreRaw, tipo: 'banco', saldo: 0, moneda: 'EUR', propietario: propietario, orden: 99
                };
                batch.set(fbDb.collection('users').doc(currentUser.uid).collection('cuentas').doc(newCtaId), nuevaCuenta);
                opsInBatch++;
                // Guardar en memoria temporal
                db.cuentas.push(nuevaCuenta);
                cuentasMap.set(cuentaNombreRaw.toLowerCase(), nuevaCuenta);
                cuentaId = newCtaId;
            }

            // C. CONCEPTO (DETECTAR TRASPASO)
            const conceptoNombreRaw = cols[2].replace(/"/g, '').trim();
            let conceptoId = conceptosMap.get(conceptoNombreRaw.toLowerCase());

            if (!conceptoId) {
                const newConceptId = fbDb.collection('users').doc(currentUser.uid).collection('conceptos').doc().id;
                
                // --- LÓGICA ESPECIAL TRASPASOS ---
                const esTraspaso = conceptoNombreRaw.toLowerCase().includes('traspaso');
                
                const nuevoConcepto = {
                    id: newConceptId,
                    nombre: conceptoNombreRaw,
                    // Si es traspaso icono flechas, si no etiqueta
                    icono: esTraspaso ? 'swap_horiz' : 'local_offer', 
                    // Si es traspaso gris oscuro, si no gris medio
                    color: esTraspaso ? '#4a4a4a' : '#808080',
                    // Si es traspaso tipo 'neutro' (para que no salga en gastos)
                    tipo: esTraspaso ? 'neutro' : 'gasto' 
                };

                batch.set(fbDb.collection('users').doc(currentUser.uid).collection('conceptos').doc(newConceptId), nuevoConcepto);
                opsInBatch++;
                
                db.conceptos.push(nuevoConcepto);
                conceptosMap.set(conceptoNombreRaw.toLowerCase(), newConceptId);
                conceptoId = newConceptId;
            }

            // D. IMPORTE
            let importeRaw = cols[3].replace(/"/g, '').replace(/\./g, '').replace(',', '.');
            const cantidad = Math.round(parseFloat(importeRaw) * 100); 
            const descripcion = cols[4].replace(/"/g, '').trim();

            // E. MOVIMIENTO
            const newMovId = fbDb.collection('users').doc(currentUser.uid).collection('movimientos').doc().id;
            const docRef = fbDb.collection('users').doc(currentUser.uid).collection('movimientos').doc(newMovId);
            
            // Si es traspaso, nos aseguramos que el tipo sea 'traspaso' a nivel de movimiento también
            const tipoMovimiento = conceptoNombreRaw.toLowerCase().includes('traspaso') ? 'traspaso' : 'movimiento';

            batch.set(docRef, {
                id: newMovId, fecha: isoDate, cuentaId: cuentaId, conceptoId: conceptoId,
                cantidad: cantidad, descripcion: descripcion, 
                tipo: tipoMovimiento, // 'traspaso' o 'movimiento'
                esRecurrente: false, validado: true
            });
            opsInBatch++;

            // F. SALDO
            const cuentaRef = fbDb.collection('users').doc(currentUser.uid).collection('cuentas').doc(cuentaId);
            batch.update(cuentaRef, { saldo: firebase.firestore.FieldValue.increment(cantidad) });
            opsInBatch++;

            totalImported++;

            if (opsInBatch >= 400) {
                updateStatus(`Guardando bloque ${batchCount + 1}... (${totalImported}/${totalRows})`);
                await batch.commit(); 
                batch = fbDb.batch(); 
                opsInBatch = 0;       
                batchCount++;
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }

        if (opsInBatch > 0) {
            updateStatus('Finalizando último bloque...');
            await batch.commit();
        }

        hideModal('generic-modal');
        showToast('¡Sistema Reiniciado e Importado!', 'success');
        
        // Recarga un poco más lenta para asegurar que Firebase digiera el borrado masivo
        setTimeout(() => window.location.reload(), 2000);
    };
};

// ===============================================================
// === FIX DEFINITIVO: DETECTOR DE ALTURA DE TECLADO (OnePlus) ===
// ===============================================================
const fixViewportHeight = () => {
    // 1. Preguntamos al navegador la altura REAL visible (sin teclado)
    const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    
    // 2. Guardamos ese valor en una variable CSS llamada '--kb-height'
    document.documentElement.style.setProperty('--kb-height', `${vh}px`);
    
    // 3. Forzamos un repintado suave para asegurar que se ajuste
    const modalActive = document.querySelector('.modal-overlay--active');
    if (modalActive) {
        modalActive.style.height = `${vh}px`;
    }
};

// Escuchamos activamente los cambios de tamaño (cuando sale el teclado)
if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', fixViewportHeight);
    window.visualViewport.addEventListener('scroll', fixViewportHeight);
}
window.addEventListener('resize', fixViewportHeight);

// Ejecutamos una vez al inicio por si acaso
fixViewportHeight();

/* ============================================== */
/* === GESTIÓN DE CONCEPTOS (Versión Blindada) === */
/* ============================================== */
const showManageConceptosModal = () => {
    // 1. Buscamos las piezas clave
    let modal = document.getElementById('generic-modal');
    let content = document.getElementById('generic-modal-content');
    let title = document.getElementById('generic-modal-title');

    // 2. DIAGNÓSTICO: Si falta CUALQUIER pieza interna, reconstruimos todo
    if (!modal || !content || !title) {
        console.log('🔧 Estructura rota detectada. Reconstruyendo ventana...');
        
        // Si la carcasa vieja existe pero está vacía, la borramos para no duplicar
        if (modal) modal.remove();

        // 3. CONSTRUCCIÓN DESDE CERO
        const modalHTML = `
        <div id="generic-modal" class="modal-overlay" style="z-index: 10000; display: flex; align-items: center; justify-content: center;">
            <div class="modal-content" style="background: var(--c-surface); padding: 20px; border-radius: 20px; width: 90%; max-width: 400px; max-height: 80vh; display: flex; flex-direction: column; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid var(--c-outline);">
                    <h3 id="generic-modal-title" style="margin:0; font-size: 1.2rem; color: var(--c-on-surface);">Título</h3>
                    <button class="icon-btn" onclick="document.getElementById('generic-modal').classList.remove('modal-overlay--active')" style="color: var(--c-on-surface);">
                        <span class="material-icons">close</span>
                    </button>
                </div>

                <div id="generic-modal-content" style="overflow-y: auto; flex: 1;"></div>
            </div>
        </div>`;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Re-asignamos las variables a los elementos nuevos
        modal = document.getElementById('generic-modal');
        content = document.getElementById('generic-modal-content');
        title = document.getElementById('generic-modal-title');
    }

    // 4. AHORA ES SEGURO: Configuramos el contenido
    title.textContent = 'Conceptos Rápidos';
    
    // Formulario LIMPIO (Sin iconos)
    content.innerHTML = `
        <div style="display: flex; gap: 10px; margin-bottom: 15px; align-items: center;">
            <input type="text" id="new-concepto-nombre" class="form-input" placeholder="Nuevo (ej: Gasolina)..." autocomplete="off" style="flex:1;">
            <button class="btn btn--primary" id="btn-add-concepto" style="width: 50px; display: flex; justify-content: center; align-items: center;">
                <span class="material-icons">add</span>
            </button>
        </div>
        
        <div id="conceptos-list" class="scroll-container" style="max-height: 400px; overflow-y: auto; padding-right: 5px;">
            </div>
    `;

    // 5. Función de borrado segura
    window.handleDeleteConcept = async (id) => {
        if(confirm('¿Borrar concepto?')) {
            await deleteDoc('conceptos', id);
            renderConceptosModalList();
        }
    };

    // 6. Conectar botón de añadir
    const btnAdd = document.getElementById('btn-add-concepto');
    if (btnAdd) {
        btnAdd.onclick = async () => {
            const input = document.getElementById('new-concepto-nombre');
            const nombre = input.value.trim();
            if (!nombre) return;
            
            // Generador de ID simple y robusto
            const newId = 'CON-' + Date.now();
            
            await saveDoc('conceptos', newId, { 
                id: newId, 
                nombre: nombre.charAt(0).toUpperCase() + nombre.slice(1),
                icon: 'label' 
            });
            
            input.value = '';
            renderConceptosModalList();
            input.focus();
        };
    }

    // 7. Mostrar todo
    renderConceptosModalList();
    modal.classList.add('modal-overlay--active');
    
    setTimeout(() => {
        const input = document.getElementById('new-concepto-nombre');
        if(input) input.focus();
    }, 100);
};

// ===============================================================
// === DETECTIVE Y LIMPIADOR DE TRASPASOS v4.0 (FUSIÓN + ANTI-DUPLICADOS) ===
// ===============================================================
window.detectarYCorregirTraspasos = async () => {
    // 1. Confirmación de seguridad
    if (!confirm("🧹 MODO LIMPIEZA TOTAL\n\n1. Fusionaré movimientos sueltos en traspasos.\n2. ELIMINARÉ los traspasos repetidos/duplicados que se hayan creado por error.\n\n¿Procedemos?")) return;

    const btn = document.querySelector('button[onclick="detectarYCorregirTraspasos()"]');
    if (btn) setButtonLoading(btn, true, 'Limpiando...');

    try {
        const CONCEPTO_TRASPASO_ID = "3mPq7hhdIn6hbphU09Hm";
        const allMovs = await AppStore.getAll();
        const batch = fbDb.batch();
        const userRef = fbDb.collection('users').doc(currentUser.uid);
        let operacionesBatch = 0; // Contador para no pasarnos del límite de Firebase

        // =================================================================================
        // FASE 1: DETECTAR Y FUSIONAR PAREJAS SUELTAS (Igual que antes)
        // =================================================================================
        const candidatos = allMovs.filter(m => {
            // Ignoramos los que ya son traspasos COMPLETOS (tienen origen y destino)
            if (m.tipo === 'traspaso' && m.cuentaOrigenId && m.cuentaDestinoId) return false;

            const esTraspasoSuelto = m.tipo === 'traspaso';
            const esConceptoTraspaso = m.conceptoId === CONCEPTO_TRASPASO_ID;
            const tieneTextoTraspaso = (m.descripcion || '').toLowerCase().includes('traspaso');
            
            return esTraspasoSuelto || esConceptoTraspaso || tieneTextoTraspaso;
        });

        // Mapa de salidas
        const salidasMap = new Map();
        candidatos.forEach(m => {
            if (m.cantidad < 0) {
                let fechaCorta = m.fecha.includes('T') ? m.fecha.split('T')[0] : m.fecha;
                const key = `${fechaCorta}_${Math.abs(m.cantidad)}`;
                if (!salidasMap.has(key)) salidasMap.set(key, []);
                salidasMap.get(key).push(m);
            }
        });

        let parejasNuevas = 0;

        // Buscar parejas
        candidatos.forEach(entrada => {
            if (entrada.cantidad > 0) {
                let fechaCorta = entrada.fecha.includes('T') ? entrada.fecha.split('T')[0] : entrada.fecha;
                const key = `${fechaCorta}_${Math.abs(entrada.cantidad)}`;

                if (salidasMap.has(key)) {
                    const posiblesSalidas = salidasMap.get(key);
                    if (posiblesSalidas.length > 0) {
                        const salida = posiblesSalidas.shift();
                        
                        // CREAR NUEVO TRASPASO
                        const newId = generateId();
                        const nuevoTraspaso = {
                            id: newId,
                            fecha: salida.fecha,
                            tipo: 'traspaso',
                            cantidad: Math.abs(salida.cantidad),
                            descripcion: salida.descripcion || 'Traspaso Corregido',
                            conceptoId: CONCEPTO_TRASPASO_ID,
                            cuentaOrigenId: salida.cuentaId,
                            cuentaDestinoId: entrada.cuentaId,
                            validado: true,
                            updatedAt: new Date().toISOString()
                        };

                        batch.set(userRef.collection('movimientos').doc(newId), nuevoTraspaso);
                        batch.delete(userRef.collection('movimientos').doc(salida.id));
                        batch.delete(userRef.collection('movimientos').doc(entrada.id));
                        
                        operacionesBatch += 3;
                        parejasNuevas++;
                        
                        // Lo agregamos a la lista local para que la FASE 2 lo tenga en cuenta
                        allMovs.push(nuevoTraspaso);
                    }
                }
            }
        });

        // =================================================================================
        // FASE 2: ELIMINAR DUPLICADOS (El Exterminador)
        // =================================================================================
        
        // Filtramos SOLO los traspasos reales (completos)
        const traspasosReales = allMovs.filter(m => 
            m.tipo === 'traspaso' && m.cuentaOrigenId && m.cuentaDestinoId
        );

        // Mapa para detectar clones
        // Clave única: FECHA + CANTIDAD + ORIGEN + DESTINO
        const duplicadosMap = new Map();
        let eliminadosCount = 0;

        traspasosReales.forEach(t => {
            let fechaCorta = t.fecha.includes('T') ? t.fecha.split('T')[0] : t.fecha;
            
            // Creamos una "huella digital" única para cada traspaso
            const huella = `${fechaCorta}_${t.cantidad}_${t.cuentaOrigenId}_${t.cuentaDestinoId}`;

            if (duplicadosMap.has(huella)) {
                // ¡YA EXISTE UNO IGUAL! Este es un clon. A la basura.
                // (No borramos el que acabamos de crear en la Fase 1, solo los viejos duplicados si los hubiera)
                
                console.log(`🗑️ Duplicado detectado para borrar: ${t.descripcion} (${t.cantidad}€)`);
                batch.delete(userRef.collection('movimientos').doc(t.id));
                operacionesBatch++;
                eliminadosCount++;
            } else {
                // Es el primero que vemos, lo marcamos como "El Original"
                duplicadosMap.set(huella, true);
            }
        });

        // =================================================================================
        // EJECUCIÓN FINAL
        // =================================================================================

        if (parejasNuevas === 0 && eliminadosCount === 0) {
            alert("✅ Todo limpio. No se encontraron nuevas parejas ni duplicados para borrar.");
            if (btn) setButtonLoading(btn, false);
            return;
        }

        const mensaje = `📊 REPORTE DE OPERACIONES:\n\n` +
                        `🔗 Nuevos traspasos creados: ${parejasNuevas}\n` +
                        `🗑️ Duplicados eliminados: ${eliminadosCount}\n\n` +
                        `¿Confirmar cambios en la base de datos?`;

        if (!confirm(mensaje)) {
            if (btn) setButtonLoading(btn, false);
            return;
        }

        await batch.commit();

        hapticFeedback('success');
        showToast('✅ Limpieza y fusión completada con éxito', 'success');
        
        // Recarga forzosa para ver los datos limpios
        setTimeout(() => {
            window.location.reload();
        }, 1500);

    } catch (error) {
        console.error("Error limpieza:", error);
        alert("Error: " + error.message);
    } finally {
        if (btn) setButtonLoading(btn, false);
    }
};