import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Button, FlatList, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MovementRepository } from "../../database/repositories/movementRepository";
import MovementCard, { Movement } from "../../components/MovementCard";

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

  /**
   * Handler de anulación:
   * 1. Muestra Alert de confirmación.
   * 2. Revierte el stock según el tipo:
   *    - Entrada anulada → resta la cantidad (ajuste negativo)
   *    - Salida anulada  → suma la cantidad (ajuste positivo)
   * 3. Marca el movimiento como anulado en BD.
   * 4. Refresca la lista local.
   */
  const handleAnular = (item: Movement) => {
    Alert.alert(
      "Anular Movimiento",
      `¿Estás seguro de que deseas anular el movimiento de "${item.nombre}"?\n\nEsta acción revertirá el stock del producto.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sí, anular",
          style: "destructive",
          onPress: async () => {
            try {
              // Operación atómica: revierte stock Y marca anulado en una transacción.
              // - Entrada anulada → resta del stock.
              // - Salida  anulada → suma al stock.
              await MovementRepository.annulById(
                item.id,
                item.product_id,
                item.tipo,
                item.cantidad
              );

              // Actualización optimista del estado local
              setData((prev) =>
                prev.map((m) => (m.id === item.id ? { ...m, anulado: 1 } : m))
              );
            } catch (error: any) {
              console.error("Error anulando:", error);
              Alert.alert(
                "Error",
                error?.message ??
                  `No se pudo anular el movimiento (ID: ${item.id}).`
              );
            }
          },
        },
      ]
    );
  };

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
        renderItem={({ item }) => (
          <MovementCard item={item} onAnular={handleAnular} />
        )}
        style={styles.list}
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
    marginBottom: 8,
  },
  list: {
    marginTop: 12,
  },
});
