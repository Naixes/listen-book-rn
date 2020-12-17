import Touchable from '@/components/Touchable'
import { RootState } from '@/models/index'
import { getActiveTabName } from '@/utils/index'
import { MaterialTopTabBar, MaterialTopTabBarProps } from '@react-navigation/material-top-tabs'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {getStatusBarHeight} from 'react-native-iphone-x-helper'
import LinearAnimatedGradientTransition from 'react-native-linear-animated-gradient-transition'
import { connect, ConnectedProps } from 'react-redux'

const mapStateToProps = (state: RootState, props: MaterialTopTabBarProps) => {
  // 需要获取现在处于焦点的 tab 的名字
  const routeName = getActiveTabName(props.state)
  const modelState = state[routeName]
  return {
    gradientVisible: modelState.gradientVisible,
    linearColors: modelState.carousels && modelState.carousels.length > 0 ? (modelState.activeCarouselIndex ? modelState.carousels[modelState.activeCarouselIndex].colors : undefined) : undefined
  }
}
const connector = connect(mapStateToProps)

type ModelState = ConnectedProps<typeof connector>
type IProps = MaterialTopTabBarProps & ModelState

class TopTabBarWrapper extends React.Component<IProps> {
  get linearGradient() {
    const {linearColors = ['#f86442', '#f2f2f2'], gradientVisible} = this.props
    if(gradientVisible) {
      return (
        <LinearAnimatedGradientTransition colors={[...linearColors, '#f2f2f2']} style={styles.gradient}></LinearAnimatedGradientTransition>
      )
    }
    return null
  }
  goCategory = () => {
    const {navigation} = this.props
    navigation.navigate('Category')
  }
  render() {
    let {gradientVisible, indicatorStyle, ...restProps} = this.props

    let textStyle = styles.blackText
    let activeTintColor = '#f86442'

    // 渐变显示时的文字颜色
    if(gradientVisible) {
      textStyle = styles.text
      activeTintColor = '#fff'
      if(indicatorStyle) {
        indicatorStyle = StyleSheet.compose(indicatorStyle, styles.whiteBackgroundColor)
      }
    }

    return (
      <View style={styles.container}>
        {/* 渐变色 */}
        {this.linearGradient}
        <View style={styles.topTabBarView}>
          <MaterialTopTabBar 
            style={styles.tabBar}
            {...restProps}
            indicatorStyle={indicatorStyle}
            activeTintColor={activeTintColor}
          ></MaterialTopTabBar>
          <Touchable style={styles.categoryBtn} onPress={this.goCategory}>
            <Text style={textStyle}>分类</Text>
          </Touchable>
        </View>
        <View style={styles.searchBar}>
          <Touchable style={styles.searchBtn}>
            <Text style={textStyle}>搜索按钮</Text>
          </Touchable>
          <Touchable style={styles.historyBtn}>
            <Text style={textStyle}>历史记录</Text>
          </Touchable>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: getStatusBarHeight(),
  },
  gradient: {
    // 占据整个父容器
    ...StyleSheet.absoluteFillObject,
    height: 240,
  },
  topTabBarView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabBar: {
      flex: 1,
      elevation: 0,
      overflow: "hidden",
      backgroundColor: 'transparent'
  },
  categoryBtn: {
    paddingHorizontal: 10,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: '#eee',
  },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 15,
  },
  searchBtn: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 12,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  historyBtn: {
    marginLeft: 24,
  },
  text: {
    color: '#fff',
  },
  blackText: {
    color: '#333',
  },
  whiteBackgroundColor: {
    backgroundColor: '#fff'
  },
});

export default connector(TopTabBarWrapper)