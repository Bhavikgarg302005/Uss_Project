import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Group {
  id: string;
  name: string;
  accountCount?: number;
}

export default function SelectGroupsscreen({ navigation, route }: any) {
  const platform = route?.params?.platform || "Platform";
  const [selectedGroups, setSelectedGroups] = useState<string[]>([
    "1",
    "2",
  ]);

  const groups: Group[] = [
    { id: "1", name: "Family", accountCount: 0 },
    { id: "2", name: "Friends", accountCount: 0 },
    { id: "3", name: "IIITD-UsS", accountCount: 0 },
    { id: "4", name: "Design Hub", accountCount: 2 },
    { id: "5", name: "Tech Council", accountCount: 3 },
  ];

  const toggleGroupSelection = (groupId: string) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleSave = () => {
    // TODO: Save selected groups to backend
    Alert.alert("Success", "Groups updated successfully!", [
      {
        text: "OK",
        onPress: () => navigation.goBack(),
      },
    ]);
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
        <Text style={styles.title}>Select Groups</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isSelected = selectedGroups.includes(item.id);
          return (
            <Pressable
              style={[
                styles.groupItem,
                isSelected && styles.groupItemSelected,
              ]}
              onPress={() => toggleGroupSelection(item.id)}
            >
              <View style={styles.groupContent}>
                <View
                  style={[
                    styles.checkbox,
                    isSelected && styles.checkboxSelected,
                  ]}
                >
                  {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <View style={styles.groupInfo}>
                  <Text
                    style={[
                      styles.groupName,
                      isSelected && styles.groupNameSelected,
                    ]}
                  >
                    {item.name}
                  </Text>
                  {item.accountCount !== undefined && item.accountCount > 0 && (
                    <Text style={styles.groupCount}>
                      {item.accountCount} accounts
                    </Text>
                  )}
                </View>
              </View>
            </Pressable>
          );
        }}
      />

      {/* Save Button */}
      <View style={styles.footer}>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </View>
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
  listContent: {
    padding: 20,
  },
  groupItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F6FA",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#E0E4EC",
  },
  groupItemSelected: {
    borderColor: "#4267FF",
    backgroundColor: "#E8EBFF",
  },
  groupContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#D5D9E2",
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  checkboxSelected: {
    borderColor: "#4267FF",
    backgroundColor: "#4267FF",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1B1F3B",
    marginBottom: 4,
  },
  groupNameSelected: {
    color: "#4267FF",
    fontWeight: "700",
  },
  groupCount: {
    fontSize: 13,
    color: "#6A7181",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E4EC",
  },
  saveButton: {
    backgroundColor: "#4267FF",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});

