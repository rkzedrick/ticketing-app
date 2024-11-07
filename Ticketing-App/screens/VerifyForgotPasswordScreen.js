import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const VerifyForgotPassword = ({ route, navigation }) => {
  const { username } = route.params;
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateOtp = (otp) => {
    if (!otp) {
      setOtpError('OTP is required');
      return false;
    }
    setOtpError('');
    return true;
  };

  const validatePassword = (password) => {
    if (!/^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password)) {
      setPasswordError('Password must be at least 8 characters with one special character');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleVerifyOtp = async () => {
    const isOtpValid = validateOtp(otp);
    const isPasswordValid = validatePassword(newPassword);

    if (!isOtpValid || !isPasswordValid) {
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { username, otp, password: newPassword };
      const response = await axios.post('http://192.168.1.39:8080/user/verify-forgot-password', payload);

      if (response.status === 200) {
        navigation.navigate('Login', { successMessage: 'Password reset successful. You can now log in.' });
      } else {
        setOtpError('Invalid OTP');
      }
    } catch (error) {
      setOtpError('Invalid OTP');
    } finally {
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
          <Text style={styles.title}>Verify OTP</Text>

          <TextInput
  style={[styles.input, styles.disabledInput]}
  placeholder="Username"
  value={username}
  editable={false}
/>


          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            value={otp}
            onChangeText={(value) => {
              setOtp(value);
              if (otpError) validateOtp(value);
            }}
          />
          {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}

          <TextInput
            style={styles.input}
            placeholder="Enter New Password"
            value={newPassword}
            onChangeText={(value) => {
              setNewPassword(value);
              if (passwordError) validatePassword(value);
            }}
            secureTextEntry
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

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
    width: '90%',
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  verifyButton: {
    width: '48%',
    height: 50,
    backgroundColor: '#2996f3',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
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
  disabledInput: {
    backgroundColor: '#f0f0f0',  // Lighter background to indicate disabled state
    color: '#888',               // Greyed-out text color
    borderColor: '#ddd',         // Light border color
  },
});

export default VerifyForgotPassword;
