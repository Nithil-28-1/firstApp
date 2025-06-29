import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Animated, PanResponder,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { WebView } from 'react-native-webview';
import { realtimeDb, ref, set } from '../firebase';

const { width, height } = Dimensions.get('window');
const dpadRadius = 80;
const joystickRadius = 30;
const maxDragDistance = dpadRadius - joystickRadius;

const cameraMap: Record<string, number> = {
  center: 0, up: 1, down: 2, right: 3, left: 4,
};

export default function SurveillanceScreen() {
  const router = useRouter();
  const screenAnim = useRef(new Animated.Value(0)).current;
  const pan = useRef(new Animated.ValueXY()).current;
  const [joystickData, setJoystickData] = useState({ dx: 0, dy: 0, directionLabel: 'center', directionCode: 0 });
  const [cameraDirection, setCameraDirection] = useState('center');
  const colorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(screenAnim, { toValue: 1, duration: 700, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(colorAnim, { toValue: 0, duration: 1000, useNativeDriver: false }),
        Animated.timing(colorAnim, { toValue: 1, duration: 1000, useNativeDriver: false }),
        Animated.timing(colorAnim, { toValue: 2, duration: 1000, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const getDirection = (dx: number, dy: number): { label: string; code: number } => {
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle >= 45 && angle < 135) return { label: 'up', code: 1 };
    if (angle >= -135 && angle < -45) return { label: 'down', code: 2 };
    if (angle >= -45 && angle < 45) return { label: 'right', code: 3 };
    if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) return { label: 'left', code: 4 };
    return { label: 'center', code: 0 };
  };

  const sendJoystickData = async (dx: number, dy: number, directionCode: number) => {
    try {
      await set(ref(realtimeDb, 'joystick'), { dx, dy, direction: directionCode });
    } catch (error) {
      console.error('Error sending joystick data:', error);
    }
  };

  const sendCameraDirection = async (direction: string) => {
    setCameraDirection(direction);
    try {
      await set(ref(realtimeDb, 'cameraDirection'), { Cdirection: cameraMap[direction] ?? 0 });
    } catch (error) {
      console.error('Error sending camera direction:', error);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => pan.setOffset({ x: 0, y: 0 }),
      onPanResponderMove: (_, gesture) => {
        let dx = gesture.dx;
        let dy = -gesture.dy; // ✅ Invert Y to make UP = positive dy

        const distance = Math.sqrt(dx ** 2 + dy ** 2);
        if (distance > maxDragDistance) {
          const scale = maxDragDistance / distance;
          dx *= scale;
          dy *= scale;
        }

        pan.setValue({ x: dx, y: -dy }); // Inverted for correct visual display

        const normDx = parseFloat(((dx / maxDragDistance) * 100).toFixed(1));
        const normDy = parseFloat(((dy / maxDragDistance) * 100).toFixed(1));

        const { label, code } = getDirection(normDx, normDy);
        const newData = { dx: normDx, dy: normDy, directionLabel: label, directionCode: code };
        setJoystickData(newData);
        sendJoystickData(normDx, normDy, code);
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
        setJoystickData({ dx: 0, dy: 0, directionLabel: 'center', directionCode: 0 });
        sendJoystickData(0, 0, 0);
      },
    })
  ).current;

  const interpolatedColor = colorAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['#FF4B4B', '#0080FF', '#00FF66'],
  });

  return (
    <LinearGradient colors={['#d0e8ff', '#f0f8ff']} style={{ flex: 1 }}>
      <Animated.View style={[styles.container, {
        opacity: screenAnim,
        transform: [{ translateY: screenAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
      }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Image source={require('../assets/icons/back.png')} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.title}>Live Streaming</Text>
        </View>

        <View style={styles.streamFrame}>
          <WebView
            source={{ uri: 'http://192.168.31.232:5000/embed' }}
            style={styles.webview}
            javaScriptEnabled
            domStorageEnabled
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
          />
        </View>

        <View style={styles.controlsContainer}>
          <View style={styles.leftRightContainer}>
            <View style={styles.cameraController}>
              <TouchableOpacity onPress={() => sendCameraDirection('up')} style={[styles.camButton, styles.camUp]}>
                <Image source={require('../assets/icons/arrow.up.png')} style={styles.camIcon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => sendCameraDirection('down')} style={[styles.camButton, styles.camDown]}>
                <Image source={require('../assets/icons/arrow.down.png')} style={styles.camIcon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => sendCameraDirection('left')} style={[styles.camButton, styles.camLeft]}>
                <Image source={require('../assets/icons/arrow.left.png')} style={styles.camIcon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => sendCameraDirection('right')} style={[styles.camButton, styles.camRight]}>
                <Image source={require('../assets/icons/arrow.right.png')} style={styles.camIcon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => sendCameraDirection('center')} style={[styles.camButton, styles.camCenter]}>
                <Image source={require('../assets/icons/circle.png')} style={styles.camIcon} />
              </TouchableOpacity>
            </View>

            <View style={styles.dpadBase}>
              <Image source={require('../assets/icons/up.png')} style={[styles.dpadArrow, { top: 10 }]} />
              <Image source={require('../assets/icons/down.png')} style={[styles.dpadArrow, { bottom: 10 }]} />
              <Image source={require('../assets/icons/left.png')} style={[styles.dpadArrow, { left: 10 }]} />
              <Image source={require('../assets/icons/right.png')} style={[styles.dpadArrow, { right: 10 }]} />
              <Animated.View
                style={[styles.joystick, { transform: [{ translateX: pan.x }, { translateY: pan.y }] }]}
                {...panResponder.panHandlers}
              />
            </View>
          </View>

          <Text style={styles.dataText}>Direction: {joystickData.directionLabel}</Text>
          <Text style={styles.dataText}>Camera: {cameraDirection}</Text>
          <Animated.Text style={[styles.safem8Text, { color: interpolatedColor }]}>SAFEM8</Animated.Text>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: { width: 26, height: 26, tintColor: '#fff' },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 26,
  },
  streamFrame: {
    margin: 20,
    height: height * 0.25,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: '#000',
    borderRadius: 15,
    overflow: 'hidden',
  },
  webview: { width: '100%', height: '100%' },
  controlsContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 10,
  },
  leftRightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
  },
  dpadBase: {
    width: dpadRadius * 2,
    height: dpadRadius * 2,
    borderRadius: dpadRadius,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  joystick: {
    width: joystickRadius * 2,
    height: joystickRadius * 2,
    borderRadius: joystickRadius,
    backgroundColor: '#555',
    borderWidth: 3,
    borderColor: '#999',
    position: 'absolute',
    zIndex: 2,
  },
  dpadArrow: {
    position: 'absolute',
    width: 30,
    height: 30,
    resizeMode: 'contain',
    zIndex: 1,
  },
  dataText: {
    marginTop: 4,
    fontSize: 16,
    color: '#333',
  },
  safem8Text: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 25,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  cameraController: {
    width: 140,
    height: 140,
    position: 'relative',
    marginRight: 10,
  },
  camButton: {
    position: 'absolute',
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  camUp: { top: 0, left: 42 },
  camDown: { bottom: 0, left: 42 },
  camLeft: { top: 42, left: 0 },
  camRight: { top: 42, right: 0 },
  camCenter: { top: 42, left: 42 },
});
