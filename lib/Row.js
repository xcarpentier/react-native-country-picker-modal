import * as React from 'react';
import { StyleSheet, View } from 'react-native';
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});
export const Row = (props) => (React.createElement(View, Object.assign({}, props, { style: [
        styles.row,
        props.style,
        props.fullWidth && {
            width: '100%',
            justifyContent: 'space-between',
            padding: 10,
            paddingHorizontal: 50
        }
    ] })));
//# sourceMappingURL=Row.js.map