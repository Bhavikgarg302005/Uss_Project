import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PasswordSecurityService, PasswordAnalysis } from "../services/PasswordSecurityService";
import { getAllMockPasswords } from "../services/MockPasswordData";

export default function Securityscreen({ navigation }: any) {
  const [analysis, setAnalysis] = useState<PasswordAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastScanned, setLastScanned] = useState<string>("Just now");

  useEffect(() => {
    scanPasswords();
  }, []);

  const scanPasswords = async () => {
    setLoading(true);
    try {
      // Get all passwords (in real app, this would come from your database)
      const passwords = getAllMockPasswords();
      
      // Analyze passwords
      const result = await PasswordSecurityService.analyzePasswords(passwords);
      setAnalysis(result);
      setLastScanned("Just now");
    } catch (error) {
      console.error("Error scanning passwords:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigation.navigate("Login");
  };

  const handleAlertPress = (type: string) => {
    // Navigate to detailed view of compromised/weak/reused passwords
    navigation.navigate("SecurityDetails", { type, analysis });
  };

  const getHealthColor = (score: number) => {
    if (score >= 75) return "#10B981"; // Green
    if (score >= 50) return "#F59E0B"; // Yellow
    return "#EF4444"; // Red
  };

  const getHealthEmoji = (score: number) => {
    if (score >= 75) return "🟢";
    if (score >= 50) return "🟡";
    return "🔴";
  };

  if (loading || !analysis) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4267FF" />
          <Text style={styles.loadingText}>Scanning passwords...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.overviewTitle}>
            {analysis.totalPasswords} Password{analysis.totalPasswords !== 1 ? "s" : ""} Analyzed
          </Text>
          <Text style={styles.overviewSubtitle}>Last Scanned: {lastScanned}</Text>
          <View style={styles.healthScoreContainer}>
            <Text style={styles.healthScoreLabel}>Security Health:</Text>
            <View style={[styles.healthScoreBadge, { backgroundColor: getHealthColor(analysis.healthScore) + "20" }]}>
              <Text style={[styles.healthScoreText, { color: getHealthColor(analysis.healthScore) }]}>
                {getHealthEmoji(analysis.healthScore)} {analysis.healthScore}%
              </Text>
            </View>
          </View>
          <Pressable style={styles.rescanButton} onPress={scanPasswords}>
            <Text style={styles.rescanButtonText}>🔄 Rescan Passwords</Text>
          </Pressable>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>🔒</Text>
            <Text style={styles.summaryTitle}>{analysis.strongCount} Strong</Text>
            <Text style={styles.summarySubtitle}>Secure passwords</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryIcon}>👥</Text>
            <Text style={styles.summaryTitle}>7 Groups</Text>
            <Text style={styles.summarySubtitle}>Secure groups</Text>
          </View>
        </View>

        {/* Security Alerts */}
        <View style={styles.alertsSection}>
          <Text style={styles.sectionTitle}>Security Alerts:</Text>

          {analysis.compromisedCount > 0 && (
            <Pressable
              style={[styles.alertCard, styles.criticalAlert]}
              onPress={() => handleAlertPress("compromised")}
            >
              <View style={styles.alertContent}>
                <View style={styles.alertHeader}>
                  <Text style={styles.alertIcon}>🚨</Text>
                  <Text style={[styles.alertTitle, styles.criticalTitle]}>
                    {analysis.compromisedCount} Compromised Password{analysis.compromisedCount !== 1 ? "s" : ""}
                  </Text>
                </View>
                <Text style={styles.alertDescription}>
                  {analysis.compromisedPasswords.length > 0 && (
                    <>
                      Your '{analysis.compromisedPasswords[0].platform}' and{' '}
                      {analysis.compromisedCount > 1
                        ? `${analysis.compromisedCount - 1} other password${analysis.compromisedCount > 2 ? "s" : ""}`
                        : ""}{' '}
                      found in data breaches
                    </>
                  )}
                </Text>
                <Text style={styles.alertAction}>Review & Change Immediately →</Text>
              </View>
            </Pressable>
          )}

          {analysis.weakCount > 0 && (
            <Pressable
              style={[styles.alertCard, styles.warningAlert]}
              onPress={() => handleAlertPress("weak")}
            >
              <View style={styles.alertContent}>
                <View style={styles.alertHeader}>
                  <Text style={styles.alertIcon}>⚠️</Text>
                  <Text style={[styles.alertTitle, styles.warningTitle]}>
                    {analysis.weakCount} Weak Password{analysis.weakCount !== 1 ? "s" : ""}
                  </Text>
                </View>
                <Text style={styles.alertDescription}>
                  {analysis.weakPasswords.length > 0 && (
                    <>
                      Your '{analysis.weakPasswords[0].platform}' and{' '}
                      {analysis.weakCount > 1
                        ? `${analysis.weakCount - 1} other password${analysis.weakCount > 2 ? "s" : ""}`
                        : ""}{' '}
                      are vulnerable
                    </>
                  )}
                </Text>
                <Text style={styles.alertAction}>Review & Strengthen →</Text>
              </View>
            </Pressable>
          )}

          {analysis.reusedCount > 0 && (
            <Pressable
              style={[styles.alertCard, styles.infoAlert]}
              onPress={() => handleAlertPress("reused")}
            >
              <View style={styles.alertContent}>
                <View style={styles.alertHeader}>
                  <Text style={styles.alertIcon}>🔁</Text>
                  <Text style={[styles.alertTitle, styles.infoTitle]}>
                    {analysis.reusedCount} Reused Password{analysis.reusedCount !== 1 ? "s" : ""}
                  </Text>
                </View>
                <Text style={styles.alertDescription}>
                  You have {analysis.reusedCount} reused or similar password{analysis.reusedCount !== 1 ? "s" : ""}
                </Text>
                <Text style={styles.alertAction}>Review & Replace →</Text>
              </View>
            </Pressable>
          )}

          {analysis.compromisedCount === 0 && analysis.weakCount === 0 && analysis.reusedCount === 0 && (
            <View style={[styles.alertCard, styles.successAlert]}>
              <View style={styles.alertContent}>
                <Text style={styles.alertIcon}>✅</Text>
                <Text style={[styles.alertTitle, styles.successTitle]}>All Clear!</Text>
                <Text style={styles.alertDescription}>
                  Your passwords are secure. No issues found.
                </Text>
              </View>
            </View>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6A7181",
  },
  healthScoreContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  healthScoreLabel: {
    fontSize: 14,
    color: "#6A7181",
    marginBottom: 8,
  },
  healthScoreBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
  },
  healthScoreText: {
    fontSize: 18,
    fontWeight: "700",
  },
  rescanButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#4267FF",
  },
  rescanButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  summarySubtitle: {
    fontSize: 12,
    color: "#6A7181",
    marginTop: 4,
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  alertIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  criticalAlert: {
    borderColor: "#EF4444",
    backgroundColor: "#FEE2E2",
  },
  criticalTitle: {
    color: "#DC2626",
  },
  warningAlert: {
    borderColor: "#F59E0B",
    backgroundColor: "#FEF3C7",
  },
  warningTitle: {
    color: "#D97706",
  },
  infoAlert: {
    borderColor: "#3B82F6",
    backgroundColor: "#DBEAFE",
  },
  infoTitle: {
    color: "#2563EB",
  },
  successAlert: {
    borderColor: "#10B981",
    backgroundColor: "#D1FAE5",
  },
  successTitle: {
    color: "#059669",
  },
});

