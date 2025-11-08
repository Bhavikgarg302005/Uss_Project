import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Modal,
  FlatList,
  Image,
  Alert,
} from "react-native";

interface TrustedUser {
  id: string;
  username: string;
  email: string;
  status: "pending" | "accepted" | "rejected";
  requestedAt?: string;
}

export default function Settingscreen({ navigation }: any) {
  const [trustedUsers, setTrustedUsers] = useState<TrustedUser[]>([
    { id: "1", username: "User1", email: "user1@gmail.com", status: "accepted" },
    { id: "2", username: "User2", email: "user2@gmail.com", status: "accepted" },
    { id: "3", username: "User3", email: "user3@gmail.com", status: "pending", requestedAt: "2 hours ago" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [masterPassword, setMasterPassword] = useState("");

  const handleAddTrustedUser = () => {
    if (!newUsername || !masterPassword) {
      Alert.alert("Error", "Please enter all fields.");
      return;
    }

    // TODO: Securely verify master password with backend and send request
    const newUser: TrustedUser = {
      id: Date.now().toString(),
      username: newUsername,
      email: `${newUsername}@example.com`,
      status: "pending",
      requestedAt: "Just now",
    };

    setTrustedUsers((prev) => [...prev, newUser]);
    setShowModal(false);
    setNewUsername("");
    setMasterPassword("");
    Alert.alert(
      "Request Sent",
      `Trusted user request sent to ${newUsername}. You will be notified when they respond.`,
      [{ text: "OK" }]
    );
  };

  const handleDelete = (id: string) => {
    setTrustedUsers((prev) => prev.filter((u) => u.id !== id));
  };

        const handleLogout = () => {
        console.log("Logout pressed");
        navigation.navigate("Login");
        };


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* <Image
            source={require("../assets/profile.png")}
            style={styles.profileIcon}
          /> */}
          <Text style={styles.username}>Akshat V.</Text>
        </View>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>

      {/* Reset Password */}
      <Pressable
        style={styles.actionButton}
        onPress={() => navigation.navigate("ResetPassword")}
      >
        <Text style={styles.actionText}>🔑 Reset Password</Text>
      </Pressable>

      {/* Add Emergency Access */}
      <Pressable style={styles.actionButton} onPress={() => setShowModal(true)}>
        <Text style={styles.actionText}>➕ Add Emergency Access</Text>
      </Pressable>

      {/* Trusted Users */}
      <Text style={styles.sectionTitle}>Trusted Users</Text>

      <FlatList
        data={trustedUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.trustedBox}>
            <View style={styles.trustedUserInfo}>
              <View style={styles.trustedUserDetails}>
                <Text style={styles.trustedUsername}>{item.username}</Text>
                <Text style={styles.trustedEmail}>{item.email}</Text>
              </View>
              <View style={styles.statusContainer}>
                {item.status === "pending" && (
                  <View style={[styles.statusBadge, styles.pendingBadge]}>
                    <Text style={styles.pendingText}>Pending</Text>
                  </View>
                )}
                {item.status === "accepted" && (
                  <View style={[styles.statusBadge, styles.acceptedBadge]}>
                    <Text style={styles.acceptedText}>Accepted</Text>
                  </View>
                )}
                {item.status === "rejected" && (
                  <View style={[styles.statusBadge, styles.rejectedBadge]}>
                    <Text style={styles.rejectedText}>Rejected</Text>
                  </View>
                )}
              </View>
            </View>
            {item.requestedAt && item.status === "pending" && (
              <Text style={styles.requestedAt}>Requested {item.requestedAt}</Text>
            )}
            {item.status === "accepted" && (
              <View style={styles.trustedActions}>
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id)}
                >
                  <Text style={styles.deleteButtonText}>Remove</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      />

      {/* Modal for Adding Trusted User */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Trusted User</Text>

            <TextInput
              placeholder="Enter username"
              placeholderTextColor="#9FA5B4"
              style={styles.input}
              value={newUsername}
              onChangeText={setNewUsername}
            />

            <TextInput
              placeholder="Enter Master Password"
              placeholderTextColor="#9FA5B4"
              secureTextEntry
              style={styles.input}
              value={masterPassword}
              onChangeText={setMasterPassword}
            />

            <View style={styles.modalButtons}>
              <Pressable style={styles.cancelButton} onPress={() => setShowModal(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.addButton} onPress={handleAddTrustedUser}>
                <Text style={styles.addText}>Send Request</Text>
              </Pressable>
            </View>
            <Text style={styles.modalNote}>
              Note: The user will receive a request and can choose to accept or reject it.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60, // 👈 Add this line (adjust as needed: 40–80 works best)
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileIcon: {
    width: 32,
    height: 32,
    tintColor: "#1B1F3B",
    marginRight: 8,
  },
  username: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1B1F3B",
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: "#E0E4EC",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1B1F3B",
  },
  actionButton: {
    borderWidth: 1,
    borderColor: "#D5D9E2",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#F9FAFC",
  },
  actionText: {
    fontSize: 16,
    color: "#1B1F3B",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1B1F3B",
    marginBottom: 10,
    marginTop: 10,
  },
  trustedBox: {
    borderWidth: 1,
    borderColor: "#E0E4EC",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#F9FAFC",
  },
  trustedUserInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  trustedUserDetails: {
    flex: 1,
  },
  trustedUsername: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1B1F3B",
    marginBottom: 4,
  },
  trustedEmail: {
    fontSize: 13,
    color: "#6A7181",
  },
  statusContainer: {
    marginLeft: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 80,
    alignItems: "center",
  },
  pendingBadge: {
    backgroundColor: "#FEF3C7",
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  pendingText: {
    color: "#D97706",
    fontSize: 11,
    fontWeight: "600",
  },
  acceptedBadge: {
    backgroundColor: "#D1FAE5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  acceptedText: {
    color: "#059669",
    fontSize: 11,
    fontWeight: "600",
  },
  rejectedBadge: {
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  rejectedText: {
    color: "#DC2626",
    fontSize: 11,
    fontWeight: "600",
  },
  requestedAt: {
    fontSize: 12,
    color: "#9FA5B4",
    fontStyle: "italic",
    marginTop: 4,
  },
  trustedActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  deleteButtonText: {
    color: "#DC2626",
    fontSize: 12,
    fontWeight: "600",
  },
  icon: {
    width: 20,
    height: 20,
    marginHorizontal: 6,
    tintColor: "#1B1F3B",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1B1F3B",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E4EC",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 12,
    backgroundColor: "#F4F6FA",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#E0E4EC",
    width: "45%",
    alignItems: "center",
  },
  addButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#4267FF",
    width: "45%",
    alignItems: "center",
  },
  cancelText: {
    color: "#1B1F3B",
    fontWeight: "600",
  },
  addText: {
    color: "#fff",
    fontWeight: "600",
  },
  modalNote: {
    fontSize: 12,
    color: "#6A7181",
    textAlign: "center",
    marginTop: 10,
    fontStyle: "italic",
  },
});
