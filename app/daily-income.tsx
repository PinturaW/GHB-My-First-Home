import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function DailyIncomeScreen() {
  const [incomePhoto, setIncomePhoto] = useState(null);
  const [income, setIncome] = useState('');
  const [diary, setDiary] = useState([
    { date: '10 มิ.ย.', value: '฿820', uploaded: true },
    { date: '9 มิ.ย.', value: '฿920', uploaded: true },
    { date: '8 มิ.ย.', value: '฿500', uploaded: true },
  ]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setIncomePhoto(result.assets[0].uri);
    }
  };

  const onAddIncome = () => {
    if (!incomePhoto) {
      Alert.alert('กรุณาอัปโหลดไฟล์หลักฐานรายได้');
      return;
    }
    setDiary([{ date: '11 มิ.ย.', value: `฿${income || '0'}`, uploaded: true }, ...diary]);
    setIncome('');
    setIncomePhoto(null);
    Alert.alert('เพิ่มสำเร็จ', '+2 คะแนนความน่าเชื่อถือในวันนี้!');
  };

  const calculateProgress = () => {
    const totalDays = 30;
    const uploadedDays = diary.length;
    return Math.min((uploadedDays / totalDays) * 100, 100);
  };

  const progressPercentage = calculateProgress();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.header}>อัปโหลดรายได้ประจำวัน</Text>
        <Text style={styles.subtitle}>บันทึกรายได้เพื่อเพิ่มคะแนนความน่าเชื่อถือ</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Today's Date Card */}
        <View style={styles.dateCard}>
          <View style={styles.dateHeader}>
            <Text style={styles.dateTitle}>วันนี้</Text>
            <Text style={styles.dateIcon}>📅</Text>
          </View>
          <Text style={styles.dateText}>วันอังคารที่ 11 มิถุนายน 2568</Text>
        </View>

        {/* Upload Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>อัปโหลดหลักฐานรายได้</Text>
          <Text style={styles.cardSubtitle}>อัปโหลดสลิป ใบเสร็จ หรือหลักฐานรายได้ของวันนี้</Text>
          
          {!incomePhoto ? (
            <TouchableOpacity style={styles.uploadArea} onPress={pickImage}>
              <View style={styles.uploadIcon}>
                <Text style={styles.uploadIconText}>📎</Text>
              </View>
              <Text style={styles.uploadText}>แตะเพื่อเลือกไฟล์</Text>
              <Text style={styles.uploadHint}>รองรับ JPG, PNG, PDF</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.uploadedContainer}>
              <Image source={{ uri: incomePhoto }} style={styles.uploadedImage} />
              <View style={styles.uploadedInfo}>
                <Text style={styles.uploadedText}>✅ อัปโหลดสำเร็จ</Text>
                <TouchableOpacity onPress={pickImage}>
                  <Text style={styles.changeFileText}>เปลี่ยนไฟล์</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Income Input Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>จำนวนรายได้</Text>
          <Text style={styles.cardSubtitle}>ระบุจำนวนเงิน (ไม่บังคับ)</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>฿</Text>
            <TextInput
              style={styles.amountInput}
              keyboardType="numeric"
              placeholder="0"
              value={income}
              onChangeText={setIncome}
            />
          </View>
          
          <TouchableOpacity 
            style={[
              styles.submitButton,
              !incomePhoto && styles.submitButtonDisabled
            ]} 
            onPress={onAddIncome}
            disabled={!incomePhoto}
          >
            <Text style={styles.submitButtonText}>เพิ่มรายได้วันนี้</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Section */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>ความคืบหน้าคะแนน IRS</Text>
            <Text style={styles.progressPercentage}>{Math.round(progressPercentage)}%</Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
            </View>
          </View>
          
          <Text style={styles.progressDescription}>
            อัปโหลดแล้ว {diary.length} วัน จาก 30 วัน
          </Text>
        </View>

        {/* History Section */}
        <View style={styles.card}>
          <View style={styles.historyHeader}>
            <Text style={styles.cardTitle}>ประวัติรายได้ล่าสุด</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>ดูทั้งหมด</Text>
            </TouchableOpacity>
          </View>
          
          {diary.map((item, idx) => (
            <View key={idx} style={styles.historyItem}>
              <View style={styles.historyLeft}>
                <View style={styles.historyIconContainer}>
                  <Text style={styles.historyIcon}>💰</Text>
                </View>
                <View style={styles.historyInfo}>
                  <Text style={styles.historyDate}>{item.date}</Text>
                  <Text style={styles.historyAmount}>{item.value}</Text>
                </View>
              </View>
              
              <View style={styles.historyRight}>
                <View style={styles.statusContainer}>
                  <View style={[
                    styles.statusDot,
                    { backgroundColor: item.uploaded ? '#4CAF50' : '#f44336' }
                  ]} />
                  <Text style={[
                    styles.statusText,
                    { color: item.uploaded ? '#4CAF50' : '#f44336' }
                  ]}>
                    {item.uploaded ? 'สำเร็จ' : 'รอดำเนินการ'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Rewards Info */}
        <View style={styles.rewardsCard}>
          <View style={styles.rewardsHeader}>
            <Text style={styles.rewardsIcon}>⭐</Text>
            <View style={styles.rewardsContent}>
              <Text style={styles.rewardsTitle}>รางวัลคะแนนความน่าเชื่อถือ</Text>
              <Text style={styles.rewardsText}>
                +2 คะแนน สำหรับการอัปโหลดรายได้ทุกวัน
              </Text>
            </View>
          </View>
        </View>

        {/* Tips Card */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 เคล็ดลับเพิ่มคะแนน</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tipItem}>• อัปโหลดรายได้ทุกวันติดต่อกัน</Text>
            <Text style={styles.tipItem}>• ใส่จำนวนเงินให้ครบถ้วน</Text>
            <Text style={styles.tipItem}>• อัปโหลดหลักฐานที่ชัดเจน</Text>
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
  dateCard: {
    backgroundColor: '#fff5f0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6600',
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dateIcon: {
    fontSize: 20,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
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
    marginBottom: 4,
  },
  cardSubtitle: {
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
  uploadHint: {
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 20,
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
    fontSize: 18,
    fontWeight: 'bold',
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
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  progressPercentage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6600',
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
  },
  progressFill: {
    height: 12,
    backgroundColor: '#ff6600',
    borderRadius: 6,
  },
  progressDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#ff6600',
    fontWeight: 'bold',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff5f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyIcon: {
    fontSize: 20,
  },
  historyInfo: {
    flex: 1,
  },
  historyDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  historyAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  rewardsCard: {
    backgroundColor: '#fff5f0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6600',
  },
  rewardsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardsIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  rewardsContent: {
    flex: 1,
  },
  rewardsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  rewardsText: {
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
    fontSize: 18,
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
});
