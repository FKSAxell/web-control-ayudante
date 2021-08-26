import React from 'react'
import Backend, {
    FacultyResponse,
    SubjectResponse,
} from '../../../../libraries/backend'
import { AuthState } from '../../../../store/auth'
import { AppState, LoadingPayload } from '../../../../store/app'

export interface UpdateSubjectModalProps {
    auth: AuthState
    app: AppState
    onCloseButtonClicked: () => void
    onClassCreated: () => Promise<void>
    setLoading(payload: LoadingPayload): void

    subject: SubjectResponse
}

export interface UpdateSubjectModalState {
    codigo: string
    nombre: string
    facultad: string
    faculties: FacultyResponse[]
}

export default class UpdateSubjectModal extends React.Component<
    UpdateSubjectModalProps,
    UpdateSubjectModalState
> {
    constructor(props: UpdateSubjectModalProps) {
        super(props)

        this.state = {
            codigo: this.props.subject.codigo,
            nombre: this.props.subject.nombre,
            facultad: this.props.subject.facultad._id,
            faculties: [],
        }
    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData = async () => {
        try {
            this.props.setLoading({ isLoading: true })
            this.setState({
                faculties: await Backend.getFaculties(
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

            await Backend.updateSubject(
                this.props.auth.token || '',
                this.props.subject._id,
                {
                    codigo: this.state.codigo,
                    nombre: this.state.nombre,
                    facultad: this.state.facultad,
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
                        <h1>Actualizar materia</h1>
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
                                value={this.state.codigo}
                                onChange={(event) =>
                                    this.setState({
                                        codigo: event.target.value,
                                    })
                                }
                                className="w3-input w3-border w3-margin-bottom"
                                type="text"
                                placeholder="Código"
                                name="codigo"
                                required
                            />

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
                                                this.props.subject.facultad._id
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
