/**
 * firebase.js
 * 
 * Módulo para toda la interacción con Firebase (Auth y Firestore).
 * Inicializa la conexión y exporta funciones para leer/escribir datos.
 */
import { 
    firebaseConfig, currentUser, db, getInitialDb, setDb, setCurrentUser,
    clearUnsubscribeListeners, addUnsubscribeListener, resetDataLoaded, setDataLoaded,
    setSyncState
} from './state.js';
import { showToast, setButtonLoading, populateAllDropdowns, showLoginScreen, showPinLoginScreen, updateSyncStatusIcon, handleForgotPin } from './ui.js';
import { startMainApp, loadConfig, buildIntelligentIndex, chunkArray } from './main.js';
import { _renderRecientesFromCache, renderPatrimonioPage, renderPendingRecurrents, renderBudgetTracking, renderAnalisisPage } from './render.js';

// --- Inicialización de Firebase ---
firebase.initializeApp(firebaseConfig);
export const fbAuth = firebase.auth();
export const fbDb = firebase.firestore();

fbAuth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
fbDb.enablePersistence({ synchronizeTabs: true }).catch(err => {
    if (err.code == 'failed-precondition') showToast('Modo offline no disponible (múltiples pestañas).', 'warning');
    else if (err.code == 'unimplemented') showToast('Navegador no soporta modo offline.', 'warning');
});

// --- Funciones de Autenticación ---
export function checkAuthState() {
    const storedPinHash = localStorage.getItem('pinUserHash');
    const storedEmail = localStorage.getItem('pinUserEmail');
    const pinLoginCount = parseInt(localStorage.getItem('pinLoginCount') || '0', 10);
    const securityCheckTrigger = 30 + Math.floor(Math.random() * 5);

    fbAuth.onAuthStateChanged((user) => {
        setCurrentUser(user);
    });

    if (storedPinHash && storedEmail && pinLoginCount < securityCheckTrigger) {
        showPinLoginScreen(storedEmail);
    } else {
        if (pinLoginCount >= securityCheckTrigger) {
            showToast('Por seguridad, introduce tu contraseña de nuevo.', 'info', 4000);
        }
        
        localStorage.removeItem('pinUserHash');
        localStorage.removeItem('pinUserEmail');
        localStorage.removeItem('pinLoginCount');

        fbAuth.onAuthStateChanged((user) => {
            if (user) {
                setCurrentUser(user);
                loadCoreData(user.uid);
            } else {
                setCurrentUser(null);
                clearUnsubscribeListeners();
                setDb(getInitialDb());
                showLoginScreen();
            }
        });
    }
}

export function handleLogin(btn) {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errEl = document.getElementById('login-error');
    // ... (El resto de la lógica de handleLogin)
    fbAuth.signInWithEmailAndPassword(email, password)
        .then(() => showToast(`¡Bienvenido/a de nuevo!`))
        .catch((err) => { 
            setButtonLoading(btn, false); 
            if (['auth/wrong-password', 'auth/user-not-found', 'auth/invalid-credential'].includes(err.code)) {
                errEl.textContent = 'Error: Credenciales incorrectas.';
            } else if (err.code === 'auth/invalid-email') {
                document.getElementById('login-email-error').textContent = 'Formato de correo no válido.';
            } else {
                errEl.textContent = 'Error al iniciar sesión.';
            }
        });
}

export function handleRegister(btn) {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    // ... (El resto de la lógica de handleRegister)
    fbAuth.createUserWithEmailAndPassword(email, password)
        .then(() => showToast(`¡Registro completado!`))
        .catch((err) => {
            setButtonLoading(btn, false);
            // ... (manejo de errores de registro)
        });
}

// --- Funciones de Firestore (CRUD) ---
export async function saveDoc(collectionName, docId, data, btn = null) {
    if (!currentUser) { showToast("Error: No hay usuario.", "danger"); return; }
    if (btn) setButtonLoading(btn, true);

    setSyncState('syncing');
    updateSyncStatusIcon();

    try {
        const docRef = fbDb.collection('users').doc(currentUser.uid).collection(collectionName).doc(docId);
        await docRef.set(data, { merge: true });
        
        await fbDb.waitForPendingWrites();
        setSyncState('synced');
    } catch (error) {
        console.error(`Error guardando en ${collectionName}:`, error);
        showToast("Error al guardar.", "danger");
        setSyncState('error');
    } finally {
        if (btn) setButtonLoading(btn, false);
        updateSyncStatusIcon();
    }
}

export async function deleteDoc(collectionName, docId) {
    if (!currentUser) { showToast("Error: No hay usuario.", "danger"); return; }
    
    setSyncState('syncing');
    updateSyncStatusIcon();

    try {
        await fbDb.collection('users').doc(currentUser.uid).collection(collectionName).doc(docId).delete();
        await fbDb.waitForPendingWrites();
        setSyncState('synced');
    } catch (error) {
        console.error(`Error borrando de ${collectionName}:`, error);
        showToast("Error al borrar.", "danger");
        setSyncState('error');
    } finally {
        updateSyncStatusIcon();
    }
}

