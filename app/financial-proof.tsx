import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const PROOF_TYPES = [
  { id: 'insurance', label: 'ประกัน', icon: '🪪', desc: 'เบี้ยประกัน ประกันชีวิต ประกันรถ' },
  { id: 'tax', label: 'ภาษี', icon: '⚖️', desc: 'ภาษีเงินได้ ภาษีบ้าน ภาษีรถ' },
  { id: 'other', label: 'อื่น ๆ', icon: '📋', desc: 'ค่าใช้จ่ายอื่นๆ ที่สำคัญ' }
];

export default function FinancialProofScreen() {
  const [type, setType] = useState(PROOF_TYPES[0]);
  const [amount, setAmount] = useState('');
  const [payDate, setPayDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [proof, setProof] = useState(null);
  const [description, setDescription] = useState('');

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

  const calculateProgress = () => {
    const totalFields = 4; // type, payDate, proof, description (amount is optional)
    let completed = 0;
    if (type) completed++;
    if (payDate) completed++;
    if (proof) completed++;
    if (description.trim()) completed++;
    return (completed / totalFields) * 100;
  };

  const onSubmit = () => {
    if (!proof || !payDate || !description.trim()) {
      Alert.alert('กรุณากรอกข้อมูลให้ครบถ้วน', 'โปรดอัปโหลดหลักฐานและกรอกรายละเอียด');
      return;
    }
    Alert.alert('ส่งข้อมูลสำเร็จ', '+2 Trust Points ได้รับสำหรับการอัปโหลดหลักฐานวินัยทางการเงิน\nระบบจะตรวจสอบภายใน 24 ชั่วโมง');
    
    // Reset form
    setAmount('');
    setProof(null);
    setPayDate(new Date());
    setDescription('');
    setType(PROOF_TYPES[0]);
  };

  const progressPercentage = calculateProgress();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.header}>อัปโหลดหลักฐานวินัยทางการเงิน</Text>
        <Text style={styles.subtitle}>แสดงประวัติการชำระเงินเพื่อเพิ่มคะแนนความน่าเชื่อถือ</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>ความคืบหน้า</Text>
            <Text style={styles.progressPercent}>{Math.round(progressPercentage)}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {progressPercentage === 100 ? 'ข้อมูลครบถ้วนแล้ว' : 'กรุณากรอกข้อมูลให้ครบถ้วน'}
          </Text>
        </View>

        {/* Step Indicator */}
        <View style={styles.stepIndicator}>
          <View style={styles.stepItem}>
            <View style={[styles.stepNumber, type && styles.stepCompleted]}>
              <Text style={styles.stepNumberText}>{type ? '✓' : '1'}</Text>
            </View>
            <Text style={styles.stepText}>เลือกประเภท</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.stepItem}>
            <View style={[styles.stepNumber, (payDate && description.trim()) && styles.stepCompleted]}>
              <Text style={styles.stepNumberText}>{(payDate && description.trim()) ? '✓' : '2'}</Text>
            </View>
            <Text style={styles.stepText}>กรอกข้อมูล</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.stepItem}>
            <View style={[styles.stepNumber, proof && styles.stepCompleted]}>
              <Text style={styles.stepNumberText}>{proof ? '✓' : '3'}</Text>
            </View>
            <Text style={styles.stepText}>อัปโหลด</Text>
          </View>
        </View>

        {/* Proof Type Selection */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>ประเภทหลักฐานการชำระเงิน</Text>
          <View style={styles.typeGrid}>
            {PROOF_TYPES.map((proofType) => (
              <TouchableOpacity
                key={proofType.id}
                style={[
                  styles.typeCard,
                  type.id === proofType.id && styles.typeCardSelected
                ]}
                onPress={() => setType(proofType)}
              >
                <Text style={styles.typeIcon}>{proofType.icon}</Text>
                <Text style={[
                  styles.typeLabel,
                  type.id === proofType.id && styles.typeLabelSelected
                ]}>
                  {proofType.label}
                </Text>
                <Text style={styles.typeDesc}>{proofType.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description Input */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>รายละเอียด</Text>
          <Text style={styles.requiredText}>*บังคับ</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder={`เช่น ${type.id === 'insurance' ? 'เบี้ยประกันรถยนต์ประจำเดือน' : 
                              type.id === 'tax' ? 'ภาษีเงินได้บุคคลธรรมดา' : 'รายละเอียดการชำระ'}`}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          <Text style={styles.characterCount}>{description.length}/200 ตัวอักษร</Text>
        </View>

        {/* Amount Input */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>จำนวนเงินที่ชำระ</Text>
          <Text style={styles.optionalText}>(ไม่บังคับ)</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>฿</Text>
            <TextInput
              style={styles.amountInput}
              keyboardType="numeric"
              placeholder="0"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
        </View>

        {/* Date Selection */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>วันที่ชำระเงิน</Text>
          <TouchableOpacity 
            onPress={() => setShowDate(true)} 
            style={styles.dateSelector}
          >
            <Text style={styles.dateText}>
              📅 {payDate.toLocaleDateString('th-TH')}
            </Text>
            <Text style={styles.dateArrow}>›</Text>
          </TouchableOpacity>
          {showDate && (
            <DateTimePicker
              value={payDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, date) => {
                setShowDate(false);
                if (date) setPayDate(date);
              }}
            />
          )}
        </View>

        {/* Document Upload */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>อัปโหลดหลักฐาน</Text>
          <Text style={styles.uploadDescription}>
            สลิปโอนเงิน ใบเสร็จ หรือหลักฐานการชำระเงิน
          </Text>
          
          {!proof ? (
            <TouchableOpacity style={styles.uploadArea} onPress={pickImage}>
              <View style={styles.uploadIcon}>
                <Text style={styles.uploadIconText}>📎</Text>
              </View>
              <Text style={styles.uploadText}>แตะเพื่อเลือกไฟล์</Text>
              <Text style={styles.uploadSubtext}>รองรับไฟล์ JPG, PNG, PDF</Text>
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

        {/* Trust Points Info */}
        <View style={styles.rewardCard}>
          <View style={styles.rewardIcon}>
            <Text style={styles.rewardIconText}>⭐</Text>
          </View>
          <View style={styles.rewardContent}>
            <Text style={styles.rewardTitle}>รางวัลคะแนนความน่าเชื่อถือ</Text>
            <Text style={styles.rewardText}>
              +2 คะแนน สำหรับการอัปโหลดที่ผ่านการตรวจสอบ
            </Text>
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 เคล็ดลับ</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tipItem}>• อัปโหลดหลักฐานที่ชัดเจน อ่านได้</Text>
            <Text style={styles.tipItem}>• ระบุรายละเอียดให้ครบถ้วน</Text>
            <Text style={styles.tipItem}>• ควรอัปโหลดทุกเดือนเพื่อเพิ่มคะแนน</Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[
            styles.submitButton,
            progressPercentage !== 100 && styles.submitButtonDisabled
          ]} 
          onPress={onSubmit}
          disabled={progressPercentage !== 100}
        >
          <Text style={styles.submitButtonText}>ส่งหลักฐานวินัยทางการเงิน</Text>
        </TouchableOpacity>

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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ff6600',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
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
    marginBottom: 8,
  },
  progressFill: {
    height: 8,
    backgroundColor: '#ff6600',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  stepItem: {
    alignItems: 'center',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCompleted: {
    backgroundColor: '#4CAF50',
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 12,
    color: '#666',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 8,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  optionalText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  requiredText: {
    fontSize: 14,
    color: '#f44336',
    marginBottom: 16,
  },
  typeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  typeCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginHorizontal: 4,
  },
  typeCardSelected: {
    borderColor: '#ff6600',
    backgroundColor: '#fff5f0',
  },
  typeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  typeLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  typeLabelSelected: {
    color: '#ff6600',
  },
  typeDesc: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    lineHeight: 14,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fff',
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginTop: 12,
  },
  dateText: {
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
  rewardCard: {
    backgroundColor: '#fff5f0',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6600',
  },
  rewardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ff6600',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rewardIconText: {
    fontSize: 24,
  },
  rewardContent: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  rewardText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  tipsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  tipsList: {
    marginLeft: 8,
  },
  tipItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#ff6600',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
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
});
