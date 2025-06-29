import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, Image, TouchableOpacity,
  StyleSheet, Dimensions, ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, Easing,
} from 'react-native-reanimated';
import { signInWithEmailAndPassword, onAuthStateChanged, getAuth } from 'firebase/auth';
import { auth } from '../firebase';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(40);

  useEffect(() => {
    const timeout = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.ease) });
      translateY.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.ease) });
    }, 50);
    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  // 🔐 Auth guard to redirect if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/home');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setErrorMessage('');
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/home');
    } catch (error: any) {
      setErrorMessage('Incorrect email or password.');
    }
  };

  const handleSignupRedirect = () => {
    router.push('/signup');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/bg1.png')}
        style={styles.topBackground}
        resizeMode="cover"
      >
        <Image
          source={require('../assets/images/SafeM8_Logo.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </ImageBackground>

      <Animated.View style={[animatedStyle]}>
        <View style={styles.textContainer}>
          <Text style={styles.welcome}>Welcome</Text>
          <Text style={styles.subtitle}>Login to your account</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={secureText}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setSecureText(!secureText)}
              style={styles.toggleButton}
            >
              <Text style={styles.toggleText}>{secureText ? 'Show' : 'Hide'}</Text>
            </TouchableOpacity>
          </View>

          {errorMessage !== '' && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.signupTextContainer}>
            <Text style={styles.noAccountText}>Don’t have account? </Text>
            <TouchableOpacity onPress={handleSignupRedirect}>
              <Text style={styles.createNowText}>Create Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  topBackground: {
    width: width,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { width: 80, height: 80 },
  textContainer: { alignItems: 'center', marginTop: 8 },
  welcome: { fontSize: 28, color: '#fff', fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#aaa', marginTop: 4 },
  form: { marginTop: 30, paddingHorizontal: 30 },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 12,
  },
  passwordContainer: { position: 'relative', justifyContent: 'center' },
  toggleButton: { position: 'absolute', right: 15, top: 12, padding: 4 },
  toggleText: { color: '#00BFFF', fontWeight: 'bold' },
  errorText: { color: 'red', fontSize: 14, marginBottom: 10, textAlign: 'center' },
  loginButton: {
    backgroundColor: '#00BFFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  signupTextContainer: {
    flexDirection: 'row', justifyContent: 'center', marginTop: 16,
  },
  noAccountText: { color: '#aaa', fontSize: 14 },
  createNowText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});
