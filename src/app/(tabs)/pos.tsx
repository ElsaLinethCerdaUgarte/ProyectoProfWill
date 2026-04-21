import { StyleSheet } from "react-native";
import ProductSearch from "../../components/ProductSearch";
import { SafeAreaView } from "react-native-safe-area-context";
import Cart from "../../components/cart";
import ProcessSale from "../../components/ProcessSale";

export default function Pos() {
  return (
    <SafeAreaView style={styles.container}>
      <ProductSearch />
      <Cart />
      <ProcessSale />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
