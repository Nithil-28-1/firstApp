import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getDatabase, ref, onValue } from 'firebase/database';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function NotificationScreen() {
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const db = getDatabase();
    const faceLogRef = ref(db, 'face_log');

    onValue(faceLogRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const newLog = {
          count: data.count_in_last_30s,
          time: data.last_detected_time,
        };

        setLogs((prevLogs) => {
          const updatedLogs = [newLog, ...prevLogs];
          if (updatedLogs.length > 5) {
            updatedLogs.pop(); // Keep only latest 5 logs
          }
          return updatedLogs;
        });
      }
    });
  }, []);

  return (
    <LinearGradient
      colors={['#ff0080', '#7928ca']}
      style={styles.container}
    >
      {/* Top Left Pattern - smaller and behind title */}
      <Image
        source={require('../assets/images/pattern.1.png')}
        style={styles.topPattern}
        resizeMode="cover"
      />

      {/* Bottom Right Pattern - moved behind notifications */}
      <Image
        source={require('../assets/images/pattern.2.png')}
        style={styles.bottomPattern}
        resizeMode="cover"
      />

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Image
          source={require('../assets/icons/back.png')}
          style={styles.backIcon}
        />
      </TouchableOpacity>

      {/* Title */}
      <Animated.Text style={styles.title} entering={FadeInDown.duration(800)}>
        Logs :-{'\n'}Face Detection
      </Animated.Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {logs.map((log, index) => (
          <Animated.View
            key={index}
            style={styles.notificationBox}
            entering={FadeInUp.delay(index * 200)}
          >
            <Image
              source={require('../assets/icons/face.png')}
              style={styles.faceIcon}
            />
            <View>
              <Text style={styles.notificationTitle}>Face Detected</Text>
              <Text style={styles.notificationText}>
                Count: {log.count} | Time: {log.time}
              </Text>
            </View>
          </Animated.View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topPattern: {
    position: 'absolute',
    top: 0.5,
    left: 0,
    width: width * 0.3, // smaller width
    height: width * 0.3, // smaller height
    borderBottomRightRadius: width * 0.15,
    overflow: 'hidden',
    zIndex: 0, // behind title
  },
  bottomPattern: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: width * 0.5,
    height: width * 0.5,
    borderTopLeftRadius: width * 0.25,
    overflow: 'hidden',
    zIndex: 0, // moved behind notifications
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backIcon: {
    width: 30,
    height: 30,
    tintColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginTop: 80,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#fff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    zIndex: 2, // above pattern
  },
  scrollContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  notificationBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 2, // ensure notifications are above pattern.2
  },
  faceIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
    tintColor: '#000',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  notificationText: {
    fontSize: 14,
    color: '#333',
  },
});
