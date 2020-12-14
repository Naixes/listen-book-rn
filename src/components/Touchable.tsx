import React from 'react'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'

const Touchable: React.FC<TouchableOpacityProps> = (props) => {
    const {style, ...rest} = props
    return (
        <TouchableOpacity
            style={style}
            activeOpacity={0.8}
            {...rest}
        ></TouchableOpacity>
    )
}

export default Touchable