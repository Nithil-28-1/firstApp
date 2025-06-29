import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, Linking,
  Alert, ScrollView,
} from 'react-native';
import Animated, { FadeInUp, FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';

export default function Profile() {
  const router = useRouter();
  const auth = getAuth();

  // 🔐 Auth guard
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/login');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        router.replace('/login'); // Prevent back navigation after logout
      })
      .catch((error) => Alert.alert('Logout Error', error.message));
  };

  const handleAbout = () => Alert.alert(
    'About SafeM8',
    'SafeM8 is an all-in-one security and monitoring robot system designed to safeguard your home and loved ones with real-time camera streaming, intelligent motion detection, and remote controls. Your peace of mind is our top priority.'
  );

  const handleSecurity = () => Alert.alert('Security', 'Security Patch V1');

  const handleReport = () => Alert.alert(
    'Report a Problem',
    'Please tap on this link to report the issue that you are facing:\n\nhttps://forms.office.com/r/cBHXT9AB6D',
    [
      { text: 'Open Form', onPress: () => Linking.openURL('https://forms.office.com/r/cBHXT9AB6D') },
      { text: 'Cancel', style: 'cancel' },
    ]
  );

  const handleSupport = () => Alert.alert(
    'Help & Support',
    'SafeM8@gmail.com\n\nYou can contact us by dropping an email to this address.'
  );

  const handlePolicies = () => Alert.alert(
    'Terms and Policies',
    `SafeM8 System Usage Terms

1. All user data is encrypted and not shared.
2. Unauthorized access attempts will be blocked.
3. Users are responsible for proper configuration of their devices.
4. SafeM8 reserves the right to update these terms.

-- End of Terms --`
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header Banner */}
      <Animated.View style={styles.banner} entering={FadeInDown.duration(600)}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={require('@/assets/icons/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>SafeM8</Text>
        <View style={{ width: 24 }} />
      </Animated.View>

      {/* Account Section */}
      <Animated.Text style={styles.sectionTitle} entering={FadeInRight.delay(200)}>
        Account
      </Animated.Text>
      <Animated.View style={styles.section} entering={FadeInUp.delay(300)}>
        <TouchableOpacity style={styles.item} onPress={handleAbout}>
          <Image source={require('@/assets/images/about.png')} style={styles.icon} />
          <Text style={styles.text}>About Us</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={handleSecurity}>
          <Image source={require('@/assets/images/security.png')} style={styles.icon} />
          <Text style={styles.text}>Security</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Support Section */}
      <Animated.Text style={styles.sectionTitle} entering={FadeInRight.delay(400)}>
        Support & About
      </Animated.Text>
      <Animated.View style={styles.section} entering={FadeInUp.delay(500)}>
        <TouchableOpacity style={styles.item} onPress={handleReport}>
          <Image source={require('@/assets/images/report.png')} style={styles.icon} />
          <Text style={styles.text}>Report a problem</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={handleSupport}>
          <Image source={require('@/assets/images/help.png')} style={styles.icon} />
          <Text style={styles.text}>Help & Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={handlePolicies}>
          <Image source={require('@/assets/images/policies.png')} style={styles.icon} />
          <Text style={[styles.text, styles.typeWriterFont]}>Terms and Policies</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Actions Section */}
      <Animated.Text style={styles.sectionTitle} entering={FadeInRight.delay(600)}>
        Actions
      </Animated.Text>
      <Animated.View style={styles.section} entering={FadeInUp.delay(700)}>
        <TouchableOpacity style={styles.item} onPress={handleLogout}>
          <Image source={require('@/assets/images/logout.png')} style={styles.icon} />
          <Text style={styles.text}>Log out</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  banner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#4A90E2', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 20,
    borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
  },
  backIcon: { width: 24, height: 24, tintColor: '#fff', resizeMode: 'contain' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  sectionTitle: {
    fontSize: 16, fontWeight: 'bold', paddingHorizontal: 16,
    marginTop: 20, color: '#333',
  },
  section: { backgroundColor: '#F9EAEA', marginVertical: 8, paddingVertical: 10 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16 },
  icon: { width: 22, height: 22, marginRight: 16, resizeMode: 'contain' },
  text: { fontSize: 15, color: '#222' },
  typeWriterFont: { fontFamily: 'Courier' },
});
