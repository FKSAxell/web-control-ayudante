import React from 'react'
import Backend, { FacultyResponse } from '../../../../libraries/backend'
import { AuthState } from '../../../../store/auth'
import { AppState, LoadingPayload } from '../../../../store/app'

export interface CreateSubjectModalProps {
    auth: AuthState
    app: AppState
    onCloseButtonClicked: () => void
    onClassCreated: () => Promise<void>
    setLoading(payload: LoadingPayload): void
}

export interface CreateSubjectModalState {
    codigo: string
    nombre: string
    facultad: string
    faculties: FacultyResponse[]
}

export default class CreateSubjectModal extends React.Component<
    CreateSubjectModalProps,
    CreateSubjectModalState
> {
    state: CreateSubjectModalState = {
        codigo: '',
        nombre: '',
        facultad: '',
        faculties: [],
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
            this.setState({ faculties, facultad: faculties[0]._id })
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

            await Backend.createSubject(this.props.auth.token || '', {
                codigo: this.state.codigo,
                nombre: this.state.nombre,
                facultad: this.state.facultad,
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
                        <h1>Crear nueva materia</h1>
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
                                <b>Código</b>
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
                                        faculty: FacultyResponse,
                                        index: number
                                    ) => (
                                        <option key={index} value={faculty._id}>
                                            {faculty.nombre}
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
