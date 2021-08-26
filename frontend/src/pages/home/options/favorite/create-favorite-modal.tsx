import React from 'react'
import Backend, {
    SessionResponse,
    UsersResponse,
} from '../../../../libraries/backend'
import { AuthState } from '../../../../store/auth'
import { AppState, LoadingPayload } from '../../../../store/app'
import Utils from '../../../../libraries/utils'

export interface CreateFavoriteModalProps {
    auth: AuthState
    app: AppState
    onCloseButtonClicked: () => void
    onClassCreated: () => Promise<void>
    setLoading(payload: LoadingPayload): void
}

export interface CreateFavoriteModalState {
    usuario: string
    sesion: string
    users: UsersResponse[]
    sessions: SessionResponse[]
}

export default class CreateFavoriteModal extends React.Component<
    CreateFavoriteModalProps,
    CreateFavoriteModalState
> {
    state: CreateFavoriteModalState = {
        usuario: '',
        sesion: '',
        users: [],
        sessions: [],
    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData = async () => {
        try {
            this.props.setLoading({ isLoading: true })
            const users: UsersResponse[] = await Backend.getUsers(
                this.props.auth.token || ''
            )
            const sessions: SessionResponse[] = await Backend.getSession(
                this.props.auth.token || ''
            )
            this.setState({
                users,
                usuario: users[0]._id,
                sessions,
                sesion: sessions[0]._id,
            })
            this.props.setLoading({ isLoading: false })
        } catch (error) {
            this.props.setLoading({ isLoading: false })
            throw error
        }
    }

    onCreateButtonClicked = async (event: React.FormEvent) => {
        event.preventDefault()

        try {
            this.props.setLoading({ isLoading: true })

            await Backend.createFavorite(this.props.auth.token || '', {
                usuario: this.state.usuario,
                sesion: this.state.sesion,
            })
            this.props.setLoading({ isLoading: false })
            this.props.onClassCreated()
        } catch (error) {
            this.props.setLoading({ isLoading: false })
            throw error
        }
    }

    render(): React.ReactElement {
        return (
            <div className="w3-modal" style={{ display: 'block' }}>
                <div
                    className="w3-modal-content w3-card-4 w3-animate-zoom"
                    style={{ maxWidth: '600px' }}
                >
                    <div className="w3-center">
                        <h1>Crear nuevo favorito</h1>
                    </div>
                    <span
                        onClick={this.props.onCloseButtonClicked}
                        className="w3-button w3-xlarge w3-transparent w3-display-topright"
                    >
                        ×
                    </span>

                    <form
                        onSubmit={this.onCreateButtonClicked}
                        className="w3-container"
                    >
                        <div className="w3-section">
                            <label>
                                <b>Usuario</b>
                            </label>
                            <select
                                onChange={(event) =>
                                    this.setState({
                                        usuario: event.target.value,
                                    })
                                }
                                className="w3-input w3-border w3-margin-bottom"
                                required
                            >
                                {this.state.users.map(
                                    (user: UsersResponse, index: number) => (
                                        <option key={index} value={user._id}>
                                            {user.email}
                                        </option>
                                    )
                                )}
                            </select>
                            <br />

                            <label>
                                <b>Sesión</b>
                            </label>
                            <select
                                onChange={(event) =>
                                    this.setState({
                                        sesion: event.target.value,
                                    })
                                }
                                className="w3-input w3-border w3-margin-bottom"
                                required
                            >
                                {this.state.sessions.map(
                                    (
                                        sesion: SessionResponse,
                                        index: number
                                    ) => (
                                        <option key={index} value={sesion._id}>
                                            {Utils.twoDigits(sesion.horaInicio)}
                                            :
                                            {Utils.twoDigits(
                                                sesion.minutoInicio
                                            )}{' '}
                                            - {Utils.twoDigits(sesion.horaFin)}:
                                            {Utils.twoDigits(sesion.minutoFin)}
                                        </option>
                                    )
                                )}
                            </select>
                            <br />

                            <button
                                className="w3-button w3-block w3-green w3-section w3-padding"
                                type="submit"
                            >
                                Crear
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
