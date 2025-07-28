import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function EligibilityScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.header}>ตรวจสอบสิทธิ์ของคุณ</Text>
        <Text style={styles.subtitle}>ดูโอกาสในการได้รับอนุมัติของคุณ</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>ผลการประเมินสิทธิ์</Text>
            <View style={styles.statusBadgeMedium}> {/* changed color */}
              <Text style={styles.statusTextMedium}>โอกาสปานกลาง</Text>
            </View>
          </View>

          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>ประมาณการค่างวดรายเดือน</Text>
            <Text style={styles.amountValue}>฿6,700</Text>
            <Text style={styles.periodText}>ระยะเวลา 20 ปี</Text>
          </View>

          <View style={styles.approvalSection}>
            <Text style={styles.approvalLabel}>โอกาสได้รับการอนุมัติ</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={styles.progressFillMedium} />
              </View>
              <Text style={styles.progressTextMedium}>ปานกลาง (55%)</Text>
            </View>
          </View>

          <View style={styles.loanDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>วงเงินสูงสุด</Text>
              <Text style={styles.detailValue}>฿1,500,000</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>อัตราดอกเบียย</Text>
              <Text style={styles.detailValue}>6.0% ต่อปี</Text>
            </View>
          </View>
        </View>

        {/* Recommended Programs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>โปรแกรมสินเชื่อที่แนะนำ</Text>
          
          <TouchableOpacity style={[styles.programCard, styles.recommendedProgram]}>
            <View style={styles.programHeader}>
              <View style={styles.programIcon}>
                <Text style={styles.iconText}>🏠</Text>
              </View>
              <View style={styles.programInfo}>
                <Text style={styles.programName}>บ้านล้านหลัง</Text>
                <Text style={styles.programDesc}>เน้นกลุ่มรายได้น้อย</Text>
              </View>
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>แนะนำ</Text>
              </View>
            </View>
            <View style={styles.programFeatures}>
              <Text style={styles.featureText}>• ดาวน์เพียง 5%</Text>
              <Text style={styles.featureText}>• อัตราดอกเบียพิเศษ</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.programCard}>
            <View style={styles.programHeader}>
              <View style={styles.programIcon}>
                <Text style={styles.iconText}>🏘️</Text>
              </View>
              <View style={styles.programInfo}>
                <Text style={styles.programName}>บ้านเพื่อประชาชน</Text>
                <Text style={styles.programDesc}>แผนผ่อนชำระแบบยืดหยุ่น</Text>
              </View>
            </View>
            <View style={styles.programFeatures}>
              <Text style={styles.featureText}>• ผ่อนได้นานถึง 30 ปี</Text>
              <Text style={styles.featureText}>• ไม่มีค่าธรรมเนียม</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.programCard}>
            <View style={styles.programHeader}>
              <View style={styles.programIcon}>
                <Text style={styles.iconText}>👔</Text>
              </View>
              <View style={styles.programInfo}>
                <Text style={styles.programName}>แผนคนทำงานใหม่</Text>
                <Text style={styles.programDesc}>เหมาะกับวัยเริ่มทำงาน</Text>
              </View>
            </View>
            <View style={styles.programFeatures}>
              <Text style={styles.featureText}>• รายได้ขั้นต่ำ 15,000 บาท</Text>
              <Text style={styles.featureText}>• อนุมัติไว ได้เงินเร็ว</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>ดำเนินการตั้งค่าสัญญา</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>ปรึกษาผู้เชี่ยวชาญ</Text>
          </TouchableOpacity>
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
    lineHeight: 24,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  mainCard: {
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
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadgeMedium: {
    backgroundColor: '#fff3e0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusTextMedium: {
    color: '#FF9800',
    fontSize: 12,
    fontWeight: 'bold',
  },
  amountSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  amountLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff6600',
    marginBottom: 4,
  },
  periodText: {
    fontSize: 14,
    color: '#666',
  },
  approvalSection: {
    marginBottom: 20,
  },
  approvalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginRight: 12,
  },
  progressFillMedium: {
    width: '55%',
    height: 8,
    backgroundColor: '#FF9800',
    borderRadius: 4,
  },
  progressTextMedium: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  loanDetails: {
    marginTop: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginHorizontal: 4,
  },
  programCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recommendedProgram: {
    borderWidth: 2,
    borderColor: '#ff6600',
  },
  programHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  programIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff5f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  programInfo: {
    flex: 1,
  },
  programName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  programDesc: {
    fontSize: 14,
    color: '#666',
  },
  recommendedBadge: {
    backgroundColor: '#ff6600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  recommendedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  programFeatures: {
    marginLeft: 52,
  },
  featureText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  actionSection: {
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: '#ff6600',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#ff6600',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#ff6600',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
