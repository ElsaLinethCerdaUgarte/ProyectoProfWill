import { db } from "../database";

export const MovementRepository = {
  async getAll() {
    const database = await db;
    return database.getAllAsync(
      `SELECT m.id, p.nombre, m.cantidad, m.fecha, m.tipo 
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
    (await db).runAsync(
      `INSERT INTO movimientos_inventario(product_id, descripcion, tipo, cantidad) VALUES (?,?,?,?)`,
      [product_id, descripcion, tipo, cantidad]
    );
  },
};
