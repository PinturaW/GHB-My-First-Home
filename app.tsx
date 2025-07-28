import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import DailyIncomeScreen from './app/daily-income';
import DashboardScreen from './app/dashboard';
import FinancialProofScreen from './app/financial-proof';
import MonthlyTrustTrackerScreen from './app/monthly-trust-tracker';
import PlatformSyncScreen from './app/platform-sync';
import ProfileScreen from './app/ProfileScreen';
import SelfBusinessScreen from './app/self-business';
import UploadFormalDeptScreen from './app/upload-formal-debt';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Profile" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="PlatformSyncScreen" component={PlatformSyncScreen} />
        <Stack.Screen name="DailyIncomeScreen" component={DailyIncomeScreen} />
        <Stack.Screen name="SelfBusinessScreen" component={SelfBusinessScreen} />
        <Stack.Screen name="MonthlyTrustTrackerScreen" component={MonthlyTrustTrackerScreen} />
        <Stack.Screen name="IncomeReliabilityScreen" component={DashboardScreen} />
        <Stack.Screen name="LoanSimulationScreen" component={DashboardScreen} />
        <Stack.Screen name="CertificateDownloadScreen" component={DashboardScreen} />
        <Stack.Screen name="upload-formal-debt" component={UploadFormalDeptScreen} />
        <Stack.Screen name="FinancialProofScreen" component={FinancialProofScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}