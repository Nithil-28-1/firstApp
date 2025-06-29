import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import { onValue } from 'firebase/database';
import { realtimeDb, ref } from '../firebase'; // ✅ for Option B
import { LinearGradient } from 'expo-linear-gradient';

export default function MonitorBattery() {
  const router = useRouter();
  const [battery, setBattery] = useState<number | null>(null);

  useEffect(() => {
    const batteryRef = ref(realtimeDb, 'monitor/battery');
    const unsubscribe = onValue(batteryRef, (snapshot) => {
      const val = snapshot.val();
      console.log('🔋 Firebase battery value:', val);
      if (val !== null) setBattery(val);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ImageBackground
      source={require('@/assets/images/bg.gradient.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['#6E45E2', '#D66D75']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.topBanner}
      >
        <TouchableOpacity onPress={() => router.push('/home')} style={styles.backButton}>
          <Image source={require('@/assets/icons/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.bannerTitle}>Monitor Mode</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Image source={require('@/assets/images/glow.battery.png')} style={styles.glowBattery} />
        <Text style={styles.readingLabel}>The battery percentage is:-</Text>
        {battery !== null ? (
          <Text style={styles.batteryValue}>{battery} %</Text>
        ) : (
          <Text style={styles.batteryValue}>Loading...</Text>
        )}
      </View>

      {/* ✅ Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/monitor')}>
          <View style={styles.blackGlowBox}>
            <Image source={require('@/assets/icons/square.png')} style={styles.squareBackground} />
            <Image source={require('@/assets/images/temperature.png')} style={styles.navIconOverlay} />
          </View>
          <Text style={styles.navLabel}>Temperature</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/humidity')}>
          <View style={styles.blackGlowBox}>
            <Image source={require('@/assets/icons/square.png')} style={styles.squareBackground} />
            <Image source={require('@/assets/icons/humidity.png')} style={styles.navIconOverlay} />
          </View>
          <Text style={styles.navLabel}>Humidity</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButtonActive}>
          <View style={styles.blackGlowBox}>
            <Image source={require('@/assets/icons/square.png')} style={styles.squareBackground} />
            <Image source={require('@/assets/icons/battery.png')} style={styles.navIconOverlay} />
          </View>
          <View style={styles.navLabelContainer}>
            <Text style={styles.navLabel}>Battery</Text>
            <View style={styles.pinkUnderline} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/air')}>
          <View style={styles.blackGlowBox}>
            <Image source={require('@/assets/icons/square.png')} style={styles.squareBackground} />
            <Image source={require('@/assets/icons/air.quality.png')} style={styles.navIconOverlay} />
          </View>
          <Text style={styles.navLabel}>Air Quality</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBanner: {
    width: '100%',
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 2,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
    resizeMode: 'contain',
  },
  bannerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00F0FF',
    textShadowColor: '#00F0FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowBattery: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
    marginBottom: 25,
  },
  readingLabel: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 10,
  },
  batteryValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6EC7',
    textShadowColor: '#FF6EC7',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
    marginBottom: 30,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  navButton: {
    alignItems: 'center',
    width: 70,
  },
  navButtonActive: {
    alignItems: 'center',
    width: 70,
  },
  blackGlowBox: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareBackground: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  navIconOverlay: {
    position: 'absolute',
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  navLabel: {
    fontSize: 10,
    color: '#000',
    textAlign: 'center',
    marginTop: 2,
  },
  navLabelContainer: {
    alignItems: 'center',
    marginTop: 2,
  },
  pinkUnderline: {
    marginTop: 2,
    width: 35,
    height: 3,
    backgroundColor: '#FF007F',
    borderRadius: 2,
    shadowColor: '#FF007F',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
});
