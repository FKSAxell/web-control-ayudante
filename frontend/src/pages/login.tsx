import React from 'react'
import Backend, { UserLoginResponse } from '../libraries/backend'
import auth, { AuthState, LoginPayload } from '../store/auth'
import { connect } from 'react-redux'
import { History } from 'history'
import { RootState } from '../store/store'
import app, { AppState, LoadingPayload } from '../store/app'
import Modal from '../components/modal'
import Loader from '../components/loader/loader'

interface LoginProps {
    auth: AuthState
    app: AppState
    login(payload: LoginPayload): void
    history: History
    setLoading(payload: LoadingPayload): void
}

interface LoginState {
    email: string
    password: string
}

class Login extends React.Component<LoginProps, LoginState> {
    state = {
        email: '',
        password: '',
    }

    constructor(props: LoginProps) {
        super(props)

        if (this.props.auth.token !== undefined) {
            this.props.history.replace('/')
        }
    }

    onLoginButtonClicked = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault()

        this.props.setLoading({ isLoading: true })

        try {
            const userLoginResponse: UserLoginResponse = await Backend.login(
                this.state.email,
                this.state.password
            )
            this.props.setLoading({ isLoading: false })
            this.props.login({ token: userLoginResponse.token, user: userLoginResponse.user })
            this.props.history.replace('/')
        } catch (error) {
            this.props.setLoading({ isLoading: false })
            alert('error iniciando sesión')
        }
    }

    render(): React.ReactElement {
        return (
            <div className="w3-container">
                {this.props.app.isLoading && (
                    <Modal background={false} content={<Loader />} />
                )}
                <div className="w3-modal" style={{ display: 'block' }}>
                    <div
                        className="w3-modal-content w3-card-4 w3-animate-zoom"
                        style={{ maxWidth: '600px' }}
                    >
                        {/*<div className="w3-center">
                            <img src="img_avatar4.png" alt="Avatar" style={{width: '30%'}} className="w3-circle w3-margin-top"/>
                        </div>*/}
                        <form
                            onSubmit={this.onLoginButtonClicked}
                            className="w3-container"
                        >
                            <div className="w3-section">
                                <label>
                                    <b>Usuario</b>
                                </label>
                                <input
                                    value={this.state.email}
                                    onChange={(event) =>
                                        this.setState({
                                            email: event.target.value,
                                        })
                                    }
                                    className="w3-input w3-border w3-margin-bottom"
                                    type="text"
                                    placeholder="Usuario"
                                    name="username"
                                    required
                                />
                                <label>
                                    <b>Contraseña</b>
                                </label>
                                <input
                                    value={this.state.password}
                                    onChange={(event) =>
                                        this.setState({
                                            password: event.target.value,
                                        })
                                    }
                                    className="w3-input w3-border w3-margin-bottom"
                                    type="password"
                                    placeholder="Contraseña"
                                    name="password"
                                    required
                                />
                                <button
                                    className="w3-button w3-block w3-green w3-section w3-padding"
                                    type="submit"
                                >
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
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
        app: state.app,
    }
}

const mapDispatchToProps = {
    login: auth.actions.login,
    setLoading: app.actions.setLoading,
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
