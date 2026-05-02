import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCartStore } from "../store/cartStore";
import { MovementRepository } from "../database/repositories/movementRepository";
import { ProductRepository } from "../database/repositories/productRepository";
import PaymentModal from "./PaymentModal";
import { useEffect, useState } from "react";
import CustomButton from "./CustomButton";
import { SaleRepository } from "../database/repositories/saleRepository";
import { saleDetailRepository } from "../database/repositories/saleDetailRepository";

export default function ProcessSale() {
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total);
  const payment = useCartStore((state) => state.payment);
  const clearCart = useCartStore((state) => state.clearCart);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    handleSale();
  }, [payment]);

  const handleSale = async () => {
    try {
      if (!payment && items.length > 0) {
        setShowPayment(true);
        return;
      }

      if (items.length > 0 && total) {
        const resultSale = await SaleRepository.create(total, payment!);

        for (const item of items) {
          await MovementRepository.create(
            item.product.id,
            "Venta POS",
            "salida",
            item.quantity
          );
          await ProductRepository.adjustStock(item.product.id, -item.quantity);
          await saleDetailRepository.create(
            resultSale.lastInsertRowId,
            item.product.id,
            item.quantity,
            item.product.precio
          );
        }
        setShowPayment(false);
        Alert.alert("Éxito", "Venta procesada correctamente");
        clearCart();
      }
    } catch (error: any) {
      Alert.alert("Error", "No se pudo procesar la venta: " + error.message);
    }
  };
  return (
    <View>
      <CustomButton
        onPress={handleSale}
        disabled={items.length === 0}
        title="Procesar Venta"
        iconName="cart-arrow-down"
      />
      <PaymentModal
        visible={showPayment}
        onClose={() => setShowPayment(false)}
      />
    </View>
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
