import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MoviesPage } from './MoviesPage';
import { DetailPage } from './DetailPage';

const Stack = createNativeStackNavigator();

export const HomePage = () => {
    return (
        <>
            <Stack.Navigator>
                <Stack.Screen name="Movies" component={MoviesPage} options={{ headerShown: false }} />
                <Stack.Screen name="Details" component={DetailPage} options={{
                    headerStyle: {
                        backgroundColor: '#343434',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }} />
            </Stack.Navigator>
        </>
    )
}