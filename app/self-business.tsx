import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const businessTypes = [
  { id: 'retail', label: 'ขายของออนไลน์', icon: '🛒' },
  { id: 'food', label: 'ร้านอาหาร/เครื่องดื่ม', icon: '🍽️' },
  { id: 'service', label: 'ให้บริการ', icon: '⚙️' },
  { id: 'other', label: 'อื่น ๆ', icon: '📋' }
];

export default function SelfBusinessScreen() {
  const [businessType, setBusinessType] = useState('');
  const [hasPhysicalStore, setHasPhysicalStore] = useState(false);
  const [storeAddress, setStoreAddress] = useState('');
  const [productPhoto, setProductPhoto] = useState(null);
  const [storefrontPhoto, setStorefrontPhoto] = useState(null);
  const [invoicePhoto, setInvoicePhoto] = useState(null);
  const [desc, setDesc] = useState('');

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

  const onVerify = () => {
    // Check basic required fields
    if (!businessType || !productPhoto || !invoicePhoto || !desc) {
      Alert.alert('กรุณากรอกข้อมูลให้ครบถ้วน', 'โปรดเลือกประเภทธุรกิจ อัปโหลดรูปภาพ และกรอกรายละเอียด');
      return;
    }

    // Check physical store requirements
    if (hasPhysicalStore && (!storefrontPhoto || !storeAddress.trim())) {
      Alert.alert('กรุณากรอกข้อมูลหน้าร้าน', 'โปรดอัปโหลดรูปหน้าร้านและกรอกที่อยู่');
      return;
    }

    Alert.alert('ส่งข้อมูลสำเร็จ', 'ระบบได้รับข้อมูลยืนยันธุรกิจของคุณแล้ว\nจะมีการติดต่อกลับภายใน 2-3 วันทำการ');
  };

  const getProgress = () => {
    let totalSteps = 4; // businessType, productPhoto, invoicePhoto, desc
    let completed = 0;
    
    if (businessType) completed++;
    if (productPhoto) completed++;
    if (invoicePhoto) completed++;
    if (desc) completed++;
    
    // Add physical store requirements if applicable
    if (hasPhysicalStore) {
      totalSteps += 2; // storefrontPhoto, storeAddress
      if (storefrontPhoto) completed++;
      if (storeAddress.trim()) completed++;
    }
    
    return (completed / totalSteps) * 100;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.header}>ยืนยันธุรกิจของคุณ</Text>
        <Text style={styles.subtitle}>อัปโหลดหลักฐานเพื่อเพิ่มความน่าเชื่อถือ</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Bar */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>ความคืบหน้า</Text>
            <Text style={styles.progressPercent}>{Math.round(getProgress())}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${getProgress()}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {getProgress() === 100 ? 'ข้อมูลครบถ้วนแล้ว' : 'กรุณากรอกข้อมูลให้ครบถ้วน'}
          </Text>
        </View>

        {/* Business Type Selection */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>ประเภทธุรกิจของคุณ</Text>
          <View style={styles.businessTypeGrid}>
            {businessTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.businessTypeCard,
                  businessType === type.id && styles.businessTypeCardSelected
                ]}
                onPress={() => setBusinessType(type.id)}
              >
                <Text style={styles.businessTypeIcon}>{type.icon}</Text>
                <Text style={[
                  styles.businessTypeLabel,
                  businessType === type.id && styles.businessTypeLabelSelected
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Physical Store Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>ลักษณะธุรกิจ</Text>
          
          <View style={styles.storeTypeSection}>
            <Text style={styles.inputLabel}>คุณมีหน้าร้านจริงหรือไม่?</Text>
            
            <View style={styles.storeTypeOptions}>
              <TouchableOpacity
                style={[
                  styles.storeTypeButton,
                  !hasPhysicalStore && styles.storeTypeButtonSelected
                ]}
                onPress={() => setHasPhysicalStore(false)}
              >
                <Text style={styles.storeTypeIcon}>💻</Text>
                <Text style={[
                  styles.storeTypeLabel,
                  !hasPhysicalStore && styles.storeTypeLabelSelected
                ]}>
                  ออนไลน์เท่านั้น
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.storeTypeButton,
                  hasPhysicalStore && styles.storeTypeButtonSelected
                ]}
                onPress={() => setHasPhysicalStore(true)}
              >
                <Text style={styles.storeTypeIcon}>🏪</Text>
                <Text style={[
                  styles.storeTypeLabel,
                  hasPhysicalStore && styles.storeTypeLabelSelected
                ]}>
                  มีหน้าร้านจริง
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Physical Store Address */}
          {hasPhysicalStore && (
            <View style={styles.addressSection}>
              <Text style={styles.inputLabel}>ที่อยู่หน้าร้าน</Text>
              <TextInput
                style={styles.addressInput}
                placeholder="กรอกที่อยู่หน้าร้าน เช่น 123 ถนนสุขุมวิท แขวงคลองตัน เขตคลองตัน กรุงเทพฯ"
                value={storeAddress}
                onChangeText={setStoreAddress}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              
              <TouchableOpacity style={styles.locationButton}>
                <Text style={styles.locationButtonIcon}>📍</Text>
                <Text style={styles.locationButtonText}>เลือกตำแหน่งจากแผนที่</Text>
                <Text style={styles.locationButtonHint}>(เร็วๆ นี้)</Text>
              </TouchableOpacity>
              
              <View style={styles.locationBenefits}>
                <Text style={styles.locationBenefitsTitle}>💡 ประโยชน์ของการระบุตำแหน่ง:</Text>
                <Text style={styles.locationBenefit}>• เพิ่มความน่าเชื่อถือ +5 คะแนน</Text>
                <Text style={styles.locationBenefit}>• ลูกค้าหาร้านได้ง่าย</Text>
                <Text style={styles.locationBenefit}>• เพิ่มโอกาสอนุมัติสินเชื่อ</Text>
              </View>
            </View>
          )}
        </View>

        {/* Photo Upload Sections */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>หลักฐานธุรกิจ</Text>
          
          {/* Product Photo */}
          <View style={styles.uploadSection}>
            <Text style={styles.uploadTitle}>📦 รูปภาพสินค้าหรือบริการ</Text>
            <Text style={styles.uploadDescription}>แสดงสินค้าหรือบริการที่คุณขาย</Text>
            
            {!productPhoto ? (
              <TouchableOpacity 
                style={styles.uploadButton}
                onPress={() => pickImage(setProductPhoto)}
              >
                <View style={styles.uploadIcon}>
                  <Text style={styles.uploadIconText}>📸</Text>
                </View>
                <Text style={styles.uploadButtonText}>อัปโหลดรูปสินค้า</Text>
                <Text style={styles.uploadHint}>รองรับ JPG, PNG</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.uploadedContainer}>
                <Image source={{ uri: productPhoto }} style={styles.uploadedImage} />
                <View style={styles.uploadedInfo}>
                  <Text style={styles.uploadedText}>✅ อัปโหลดสำเร็จ</Text>
                  <TouchableOpacity onPress={() => pickImage(setProductPhoto)}>
                    <Text style={styles.changeImageText}>เปลี่ยนรูป</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Storefront Photo - Only show if has physical store */}
          {hasPhysicalStore && (
            <View style={styles.uploadSection}>
              <Text style={styles.uploadTitle}>🏪 รูปภาพหน้าร้าน</Text>
              <Text style={styles.uploadDescription}>หน้าร้าน พื้นที่ทำงาน หรือป้ายร้าน</Text>
              
              {!storefrontPhoto ? (
                <TouchableOpacity 
                  style={styles.uploadButton}
                  onPress={() => pickImage(setStorefrontPhoto)}
                >
                  <View style={styles.uploadIcon}>
                    <Text style={styles.uploadIconText}>🏢</Text>
                  </View>
                  <Text style={styles.uploadButtonText}>อัปโหลดรูปหน้าร้าน</Text>
                  <Text style={styles.uploadHint}>รองรับ JPG, PNG</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.uploadedContainer}>
                  <Image source={{ uri: storefrontPhoto }} style={styles.uploadedImage} />
                  <View style={styles.uploadedInfo}>
                    <Text style={styles.uploadedText}>✅ อัปโหลดสำเร็จ</Text>
                    <TouchableOpacity onPress={() => pickImage(setStorefrontPhoto)}>
                      <Text style={styles.changeImageText}>เปลี่ยนรูป</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Invoice Photo */}
          <View style={styles.uploadSection}>
            <Text style={styles.uploadTitle}>🧾 สลิป/บิล หรือหลักฐานการสั่งซื้อ</Text>
            <Text style={styles.uploadDescription}>หลักฐานการขาย ใบเสร็จ หรือการสั่งซื้อ</Text>
            
            {!invoicePhoto ? (
              <TouchableOpacity 
                style={styles.uploadButton}
                onPress={() => pickImage(setInvoicePhoto)}
              >
                <View style={styles.uploadIcon}>
                  <Text style={styles.uploadIconText}>📄</Text>
                </View>
                <Text style={styles.uploadButtonText}>อัปโหลดหลักฐาน</Text>
                <Text style={styles.uploadHint}>รองรับ JPG, PNG, PDF</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.uploadedContainer}>
                <Image source={{ uri: invoicePhoto }} style={styles.uploadedImage} />
                <View style={styles.uploadedInfo}>
                  <Text style={styles.uploadedText}>✅ อัปโหลดสำเร็จ</Text>
                  <TouchableOpacity onPress={() => pickImage(setInvoicePhoto)}>
                    <Text style={styles.changeImageText}>เปลี่ยนรูป</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Business Description */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>รายละเอียดธุรกิจ</Text>
          <Text style={styles.inputLabel}>อธิบายธุรกิจของคุณ</Text>
          <TextInput
            style={styles.textArea}
            placeholder="เช่น ขายเสื้อผ้าออนไลน์ผ่านเฟซบุ๊ก รายได้เฉลี่ยเดือนละ 15,000 บาท มีลูกค้าประจำประมาณ 200 คน..."
            value={desc}
            onChangeText={setDesc}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          <Text style={styles.characterCount}>{desc.length}/500 ตัวอักษร</Text>
        </View>

        {/* Benefits Info */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>💡 ประโยชน์ที่จะได้รับ</Text>
          <View style={styles.benefitsList}>
            <Text style={styles.benefitItem}>
              • เพิ่มคะแนนความน่าเชื่อถือ +{hasPhysicalStore ? '20' : '15'} คะแนน
            </Text>
            <Text style={styles.benefitItem}>• เพิ่มโอกาสอนุมัติสินเชื่อ</Text>
            <Text style={styles.benefitItem}>• รับข้อเสนอพิเศษสำหรับผู้ประกอบการ</Text>
            {hasPhysicalStore && (
              <Text style={styles.benefitItem}>• โบนัสคะแนนพิเศษสำหรับหน้าร้านจริง +5 คะแนน</Text>
            )}
          </View>
        </View>

        {/* Verify Button */}
        <TouchableOpacity 
          style={[
            styles.verifyButton,
            getProgress() !== 100 && styles.verifyButtonDisabled
          ]} 
          onPress={onVerify}
          disabled={getProgress() !== 100}
        >
          <Text style={styles.verifyButtonText}>ยืนยันธุรกิจของฉัน</Text>
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
  businessTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  businessTypeCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    marginBottom: 12,
  },
  businessTypeCardSelected: {
    borderColor: '#ff6600',
    backgroundColor: '#fff5f0',
  },
  businessTypeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  businessTypeLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  businessTypeLabelSelected: {
    color: '#ff6600',
    fontWeight: 'bold',
  },
  storeTypeSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  storeTypeOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  storeTypeButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  storeTypeButtonSelected: {
    borderColor: '#ff6600',
    backgroundColor: '#fff5f0',
  },
  storeTypeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  storeTypeLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  storeTypeLabelSelected: {
    color: '#ff6600',
    fontWeight: 'bold',
  },
  addressSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  addressInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
    marginBottom: 16,
  },
  locationButtonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  locationButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  locationButtonHint: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  locationBenefits: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  locationBenefitsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  locationBenefit: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  uploadSection: {
    marginBottom: 24,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  uploadDescription: {
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
  uploadIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ff6600',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadIconText: {
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
  uploadedContainer: {
    alignItems: 'center',
  },
  uploadedImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
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
  changeImageText: {
    fontSize: 14,
    color: '#ff6600',
    textDecorationLine: 'underline',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 8,
  },
  benefitsCard: {
    backgroundColor: '#fff5f0',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6600',
    marginBottom: 16,
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
  verifyButton: {
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
  verifyButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
