import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, StatusBar, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const CreateTicketScreen = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const [dateCreated] = useState(new Date().toISOString().split('T')[0]);
  const [status] = useState('To Do');
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);
  const [reporter, setReporter] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const retrieveTokenAndUserId = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedUserType = await AsyncStorage.getItem('userType');

        if (storedToken && storedUserId && storedUserType) {
          setToken(storedToken);
          setUserId(storedUserId);
          setUserType(storedUserType);
          setReporter(storedUserType === 'student' ? 'Student' : storedUserType === 'employee' ? 'Employee' : 'Unknown');
        }
      } catch (error) {
        // Handle error if necessary
      }
    };

    retrieveTokenAndUserId();
  }, []);

  const handleCreateTicket = async () => {
    setSubmitted(true);

    if (!description.trim()) {
      return;
    }

    const ticketData = {
      issue: description,
      dateCreated,
      status,
      student: userType === 'student' ? { studentNumber: userId } : null,
      employee: userType === 'employee' ? { employeeNumber: userId } : null,
    };

    try {
      const response = await fetch('https://true-weevil-hardly.ngrok-free.app/TicketService/ticket/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ticketData),
      });

      if (response.ok) {
        setDescription('');
        setSubmitted(false);
        setDisabled(true);
        setTimeout(() => setDisabled(false), 5000);
      }
    } catch (error) {
      // Handle error if necessary
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.background}>
            <View style={styles.topBox}>
              <Image source={require('../assets/loge_new 2.png')} style={styles.logo} />
            </View>

            <View style={styles.container}>
              <Text style={styles.title}>Create a Ticket</Text>

              <View style={styles.innerContainer}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.descriptionInput, submitted && !description.trim() && styles.invalidInput]}
                  placeholder="Describe the issue (e.g., no network in CL3)"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                />
                {submitted && !description.trim() && (
                  <Text style={styles.errorText}>Description must contain an issue.</Text>
                )}

                <Text style={styles.label}>Date Created</Text>
                <TextInput style={styles.input} value={dateCreated} editable={false} />

                <Text style={styles.label}>Status</Text>
                <TextInput style={styles.input} value={status} editable={false} />

                <Text style={styles.label}>Reporter</Text>
                <TextInput style={styles.input} value={reporter} editable={false} />

                <TouchableOpacity
                  style={[styles.submitButton, disabled && styles.disabledButton]}
                  onPress={handleCreateTicket}
                  disabled={disabled}
                >
                  <Icon name="send" size={width * 0.06} color="#fff" />
                  <Text style={styles.submitText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f7f8fa' },
  background: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Light background color
    alignItems: 'center',
  },
  topBox: {
    position: 'absolute',
    top: 37,
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
    marginTop: height * 0.15,
    paddingHorizontal: width * 0.04,
    width: '95%',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    color: '#0C356A',
    fontWeight: '800',
    marginBottom: height * 0.03,
    marginTop: height * 0.01,
  },
  innerContainer: {
    width: '100%',
    paddingHorizontal: '5%',
    paddingVertical: height * 0.02,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  label: {
    fontSize: width * 0.05,
    fontWeight: '600',
    color: '#444',
    marginBottom: height * 0.008,
  },
  input: {
    width: '100%',
    height: height * 0.05,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: height * 0.02,
  },
  descriptionInput: {
    height: height * 0.15,
    textAlignVertical: 'top',
  },
  invalidInput: {
    borderColor: '#e63946',
  },
  errorText: {
    color: '#e63946',
    fontSize: width * 0.035,
    marginBottom: height * 0.02,
  },
  submitButton: {
    backgroundColor: '#007BFF',
    paddingVertical: height * 0.015,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: height * 0.01,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  submitText: {
    color: '#FFF',
    fontSize: width * 0.045,
    fontWeight: '600',
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  },
});

export default CreateTicketScreen;
