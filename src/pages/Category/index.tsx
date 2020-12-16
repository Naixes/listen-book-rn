import { RootState } from '@/models/index'
import React from 'react'
import { ScrollView, Text, View, StyleSheet } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import _ from 'lodash'

import {ICategory} from '@/models/category'
import { viewportWidth } from '@/utils/index'
import Item from './Item'

const mapStateToProps = ({category}: RootState) => {
    return {
        myCategorys: category.myCategorys,
        categorys: category.categorys
    }
}

const connector = connect(mapStateToProps)

type ModelState = ConnectedProps<typeof connector>

interface IProps extends ModelState {}
interface IState {
    myCategorys: ICategory[]
}

const itemWrapperWidth = viewportWidth - 10
const itemWidth = itemWrapperWidth / 4 - 8

class Category extends React.Component<IProps, IState> {
    state = {
        myCategorys: this.props.myCategorys
    }
    renderItem = (cate: ICategory, index: number) => {
        return (
            <Item item={cate}></Item>
        )
    }
    render() {
        const {categorys} = this.props
        const {myCategorys} = this.state
        // groupBy根据回调的返回值进行分组
        const classifyGroup = _.groupBy(categorys, item => item.classify)
        return (
            <ScrollView style={styles.container}>
                <Text style={styles.myTypeText}>我的分类</Text>
                <View style={styles.sortWrap}>
                    {myCategorys.map(this.renderItem)}
                </View>
                <View>
                    {Object.keys(classifyGroup).map(key => {
                        return (
                            <View key={key}>
                                <Text style={styles.myTypeText}>{key}</Text>
                                <View style={styles.sortWrap}>
                                    {classifyGroup[key].map(this.renderItem)}
                                </View>
                            </View>
                        )
                    })}
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f6f6',
  },
  contentContainer: {
    padding: 15,
  },
  sortWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // marginHorizontal: -4,
    padding: 5
  },
  item: {
    width: itemWidth,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 3,
    margin: 4,
  },
  disabledItem: {
    backgroundColor: '#e0e0e0',
  },
  disabledItemText: {
    color: '#cccccc',
  },
  typeNameText: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 14,
  },
  addView: {
    position: 'absolute',
    top: -5,
    right: -5,
    height: 16,
    width: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f86442',
    borderRadius: 8,
  },
  addText: {
    // marginLeft: 1,
    lineHeight: 15,
    color: '#fff',
  },
  deleteView: {
    position: 'absolute',
    top: -5,
    right: -5,
    height: 16,
    width: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cccccc',
    borderRadius: 8,
  },

  deleteText: {
    // marginLeft: 1,
    lineHeight: 15,
    color: '#fff',
  },
  myTypeText: {
    marginBottom: 8,
    marginTop: 14,
    fontSize: 18,
  },
  tips: {
    color: '#999999',
    fontSize: 16,
    paddingLeft: 12,
  },
});

export default connector(Category)