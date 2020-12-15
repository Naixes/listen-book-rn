import React from 'react'
import SnapCarousel, { ParallaxImage, AdditionalParallaxProps, Pagination } from 'react-native-snap-carousel'
import {StyleSheet, View } from 'react-native'

import {viewportWidth, widFromPer, heiFromPer} from '@/utils/index'
import {ICarousel} from '@/models/home'
import { RootState } from '@/models/index'
import { connect, ConnectedProps } from 'react-redux'

// const data = [
//     "https://images.pexels.com/photos/2611812/pexels-photo-2611812.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
//     "https://ssyerv1.oss-cn-hangzhou.aliyuncs.com/picture/5c95c10cf7074640955847c53db7b601.jpg!sswm",
//     "https://ssyerv1.oss-cn-hangzhou.aliyuncs.com/picture/b693633b1c4b48a4a22741e92eb65e8c.jpg!sswm",
//     "https://ssyerv1.oss-cn-hangzhou.aliyuncs.com/picture/2fff76db96c6444eb39fda6ef32f2842.jpg!sswm"
// ]

const itemWidth = widFromPer(90) + widFromPer(3) * 2
export const itemHeight = heiFromPer(26)

const mapStateToProps = ({home}: RootState) => ({
    data: home.carousels,
    activeCarouselIndex: home.activeCarouselIndex,
})

// 状态映射
const connector = connect(mapStateToProps)

type ModelState = ConnectedProps<typeof connector>

// 继承 model state
interface IProps extends ModelState {}

class Carousel extends React.Component<IProps> {
    snapHandler = (index: number) => {
        const {dispatch} = this.props
        // 更新当前轮播图下标
        dispatch({
            type: 'home/setState',
            payload: {
                activeCarouselIndex: index
            }
        })
    }

    // get表示是一个属性
    get pagination() {
        const {data, activeCarouselIndex} = this.props
        return (
            <View style={styles.paginationWrapper}>
                <Pagination
                    containerStyle={styles.paginationContainer}
                    dotContainerStyle={styles.dotContainer}
                    dotStyle={styles.dotStyle}
                    dotsLength={data.length}
                    activeDotIndex={activeCarouselIndex}
                    inactiveDotScale={0.7}
                    inactiveDotOpacity={0.6}
                ></Pagination>
            </View>
        )
    }

    // item为data中的每一项
    // parallexProps：视差配置
    renderItem = ({item}: {item: ICarousel}, parallaxProps?: AdditionalParallaxProps) => {
        return (
            <ParallaxImage
                source={{uri: item.image}}
                containerStyle={styles.imageContainer}
                style={styles.image}
                // 视差速度默认0.3
                parallaxFactor={0.8}
                {...parallaxProps}
                // 显示加载动画
                showSpinner
                spinnerColor="rgba(0,0,0,0.25)"
            />
        )
    }

    render() {
        const {data} = this.props
        return (
            <View>
                <SnapCarousel
                    data={data}
                    renderItem={this.renderItem}
                    sliderWidth={viewportWidth}
                    itemWidth={itemWidth}
                    onSnapToItem={this.snapHandler}
                    hasParallaxImages
                    loop
                    autoplay
                ></SnapCarousel>
                {this.pagination}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    imageContainer: {
        width: itemWidth,
        height: itemHeight,
        borderRadius: 8,
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
    },
    paginationWrapper: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    paginationContainer: {
        position: "absolute",
        top: -18,
        // backgroundColor: 'rgba(255, 255, 255, 0.25)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    dotContainer: {
        marginHorizontal: 4,
    },
    dotStyle: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgb(255, 255, 255)',
    }
})

export default connector(Carousel)