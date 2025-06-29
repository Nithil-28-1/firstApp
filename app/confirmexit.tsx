// app/exitconfirm.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, BackHandler } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function confirmexit() {
  const router = useRouter();

  const handleExit = () => {
    BackHandler.exitApp();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.overlay}>
      <LinearGradient colors={['#2a2aee', '#b06ab3']} style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Hold On!</Text>
        <Text style={styles.modalMessage}>Do you want to exit the app?</Text>
        <View style={styles.modalButtons}>
          <TouchableOpacity onPress={handleExit} style={styles.modalButton}>
            <Text style={[styles.modalButtonText, { color: '#ff3131' }]}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCancel} style={styles.modalButton}>
            <Text style={[styles.modalButtonText, { color: '#00f919' }]}>No</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#46cbe2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: 'BrickSans',
    color: 'white',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 18,
    fontFamily: 'BrickSans',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 20,
    fontFamily: 'BrickSans',
  },
});
