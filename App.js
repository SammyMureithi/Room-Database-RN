import React, {useEffect, useState} from 'react';
import {Alert, Button, Text, View} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';
var db = openDatabase({name: 'UserDatabase.db'});

function App() {
  let [flatListItems, setFlatListItems] = useState([]);
  useEffect(() => {
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name from sqlite_master WHERE type='table' AND name='table_user'",
        [],
        (tx, res) => {
          if (res.rows.length === 0) {
            console.log('Table not Found');
            txn.executeSql('DROP TABLE IF EXISTS table_user', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_user(user_id INTEGER PRIMARY KEY AUTOINCREMENT, user_name VARCHAR(20), user_contact INT(10), user_address VARCHAR(255))',
              [],
            );
            console.log('Creating Table ....');
          } else {
            console.log('Table Already Exist');
          }
        },
      );
    });
  }, []);
  function addRecord() {
    db.transaction(function (txn) {
      txn.executeSql(
        'INSERT INTO table_user (user_name, user_contact, user_address) VALUES (?,?,?)',
        ['userName', '123', 'userAddress'],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert('Success', 'Registed Successfully');
          } else {
            Alert.alert('Registration Failed');
          }
        },
      );
    });
  }
  function ViewRecord() {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM table_user', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i)
          temp.push(results.rows.item(i));
        setFlatListItems(temp);
      });
    });
  }
  console.log(flatListItems);
  function updateRecord() {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE table_user set user_name=?, user_contact=? , user_address=? where user_id=?',
        ['Sammy', 1098, "Moi's Bridge", 2],

        (tx, result) => {
          if (result.rowsAffected > 0) {
            Alert.alert('Success', 'Update made Successfully');
          } else {
            Alert.alert('Unsuccessfully', 'No update Done');
          }
        },
      );
    });
  }
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Room Database</Text>
      <Button onPress={addRecord} title="ADd To Database" />
      <Button onPress={ViewRecord} title="View Record" />
      <Button onPress={updateRecord} title="Update Record" />
    </View>
  );
}

export default App;
