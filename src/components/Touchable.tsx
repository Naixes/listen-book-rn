import React from 'react'
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native'

const Touchable: React.FC<TouchableOpacityProps> = React.memo(({style, ...rest}) => {
    const touchableStyle = rest.disabled ? [style, styles.disabled] : style
    return (
        <TouchableOpacity
            style={touchableStyle}
            activeOpacity={0.8}
            {...rest}
        ></TouchableOpacity>
    )
})

const styles = StyleSheet.create({
    disabled: {
        opacity: 0.5,
    }
})

export default Touchable