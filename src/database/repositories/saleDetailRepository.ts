import { db } from "../database";

export const saleDetailRepository = {
  async create(
    venta_id: number,
    product_id: number,
    cantidad: number,
    precio: number
  ) {
    (await db).runAsync(
      `INSERT INTO detalle_ventas(venta_id,product_id, cantidad, precio) VALUES (?,?,?,?)`,
      [venta_id, product_id, cantidad, precio]
    );
  },
};
