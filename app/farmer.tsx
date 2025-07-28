import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const FARM_TYPES = [
  { id: 'crop', label: 'พืชไร่/พืชสวน', icon: '🌾' },
  { id: 'livestock', label: 'ปศุสัตว์', icon: '🐄' },
  { id: 'aquaculture', label: 'ประมง', icon: '🐟' },
  { id: 'orchard', label: 'สวนผลไม้', icon: '🍊' },
];

export default function FarmerFeatureScreen() {
  const [landStatus, setLandStatus] = useState(null);
  const [landTitleDeed, setLandTitleDeed] = useState(null);
  const [landSize, setLandSize] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  const [farmTypes, setFarmTypes] = useState([]);
  const [farmPhoto, setFarmPhoto] = useState(null);
  const [harvestPhoto, setHarvestPhoto] = useState(null);
  const [farmDescription, setFarmDescription] = useState('');

  const pickImage = async (setter) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('ต้องการสิทธิ์เข้าถึงรูปภาพ');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setter(result.assets[0].uri);
    }
  };

  const toggleFarmType = (id) => {
    if (farmTypes.includes(id)) {
      setFarmTypes(farmTypes.filter((t) => t !== id));
    } else {
      setFarmTypes([...farmTypes, id]);
    }
  };

  const getProgress = () => {
    let totalSteps = 4; // landStatus, farmTypes, farmPhoto, farmDescription
    let completed = 0;
    
    if (landStatus) completed++;
    if (farmTypes.length > 0) completed++;
    if (farmPhoto) completed++;
    if (farmDescription.length > 0) completed++;
    
    // Add requirements for own land
    if (landStatus === 'own') {
      totalSteps += 3; // landTitleDeed, landSize, farmLocation
      if (landTitleDeed) completed++;
      if (landSize) completed++;
      if (farmLocation.trim()) completed++;
    }
    
    // Add harvest photo if has orchard or crop
    if (farmTypes.includes('orchard') || farmTypes.includes('crop')) {
      totalSteps += 1;
      if (harvestPhoto) completed++;
    }
    
    return totalSteps > 0 ? (completed / totalSteps) * 100 : 0;
  };

  const onVerify = () => {
    if (!landStatus) {
      Alert.alert('กรุณาเลือกสถานะที่ดิน');
      return;
    }
    if (landStatus === 'own' && (!landTitleDeed || !landSize || !farmLocation)) {
      Alert.alert('กรุณากรอกข้อมูลให้ครบถ้วน', 'โปรดอัปโหลดรูปโฉนด กรอกขนาดและที่ตั้งของที่ดิน');
      return;
    }
    if (farmTypes.length === 0) {
      Alert.alert('กรุณาเลือกประเภทเกษตรกรรม');
      return;
    }
    if (!farmPhoto) {
      Alert.alert('กรุณาอัปโหลดรูปฟาร์มของคุณ');
      return;
    }
    if (!farmDescription.trim()) {
      Alert.alert('กรุณาอธิบายเกี่ยวกับฟาร์มของคุณ');
      return;
    }
    
    Alert.alert('ส่งข้อมูลสำเร็จ', 'ระบบได้รับข้อมูลของคุณแล้ว จะมีการติดต่อกลับภายใน 2-3 วันทำการ');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.header}>ยืนยันข้อมูลเกษตรกร</Text>
        <Text style={styles.subtitle}>ขั้นตอนง่ายๆ เพื่อเพิ่มความน่าเชื่อถือ</Text>
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

        {/* Land Status Selection */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🏡 สถานะที่ดินของคุณ</Text>
          <View style={styles.landStatusOptions}>
            <TouchableOpacity
              style={[
                styles.landStatusButton,
                landStatus === 'own' && styles.landStatusButtonSelected
              ]}
              onPress={() => setLandStatus('own')}
            >
              <Text style={styles.landStatusIcon}>🏠</Text>
              <Text style={[
                styles.landStatusLabel,
                landStatus === 'own' && styles.landStatusLabelSelected
              ]}>
                มีที่ดินของตนเอง
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.landStatusButton,
                landStatus === 'rent' && styles.landStatusButtonSelected
              ]}
              onPress={() => {
                setLandStatus('rent');
                setLandTitleDeed(null);
                setLandSize('');
                setFarmLocation('');
              }}
            >
              <Text style={styles.landStatusIcon}>🤝</Text>
              <Text style={[
                styles.landStatusLabel,
                landStatus === 'rent' && styles.landStatusLabelSelected
              ]}>
                เช่าหรือใช้ร่วม
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Land Details - Only for own land */}
        {landStatus === 'own' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📜 ข้อมูลที่ดิน</Text>
            
            {/* Land Title Deed Upload */}
            <View style={styles.uploadSection}>
              <Text style={styles.uploadTitle}>โฉนดที่ดิน</Text>
              <Text style={styles.uploadDescription}>แสดงกรรมสิทธิ์หรือการครอบครองพื้นที่</Text>
              
              {!landTitleDeed ? (
                <TouchableOpacity 
                  style={styles.uploadButton}
                  onPress={() => pickImage(setLandTitleDeed)}
                >
                  <View style={styles.uploadIcon}>
                    <Text style={styles.uploadIconText}>📋</Text>
                  </View>
                  <Text style={styles.uploadButtonText}>อัปโหลดโฉนดที่ดิน</Text>
                  <Text style={styles.uploadHint}>รองรับ JPG, PNG</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.uploadedContainer}>
                  <Image source={{ uri: landTitleDeed }} style={styles.uploadedImage} />
                  <View style={styles.uploadedInfo}>
                    <Text style={styles.uploadedText}>✅ อัปโหลดสำเร็จ</Text>
                    <TouchableOpacity onPress={() => pickImage(setLandTitleDeed)}>
                      <Text style={styles.changeImageText}>เปลี่ยนรูป</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* Land Size Input */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>📐 ขนาดที่ดิน (ไร่)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="เช่น 5.5"
                value={landSize}
                onChangeText={setLandSize}
              />
            </View>

            {/* Farm Location Input */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>📍 ที่ตั้งที่ดิน</Text>
              <TextInput
                style={styles.addressInput}
                multiline
                numberOfLines={3}
                placeholder="ที่อยู่หรือพิกัดพื้นที่ เช่น บ้านเลขที่ 45 หมู่ 2 ต.ในเมือง อ.เมือง จ.เชียงใหม่"
                value={farmLocation}
                onChangeText={setFarmLocation}
                textAlignVertical="top"
              />
              
              <TouchableOpacity style={styles.locationButton}>
                <Text style={styles.locationButtonIcon}>📍</Text>
                <Text style={styles.locationButtonText}>เลือกตำแหน่งจากแผนที่</Text>
                <Text style={styles.locationButtonHint}>(เร็วๆ นี้)</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Farm Types Selection */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🌱 ประเภทเกษตรกรรมของคุณ</Text>
          <Text style={styles.cardSubtitle}>เลือกได้มากกว่า 1 ประเภท</Text>
          <View style={styles.farmTypeGrid}>
            {FARM_TYPES.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.farmTypeCard,
                  farmTypes.includes(item.id) && styles.farmTypeCardSelected
                ]}
                onPress={() => toggleFarmType(item.id)}
              >
                <Text style={styles.farmTypeIcon}>{item.icon}</Text>
                <Text style={[
                  styles.farmTypeLabel,
                  farmTypes.includes(item.id) && styles.farmTypeLabelSelected
                ]}>
                  {item.label}
                </Text>
                {farmTypes.includes(item.id) && (
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedBadgeText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Farm Photos */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📸 รูปภาพฟาร์ม</Text>
          
          {/* Farm Photo */}
          <View style={styles.uploadSection}>
            <Text style={styles.uploadTitle}>🚜 รูปภาพฟาร์ม/พื้นที่เกษตร</Text>
            <Text style={styles.uploadDescription}>แสดงพื้นที่ทำการเกษตรของคุณ</Text>
            
            {!farmPhoto ? (
              <TouchableOpacity 
                style={styles.uploadButton}
                onPress={() => pickImage(setFarmPhoto)}
              >
                <View style={styles.uploadIcon}>
                  <Text style={styles.uploadIconText}>🌾</Text>
                </View>
                <Text style={styles.uploadButtonText}>อัปโหลดรูปฟาร์ม</Text>
                <Text style={styles.uploadHint}>รองรับ JPG, PNG</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.uploadedContainer}>
                <Image source={{ uri: farmPhoto }} style={styles.uploadedImage} />
                <View style={styles.uploadedInfo}>
                  <Text style={styles.uploadedText}>✅ อัปโหลดสำเร็จ</Text>
                  <TouchableOpacity onPress={() => pickImage(setFarmPhoto)}>
                    <Text style={styles.changeImageText}>เปลี่ยนรูป</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Harvest Photo - Only for orchard/crop */}
          {(farmTypes.includes('orchard') || farmTypes.includes('crop')) && (
            <View style={styles.uploadSection}>
              <Text style={styles.uploadTitle}>🍎 รูปผลผลิต/การเก็บเกี่ยว</Text>
              <Text style={styles.uploadDescription}>แสดงผลผลิตหรือสินค้าที่ได้จากฟาร์ม</Text>
              
              {!harvestPhoto ? (
                <TouchableOpacity 
                  style={styles.uploadButton}
                  onPress={() => pickImage(setHarvestPhoto)}
                >
                  <View style={styles.uploadIcon}>
                    <Text style={styles.uploadIconText}>🥕</Text>
                  </View>
                  <Text style={styles.uploadButtonText}>อัปโหลดรูปผลผลิต</Text>
                  <Text style={styles.uploadHint}>รองรับ JPG, PNG</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.uploadedContainer}>
                  <Image source={{ uri: harvestPhoto }} style={styles.uploadedImage} />
                  <View style={styles.uploadedInfo}>
                    <Text style={styles.uploadedText}>✅ อัปโหลดสำเร็จ</Text>
                    <TouchableOpacity onPress={() => pickImage(setHarvestPhoto)}>
                      <Text style={styles.changeImageText}>เปลี่ยนรูป</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Farm Description */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📝 รายละเอียดฟาร์ม</Text>
          <Text style={styles.inputLabel}>อธิบายเกี่ยวกับฟาร์มของคุณ</Text>
          <TextInput
            style={styles.textArea}
            placeholder="เช่น ปลูกข้าวโพดและถั่วเหลือง รายได้เฉลี่ยต่อฤดู 50,000 บาท มีประสบการณ์ 10 ปี ขายให้โรงสีและร้านค้า..."
            value={farmDescription}
            onChangeText={setFarmDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.characterCount}>{farmDescription.length}/500 ตัวอักษร</Text>
        </View>

        {/* Benefits Info */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>💡 ประโยชน์ที่จะได้รับ</Text>
          <View style={styles.benefitsList}>
            <Text style={styles.benefitItem}>
              • เพิ่มคะแนนความน่าเชื่อถือ +{landStatus === 'own' ? '25' : '15'} คะแนน
            </Text>
            <Text style={styles.benefitItem}>• เข้าถึงสินเชื่อเกษตรกรรมดอกเบิ้ยต่ำ</Text>
            <Text style={styles.benefitItem}>• รับข้อมูลราคาสินค้าเกษตรแบบ Real-time</Text>
            <Text style={styles.benefitItem}>• เข้าร่วมโครงการสนับสนุนเกษตรกร</Text>
            {landStatus === 'own' && (
              <Text style={styles.benefitItem}>• โบนัสพิเศษสำหรับเจ้าของที่ดิน +10 คะแนน</Text>
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
          <Text style={styles.verifyButtonText}>ส่งข้อมูลเกษตรกร</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

// สามารถใช้ styles เดิมจาก SelfBusinessScreen แต่ปรับแต่งสีหลักเป็นสีเขียวเพื่อให้เหมาะกับธีมเกษตรกรรม
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
    color: '#ff6600', // เปลี่ยนจากสีเขียวเป็นส้ม
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
    color: '#ff6600', // เปลี่ยนเป็นส้ม
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
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  landStatusOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  landStatusButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  landStatusButtonSelected: {
    borderColor: '#ff6600',
    backgroundColor: '#fff5f0',
  },
  landStatusIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  landStatusLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  landStatusLabelSelected: {
    color: '#ff6600',
    fontWeight: 'bold',
  },
  farmTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  farmTypeCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  farmTypeCardSelected: {
    borderColor: '#ff6600',
    backgroundColor: '#fff5f0',
  },
  farmTypeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  farmTypeLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  farmTypeLabelSelected: {
    color: '#ff6600',
    fontWeight: 'bold',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ff6600',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  addressInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
    fontSize: 16,
    minHeight: 100,
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