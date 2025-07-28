import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const [occupation, setOccupation] = useState('');
  const [incomeType, setIncomeType] = useState('รายวัน');
  const [income, setIncome] = useState('');
  const [statement, setStatement] = useState(null);
  const [idCard, setIdCard] = useState(null);

  const occupations = [
    { id: 'employee', label: 'เกษตรกร', icon: '🧑🏻‍🌾', desc: 'ทำเกษตรกรรม' },
    { id: 'business', label: 'เจ้าของกิจการ', icon: '🏪', desc: 'ธุรกิจส่วนตัว' },
    { id: 'freelance', label: 'ฟรีแลนซ์', icon: '💻', desc: 'งานอิสระ' },
    { id: 'rider', label: 'ไรเดอร์', icon: '🛵', desc: 'พนักงานส่งอาหาร' },
    { id: 'other', label: 'อื่น ๆ', icon: '📋', desc: 'อาชีพอื่น' }
  ];

  const incomeTypes = ['รายวัน', 'รายสัปดาห์', 'รายเดือน'];

  const pickImage = async (setter) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setter(result.assets[0].uri);
    }
  };

  const calculateMonthlyIncome = () => {
    const incomeNum = parseFloat(income);
    if (isNaN(incomeNum) || incomeNum <= 0) return null;
    switch (incomeType) {
      case 'รายวัน': return incomeNum * 30;
      case 'รายสัปดาห์': return incomeNum * 4;
      case 'รายเดือน': return incomeNum;
      default: return null;
    }
  };

  // คำนวณ Progress
  const calculateProgress = () => {
    const totalSteps = 4; // occupation, income, statement, idCard
    let completedSteps = 0;
    
    if (occupation) completedSteps++;
    if (income && calculateMonthlyIncome()) completedSteps++;
    if (statement) completedSteps++;
    if (idCard) completedSteps++;
    
    return (completedSteps / totalSteps) * 100;
  };

  const getProgressStatus = () => {
    const progress = calculateProgress();
    if (progress === 100) return { text: 'ข้อมูลครบถ้วนแล้ว', color: '#4CAF50' };
    if (progress >= 75) return { text: 'เกือบเสร็จแล้ว!', color: '#ff6600' };
    if (progress >= 50) return { text: 'ดำเนินการต่อ...', color: '#FF9800' };
    return { text: 'เริ่มต้นกรอกข้อมูล', color: '#999' };
  };

  const onConfirm = () => {
    Keyboard.dismiss();

    if (!occupation || !income || !statement || !idCard) {
      Alert.alert('กรุณากรอกข้อมูลให้ครบถ้วน', 'โปรดกรอกข้อมูลและอัปโหลดเอกสารทุกรายการ');
      return;
    }

    const monthly = calculateMonthlyIncome();
    if (monthly === null) {
      Alert.alert('กรุณากรอกจำนวนรายได้ที่ถูกต้อง');
      return;
    }

    router.push({
      pathname: '/dashboard',
      params: {
        occupation,
        income: monthly.toString(),
      },
    });
  };

  const monthlyIncome = calculateMonthlyIncome();
  const progressPercentage = calculateProgress();
  const progressStatus = getProgressStatus();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.header}>โปรไฟล์รายได้</Text>
        <Text style={styles.subtitle}>กรอกข้อมูลเพื่อประเมินสิทธิ์การกู้</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Progress Card */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>ความคืบหน้า</Text>
              <Text style={styles.progressPercentage}>{Math.round(progressPercentage)}%</Text>
            </View>
            
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBg}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { 
                      width: `${progressPercentage}%`,
                      backgroundColor: progressStatus.color
                    }
                  ]} 
                />
              </View>
            </View>
            
            <Text style={[styles.progressStatus, { color: progressStatus.color }]}>
              {progressStatus.text}
            </Text>

            {/* Progress Steps Detail */}
            <View style={styles.progressSteps}>
              <View style={styles.progressStep}>
                <View style={[
                  styles.progressStepDot,
                  occupation ? styles.progressStepCompleted : styles.progressStepPending
                ]}>
                  <Text style={styles.progressStepIcon}>
                    {occupation ? '✓' : '1'}
                  </Text>
                </View>
                <Text style={styles.progressStepLabel}>อาชีพ</Text>
              </View>
              
              <View style={styles.progressStep}>
                <View style={[
                  styles.progressStepDot,
                  (income && monthlyIncome) ? styles.progressStepCompleted : styles.progressStepPending
                ]}>
                  <Text style={styles.progressStepIcon}>
                    {(income && monthlyIncome) ? '✓' : '2'}
                  </Text>
                </View>
                <Text style={styles.progressStepLabel}>รายได้</Text>
              </View>
              
              <View style={styles.progressStep}>
                <View style={[
                  styles.progressStepDot,
                  statement ? styles.progressStepCompleted : styles.progressStepPending
                ]}>
                  <Text style={styles.progressStepIcon}>
                    {statement ? '✓' : '3'}
                  </Text>
                </View>
                <Text style={styles.progressStepLabel}>Statement</Text>
              </View>
              
              <View style={styles.progressStep}>
                <View style={[
                  styles.progressStepDot,
                  idCard ? styles.progressStepCompleted : styles.progressStepPending
                ]}>
                  <Text style={styles.progressStepIcon}>
                    {idCard ? '✓' : '4'}
                  </Text>
                </View>
                <Text style={styles.progressStepLabel}>บัตรประชาชน</Text>
              </View>
            </View>
          </View>

          {/* Occupation Section */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>เลือกอาชีพของคุณ</Text>
              {occupation && (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedBadgeText}>✓ เสร็จแล้ว</Text>
                </View>
              )}
            </View>
            <View style={styles.occupationGrid}>
              {occupations.map((occ) => (
                <TouchableOpacity
                  key={occ.id}
                  style={[
                    styles.occupationCard,
                    occupation === occ.label && styles.occupationCardSelected
                  ]}
                  onPress={() => setOccupation(occ.label)}
                >
                  <Text style={styles.occupationIcon}>{occ.icon}</Text>
                  <Text style={[
                    styles.occupationLabel,
                    occupation === occ.label && styles.occupationLabelSelected
                  ]}>
                    {occ.label}
                  </Text>
                  <Text style={styles.occupationDesc}>{occ.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Income Section */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>รายได้ของคุณ</Text>
              {(income && monthlyIncome) && (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedBadgeText}>✓ เสร็จแล้ว</Text>
                </View>
              )}
            </View>
            
            {/* Income Type Selector */}
            <Text style={styles.inputLabel}>รูปแบบรายได้</Text>
            <View style={styles.incomeTypeRow}>
              {incomeTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.incomeTypeButton,
                    incomeType === type && styles.incomeTypeSelected
                  ]}
                  onPress={() => setIncomeType(type)}
                >
                  <Text style={[
                    styles.incomeTypeText,
                    incomeType === type && styles.incomeTypeTextSelected
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Income Amount Input */}
            <Text style={styles.inputLabel}>จำนวนเงิน</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>฿</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0"
                keyboardType="numeric"
                value={income}
                onChangeText={setIncome}
                returnKeyType="done"
              />
              <Text style={styles.incomeUnit}>/{incomeType}</Text>
            </View>

            {/* Monthly Income Display */}
            {monthlyIncome && (
              <View style={styles.monthlyIncomeCard}>
                <Text style={styles.monthlyIncomeLabel}>รายได้ต่อเดือนประมาณ</Text>
                <Text style={styles.monthlyIncomeAmount}>
                  ฿{monthlyIncome.toLocaleString()}
                </Text>
              </View>
            )}
          </View>

          {/* Document Upload Section */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>เอกสารประกอบ</Text>
              {(statement && idCard) && (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedBadgeText}>✓ เสร็จแล้ว</Text>
                </View>
              )}
            </View>
            
            {/* Statement Upload */}
            <View style={styles.uploadSection}>
              <View style={styles.uploadHeader}>
                <Text style={styles.uploadTitle}>📄 Statement ธนาคาร</Text>
                {statement && (
                  <View style={styles.uploadCompletedBadge}>
                    <Text style={styles.uploadCompletedText}>✓</Text>
                  </View>
                )}
              </View>
              <Text style={styles.uploadDesc}>ยอดเงินเข้า-ออก 6 เดือนล่าสุด</Text>
              
              {!statement ? (
                <TouchableOpacity 
                  style={styles.uploadButton}
                  onPress={() => pickImage(setStatement)}
                >
                  <View style={styles.uploadIconContainer}>
                    <Text style={styles.uploadIcon}>📎</Text>
                  </View>
                  <Text style={styles.uploadButtonText}>เลือกไฟล์ Statement</Text>
                  <Text style={styles.uploadHint}>รองรับ JPG, PNG, PDF</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.uploadedFile}>
                  <Image source={{ uri: statement }} style={styles.uploadedImage} />
                  <View style={styles.uploadedInfo}>
                    <Text style={styles.uploadedLabel}>✅ อัปโหลดแล้ว</Text>
                    <TouchableOpacity onPress={() => pickImage(setStatement)}>
                      <Text style={styles.changeFileButton}>เปลี่ยนไฟล์</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* ID Card Upload */}
            <View style={styles.uploadSection}>
              <View style={styles.uploadHeader}>
                <Text style={styles.uploadTitle}>🆔 บัตรประจำตัวประชาชน</Text>
                {idCard && (
                  <View style={styles.uploadCompletedBadge}>
                    <Text style={styles.uploadCompletedText}>✓</Text>
                  </View>
                )}
              </View>
              <Text style={styles.uploadDesc}>หน้าบัตรที่ชัดเจน อ่านได้ทุกตัวอักษร</Text>
              
              {!idCard ? (
                <TouchableOpacity 
                  style={styles.uploadButton}
                  onPress={() => pickImage(setIdCard)}
                >
                  <View style={styles.uploadIconContainer}>
                    <Text style={styles.uploadIcon}>📎</Text>
                  </View>
                  <Text style={styles.uploadButtonText}>เลือกไฟล์บัตรประชาชน</Text>
                  <Text style={styles.uploadHint}>รองรับ JPG, PNG</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.uploadedFile}>
                  <Image source={{ uri: idCard }} style={styles.uploadedImage} />
                  <View style={styles.uploadedInfo}>
                    <Text style={styles.uploadedLabel}>✅ อัปโหลดแล้ว</Text>
                    <TouchableOpacity onPress={() => pickImage(setIdCard)}>
                      <Text style={styles.changeFileButton}>เปลี่ยนไฟล์</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom Button */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={[
              styles.confirmButton,
              progressPercentage !== 100 && styles.confirmButtonDisabled
            ]} 
            onPress={onConfirm}
            disabled={progressPercentage !== 100}
          >
            <Text style={styles.confirmButtonText}>
              {progressPercentage === 100 ? 'ดำเนินการต่อ' : `ดำเนินการต่อ (${Math.round(progressPercentage)}%)`}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  headerSection: {
    backgroundColor: '#fff',
    padding: 24,
    paddingTop: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6600',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6600',
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBarBg: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 12,
    borderRadius: 6,
    transition: 'width 0.3s ease',
  },
  progressStatus: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  progressStep: {
    alignItems: 'center',
    flex: 1,
  },
  progressStepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressStepCompleted: {
    backgroundColor: '#4CAF50',
  },
  progressStepPending: {
    backgroundColor: '#e0e0e0',
  },
  progressStepIcon: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressStepLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  completedBadge: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedBadgeText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
  },
  occupationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  occupationCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    marginBottom: 12,
  },
  occupationCardSelected: {
    borderColor: '#ff6600',
    backgroundColor: '#fff5f0',
  },
  occupationIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  occupationLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  occupationLabelSelected: {
    color: '#ff6600',
  },
  occupationDesc: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  incomeTypeRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  incomeTypeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    marginRight: 8,
  },
  incomeTypeSelected: {
    backgroundColor: '#ff6600',
    borderColor: '#ff6600',
  },
  incomeTypeText: {
    fontSize: 14,
    color: '#666',
  },
  incomeTypeTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  currencySymbol: {
    paddingHorizontal: 16,
    fontSize: 18,
    color: '#666',
    backgroundColor: '#f8f8f8',
    paddingVertical: 16,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  amountInput: {
    flex: 1,
    padding: 16,
    fontSize: 18,
    fontWeight: 'bold',
  },
  incomeUnit: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#999',
  },
  monthlyIncomeCard: {
    backgroundColor: '#fff5f0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#ff6600',
  },
  monthlyIncomeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  monthlyIncomeAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6600',
  },
  uploadSection: {
    marginBottom: 24,
  },
  uploadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  uploadCompletedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadCompletedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  uploadDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: '#ff6600',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#fff5f0',
  },
  uploadIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ff6600',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadIcon: {
    fontSize: 24,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6600',
    marginBottom: 4,
  },
  uploadHint: {
    fontSize: 12,
    color: '#999',
  },
  uploadedFile: {
    alignItems: 'center',
  },
  uploadedImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  uploadedInfo: {
    alignItems: 'center',
  },
  uploadedLabel: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  changeFileButton: {
    fontSize: 14,
    color: '#ff6600',
    textDecorationLine: 'underline',
  },
  bottomContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  confirmButton: {
    backgroundColor: '#ff6600',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
