import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { height, width } = Dimensions.get('window');

const EditProfileModal = ({ visible, onClose, profileData, onSave }) => {
  const [profile, setProfile] = useState(profileData);

  useEffect(() => {
    setProfile(profileData); // Reset profile data when modal opens
  }, [profileData]);

  const hasProfileChanged = () => {
    // Compare current profile with the original profileData to check if there's any change
    return Object.keys(profile).some((key) => profile[key] !== profileData[key]);
  };

  const handleSave = () => {
    if (!hasProfileChanged()) {
      Alert.alert('No changes', 'No changes were made to the profile.');
      return;
    }
    onSave(profile);  // Proceed with saving the profile if there's a change
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Profile</Text>

          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={profile.firstName}
            onChangeText={(text) => setProfile({ ...profile, firstName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Middle Name"
            value={profile.middleName}
            onChangeText={(text) => setProfile({ ...profile, middleName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={profile.lastName}
            onChangeText={(text) => setProfile({ ...profile, lastName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={profile.email}
            onChangeText={(text) => setProfile({ ...profile, email: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Contact Number"
            value={profile.contactNumber}
            onChangeText={(text) => setProfile({ ...profile, contactNumber: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={profile.address}
            onChangeText={(text) => setProfile({ ...profile, address: text })}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const ProfileScreen = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userType, setUserType] = useState(null);

  const fetchProfileData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userId = await AsyncStorage.getItem('userId');
      const storedUserType = await AsyncStorage.getItem('userType');
      setUserType(storedUserType);

      const endpoint =
        storedUserType === 'employee'
          ? `https://true-weevil-hardly.ngrok-free.app/EmployeeService/employee/${userId}`
          : `https://true-weevil-hardly.ngrok-free.app/StudentService/student/${userId}`;

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
    } catch (error) {
      setError('Error loading profile.');
    } finally {
      setLoading(false);
    }
  };

  const saveProfileData = async (updatedProfile) => {
    setProfile(updatedProfile);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userId = await AsyncStorage.getItem('userId');
      const endpoint =
        userType === 'employee'
          ? `https://true-weevil-hardly.ngrok-free.app/EmployeeService/employee/update/${userId}`
          : `https://true-weevil-hardly.ngrok-free.app/student/update/${userId}`;

      await axios.put(endpoint, updatedProfile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile: ' + error.message);
    }
  };

  const formatBirthdate = (birthdate) => {
    if (!birthdate) return 'N/A';
    const date = new Date(birthdate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      
      <View style={styles.topBox}>
        <Image source={require('../assets/loge_new 2.png')} style={styles.logo} />
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.profileContainer}>
          <View style={styles.profileRow}>
            <Text style={styles.label}>First Name</Text>
            <Text style={styles.value}>{profile.firstName || 'N/A'}</Text>
          </View>
          <View style={styles.profileRow}>
            <Text style={styles.label}>Middle Name</Text>
            <Text style={styles.value}>{profile.middleName || 'N/A'}</Text>
          </View>
          <View style={styles.profileRow}>
            <Text style={styles.label}>Last Name</Text>
            <Text style={styles.value}>{profile.lastName || 'N/A'}</Text>
          </View>
          <View style={styles.profileRow}>
            <Text style={styles.label}>{userType === 'student' ? 'Student Number' : 'Employee Number'}</Text>
            <Text style={styles.value}>{userType === 'student' ? profile.studentNumber : profile.employeeNumber || 'N/A'}</Text>
          </View>
          <View style={styles.profileRow}>
            <Text style={styles.label}>Reporter</Text>
            <Text style={styles.value}>{userType}</Text>
          </View>
          <View style={styles.profileRow}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{profile.email || 'N/A'}</Text>
          </View>
          <View style={styles.profileRow}>
            <Text style={styles.label}>Contact Number</Text>
            <Text style={styles.value}>{profile.contactNumber || 'N/A'}</Text>
          </View>
          <View style={styles.profileRow}>
            <Text style={styles.label}>Birthdate</Text>
            <Text style={styles.value}>{formatBirthdate(profile.birthdate)}</Text>
          </View>
          <View style={styles.profileRow}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>{profile.address || 'N/A'}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.editProfileButton}>
          <Text style={styles.editProfileButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        <EditProfileModal
          visible={modalVisible}
          profileData={profile}
          onClose={() => setModalVisible(false)}
          onSave={saveProfileData}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f7f8fa' },
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
  scrollContent: { paddingBottom: 40, alignItems: 'center' },
  title: { marginTop: 120, fontSize: 28, fontWeight: '700', color: '#333', marginVertical: 10 },
  profileContainer: {
    width: '90%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
  },
  label: { fontSize: 15, fontWeight: '600', color: '#444' },
  value: { fontSize: 15, color: '#666' },
  editProfileButton: {
    backgroundColor: '#007BFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginVertical: 20,
  },
  editProfileButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: { 
    width: '85%', 
    padding: 25,
    backgroundColor: '#fff', 
    borderRadius: 10 
  },
  modalTitle: { fontSize: 23, fontWeight: '700', marginBottom: 15, textAlign: 'center' },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    padding: 2,
    borderRadius: 8, 
    marginVertical: 10,
    fontSize: 16 
  },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  saveButton: { backgroundColor: '#007BFF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  saveButtonText: { color: '#fff' },
  cancelButton: { backgroundColor: '#ccc', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  cancelButtonText: { color: '#333' },
});

export default ProfileScreen;
