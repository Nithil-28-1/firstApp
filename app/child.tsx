import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Modal,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const qrData = [
  { label: 'FORWARD', source: require('../assets/images/forward.qr.png') },
  { label: 'REVERSE', source: require('../assets/images/reverse.qr.png') },
  { label: 'LEFT', source: require('../assets/images/left.qr.png') },
  { label: 'RIGHT', source: require('../assets/images/right.qr.png') },
];

export default function ChildModeScreen() {
  const router = useRouter();
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQR, setSelectedQR] = useState<any>(null);

  const startBounce = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleQRPress = (item: any) => {
    setSelectedQR(item);
    setModalVisible(true);
  };

  startBounce();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Image source={require('../assets/icons/back.png')} style={styles.backIcon} />
      </TouchableOpacity>

      {/* Background Shape */}
      <View style={styles.backgroundShape} />

      {/* Kid Illustration */}
      <Image source={require('../assets/images/kid.png')} style={styles.kidImage} />

      {/* Title */}
      <Text style={styles.title}>WELCOME TO CHILD MODE</Text>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.step}>1. BELOW YOU CAN FIND THE QR CODES</Text>
        <Text style={styles.step}>2. CHOOSE ONE AND POINT IT TO THE CAMERA</Text>
        <Text style={styles.step}>3. WAIT FOR THE MAGIC TO HAPPEN...</Text>
      </View>

      {/* QR Grid */}
      <View style={styles.qrGrid}>
        <View style={styles.qrRow}>
          {qrData.slice(0, 2).map((item) => (
            <Pressable key={item.label} onPress={() => handleQRPress(item)}>
              <Animated.View style={[styles.qrBox, { transform: [{ scale: bounceAnim }] }]}>
                <Text style={styles.qrLabel}>{item.label}</Text>
                <Image source={item.source} style={styles.qrImage} />
              </Animated.View>
            </Pressable>
          ))}
        </View>
        <View style={styles.qrRow}>
          {qrData.slice(2).map((item) => (
            <Pressable key={item.label} onPress={() => handleQRPress(item)}>
              <Animated.View style={[styles.qrBox, { transform: [{ scale: bounceAnim }] }]}>
                <Text style={styles.qrLabel}>{item.label}</Text>
                <Image source={item.source} style={styles.qrImage} />
              </Animated.View>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Enlarged QR Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedQR && (
              <>
                <Text style={styles.modalLabel}>{selectedQR.label}</Text>
                <Image source={selectedQR.source} style={styles.modalQR} />
              </>
            )}
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#fff8f6',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  backIcon: {
    width: 28,
    height: 28,
    tintColor: '#000',
  },
  backgroundShape: {
    position: 'absolute',
    top: 0,
    left: -60,
    width: 300,
    height: 300,
    backgroundColor: '#fddde6',
    borderRadius: 150,
    opacity: 0.3,
    zIndex: -1,
  },
  kidImage: {
    width: width * 0.6,
    height: width * 0.35,
    resizeMode: 'contain',
    marginTop: 40,
  },
  title: {
    fontFamily: 'LaBelleAurore',
    fontSize: 32,
    marginVertical: 20,
    color: '#f17c93',
    textAlign: 'center',
  },
  instructions: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  step: {
    fontFamily: 'LaBelleAurore',
    fontSize: 18,
    backgroundColor: '#fca5a5',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginVertical: 5,
    color: '#000',
  },
  qrGrid: {
    width: '100%',
  },
  qrRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 30,
  },
  qrBox: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#ddd',
    elevation: 4,
  },
  qrLabel: {
    fontFamily: 'LaBelleAurore',
    fontSize: 18,
    marginBottom: 10,
  },
  qrImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
  },
  modalQR: {
    width: 220,
    height: 220,
    marginVertical: 20,
  },
  modalLabel: {
    fontFamily: 'LaBelleAurore',
    fontSize: 24,
    color: '#333',
  },
  closeButton: {
    fontFamily: 'LaBelleAurore',
    fontSize: 18,
    color: '#ff4b4b',
    marginTop: 10,
  },
});
