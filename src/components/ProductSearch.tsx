import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ProductRepository } from "../database/repositories/productRepository";
import { useCartStore } from "../store/cartStore";

export interface Product {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  codigo: string;
}

export default function ProductSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (product: Product) => {
    addItem(product);
    setQuery("");
    setResults([]);
  };

  const handleSearch = async (text: string) => {
    setQuery(text);

    if (text.trim()) {
      const matches = await ProductRepository.search(text.trim());
      setResults(matches as Product[]);
    } else {
      setResults([]);
    }
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={handleSearch}
      />
      {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => handleAddToCart(item)}
            >
              <Text>{`${item.codigo}-${item.nombre}`}</Text>
            </TouchableOpacity>
          )}
          style={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  list: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#FFF",
    borderRadius: 8,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
