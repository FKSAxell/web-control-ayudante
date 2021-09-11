import React from 'react'
import Backend, {AssistantshipResponse, SessionResponse} from '../../../../libraries/backend'
import { AuthState } from '../../../../store/auth'
import { AppState, LoadingPayload } from '../../../../store/app'
import Role, {Action, RoleValidation} from '../../../../libraries/role-manager/role'

export interface CreateSessionModalProps {
    auth: AuthState
    app: AppState
    onCloseButtonClicked: () => void
    onClassCreated: () => Promise<void>
    setLoading(payload: LoadingPayload): void
}

export interface CreateSessionModalState {
    ayudantia: string
    dia: number
    horaFin: number
    horaInicio: number
    minutoFin: number
    minutoInicio: number
    assistantships: AssistantshipResponse[]
    roles: RoleValidation[]
}

export default class CreateSessionModal extends React.Component<
    CreateSessionModalProps,
    CreateSessionModalState
> {
    state: CreateSessionModalState = {
        ayudantia: '',
        dia: 0,
        horaFin: 0,
        horaInicio: 0,
        minutoFin: 0,
        minutoInicio: 0,
        assistantships: [],
        roles: Role.fromUser(this.props.auth.user),
    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData = async () => {
        try {
            this.props.setLoading({ isLoading: true })
            const assistantships: AssistantshipResponse[] =
                await Backend.getAssistanship(this.props.auth.token || '')
            this.setState({
                assistantships,
                ayudantia: assistantships[0]._id,
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

            await Backend.createSession(this.props.auth.token || '', {
                ayudantia: this.state.ayudantia,
                dia: this.state.dia,
                horaFin: this.state.horaFin,
                horaInicio: this.state.horaInicio,
                minutoInicio: this.state.minutoInicio,
                minutoFin: this.state.minutoFin,
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
                        <h1>Crear nueva sesión</h1>
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
                                <b>Ayudantía</b>
                            </label>
                            <select
                                onChange={(event) =>
                                    this.setState({
                                        ayudantia: event.target.value,
                                    })
                                }
                                className="w3-input w3-border w3-margin-bottom"
                                required
                            >
                                {this.state.assistantships
                                    .filter(
                                        (assistanship: AssistantshipResponse) => this.state.roles
                                            .map((role: RoleValidation) => role.canReadAll(Action.Asistantships)).filter((can: boolean) => can).length > 0 ||
                                            this.props.auth.user?._id ===
                                            assistanship.usuario._id
                                    )
                                    .map(
                                        (
                                            assistantship: AssistantshipResponse,
                                            index: number
                                        ) => (
                                            <option
                                                key={index}
                                                value={assistantship._id}
                                            >
                                                {
                                                    assistantship.fechaFin
                                                        .toString()
                                                        .split('.')[0]
                                                        .split('T')[0]
                                                }{' '}
                                                -{' '}
                                                {
                                                    assistantship.fechaInicio
                                                        .toString()
                                                        .split('.')[0]
                                                        .split('T')[0]
                                                }
                                                -{' '}
                                                {assistantship.materia.nombre}
                                                -{' '}
                                                {assistantship.usuario.nombre}
                                            </option>
                                        )
                                    )}
                            </select>
                            <br />

                            <label>
                                <b>Día</b>
                            </label>
                            <br />
                            <input
                                value={this.state.dia}
                                onChange={(event) =>
                                    this.setState({
                                        dia: parseInt(event.target.value),
                                    })
                                }
                                className="w3-input w3-border w3-margin-bottom"
                                type="text"
                                placeholder="Día"
                                name="dia"
                                required
                            />
                            <br />

                            <label>
                                <b>Hora inicio</b>
                            </label>
                            <br />
                            <input
                                value={this.state.horaInicio}
                                onChange={(event) =>
                                    this.setState({
                                        horaInicio: parseInt(
                                            event.target.value
                                        ),
                                    })
                                }
                                className="w3-input w3-border w3-margin-bottom"
                                type="text"
                                placeholder="Hora inicio"
                                name="horaInicio"
                                required
                            />
                            <br />

                            <label>
                                <b>Minuto inicio</b>
                            </label>
                            <br />
                            <input
                                value={this.state.minutoInicio}
                                onChange={(event) =>
                                    this.setState({
                                        minutoInicio: parseInt(
                                            event.target.value
                                        ),
                                    })
                                }
                                className="w3-input w3-border w3-margin-bottom"
                                type="text"
                                placeholder="Minuto inicio"
                                name="minutoInicio"
                                required
                            />
                            <br />

                            <label>
                                <b>Hora fin</b>
                            </label>
                            <br />
                            <input
                                value={this.state.horaFin}
                                onChange={(event) =>
                                    this.setState({
                                        horaFin: parseInt(event.target.value),
                                    })
                                }
                                className="w3-input w3-border w3-margin-bottom"
                                type="text"
                                placeholder="Hora fin"
                                name="horaFin"
                                required
                            />
                            <br />

                            <label>
                                <b>Minuto fin</b>
                            </label>
                            <br />
                            <input
                                value={this.state.minutoFin}
                                onChange={(event) =>
                                    this.setState({
                                        minutoFin: parseInt(event.target.value),
                                    })
                                }
                                className="w3-input w3-border w3-margin-bottom"
                                type="text"
                                placeholder="Minuto fin"
                                name="minutoFin"
                                required
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
