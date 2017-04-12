import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Dimmer, Sidebar as SidebarSemantic, Container} from 'semantic-ui-react'
import {Header, Sidebar, Footer} from 'components'
import {CLOSE_SIDEBAR, OPEN_SIDEBAR, WINDOW_RESIZE} from 'actions/layout'
import {LOGOUT_AUTH} from 'actions/auth'
import {push} from 'react-router-redux'
import {sidebarRouting} from 'routing'

class App extends Component {
    constructor(props) {
        super(props)
    }

    static propTypes = {
        children: React.PropTypes.node.isRequired,
        location: React.PropTypes.object,
        sidebarOpened: React.PropTypes.bool,
        closeSidebar: React.PropTypes.func,
        isLoggedIn: React.PropTypes.bool,
        handleWindowResize: React.PropTypes.func,
        logout: React.PropTypes.func,
        checkAuthLogic: React.PropTypes.func,
        toggleSidebar: React.PropTypes.func,
        onHeaderRightButtonClick: React.PropTypes.func,
        router: React.PropTypes.object,
        isMobile: React.PropTypes.bool
    }


    componentWillMount() {
        let {handleWindowResize, isLoggedIn} = this.props
        window.addEventListener('resize', handleWindowResize)
        this.checkAppAuthLogic(isLoggedIn)
    }

    /**
     * Call checkAuthLogic
     * @param  {Bool} loggedIn state.auth.loggedIn, current prop
     * @return {Bool} Nothing
     */
    checkAppAuthLogic(loggedIn) {
        let {router, checkAuthLogic} = this.props
        let path = router.getCurrentLocation().pathname
        checkAuthLogic(path, loggedIn)
        return false
    }

    componentWillReceiveProps(nextProps) {
        this.checkAppAuthLogic(nextProps.isLoggedIn)
    }

    render() {
        let {
            children,
            sidebarOpened,
            closeSidebar,
            isLoggedIn,
            logout,
            onHeaderRightButtonClick,
            toggleSidebar,
            isMobile
        } = this.props

        let title = children.props.route.name

        let sidebarProps = {
            isMobile,
            logout,
            open: sidebarOpened,
            routing: sidebarRouting
        }

        let headerProps = {
            toggleSidebar,
            title,
            isLoggedIn,
            onHeaderRightButtonClick
        }

        let dimmerProps = {
            active: sidebarOpened,
            onClick: closeSidebar
        }

        return (
            <div className="page-layout">

                <main>
                    <Header {...headerProps}/>
                    <div className="main-content">
                        <Container>
                            { children}
                        </Container>
                    </div>
                    <Footer/>
                </main>

            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        sidebarOpened: state.layout.sidebarOpened,
        isMobile: state.layout.isMobile,
        isLoggedIn: state.auth.loggedIn
    }
}

function mapDispatchToProps(dispatch) {
    let resizer
    return {
        closeSidebar: () => {
            dispatch(CLOSE_SIDEBAR())
        },
        logout: () => {
            dispatch(LOGOUT_AUTH())
            dispatch(push('/auth'))
        },
        toggleSidebar: () => {
            dispatch(OPEN_SIDEBAR())
        },
        onHeaderRightButtonClick: () => {
        },
        /**
         * Immediately push to homePath('/'), if user is logged.
         * Can be used for other auth logic checks.
         * Useful, because we don't need to dispatch `push(homePath)` action
         * from `Login` container after LOGIN_AUTH_SUCCESS action
         * @param  {String}  path       [current location path]
         * @param  {Boolean} isLoggedIn [is user logged in?]
         * @return {[type]}             [description]
         */
        checkAuthLogic: (path, isLoggedIn) => {
            let authPath = '/auth'
            let homePath = '/'
            if (isLoggedIn && path === authPath) {
                dispatch(push(homePath))
            }
        },
        handleWindowResize: () => {
            clearTimeout(resizer)
            resizer = setTimeout((() => dispatch(WINDOW_RESIZE())), 100)
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
