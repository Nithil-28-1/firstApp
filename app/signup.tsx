import React, { useState } from 'react';
import {
  View, Text, TextInput, Image, TouchableOpacity,
  StyleSheet, Dimensions, ImageBackground, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, Easing,
} from 'react-native-reanimated';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const { width } = Dimensions.get('window');

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(40);

  React.useEffect(() => {
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

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Account created successfully!');
      router.push('/login');
    } catch (error: any) {
      console.error('Signup Error:', error);
      Alert.alert('Signup Failed', error.message);
    }
  };

  const handleLoginRedirect = () => {
    router.push('/login');
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
          <Text style={styles.register}>Register</Text>
          <Text style={styles.subtitle}>Create a new account</Text>
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

          <TouchableOpacity style={styles.loginButton} onPress={handleSignup}>
            <Text style={styles.loginButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.loginTextContainer}>
            <Text style={styles.haveAccountText}>Already have account? </Text>
            <TouchableOpacity onPress={handleLoginRedirect}>
              <Text style={styles.loginNowText}>Login</Text>
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
  register: { fontSize: 28, color: '#fff', fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#aaa', marginTop: 4 },
  form: { marginTop: 30, paddingHorizontal: 30 },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 16,
  },
  passwordContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  toggleButton: {
    position: 'absolute',
    right: 15,
    top: 12,
    padding: 4,
  },
  toggleText: {
    color: '#00BFFF',
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#00BFFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  loginTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  haveAccountText: { color: '#aaa', fontSize: 14 },
  loginNowText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});
