import { RootState } from '@/models/index'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'

const mapStateTpProps = ({album}: RootState) => {
    return {
        introduction: album.introduction
    }
}
const connector = connect(mapStateTpProps)
type ModelState = ConnectedProps<typeof connector>

interface IProps extends ModelState {}

class Introduction extends React.Component<IProps> {
    render() {
        const {introduction} = this.props
        return (
            <View style={styles.container}>
                <Text>{introduction}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    }
})

export default connector(Introduction)