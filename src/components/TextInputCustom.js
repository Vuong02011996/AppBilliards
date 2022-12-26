import { TextInput, StyleSheet } from 'react-native';
import * as React from 'react';

const TextInputCustom = ({ props }) => {
    return (
        <TextInput
            style={{
                borderWidth: 1,
                height: 50,
                fontSize: 18,
                backgroundColor: 'yellow',
                color: 'black',
                minWidth: props.minWidth,
            }}
            keyboardType={props.keyboardType}
            placeholder="Nhập..."
            defaultValue={props.inputData}
            autoFocus={true}
            onChangeText={(newInputData) => {
                props.setInputData(newInputData);
            }}
        />
    );
};

const styles = StyleSheet.create({});

export default TextInputCustom;
