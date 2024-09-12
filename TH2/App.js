import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView, Vibration } from 'react-native';
import { Entypo } from '@expo/vector-icons';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentNumber, setCurrentNumber] = useState('');
  const [lastNumber, setLastNumber] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [isSolvingEquation, setIsSolvingEquation] = useState(false);

  const buttons = [
    ['C', 'DEL', 'MODE', '/'],
    [7, 8, 9, '*'],
    [4, 5, 6, '-'],
    [1, 2, 3, '+'],
    ['+/-', 0, '.', '=']
  ];
  function solveLinearEquation() {
    if (a === '' || b === '') {
      setCurrentNumber('Enter both a and b');
      return;
    }
  function solveLinearEquation() {
    if (a === '' || b === '') {
      setCurrentNumber('Enter both a and b');
      return;
    }
    
    const aValue = parseFloat(a);
    const bValue = parseFloat(b);
  
    if (aValue === 0) {
      setCurrentNumber('No solution');
    } else {
      const x = (-bValue / aValue).toString();
      setCurrentNumber(`x = ${x}`);
    }
    
    setModalVisible(false);
    setA('');
    setB('');
  }
  function factorial(n) {
    if (n < 0) return 'Error'; // Giai thừa không xác định cho số âm
    if (n === 0 || n === 1) return 1; // 0! và 1! bằng 1
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }
  function calculator() {
    if (currentNumber === '') {
      setCurrentNumber('0');
      return;
    }
    if (currentNumber.includes('!')) {
      const numberBeforeFactorial = currentNumber.split('!')[0];
      const factorialResult = factorial(parseInt(numberBeforeFactorial));
      setCurrentNumber(factorialResult.toString());
      return;
    }
    if (['/', '*', '-', '+', '.'].includes(currentNumber[currentNumber.length - 1])) {
      setCurrentNumber(currentNumber + '0');
    }
    if (currentNumber.includes('^')) {
      const numbers = currentNumber.split('^'); // Tách chuỗi "x^y" thành mảng
      const base = parseFloat(numbers[0]); // Cơ số x
      const exponent = parseFloat(numbers[1]); // Số mũ y
  
      if (isNaN(base) || isNaN(exponent)) {
        setCurrentNumber('Error');
      } else {
        const result = Math.pow(base, exponent).toString(); // Tính x^y
        setCurrentNumber(result);
      }
      return;
    }
  

    let sanitizedExpression = currentNumber.replace(/--/g, '+');

    try {
      let result = eval(sanitizedExpression).toString();
      setCurrentNumber(result);
    } catch (error) {
      console.error('Invalid expression:', error);
      setCurrentNumber('Error');
    }
  }

  function handleInput(buttonPressed) {
    Vibration.vibrate(35);
    
    if (buttonPressed === '+/-') {
      if (currentNumber !== '') {
        const operatorRegex = /[+\-*/]/;
        if (operatorRegex.test(currentNumber)) {
          setLastNumber("(" + currentNumber + ")" + "*-1" + '=');
          let result = eval("(" + currentNumber + ")" + "*-1").toString();
          setCurrentNumber(result);
        } else {
          setCurrentNumber((currentNumber * -1).toString());
        }
      }
      return;
    }

    if (lastNumber && (!isNaN(buttonPressed) || buttonPressed === '.')) {
      setCurrentNumber(buttonPressed);  
      setLastNumber('');  
      return;
    }

    if (lastNumber && ['+', '-', '*', '/', '.'].includes(buttonPressed)) {
      setCurrentNumber(currentNumber + buttonPressed);
      setLastNumber('');  // Clear the lastNumber after appending operator
      return;
    }

    if (['+', '-', '*', '/'].includes(buttonPressed)) {
      setCurrentNumber(currentNumber + buttonPressed);
      return;
    } else if (!isNaN(buttonPressed) || buttonPressed === '.') {
      setCurrentNumber(currentNumber + buttonPressed);
    }

    switch (buttonPressed) {
      case 'DEL':
        setCurrentNumber(currentNumber.slice(0, -1));
        return;
      case 'C':
        setLastNumber('');
        setCurrentNumber('');
        return;
      case '=':
        if (['/', '*', '-', '+', '.'].includes(currentNumber[currentNumber.length - 1])) {
          setLastNumber(currentNumber + '0' + '=');
        } else {
          setLastNumber(currentNumber + '=');
        }
        calculator();
        return;
    }
  }

  // Function to handle advanced calculations
  function handleAdvancedFunction(func) {
    let result;
    let number = parseFloat(currentNumber);

    switch (func) {
      case 'sqrt':
        result = Math.sqrt(number).toString();
        break;
      case 'cbrt':
        result = Math.cbrt(number).toString();
        break;
      case 'abs':
        result = Math.abs(number).toString();
        break;
      case 'square':
        result = Math.pow(number, 2).toString();
        break;
      case 'cube':
        result = Math.pow(number, 3).toString();
        break;
      case 'log':
        result = Math.log10(number).toString();
        break;
      case 'ln':
        result = Math.log(number).toString();
        break;
      case 'percent':
        result = (number / 100).toString();
        break;
      case 'x^y':
        setCurrentNumber(currentNumber + '^');
        setModalVisible(false);
        return;
      case '!':
        setCurrentNumber(currentNumber + '!');
        setModalVisible(false);
        return;
      default:
        result = number.toString();
    }

    setCurrentNumber(result);
    setLastNumber(func + '(' + number + ')=');
    setModalVisible(false);
  }

  const dynamicStyles = StyleSheet.create({
    zeroButton: {
      backgroundColor: darkMode ? '#303946' : '#fff',
      flex: 1, 
      height: 80,
      margin: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    result: {
      backgroundColor: darkMode ? '#282f3b' : '#f5f5f5',
      width: '100%',
      height: '75%',
      flex: 2,  
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      paddingTop: 20,
      paddingRight: 20,
    },
    historyText: {
      color: darkMode ? '#B5B7BB' : '#7c7c7c',
      fontSize: 20,
      marginRight: 10,
      alignSelf: 'flex-end',
    },
    themeButton: {
      position: 'absolute',
      top: 30,
      right: 20,
      backgroundColor: darkMode ? '#7b8084' : '#e5e5e5',
      alignItems: 'center',
      justifyContent: 'center',
      width: 50,
      height: 50,
      borderRadius: 25,
      zIndex: 1,
    },
    button: {
      borderColor: darkMode ? '#3f4d5b' : '#e5e5e5',
      alignItems: 'center',
      justifyContent: 'center',
      height: 80,
      flex: 1,
      margin: 5,
    },
    operatorButton: {
      backgroundColor: '#00b9d6',
      flex: 1,
      height: 80,
      margin: 5,
    },
    numberButton: {
      backgroundColor: darkMode ? '#303946' : '#fff',
      flex: 1,
      height: 80,
      margin: 5,
    },
    
    textButton: {
      color: darkMode ? '#b5b7bb' : '#7c7c7c',
      fontSize: 28,
    },
    textOperatorButton: {
      color: 'white',
      fontSize: 28,
    },
    modalBackground: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
      width: '80%',
      backgroundColor: darkMode ? '#3f4d5b' : '#fff',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    modalButton: {
      width: '100%',
      padding: 15,
      marginVertical: 5,
      alignItems: 'center',
      backgroundColor: darkMode ? '#4a5b6a' : '#e5e5e5',
      borderRadius: 10,
    },
    modalButtonText: {
      fontSize: 20,
      color: darkMode ? '#fff' : '#000',
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={dynamicStyles.themeButton}>
        <Entypo
          name={darkMode ? 'light-up' : 'moon'}
          size={24}
          color={darkMode ? 'white' : 'black'}
          onPress={() => setDarkMode(!darkMode)}
        />
      </TouchableOpacity>

      <View style={dynamicStyles.result}>
        <Text style={dynamicStyles.historyText}>{lastNumber}</Text>
        <Text style={dynamicStyles.historyText}>{currentNumber}</Text>
      </View>
      
      <View style={styles.buttonsContainer}>
        {buttons.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.buttonsRow}>
            {row.map((button) => (
              <TouchableOpacity
                key={button}
                style={[
                  dynamicStyles.button,
                  button === 0
                    ? dynamicStyles.zeroButton 
                    : ['/', '*', '-', '+', '='].includes(button)
                    ? dynamicStyles.operatorButton
                    : dynamicStyles.numberButton
                ]}
                onPress={() => button === 'MODE' ? setModalVisible(true) : handleInput(button)}
              >
                <Text style={[
                  ['/', '*', '-', '+', '='].includes(button)
                    ? dynamicStyles.textOperatorButton
                    : dynamicStyles.textButton
                ]}>
                  {button}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

     
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={dynamicStyles.modalBackground}>
          <View style={dynamicStyles.modalContainer}>
            <ScrollView>
              <TouchableOpacity style={dynamicStyles.modalButton} onPress={() => handleAdvancedFunction('sqrt')}>
                <Text style={dynamicStyles.modalButtonText}>√ (Square Root)</Text>
              </TouchableOpacity>
              <TouchableOpacity style={dynamicStyles.modalButton} onPress={() => handleAdvancedFunction('cbrt')}>
                <Text style={dynamicStyles.modalButtonText}>∛ (Cube Root)</Text>
              </TouchableOpacity>
              <TouchableOpacity style={dynamicStyles.modalButton} onPress={() => handleAdvancedFunction('abs')}>
                <Text style={dynamicStyles.modalButtonText}>|x| (Absolute Value)</Text>
              </TouchableOpacity>
              <TouchableOpacity style={dynamicStyles.modalButton} onPress={() => handleAdvancedFunction('square')}>
                <Text style={dynamicStyles.modalButtonText}>x² (Square)</Text>
              </TouchableOpacity>
              <TouchableOpacity style={dynamicStyles.modalButton} onPress={() => handleAdvancedFunction('cube')}>
                <Text style={dynamicStyles.modalButtonText}>x³ (Cube)</Text>
              </TouchableOpacity>
              <TouchableOpacity style={dynamicStyles.modalButton} onPress={() => handleAdvancedFunction('log')}>
                <Text style={dynamicStyles.modalButtonText}>log (Logarithm)</Text>
              </TouchableOpacity>
              <TouchableOpacity style={dynamicStyles.modalButton} onPress={() => handleAdvancedFunction('ln')}>
                <Text style={dynamicStyles.modalButtonText}>ln (Natural Logarithm)</Text>
              </TouchableOpacity>
              <TouchableOpacity style={dynamicStyles.modalButton} onPress={() => handleAdvancedFunction('x^y')}>
                <Text style={dynamicStyles.modalButtonText}>xʸ (Power)</Text>
              </TouchableOpacity>
              <TouchableOpacity style={dynamicStyles.modalButton} onPress={() => handleAdvancedFunction('x^y')}>
                <Text style={dynamicStyles.modalButtonText}>! (Power)</Text>
              </TouchableOpacity>
              <TouchableOpacity style={dynamicStyles.modalButton} onPress={() => handleAdvancedFunction('percent')}>
                <Text style={dynamicStyles.modalButtonText}>% (Percentage)</Text>
              </TouchableOpacity>
            </ScrollView>
            <TouchableOpacity style={dynamicStyles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={dynamicStyles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  buttonsContainer: {
    width: '100%',
    flex: 3, 
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
})}
