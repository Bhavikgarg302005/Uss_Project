import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Logscreen from "../screens/Logscreen";
import Signupscreen from "../screens/Signupscreen";
import Settingscreen from "../screens/Settingscreen";
import Resetpasswordscreen from "../screens/Resetpasswordscreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
        <Stack.Screen name="Login" component={Logscreen} />

        <Stack.Screen name="Signup" component={Signupscreen} />

        <Stack.Screen name="Settings" component={Settingscreen} />


        <Stack.Screen name="ResetPassword" component={Resetpasswordscreen} />

        {/* Add Home / Vault screen later */}
        {/* <Stack.Screen name="Home" component={HomeScreen} /> */}

      </Stack.Navigator>
    </NavigationContainer>
  );
}
