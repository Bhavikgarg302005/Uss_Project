import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface PasswordAccount {
  id: string;
  username: string;
  password: string;
  strength: "Strong" | "Medium" | "Weak";
}

export default function PasswordDetailsscreen({ navigation, route }: any) {
  const platform = route?.params?.platform || "Platform";
  const [accounts, setAccounts] = useState<PasswordAccount[]>([
    {
      id: "1",
      username: "user1@facebook.com",
      password: "password123",
      strength: "Strong",
    },
    {
      id: "2",
      username: "user2@facebook.com",
      password: "weakpass",
      strength: "Weak",
    },
    {
      id: "3",
      username: "user3@facebook.com",
      password: "0A63eBCUsSCourseKiMKC#69",
      strength: "Medium",
    },
  ]);
  const [visiblePasswords, setVisiblePasswords] = useState<{ [key: string]: boolean }>({});
  const [editingAccount, setEditingAccount] = useState<PasswordAccount | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "Strong":
        return "#10B981";
      case "Medium":
        return "#F59E0B";
      case "Weak":
        return "#EF4444";
      default:
        return "#6A7181";
    }
  };

  const handleEdit = (account: PasswordAccount) => {
    setEditingAccount({ ...account });
  };

  const handleSaveEdit = () => {
    if (editingAccount) {
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === editingAccount.id ? editingAccount : acc
        )
      );
      setEditingAccount(null);
      Alert.alert("Success", "Password updated successfully!");
    }
  };

  const handleDelete = (id: string) => {
    setAccountToDelete(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (deleteConfirm.toLowerCase() === "delete") {
      setAccounts((prev) => prev.filter((acc) => acc.id !== accountToDelete));
      setDeleteModalVisible(false);
      setDeleteConfirm("");
      setAccountToDelete(null);
      Alert.alert("Success", "Password deleted successfully!");
    } else {
      Alert.alert("Error", "Please type 'delete' to confirm.");
    }
  };

  const handleCopy = (password: string) => {
    // TODO: Implement clipboard copy using @react-native-clipboard/clipboard
    Alert.alert("Copied", "Password copied to clipboard!");
  };

  const handleShare = () => {
    navigation.navigate("SelectGroups", { platform });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>{platform}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {accounts.map((account) => (
          <View key={account.id} style={styles.accountCard}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={account.username}
                editable={editingAccount?.id === account.id}
                onChangeText={(text) => {
                  if (editingAccount) {
                    setEditingAccount({ ...editingAccount, username: text });
                  }
                }}
              />
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={visiblePasswords[account.id] ? account.password : "••••••••"}
                secureTextEntry={!visiblePasswords[account.id]}
                editable={editingAccount?.id === account.id}
                onChangeText={(text) => {
                  if (editingAccount) {
                    setEditingAccount({ ...editingAccount, password: text });
                  }
                }}
              />
              <Pressable
                style={styles.eyeButton}
                onPress={() => togglePasswordVisibility(account.id)}
              >
                <Text style={styles.eyeIcon}>
                  {visiblePasswords[account.id] ? "🙈" : "👁️"}
                </Text>
              </Pressable>
            </View>

            <View style={styles.strengthContainer}>
              <Text style={styles.strengthLabel}>Password Strength:</Text>
              <View
                style={[
                  styles.strengthBadge,
                  { backgroundColor: getStrengthColor(account.strength) + "20" },
                ]}
              >
                <Text
                  style={[
                    styles.strengthText,
                    { color: getStrengthColor(account.strength) },
                  ]}
                >
                  {account.strength}
                </Text>
              </View>
            </View>

            {editingAccount?.id === account.id ? (
              <View style={styles.editActions}>
                <Pressable
                  style={styles.saveButton}
                  onPress={handleSaveEdit}
                >
                  <Text style={styles.saveButtonText}>✓ Save</Text>
                </Pressable>
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => setEditingAccount(null)}
                >
                  <Text style={styles.cancelButtonText}>✕ Cancel</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.actionButtons}>
                <Pressable
                  style={styles.actionButton}
                  onPress={() => handleDelete(account.id)}
                >
                  <Text style={styles.actionIcon}>🗑️</Text>
                </Pressable>
                <Pressable
                  style={styles.actionButton}
                  onPress={() => handleEdit(account)}
                >
                  <Text style={styles.actionIcon}>✏️</Text>
                </Pressable>
                <Pressable
                  style={styles.actionButton}
                  onPress={() => handleCopy(account.password)}
                >
                  <Text style={styles.actionIcon}>📋</Text>
                </Pressable>
                <Pressable
                  style={styles.actionButton}
                  onPress={handleShare}
                >
                  <Text style={styles.actionIcon}>📤</Text>
                </Pressable>
              </View>
            )}
          </View>
        ))}

        {/* Notes Section */}
        <View style={styles.notesContainer}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Add notes....."
            placeholderTextColor="#9FA5B4"
            multiline
            numberOfLines={4}
          />
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Password</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete this password? If yes, type
              "delete" in the box below.
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Type 'delete' to confirm"
              placeholderTextColor="#9FA5B4"
              value={deleteConfirm}
              onChangeText={setDeleteConfirm}
              autoCapitalize="none"
            />
            <View style={styles.modalButtons}>
              <Pressable
                style={styles.modalCancelButton}
                onPress={() => {
                  setDeleteModalVisible(false);
                  setDeleteConfirm("");
                }}
              >
                <Text style={styles.modalCancelText}>✕ Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.modalDeleteButton}
                onPress={confirmDelete}
              >
                <Text style={styles.modalDeleteText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    textTransform: "capitalize",
  },
  placeholder: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  accountCard: {
    backgroundColor: "#F4F6FA",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E4EC",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1B1F3B",
    marginBottom: 8,
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 45,
    borderWidth: 1,
    borderColor: "#E0E4EC",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1B1F3B",
  },
  eyeButton: {
    padding: 5,
  },
  eyeIcon: {
    fontSize: 20,
  },
  strengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  strengthLabel: {
    fontSize: 13,
    color: "#6A7181",
    marginRight: 8,
  },
  strengthBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  actionButton: {
    marginLeft: 15,
    padding: 8,
  },
  actionIcon: {
    fontSize: 20,
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#10B981",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginRight: 8,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#EF4444",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginLeft: 8,
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  notesContainer: {
    marginTop: 10,
  },
  notesInput: {
    backgroundColor: "#F4F6FA",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: "#1B1F3B",
    borderWidth: 1,
    borderColor: "#E0E4EC",
    minHeight: 100,
    textAlignVertical: "top",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    width: "85%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1B1F3B",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    color: "#6A7181",
    marginBottom: 15,
    lineHeight: 20,
  },
  modalInput: {
    backgroundColor: "#F4F6FA",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: "#1B1F3B",
    borderWidth: 1,
    borderColor: "#E0E4EC",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: "#E0E4EC",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginRight: 8,
  },
  modalCancelText: {
    color: "#1B1F3B",
    fontSize: 14,
    fontWeight: "600",
  },
  modalDeleteButton: {
    flex: 1,
    backgroundColor: "#EF4444",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginLeft: 8,
  },
  modalDeleteText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});

