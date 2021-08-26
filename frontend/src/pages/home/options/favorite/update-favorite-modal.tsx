import React from 'react'
import Backend, {
    FavoriteResponse,
    SessionResponse,
    UsersResponse,
} from '../../../../libraries/backend'
import { AuthState } from '../../../../store/auth'
import { AppState, LoadingPayload } from '../../../../store/app'
import Utils from '../../../../libraries/utils'

export interface UpdateFavoriteModalProps {
    auth: AuthState
    app: AppState
    onCloseButtonClicked: () => void
    onClassCreated: () => Promise<void>
    setLoading(payload: LoadingPayload): void

    favorite: FavoriteResponse
}

export interface UpdateFavoriteModalState {
    usuario: string
    sesion: string
    users: UsersResponse[]
    sessions: SessionResponse[]
}

export default class UpdateFavoriteModal extends React.Component<
    UpdateFavoriteModalProps,
    UpdateFavoriteModalState
> {
    constructor(props: UpdateFavoriteModalProps) {
        super(props)

        this.state = {
            usuario: this.props.favorite.usuario._id,
            sesion: this.props.favorite.sesion._id,
            users: [],
            sessions: [],
        }
    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData = async () => {
        try {
            this.props.setLoading({ isLoading: true })
            this.setState({
                users: await Backend.getUsers(this.props.auth.token || ''),
                sessions: await Backend.getSession(this.props.auth.token || ''),
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

            await Backend.updateFavorite(
                this.props.auth.token || '',
                this.props.favorite._id,
                {
                    usuario: this.state.usuario,
                    sesion: this.state.sesion,
                }
            )
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
                        <h1>Actualizar favorito</h1>
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
                                        <option
                                            selected={
                                                user._id ===
                                                this.props.favorite.usuario._id
                                            }
                                            key={index}
                                            value={user._id}
                                        >
                                            {user.email}{' '}
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
                                        session: SessionResponse,
                                        index: number
                                    ) => (
                                        <option
                                            selected={
                                                session._id ===
                                                this.props.favorite.sesion._id
                                            }
                                            key={index}
                                            value={session._id}
                                        >
                                            {Utils.twoDigits(
                                                session.horaInicio
                                            )}
                                            :
                                            {Utils.twoDigits(
                                                session.minutoInicio
                                            )}{' '}
                                            - {Utils.twoDigits(session.horaFin)}
                                            :
                                            {Utils.twoDigits(session.minutoFin)}
                                        </option>
                                    )
                                )}
                            </select>
                            <br />

                            <button
                                className="w3-button w3-block w3-green w3-section w3-padding"
                                type="submit"
                            >
                                Actualizar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
