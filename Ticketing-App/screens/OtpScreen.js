import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Image, ImageBackground, Dimensions } from 'react-native';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const OtpScreen = ({ route, navigation }) => {
  const { username } = route.params;
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleVerifyOtp = async () => {
    if (!otp) {
      setMessage('Please enter the OTP');
      return;
    }
    setIsSubmitting(true);

    try {
      const payload = { otp, username };
      const response = await axios.post('https://true-weevil-hardly.ngrok-free.app/user/verify-otp', payload);

      if (response.status === 200) {
        setMessage('OTP verified successfully!');
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
      } else {
        setMessage('Invalid OTP.');
        setIsSubmitting(false);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred while verifying OTP.');
      setIsSubmitting(false);
    }
  };

  return (
    <ImageBackground 
      source={require('../assets/login.png')}
      style={styles.background}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />

        <View style={styles.topBox}>
          <Image source={require('../assets/loge_new 2.png')} style={styles.logo} />
        </View>

        <View style={styles.container}>
          <Text style={styles.title}>OTP Verification</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            placeholderTextColor="#888"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
              <Text style={styles.goBackButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOtp} disabled={isSubmitting}>
              <Text style={styles.verifyButtonText}>{isSubmitting ? 'Verifying...' : 'Verify OTP'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    marginTop: 35,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBox: {
    position: 'absolute',
    top: 1,
    left: 0,
    right: 0,
    height: height * 0.07,
    backgroundColor: '#0C356A',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: width * 0.05,
  },
  logo: {
    width: width * 0.5,
    height: '100%',
    marginRight: 150,
    resizeMode: 'contain',
  },
  container: {
    padding: 20,
    width: '85%',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 5,
    paddingVertical: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  verifyButton: {
    width: '48%',
    height: 50,
    backgroundColor: '#2996f3',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  goBackButton: {
    width: '48%',
    height: 50,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  goBackButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    color: '#e63946',
    marginBottom: 15,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default OtpScreen;
