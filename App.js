// In App.js in a new project

import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ListTable from './src/screens/ListTable/ListTable';
import TableItem from './src/screens/TableItem/TableItem';
import TaoMon from './src/screens/TaoMon/TaoMon';
import ChonMon from './src/screens/ChonMon/ChonMon';

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
            title: 'Sơ đồ khu vực bàn',
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
        <Stack.Screen name="TaoMon" component={TaoMon} />
        <Stack.Screen name="ChonMon" component={ChonMon} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;
