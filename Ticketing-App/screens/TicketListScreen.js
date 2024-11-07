import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height, width } = Dimensions.get('window');

const TicketListScreen = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('authToken');

      if (!userId || !token) {
        setError('User information or token not found. Please log in again.');
        setLoading(false);
        return;
      }

      const url = `https://true-weevil-hardly.ngrok-free.app/TicketService/tickets/user/${encodeURIComponent(userId)}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setTickets(response.data);
      } else if (response.status === 204) {
        setError('No tickets found.');
      } else {
        setError('Failed to fetch tickets. Please check your network connection.');
      }
    } catch (error) {
      setError('Failed to fetch tickets. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <Text style={styles.ticketIssue}>{item.issue || 'No Issue'}</Text>
        <View style={[styles.ticketStatusContainer, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.ticketStatus}>{item.status || 'No Status'}</Text>
        </View>
      </View>
      <Text style={styles.ticketInfo}>
        Created: {item.dateCreated ? new Date(item.dateCreated).toLocaleDateString() : 'No Date'}
      </Text>
      <Text style={styles.ticketInfo}>
        Finished: {item.dateFinished ? new Date(item.dateFinished).toLocaleDateString() : 'N/A'}
      </Text>
      <Text style={styles.ticketInfo}>
        MIS Staff: {item.misStaff && (item.misStaff.firstName || item.misStaff.lastName)
          ? `${item.misStaff.firstName} ${item.misStaff.lastName}`
          : 'Unassigned'}
      </Text>
    </View>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'To Do':
        return '#F0AD4E'; // Yellow for 'To Do'
      case 'In Progress':
        return '#5BC0DE'; // Blue for 'In Progress'
      case 'Done':
        return '#5CB85C'; // Green for 'Done
        case 'Closed':
          return '#f80707';
      default:
        return '#DDD'; 
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <View style={styles.background}>
        <View style={styles.topBox}>
          <Image source={require('../assets/loge_new 2.png')} style={styles.logo} />
        </View>

        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Ticket List</Text>
            <TouchableOpacity onPress={fetchTickets} style={styles.refreshIcon}>
              <Icon name="refresh" size={width * 0.07} color="#333" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : tickets.length === 0 ? (
            <Text style={styles.noTicketsText}>No tickets available</Text>
          ) : (
            <FlatList
              data={tickets}
              keyExtractor={(item) => item.ticketId.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.tableBody}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  background: { flex: 1, backgroundColor: '#f4f7fa', alignItems: 'center' },
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
  logo: { width: width * 0.5, height: '100%', marginRight: 150, resizeMode: 'contain' },
  container: { marginTop: height * 0.13, paddingHorizontal: width * 0.03, width: '100%', flex: 1 },
  titleContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: height * 0.03 },
  title: { fontSize: 24, textAlign: 'center', color: '#333', fontWeight: '700' },
  refreshIcon: { paddingHorizontal: 6, paddingVertical: 1, marginBottom: 10 },
  ticketCard: {
    backgroundColor: '#fff',
    marginBottom: height * 0.02,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  ticketIssue: { fontWeight: 'bold', fontSize: 16, flex: 1 },
  ticketStatusContainer: {
    padding: 10,
    borderRadius: 8,
    width: 80,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketStatus: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 13,
  },
  ticketInfo: { color: '#555', fontSize: 13, marginVertical: 2 },
});

export default TicketListScreen;
