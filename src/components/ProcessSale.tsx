import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useCartStore } from "../store/cartStore";
import { MovementRepository } from "../database/repositories/movementRepository";
import { ProductRepository } from "../database/repositories/productRepository";

export default function ProcessSale() {
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total);
  const clearCart = useCartStore((state) => state.clearCart);

  const handleSale = async () => {
    try {
      for (const item of items) {
        await MovementRepository.create(
          item.product.id,
          "Venta POS",
          "salida",
          item.quantity
        );
        await ProductRepository.adjustStock(item.product.id, -item.quantity);
      }
      Alert.alert("Éxito", "Venta procesada correctamente");
      clearCart();
    } catch (error) {
      Alert.alert("Error", "No se pudo procesar la venta");
    }
  };
  return (
    <TouchableOpacity
      disabled={items.length === 0}
      style={[
        styles.processSaleButton,
        items.length === 0 ? styles.processSaleButtonDisabled : {},
      ]}
      onPress={handleSale}
    >
      <Text style={styles.processSaleButtonText}> Procesar Venta </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  processSaleButton: {
    alignSelf: "center",
    backgroundColor: "green",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  processSaleButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  processSaleButtonDisabled: {
    backgroundColor: "gray",
  },
});
