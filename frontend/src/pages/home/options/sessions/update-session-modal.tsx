import React from 'react'
import Backend, {
    AssistantshipResponse,
    SessionResponse,
} from '../../../../libraries/backend'
import { AuthState } from '../../../../store/auth'
import { AppState, LoadingPayload } from '../../../../store/app'

export interface UpdateSessionModalProps {
    auth: AuthState
    app: AppState
    onCloseButtonClicked: () => void
    onClassCreated: () => Promise<void>
    setLoading(payload: LoadingPayload): void

    session: SessionResponse
}

export interface UpdateSessionModalState {
    ayudantia: string
    dia: number
    horaFin: number
    horaInicio: number
    minutoFin: number
    minutoInicio: number
    assistantships: AssistantshipResponse[]
}

export default class UpdateSessionModal extends React.Component<
    UpdateSessionModalProps,
    UpdateSessionModalState
> {
    constructor(props: UpdateSessionModalProps) {
        super(props)

        this.state = {
            ayudantia: this.props.session.ayudantia._id,
            dia: this.props.session.dia,
            horaFin: this.props.session.horaFin,
            horaInicio: this.props.session.horaInicio,
            minutoInicio: this.props.session.minutoInicio,
            minutoFin: this.props.session.minutoFin,
            assistantships: [],
        }
    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData = async () => {
        try {
            this.props.setLoading({ isLoading: true })
            this.setState({
                assistantships: await Backend.getAssistanship(
                    this.props.auth.token || ''
                ),
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

            await Backend.updateSession(
                this.props.auth.token || '',
                this.props.session._id,
                {
                    ayudantia: this.state.ayudantia,
                    dia: this.state.dia,
                    horaInicio: this.state.horaInicio,
                    minutoInicio: this.state.minutoInicio,
                    horaFin: this.state.horaFin,
                    minutoFin: this.state.minutoFin,
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
                        <h1>Actualizar sesión</h1>
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
                                {this.state.assistantships.map(
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
                                Actualizar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
