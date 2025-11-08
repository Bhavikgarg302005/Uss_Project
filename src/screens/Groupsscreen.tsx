import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Group {
  id: string;
  name: string;
  memberCount: number;
}

export default function Groupsscreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState("");
  const [groups, setGroups] = useState<Group[]>([
    { id: "1", name: "IIITD UsS", memberCount: 5 },
    { id: "2", name: "Family", memberCount: 6 },
    { id: "3", name: "Friends", memberCount: 3 },
    { id: "4", name: "Design Club", memberCount: 9 },
    { id: "5", name: "E-Cell", memberCount: 11 },
    { id: "6", name: "Technical Council", memberCount: 7 },
    { id: "7", name: "BTP", memberCount: 3 },
    { id: "8", name: "IIITD-Tech Council", memberCount: 2 },
  ]);

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

      {/* Add Group Button */}
      <Pressable
        style={styles.addButton}
        onPress={() => navigation.navigate("AddGroup")}
      >
        <Text style={styles.addButtonText}>+ Add Groups</Text>
      </Pressable>

      {/* Groups List */}
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
              </Text>
            </View>
            <Text style={styles.menuIcon}>⋮</Text>
          </Pressable>
        )}
      />
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
});

