import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "../../components/InputFiles";
import { useState } from "react";
import { MovementRepository } from "../../database/repositories/movementRepository";
import { router } from "expo-router";
import { ProductRepository } from "../../database/repositories/productRepository";

export default function CrearMovimiento() {
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("entrada");
  const tipoMovimiento = [
    { key: "entrada", label: "Entrada" },
    { key: "salida", label: "Salida" },
  ];

  const guardar = async () => {
    await MovementRepository.create(
      Number(producto),
      descripcion,
      tipo,
      Number(cantidad)
    );

    let ajuste = tipo === "entrada" ? Number(cantidad) : -Number(cantidad);
    await ProductRepository.adjustStock(Number(producto), ajuste);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Crear movimiento</Text>
      <InputField
        placeholder="Producto"
        value={producto}
        onChangeText={setProducto}
      />
      <Text style={styles.label}>Tipo de movimiento</Text>
      <View style={styles.tipoContainer}>
        {tipoMovimiento.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.tipoButton,
              tipo === item.key && styles.tipoButtonActive,
            ]}
            onPress={() => setTipo(item.key)}
          >
            <Text
              style={
                tipo === item.key
                  ? styles.tipoButtonTextActive
                  : styles.tipoButtonText
              }
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <InputField
        placeholder="Descripcion"
        value={descripcion}
        onChangeText={setDescripcion}
      />
      <InputField
        placeholder="Cantidad"
        value={cantidad}
        onChangeText={setCantidad}
      />
      <Button title="Guardar" onPress={guardar} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  label: {
    marginBottom: 16,
  },
  tipoButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  tipoContainer: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 8,
  },
  tipoButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  tipoButtonTextActive: { color: "#fff", fontWeight: "bold" },
  tipoButtonText: { color: "#333" },
});
