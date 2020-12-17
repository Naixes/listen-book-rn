import { RootState } from '@/models/index'
import React from 'react'
import {HeaderButtons, Item} from 'react-navigation-header-buttons'
import { connect, ConnectedProps } from 'react-redux'

const mapStateToProps = ({category}: RootState) => {
    return {
        isEdit: category.isEdit
    }
}

const connector = connect(mapStateToProps)

type ModelState = ConnectedProps<typeof connector>

interface IProps extends ModelState {
    toggleEdit: () => void
}

class HeaderRightBtn extends React.PureComponent<IProps> {
    render() {
        const {toggleEdit, isEdit} = this.props
        return (
            <HeaderButtons>
                <Item title={isEdit ? '完成' : '编辑'} onPress={toggleEdit} />
            </HeaderButtons>
        )
    }
}

export default connector(HeaderRightBtn)