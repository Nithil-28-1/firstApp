import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const screenHeight = Dimensions.get('window').height;

export default function Drawer({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const translateY = useRef(new Animated.Value(screenHeight)).current;

  const childAnim = useRef(new Animated.Value(0)).current;
  const surveilAnim = useRef(new Animated.Value(0)).current;
  const monitorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isVisible ? 0 : screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start();

    if (isVisible) {
      Animated.stagger(100, [
        Animated.timing(childAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(surveilAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(monitorAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      childAnim.setValue(0);
      surveilAnim.setValue(0);
      monitorAnim.setValue(0);
    }
  }, [isVisible]);

  const handleNavigate = (path: string) => {
    onClose(); // Close drawer
    setTimeout(() => router.push(path), 250); // Smooth transition
  };

  return (
    <Animated.View style={[styles.drawer, { transform: [{ translateY }] }]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onClose} style={styles.iconLeft}>
          <Ionicons name="apps" size={26} color="#ccc" />
        </TouchableOpacity>
        <Text style={styles.safeM8Text}>SafeM8</Text>
        <View style={styles.iconRightPlaceholder} />
      </View>

      <View style={styles.grid}>
        <View style={styles.row}>
          {/* ✅ Child Mode */}
          <TouchableOpacity onPress={() => handleNavigate('/child')}>
            <Animated.View
              style={[
                styles.box,
                {
                  borderColor: '#00FFFF',
                  opacity: childAnim,
                  transform: [{ scale: childAnim }],
                },
              ]}
            >
              <Image
                source={require('@/assets/images/child.mode.png')}
                style={styles.iconImage}
                resizeMode="contain"
              />
              <Text style={[styles.boxText, { color: '#00FFFF' }]}>Child Mode</Text>
            </Animated.View>
          </TouchableOpacity>

          {/* ✅ Surveillance Mode */}
          <TouchableOpacity onPress={() => handleNavigate('/surveillance')}>
            <Animated.View
              style={[
                styles.box,
                {
                  borderColor: '#FFFF33',
                  opacity: surveilAnim,
                  transform: [{ scale: surveilAnim }],
                },
              ]}
            >
              <Image
                source={require('@/assets/images/surveillance.mode.png')}
                style={styles.iconImage}
                resizeMode="contain"
              />
              <Text style={[styles.boxText, { color: '#FFFF33' }]}>Surveillance Mode</Text>
            </Animated.View>
          </TouchableOpacity>
        </View>

        <View style={styles.centerRow}>
          {/* ✅ Monitor Mode */}
          <TouchableOpacity onPress={() => handleNavigate('/monitor')}>
            <Animated.View
              style={[
                styles.box,
                {
                  borderColor: '#FF3131',
                  opacity: monitorAnim,
                  transform: [{ scale: monitorAnim }],
                },
              ]}
            >
              <Image
                source={require('@/assets/images/monitor.png')}
                style={styles.largeIconImage}
                resizeMode="contain"
              />
              <Text style={[styles.boxText, { color: '#FF3131' }]}>Monitor Mode</Text>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
    backgroundColor: '#1F1F2C',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
    elevation: 15,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  iconLeft: {
    width: 40,
    alignItems: 'flex-start',
  },
  iconRightPlaceholder: {
    width: 40,
  },
  safeM8Text: {
    color: '#39FF14',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  grid: {
    flex: 1,
    justifyContent: 'space-around',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  centerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  box: {
    backgroundColor: '#2D2E3E',
    width: 140,
    height: 140,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  boxText: {
    marginTop: 10,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 13,
  },
  iconImage: {
    width: 48,
    height: 48,
  },
  largeIconImage: {
    width: 60,
    height: 60,
  },
});
