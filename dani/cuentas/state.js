/**
 * state.js
 * 
 * Define y exporta el estado global de la aplicación, constantes y configuraciones.
 * Es la "única fuente de verdad" para los datos de la aplicación.
 */

// --- Estado mutable de la aplicación ---
export let currentUser = null;
export let db = getInitialDb();
export let isOffBalanceMode = false;
export let dataLoaded = { presupuestos: false, recurrentes: false, inversiones: false };
export let syncState = 'synced'; // 'synced', 'syncing', 'error'
export let lastVisibleMovementDoc = null; 
export let allMovementsLoaded = false; 
export let isLoadingMoreMovements = false;
export let recentMovementsCache = [];
export let intelligentIndex = new Map();
export let newMovementIdToHighlight = null;
export let unsubscribeListeners = [];

// --- Setters para modificar el estado de forma controlada ---
export const setCurrentUser = (user) => { currentUser = user; };
export const setDb = (newDb) => { db = newDb; };
export const setLedgerMode = (mode) => { isOffBalanceMode = mode; };
export const setSyncState = (state) => { syncState = state; };
export const setDataLoaded = (key, value) => { dataLoaded[key] = value; };
export const resetDataLoaded = () => { dataLoaded = { presupuestos: false, recurrentes: false, inversiones: false }; };
export const setLastVisibleMovementDoc = (doc) => { lastVisibleMovementDoc = doc; };
export const setAllMovementsLoaded = (value) => { allMovementsLoaded = value; };
export const setIsLoadingMoreMovements = (value) => { isLoadingMoreMovements = value; };
export const setRecentMovementsCache = (cache) => { recentMovementsCache = cache; };
export const setNewMovementIdToHighlight = (id) => { newMovementIdToHighlight = id; };
export const addUnsubscribeListener = (listener) => { unsubscribeListeners.push(listener); };
export const clearUnsubscribeListeners = () => { 
    unsubscribeListeners.forEach(unsub => unsub());
    unsubscribeListeners = [];
};

// --- Constantes de Configuración y UI ---
export const PAGE_IDS = {
    INICIO: 'inicio-page',
    PATRIMONIO: 'patrimonio-page',
    ANALISIS: 'analisis-page',
    CONFIGURACION: 'configuracion-page',
    MOVIMIENTOS_FULL: 'movimientos-page-full',
};

export const THEMES = {
    'default': { name: 'Amoled Futurista', icon: 'dark_mode' },
    'ocean': { name: 'Océano Profundo', icon: 'bedtime' },
    'magma': { name: 'Magma Oscuro', icon: 'local_fire_department' },
    'daylight': { name: 'Luz Diurna', icon: 'light_mode' },
    'quartz': { name: 'Cuarzo Claro', icon: 'wb_sunny' }
};

export const MOVEMENTS_PAGE_SIZE = 200;

export const DEFAULT_DASHBOARD_WIDGETS = ['kpi-summary', 'concept-totals'];

export const firebaseConfig = { 
    apiKey: "AIzaSyAp-t-2qmbvSX-QEBW9B1aAJHBESqnXy9M", 
    authDomain: "cuentas-aidanai.firebaseapp.com", 
    projectId: "cuentas-aidanai", 
    storageBucket: "cuentas-aidanai.appspot.com", 
    messagingSenderId: "58244686591", 
    appId: "1:58244686591:web:85c87256c2287d350322ca" 
};

