import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DashboardScreen() {
  const router = useRouter();
  
  // ตัวแปรควบคุมคะแนนและสิทธิ์
  const irsScore = 100; // เปลี่ยนเป็น state จริงในระบบ
  const maxIrsScore = 100;
  const isScoreComplete = irsScore >= maxIrsScore;

  // เมนูพื้นฐาน
  const baseMenu = [
    {
      section: 'การยืนยันรายได้และตัวตน',
      items: [
        { label: 'เชื่อมข้อมูลแพลตฟอร์ม', screen: 'platform-sync', icon: '🔄' },
        { label: 'ตรวจสอบกิจการส่วนตัว', screen: 'self-business', icon: '🏪' },
        { label: 'บันทึกรายได้ประจำ', screen: 'daily-income', icon: '📒' },
        { label: 'ตรวจสอบข้อมูลเกษตรกร', screen: 'farmer', icon: '🌾' },
      ],
    },
    {
      section: 'พฤติกรรมทางการเงิน',
      items: [
        { label: 'แจ้งหนี้สินในระบบ', screen: 'upload-formal-debt', icon: '💳' },
        { label: 'หลักฐานวินัยทางการเงิน', screen: 'financial-proof', icon: '📑' },
        { label: 'ติดตามรายเดือน', screen: 'monthly-trust-tracker', icon: '📅' },
      ],
    },
    {
      section: 'คะแนนเครดิตและตรวจสอบสิทธิ์',
      items: [
        { label: 'คะแนนเครดิต', screen: 'income-reliability', icon: '💰' },
        { label: 'จำลองเงินกู้', screen: 'loan-simulation', icon: '🧮' },
        { label: 'ดูสิทธิ์ที่มีโอกาสได้รับ', screen: 'eligibility', icon: '🔍' },
      ],
    },
  ];

  // เพิ่มเมนูดาวน์โหลดเมื่อคะแนนครบ
  if (isScoreComplete) {
    baseMenu[2].items.unshift({
      label: 'ดาวน์โหลดใบรับรอง',
      screen: 'certificate-download',
      icon: '📄',
    });
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLogo}>🏠</Text>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>GH BANK</Text>
          <Text style={styles.headerSubtitle}>My First Home</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Certificate Ready Notification */}
        {isScoreComplete && (
          <View style={styles.certificateNotification}>
            <View style={styles.notificationContent}>
              <Text style={styles.congratsIcon}>🎉</Text>
              <Text style={styles.notificationTitle}>ยินดีด้วย! คะแนนของคุณครบแล้ว</Text>
              <Text style={styles.notificationSubtitle}>
                คุณสามารถดาวน์โหลดใบรับรองความน่าเชื่อถือได้แล้ว
              </Text>
              <TouchableOpacity 
                style={styles.downloadNavigationButton}
                onPress={() => router.push('/certificate-download')}
              >
                <Text style={styles.downloadButtonText}>📄 ไปหน้าดาวน์โหลดใบรับรอง</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>GHB My First Home</Text>
          <Text style={styles.welcomeText}>ยินดีต้อนรับ XXX</Text>
        </View>

        {/* Menu Sections */}
        {baseMenu.map((section, idx) => (
          <View key={section.section} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.section}</Text>
            <View style={styles.menuGrid}>
              {section.items.map((item, i) => (
                <TouchableOpacity
                  key={`${item.label}-${i}`}
                  style={[
                    styles.menuItem,
                    item.screen === 'certificate-download' && styles.highlightMenuItem
                  ]}
                  onPress={() => router.push(`/${item.screen}`)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.iconContainer,
                    item.screen === 'certificate-download' && styles.highlightIconContainer
                  ]}>
                    <Text style={styles.icon}>{item.icon}</Text>
                  </View>
                  <Text style={[
                    styles.menuLabel,
                    item.screen === 'certificate-download' && styles.highlightMenuLabel
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    backgroundColor: '#ff6600',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerLogo: {
    fontSize: 36,
    marginRight: 15,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  
  // Certificate Notification Styles
  certificateNotification: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  notificationContent: {
    padding: 20,
    alignItems: 'center',
  },
  congratsIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 8,
  },
  notificationSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  downloadNavigationButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 25,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Original Styles
  welcomeCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6600',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  menuSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '23%', // เปลี่ยนจาก 31% เป็น 23% เพื่อให้แสดง 4 ปุ่มต่อแถว
    alignItems: 'center',
    marginBottom: 20,
    padding: 4, // ลด padding เล็กน้อย
  },
  iconContainer: {
    width: 50, // ลดขนาดจาก 60 เป็น 50
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff5f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8, // ลดจาก 12 เป็น 8
    borderWidth: 1,
    borderColor: '#ffe6d9',
    shadowColor: '#ff6600',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    fontSize: 20, // ลดขนาดจาก 24 เป็น 20
  },
  menuLabel: {
    fontSize: 11, // ลดขนาดจาก 12 เป็น 11
    color: '#333',
    textAlign: 'center',
    lineHeight: 14,
    fontWeight: '500',
    paddingHorizontal: 2,
  },

  // Highlight styles for certificate download menu item
  highlightMenuItem: {
    transform: [{ scale: 1.02 }],
  },
  highlightIconContainer: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4CAF50',
    shadowColor: '#4CAF50',
  },
  highlightMenuLabel: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});
