import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Securityscreen({ navigation }: any) {
  const handleLogout = () => {
    navigation.navigate("Login");
  };

  const handleAlertPress = (type: string) => {
    // Navigate to detailed view of compromised/weak/reused passwords
    navigation.navigate("Vault", { filter: type });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Security Overview Card */}
        <View style={styles.overviewCard}>
          <Text style={styles.shieldIcon}>🛡️</Text>
          <Text style={styles.overviewTitle}>132 Passwords Secure & Safe</Text>
          <Text style={styles.overviewSubtitle}>Last Scanned: 5 minutes ago</Text>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>👥</Text>
            <Text style={styles.summaryTitle}>7 Secure Groups</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>❤️</Text>
            <Text style={styles.summaryTitle}>82% Healthy</Text>
          </View>
        </View>

        {/* Security Alerts */}
        <View style={styles.alertsSection}>
          <Text style={styles.sectionTitle}>Security Alert:</Text>

          <Pressable
            style={styles.alertCard}
            onPress={() => handleAlertPress("compromised")}
          >
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>3 Compromised Passwords</Text>
              <Text style={styles.alertDescription}>
                Your 'Google' and 2 other passwords found in Breach
              </Text>
              <Text style={styles.alertAction}>Review & Change Immediately →</Text>
            </View>
          </Pressable>

          <Pressable
            style={styles.alertCard}
            onPress={() => handleAlertPress("weak")}
          >
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>32 Weak Passwords</Text>
              <Text style={styles.alertDescription}>
                Your 'ITD' and 31 other passwords are vulnerable
              </Text>
              <Text style={styles.alertAction}>Review & Change Immediately →</Text>
            </View>
          </Pressable>

          <Pressable
            style={styles.alertCard}
            onPress={() => handleAlertPress("reused")}
          >
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>46 Reused Passwords</Text>
              <Text style={styles.alertDescription}>
                You have 46 Reused or similar passwords
              </Text>
              <Text style={styles.alertAction}>Review & Change Immediately →</Text>
            </View>
          </Pressable>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 15,
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
    fontSize: 18,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
  },
  overviewCard: {
    backgroundColor: "#F4F6FA",
    borderRadius: 16,
    padding: 25,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E0E4EC",
  },
  shieldIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  overviewTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1B1F3B",
    marginBottom: 8,
    textAlign: "center",
  },
  overviewSubtitle: {
    fontSize: 14,
    color: "#6A7181",
    textAlign: "center",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#F4F6FA",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#E0E4EC",
  },
  summaryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1B1F3B",
    textAlign: "center",
  },
  alertsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1B1F3B",
    marginBottom: 15,
  },
  alertCard: {
    backgroundColor: "#F4F6FA",
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E4EC",
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1B1F3B",
    marginBottom: 6,
  },
  alertDescription: {
    fontSize: 13,
    color: "#6A7181",
    marginBottom: 8,
    lineHeight: 18,
  },
  alertAction: {
    fontSize: 13,
    color: "#4267FF",
    fontWeight: "600",
    marginTop: 4,
  },
});

