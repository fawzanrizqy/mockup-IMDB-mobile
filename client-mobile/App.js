
import { HomePage } from './screens/HomePage';
import { VideoPage } from './screens/VideoPage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ApolloProvider } from "@apollo/client";
import client from "./config";
import { SearchPage } from './screens/SearchPage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <ApolloProvider client={client}>
      <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer>
      
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused
              ? 'home'
              : 'home-outline';
          } else if (route.name === 'Video') {
            iconName = focused ? 'play-circle' : 'play-circle';
          }
          else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search';
          }
        

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#e7c412',
        tabBarInactiveTintColor: 'gray',
        tabBarActiveBackgroundColor: '#2B2523',
        tabBarInactiveBackgroundColor: '#2B2523',
          tabBarStyle: {
            borderTopWidth: 0,
            backgroundColor: '#2B2523',
            
        }
      })}>
        <Tab.Screen name="Home" component={HomePage} options={ {headerShown:false}} />
        <Tab.Screen name="Search" component={SearchPage} options={ {headerShown:false}}/>
        <Tab.Screen name="Video" component={VideoPage} options={ {headerShown:false}}/>
      </Tab.Navigator>
      </NavigationContainer>
      </GestureHandlerRootView>
      </ApolloProvider>
  );
}

// const styles = StyleSheet.create({
  
// });
