import { Modal, StyleSheet, Text, TextInput, View } from "react-native";
import { useCartStore } from "../store/cartStore";
import CustomButton from "./CustomButton";
import { useState } from "react";

export default function PaymentModal() {
  const total = useCartStore((state) => state.total);
  const [method, setMethod] = useState<
    "efectivo" | "tarjeta" | "transferencia"
  >("efectivo");
  const [amount, setAmount] = useState(0);
  const [change, setChange] = useState(0);

  console.log(method);

  return (
    <Modal visible={true} animationType="slide">
      <View style={styles.container}>
        <Text>C${total.toFixed(2)}</Text>
        <Text>Métodos de pago</Text>
        <CustomButton title="Efectivo" onPress={() => setMethod("efectivo")} />
        <CustomButton title="Tarjeta" onPress={() => setMethod("tarjeta")} />
        <CustomButton
          title="Transferencia"
          onPress={() => setMethod("transferencia")}
        />
        <TextInput
          placeholder="Monto pagado"
          value={amount.toString()}
          onChangeText={(text) => setAmount(Number(text))}
          keyboardType="numeric"
        />
        <Text>Cambio: C${change}</Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
});
