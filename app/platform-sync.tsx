import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const platforms = [
  {
    key: 'grab',
    name: 'คนขับ Grab',
    icon: '🚗',
    color: '#00B14F',
    summary: { today: 460, yesterday: 920, month: 19600, trips: 42 }
  },
  {
    key: 'lineman',
    name: 'คนขับ Lineman',
    icon: '🛵',
    color: '#0BD318',
    summary: { today: 380, yesterday: 800, month: 15500, trips: 35 }
  },
  {
    key: 'shopeefood',
    name: 'คนขับ ShopeeFood',
    icon: '🍔',
    color: '#E91E63',
    summary: { today: 320, yesterday: 650, month: 12800, trips: 28 }
  }
];

export default function PlatformSyncScreen() {
  const [selected, setSelected] = useState(platforms[0].key);
  const [connected, setConnected] = useState({
    grab: true,  // เริ่มต้นให้ Grab เชื่อมต่ออยู่แล้ว
  });
  const [lastSynced, setLastSynced] = useState('8 มิ.ย. 2568 – 21:35 น.');

  const handleConnect = (key) => {
    const isCurrentlyConnected = connected[key];
    const platformName = platforms.find(p => p.key === key).name;
    
    if (isCurrentlyConnected) {
      Alert.alert(
        'ยกเลิกการเชื่อมต่อ',
        `คุณต้องการยกเลิกการเชื่อมต่อกับ ${platformName} หรือไม่?`,
        [
          { text: 'ยกเลิก', style: 'cancel' },
          {
            text: 'ยกเลิกการเชื่อมต่อ',
            style: 'destructive',
            onPress: () => {
              setConnected({ ...connected, [key]: false });
              Alert.alert('ยกเลิกแล้ว', `ยกเลิกการเชื่อมต่อกับ ${platformName} แล้ว`);
            },
          },
        ]
      );
    } else {
      setConnected({ ...connected, [key]: true });
      Alert.alert('เชื่อมต่อสำเร็จ', `เชื่อมต่อกับ ${platformName} เรียบร้อยแล้ว`);
    }
  };

  const platform = platforms.find(p => p.key === selected);
  const isConnected = connected[selected];
  const connectedCount = Object.values(connected).filter(Boolean).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.header}>เชื่อมข้อมูลแพลตฟอร์ม</Text>
        <Text style={styles.subtitle}>เชื่อมต่อเพื่อดูรายงานรายได้อัตโนมัติ</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Connection Status Overview */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewHeader}>
            <Text style={styles.overviewTitle}>สถานะการเชื่อมต่อ</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{connectedCount} จาก {platforms.length} แพลตฟอร์ม</Text>
            </View>
          </View>
          
          {connectedCount > 0 && (
            <View style={styles.totalEarnings}>
              <Text style={styles.totalLabel}>รายได้รวมวันนี้</Text>
              <Text style={styles.totalAmount}>
                ฿{platforms
                  .filter(p => connected[p.key])
                  .reduce((sum, p) => sum + p.summary.today, 0)
                  .toLocaleString()}
              </Text>
            </View>
          )}
        </View>

        {/* Platform Selection */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>เลือกแพลตฟอร์ม</Text>
          <View style={styles.platformGrid}>
            {platforms.map(p => (
              <TouchableOpacity
                key={p.key}
                style={[
                  styles.platformCard,
                  selected === p.key && styles.platformCardSelected,
                  connected[p.key] && styles.platformCardConnected
                ]}
                onPress={() => setSelected(p.key)}
              >
                <View style={styles.platformHeader}>
                  <Text style={styles.platformIcon}>{p.icon}</Text>
                  {connected[p.key] && (
                    <View style={styles.connectedIndicator}>
                      <Text style={styles.connectedDot}>●</Text>
                    </View>
                  )}
                </View>
                <Text style={[
                  styles.platformName,
                  selected === p.key && styles.platformNameSelected
                ]}>
                  {p.name}
                </Text>
                <Text style={styles.platformStatus}>
                  {connected[p.key] ? 'เชื่อมต่อแล้ว' : 'ยังไม่เชื่อมต่อ'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Selected Platform Details */}
        <View style={styles.card}>
          <View style={styles.platformDetailsHeader}>
            <View style={styles.platformInfo}>
              <Text style={styles.platformIcon}>{platform.icon}</Text>
              <View style={styles.platformTitleContainer}>
                <Text style={styles.platformTitle}>{platform.name}</Text>
                <Text style={styles.platformSubtitle}>
                  {isConnected ? 'เชื่อมต่อแล้ว' : 'ยังไม่เชื่อมต่อ'}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={[
                styles.connectionButton,
                isConnected ? styles.disconnectButton : styles.connectButton
              ]}
              onPress={() => handleConnect(platform.key)}
            >
              <Text style={[
                styles.connectionButtonText,
                isConnected ? styles.disconnectButtonText : styles.connectButtonText
              ]}>
                {isConnected ? 'ยกเลิกการเชื่อมต่อ' : 'เชื่อมต่อ'}
              </Text>
            </TouchableOpacity>
          </View>

          {isConnected ? (
            <View style={styles.dataSection}>
              {/* Earnings Summary */}
              <View style={styles.earningsGrid}>
                <View style={styles.earningItem}>
                  <Text style={styles.earningLabel}>วันนี้</Text>
                  <Text style={styles.earningAmount}>฿{platform.summary.today.toLocaleString()}</Text>
                  <Text style={styles.earningTrips}>{platform.summary.trips} เที่ยว</Text>
                </View>
                <View style={styles.earningItem}>
                  <Text style={styles.earningLabel}>เมื่อวาน</Text>
                  <Text style={styles.earningAmount}>฿{platform.summary.yesterday.toLocaleString()}</Text>
                </View>
                <View style={styles.earningItem}>
                  <Text style={styles.earningLabel}>เดือนนี้</Text>
                  <Text style={styles.earningAmount}>฿{platform.summary.month.toLocaleString()}</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>📊 ดูรายงานละเอียด</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>📅 เลือกช่วงวันที่</Text>
                </TouchableOpacity>
              </View>

              {/* Sync Status */}
              <View style={styles.syncStatus}>
                <View style={styles.syncIndicator}>
                  <Text style={styles.syncDot}>🔄</Text>
                  <Text style={styles.syncText}>ซิงค์ล่าสุด: {lastSynced}</Text>
                </View>
                <TouchableOpacity style={styles.refreshButton}>
                  <Text style={styles.refreshButtonText}>รีเฟรช</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.notConnectedSection}>
              <View style={styles.notConnectedIcon}>
                <Text style={styles.notConnectedEmoji}>🔗</Text>
              </View>
              <Text style={styles.notConnectedTitle}>ยังไม่ได้เชื่อมต่อ</Text>
              <Text style={styles.notConnectedDesc}>
                เชื่อมต่อกับ {platform.name} เพื่อดูรายงานรายได้แบบอัตโนมัติ
              </Text>
              <View style={styles.benefitsList}>
                <Text style={styles.benefitItem}>• ดูรายได้แบบเรียลไทม์</Text>
                <Text style={styles.benefitItem}>• ติดตามสถิติการทำงาน</Text>
                <Text style={styles.benefitItem}>• เพิ่มคะแนนความน่าเชื่อถือ</Text>
              </View>
            </View>
          )}
        </View>

        {/* Security Notice */}
        <View style={styles.securityCard}>
          <Text style={styles.securityIcon}>🔒</Text>
          <View style={styles.securityContent}>
            <Text style={styles.securityTitle}>ความปลอดภัยของข้อมูล</Text>
            <Text style={styles.securityText}>
              ข้อมูลของคุณได้รับการเข้ารหัสและปกป้องด้วยมาตรฐานสากล
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
    padding: 16,
  },
  overviewCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  overviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    backgroundColor: '#fff5f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ff6600',
  },
  totalEarnings: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff6600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
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
  platformGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  platformCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginBottom: 12,
    alignItems: 'center',
  },
  platformCardSelected: {
    borderColor: '#ff6600',
    backgroundColor: '#fff5f0',
  },
  platformCardConnected: {
    borderColor: '#4CAF50',
  },
  platformHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  platformIcon: {
    fontSize: 32,
  },
  connectedIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  connectedDot: {
    fontSize: 16,
    color: '#4CAF50',
  },
  platformName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  platformNameSelected: {
    color: '#ff6600',
  },
  platformStatus: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  platformDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  platformTitleContainer: {
    marginLeft: 12,
  },
  platformTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  platformSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  connectionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  connectButton: {
    backgroundColor: '#fff5f0',
    borderColor: '#ff6600',
  },
  disconnectButton: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
  },
  connectionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  connectButtonText: {
    color: '#ff6600',
  },
  disconnectButtonText: {
    color: '#f44336',
  },
  dataSection: {
    marginTop: 8,
  },
  earningsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  earningItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  earningLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  earningAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6600',
    marginBottom: 4,
  },
  earningTrips: {
    fontSize: 12,
    color: '#999',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff6600',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#ff6600',
    fontWeight: '500',
  },
  syncStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  syncIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  syncDot: {
    fontSize: 16,
    marginRight: 8,
  },
  syncText: {
    fontSize: 12,
    color: '#666',
  },
  refreshButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#fff5f0',
  },
  refreshButtonText: {
    fontSize: 12,
    color: '#ff6600',
    fontWeight: 'bold',
  },
  notConnectedSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  notConnectedIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  notConnectedEmoji: {
    fontSize: 40,
  },
  notConnectedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  notConnectedDesc: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  benefitsList: {
    alignItems: 'flex-start',
  },
  benefitItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  securityCard: {
    backgroundColor: '#fff5f0',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#ff6600',
  },
  securityIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  securityContent: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  securityText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
