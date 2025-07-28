import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TrustIRSDashboardScreen() {
  // IRS Score Data
  const irsScore = 53;
  const maxIrsScore = 100;
  const irsPercentage = (irsScore / maxIrsScore) * 100;
  
  // Trust Score Data  
  const trustScore = 200;
  const trustLevel = 3;
  const trustPercentage = 75; // Overall trust percentage
  
  // Score Breakdown - แสดงที่มาของคะแนน IRS
  const scoreBreakdown = [
    { category: 'ความสม่ำเสมอการอัปโหลด', points: 25, maxPoints: 30, source: 'รายได้ประจำวัน' },
    { category: 'ความน่าเชื่อถือข้อมูล', points: 15, maxPoints: 25, source: 'เชื่อมต่อแพลตฟอร์ม' },
    { category: 'วินัยทางการเงิน', points: 18, maxPoints: 25, source: 'หลักฐานการชำระ' },
    { category: 'ยืนยันตัวตน', points: 10, maxPoints: 20, source: 'เอกสารประกอบ' },
    { category: 'ปัจจัยลบ', points: -15, maxPoints: 0, source: 'วันที่ขาดหาย, ข้อมูลไม่ตรง' },
  ];

  const achievements = [
    { title: 'ผู้กู้ตรงเวลา', desc: 'ชำระตรงเวลา 3 เดือน', icon: '🏆', earned: true, points: '+15' },
    { title: 'นักส่งข้อมูล', desc: 'อัปโหลดรายได้ 30 วัน', icon: '📊', earned: true, points: '+10' },
    { title: 'ผู้ประกอบการ', desc: 'ยืนยันธุรกิจสำเร็จ', icon: '🏪', earned: false, points: '+20' },
  ];

  const activities = [
    { date: '11 มิ.ย.', action: 'อัปโหลดรายได้', status: 'ยืนยันแล้ว', points: 5, impact: 'irs' },
    { date: '10 มิ.ย.', action: 'ไม่ได้ส่งข้อมูล', status: 'ขาดหาย', points: -2, impact: 'irs' },
    { date: '9 มิ.ย.', action: 'เชื่อมต่อแพลตฟอร์ม', status: 'GRAB ✓', points: 10, impact: 'trust' },
    { date: '8 มิ.ย.', action: 'อัปโหลดหลักฐานการเงิน', status: 'ยืนยันแล้ว', points: 8, impact: 'both' },
  ];

  const getScoreLevel = (score) => {
    if (score >= 80) return { label: 'ดีเยี่ยม', color: '#4CAF50', bg: '#e8f5e8' };
    if (score >= 60) return { label: 'ดี', color: '#FF9800', bg: '#fff3e0' };
    if (score >= 40) return { label: 'ปานกลาง', color: '#ff6600', bg: '#fff5f0' };
    return { label: 'ต้องปรับปรุง', color: '#f44336', bg: '#ffebee' };
  };

  const irsLevel = getScoreLevel(irsScore);
  const trustScoreLevel = getScoreLevel(trustPercentage);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.header}>คะแนนความน่าเชื่อถือ & IRS</Text>
        <Text style={styles.subtitle}>ติดตามคะแนนและปัจจัยที่ส่งผลต่อการประเมิน</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Combined Score Overview */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>ภาพรวมคะแนนของคุณ</Text>
          
          <View style={styles.scoresContainer}>
            {/* Trust Score */}
            <View style={styles.scoreItem}>
              <View style={styles.scoreHeader}>
                <Text style={styles.scoreLabel}>Trust Score</Text>
                <View style={[styles.levelBadge, { backgroundColor: trustScoreLevel.bg }]}>
                  <Text style={[styles.levelText, { color: trustScoreLevel.color }]}>
                    {trustScoreLevel.label}
                  </Text>
                </View>
              </View>
              <Text style={styles.mainScore}>{trustScore}</Text>
              <Text style={styles.scoreSubtext}>คะแนนสะสม</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[
                    styles.progressFill, 
                    { width: `${trustPercentage}%`, backgroundColor: trustScoreLevel.color }
                  ]} />
                </View>
                <Text style={styles.progressText}>{trustPercentage}%</Text>
              </View>
            </View>

            {/* IRS Score */}
            <View style={styles.scoreItem}>
              <View style={styles.scoreHeader}>
                <Text style={styles.scoreLabel}>IRS Score</Text>
                <View style={[styles.levelBadge, { backgroundColor: irsLevel.bg }]}>
                  <Text style={[styles.levelText, { color: irsLevel.color }]}>
                    {irsLevel.label}
                  </Text>
                </View>
              </View>
              <Text style={styles.mainScore}>{irsScore}</Text>
              <Text style={styles.scoreSubtext}>จาก {maxIrsScore} คะแนน</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[
                    styles.progressFill, 
                    { width: `${irsPercentage}%`, backgroundColor: irsLevel.color }
                  ]} />
                </View>
                <Text style={styles.progressText}>{Math.round(irsPercentage)}%</Text>
              </View>
            </View>
          </View>

          <View style={styles.relationshipInfo}>
            <Text style={styles.relationshipTitle}>💡 ความสัมพันธ์ของคะแนน</Text>
            <Text style={styles.relationshipText}>
              คะแนน IRS คำนวณจากความสม่ำเสมอและความน่าเชื่อถือของข้อมูลรายได้ 
              ซึ่งเป็นส่วนหนึ่งของ Trust Score รวม
            </Text>
          </View>
        </View>

        {/* Score Breakdown - แสดงที่มาของคะแนน */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>ที่มาของคะแนน IRS</Text>
          <Text style={styles.cardSubtitle}>แบ่งตามหมวดหมู่และแหล่งที่มา</Text>
          
          {scoreBreakdown.map((item, index) => (
            <View key={index} style={styles.breakdownItem}>
              <View style={styles.breakdownLeft}>
                <Text style={styles.breakdownCategory}>{item.category}</Text>
                <Text style={styles.breakdownSource}>จาก: {item.source}</Text>
              </View>
              <View style={styles.breakdownRight}>
                <Text style={[
                  styles.breakdownPoints,
                  { color: item.points > 0 ? '#4CAF50' : '#f44336' }
                ]}>
                  {item.points > 0 ? '+' : ''}{item.points}
                </Text>
                <Text style={styles.breakdownMax}>/{item.maxPoints > 0 ? item.maxPoints : '0'}</Text>
              </View>
            </View>
          ))}
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>รวมคะแนน IRS</Text>
            <Text style={styles.totalValue}>{irsScore}/{maxIrsScore}</Text>
          </View>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statLabel}>วันติดต่อกัน</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>85%</Text>
            <Text style={styles.statLabel}>อัตราส่งข้อมูล</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>แพลตฟอร์มที่เชื่อมต่อ</Text>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>รางวัลความสำเร็จ</Text>
          {achievements.map((achievement, index) => (
            <View key={index} style={styles.achievementItem}>
              <View style={[
                styles.achievementIcon,
                achievement.earned ? styles.achievementEarned : styles.achievementLocked
              ]}>
                <Text style={styles.achievementEmoji}>
                  {achievement.earned ? achievement.icon : '🔒'}
                </Text>
              </View>
              <View style={styles.achievementContent}>
                <Text style={[
                  styles.achievementTitle,
                  !achievement.earned && styles.achievementTitleLocked
                ]}>
                  {achievement.title}
                </Text>
                <Text style={styles.achievementDesc}>{achievement.desc}</Text>
              </View>
              <View style={styles.achievementPoints}>
                <Text style={styles.pointsText}>{achievement.points}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Activities */}
        <View style={styles.card}>
          <View style={styles.activityHeader}>
            <Text style={styles.cardTitle}>กิจกรรมล่าสุด</Text>
            <Text style={styles.activitySubtitle}>🕒 7 วันที่ผ่านมา</Text>
          </View>
          
          {activities.map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={styles.activityLeft}>
                <View style={[
                  styles.activityIndicator,
                  activity.points > 0 ? styles.activityPositive : styles.activityNegative
                ]}>
                  <Text style={styles.activityDot}>●</Text>
                </View>
                <Text style={styles.activityDate}>{activity.date}</Text>
              </View>
              
              <View style={styles.activityContent}>
                <Text style={styles.activityAction}>{activity.action}</Text>
                <Text style={[
                  styles.activityStatus,
                  activity.points > 0 ? styles.statusPositive : styles.statusNegative
                ]}>
                  {activity.status}
                </Text>
                <View style={styles.impactBadges}>
                  {activity.impact === 'trust' && (
                    <View style={styles.impactBadge}>
                      <Text style={styles.impactText}>Trust</Text>
                    </View>
                  )}
                  {activity.impact === 'irs' && (
                    <View style={[styles.impactBadge, styles.irsBadge]}>
                      <Text style={styles.impactText}>IRS</Text>
                    </View>
                  )}
                  {activity.impact === 'both' && (
                    <>
                      <View style={styles.impactBadge}>
                        <Text style={styles.impactText}>Trust</Text>
                      </View>
                      <View style={[styles.impactBadge, styles.irsBadge]}>
                        <Text style={styles.impactText}>IRS</Text>
                      </View>
                    </>
                  )}
                </View>
              </View>
              
              <View style={styles.activityRight}>
                <Text style={[
                  styles.activityPoints,
                  activity.points > 0 ? styles.pointsPositive : styles.pointsNegative
                ]}>
                  {activity.points > 0 ? `+${activity.points}` : activity.points}
                </Text>
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>ดูประวัติทั้งหมด</Text>
          </TouchableOpacity>
        </View>

        {/* Improvement Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>🎯 วิธีเพิ่มคะแนน</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Text style={styles.tipText}>• อัปโหลดรายได้ทุกวัน</Text>
              <Text style={styles.tipImpact}>+5 IRS, +2 Trust</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipText}>• เชื่อมต่อแพลตฟอร์มใหม่</Text>
              <Text style={styles.tipImpact}>+10 Trust</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipText}>• ยืนยันธุรกิจส่วนตัว</Text>
              <Text style={styles.tipImpact}>+15 Trust, +8 IRS</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipText}>• ชำระหนี้ตรงเวลา 7 วันติด</Text>
              <Text style={styles.tipImpact}>+20 Trust, +12 IRS</Text>
            </View>
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
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  overviewTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  scoresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  scoreItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  scoreHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  mainScore: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ff6600',
    marginBottom: 4,
  },
  scoreSubtext: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginRight: 8,
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    minWidth: 30,
  },
  relationshipInfo: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  relationshipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  relationshipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  breakdownLeft: {
    flex: 1,
  },
  breakdownCategory: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  breakdownSource: {
    fontSize: 12,
    color: '#999',
  },
  breakdownRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownPoints: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  breakdownMax: {
    fontSize: 14,
    color: '#999',
    marginLeft: 2,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#ff6600',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6600',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementEarned: {
    backgroundColor: '#fff5f0',
    borderWidth: 2,
    borderColor: '#ff6600',
  },
  achievementLocked: {
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  achievementEmoji: {
    fontSize: 24,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  achievementTitleLocked: {
    color: '#999',
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
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#666',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
  },
  activityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityPositive: {
    backgroundColor: '#4CAF50',
  },
  activityNegative: {
    backgroundColor: '#f44336',
  },
  activityDot: {
    fontSize: 8,
    color: '#fff',
  },
  activityDate: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
  },
  activityAction: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  activityStatus: {
    fontSize: 12,
    marginBottom: 4,
  },
  statusPositive: {
    color: '#4CAF50',
  },
  statusNegative: {
    color: '#f44336',
  },
  impactBadges: {
    flexDirection: 'row',
    gap: 4,
  },
  impactBadge: {
    backgroundColor: '#ff6600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  irsBadge: {
    backgroundColor: '#9C27B0',
  },
  impactText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  activityRight: {
    alignItems: 'flex-end',
    minWidth: 40,
  },
  activityPoints: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pointsPositive: {
    color: '#4CAF50',
  },
  pointsNegative: {
    color: '#f44336',
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: '#ff6600',
    fontWeight: 'bold',
  },
  tipsCard: {
    backgroundColor: '#fff5f0',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6600',
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  tipsList: {
    marginLeft: 8,
  },
  tipItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  tipImpact: {
    fontSize: 12,
    color: '#ff6600',
    fontWeight: 'bold',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
});
