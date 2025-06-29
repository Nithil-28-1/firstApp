import { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Easing } from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();

  const logoAnim = new Animated.Value(0);
  const textAnim = new Animated.Value(0);

  useEffect(() => {
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
      })
    ]).start();

    // Navigate after 3.5 seconds
    const timeout = setTimeout(() => {
      router.replace('/login');
    }, 3500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/images/s_logo.png')}
        style={[styles.logo, { opacity: logoAnim, transform: [{ scale: logoAnim }] }]}
        resizeMode="contain"
      />
      <Animated.Text style={[styles.title, { opacity: textAnim }]}>
        SafeM8
      </Animated.Text>
      <Animated.Text style={[styles.subtitle, { opacity: textAnim }]}>
        YOUR TRUSTY COMPANION FOR A{"\n"}SAFER TOMORROW!
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#AAA',
    textAlign: 'center',
    marginTop: 10,
  },
});
