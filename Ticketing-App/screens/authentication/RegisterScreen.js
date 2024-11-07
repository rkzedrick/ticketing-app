import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Modal,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const { width: initialWidth, height: initialHeight } = Dimensions.get('window');

const RegisterStudent = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    middleName: '',
    lastName: '',
    contactNumber: '',
    address: '',
    studentNumber: '',
    employeeNumber: '',
    birthdate: '',
    userType: 'Student',
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [screenWidth, setScreenWidth] = useState(initialWidth);
  const [screenHeight, setScreenHeight] = useState(initialHeight);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window: { width, height } }) => {
      setScreenWidth(width);
      setScreenHeight(height);
    });

    return () => subscription?.remove();
  }, []);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (event, selectedDate) => {
    setDatePickerVisible(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setFormData({ ...formData, birthdate: formattedDate });
    }
  };

  const handleRegister = async () => {
    try {
      const {
        username,
        password,
        email,
        firstName,
        lastName,
        middleName,
        contactNumber,
        address,
        studentNumber,
        employeeNumber,
        birthdate,
        userType,
      } = formData;
  
      const today = new Date();
      const selectedDate = new Date(birthdate);
  
      // Validation checks
      if (!username || !password || !email || !firstName || !lastName || !(studentNumber || employeeNumber)) {
        setErrorMessage('All required fields must be filled.');
        return;
      }
  
      // Validate name fields (no numbers allowed)
      const namePattern = /^[A-Za-z\s]+$/;  // Only allows letters and spaces
      if (!namePattern.test(firstName)) {
        setErrorMessage('Invalid Firstname');
        return;
      }
      if (middleName && !namePattern.test(middleName)) {
        setErrorMessage('Invalid Middlename');
        return;
      }
      if (!namePattern.test(lastName)) {
        setErrorMessage('Invalid Lastname');
        return;
      }
  
      const usernamePattern = /^(?=.*[._@#&$%!*+=-])[a-zA-Z0-9._@#&$%!*+=-]+$/;
      if (!usernamePattern.test(username)) {
        setErrorMessage('Username must contain at least one special character');
        return;
      }
      const passwordPattern = /^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{5,}$/;
      if (!passwordPattern.test(password)) {
        setErrorMessage('Password must be at least 5 characters long and contain at least one special character.');
        return;
      }
      
      if (contactNumber.length > 11) {
        setErrorMessage('Contact number must be at most 11 digits.');
        return;
      }
  
      // Validate student number format
      if (userType === 'Student' && !/^CT\d{2}-\d{4}$/.test(studentNumber)) {
        setErrorMessage('Invalid Student Number.');
        return;
      }
  
      // Validate birthdate to not be today or in the future
      if (selectedDate >= today) {
        setErrorMessage('Invalid Birthday');
        return;
      }
  
      const payload = {
        username,
        password,
        [userType === 'Student' ? 'student' : 'employee']: {
          email,
          firstName,
          lastName,
          middleName,
          contactNumber,
          address,
          studentNumber: userType === 'Student' ? studentNumber : undefined,
          employeeNumber: userType === 'Employee' ? employeeNumber : undefined,
          birthdate,
        },
        userType,
      };
  
      const response = await axios.post('https://true-weevil-hardly.ngrok-free.app/user/register', payload);
  
      setErrorMessage('');
      setSuccessMessage('OTP has been sent to your email.');
      navigation.navigate('OtpScreen', { username });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Registration failed.');
    }
  };
  

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const selectUserType = (type) => {
    setFormData({
      ...formData,
      userType: type,
      studentNumber: '',
      employeeNumber: '',
    });
    toggleModal();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <ImageBackground
        source={require('../../assets/login.png')}
        style={[styles.background, { width: screenWidth, height: screenHeight }]}
        resizeMode="cover"
      >
        <View style={styles.topBox}>
          <Image source={require('../../assets/loge_new 2.png')} style={styles.logo} />
        </View>

        <View style={styles.container}>
          <View style={styles.registerBox}>
            <Text style={styles.title}>Register</Text>
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
            {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

            <View style={styles.userTypeContainer}>
              <TouchableOpacity style={styles.inputWithIcon} onPress={toggleModal}>
                <Text style={styles.inputText}>{formData.userType}</Text>
                <View style={styles.iconWrapper}>
                  <Text style={styles.iconText}>▼</Text>
                </View>
              </TouchableOpacity>
            </View>

            <Modal visible={isModalVisible} transparent={true} animationType="slide">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <ScrollView>
                    <TouchableOpacity onPress={() => selectUserType('Student')} style={styles.modalOption}>
                      <Text style={styles.modalOptionText}>Student</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => selectUserType('Employee')} style={styles.modalOption}>
                      <Text style={styles.modalOptionText}>Employee</Text>
                    </TouchableOpacity>
                  </ScrollView>
                  <TouchableOpacity onPress={toggleModal} style={styles.modalCloseButton}>
                    <Text style={styles.modalCloseText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <View style={styles.row}>
              <TextInput
                style={styles.inputColumn}
                placeholder="Username"
                value={formData.username}
                onChangeText={(value) => handleChange('username', value)}
              />
              <TextInput
                style={styles.inputColumn}
                placeholder="Password"
                secureTextEntry
                value={formData.password}
                onChangeText={(value) => handleChange('password', value)}
              />
            </View>

            <View style={styles.row}>
              <TextInput
                style={styles.inputColumn}
                placeholder="First Name"
                value={formData.firstName}
                onChangeText={(value) => handleChange('firstName', value)}
              />
              <TextInput
                style={styles.inputColumn}
                placeholder="Middle Name"
                value={formData.middleName}
                onChangeText={(value) => handleChange('middleName', value)}
              />
            </View>

            <View style={styles.row}>
              <TextInput
                style={styles.inputColumn}
                placeholder="Last Name"
                value={formData.lastName}
                onChangeText={(value) => handleChange('lastName', value)}
              />
              <TextInput
                style={styles.inputColumn}
                placeholder="Email"
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
              />
            </View>

            <View style={styles.row}>
              <TextInput
                style={styles.inputColumn}
                placeholder="Contact Number"
                value={formData.contactNumber}
                onChangeText={(value) => handleChange('contactNumber', value)}
              />
              {formData.userType === 'Student' ? (
                <TextInput
                  style={styles.inputColumn}
                  placeholder="Student Number"
                  value={formData.studentNumber}
                  onChangeText={(value) => handleChange('studentNumber', value)}
                />
              ) : (
                <TextInput
                  style={styles.inputColumn}
                  placeholder="Employee Number"
                  value={formData.employeeNumber}
                  onChangeText={(value) => handleChange('employeeNumber', value)}
                />
              )}
            </View>

            <View style={styles.row}>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setDatePickerVisible(true)}
              >
                <Text style={styles.dateText}>
                  {formData.birthdate || 'Birthdate'}
                </Text>
                <Icon name="calendar" size={19} style={styles.dateIcon} />
              </TouchableOpacity>
              <TextInput
                style={styles.inputColumn}
                placeholder="Address"
                value={formData.address}
                onChangeText={(value) => handleChange('address', value)}
              />
            </View>

            {isDatePickerVisible && (
              <DateTimePicker
                value={formData.birthdate ? new Date(formData.birthdate) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={handleDateChange}
              />
            )}

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Already have an account? Click here</Text>
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
    backgroundColor: '#F0F2F5',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    marginTop:33,
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
    alignItems: 'flex-end',
    paddingHorizontal: initialHeight * 0.05,
  },
  logo: {
    width: initialWidth * 0.5,
    height: '100%',
    marginRight: 130,
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
  registerBox: {
    width: '100%',
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#1D3557',
    marginBottom: 15,
  },
  inputColumn: {
    fontSize: 16,
    backgroundColor: '#F7F7F7',
    width: '47%',
    height: initialHeight * 0.065,
    borderColor: '#E5E5E5',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  registerButton: {
    width: '70%',
    height: initialHeight * 0.07,
    backgroundColor: '#007bff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    color: '#1D3557',
    marginTop: 15,
    fontSize: 15,
    textAlign: 'center',
  },
  errorText: {
    color: '#E63946',
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  successText: {
    color: '#2A9D8F',
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    width: '75%',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    width: '100%',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#1D3557',
  },
  modalCloseButton: {
    marginTop: 15,
  },
  modalCloseText: {
    color: '#457B9D',
    fontSize: 17,
    fontWeight: '600',
  },
  userTypeContainer: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '70%',
    height: initialHeight * 0.06,
    backgroundColor: '#F7F7F7',
    borderColor: '#E5E5E5',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  inputText: {
    fontSize: 16,
    color: '#1D3557',
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 18,
    color: '#1D3557',
  },
  dateInput: {
    flexDirection: 'row', // Aligns text and icon in a row
    alignItems: 'center', // Centers items vertically
    width: '47%',
    height: initialHeight * 0.065,
    backgroundColor: '#F7F7F7',
    borderColor: '#E5E5E5',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    justifyContent: 'space-between', // Keeps space between text and icon
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#777777',
  },
  dateIcon: {
    marginLeft: 10, // Adds space between text and icon
    color: '#1D3557',
  },
});

export default RegisterStudent;
