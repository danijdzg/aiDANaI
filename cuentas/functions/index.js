// functions/index.js

// --- v2 Imports ---
// Se importa de forma más específica lo que necesitamos.
const {onDocumentWritten} = require("firebase-functions/v2/firestore"); // <<< CAMBIO 1
const {setGlobalOptions} = require("firebase-functions/v2"); // <<< CAMBIO 2
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger"); // <<< CAMBIO 3 (Mejor sistema de logs)

admin.initializeApp();
const db = admin.firestore();

// --- Opciones Globales para v2 ---
// Le decimos a todas las funciones que se desplieguen en "europe-west1" (Bélgica).
// Puedes cambiarla a la región que prefieras. Es obligatorio en v2.
setGlobalOptions({region: "europe-west1"}); // <<< CAMBIO 4

/**
 * Esta es nuestra función principal, ahora usando la sintaxis v2.
 * Se activa AUTOMÁTICAMENTE cuando un movimiento es CREADO, ACTUALIZADO o ELIMINADO.
 */
exports.updateAccountBalanceOnTransaction = onDocumentWritten(
    "users/{userId}/movimientos/{movimientoId}", // La ruta sigue siendo la misma
    async (event) => { // <<< CAMBIO 5 (El objeto de evento es un poco diferente)
      const {userId} = event.params;

      const dataBefore = event.data.before.exists ? event.data.before.data() : null;
      const dataAfter = event.data.after.exists ? event.data.after.data() : null;

      // --- ESCENARIO 1: Se ha CREADO un nuevo movimiento ---
      if (!dataBefore && dataAfter) {
        logger.info(`Nuevo movimiento creado para ${userId}:`, {id: dataAfter.id});
        const {
          tipo, cantidad, cuentaId, cuentaOrigenId, cuentaDestinoId,
        } = dataAfter;

        if (tipo === "traspaso") {
          const origenRef = db.collection("users").doc(userId)
              .collection("cuentas").doc(cuentaOrigenId);
          const destinoRef = db.collection("users").doc(userId)
              .collection("cuentas").doc(cuentaDestinoId);

          await origenRef.update(
              {saldo: admin.firestore.FieldValue.increment(-cantidad)});
          await destinoRef.update(
              {saldo: admin.firestore.FieldValue.increment(cantidad)});
        } else {
          const cuentaRef = db.collection("users").doc(userId)
              .collection("cuentas").doc(cuentaId);
          await cuentaRef.update(
              {saldo: admin.firestore.FieldValue.increment(cantidad)});
        }
      } else if (dataBefore && !dataAfter) {
        // --- ESCENARIO 2: Se ha ELIMINADO un movimiento ---
        logger.info(`Movimiento eliminado para ${userId}:`, {id: dataBefore.id});
        const {
          tipo, cantidad, cuentaId, cuentaOrigenId, cuentaDestinoId,
        } = dataBefore;

        if (tipo === "traspaso") {
          const origenRef = db.collection("users").doc(userId)
              .collection("cuentas").doc(cuentaOrigenId);
          const destinoRef = db.collection("users").doc(userId)
              .collection("cuentas").doc(cuentaDestinoId);
          await origenRef.update(
              {saldo: admin.firestore.FieldValue.increment(cantidad)});
          await destinoRef.update(
              {saldo: admin.firestore.FieldValue.increment(-cantidad)});
        } else {
          const cuentaRef = db.collection("users").doc(userId)
              .collection("cuentas").doc(cuentaId);
          await cuentaRef.update(
              {saldo: admin.firestore.FieldValue.increment(-cantidad)});
        }
      } else if (dataBefore && dataAfter) {
        // --- ESCENARIO 3: Se ha ACTUALIZADO un movimiento ---
        logger.info(`Movimiento actualizado para ${userId}:`, {id: dataAfter.id});

        // 1. Revertimos el estado 'before'
        if (dataBefore.tipo === "traspaso") {
          const origenRef = db.collection("users").doc(userId)
              .collection("cuentas").doc(dataBefore.cuentaOrigenId);
          const destinoRef = db.collection("users").doc(userId)
              .collection("cuentas").doc(dataBefore.cuentaDestinoId);
          await origenRef.update(
              {saldo: admin.firestore.FieldValue.increment(dataBefore.cantidad)});
          await destinoRef.update(
              {saldo: admin.firestore.FieldValue.increment(-dataBefore.cantidad)});
        } else {
          const cuentaRef = db.collection("users").doc(userId)
              .collection("cuentas").doc(dataBefore.cuentaId);
          await cuentaRef.update(
              {saldo: admin.firestore.FieldValue.increment(-dataBefore.cantidad)});
        }

        // 2. Aplicamos el estado 'after'
        if (dataAfter.tipo === "traspaso") {
          const origenRef = db.collection("users").doc(userId)
              .collection("cuentas").doc(dataAfter.cuentaOrigenId);
          const destinoRef = db.collection("users").doc(userId)
              .collection("cuentas").doc(dataAfter.cuentaDestinoId);
          await origenRef.update(
              {saldo: admin.firestore.FieldValue.increment(-dataAfter.cantidad)});
          await destinoRef.update(
              {saldo: admin.firestore.FieldValue.increment(dataAfter.cantidad)});
        } else {
          const cuentaRef = db.collection("users").doc(userId)
              .collection("cuentas").doc(dataAfter.cuentaId);
          await cuentaRef.update(
              {saldo: admin.firestore.FieldValue.increment(dataAfter.cantidad)});
        }
      }

      return null;
    },
);