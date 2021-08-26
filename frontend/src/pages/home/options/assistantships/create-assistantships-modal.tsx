import React from 'react'
import Backend, {
    SubjectResponse,
    UsersResponse,
} from '../../../../libraries/backend'
import { AuthState } from '../../../../store/auth'
import { AppState, LoadingPayload } from '../../../../store/app'
import DatePicker from 'react-date-picker'

export interface CreateAssistanshipModalProps {
    auth: AuthState
    app: AppState
    onCloseButtonClicked: () => void
    onClassCreated: () => Promise<void>
    setLoading(payload: LoadingPayload): void
}

export interface CreateAssistanshipModalState {
    usuario: string
    materia: string
    fechaInicio: Date
    fechaFin: Date
    users: UsersResponse[]
    subjects: SubjectResponse[]
}

export default class CreateAssistanshipModal extends React.Component<
    CreateAssistanshipModalProps,
    CreateAssistanshipModalState
> {
    state: CreateAssistanshipModalState = {
        usuario: '',
        materia: '',
        fechaInicio: new Date(),
        fechaFin: new Date(),
        users: [],
        subjects: [],
    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData = async () => {
        try {
            this.props.setLoading({ isLoading: true })
            const subjects: SubjectResponse[] = await Backend.getSubjects(
                this.props.auth.token || ''
            )
            const users: UsersResponse[] = await Backend.getUsers(
                this.props.auth.token || ''
            )
            this.setState({
                subjects,
                users,
                materia: subjects[0]._id,
                usuario: users[0]._id,
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

            await Backend.createAssistanship(this.props.auth.token || '', {
                usuario: this.state.usuario,
                materia: this.state.materia,
                fechaFin: this.state.fechaFin,
                fechaInicio: this.state.fechaInicio,
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
                        <h1>Crear nueva ayundatía</h1>
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
                                disabled
                            >
                                <option value={this.props.auth.user?._id}>
                                    {this.props.auth.user?.email}
                                </option>
                                {/*this.state.users.map(
                                    (user: UsersResponse, index: number) => (
                                        <option key={index} value={user._id}>
                                            {user.email}
                                        </option>
                                    )
                                )*/}
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

                            <label>
                                <b>Fecha inicial</b>
                            </label>
                            <br />
                            <DatePicker
                                onChange={(date: Date) =>
                                    this.setState({ fechaInicio: date })
                                }
                                value={this.state.fechaInicio}
                            />
                            <br />

                            <label>
                                <b>Fecha final</b>
                            </label>
                            <br />
                            <DatePicker
                                onChange={(date: Date) =>
                                    this.setState({ fechaFin: date })
                                }
                                value={this.state.fechaInicio}
                            />
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
