import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ImageBackground, SafeAreaView, StatusBar, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: initialWidth, height: initialHeight } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [screenWidth, setScreenWidth] = useState(initialWidth);
  const [screenHeight, setScreenHeight] = useState(initialHeight);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window: { width, height } }) => {
      setScreenWidth(width);
      setScreenHeight(height);
    });

    return () => subscription?.remove();
  }, []);

  const handleLogin = async () => {
    // Reset errors before validating
    setUsernameError('');
    setPasswordError('');
    setLoginError('');

    // Validation
    if (!username) {
      setUsernameError('Username is required');
      return;
    }
    if (!password) {
      setPasswordError('Password is required');
      return;
    }

    try {
      const response = await fetch('https://true-weevil-hardly.ngrok-free.app:8080/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      // Log the response status and headers for debugging
      const headers = response.headers;
     
      const data = await response.json();
     
      if (!response.ok) {
        setLoginError('Login failed. Please check your username and password.');
        return;
      }

      // Extract token from response (check headers and body)
      let token = response.headers.get('Authorization') || data.token;
      if (!token) {
        setLoginError('Token not found in response.');
        return;
      }

      // Remove 'Bearer ' prefix if it exists
      const rawToken = token.replace('Bearer ', '');

      await AsyncStorage.setItem('authToken', rawToken);
      await AsyncStorage.setItem('userName', username);

      const userId = data.userId || '';
      let userType = '';
      if (data.role === 'ROLE_MISSTAFF') userType = 'misStaff';
      else if (data.role === 'ROLE_STUDENT') userType = 'student';
      else if (data.role === 'ROLE_EMPLOYEE') userType = 'employee';

      if (userId) await AsyncStorage.setItem('userId', userId);
      if (userType) await AsyncStorage.setItem('userType', userType);

      navigation.navigate('MainHome', { token: rawToken, user: data });
    } catch (error) {
      console.log('Error occurred:', error);
      setLoginError('An error occurred. Please try again.');
    }
  };

  const handleUsernameChange = (text) => {
    setUsername(text);
    setUsernameError(''); // Clear username error on input change
    setLoginError(''); // Clear login error when username is changed
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setPasswordError(''); // Clear password error on input change
    setLoginError(''); // Clear login error when password is changed
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <ImageBackground
        source={require('../../../Ticketing-App/assets/login.png')}
        style={[styles.background, { width: screenWidth, height: screenHeight }]}
        resizeMode="cover"
      >
        <View style={styles.topBox}>
          <Image source={require('../../assets/loge_new 2.png')} style={styles.logo} />
        </View>

        <View style={styles.container}>
          <View style={styles.loginBox}>
            <Text style={styles.title}>Login</Text>

            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={handleUsernameChange} // Updated to handle change
              placeholderTextColor="#888"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={handlePasswordChange} // Updated to handle change
              placeholderTextColor="#888"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {loginError ? <Text style={styles.loginErrorText}>{loginError}</Text> : null}

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('RegisterNavigator')}>
              <Text style={styles.registerLink}>Don't have an account? Click here</Text>
            </TouchableOpacity>
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
  },
  logo: {
    width: initialWidth * 0.5,
    height: '100%',
    marginLeft: 10,
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '5%',
    paddingVertical: '10%',
  },
  loginBox: {
    width: '90%',
    padding: '5%',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
  },
  title: {
    fontSize: initialWidth > 400 ? 28 : 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  loginErrorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  forgotText: {
    color: '#007bff',
    fontSize: initialWidth > 400 ? 16 : 14,
    marginBottom: 20,
    marginLeft: 130,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerLink: {
    color: '#007bff',
    fontSize: 14,
  },
});

export default LoginScreen;
