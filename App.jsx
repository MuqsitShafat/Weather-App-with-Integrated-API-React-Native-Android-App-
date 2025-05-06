import {Text, StyleSheet, StatusBar} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Child_C from './src/Child_C';

const App = () => {
  return (
    <>
      <StatusBar hidden={true} />
      <LinearGradient
        colors={[
          'rgba(33, 50, 74, 1)',
          'rgba(25, 74, 45, 1)',
          'rgba(140, 127, 7, 1)',
        ]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.container}>
        <Child_C />
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;

// import { View, Text } from 'react-native'
// import React from 'react'
// import Child_D from './src/Child_D'

// const App = () => {
//   return (
//     <View style={{flex :1}}>
//       <Child_D />
//     </View>
//   )
// }

// export default App
