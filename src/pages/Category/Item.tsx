import React from 'react'
import { StyleSheet } from 'react-native'
import { View, Text } from 'react-native'

import { ICategory } from '@/models/category'
import { viewportWidth } from '@/utils/index'

interface IProps {
    disabled?: boolean;
    isEdit: boolean;
    isSelected: boolean;
    item: ICategory
}
export const parentWidth = viewportWidth
export const itemWidth = viewportWidth / 4 - 8
export const itemHeight = 40

class Item extends React.Component<IProps> {
    render() {
        const {item, isEdit, isSelected, disabled} = this.props
        return(
            <View style={styles.itemWrapper}>
                <View style={[styles.item, disabled && styles.disabled]}>
                    <Text style={styles.typeNameText}>{item.name}</Text>
                </View>
                {
                    isEdit && !disabled && (
                        <View style={styles.addView}>
                            <Text style={styles.iconText}>{isSelected ? '-' : '+'}</Text>
                        </View>
                    )
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    disabled: {
        backgroundColor: '#e0e0e0',
    },
    itemWrapper: {
        width: itemWidth,
        height: itemHeight,
    },
    item: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 4,
        margin: 4,
    },
    typeNameText: {
        fontSize: 14,
    },
    iconText: {
        lineHeight: 15,
        color: '#fff',
    },
    addView: {
        position: 'absolute',
        top: -2,
        right: -2,
        height: 16,
        width: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f86442',
        borderRadius: 8,
    },
    deleteView: {
        position: 'absolute',
        top: -2,
        right: -2,
        height: 16,
        width: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#cccccc',
        borderRadius: 8,
    },
});

export default Item