import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  FlatList,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface PasswordItem {
  id: string;
  platform: string;
  accountCount: number;
}

export default function Homescreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState("");

  const recentlyAdded: PasswordItem[] = [
    { id: "1", platform: "Facebook", accountCount: 3 },
    { id: "2", platform: "Amazon", accountCount: 2 },
    { id: "3", platform: "Netflix", accountCount: 2 },
    { id: "4", platform: "Instagram", accountCount: 4 },
  ];

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => navigation.navigate("Login"),
      },
    ]);
  };

  const handleSecurityAlert = () => {
    navigation.navigate("Security");
  };

  const handlePlatformPress = (platform: string) => {
    navigation.navigate("PasswordDetails", { platform });
  };

  const handleCategoryPress = (category: string) => {
    navigation.navigate("Vault", { category });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AV</Text>
            </View>
            <Text style={styles.username}>Akshat V.</Text>
          </View>
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>→ Logout</Text>
          </Pressable>
        </View>

        <View style={styles.divider} />

        {/* Main Title */}
        <View style={styles.titleSection}>
          <Text style={styles.subtitle}>Manage your</Text>
          <Text style={styles.mainTitle}>Password Easily</Text>
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
            onSubmitEditing={() => {
              if (searchQuery.trim()) {
                navigation.navigate("Vault", { search: searchQuery });
              }
            }}
          />
        </View>

        {/* Password Categories */}
        <View style={styles.categoriesContainer}>
          <Pressable
            style={styles.categoryCard}
            onPress={() => handleCategoryPress("browser")}
          >
            <Text style={styles.categoryIcon}>🌐</Text>
            <Text style={styles.categoryTitle}>Browser</Text>
            <Text style={styles.categoryCount}>42 Passwords</Text>
          </Pressable>

          <Pressable
            style={styles.categoryCard}
            onPress={() => handleCategoryPress("apps")}
          >
            <Text style={styles.categoryIcon}>📱</Text>
            <Text style={styles.categoryTitle}>Apps</Text>
            <Text style={styles.categoryCount}>37 passwords</Text>
          </Pressable>

          <Pressable
            style={styles.categoryCard}
            onPress={() => handleCategoryPress("cards")}
          >
            <Text style={styles.categoryIcon}>💳</Text>
            <Text style={styles.categoryTitle}>Cards</Text>
            <Text style={styles.categoryCount}>7 passwords</Text>
          </Pressable>
        </View>

        {/* Security Alert */}
        <View style={styles.alertSection}>
          <Text style={styles.sectionTitle}>Security Alert:</Text>
          <Pressable style={styles.alertCard} onPress={handleSecurityAlert}>
            <Text style={styles.alertIcon}>🔓</Text>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>3 Compromised Passwords</Text>
              <Text style={styles.alertSubtitle}>Found in Breach</Text>
            </View>
            <Text style={styles.alertArrow}>→</Text>
          </Pressable>
        </View>

        {/* Recently Added */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recently added</Text>
          <FlatList
            data={recentlyAdded}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <Pressable
                style={styles.recentItem}
                onPress={() => handlePlatformPress(item.platform)}
              >
                <View style={styles.recentItemContent}>
                  <Text style={styles.recentPlatform}>{item.platform}</Text>
                  <Text style={styles.recentCount}>
                    {item.accountCount} accounts
                  </Text>
                </View>
                <Text style={styles.recentMenu}>⋮</Text>
              </Pressable>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4267FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  username: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1B1F3B",
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: "#E0E4EC",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1B1F3B",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E4EC",
    marginBottom: 20,
  },
  titleSection: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#6A7181",
    marginBottom: 4,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1B1F3B",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F6FA",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 25,
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
  categoriesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: "#F4F6FA",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#E0E4EC",
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1B1F3B",
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: "#6A7181",
  },
  alertSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1B1F3B",
    marginBottom: 12,
  },
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F6FA",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E0E4EC",
  },
  alertIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1B1F3B",
    marginBottom: 4,
  },
  alertSubtitle: {
    fontSize: 13,
    color: "#6A7181",
  },
  alertArrow: {
    fontSize: 20,
    color: "#1B1F3B",
    marginLeft: 10,
  },
  recentSection: {
    marginBottom: 20,
  },
  recentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F4F6FA",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E4EC",
  },
  recentItemContent: {
    flex: 1,
  },
  recentPlatform: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1B1F3B",
    marginBottom: 4,
  },
  recentCount: {
    fontSize: 13,
    color: "#6A7181",
  },
  recentMenu: {
    fontSize: 20,
    color: "#1B1F3B",
    marginLeft: 10,
  },
});

