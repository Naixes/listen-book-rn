import _ from 'lodash'
import React, { useCallback } from 'react'
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native'

const Touchable: React.FC<TouchableOpacityProps> = React.memo(({style, onPress, ...rest}) => {
    const touchableStyle = rest.disabled ? [style, styles.disabled] : style
    // 点击事件节流
    let throttleOnPress = undefined
    if(typeof onPress === 'function') {
        // 设置回调在节流之前执行
        throttleOnPress = useCallback(_.throttle(onPress, 1000, {leading: true, trailing: false}), [onPress])
    }
    return (
        <TouchableOpacity
            onPress={throttleOnPress}
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