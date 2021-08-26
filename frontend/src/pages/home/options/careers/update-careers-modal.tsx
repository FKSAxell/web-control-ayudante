import React from 'react'
import Backend, {
    CareerResponse,
    FacultyResponse,
} from '../../../../libraries/backend'
import { AuthState } from '../../../../store/auth'
import { AppState, LoadingPayload } from '../../../../store/app'

export interface UpdateCareerModalProps {
    auth: AuthState
    app: AppState
    onCloseButtonClicked: () => void
    onClassCreated: () => Promise<void>
    setLoading(payload: LoadingPayload): void

    career: CareerResponse
}

export interface UpdateCareerModalState {
    facultad: string
    nombre: string
    faculties: FacultyResponse[]
}

export default class UpdateCareerModal extends React.Component<
    UpdateCareerModalProps,
    UpdateCareerModalState
> {
    constructor(props: UpdateCareerModalProps) {
        super(props)

        this.state = {
            nombre: this.props.career.nombre,
            facultad: this.props.career.facultad._id,
            faculties: [],
        }
    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData = async () => {
        try {
            this.props.setLoading({ isLoading: true })
            const faculties: FacultyResponse[] = await Backend.getFaculties(
                this.props.auth.token || ''
            )
            this.setState({ faculties })
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

            await Backend.updateCareer(
                this.props.auth.token || '',
                this.props.career._id,
                {
                    facultad: this.state.facultad,
                    nombre: this.state.nombre,
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
                        <h1>Actualizar carrera</h1>
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
                                <b>Nombre</b>
                            </label>
                            <input
                                value={this.state.nombre}
                                onChange={(event) =>
                                    this.setState({
                                        nombre: event.target.value,
                                    })
                                }
                                className="w3-input w3-border w3-margin-bottom"
                                type="text"
                                placeholder="Nombre"
                                name="nombre"
                                required
                            />

                            <label>
                                <b>Facultad</b>
                            </label>
                            <select
                                onChange={(event) =>
                                    this.setState({
                                        facultad: event.target.value,
                                    })
                                }
                                className="w3-input w3-border w3-margin-bottom"
                                required
                            >
                                {this.state.faculties.map(
                                    (
                                        facultad: FacultyResponse,
                                        index: number
                                    ) => (
                                        <option
                                            selected={
                                                facultad._id ===
                                                this.props.career.facultad._id
                                            }
                                            key={index}
                                            value={facultad._id}
                                        >
                                            {facultad.nombre}
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