export async function updateAccountBalance(cuentaId, amountInCents) {
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

// --- Carga de Datos ---
export async function loadCoreData(uid) {
    clearUnsubscribeListeners();
    resetDataLoaded();

    const userRef = fbDb.collection('users').doc(uid);

    const collectionsToLoadInitially = ['cuentas', 'conceptos'];
    collectionsToLoadInitially.forEach(collectionName => {
        const unsubscribe = userRef.collection(collectionName).onSnapshot(snapshot => {
            db[collectionName] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            populateAllDropdowns();
            
            if (document.getElementById(PAGE_IDS.INICIO)?.classList.contains('view--active')) {
                _renderRecientesFromCache();
            }
            if (document.getElementById(PAGE_IDS.PATRIMONIO)?.classList.contains('view--active')) {
                renderPatrimonioPage();
            }
        }, error => {
            console.error(`Error escuchando ${collectionName}: `, error);
            showToast(`Error al cargar ${collectionName}.`, "danger");
        });
        addUnsubscribeListener(unsubscribe);
    });

    const unsubConfig = userRef.onSnapshot(doc => {
        db.config = doc.exists && doc.data().config ? doc.data().config : getInitialDb().config;
        localStorage.setItem('skipIntro', (db.config && db.config.skipIntro) || 'false');
        loadConfig();
    }, error => {
        console.error("Error escuchando la configuración del usuario: ", error);
        showToast("Error al cargar la configuración.", "danger");
    });
    addUnsubscribeListener(unsubConfig);

    buildIntelligentIndex();
    startMainApp();
}

export async function loadRecurrentes() {
    if (dataLoaded.recurrentes || !currentUser) return;
    console.log("Lazy loading: Cargando recurrentes...");
    const unsub = fbDb.collection('users').doc(currentUser.uid).collection('recurrentes').onSnapshot(snapshot => {
        db.recurrentes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const activePage = document.querySelector('.view--active');
        if (activePage && activePage.id === PAGE_IDS.INICIO) {
            renderPendingRecurrents();
        }
    }, err => console.error("Error al cargar recurrentes:", err));
    addUnsubscribeListener(unsub);
    setDataLoaded('recurrentes', true);
}

export async function loadPresupuestos() {
    if (dataLoaded.presupuestos || !currentUser) return;
    console.log("Lazy loading: Cargando presupuestos...");
    const unsub = fbDb.collection('users').doc(currentUser.uid).collection('presupuestos').onSnapshot(snapshot => {
        db.presupuestos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const activePage = document.querySelector('.view--active');
        if (activePage && activePage.id === PAGE_IDS.ANALISIS) {
            renderBudgetTracking();
        }
    }, err => console.error("Error al cargar presupuestos:", err));
    addUnsubscribeListener(unsub);
    setDataLoaded('presupuestos', true);
}

export async function loadInversiones() {
    if (dataLoaded.inversiones || !currentUser) return;
    console.log("Lazy loading: Cargando datos de inversión...");
    const coleccionesInversion = ['inversiones_historial', 'inversion_cashflows'];
    
    coleccionesInversion.forEach(collectionName => {
        const unsub = fbDb.collection('users').doc(currentUser.uid).collection(collectionName).onSnapshot(snapshot => {
            db[collectionName] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDataLoaded('inversiones', true);
            const activePageEl = document.querySelector('.view--active');
            const activePage = activePageEl ? activePageEl.id : null;
            if (activePage === PAGE_IDS.ANALISIS) { renderAnalisisPage(); }
            if (activePage === PAGE_IDS.PATRIMONIO) { renderPatrimonioPage(); }
        }, err => console.error(`Error al cargar ${collectionName}:`, err));
        addUnsubscribeListener(unsub);
    });
}

export async function fetchAllMovementsForSearch() {
    if (!currentUser) return [];
    try {
        const snapshot = await fbDb.collection('users').doc(currentUser.uid).collection('movimientos').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error al obtener todos los movimientos para la búsqueda:", error);
        showToast("Error al realizar la búsqueda en la base de datos.", "danger");
        return [];
    }
}

export async function fetchMovementsPage(startAfterDoc = null) {
    if (!currentUser) return [];
    try {
        let query = fbDb.collection('users').doc(currentUser.uid).collection('movimientos')
            .orderBy('fecha', 'desc');
        if (startAfterDoc) {
            query = query.startAfter(startAfterDoc);
        }
        query = query.limit(MOVEMENTS_PAGE_SIZE);
        const snapshot = await query.get();
        return snapshot; // Retornamos el snapshot completo para manejar lastVisibleDoc en el llamador
    } catch (error) {
        console.error("Error al obtener los movimientos:", error);
        showToast("Error al cargar los movimientos.", "danger");
        return { docs: [], empty: true };
    }
}

export const fetchMovementsInChunks = async (baseQuery, field, ids) => {
    if (ids.length === 0) return [];
    const idChunks = chunkArray(ids, 10);
    const queryPromises = idChunks.map(chunk => baseQuery.where(field, 'in', chunk).get());
    const querySnapshots = await Promise.all(queryPromises);
    let movements = [];
    querySnapshots.forEach(snapshot => {
        snapshot.forEach(doc => movements.push({ id: doc.id, ...doc.data() }));
    });
    return movements;
};
