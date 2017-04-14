import React, {Component} from 'react'
import {connect} from 'react-redux'
import GenerateWallet from './GenerateWallet/components'
import {GET_STATISTICS} from 'actions/dashboard'

class Tabs extends Component {
    constructor(props) {
        super(props)
    }

    static propTypes = {
        statistics: React.PropTypes.array,
        getStatistics: React.PropTypes.func.isRequired
    }

    componentDidMount() {
        this.props.getStatistics()
    }

    render() {

        let {statistics} = this.props
        let props = {statistics}

        return (
            <GenerateWallet {...props}/>
        )
    }
}

function mapStateToProps(state) {
    return {statistics: state.dashboard.statistics}
}

function mapDispatchToProps(dispatch) {
    return {
        getStatistics: async () => {
            let result = await dispatch(GET_STATISTICS)
            dispatch(result)
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tabs)
