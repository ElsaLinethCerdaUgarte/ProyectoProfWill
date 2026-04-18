import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCartStore } from "../store/cartStore";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function Cart() {
  // const { items, total } = useCartStore();
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total);

  return (
    <View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.product.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.product.nombre}</Text>
            <Text>
              C$ {item.product.precio.toFixed(2)} x {item.quantity} = C${" "}
              {(item.product.precio * item.quantity).toFixed(2)}
            </Text>
            <View style={styles.controls}>
              <TouchableOpacity>
                <AntDesign name="minus" size={20} color="red" />
              </TouchableOpacity>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <TouchableOpacity>
                <AntDesign name="plus" size={20} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Text>Total: C$ {total.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#f9f9f9",
    marginBottom: 5,
    borderRadius: 8,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
  },
});
