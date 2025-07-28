import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CertificateDownloadScreen() {
    const router = useRouter();
    const [isDownloading, setIsDownloading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setShowSuccessModal(true);
        } catch (error) {
            Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถดาวน์โหลดได้ กรุณาลองใหม่');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerSection}>
                <Text style={styles.header}>ดาวน์โหลดใบรับรอง</Text>
                <Text style={styles.subtitle}>ใบรับรองของคุณสามารถใช้ประกอบการยื่นกู้</Text>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                <Text style={styles.emoji}>🎊</Text>
                <Text style={styles.mainTitle}>คุณผ่านเกณฑ์การประเมินแล้ว</Text>
                <Text style={styles.subtitle}>ใบรับรองความน่าเชื่อถือทางการเงินของคุณพร้อมแล้ว</Text>

                <View style={styles.card}>
                    <Text style={styles.cardLabel}>คะแนนสุดท้ายของคุณ</Text>
                    <Text style={styles.score}>100/100</Text>
                    <Text style={styles.scoreLevel}>ระดับ: ดีเยี่ยม</Text>
                    <View style={styles.divider} />
                    <Text style={styles.detail}>✅ ผ่านเกณฑ์การประเมิน</Text>
                    <Text style={styles.detail}>💰 วงเงินประมาณ: 1.2 ล้านบาท</Text>
                    <Text style={styles.detail}>📅 ใช้ได้นาน: 6 เดือน</Text>
                </View>

                <TouchableOpacity
                    style={[styles.downloadButton, isDownloading && styles.downloadButtonDisabled]}
                    onPress={handleDownload}
                    disabled={isDownloading}
                >
                    <Text style={styles.downloadText}>
                        {isDownloading ? '📄 กำลังสร้างใบรับรอง...' : '📄 ดาวน์โหลดใบรับรอง PDF'}
                    </Text>
                </TouchableOpacity>

                <Text style={styles.helpText}>💡 ใบรับรองนี้สามารถใช้ยื่นกู้สินเชื่อกับธนาคารได้</Text>
            </View>

            {/* Modal */}
            <Modal visible={showSuccessModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>🎉 ดาวน์โหลดสำเร็จ!</Text>
                        <View style={styles.previewBox}>
                            <Text style={styles.previewHeader}>ใบรับรองความน่าเชื่อถือ</Text>
                            <Text style={styles.previewSub}>GHB My First Home</Text>
                            <Text style={styles.previewText}>ชื่อ: นาย XXX</Text>
                            <Text style={styles.previewText}>คะแนน IRS: 100/100</Text>
                            <Text style={styles.previewText}>ระดับ: ดีเยี่ยม</Text>
                            <Text style={styles.previewText}>วันที่ออก: {new Date().toLocaleDateString('th-TH')}</Text>
                            <Text style={styles.previewFooter}>✅ ใช้ได้สำหรับยื่นกู้สินเชื่อ</Text>
                        </View>
                        <Text style={styles.modalDescription}>ใบรับรองของคุณพร้อมใช้งานแล้ว</Text>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={() => {
                                    setShowSuccessModal(false);
                                    Alert.alert('เปิดไฟล์', 'ใบรับรองถูกบันทึกในอุปกรณ์แล้ว');
                                }}
                            >
                                <Text style={styles.primaryButtonText}>เปิดไฟล์</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.secondaryButton}
                                onPress={() => setShowSuccessModal(false)}
                            >
                                <Text style={styles.secondaryButtonText}>ปิด</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    content: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4CAF50',
        textAlign: 'center',
        marginBottom: 12,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        marginBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        width: '100%',
    },
    cardLabel: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    score: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 8,
    },
    scoreLevel: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: 'bold',
        marginBottom: 16,
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#f0f0f0',
        marginBottom: 16,
    },
    detail: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
    },
    downloadButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 25,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 20,
    },
    downloadButtonDisabled: {
        backgroundColor: '#ccc',
        shadowOpacity: 0.1,
    },
    downloadText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    helpText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        width: '85%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    previewBox: {
        width: '100%',
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#4CAF50',
    },
    previewHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#ff6600',
        marginBottom: 4,
    },
    previewSub: {
        fontSize: 12,
        textAlign: 'center',
        color: '#666',
        marginBottom: 16,
    },
    previewText: {
        fontSize: 12,
        color: '#333',
        marginBottom: 4,
    },
    previewFooter: {
        fontSize: 12,
        color: '#4CAF50',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    modalDescription: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    primaryButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 20,
    },
    primaryButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    secondaryButton: {
        backgroundColor: '#f5f5f5',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 20,
    },
    secondaryButtonText: {
        color: '#666',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
