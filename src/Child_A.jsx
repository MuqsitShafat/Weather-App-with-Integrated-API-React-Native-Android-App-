import {View, Text, Button} from 'react-native';
import React, {useCallback, useState} from 'react';
import Child_B from './Child_B';

const Child_A = () => {
  const [count, setcount] = useState(0);
  const [item, setitem] = useState(2);
  const newdata = useCallback(()=>{
    setitem(prev => prev +1)
  },[])
  return (
    <View>
      <Button title="Counter" onPress={() => setcount(count + 1)} />
      <Text>Count : {count}</Text>
      <Button title='item' onPress={newdata}/>
      <Child_B item={item} data = {newdata}/>
    </View>
  );
}

export default Child_A;