// --- Datos Estáticos ---
export const quotesData = [ 
    { "cita": "Los inversores conservadores duermen bien.", "autor": "Benjamin Graham" }, { "cita": "Nunca asciendas a alguien que no ha cometido errores, porque si lo haces, estás ascendiendo a alguien que nunca ha hecho nada.", "autor": "Benjamin Graham" }, { "cita": "Si se han hecho los deberes antes de comprar una acción, el momento de venderla es: normalmente, nunca.", "autor": "Benjamin Graham" }, { "cita": "Mientras que el entusiasmo é necesario para conseguir grandes logros en cualquier lugar, en Wall Street suele conducir al desastre.", "autor": "John Templeton" }, { "cita": "Sin tener fe en el futuro, nadie invertiría. Para ser inversor, debes creer en un mañana mejor.", "autor": "John Templeton" }, { "cita": "Las cuatro palabras más caras de nuestro lenguaje son: 'Esta vez es diferente'.", "autor": "John Templeton" }, { "cita": "Céntrate en el valor porque la mayoría de los inversores se fijan en perspectivas y tendencias.", "autor": "Peter Lynch" }, { "cita": "El éxito es un proceso de búsqueda continua de respuestas a nuevas preguntas.", "autor": "Peter Lynch" }, { "cita": "Conoce en lo que inviertes, y por qué.", "autor": "Peter Lynch" }, { "cita": "Cuando vendes en momentos de desesperación, siempre vendes barato.", "autor": "Peter Lynch" }, { "cita": "Una persona que posee una propiedad y tiene una participación en la empresa probablemente trabajará más duro, se sentirá más feliz y hará un mejor trabajo que otra que no tiene nada.", "autor": "Peter Lynch" }, { "cita": "El riesgo viene de no saber lo que se está haciendo.", "autor": "Warren Buffett" }, { "cita": "Cuesta 20 años construir una reputación y 5 minutos destruirla. Si piensas sobre ello, harás las cosas de manera diferente.", "autor": "Warren Buffett" }, { "cita": "En el mundo de los negocios, el espejo retrovisor está siempre más claro que el parabrisas.", "autor": "Warren Buffett" }, { "cita": "La inversión más importante que puedes hacer es en uno mismo.", "autor": "Warren Buffett" }, { "cita": "Sé temeroso cuando otros sean avariciosos, sé avaricioso cuando otros sean temerosos.", "autor": "Warren Buffett" }, { "cita": "Sé consciente de lo que no sabes. Siéntete a gusto entendiendo tus errores y debilidades.", "autor": "Charlie Munger" }, { "cita": "Para hacer dinero en los mercados, tienes que pensar diferente y ser humilde.", "autor": "Charlie Munger" }, { "cita": "El principal problema del inversor, e incluso su peor enemigo, es probablemente él mismo", "autor": "Benjamin Graham" }, { "cita": "Las personas que no pueden controlar sus emociones no son aptas para obtener beneficios mediante la inversión", "autor": "Benjamin Graham" }, { "cita": "Trato de comprar acciones en los negocios que son tan maravillosos que un tonto podría manejarlos. Tarde o temprano uno lo hará", "autor": "Warren Buffett" }, { "cita": "Un inversor debería actuar como si tuviera una tarjeta con solo 20 decisiones (de compra) para tomar a lo largo de su vida", "autor": "Warren Buffett" }, { "cita": "Regla número 1: nunca pierdas dinero. Regla número 2: nunca olvides la regla número 1", "autor": "Warren Buffett" }, { "cita": "Se gana dinero descontando lo obvio y apostando a lo inesperado", "autor": "George Soros" }, { "cita": "El problema no es lo que uno no sabe, sino lo que uno cree que sabe estando equivocado", "autor": "George Soros" }, { "cita": "Si invertir es entretenido, si te estás divirtiendo, probablemente no estés ganando dinero. Las buenas inversiones son aburridas", "autor": "George Soros" }, { "cita": "Se puede perder dinero a corto plazo, pero necesitas del largo plazo para ganar dinero", "autor": "Peter Lynch" }, { "cita": "La mejor empresa para comprar puede ser alguna que ya tienes en cartera", "autor": "Peter Lynch" }, { "cita": "La clave para ganar dinero con las acciones es no tenerles miedo", "autor": "Peter Lynch" }, { "cita": "Los mercados alcistas nacen en el pesimismo, crecen en el escepticismo, maduran en el optimismo y mueren en la euforia", "autor": "John Templeton" }, { "cita": "El momento de máximo pesimismo es el mejor para comprar y el momento de máximo optimismo es el mejor para vender", "autor": "John Templeton" }, { "cita": "Un inversor que tiene todas las respuestas ni siquiera entiende las preguntas", "autor": "John Templeton" }, { "cita": "La inversión es un negocio a largo plazo donde la paciencia marca la rentabilidad", "autor": "Francisco García Paramés" }, { "cita": "¿Cuándo vendemos un valor? Respondemos siempre: cuando haya una oportunidad mejor. Ese es nuestro objetivo permanente, mejorar la cartera cada día", "autor": "Francisco García Paramés" }, { "cita": "Lo que en la Bolsa saben todos, no me interesa", "autor": "André Kostolany" }, { "cita": "No sirve para nada proclamar la verdad en economía o recomendar cosas útiles. Es la mejor manera de hacerse enemigos", "autor": "André Kostolany" }, { "cita": "Un inversor pierde la capacidad de raciocinio cuando gana los primeros diez mil dólares. A partir de entonces se convierte en un pelele fácilmente manipulable", "autor": "André Kostolany" }, { "cita": "Comprar títulos, acciones de empresas, tomarse unas pastillas para dormir durante 20/30 años y cuando uno despierta, ¡voilà! es millonario", "autor": "André Kostolany" }, { "cita": "No sé si los próximos 1.000 puntos del Dow Jones serán hacia arriba o hacia abajo, pero estoy seguro de que los próximos 10.000 serán hacia arriba", "autor": "Peter Lynch" }, { "cita": "El destino de un inversor lo marca su estómago , no su cerebro", "autor": "Peter Lynch" }, { "cita": "No siga mis pasos porque aun en el caso de que acierte al comprar usted no sabrá cuando vendo", "autor": "Peter Lynch" }, { "cita": "Calcule las 'ganancias del dueño' para conseguir una reflexión verdadera del valor", "autor": "Warren Buffett" }, { "cita": "Busque compañías con altos márgenes de beneficio", "autor": "Warren Buffett" }, { "cita": "Invierta siempre para el largo plazo", "autor": "Warren Buffett" }, { "cita": "El consejo de que 'usted nunca quiebra tomando un beneficio' es absurdo", "autor": "Warren Buffett" }, { "cita": "¿El negocio tiene una historia de funcionamiento constante?", "autor": "Warren Buffett" }, { "cita": "Recuerde que el mercado de valores es maníaco-depresivo", "autor": "Benjamin Graham" }, { "cita": "Compre un negocio, no alquile la acción", "autor": "Warren Buffett" }, { "cita": "Mientras más absurdo sea el comportamiento del mercado mejor será la oportunidad para el inversor metódico", "autor": "Benjamin Graham" }, { "cita": "Se puede perder dinero a corto plazo, pero usted sigue siendo un idiota", "autor": "Joel Greenblatt" }, { "cita": "Los mercados alcistas no tienen resistencia y los bajistas no tienen soporte", "autor": "Ed Downs" }, { "cita": "El pánico causa que vendas en el bajón, y la codicia causa que compres cerca a la cima", "autor": "Stan Weinstein" }, { "cita": "Las dos grandes fuerzas que mueven los mercados son la codicia y el miedo", "autor": "Anónimo" }, { "cita": "Todo lo que sube baja y todo lo que baja sube", "autor": "Anónimo" }, { "cita": "Si no sientes miedo en el momento de comprar es que estás comprando mal", "autor": "Anónimo" }, { "cita": "Que el último duro lo gane otro", "autor": "Anónimo" }, { "cita": "La clave para hacer dinero en acciones es no asustarse de ellas", "autor": "Peter Lynch" }, { "cita": "El precio es lo que pagas, el valor es lo que recibes", "autor": "Warren Buffett" }, { "cita": "No es necesario hacer cosas extraordinarias para conseguir resultados extraordinarios", "autor": "Warren Buffett" }, { "cita": "Alguien está sentado en la sombra hoy porque alguien plantó un árbol mucho tiempo atrás", "autor": "Warren Buffett" }, { "cita": "Únicamente cuando la marea baja, descubres quién ha estado nadando desnudo", "autor": "Warren Buffett" }, { "cita": "No tenemos que ser más inteligentes que el resto, tenemos que ser más disciplinados que el resto", "autor": "Warren Buffett" }, { "cita": "Si compras cosas que no necesitas, pronto tendrás que vender cosas que necesitas", "autor": "Warren Buffett" }, { "cita": "Nunca inviertas en un negocio que no puedas entender", "autor": "Warren Buffett" }, { "cita": "El tiempo es amigo de las empresas maravillosas y enemigo de las mediocres", "autor": "Warren Buffett" }, { "cita": "Nuestro periodo de espera favorito es para siempre", "autor": "Warren Buffett" }, { "cita": "Wall Street es el único lugar al que las personas van en un Rolls-Royce, para recibir asesoría de quienes toman el metro", "autor": "Warren Buffett" }, { "cita": "Llega un momento en el que debes empezar a hacer lo que realmente quieres. Busca un trabajo que te guste y saltarás de la cama cada mañana con fuerza", "autor": "Warren Buffett" }, { "cita": "Es siempre mejor pasar el tiempo con gente mejor que tú. Escoge asociados cuyo comportamiento es mejor que el tuyo e irás en esa dirección", "autor": "Warren Buffett" }, { "cita": "Toma 20 años en construir una reputación y 5 minutos en arruinarla. Si piensas sobre ello, harás las cosas de forma diferente", "autor": "Warren Buffett" }, { "cita": "No importa el talento o los esfuerzos, hay cosas que llevan tiempo. No puedes producir un bebé en un mes dejando embarazadas a 9 mujeres", "autor": "Warren Buffett" }, { "cita": "Las oportunidades aparecen pocas veces. Cuando llueva oro sal a la calle con un cesto grande y no con un dedal", "autor": "Warren Buffett" }, { "cita": "La gente siempre me pregunta dónde deberían trabajar y yo siempre les digo que vayan a trabajar con aquellos a los que más admiran", "autor": "Warren Buffett" }, { "cita": "¿Cuándo hay que vender una acción? Pues cuando tengamos una oportunidad mejor a la vista", "autor": "Francisco García Paramés" }, { "cita": "Nunca acudo a las OPV, me gusta estar en las empresas que pueden ser opadas por competidores, no en las salidas a bolsa", "autor": "Francisco García Paramés" }, { "cita": "Si en el mercado hay más tontos que papel, la bolsa va a subir, si hay más papel que tontos, la bolsa baja", "autor": "André Kostolany" }, { "cita": "No persiga nunca una acción, tenga paciencia que la próxima oportunidad va a llegar con toda seguridad", "autor": "André Kostolany" }, { "cita": "Lo que todos saben en la bolsa, no nos interesa a los especuladores", "autor": "André Kostolany" }, { "cita": "Las inversiones exitosas consisten en saber gestionar el riesgo, no en evitarlo.", "autor": "Benjamin Graham" }, { "cita": "Una gran compañía no es una buena inversión si pagas mucho por la acción", "autor": "Benjamin Graham" }, { "cita": "A veces es mejor pensar una hora sobre el dinero que dedicar una semana a trabajar para obtenerlo.", "autor": "André Kostolany" }, { "cita": "En la Bolsa, con frecuencia, hay que cerrar los ojos para ver mejor.", "autor": "André Kostolany" }, { "cita": "Si la inversión es entretenida, si te estás divirtiendo, es probable que no estés ganando dinero. Una buena inversión es aburrida.", "autor": "George Soros" }, { "cita": "Las burbujas del mercado de valores no crecen de la nada. Tienen una base sólida en la realidad, pero la realidad está distorsionada por un malentendido.", "autor": "George Soros" }, { "cita": "Nunca digas que no puedes permitirte algo. Esa es la aptitud de un hombre pobre. Pregúntate cómo permitírtelo.", "autor": "Robert Kiyosaki" }, { "cita": "Una diferencia importante es que los ricos compran los lujos al final, mientras que los pobres y la clase media tienden a comprar los lujos primero.", "autor": "Robert Kiyosaki" }, { "cita": "Mantén tus activos bajo mínimos, reduce los pasivos y, con mucha disciplina, ve construyendo una base de activos sólida.", "autor": "Robert Kiyosaki" }, { "cita": "No ahorres lo que queda después de gastar, sino gasta lo que queda después de ahorrar.", "autor": "Warren Buffett" }, { "cita": "El riesgo viene de no saber lo que estás haciendo.", "autor": "Warren Buffett" }, { "cita": "Sea temeroso cuando otros son codiciosos, y sea codicioso cuando otros son temerosos.", "autor": "Warren Buffett" }, { "cita": "No compres cosas que no necesitas, con dinero que no tienes, para impresionar a gente que no te importa.", "autor": "Dave Ramsey" } 
];

// --- Funciones de Estado Inicial ---
export function getInitialDb() {
    return {
        cuentas: [], 
        conceptos: [], 
        movimientos: [], 
        presupuestos: [],
        recurrentes: [],
        inversiones_historial: [],
        inversion_cashflows: [],
        config: { 
            skipIntro: false,
            dashboardWidgets: DEFAULT_DASHBOARD_WIDGETS
        } 
    };
}
