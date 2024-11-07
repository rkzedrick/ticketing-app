import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { height, width } = Dimensions.get('window');

const Sidebar = ({ navigation, closeDrawer }) => {
  return (
    <View style={styles.drawerContainer}>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          navigation.navigate('TicketList');
          closeDrawer();
        }}
      >
        <Icon name="list" size={24} color="blue" />
        <Text style={styles.drawerText}>Ticket List</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          navigation.navigate('CreateTicket');
          closeDrawer();
        }}
      >
        <Icon name="add-circle" size={24} color="blue" />
        <Text style={styles.drawerText}>Create Ticket</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          navigation.navigate('Profile');
          closeDrawer();
        }}
      >
        <Icon name="person" size={24} color="blue" />
        <Text style={styles.drawerText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
          closeDrawer();
        }}
      >
        <Icon name="log-out" size={24} color="blue" />
        <Text style={styles.drawerText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  drawerText: {
    marginLeft: 10,
    fontSize: 18,
    color: 'black',
  },
});

export default Sidebar;
