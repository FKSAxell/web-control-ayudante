import React from 'react'
import Backend, {
    RegisterResponse,
    SubjectResponse,
    UsersResponse,
} from '../../../../libraries/backend'
import { AuthState } from '../../../../store/auth'
import { AppState, LoadingPayload } from '../../../../store/app'

export interface UpdateRegisterModalProps {
    auth: AuthState
    app: AppState
    onCloseButtonClicked: () => void
    onClassCreated: () => Promise<void>
    setLoading(payload: LoadingPayload): void

    register: RegisterResponse
}

export interface UpdateRegisterModalState {
    usuario: string
    materia: string
    users: UsersResponse[]
    subjects: SubjectResponse[]
}

export default class UpdateRegisterModal extends React.Component<
    UpdateRegisterModalProps,
    UpdateRegisterModalState
> {
    constructor(props: UpdateRegisterModalProps) {
        super(props)

        this.state = {
            usuario: this.props.register.usuario._id,
            materia: this.props.register.materia._id,
            users: [],
            subjects: [],
        }
    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData = async () => {
        try {
            this.props.setLoading({ isLoading: true })
            this.setState({
                subjects: await Backend.getSubjects(
                    this.props.auth.token || ''
                ),
                users: await Backend.getUsers(this.props.auth.token || ''),
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

            await Backend.updateRegister(
                this.props.auth.token || '',
                this.props.register._id,
                {
                    usuario: this.state.usuario,
                    materia: this.state.materia,
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
                        <h1>Actualizar registro</h1>
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
                                                this.props.register.usuario._id
                                            }
                                            key={index}
                                            value={user._id}
                                        >
                                            {user.nombre}
                                        </option>
                                    )
                                )}
                            </select>

                            <label>
                                <b>Materia</b>
                            </label>
                            <select
                                onChange={(event) =>
                                    this.setState({
                                        materia: event.target.value,
                                    })
                                }
                                className="w3-input w3-border w3-margin-bottom"
                                required
                            >
                                {this.state.subjects.map(
                                    (
                                        subject: SubjectResponse,
                                        index: number
                                    ) => (
                                        <option
                                            selected={
                                                subject._id ===
                                                this.props.register.materia._id
                                            }
                                            key={index}
                                            value={subject._id}
                                        >
                                            {subject.nombre}
                                        </option>
                                    )
                                )}
                            </select>

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
