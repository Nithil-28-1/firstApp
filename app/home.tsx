import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  RefreshControl,
  ScrollView,
  Keyboard,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import Drawer from '../app/Drawer';
import { getDatabase, ref, onValue } from 'firebase/database';

const screenHeight = Dimensions.get('window').height;

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const logoAnim = useRef(new Animated.Value(0)).current;
  const addDeviceAnim = useRef(new Animated.Value(0)).current;
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const db = getDatabase();
    const faceLogRef = ref(db, 'face_log');

    onValue(faceLogRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.count_in_last_30s > 0) {
        setHasNotification(true);
      } else {
        setHasNotification(false);
      }
    });
  }, []);

  useFocusEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    Animated.parallel([
      Animated.spring(logoAnim, { toValue: 1, useNativeDriver: true, friction: 5 }),
      Animated.timing(addDeviceAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  });

  const onRefresh = () => {
    setRefreshing(true);
    logoAnim.setValue(0);
    addDeviceAnim.setValue(0);

    Animated.parallel([
      Animated.spring(logoAnim, { toValue: 1, useNativeDriver: true, friction: 5 }),
      Animated.timing(addDeviceAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start(() => setRefreshing(false));
  };

  const handleNotificationPress = () => {
    setHasNotification(false);
    router.push('/notification');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.headerBar}>
        {/* Notification Icon right aligned */}
        <View style={styles.headerSide} />

        <Text style={styles.headerText}>SafeM8</Text>

        <TouchableOpacity style={styles.notificationIconContainer} onPress={handleNotificationPress}>
          <Image
            source={require('../assets/icons/notification.png')}
            style={styles.notificationIcon}
          />
          {hasNotification && <View style={styles.redDot} />}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.Image
          source={require('@/assets/images/S.Logo.png')}
          style={[styles.logo, { transform: [{ scale: logoAnim }], opacity: logoAnim }]}
          resizeMode="contain"
        />
      </ScrollView>

      {!keyboardVisible && (
        <View style={styles.bottomPanel}>
          <TouchableOpacity onPress={onRefresh} style={styles.iconButton}>
            <Ionicons name="home" size={26} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => setDrawerVisible(true)}>
            <Ionicons name="add-circle" size={58} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/profile')}>
            <Ionicons name="person-outline" size={26} color="#333" />
          </TouchableOpacity>
        </View>
      )}

      <Drawer isVisible={drawerVisible} onClose={() => setDrawerVisible(false)} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FCFF',
  },
  headerBar: {
    width: '100%',
    backgroundColor: '#007AFF',
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSide: {
    width: 28, // left side spacer to center SafeM8 text
  },
  headerText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  notificationIconContainer: {
    position: 'relative',
  },
  notificationIcon: {
    width: 28,
    height: 28,
    tintColor: '#fff',
  },
  redDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 150,
  },
  logo: {
    width: '90%',
    height: 220,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    height: 70,
    backgroundColor: '#fff',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 10,
  },
  iconButton: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
