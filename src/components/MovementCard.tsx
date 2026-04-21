import { StyleSheet, Text, View } from "react-native";

interface Movement {
  id: Number;
  nombre: string;
  tipo: "entrada" | "salida";
  descripcion: string;
  cantidad: number;
  fecha: string;
}

interface MovementCardProps {
  item: Movement;
}

export default function MovementCard({ item }: MovementCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{item.nombre}</Text>
      <Text>Tipo: {item.tipo}</Text>
      <Text>Descripcion: {item.descripcion}</Text>
      <Text>Cantidad: {item.cantidad.toString()}</Text>
      <Text>Fecha: {item.fecha}</Text>
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
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
