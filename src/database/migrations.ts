import { db } from "./database";

export const runMigrations = async () => {
  (await db).execAsync(`
    CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      precio REAL NOT NULL,
      stock INTEGER DEFAULT 0,
      codigo TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS ventas(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    total REAL,
    fecha TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS detalle_ventas(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    venta_id INTEGER,
    product_id INTEGER,
    cantidad INTEGER,
    precio REAL
    );

    CREATE TABLE IF NOT EXISTS movimientos_inventario(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      descripcion TEXT,
      tipo TEXT,
      cantidad INTEGER,
      fecha TEXT DEFAULT CURRENT_TIMESTAMP,
      anulado INTEGER DEFAULT 0
    );
  `);
};
