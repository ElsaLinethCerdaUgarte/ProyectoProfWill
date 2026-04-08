import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MovementRepository } from "../../database/repositories/movementRepository";
import MovementCard from "../../components/MovementCard";

interface Movement {
  id: Number;
  codigo: string;
  nombre: string;
  tipo: "entrada" | "salida";
  cantidad: number;
  fecha: string;
}

export default function Movimientos() {
  const [data, setData] = useState<Movement[]>([]);

  const loadData = async () => {
    const movimientos = await MovementRepository.getAll();
    setData(movimientos as Movement[]);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Movimientos</Text>
      <Button
        title="Nuevo Movimiento"
        onPress={() => router.push("/movimientos/crear")}
      />

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MovementCard item={item} />}
      />
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
  },
});
