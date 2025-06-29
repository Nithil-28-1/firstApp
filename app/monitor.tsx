import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { onValue } from 'firebase/database';
import { realtimeDb, ref } from '../firebase';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';

// Configure notification handler (for foreground notifications)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function MonitorTemperature() {
  const router = useRouter();
  const [temperature, setTemperature] = useState<number | null>(null);

  // 🔔 Request permissions on mount
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission for notifications not granted. Please enable it in settings.');
      }
    })();
  }, []);

  useEffect(() => {
    const tempRef = ref(realtimeDb, 'log/temp');
    const unsubscribe = onValue(tempRef, (snapshot) => {
      const val = snapshot.val();
      if (val !== null) {
        setTemperature(val);

        // 🔥 Trigger notification if temperature exceeds 35°C
        if (val > 35) {
          sendHighTempNotification(val);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔔 Function to send local notification
  const sendHighTempNotification = async (tempValue: number) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Temperature Alert 🚨',
        body: `Temperature is high: ${tempValue.toFixed(1)}°C`,
        sound: true,
      },
      trigger: null, // immediate notification
    });
  };

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
        <Image source={require('@/assets/images/glow.circle.png')} style={styles.glowCircle} />
        <Text style={styles.readingLabel}>The temperature reading is:-</Text>
        {temperature !== null ? (
          <Text style={styles.readingValue}>{temperature.toFixed(1)}°C</Text>
        ) : (
          <Text style={styles.readingValue}>Loading...</Text>
        )}
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButtonActive}>
          <View style={styles.blackGlowBox}>
            <Image source={require('@/assets/icons/square.png')} style={styles.squareBackground} />
            <Image source={require('@/assets/images/temperature.png')} style={styles.navIconOverlay} />
          </View>
          <View style={styles.navLabelContainer}>
            <Text style={styles.navLabel}>Temperature</Text>
            <View style={styles.pinkUnderline} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/humidity')}>
          <View style={styles.blackGlowBox}>
            <Image source={require('@/assets/icons/square.png')} style={styles.squareBackground} />
            <Image source={require('@/assets/icons/humidity.png')} style={styles.navIconOverlay} />
          </View>
          <Text style={styles.navLabel}>Humidity</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/battery')}>
          <View style={styles.blackGlowBox}>
            <Image source={require('@/assets/icons/square.png')} style={styles.squareBackground} />
            <Image source={require('@/assets/icons/battery.png')} style={styles.navIconOverlay} />
          </View>
          <Text style={styles.navLabel}>Battery</Text>
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
  glowCircle: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 25,
  },
  readingLabel: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 10,
  },
  readingValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00F0FF',
    textShadowColor: '#00F0FF',
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
