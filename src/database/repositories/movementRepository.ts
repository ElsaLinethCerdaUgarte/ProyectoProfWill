import { db } from "../database";

export const MovementRepository = {
  /**
   * Devuelve todos los movimientos incluyendo `product_id` y `anulado`
   * para que el componente pueda mostrar el estado correcto tras recargar.
   */
  async getAll() {
    const database = await db;
    return database.getAllAsync(
      `SELECT m.id, m.product_id, p.nombre, m.cantidad, m.fecha, m.tipo, m.anulado
 FROM movimientos_inventario m
 JOIN productos p ON p.id = m.product_id
 ORDER BY m.fecha DESC`
    );
  },

  async create(
    product_id: number,
    descripcion: string,
    tipo: string,
    cantidad: number
  ) {
    const database = await db;
    await database.runAsync(
      `INSERT INTO movimientos_inventario(product_id, descripcion, tipo, cantidad) VALUES (?,?,?,?)`,
      [product_id, descripcion, tipo, cantidad]
    );
  },

  /**
   * Anula un movimiento de forma ATÓMICA dentro de una transacción:
   *  - Entrada anulada → resta la cantidad del stock (ajuste negativo).
   *  - Salida  anulada → suma la cantidad al stock  (ajuste positivo).
   * Si cualquiera de las dos operaciones falla, ambas se revierten.
   */
  async annulById(id: number, product_id: number, tipo: string, cantidad: number) {
    const database = await db;

    // Verificamos que el movimiento no esté ya anulado
    const movimiento = await database.getFirstAsync<{ anulado: number }>(
      `SELECT anulado FROM movimientos_inventario WHERE id = ?`,
      [id]
    );

    if (!movimiento) {
      throw new Error(`Movimiento con id ${id} no encontrado.`);
    }
    if (movimiento.anulado === 1) {
      throw new Error("Este movimiento ya fue anulado anteriormente.");
    }

    // Ajuste: entrada → restar (−cantidad); salida → sumar (+cantidad)
    const ajuste = tipo === "entrada" ? -cantidad : cantidad;

    await database.withExclusiveTransactionAsync(async (txn) => {
      // 1. Revertir el stock del producto
      await txn.runAsync(
        `UPDATE productos SET stock = stock + ? WHERE id = ?`,
        [ajuste, product_id]
      );

      // 2. Marcar el movimiento como anulado
      await txn.runAsync(
        `UPDATE movimientos_inventario SET anulado = 1 WHERE id = ?`,
        [id]
      );
    });
  },
};
