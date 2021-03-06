import React from 'react'
import Backend, {
    SubjectResponse,
    UsersResponse,
} from '../../../../libraries/backend'
import { AuthState } from '../../../../store/auth'
import { AppState, LoadingPayload } from '../../../../store/app'

export interface CreateRegisterModalProps {
    auth: AuthState
    app: AppState
    onCloseButtonClicked: () => void
    onClassCreated: () => Promise<void>
    setLoading(payload: LoadingPayload): void
}

export interface CreateRegisterModalState {
    usuario: string
    materia: string
    users: UsersResponse[]
    subjects: SubjectResponse[]
}

export default class CreateRegisterModal extends React.Component<
    CreateRegisterModalProps,
    CreateRegisterModalState
> {
    state: CreateRegisterModalState = {
        usuario: '',
        materia: '',
        users: [],
        subjects: [],
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
            const subjects: SubjectResponse[] = await Backend.getSubjects(
                this.props.auth.token || ''
            )
            this.setState({
                subjects,
                users,
                usuario: users[0]._id,
                materia: subjects[0]._id,
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

            await Backend.createRegister(this.props.auth.token || '', {
                materia: this.state.materia,
                usuario: this.state.usuario,
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
                        <h1>Crear nuevo registro</h1>
                    </div>
                    <span
                        onClick={this.props.onCloseButtonClicked}
                        className="w3-button w3-xlarge w3-transparent w3-display-topright"
                    >
                        ??
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
                                        <option key={index} value={subject._id}>
                                            {subject.nombre}
                                        </option>
                                    )
                                )}
                            </select>

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
