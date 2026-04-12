import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "../../components/InputFiles";
import { useState } from "react";
import { MovementRepository } from "../../database/repositories/movementRepository";
import { router } from "expo-router";
import { ProductRepository } from "../../database/repositories/productRepository";

export interface Product {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  codigo: string;
}

export default function CrearMovimiento() {
  const [producto, setProducto] = useState("");
  const [productoId, setProductoId] = useState<number | null>();
  const [cantidad, setCantidad] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("entrada");
  const [productosSugerido, setProductosSugerido] = useState<Product[]>([]);
  const tipoMovimiento = [
    { key: "entrada", label: "Entrada" },
    { key: "salida", label: "Salida" },
  ];

  const validar = () => {
    if (!productoId || isNaN(Number(productoId))) {
      Alert.alert("Error", "El producto es obligatorio o no existe.");
      return false;
    }
    if (!cantidad.trim() || isNaN(Number(cantidad)) || Number(cantidad) < 0) {
      Alert.alert("Error", "La cantidad debe ser un número mayor que 0.");
      return false;
    }
    return true;
  };

  const guardar = async () => {
    if (!validar()) return;
    await MovementRepository.create(
      Number(productoId),
      descripcion,
      tipo,
      Number(cantidad)
    );

    let ajuste = tipo === "entrada" ? Number(cantidad) : -Number(cantidad);
    await ProductRepository.adjustStock(Number(productoId), ajuste);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Crear movimiento</Text>

      {/* Contenedor relativo para anclar el dropdown */}
      <View style={styles.searchWrapper}>
        <InputField
          placeholder="Código o nombre del producto"
          value={producto}
          onChangeText={async (value) => {
            setProducto(value);
            setProductoId(null);

            if (!value.trim()) {
              setProductosSugerido([]);
              return;
            }

            const matches = await ProductRepository.search(value.trim());
            setProductosSugerido(matches as any);
          }}
        />

        {/* Dropdown flotante — no empuja el contenido inferior */}
        {productosSugerido.length > 0 && (
          <FlatList
            style={styles.suggestionsContainer}
            data={productosSugerido}
            keyExtractor={(item) => item.id.toString()}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => {
                  setProducto(`${item.codigo} - ${item.nombre}`);
                  setProductoId(item.id);
                  setProductosSugerido([]);
                }}
              >
                <Text style={styles.suggestionItemTitle}>{item.nombre}</Text>
                <Text>
                  {item.codigo} (Stock: {item.stock})
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

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

  // === NUEVO: wrapper relativo para anclar el dropdown ===
  searchWrapper: {
    position: "relative", // ancla para el absolute hijo
    zIndex: 10, // eleva encima del resto del form
    marginBottom: 12,
  },

  // === NUEVO: el dropdown ahora flota sobre el contenido ===
  suggestionsContainer: {
    position: "absolute", // no ocupa espacio en el flujo
    top: "100%", // justo debajo del InputField
    left: 0,
    right: 0,
    maxHeight: 220, // scrolleable si hay muchos resultados
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 8, // sombra Android
    shadowColor: "#000", // sombra iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    zIndex: 999,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  suggestionItemTitle: {
    fontWeight: "bold",
    marginBottom: 2,
  },
});
