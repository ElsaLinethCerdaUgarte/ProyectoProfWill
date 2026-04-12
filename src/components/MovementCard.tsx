import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface Movement {
  id: number;
  product_id: number;
  nombre: string;
  tipo: "entrada" | "salida";
  cantidad: number;
  fecha: string;
  anulado: number; // 0 = activo, 1 = anulado
}

interface MovementCardProps {
  item: Movement;
  onAnular: (item: Movement) => void;
}

export default function MovementCard({ item, onAnular }: MovementCardProps) {
  const isAnulado = item.anulado === 1;

  return (
    <View style={[styles.card, isAnulado && styles.cardAnulada]}>
      <View style={styles.header}>
        <Text style={styles.name}>{item.nombre}</Text>
        {isAnulado && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>ANULADO</Text>
          </View>
        )}
      </View>
      <Text style={styles.detail}>
        Tipo:{" "}
        <Text style={item.tipo === "entrada" ? styles.entrada : styles.salida}>
          {item.tipo.toUpperCase()}
        </Text>
      </Text>
      <Text style={styles.detail}>Cantidad: {item.cantidad.toString()}</Text>
      <Text style={styles.detail}>Fecha: {item.fecha}</Text>

      {!isAnulado && (
        <TouchableOpacity
          style={styles.anularButton}
          onPress={() => onAnular(item)}
        >
          <Text style={styles.anularButtonText}>Anular Movimiento</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  cardAnulada: {
    backgroundColor: "#f5f5f5",
    opacity: 0.7,
    borderWidth: 1,
    borderColor: "#ddd",
    borderStyle: "dashed",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    flex: 1,
  },
  badge: {
    backgroundColor: "#FF3B30",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  detail: {
    color: "#555",
    marginBottom: 2,
  },
  entrada: {
    color: "#34C759",
    fontWeight: "bold",
  },
  salida: {
    color: "#FF9500",
    fontWeight: "bold",
  },
  anularButton: {
    marginTop: 10,
    backgroundColor: "#FF3B30",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  anularButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
});
