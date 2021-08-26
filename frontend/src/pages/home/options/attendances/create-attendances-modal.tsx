import React from 'react'
import Backend, {
    ClassesResponse,
    UsersResponse,
} from '../../../../libraries/backend'
import { AuthState } from '../../../../store/auth'
import { AppState, LoadingPayload } from '../../../../store/app'

export interface CreateAttendanceModalProps {
    auth: AuthState
    app: AppState
    onCloseButtonClicked: () => void
    onClassCreated: () => Promise<void>
    setLoading(payload: LoadingPayload): void
}

export interface CreateAttendanceModalState {
    usuario: string
    clase: string
    calificacion: number
    estado: string
    users: UsersResponse[]
    classes: ClassesResponse[]
}

export default class CreateAttendanceModal extends React.Component<
    CreateAttendanceModalProps,
    CreateAttendanceModalState
> {
    state: CreateAttendanceModalState = {
        usuario: '',
        clase: '',
        calificacion: 0,
        estado: '',
        users: [],
        classes: [],
    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData = async () => {
        try {
            this.props.setLoading({ isLoading: true })
            const classes: ClassesResponse[] = await Backend.getClasses(this.props.auth.token || '')
            const users: UsersResponse[] = await Backend.getUsers(this.props.auth.token || '')
            this.setState({
                classes,
                users,
                clase: classes[0]._id,
                usuario: users[0]._id
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

            await Backend.createAttendance(this.props.auth.token || '', {
                usuario: this.state.usuario,
                clase: this.state.clase,
                calificacion: this.state.calificacion,
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
                        <h1>Crear nueva asistencia</h1>
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
                                <b>Calificación</b>
                            </label>
                            <input
                                value={this.state.calificacion}
                                onChange={(event) =>
                                    this.setState({
                                        calificacion: event.target.value
                                            ? parseInt(event.target.value)
                                            : 0,
                                    })
                                }
                                className="w3-input w3-border w3-margin-bottom"
                                type="number"
                                placeholder="Calificación"
                                name="calificacion"
                                required
                            />

                            <label>
                                <b>Clase</b>
                            </label>
                            <select
                                onChange={(event) =>
                                    this.setState({
                                        clase: event.target.value,
                                    })
                                }
                                className="w3-input w3-border w3-margin-bottom"
                                required
                            >
                                {this.state.classes.map(
                                    (clase: ClassesResponse, index: number) => (
                                        <option key={index} value={clase._id}>
                                            {clase.tema}
                                        </option>
                                    )
                                )}
                            </select>

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
                                    (usuario: UsersResponse, index: number) => (
                                        <option key={index} value={usuario._id}>
                                            {usuario.email}
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
