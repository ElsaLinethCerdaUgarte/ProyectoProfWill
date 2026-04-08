import { Alert, Button, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import InputField from "../../components/InputFiles";
import { useEffect, useState } from "react";
import { ProductRepository } from "../../database/repositories/productRepository";
import { router, useLocalSearchParams } from "expo-router";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  codigo: string;
}

export default function EditarProducto() {
  const { id } = useLocalSearchParams();
  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");

  const validar = () => {
    if (!nombre.trim()) {
      Alert.alert("Error", "El nombre es obligatorio.");
      return false;
    }
    if (!precio.trim() || isNaN(Number(precio)) || Number(precio) <= 0) {
      Alert.alert("Error", "El precio debe ser un número mayor que 0.");
      return false;
    }
    if (!stock.trim() || isNaN(Number(stock)) || Number(stock) < 0) {
      Alert.alert(
        "Error",
        "El stock debe ser un número mayor que o igual a 0."
      );
      return false;
    }
    if (!codigo.trim()) {
      Alert.alert("Error", "El codigo es obligatorio.");
      return false;
    }
    return true;
  };

  const guardar = async () => {
    if (!validar()) return;
    try {
      const isUnique = await ProductRepository.isCodeUnique(codigo, Number(id));
      if (!isUnique) {
        Alert.alert("Error", "El codigo del producto ya existe.");
        return;
      }

      await ProductRepository.update(
        Number(id),
        nombre,
        Number(precio),
        Number(stock),
        codigo
      );
      Alert.alert("Éxito", "Producto actualizado exitosamente.");
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el producto.");
    }
    router.back();
  };

  useEffect(() => {
    const loadProducto = async () => {
      if (id) {
        const producto = (await ProductRepository.getById(
          Number(id)
        )) as Producto;

        if (producto) {
          setNombre(producto.nombre);
          setPrecio(producto.precio.toString());
          setCodigo(producto.codigo || "");
          setStock(producto.stock.toString());
        }
      }
    };
    loadProducto();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Nuevo Producto</Text>
      <InputField
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <InputField
        placeholder="Código"
        value={codigo}
        onChangeText={setCodigo}
      />
      <InputField
        placeholder="Precio"
        value={precio}
        onChangeText={setPrecio}
      />
      <InputField placeholder="Stock" value={stock} onChangeText={setStock} />
      <Button title="Guardar" onPress={guardar} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
