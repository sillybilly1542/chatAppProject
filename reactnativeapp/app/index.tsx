import { Text, View, StyleSheet, Button, Alert} from "react-native";
import React, { useState, useEffect, useRef } from "react";



export default function Index() {
  const [count, setCount] = useState(0);
  const [cps, setCps] = useState(0)
  const [price, setPrice] = useState(10)

  const handlePurchase = () => {
    if(count >= price){
      setCps(c => c+1);
      setCount(c => c - price)
      setPrice(p => Math.floor(p * 1.7))
    } else {
      Alert.alert("Not enough money!", "You need more money to get this thing!")
    }
  }  
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + cps)
    }, 1000)

    return () => clearInterval(interval)
  }, [cps])

  return (
    <View>
      <Text>Money: {count}</Text>
      <Text>CPS: {cps}</Text>
      <Button onPress={() => setCount(count + 1)} title="click me" />
      <Button onPress={handlePurchase} title={`Buy a dps thing (price: ${price})`}/>

    </View>
  );
}
