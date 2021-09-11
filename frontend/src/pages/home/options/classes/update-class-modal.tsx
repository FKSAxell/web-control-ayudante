import React from 'react'
import DatePicker from 'react-date-picker'
import Backend, {
    ClassesResponse,
    LocationResponse,
    SessionResponse,
} from '../../../../libraries/backend'
import { AuthState } from '../../../../store/auth'
import { AppState, LoadingPayload } from '../../../../store/app'
import Utils from '../../../../libraries/utils'

export interface UpdateClassModalProps {
    auth: AuthState
    app: AppState
    onCloseButtonClicked: () => void
    onClassCreated: () => Promise<void>
    setLoading(payload: LoadingPayload): void

    class: ClassesResponse
}

export interface UpdateClassModalState {
    tema: string
    descripcion: string
    enlace: string
    fechaClaseInicio: Date
    fechaClaseFin: Date
    location: string
    session: string
    locations: LocationResponse[]
    sessions: SessionResponse[]
}

export default class UpdateClassModal extends React.Component<
    UpdateClassModalProps,
    UpdateClassModalState
> {
    constructor(props: UpdateClassModalProps) {
        super(props)

        this.state = {
            tema: this.props.class.tema,
            descripcion: this.props.class.descripcion,
            enlace: this.props.class.enlace,
            fechaClaseInicio: new Date(props.class.fechaClaseInicio),
            fechaClaseFin: new Date(props.class.fechaClaseFin),
            location: this.props.class.ubicacion._id,
            session: this.props.class.sesion._id,
            locations: [],
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
                locations: await Backend.getLocations(
                    this.props.auth.token || ''
                ),
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

            await Backend.updateClass(
                this.props.auth.token || '',
                this.props.class._id,
                {
                    enlace: this.state.enlace,
                    descripcion: this.state.descripcion,
                    fechaClaseInicio: this.state.fechaClaseInicio,
                    fechaClaseFin: this.state.fechaClaseFin,
                    tema: this.state.tema,
                    location: this.state.location,
                    session: this.state.session,
                }
            )
            this.props.setLoading({ isLoading: false })
            this.props.onClassCreated()
        } catch (error) {
            this.props.setLoading({ isLoading: false })
            throw error
        }
    }

    dayPositionToString(position: number) {
        switch(position) {
        case 1: return 'Lunes'
        case 2: return 'Martes'
        case 3: return 'Miércoles'
        case 4: return 'Jueves'
        case 5: return 'Viernes'
        case 6: return 'Sábado'
        case 7: return 'Domingo'
        }
    }

    onInitDateChanged = (date: Date) => {
        const session: SessionResponse = this.state.sessions.filter((session: SessionResponse) => session._id === this.state.session)[0]
        if(date.getDay() === session.dia) {
            this.setState({ fechaClaseInicio: date })
        } else {
            alert(`Debe escoger una fecha que sea en el día ${this.dayPositionToString(session.dia)}`)
        }
    }

    onEndDateChanged = (date: Date) => {
        const session: SessionResponse = this.state.sessions.filter((session: SessionResponse) => session._id === this.state.session)[0]
        if(date.getDay() === session.dia) {
            this.setState({ fechaClaseFin: date })
        } else {
            alert(`Debe escoger una fecha que sea en el día ${this.dayPositionToString(session.dia)}`)
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
                        <h1>Actualizar clase</h1>
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
                                <b>Tema</b>
                            </label>
                            <input
                                value={this.state.tema}
                                onChange={(event) =>
                                    this.setState({ tema: event.target.value })
                                }
                                className="w3-input w3-border w3-margin-bottom"
                                type="text"
                                placeholder="Tema"
                                name="tema"
                                required
                            />

                            <label>
                                <b>Descripción</b>
                            </label>
                            <input
                                value={this.state.descripcion}
                                onChange={(event) =>
                                    this.setState({
                                        descripcion: event.target.value,
                                    })
                                }
                                className="w3-input w3-border w3-margin-bottom"
                                type="text"
                                placeholder="Descripción"
                                name="descripcion"
                                required
                            />

                            <label>
                                <b>Enlace</b>
                            </label>
                            <input
                                value={this.state.enlace}
                                onChange={(event) =>
                                    this.setState({
                                        enlace: event.target.value,
                                    })
                                }
                                className="w3-input w3-border w3-margin-bottom"
                                type="text"
                                placeholder="Enlace"
                                name="enlace"
                                required
                            />

                            <label>
                                <b>Ubicacion</b>
                            </label>
                            <select
                                onChange={(event) =>
                                    this.setState({
                                        location: event.target.value,
                                    })
                                }
                                className="w3-input w3-border w3-margin-bottom"
                                required
                            >
                                {this.state.locations.map(
                                    (
                                        location: LocationResponse,
                                        index: number
                                    ) => (
                                        <option
                                            selected={
                                                location._id ===
                                                this.props.class.ubicacion._id
                                            }
                                            key={index}
                                            value={location._id}
                                        >
                                            {location.nombre}
                                        </option>
                                    )
                                )}
                            </select>

                            <label>
                                <b>Sesion</b>
                            </label>
                            <select
                                onChange={(event) =>
                                    this.setState({
                                        session: event.target.value,
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
                                                this.props.class.sesion._id
                                            }
                                            key={index}
                                            value={session._id}
                                        >
                                            {this.dayPositionToString(session.dia)}
                                            {' '}de{' '}
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

                            <label>
                                <b>Fecha inicial de la clase</b>
                            </label>
                            <br />
                            <DatePicker
                                onChange={(date: Date) => this.onInitDateChanged(date)}
                                value={this.state.fechaClaseInicio}
                            />
                            <br />

                            {/*<label>
                                <b>Fecha final de la clase</b>
                            </label>
                            <br />
                            <DatePicker
                                onChange={(date: Date) => this.onEndDateChanged(date)}
                                value={this.state.fechaClaseFin}
                            />*/}
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
