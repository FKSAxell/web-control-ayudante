import React from 'react'
import Backend, {
    RolResponse,
} from '../../../../libraries/backend'
import { AuthState } from '../../../../store/auth'
import { AppState, LoadingPayload } from '../../../../store/app'

export interface UpdateRoleModalProps {
    auth: AuthState
    app: AppState
    onCloseButtonClicked: () => void
    onClassCreated: () => Promise<void>
    setLoading(payload: LoadingPayload): void

    role: RolResponse
}

export interface UpdateRoleModalState {
    codigo: string
    nombre: string
}

export default class UpdateRoleModal extends React.Component<
    UpdateRoleModalProps,
    UpdateRoleModalState
> {
    state: UpdateRoleModalState = {
        codigo: this.props.role.codigo,
        nombre: this.props.role.nombre,
    }

    onCreateButtonClicked = async (event: React.FormEvent) => {
        event.preventDefault()

        try {
            this.props.setLoading({ isLoading: true })

            await Backend.updateRole(
                this.props.auth.token || '',
                this.props.role._id,
                {
                    codigo: this.state.codigo,
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
                        <h1>Actualizar rol</h1>
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
                                <b>Codigo</b>
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
