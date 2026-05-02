import { PaymentMethod } from "../../store/cartStore";
import { db } from "../database";

export const SaleRepository = {
  async create(total: number, payment: PaymentMethod) {
    return (await db).runAsync(
      `INSERT INTO ventas (total, metodo_pago, monto_pagado, cambio) VALUES(?, ?, ?, ?)`,
      [total, payment.tipo, payment.monto, payment.cambio || 0]
    );
  },
};
