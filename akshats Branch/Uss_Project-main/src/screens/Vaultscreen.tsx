import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { passwordsAPI } from "../services/api";

interface PasswordPlatform {
  id: string;
  name: string;
  accountCount: number;
}

export default function Vaultscreen({ navigation, route }: any) {
  const [searchQuery, setSearchQuery] = useState("");
  const [platforms, setPlatforms] = useState<PasswordPlatform[]>([]);
  const [loading, setLoading] = useState(true);
  const category = route?.params?.category || "all";
  const search = route?.params?.search || "";

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await passwordsAPI.getApplications();
      const platformMap = new Map<string, number>();
      
      // Count accounts per platform
      data.forEach((app: any) => {
        const count = platformMap.get(app.application_name) || 0;
        platformMap.set(app.application_name, count + app.total_accounts);
      });
      
      // Convert to array
      const platformList: PasswordPlatform[] = Array.from(platformMap.entries()).map(([name, count], index) => ({
        id: (index + 1).toString(),
        name,
        accountCount: count,
      }));
      
      setPlatforms(platformList);
    } catch (error: any) {
      console.error("Error loading applications:", error);
      Alert.alert("Error", "Failed to load passwords");
    } finally {
      setLoading(false);
    }
  };

  const filteredPlatforms = platforms.filter((platform) => {
    if (searchQuery) {
      return platform.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    if (search) {
      return platform.name.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  const handlePlatformPress = (platform: string) => {
    navigation.navigate("PasswordDetails", { platform });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>My Vault</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search passwords..."
          placeholderTextColor="#9FA5B4"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Add Password Button */}
      <Pressable
        style={styles.addButton}
        onPress={() => navigation.navigate("AddPassword")}
      >
        <Text style={styles.addButtonText}>+ Add Password</Text>
      </Pressable>

      {/* Platforms List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4267FF" />
          <Text style={styles.loadingText}>Loading passwords...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPlatforms}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable
              style={styles.platformItem}
              onPress={() => handlePlatformPress(item.name)}
            >
              <View style={styles.platformContent}>
                <Text style={styles.platformName}>{item.name}</Text>
                <Text style={styles.platformCount}>
                  {item.accountCount} {item.accountCount === 1 ? "account" : "accounts"}
                </Text>
              </View>
              <Text style={styles.menuIcon}>⋮</Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No passwords found</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 10,
  },
  backButton: {
    flex: 1,
  },
  backText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4267FF",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1B1F3B",
    flex: 2,
    textAlign: "center",
  },
  placeholder: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F6FA",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginHorizontal: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E4EC",
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1B1F3B",
  },
  addButton: {
    backgroundColor: "#4267FF",
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  platformItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F4F6FA",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E4EC",
  },
  platformContent: {
    flex: 1,
  },
  platformName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1B1F3B",
    marginBottom: 4,
  },
  platformCount: {
    fontSize: 13,
    color: "#6A7181",
  },
  menuIcon: {
    fontSize: 20,
    color: "#1B1F3B",
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6A7181",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#6A7181",
  },
});

