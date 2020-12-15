import React from 'react'
import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import {connect, ConnectedProps} from 'react-redux'

import { RootState } from '@/models/index'
import { IGuess } from '@/models/home'
import Touchable from '@/components/Touchable'
import Icon from '@/assets/iconfont/index'

const mapStateToProps = ({home}: RootState) => {
    return {
        guess: home.guess
    }
}

const connector = connect(mapStateToProps)

type ModelState = ConnectedProps<typeof connector>

class Guess extends React.PureComponent<ModelState> {
    componentDidMount() {
        this.fetch()
    }
    fetch = () => {
        const {dispatch} = this.props
        dispatch({
            type: 'home/fetchGuess'
        })
    }
    onPress = () => {
      console.log('xxx');
    }
    renderItem({item}: {item: IGuess}) {
        return (
            <Touchable style={styles.item} onPress={this.onPress}>
                <Image style={styles.thumbnail} source={{uri: item.image}}></Image>
                <Text numberOfLines={2} style={styles.title}>{item.title}</Text>
            </Touchable>
        )
    }
    render() {
      const {guess} = this.props
      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={{flexDirection: 'row'}}>
              <Icon name="icon-xihuan" />
              <Text style={styles.headerTitle}>猜你喜欢</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.moreTitle}>更多</Text>
              <Icon name="icon-more" />
            </View>
          </View>
          <FlatList
              numColumns={3}
              data={guess}
              renderItem={this.renderItem}
          ></FlatList>
          <Touchable onPress={this.fetch} style={styles.changeBatch}>
            <Text>
              <Icon name="icon-huanyipi" size={14} color="red" /> 换一批
            </Text>
          </Touchable>
        </View>
      )
    }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    // padding: 2,
    margin: 6,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowColor: '#ccc',
    // 让安卓拥有灰色阴影
    elevation: 4,
  },
  header: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#efefef',
    // 有的手机的分辨率较高，1可能会很粗
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    marginLeft: 5,
    color: '#333333',
  },
  moreTitle: {
    color: '#6f6f6f',
  },
  item: {
    flex: 1,
    marginVertical: 6,
    marginHorizontal: 5,
  },
  rightContainer: {
    flex: 1,
  },
  title: {
    // textAlign: "center"
  },
  thumbnail: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#dedede',
  },
  list: {
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  changeBatch: {
    padding: 10,
    alignItems: 'center',
  },
});

export default connector(Guess)