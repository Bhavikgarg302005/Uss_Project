import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Alert } from "react-native";

export default function Signupscreen({ navigation }: any) {
  console.log("NAVIGATION PROP IN LOGSCREEN: ", navigation);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const questions = [
    "What is the name of your first school?",
    "What is the name of your first pet?",
    "What is your favorite color?",
    "What was the name of your first teacher?",
  ];

const handleSignup = () => {
  if (!username || !password || !confirmPassword || !answer) {
    Alert.alert("Error", "Please fill in all fields.");
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert("Error", "Passwords do not match!");
    return;
  }

  Alert.alert("Success", "Signup submitted!");
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Securely set up your credentials</Text>

      {/* Username */}
      <Text style={styles.inputLabel}>Username</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter username"
          placeholderTextColor="#9FA5B4"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
      </View>

      {/* Master Password */}
      <Text style={styles.inputLabel}>Type Master Password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Master Password"
          placeholderTextColor="#9FA5B4"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Confirm Master Password */}
      <Text style={styles.inputLabel}>Confirm Master Password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Master Password"
          placeholderTextColor="#9FA5B4"
          secureTextEntry
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      {/* Biometric + FaceScan */}
      <View style={styles.authRow}>
        <Pressable style={styles.authBox}>
          <Image
            source={require("../assets/fingerprint.png")}
            style={styles.authIcon}
          />
          <Text style={styles.authText}>Setup Biometric</Text>
        </Pressable>

        <View style={styles.verticalDivider} />

        <Pressable style={styles.authBox}>
          <Image
            source={require("../assets/facescan.png")}
            style={styles.authIcon}
          />
          <Text style={styles.authText}>Setup FaceScan</Text>
        </Pressable>
      </View>

      {/* Security Question */}
      <Text style={styles.inputLabel}>Security Question</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={securityQuestion}
          onValueChange={(itemValue: any) => setSecurityQuestion(itemValue)}
          dropdownIconColor="#1B1F3B"
        >
          <Picker.Item label="Choose a question" value="" />
          {questions.map((q, idx) => (
            <Picker.Item key={idx} label={q} value={q} />
          ))}
        </Picker>
      </View>

        {/* Answer */}
        <Text style={styles.inputLabel}>Answer</Text>
        <View style={styles.inputContainer}>
        <TextInput
            placeholder="Answer"
            placeholderTextColor="#9FA5B4"
            style={styles.input}
            value={answer}
            onChangeText={setAnswer}
        />
        </View>

        {/* Already have an account */}
        <Pressable onPress={() => navigation.navigate("Login")}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
        </Pressable>

        {/* Signup Button */}
        <Pressable style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>Signup</Text>
        </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
    linkText: {
  color: "#4267FF",
  fontSize: 14,
  fontWeight: "600",
  textAlign: "center",
  marginTop: 10,
},

  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#FFFFFF",
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 20,
    color: "#1B1F3B",
  },

  subtitle: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 25,
    color: "#6A7181",
  },

  inputLabel: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 6,
    color: "#1B1F3B",
    fontWeight: "600",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F6FA",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 52,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E4EC",
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#1B1F3B",
  },

  pickerContainer: {
    backgroundColor: "#F4F6FA",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E4EC",
    marginBottom: 15,
  },

  authRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginVertical: 20,
  },

  authBox: {
    alignItems: "center",
  },

  authIcon: {
    width: 45,
    height: 45,
    tintColor: "#1B1F3B",
  },

  authText: {
    marginTop: 6,
    fontSize: 13,
    color: "#1B1F3B",
    fontWeight: "600",
  },

  verticalDivider: {
    width: 1,
    height: 50,
    backgroundColor: "#D5D9E2",
  },

  signupButton: {
    backgroundColor: "#D4D6DB",
    height: 52,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },

  signupButtonText: {
    color: "#000",
    fontSize: 20,
    fontWeight: "700",
  },
});
