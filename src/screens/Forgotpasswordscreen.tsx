import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Forgotpasswordscreen({ navigation }: any) {
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const questions = [
    "What is the Name of Your First School?",
    "What is the Name of Your first Pet?",
    "What is your favorite color?",
    "What was the name of your first teacher?",
    "What was the name of your first best friend?",
    "What is your favorite book or movie?",
  ];

  const handleSubmit = () => {
    if (!securityQuestion || !answer) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    // TODO: Verify answer with backend
    Alert.alert("Success", "Answer verified! You can now reset your password.");
    navigation.navigate("ResetPassword");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.content}>
        {/* Back Button */}
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        {/* Title */}
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Answer your security question to reset your password
        </Text>

        {/* Security Question */}
        <Text style={styles.inputLabel}>Security Question</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={securityQuestion}
            onValueChange={(itemValue) => setSecurityQuestion(itemValue)}
            dropdownIconColor="#1B1F3B"
          >
            <Picker.Item label="Select a question" value="" />
            {questions.map((q, idx) => (
              <Picker.Item key={idx} label={q} value={q} />
            ))}
          </Picker>
        </View>

        {/* Answer */}
        <Text style={styles.inputLabel}>Answer</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter your answer"
            placeholderTextColor="#9FA5B4"
            style={styles.input}
            value={answer}
            onChangeText={setAnswer}
            autoCapitalize="none"
          />
        </View>

        {/* Submit Button */}
        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Continue</Text>
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
  content: {
    flex: 1,
    padding: 25,
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4267FF",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
    color: "#1B1F3B",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 30,
    color: "#6A7181",
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: "#1B1F3B",
    fontWeight: "600",
  },
  pickerContainer: {
    backgroundColor: "#F4F6FA",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E4EC",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F6FA",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 52,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E0E4EC",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1B1F3B",
  },
  submitButton: {
    backgroundColor: "#4267FF",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

