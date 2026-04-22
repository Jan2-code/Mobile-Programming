import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

export default function App() {
  const colors = ['red', 'blue', 'green', 'orange', 'purple'];
  const [index, setIndex] = useState(0);

  const changeColor = () => {
    const nextIndex = (index + 1) % colors.length;
    setIndex(nextIndex);
  };

  return (
    <View style={styles.container}>
      
      {/* Card */}
      <View style={[styles.card, { backgroundColor: colors[index] }]}>
        
        {/* Color Name */}
        <Text style={styles.text}>
          {colors[index].toUpperCase()}
        </Text>

        {/* Button */}
        <TouchableOpacity style={styles.button} onPress={changeColor}>
          <Text style={styles.buttonText}>Change Color</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2'
  },
  card: {
    width: '80%',
    height: 200,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',

    // Shadow for iOS
    shadowColor: 'blue',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,

    // Shadow for Android
    elevation: 8
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20
  },
  button: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5
  },
  buttonText: {
    color: '#fff'
  }
});