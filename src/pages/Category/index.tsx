import { RootState } from '@/models/index'
import React from 'react'
import { ScrollView, Text, View, StyleSheet } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import _ from 'lodash'
import {DragSortableView} from 'react-native-drag-sort'

import {ICategory} from '@/models/category'
import Item, { itemHeight, itemWidth, parentWidth } from './Item'
import { RootStackProps } from '@/navigator/index'
import HeaderRightBtn from './HeaderRightBtn'
import Touchable from '@/components/Touchable'

const mapStateToProps = ({category}: RootState) => {
    return {
        isEdit: category.isEdit,
        myCategorys: category.myCategorys,
        categorys: category.categorys
    }
}

const connector = connect(mapStateToProps)

type ModelState = ConnectedProps<typeof connector>

interface IProps extends ModelState {
    navigation: RootStackProps
}
interface IState {
    myCategorys: ICategory[]
}

// 我的分类默认项，不能删除
const fixedItem = [0,1]

class Category extends React.Component<IProps, IState> {
    state = {
        myCategorys: this.props.myCategorys
    }
    constructor(props: IProps) {
        super(props)
        props.navigation.setOptions({
            headerRight: () => <HeaderRightBtn toggleEdit={this.toggleEdit} />
        })
    }
    componentWillUnmount() {
        const {dispatch} = this.props
        // 初始化状态
        dispatch({
            type: 'category/setState',
            payload: {
                isEdit: false
            }
        })
    }
    // 切换编辑状态，保存数据
    toggleEdit = () => {
        const {dispatch, navigation, isEdit} = this.props
        const {myCategorys} = this.state
        dispatch({
            type: 'category/toggle',
            payload: {
                myCategorys,
            }
        })
        // 完成时返回首页
        if(isEdit) {
            navigation.goBack()
        }
    }
    // 长按进入编辑状态
    onLongPress = () => {
        const {dispatch} = this.props
        dispatch({
            type: 'category/setState',
            payload: {
                isEdit: true
            }
        })
    }
    // 增加、删除我的分类
    onPress = (cate: ICategory, index: number, isSelected: boolean) => {
        const {isEdit} = this.props
        const {myCategorys} = this.state
        const disabled = isSelected && fixedItem.indexOf(index) > -1
        if(disabled) return
        if(isEdit) {
            if(!isSelected) {
                this.setState({
                    myCategorys: myCategorys.concat(cate)
                })
            }else {
                this.setState({
                    myCategorys: myCategorys.filter(item => item.id !== cate.id)
                })
            }
        }
    }
    // 我的分类
    renderItem = (cate: ICategory, index: number) => {
        const {isEdit} = this.props
        const disabled = fixedItem.indexOf(index) > -1
        return (
            // DragSortableView 内部封装了 Touchable 组件
            <Item
                key={cate.id}
                disabled={disabled}
                item={cate}
                isEdit={isEdit}
                isSelected
            ></Item>
        )
    }
    // 其他分类
    renderUnselectedItem = (cate: ICategory, index: number) => {
        const {isEdit} = this.props
        return (
            <Touchable
                key={cate.id}
                onLongPress={this.onLongPress}
                onPress={() => this.onPress(cate, index, false)}
            >
                <Item
                    item={cate}
                    isEdit={isEdit}
                    isSelected={false}
                ></Item>
            </Touchable>
        )
    }
    onSortChange = (data: ICategory[]) => {
        this.setState({
            myCategorys: data
        })
    }
    onClickItem = (data: ICategory[], item: ICategory) => {
        this.onPress(item, data.indexOf(item), true)
    }
    render() {
        const {categorys, isEdit} = this.props
        const {myCategorys} = this.state
        // groupBy 根据回调的返回值进行分组
        const classifyGroup = _.groupBy(categorys, item => item.classify)
        return (
            <ScrollView style={styles.container}>
                <Text style={styles.TypeText}>我的分类</Text>
                <View style={styles.sortWrap}>
                    <DragSortableView
                        fixedItems={fixedItem}
                        dataSource={myCategorys}
                        renderItem={this.renderItem}
                        sortable={isEdit}
                        keyExtractor={item => item.id}
                        onDataChange={this.onSortChange}
                        parentWidth={parentWidth}
                        childrenWidth={itemWidth}
                        childrenHeight={itemHeight}
                        onClickItem={this.onClickItem}
                    />
                </View>
                {Object.keys(classifyGroup).map(key => {
                    return (
                        <View key={key}>
                            <Text style={styles.TypeText}>{key}</Text>
                            <View style={styles.sortWrap}>
                                {/* 过滤掉已经选中的项 */}
                                {classifyGroup[key].filter(item => myCategorys.every(selectedItem => (selectedItem.id !== item.id))).map(this.renderUnselectedItem)}
                            </View>
                        </View>
                    )
                })}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f6f6',
    padding: 15,
  },
  sortWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  TypeText: {
    marginBottom: 8,
    marginTop: 8,
    fontSize: 16,
  },
  tips: {
    color: '#999999',
    fontSize: 16,
    paddingLeft: 12,
  },
});

export default connector(Category)