// In App.js in a new project

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListTable from './src/screens/ListTable/ListTable';
import TableItem from './src/screens/TableItem/TableItem';

const Stack = createNativeStackNavigator();

function AppNavigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="ListTable">
                {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
                {/* Mỗi screen được định nghĩa ở đây mặc định sẽ có một props là navigation  */}
                <Stack.Screen
                    name="ListTable"
                    component={ListTable}
                    options={{
                        title: 'TRANG CHỦ',
                        headerStyle: {
                            backgroundColor: '#faa22f',
                        },
                        // headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }}
                />
                <Stack.Screen name="TableItem" component={TableItem} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigation;
