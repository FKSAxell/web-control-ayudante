import React from 'react'
import Backend, { RolResponse } from '../../../../libraries/backend'
import { AuthState } from '../../../../store/auth'
import { AppState, LoadingPayload } from '../../../../store/app'

export interface CreateUserModalProps {
    auth: AuthState
    app: AppState
    onCloseButtonClicked: () => void
    onClassCreated: () => Promise<void>
    setLoading(payload: LoadingPayload): void
}

export interface CreateUserModalState {
    nombre: string
    email: string
    password: string
    rol: string[]
    roles: RolResponse[]
}

export default class CreateUserModal extends React.Component<CreateUserModalProps, CreateUserModalState> {
    state: CreateUserModalState = {
        nombre: '',
        email: '',
        password: '',
        rol: [],
        roles: []
    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData = async () => {
        try {
            this.props.setLoading({ isLoading: true })
            this.setState({
                roles: await Backend.getRoles(this.props.auth.token || ''),
            })
            this.props.setLoading({ isLoading: false })
        } catch(error) {
            this.props.setLoading({ isLoading: false })
            throw error
        }
    }

    onCreateButtonClicked = async (event: React.FormEvent) => {
        event.preventDefault()

        try{
            this.props.setLoading({ isLoading: true })

            await Backend.createUser(this.props.auth.token || '', {
                nombre: this.state.nombre,
                email: this.state.email,
                password: this.state.password,
                rol: this.state.rol,
            })
            this.props.setLoading({ isLoading: false })
            this.props.onClassCreated()
        } catch(error) {
            this.props.setLoading({ isLoading: false })
            throw error
        }
    }

    render(): React.ReactElement {
        return (
            <div className="w3-modal" style={{ display: 'block' }}>
                <div className="w3-modal-content w3-card-4 w3-animate-zoom" style={{ maxWidth: '600px' }}>
                    <div className="w3-center">
                        <h1>
                            Crear nuevo usuario
                        </h1>
                    </div>
                    <span onClick={this.props.onCloseButtonClicked} className="w3-button w3-xlarge w3-transparent w3-display-topright">
                        ×
                    </span>

                    <form onSubmit={this.onCreateButtonClicked} className="w3-container">
                        <div className="w3-section">
                            <label>
                                <b>
                                    Nombre
                                </b>
                            </label>
                            <input value={this.state.nombre} onChange={(event) => this.setState({ nombre: event.target.value })} className="w3-input w3-border w3-margin-bottom" type="text" placeholder="Nombre" name="nombre" required/>

                            <label>
                                <b>
                                    Email
                                </b>
                            </label>
                            <input value={this.state.email} onChange={(event) => this.setState({ email: event.target.value })} className="w3-input w3-border w3-margin-bottom" type="email" placeholder="Email" name="email" required/>

                            <label>
                                <b>
                                    Password
                                </b>
                            </label>
                            <input value={this.state.password} onChange={(event) => this.setState({ password: event.target.value })} className="w3-input w3-border w3-margin-bottom" type="password" placeholder="Contrasena" name="contrasena" required/>

                            <label>
                                <b>
                                    Roles
                                </b>
                            </label>
                            <select onChange={(event) => this.setState({ rol: Array.from(event.target.selectedOptions, option => option.value) })} className="w3-input w3-border w3-margin-bottom" multiple required>
                                {this.state.roles.map((rol: RolResponse, index: number) =>
                                    <option key={index} value={rol._id}>
                                        {rol.nombre}
                                    </option>
                                )}
                            </select>

                            <button className="w3-button w3-block w3-green w3-section w3-padding" type="submit">
                                Crear
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
