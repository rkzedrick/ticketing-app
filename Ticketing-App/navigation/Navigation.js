import React from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import OtpScreen from '../screens/OtpScreen';
import LoginScreen from '../screens/authentication/LoginScreen';
import RegisterScreen from '../screens/authentication/RegisterScreen';
import RegisterDetailsScreen from '../screens/RegisterDetailsScreen';
import CreateTicketScreen from '../screens/CreateTicketScreen';
import TicketListScreen from '../screens/TicketListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import VerifyForgotPasswordScreen from '../screens/VerifyForgotPasswordScreen';

const { height, width } = Dimensions.get('window');
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const RegisterStack = createNativeStackNavigator();

const RegisterNavigator = () => (
  <RegisterStack.Navigator initialRouteName="RegisterScreen">
    <RegisterStack.Screen 
      name="RegisterScreen" 
      component={RegisterScreen} 
      options={{ headerShown: false }} 
    />
    <RegisterStack.Screen 
      name="RegisterDetails" 
      component={RegisterDetailsScreen} 
      options={{ headerShown: false }} 
    />
  </RegisterStack.Navigator>
);

const LogoutButton = (props) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      {...props}
      onPress={() => {

        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }}
    >
      <Icon name="log-out" size={width * 0.07} color="gray" />
      <Text style={{ fontSize: height * 0.016, color: 'gray' }}>Logout</Text>
    </TouchableOpacity>
  );
};

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, focused }) => {
        let iconName;
        if (route.name === 'Home') { 
          iconName = 'home';
        } else if (route.name === 'TicketList') {
          iconName = 'list';
        } else if (route.name === 'CreateTicket') {
          iconName = 'add-circle';
        } else if (route.name === 'Profile') {
          iconName = 'person';
        } else if (route.name === 'Logout') {
          iconName = 'log-out';
        }
        return <Icon name={iconName} size={width * 0.06} color={focused ? 'black' : 'gray'} />;
      },
      tabBarActiveTintColor: 'black',
      tabBarInactiveTintColor: 'gray',
      tabBarLabelStyle: { fontSize: height * 0.017 },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Tab.Screen name="TicketList" component={TicketListScreen} options={{ headerShown: false }} />
    <Tab.Screen name="CreateTicket" component={CreateTicketScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    <Tab.Screen
      name="Logout"
      component={LoginScreen} // Placeholder, navigation will override
      options={{
        headerShown: false,
        tabBarButton: (props) => <LogoutButton {...props} />,
      }}
    />
  </Tab.Navigator>
);


const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="MainHome" // Changed to match your `TabNavigator` screen name
          component={TabNavigator} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="RegisterNavigator" 
          component={RegisterNavigator} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="OtpScreen" 
          component={OtpScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ForgotPassword"
          component={ForgotPasswordScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="VerifyForgotPassword"
          component={VerifyForgotPasswordScreen} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default Navigation;
