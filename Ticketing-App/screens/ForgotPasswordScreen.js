import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
  ImageBackground,
} from 'react-native';
import axios from 'axios';

const { width: initialWidth, height: initialHeight } = Dimensions.get('window');

const ForgotPasswordScreen = ({ navigation }) => {
  const [username, setUsername] = useState(''); // Only using username now
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screenWidth, setScreenWidth] = useState(initialWidth);
  const [screenHeight, setScreenHeight] = useState(initialHeight);
  const [usernameError, setUsernameError] = useState(''); // To store validation error

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window: { width, height } }) => {
      setScreenWidth(width);
      setScreenHeight(height);
    });

    return () => subscription?.remove();
  }, []);

  const handleSendOtp = async () => {
    if (!username) {
      setUsernameError('Username is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { username }; // Only sending username now
      const response = await axios.post('https://true-weevil-hardly.ngrok-free.app/user/forgot-password', payload);

      if (response.status === 200) {
        setUsernameError(''); // Reset error if successful
        navigation.navigate('VerifyForgotPassword', { username }); // Passing username
      } else {
        setUsernameError('Username not found. Please try again.'); // Display validation error
      }
    } catch (error) {
      setUsernameError('Username not found. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <ImageBackground
        source={require('../assets/login.png')}
        style={[styles.background, { width: screenWidth, height: screenHeight }]}
        resizeMode="cover"
      >
        <View style={styles.topBox}>
          <Image source={require('../assets/loge_new 2.png')} style={styles.logo} />
        </View>

        <View style={styles.container}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Forgot Password</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />

            {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.submitButton} onPress={handleSendOtp} disabled={isSubmitting}>
                <Text style={styles.submitButtonText}>{isSubmitting ? 'Sending...' : 'Send OTP'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  background: {
    justifyContent: 'center',
    marginTop: 40,
  },
  topBox: {
    position: 'absolute',
    top: 1,
    left: 0,
    right: 0,
    height: initialHeight * 0.07,
    backgroundColor: '#0C356A',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },
  logo: {
    width: initialWidth * 0.5,
    height: '100%',
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '5%',
    paddingVertical: '10%',
  },
  formContainer: {
    width: '90%',
    height: '40%',
    padding: '5%',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    elevation: 5,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  submitButton: {
    width: '48%',
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    width: '48%',
    height: 50,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ForgotPasswordScreen;
