import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoanSimulationScreen() {
  const router = useRouter();
  const [income, setIncome] = useState('20000');
  const [price, setPrice] = useState('1250000');
  const [years, setYears] = useState('20');
  const [downPayment, setDownPayment] = useState('125000');
  const [irsScore, setIrsScore] = useState('200');

  const calculateLoan = () => {
    const priceNum = parseFloat(price) || 0;
    const downNum = parseFloat(downPayment) || 0;
    const yearsNum = parseFloat(years) || 20;
    const incomeNum = parseFloat(income) || 0;
    const irsNum = parseInt(irsScore) || 0;

    const loanAmount = priceNum - downNum;
    const interestRate = 0.060;
    const monthlyRate = interestRate / 12;
    const totalMonths = yearsNum * 12;

    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
                          (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const debtToIncome = (monthlyPayment / incomeNum) * 100;

    let approvalChance = 0;
    if (debtToIncome <= 30) approvalChance = 85;
    else if (debtToIncome <= 40) approvalChance = 65;
    else if (debtToIncome <= 50) approvalChance = 40;
    else approvalChance = 15;

    if (irsNum >= 750) approvalChance += 10;
    else if (irsNum >= 700) approvalChance += 5;
    else if (irsNum >= 650) approvalChance += 0;
    else approvalChance -= 10;

    approvalChance = Math.min(100, Math.max(0, approvalChance));

    return {
      monthlyPayment: isNaN(monthlyPayment) ? 0 : monthlyPayment,
      debtToIncome,
      approvalChance,
      loanAmount
    };
  };

  const loanData = calculateLoan();

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.header}>จำลองเงินกู้</Text>
        <Text style={styles.subtitle}>คุณสามารถผ่อนได้เท่าไร?</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>ข้อมูลสำหรับคำนวณ</Text>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>รายได้ต่อเดือนของคุณ</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>฿</Text>
              <TextInput 
                style={styles.input} 
                value={income} 
                onChangeText={setIncome} 
                keyboardType="numeric"
                placeholder="20,000"
              />
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>ราคารวมของบ้านที่ต้องการ</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>฿</Text>
              <TextInput 
                style={styles.input} 
                value={price} 
                onChangeText={setPrice} 
                keyboardType="numeric"
                placeholder="1,250,000"
              />
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>เงินดาวน์</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>฿</Text>
              <TextInput 
                style={styles.input} 
                value={downPayment} 
                onChangeText={setDownPayment} 
                keyboardType="numeric"
                placeholder="125,000"
              />
            </View>
            <Text style={styles.percentageText}>
              ({((parseFloat(downPayment) / parseFloat(price)) * 100 || 0).toFixed(1)}% ของราคาบ้าน)
            </Text>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>จำนวนปีที่ต้องการผ่อน</Text>
            <View style={styles.yearSelector}>
              {['15', '20', '25', '30'].map(year => (
                <TouchableOpacity
                  key={year}
                  style={[styles.yearButton, years === year && styles.yearButtonSelected]}
                  onPress={() => setYears(year)}
                >
                  <Text style={[styles.yearText, years === year && styles.yearTextSelected]}>
                    {year} ปี
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>คะแนนเครดิต (Trust Score Credit)</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>📊</Text>
              <TextInput 
                style={styles.input} 
                value={irsScore} 
                onChangeText={setIrsScore} 
                keyboardType="numeric"
                placeholder="53"
              />
            </View>
            <Text style={styles.percentageText}>
              คะแนนเครดิตยิ่งสูง โอกาสอนุมัติก็ยิ่งมาก
            </Text>
          </View>
        </View>

        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>ผลการคำนวณ</Text>

          <View style={styles.paymentSection}>
            <Text style={styles.paymentLabel}>ค่างวดรายเดือนโดยประมาณ</Text>
            <Text style={styles.monthlyPayment}>
              ฿{loanData.monthlyPayment.toLocaleString('th-TH', { maximumFractionDigits: 0 })}
            </Text>
            <Text style={styles.periodText}>ระยะเวลา {years} ปี</Text>
          </View>

          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>วงเงินกู้</Text>
              <Text style={styles.detailValue}>
                ฿{loanData.loanAmount.toLocaleString('th-TH')}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>อัตราดอกเบี้ย</Text>
              <Text style={styles.detailValue}>6.0% ต่อปี</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>อัตราส่วนหนี้ต่อรายได้</Text>
              <Text style={[styles.detailValue, { color: loanData.debtToIncome > 40 ? '#f44336' : '#4CAF50' }]}> 
                {loanData.debtToIncome.toFixed(1)}%
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>คะแนนเครดิต</Text>
              <Text style={styles.detailValue}>{irsScore} คะแนน</Text>
            </View>
          </View>
        </View>

        <View style={styles.approvalCard}>
          <Text style={styles.approvalTitle}>โอกาสได้รับการอนุมัติ</Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${loanData.approvalChance}%`,
                    backgroundColor: loanData.approvalChance >= 60 ? '#4CAF50' : 
                                     loanData.approvalChance >= 40 ? '#FF9800' : '#f44336'
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{loanData.approvalChance}%</Text>
          </View>

          <View style={styles.approvalLevel}>
            <Text style={[styles.approvalLevelText, {
              color: loanData.approvalChance >= 60 ? '#4CAF50' : 
                     loanData.approvalChance >= 40 ? '#FF9800' : '#f44336'
            }]}> 
              {loanData.approvalChance >= 60 ? 'โอกาสสูง' : 
               loanData.approvalChance >= 40 ? 'โอกาสปานกลาง' : 'โอกาสต่ำ'}
            </Text>
          </View>

          {loanData.debtToIncome > 40 && (
            <View style={styles.recommendationBox}>
              <Text style={styles.recommendationTitle}>💡 คำแนะนำ</Text>
              <Text style={styles.recommendationText}>
                อัตราส่วนหนี้ต่อรายได้สูงเกินไป ({loanData.debtToIncome.toFixed(1)}%)
              </Text>
              <Text style={styles.recommendationItem}>• เพิ่มเงินดาวน์เพื่อลดวงเงินกู้</Text>
              <Text style={styles.recommendationItem}>• ขยายระยะเวลาผ่อนชำระ</Text>
              <Text style={styles.recommendationItem}>• พิจารณาบ้านราคาต่ำกว่า</Text>
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={styles.checkButton} 
          onPress={() => router.push('/eligibility')}
        >
          <Text style={styles.checkButtonText}>ตรวจสอบสิทธิ์ของคุณ</Text>
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
    padding: 16,
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
    marginBottom: 20,
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
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
  percentageText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  yearSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  yearButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  yearButtonSelected: {
    backgroundColor: '#ff6600',
    borderColor: '#ff6600',
  },
  yearText: {
    fontSize: 14,
    color: '#666',
  },
  yearTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultCard: {
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
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  paymentSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  paymentLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  monthlyPayment: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ff6600',
    marginBottom: 4,
  },
  periodText: {
    fontSize: 14,
    color: '#666',
  },
  detailsSection: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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
  approvalCard: {
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
  approvalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    marginRight: 12,
  },
  progressFill: {
    height: 12,
    borderRadius: 6,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 50,
  },
  approvalLevel: {
    alignItems: 'center',
    marginBottom: 16,
  },
  approvalLevelText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  recommendationBox: {
    backgroundColor: '#fff5f0',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6600',
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  recommendationItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  checkButton: {
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
  checkButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
