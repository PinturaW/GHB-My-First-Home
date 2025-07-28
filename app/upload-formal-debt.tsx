import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const DEBT_TYPES = [
  { id: 'credit_card', label: 'บัตรเครดิต', icon: '💳', color: '#E91E63' },
  { id: 'personal_loan', label: 'สินเชื่อส่วนบุคคล', icon: '👤', color: '#9C27B0' },
  { id: 'car_loan', label: 'สินเชื่อรถยนต์', icon: '🚗', color: '#3F51B5' },
  { id: 'home_loan', label: 'สินเชื่อบ้าน', icon: '🏠', color: '#4CAF50' },
  { id: 'other', label: 'อื่น ๆ', icon: '📋', color: '#FF9800' }
];

export default function UploadFormalDebtScreen() {
  const [selectedType, setSelectedType] = useState(DEBT_TYPES[0]);
  const [balance, setBalance] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [proof, setProof] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setProof(result.assets[0].uri);
    }
  };

  const onConfirm = () => {
    if (!balance || !monthlyPayment || !proof || !dueDate) {
      Alert.alert('กรุณากรอกข้อมูลให้ครบถ้วน', 'โปรดกรอกข้อมูลและอัปโหลดเอกสารทุกรายการ');
      return;
    }
    Alert.alert(
      'บันทึกสำเร็จ', 
      '+3 Trust Points ได้รับและบันทึกวันครบกำหนดในปฏิทินแล้ว\nระบบจะแจ้งเตือนก่อนครบกำหนด 3 วัน'
    );
    // Reset form
    setBalance('');
    setMonthlyPayment('');
    setProof(null);
    setDueDate(new Date());
  };

  const calculateProgress = () => {
    const totalFields = 4; // balance, monthlyPayment, dueDate, proof
    let completed = 0;
    if (balance) completed++;
    if (monthlyPayment) completed++;
    if (dueDate) completed++;
    if (proof) completed++;
    return (completed / totalFields) * 100;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.header}>แจ้งหนี้สินในระบบ</Text>
        <Text style={styles.subtitle}>เพิ่มความโปร่งใสและคะแนนความน่าเชื่อถือ</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Indicator */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>ความคืบหน้า</Text>
            <Text style={styles.progressPercent}>{Math.round(calculateProgress())}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${calculateProgress()}%` }]} />
          </View>
        </View>

        {/* Debt Type Selection */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>ประเภทหนี้สิน</Text>
          <View style={styles.debtTypeGrid}>
            {DEBT_TYPES.map((debtType) => (
              <TouchableOpacity
                key={debtType.id}
                style={[
                  styles.debtTypeCard,
                  selectedType.id === debtType.id && styles.debtTypeCardSelected
                ]}
                onPress={() => setSelectedType(debtType)}
              >
                <Text style={styles.debtTypeIcon}>{debtType.icon}</Text>
                <Text style={[
                  styles.debtTypeLabel,
                  selectedType.id === debtType.id && styles.debtTypeLabelSelected
                ]}>
                  {debtType.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Debt Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>ข้อมูลหนี้สิน</Text>
          
          {/* Outstanding Balance */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>ยอดหนี้คงเหลือ</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>฿</Text>
              <TextInput
                style={styles.amountInput}
                keyboardType="numeric"
                placeholder="0"
                value={balance}
                onChangeText={setBalance}
              />
            </View>
          </View>

          {/* Monthly Payment */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>ค่างวดรายเดือน</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>฿</Text>
              <TextInput
                style={styles.amountInput}
                keyboardType="numeric"
                placeholder="0"
                value={monthlyPayment}
                onChangeText={setMonthlyPayment}
              />
            </View>
          </View>

          {/* Due Date */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>วันครบกำหนดถัดไป</Text>
            <TouchableOpacity 
              style={styles.dateSelector}
              onPress={() => setShowDate(true)}
            >
              <Text style={styles.dateIcon}>📅</Text>
              <Text style={styles.dateText}>
                {dueDate.toLocaleDateString('th-TH')}
              </Text>
              <Text style={styles.dateArrow}>›</Text>
            </TouchableOpacity>
            {showDate && (
              <DateTimePicker
                value={dueDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, date) => {
                  setShowDate(false);
                  if (date) setDueDate(date);
                }}
              />
            )}
          </View>
        </View>

        {/* Document Upload */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>อัปโหลดหลักฐาน</Text>
          <Text style={styles.uploadDescription}>
            Statement, สัญญา หรือเอกสารที่แสดงยอดหนี้คงเหลือ
          </Text>
          
          {!proof ? (
            <TouchableOpacity 
              style={styles.uploadArea}
              onPress={pickImage}
            >
              <View style={styles.uploadIcon}>
                <Text style={styles.uploadIconText}>📎</Text>
              </View>
              <Text style={styles.uploadText}>แตะเพื่ออัปโหลดเอกสาร</Text>
              <Text style={styles.uploadSubtext}>รองรับ JPG, PNG, PDF</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.uploadedContainer}>
              <Image source={{ uri: proof }} style={styles.uploadedImage} />
              <View style={styles.uploadedInfo}>
                <Text style={styles.uploadedText}>✅ อัปโหลดสำเร็จ</Text>
                <TouchableOpacity onPress={pickImage}>
                  <Text style={styles.changeFileText}>เปลี่ยนไฟล์</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Benefits Information */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>⭐ ประโยชน์ที่จะได้รับ</Text>
          <View style={styles.benefitsList}>
            <Text style={styles.benefitItem}>• เพิ่มคะแนนความน่าเชื่อถือ +3 คะแนน</Text>
            <Text style={styles.benefitItem}>• แจ้งเตือนวันครบกำหนดอัตโนมัติ</Text>
            <Text style={styles.benefitItem}>• ช่วยวางแผนการเงินได้ดีขึ้น</Text>
            <Text style={styles.benefitItem}>• เพิ่มโอกาสอนุมัติสินเชื่อ</Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[
            styles.submitButton,
            calculateProgress() !== 100 && styles.submitButtonDisabled
          ]} 
          onPress={onConfirm}
          disabled={calculateProgress() !== 100}
        >
          <Text style={styles.submitButtonText}>เพิ่มหนี้ในระบบ</Text>
        </TouchableOpacity>

        {/* Privacy Notice */}
        <View style={styles.privacyCard}>
          <Text style={styles.privacyIcon}>🔒</Text>
          <View style={styles.privacyContent}>
            <Text style={styles.privacyTitle}>ความเป็นส่วนตัว</Text>
            <Text style={styles.privacyText}>
              ข้อมูลของคุณจะถูกเข้ารหัสและใช้เพื่อประเมินความเสี่ยงเท่านั้น
              ระบบจะแจ้งเตือนให้อัปเดตสถานะหนี้ทุกเดือน
            </Text>
          </View>
        </View>

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
  headerSection: {
    backgroundColor: '#fff',
    padding: 24,
    paddingTop: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  progressCard: {
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
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6600',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  progressFill: {
    height: 8,
    backgroundColor: '#ff6600',
    borderRadius: 4,
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
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  debtTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  debtTypeCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    marginBottom: 12,
  },
  debtTypeCardSelected: {
    borderColor: '#ff6600',
    backgroundColor: '#fff5f0',
  },
  debtTypeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  debtTypeLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  debtTypeLabelSelected: {
    color: '#ff6600',
    fontWeight: 'bold',
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  currencySymbol: {
    paddingHorizontal: 16,
    fontSize: 18,
    color: '#666',
    backgroundColor: '#f8f8f8',
    paddingVertical: 16,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  amountInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  dateIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  dateArrow: {
    fontSize: 20,
    color: '#999',
  },
  uploadDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: '#ff6600',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#fff5f0',
  },
  uploadIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff6600',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadIconText: {
    fontSize: 24,
    color: '#fff',
  },
  uploadText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6600',
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#999',
  },
  uploadedContainer: {
    alignItems: 'center',
  },
  uploadedImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 16,
  },
  uploadedInfo: {
    alignItems: 'center',
  },
  uploadedText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  changeFileText: {
    fontSize: 14,
    color: '#ff6600',
    textDecorationLine: 'underline',
  },
  benefitsCard: {
    backgroundColor: '#fff5f0',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6600',
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  benefitsList: {
    marginLeft: 8,
  },
  benefitItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#ff6600',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#ff6600',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  privacyCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  privacyIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  privacyContent: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  privacyText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
