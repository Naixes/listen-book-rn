import React from 'react'
import { StyleSheet } from 'react-native'
import { View, Text } from 'react-native'

import { ICategory } from '@/models/category'
import { viewportWidth } from '@/utils/index'

interface IProps {
    item: ICategory
}

const itemWrapperWidth = viewportWidth - 10
const itemWidth = itemWrapperWidth / 4 - 8

class Item extends React.Component<IProps> {
    render() {
        const {item} = this.props
        return(
            <View style={styles.item} key={item.id}>
                <View>
                    <Text style={styles.typeNameText}>{item.name}</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
  item: {
    width: itemWidth,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 3,
    margin: 4,
  },
  typeNameText: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 14,
  },
});

export default Item