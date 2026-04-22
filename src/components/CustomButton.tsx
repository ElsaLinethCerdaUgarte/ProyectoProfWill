import { ComponentProps } from "react";
import { Pressable, Text, StyleSheet } from "react-native";

type CustomButtonProps = {
  title: string;
} & ComponentProps<typeof Pressable>;

export default function CustomButton({
  title,
  ...pressableProps
}: CustomButtonProps) {
  return (
    <Pressable style={styles.button} {...pressableProps}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#005055",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
