import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useCartStore } from "../store/cartStore";
import CustomButton from "./CustomButton";
import { useState } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function PaymentModal({ visible, onClose }: PaymentModalProps) {
  const total = useCartStore((state) => state.total);
  const setPayment = useCartStore((state) => state.setPayment);
  const [method, setMethod] = useState<
    "efectivo" | "tarjeta" | "transferencia" | null
  >(null);
  const [amount, setAmount] = useState("");
  const [change, setChange] = useState(0);

  const handleConfirm = () => {
    if (!method) {
      alert("Seleccione un método de pago");
      return;
    }
    let paid: number;
    if (amount.trim() === "") {
      setAmount("0");
      paid = 0;
    } else {
      paid = parseFloat(amount);
    }

    if (paid < total) {
      alert("Monto insuficiente");
      return;
    }
    const payment = {
      tipo: method,
      monto: paid,
      cambio: method === "efectivo" ? paid - total : 0,
    };

    setPayment(payment);
    setChange(0);
    setAmount("0");
    setMethod(null);
  };
  return (
    <Modal visible={visible} animationType="slide">
      <Pressable style={styles.backButton} onPress={onClose}>
        <FontAwesome6 name="circle-arrow-left" size={30} color="black" />
      </Pressable>
      <View style={styles.container}>
        <Text style={styles.amount}>C${total.toFixed(2)}</Text>
        <Text style={styles.methodText}>Métodos de pago</Text>
        <CustomButton
          title="Efectivo"
          onPress={() => setMethod("efectivo")}
          iconName="money-bill"
          isSelected={method === "efectivo"}
        />
        <CustomButton
          title="Tarjeta"
          onPress={() => setMethod("tarjeta")}
          iconName="credit-card"
          isSelected={method === "tarjeta"}
        />
        <CustomButton
          title="Transferencia"
          onPress={() => {
            setMethod("transferencia");
            setAmount(total.toString());
          }}
          iconName="money-bill-transfer"
          isSelected={method === "transferencia"}
        />
        {method === "efectivo" && (
          <TextInput
            placeholder="Monto pagado"
            value={amount}
            onChangeText={(text) => {
              setAmount(text);
              setChange(Number(text) - total);
            }}
            keyboardType="numeric"
            style={styles.input}
          />
        )}
        {method !== "efectivo" ? null : change < 0 ? (
          <Text style={styles.change}>Pendiente: C${Math.abs(change)}</Text>
        ) : (
          <Text style={styles.change}>Cambio: C${change}</Text>
        )}
        <CustomButton
          title="Procesar Venta"
          onPress={handleConfirm}
          // style={{ backgroundColor: "blue" }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backButton: { margin: 10 },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
    gap: 10,
  },
  amount: {
    fontSize: 34,
    alignSelf: "center",
    fontWeight: "bold",
  },
  methodText: {
    fontStyle: "italic",
    alignSelf: "center",
    fontSize: 18,
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    fontSize: 18,
    height: 60,
  },
  change: {
    fontSize: 20,
    alignSelf: "center",
    fontWeight: "bold",
  },
});
