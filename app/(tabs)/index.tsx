import { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function WelcomeScreen() {
  const router = useRouter();

  // Animation refs
  const logoAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimationsAndNavigate = async () => {
      // Animate logo and text
      Animated.parallel([
        Animated.timing(logoAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.out(Easing.exp),
        }),
        Animated.timing(textAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.out(Easing.exp),
        }),
      ]).start();

      // Hide splash screen
      await SplashScreen.hideAsync();

      // Navigate after 3 seconds
      setTimeout(() => {
        router.replace('/login');
      }, 3000);
    };

    startAnimationsAndNavigate();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../assets/images/s_logo.png')}
        style={[
          styles.logo,
          {
            opacity: logoAnim,
            transform: [{ scale: logoAnim }],
          },
        ]}
        resizeMode="contain"
      />
      <Animated.Text style={[styles.title, { opacity: textAnim }]}>
        SafeM8
      </Animated.Text>
      <Animated.Text style={[styles.subtitle, { opacity: textAnim }]}>
        YOUR TRUSTY COMPANION FOR A{'\n'}SAFER TOMORROW!
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    color: '#AAAAAA',
    marginTop: 12,
    letterSpacing: 1,
  },
});
