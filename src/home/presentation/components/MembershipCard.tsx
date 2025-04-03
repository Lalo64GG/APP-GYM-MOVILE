import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../styles";

type Props = {
  title: string;
  value: string;
  icon?: string;
  iconColor?: string;
};

export const MembershipCard = ({ title, value, icon, iconColor }: Props) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.cardContent}>
        <Text style={styles.cardText}>{value}</Text>
        {icon && <MaterialIcons name={`${icon}`} size={20} color={iconColor || "white"} />}
      </View>
    </View>
  );
};
