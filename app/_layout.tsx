import { Stack, useRouter } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';

function BackButton() {
  const router = useRouter();
  
  return (
    <TouchableOpacity 
      onPress={() => router.push('/dashboard')}
      style={{ 
        backgroundColor: '#f60', 
        paddingHorizontal: 8, 
        paddingVertical: 6, 
        borderRadius: 6, 
        marginRight: 10,
        minWidth: 32,
        alignItems: 'center'
      }}
    >
      <Text style={{ color: '#fff', fontSize: 18 }}></Text>
    </TouchableOpacity>
  );
}


export default function RootLayout() {
  return (
    <Stack screenOptions={{ 
      headerShown: true,
      headerStyle: { backgroundColor: '#f60' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
      headerRight: () => <BackButton/>
    }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="platform-sync" options={{ title: 'เชื่อมข้อมูลแพลตฟอร์ม' }} />
      <Stack.Screen name="farmer" options={{ title: 'ยืนยันข้อมูลเกษตรกร' }} />
      <Stack.Screen name="daily-income" options={{ title: 'บันทึกรายได้ประจำ' }} />
      <Stack.Screen name="self-business" options={{ title: 'ตรวจสอบกิจการส่วนตัว' }} />
      <Stack.Screen name="monthly-trust-tracker" options={{ title: 'ติดตามรายเดือน' }} />
      <Stack.Screen name="upload-formal-debt" options={{ title: 'แจ้งหนี้สินในระบบ' }} />
      <Stack.Screen name="financial-proof" options={{ title: 'หลักฐานวินัยทางการเงิน' }} />
      <Stack.Screen name="income-reliability" options={{ title: 'คะแนนความน่าเชื่อถือรายได้' }} />
      <Stack.Screen name="loan-simulation" options={{ title: 'จำลองเงินกู้' }} />
      <Stack.Screen name="certificate-download" options={{ title: 'ดาวน์โหลดใบรับรอง' }} />
      <Stack.Screen name="eligibility" options={{ title: 'ตรวจสอบสิทธิ์ของคุณ' }} />
    </Stack>
  );
}