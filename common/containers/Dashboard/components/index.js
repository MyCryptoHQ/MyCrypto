import React, {Component} from 'react'
import {Card, Loader, Grid} from 'semantic-ui-react'
import DashboardCardComponent from './DashboardCardComponent'
export default class DashboardComponent extends Component {
    constructor(props) {
        super(props)
    }

    static propTypes = {
        statistics: React.PropTypes.array
    }

    render() {
        let {statistics} = this.props

        return (
            <div>
                <DashboardCardComponent/>
            </div>
        )
    }
}
