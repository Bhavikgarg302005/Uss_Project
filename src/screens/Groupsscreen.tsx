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
import { groupsAPI } from "../services/api";

interface Group {
  id: string;
  name: string;
  memberCount: number;
  isAdmin?: boolean;
}

export default function Groupsscreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    setLoading(true);
    try {
      const data = await groupsAPI.listSummaries();
      const groupList: Group[] = data.map((g: any, index: number) => ({
        id: `${g.group_name}-${index}`,
        name: g.group_name,
        memberCount: g.member_count ?? 0,
        isAdmin: !!g.is_admin,
      }));
      setGroups(groupList);
    } catch (error: any) {
      console.error("Error loading groups:", error);
      Alert.alert("Error", "Failed to load groups");
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async () => {
    if (creating) return;
    // Simple prompt (works on iOS; on Android this no-ops in some RN versions)
    // Fallback: use a default name if prompt unavailable
    // @ts-ignore
    let name = typeof prompt === "function" ? prompt("Enter group name") : "";
    if (!name) {
      name = `group-${Date.now()}`;
    }
    try {
      setCreating(true);
      await groupsAPI.create(name);
      await loadGroups();
    } catch (e) {
      console.error("Create group failed:", e);
      Alert.alert("Error", "Failed to create group");
    } finally {
      setCreating(false);
    }
  };

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGroupPress = (group: Group) => {
    // Navigate to group details
    navigation.navigate("GroupDetails", { group });
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
        <Text style={styles.title}>Groups</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search groups..."
          placeholderTextColor="#9FA5B4"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Create Group Button */}
      <Pressable style={styles.addButton} onPress={createGroup}>
        <Text style={styles.addButtonText}>
          {creating ? "Creating..." : "+ Create Group"}
        </Text>
      </Pressable>

      {/* Groups List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4267FF" />
          <Text style={styles.loadingText}>Loading groups...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredGroups}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable
              style={styles.groupItem}
              onPress={() => handleGroupPress(item)}
            >
              <View style={styles.groupContent}>
                <Text style={styles.groupName}>{item.name}</Text>
                <Text style={styles.groupCount}>
                  {item.memberCount} {item.memberCount === 1 ? "Member" : "Members"}
                  {item.isAdmin ? " • Admin" : ""}
                </Text>
              </View>
              <Text style={styles.menuIcon}>⋮</Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No groups found</Text>
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
  groupItem: {
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
  groupContent: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1B1F3B",
    marginBottom: 4,
  },
  groupCount: {
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

