import React from 'react'
import { connect } from 'react-redux'
import { RootState } from '../store/store'
import auth, { AuthState } from '../store/auth'
import { History } from 'history'

interface LoginProps {
    auth: AuthState
    history: History
}

interface LoginState {}

class Login extends React.Component<LoginProps, LoginState> {
    constructor(loginProps: LoginProps) {
        super(loginProps)

        if(this.props.auth.token === undefined) {
            this.props.history.replace('/login')
        }
    }
    render(): React.ReactElement {
        return (
            <div>
                Not found
            </div>
        )
    }
}

function mapStateToProps(
    state: RootState,
    componentProps: LoginProps
): LoginProps {
    return {
        ...componentProps,
        auth: state.auth,
    }
}

const mapDispatchToProps = {
    login: auth.actions.login,
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
