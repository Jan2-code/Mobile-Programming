import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StatusBar,
} from "react-native";

interface FoodItem {
  id: string;
  title: string;
  quantity: string;
  expiry: string;
  image: string;
}

const data: FoodItem[] = [
  {
    id: "1",
    title: "Pizza",
    quantity: "10 Packs",
    expiry: "2 hrs left",
    image:
      "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "2",
    title: "Bread",
    quantity: "20 Pieces",
    expiry: "5 hrs left",
    image:
      "https://images.unsplash.com/photo-1608198093002-ad4e005484ec",
  },
  {
    id: "3",
    title: "Fruits",
    quantity: "5 Kg",
    expiry: "Tomorrow",
    image:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf",
  },
];

export default function App() {
  const renderItem = ({ item }: { item: FoodItem }) => {
    const isUrgent = item.expiry.includes("hrs");

    return (
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />

        <View style={styles.cardContent}>
          <Text style={styles.foodTitle}>{item.title}</Text>
          <Text style={styles.info}>Qty: {item.quantity}</Text>

          <Text
            style={[
              styles.expiry,
              { color: isUrgent ? "#d9534f" : "#5cb85c" },
            ]}
          >
            Expiry: {item.expiry}
          </Text>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Pickup</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Local Food Donation Network</Text>
        <Text style={styles.subText}>Helping reduce food waste</Text>
      </View>

      {/* Search + Actions */}
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Search food..."
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.actionBtn}>
          <Text>Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text>Location</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      Bottom Navigation
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>Add</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>Notify</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    paddingHorizontal: 15,
  },

  header: {
    marginVertical: 10,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },

  subText: {
    color: "#777",
    marginTop: 3,
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },

  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  actionBtn: {
    marginLeft: 8,
    backgroundColor: "#e9ecef",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginVertical: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },

  cardContent: {
    flex: 1,
    marginLeft: 10,
  },

  foodTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },

  info: {
    color: "#555",
    marginTop: 3,
  },

  expiry: {
    marginTop: 3,
    fontWeight: "600",
  },

  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0, 
    right: 0,
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
    justifyContent: "space-around",
  },

  navItem: {
    alignItems: "center",
  },

  navText: {
    color: "#888",
  },

  navTextActive: {
    color: "#000",
    fontWeight: "bold",
  },
});