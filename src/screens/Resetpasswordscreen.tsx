import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function Resetpasswordscreen({ navigation }: any) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const questions = [
    "What is the Name of Your First School?",
    "What is the Name of Your first Pet?",
    "What is your favorite color?",
    "What was the name of your first teacher?",
  ];

  // 🧠 TODO: Fetch security question from backend for logged-in user
  useEffect(() => {
    // Example placeholder:
    setSecurityQuestion("What is the Name of Your First School?");
  }, []);

  const handleReset = async () => {
    if (!currentPassword || !answer || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // 🧠 TODO: Call backend API to verify and update password securely
      const response = await fetch("http://YOUR_BACKEND_IP:8000/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_password: currentPassword,
          question: securityQuestion,
          security_answer: answer,
          new_password: newPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Password reset failed");

      Alert.alert("Success", "Password updated successfully!");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🧭 Back button method
  const handleGoBack = () => {
    navigation.navigate("Settings");
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <Pressable onPress={handleGoBack} style={styles.backButton}>
        {/* <Image
          source={require("../assets/back.png")} // 🧠 Add an arrow-left icon here (or use text fallback)
          style={styles.backIcon}
        /> */}
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      {/* Title */}
      <Text style={styles.title}>Reset Master Password</Text>
      <Text style={styles.subtitle}>
        Ensure you remember your new password securely
      </Text>

      {/* Current Password */}
      <Text style={styles.inputLabel}>Current Password</Text>
      <TextInput
        placeholder="Enter current password"
        placeholderTextColor="#9FA5B4"
        secureTextEntry
        style={styles.input}
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />

      {/* Security Question */}
      <Text style={styles.inputLabel}>Security Question</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={securityQuestion}
          onValueChange={(itemValue) => setSecurityQuestion(itemValue)}
          dropdownIconColor="#1B1F3B"
        >
          <Picker.Item label="Select Question" value="" />
          {questions.map((q, idx) => (
            <Picker.Item key={idx} label={q} value={q} />
          ))}
        </Picker>
      </View>

      {/* Answer */}
      <Text style={styles.inputLabel}>Answer</Text>
      <TextInput
        placeholder="Enter your answer"
        placeholderTextColor="#9FA5B4"
        style={styles.input}
        value={answer}
        onChangeText={setAnswer}
      />

      {/* New Password */}
      <Text style={styles.inputLabel}>New Password</Text>
      <TextInput
        placeholder="Enter new password"
        placeholderTextColor="#9FA5B4"
        secureTextEntry
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
      />

      {/* Confirm Password */}
      <Text style={styles.inputLabel}>Confirm New Password</Text>
      <TextInput
        placeholder="Re-enter new password"
        placeholderTextColor="#9FA5B4"
        secureTextEntry
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Reset Button */}
      <Pressable
        style={[styles.resetButton, loading && { opacity: 0.7 }]}
        onPress={handleReset}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.resetButtonText}>Reset Password</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 25,
    paddingTop: 60,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backIcon: {
    width: 22,
    height: 22,
    tintColor: "#1B1F3B",
    marginRight: 6,
  },
  backText: {
    color: "#1B1F3B",
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1B1F3B",
    textAlign: "center",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#6A7181",
    textAlign: "center",
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1B1F3B",
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: "#F4F6FA",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E4EC",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#F4F6FA",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E4EC",
    padding: 12,
    fontSize: 15,
    marginBottom: 15,
  },
  resetButton: {
    backgroundColor: "#4267FF",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});
