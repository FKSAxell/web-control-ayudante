import React from 'react'
import DatePicker from 'react-date-picker'
import Backend, {
    AssistantshipResponse,
    LocationResponse,
    SessionResponse,
} from '../../../../libraries/backend'
import { AuthState } from '../../../../store/auth'
import { AppState, LoadingPayload } from '../../../../store/app'
import Utils from '../../../../libraries/utils'
import Role, {Action, RoleValidation} from '../../../../libraries/role-manager/role'

export interface CreateClassModalProps {
    auth: AuthState
    app: AppState
    onCloseButtonClicked: () => void
    onClassCreated: () => Promise<void>
    setLoading(payload: LoadingPayload): void
}

export interface CreateClassModalState {
    tema: string
    descripcion: string
    enlace: string
    fechaClaseInicio: Date
    fechaClaseFin: Date
    location: string
    session: string
    locations: LocationResponse[]
    sessions: SessionResponse[]
    roles: RoleValidation[]
}

export default class CreateClassModal extends React.Component<
    CreateClassModalProps,
    CreateClassModalState
> {
    state: CreateClassModalState = {
        tema: '',
        descripcion: '',
        enlace: '',
        fechaClaseInicio: new Date(),
        fechaClaseFin: new Date(),
        location: '',
        session: '',
        locations: [],
        sessions: [],
        roles: Role.fromUser(this.props.auth.user),
    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData = async () => {
        try {
            this.props.setLoading({ isLoading: true })
            const locations: LocationResponse[] = await Backend.getLocations(
                this.props.auth.token || ''
            )
            const sessions: SessionResponse[] = await Backend.getSession(this.props.auth.token || '')
            this.setState({
                locations,
                sessions,
                location: locations[0]._id,
                session: sessions[0]._id
            })
            this.props.setLoading({ isLoading: false })
        } catch (error) {
            this.props.setLoading({ isLoading: false })
            throw error
        }
    }

    onCreateButtonClicked = async (event: React.FormEvent) => {
        event.preventDefault()

        const session: SessionResponse = this.state.sessions.filter((session: SessionResponse) => session._id === this.state.session)[0]
        const finicioEdit = this.state.fechaClaseInicio
        const ffinEdit = this.state.fechaClaseInicio
        finicioEdit.setHours(session.horaInicio,session.minutoInicio)
        ffinEdit.setHours(session.horaFin,session.minutoFin)
        try {
            this.props.setLoading({ isLoading: true })

            await Backend.createClass(this.props.auth.token || '', {
                enlace: this.state.enlace,
                descripcion: this.state.descripcion,
                fechaClaseInicio: finicioEdit,
                fechaClaseFin: ffinEdit,
                tema: this.state.tema,
                location: this.state.location,
                session: this.state.session,
            })
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
        case 3: return 'Mi??rcoles'
        case 4: return 'Jueves'
        case 5: return 'Viernes'
        case 6: return 'S??bado'
        case 7: return 'Domingo'
        }
    }

    onInitDateChanged = (date: Date) => {
        const session: SessionResponse = this.state.sessions.filter((session: SessionResponse) => session._id === this.state.session)[0]
        if(date.getDay() === session.dia) {
            this.setState({ fechaClaseInicio: date })
        } else {
            alert(`Debe escoger una fecha que sea en el d??a ${this.dayPositionToString(session.dia)}`)
        }
    }

    onEndDateChanged = (date: Date) => {
        const session: SessionResponse = this.state.sessions.filter((session: SessionResponse) => session._id === this.state.session)[0]
        if(date.getDay() === session.dia) {
            this.setState({ fechaClaseFin: date })
        } else {
            alert(`Debe escoger una fecha que sea en el d??a ${this.dayPositionToString(session.dia)}`)
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
                        <h1>Crear nueva clase</h1>
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
                                <b>Descripci??n</b>
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
                                placeholder="Descripci??n"
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
                                {this.state.sessions
                                    .filter(
                                        (sesion: SessionResponse) => this.state.roles
                                            .map((role: RoleValidation) => role.canReadAll(Action.Asistantships)).filter((can: boolean) => can).length > 0 ||
                                                this.props.auth.user?._id ===
                                                sesion.ayudantia.usuario._id
                                    )
                                    .map(
                                        (
                                            session: SessionResponse,
                                            index: number
                                        ) => (
                                            <option key={index} value={session._id}>
                                                {this.dayPositionToString(session.dia)}
                                                {' '}de{' '}
                                                {Utils.twoDigits(
                                                    session.horaInicio
                                                )}
                                                :
                                                {Utils.twoDigits(
                                                    session.minutoInicio
                                                )} a{' '}
                                                {Utils.twoDigits(session.horaFin)}
                                                :
                                                {Utils.twoDigits(session.minutoFin)}{' '}
                                                {' '}-{' '}
                                                {session.ayudantia.materia.nombre}{' '}
                                                {' '}-{' '}
                                                {session.ayudantia.usuario.nombre}{' '}
                                            </option>
                                        )
                                    )}
                            </select>

                            <label>
                                <b>Fecha inicio de la clase</b>
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
