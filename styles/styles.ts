import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#46cbe2',
  },
  robotImage: {
    width: 600,
    height: 600,
    marginBottom: 0,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: -60, // Moves text + spinner upward
  },
  greetingText: {
    fontSize: 28,
    fontFamily: 'BrickSans',
    color: '#333',
    marginBottom: 20,
  },
  spinner: {
    marginTop: 10,
  },
  container1: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  robotIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  gradientInput: {
    borderRadius: 12,
    marginBottom: 16,
    padding: 2,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  loginButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  arrowButton: {
    width: 50,
    height: 50,
  },
  signUpLink: {
    marginTop: 20,
  },
  signUpText: {
    color: '#0066cc',
    fontSize: 16,
  },
});
