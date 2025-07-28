import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function TrustScoreDonut({ percent }) {
  const getColor = (score) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    return '#ff6600';
  };

  const getLevel = (score) => {
    if (score >= 80) return 'ดีเยี่ยม';
    if (score >= 60) return 'ดี';
    return 'ปานกลาง';
  };

  return (
    <View style={styles.donutContainer}>
      <View style={styles.donutBg} />
      <View style={[
        styles.donutFg, 
        { 
          transform: [{ rotate: `${(percent / 100) * 360}deg` }],
          borderTopColor: getColor(percent),
          borderRightColor: getColor(percent)
        }
      ]} />
      <View style={styles.donutInner}>
        <Text style={[styles.donutPercent, { color: getColor(percent) }]}>{percent}%</Text>
        <Text style={styles.donutLevel}>{getLevel(percent)}</Text>
      </View>
    </View>
  );
}

export default function MonthlyTrustTrackerScreen() {
  const trustScore = 75;
  const trustPoints = 200;
  const monthlyPayment = 6700;
  const nextDueDate = '23 ก.ค.';
  
  const achievements = [
    { name: 'ผู้กู้ตรงเวลา', desc: 'ชำระตรงเวลา 3 เดือน', icon: '🏆', points: '+15' },
    { name: 'จ่ายก่อนกำหนด', desc: 'ชำระก่อนถึงกำหนด 5 ครั้ง', icon: '⭐', points: '+10' }
  ];
  
  const alerts = [
    { msg: 'เหลือเวลาอีก 10 วันก่อนถึงกำหนดงวดถัดไป', action: 'ชำระเลย', urgent: true }
  ];
  
  const calendar = [
    { date: 13, type: 'LATE' },
    { date: 15, type: 'PAID' },
    { date: 23, type: 'UPCOMING' },
    { date: 24, type: 'PAID' }
  ];

  const getMark = (day) => calendar.find(c => c.date === day);
  const weeks = [];
  for (let w = 0; w < 5; w++) {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = w * 7 + i + 1;
      if (day > 30) days.push(null);
      else days.push(day);
    }
    weeks.push(days);
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.header}>ติดตามรายเดือน</Text>
        <Text style={styles.subtitle}>ติดตามคะแนนและประวัติการชำระเงิน</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Trust Score Card */}
        <View style={styles.trustCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>คะแนนความน่าเชื่อถือ</Text>
            <Text style={styles.lastUpdate}>อัปเดตล่าสุด 20/07/2568</Text>
          </View>
          
          <View style={styles.trustContent}>
            <TrustScoreDonut percent={trustScore} />
            <View style={styles.trustInfo}>
              <Text style={styles.trustPoints}>{trustPoints}</Text>
              <Text style={styles.trustPointsLabel}>คะแนนสะสม</Text>
              <View style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>
                  {trustScore >= 80 ? 'ระดับทอง' : trustScore >= 60 ? 'ระดับเงิน' : 'ระดับบรอนซ์'}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.earnTipCard}>
            <Text style={styles.tipIcon}>💡</Text>
            <Text style={styles.earnTip}>รับคะแนนโดยการชำระตรงเวลาและก่อนกำหนด</Text>
          </View>
        </View>

        {/* Next Payment Alert */}
        {alerts.map((alert, i) => (
          <View key={i} style={styles.alertCard}>
            <View style={styles.alertContent}>
              <View style={styles.alertIcon}>
                <Text style={styles.alertIconText}>🔔</Text>
              </View>
              <View style={styles.alertText}>
                <Text style={styles.alertMessage}>{alert.msg}</Text>
                <Text style={styles.paymentAmount}>฿{monthlyPayment.toLocaleString()}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.payNowButton}>
              <Text style={styles.payNowText}>{alert.action}</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Calendar Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>การผ่อนชำระรายเดือน</Text>
          <View style={styles.calendarContainer}>
            <Text style={styles.calendarMonth}>กรกฎาคม 2568</Text>
            
            {/* Calendar Header */}
            <View style={styles.calendarRow}>
              {['อา','จ','อ','พ','พฤ','ศ','ส'].map((d, idx) => (
                <Text key={d + idx} style={styles.calendarHeader}>{d}</Text>
              ))}
            </View>
            
            {/* Calendar Days */}
            {weeks.map((days, w) => (
              <View key={w} style={styles.calendarRow}>
                {days.map((day, i) => {
                  if (!day) return <View key={`empty-${w}-${i}`} style={styles.calendarCell} />;
                  const mark = getMark(day);
                  let cellStyle = [styles.calendarCell];
                  let markIcon = '';
                  
                  if (mark?.type === 'PAID') {
                    cellStyle.push(styles.paidCell);
                    markIcon = '✓';
                  } else if (mark?.type === 'LATE') {
                    cellStyle.push(styles.lateCell);
                    markIcon = '!';
                  } else if (mark?.type === 'UPCOMING') {
                    cellStyle.push(styles.upcomingCell);
                    markIcon = '●';
                  }
                  
                  return (
                    <View key={`day-${w}-${i}`} style={cellStyle}>
                      <Text style={styles.calendarDayNum}>{day}</Text>
                      {markIcon && <Text style={styles.calendarMark}>{markIcon}</Text>}
                    </View>
                  );
                })}
              </View>
            ))}
            
            {/* Legend */}
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#e8f5e8' }]} />
                <Text style={styles.legendLabel}>ชำระแล้ว</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#ffebee' }]} />
                <Text style={styles.legendLabel}>จ่ายช้า</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#fff5f0' }]} />
                <Text style={styles.legendLabel}>ใกล้ครบกำหนด</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Achievements Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>รางวัลที่ได้รับ</Text>
          {achievements.map((achievement, i) => (
            <View key={i} style={styles.achievementItem}>
              <View style={styles.achievementIcon}>
                <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
              </View>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementName}>{achievement.name}</Text>
                <Text style={styles.achievementDesc}>{achievement.desc}</Text>
              </View>
              <View style={styles.achievementPoints}>
                <Text style={styles.pointsText}>{achievement.points}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Tips Card */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>เคล็ดลับเพิ่มคะแนน</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tipItem}>• ชำระก่อนกำหนด +5 คะแนน</Text>
            <Text style={styles.tipItem}>• ชำระตรงเวลา 3 เดือนติด +10 คะแนน</Text>
            <Text style={styles.tipItem}>• อัปโหลดหลักฐานรายได้ +8 คะแนน</Text>
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
  trustCard: {
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
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  lastUpdate: {
    fontSize: 12,
    color: '#999',
  },
  trustContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  donutContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  donutBg: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 8,
    borderColor: '#e0e0e0',
  },
  donutFg: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 8,
    borderTopColor: '#ff6600',
    borderRightColor: '#ff6600',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  donutInner: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  donutPercent: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6600',
  },
  donutLevel: {
    fontSize: 10,
    color: '#666',
  },
  trustInfo: {
    marginLeft: 24,
    flex: 1,
  },
  trustPoints: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff6600',
    marginBottom: 4,
  },
  trustPointsLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  levelBadge: {
    backgroundColor: '#fff5f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ff6600',
  },
  earnTipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  earnTip: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  alertCard: {
    backgroundColor: '#fff5f0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6600',
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff6600',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertIconText: {
    fontSize: 20,
  },
  alertText: {
    flex: 1,
  },
  alertMessage: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6600',
  },
  payNowButton: {
    backgroundColor: '#ff6600',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  payNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  calendarContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
  },
  calendarMonth: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  calendarHeader: {
    width: 36,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    paddingVertical: 8,
  },
  calendarCell: {
    width: 36,
    height: 36,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 1,
  },
  paidCell: {
    backgroundColor: '#e8f5e8',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  lateCell: {
    backgroundColor: '#ffebee',
    borderWidth: 1,
    borderColor: '#f44336',
  },
  upcomingCell: {
    backgroundColor: '#fff5f0',
    borderWidth: 1,
    borderColor: '#ff6600',
  },
  calendarDayNum: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  calendarMark: {
    fontSize: 10,
    marginTop: -2,
    fontWeight: 'bold',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 12,
    color: '#666',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff5f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementEmoji: {
    fontSize: 24,
  },
  achievementContent: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 14,
    color: '#666',
  },
  achievementPoints: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tipsCard: {
    backgroundColor: '#fff5f0',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6600',
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
});
