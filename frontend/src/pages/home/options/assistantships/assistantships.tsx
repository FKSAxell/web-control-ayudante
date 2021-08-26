import React from 'react'
import { AuthState } from '../../../../store/auth'
import { AppState, LoadingPayload } from '../../../../store/app'
import { History } from 'history'
import Backend, { AssistantshipResponse } from '../../../../libraries/backend'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBook,
    faCheck,
    faPencilAlt,
    faPlus,
    faUser,
} from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import CreateAssistanshipModal from './create-assistantships-modal'
import UpdateAssistantshipsModal from './update-assistantships-modal'
import Role, { Action, RoleValidation } from '../../../../libraries/role-manager/role'

interface AssistanshipsProps {
    app: AppState
    auth: AuthState
    history: History
    setLoading(payload: LoadingPayload): void
}

interface AssistanshipsState {
    assistantships: AssistantshipResponse[]
    showCreateModal: boolean
    assistantshipResponseToUpdate?: AssistantshipResponse
    page: number
    pageSize: number
    roles: RoleValidation[]
}

export default class Assistantships extends React.Component<
    AssistanshipsProps,
    AssistanshipsState
> {
    state: AssistanshipsState = {
        assistantships: [],
        showCreateModal: false,
        assistantshipResponseToUpdate: undefined,
        page: 1,
        pageSize: 5,
        roles: Role.fromUser(this.props.auth.user)
    }

    fetchData = async () => {
        try {
            this.setState({
                showCreateModal: false,
                assistantshipResponseToUpdate: undefined,
            })
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

    deleteAssistanship = async (id: string) => {
        const action: boolean = window.confirm(
            'Realmente desea eleminar la ayudantía'
        )
        if (action === true) {
            this.props.setLoading({ isLoading: true })
            await Backend.deleteAssistanship(this.props.auth.token || '', id)
            await this.fetchData()
        }
    }

    componentDidMount() {
        this.fetchData()
    }

    render(): React.ReactElement {
        return (
            <div className="w3-container">
                {this.state.showCreateModal && (
                    <CreateAssistanshipModal
                        setLoading={this.props.setLoading}
                        app={this.props.app}
                        auth={this.props.auth}
                        onCloseButtonClicked={() =>
                            this.setState({ showCreateModal: false })
                        }
                        onClassCreated={this.fetchData}
                    />
                )}
                {this.state.assistantshipResponseToUpdate !== undefined && (
                    <UpdateAssistantshipsModal
                        assistantship={this.state.assistantshipResponseToUpdate}
                        setLoading={this.props.setLoading}
                        app={this.props.app}
                        auth={this.props.auth}
                        onCloseButtonClicked={() =>
                            this.setState({
                                assistantshipResponseToUpdate: undefined,
                            })
                        }
                        onClassCreated={this.fetchData}
                    />
                )}
                <br />
                <div>
                    <span className="w3-xlarge">Ayudantías </span>
                    {this.state.roles
                        .map((role: RoleValidation) =>
                            role.canCreate(Action.Asistantships)
                        )
                        .filter((can: boolean) => can).length > 0 && (<button
                        onClick={() => this.setState({ showCreateModal: true })}
                        className="w3-button w3-green"
                    >
                        <FontAwesomeIcon icon={faPlus} /> Agregar
                    </button>)}
                </div>
                <br />
                <ul className="w3-ul w3-card-4">
                    {this.state.assistantships
                        .filter(
                            (attendance: AssistantshipResponse) => this.state.roles
                                .map((role: RoleValidation) => role.canReadAll(Action.Asistantships)).filter((can: boolean) => can).length > 0 ||
                                this.props.auth.user?._id ===
                                attendance.usuario._id
                        )
                        .slice(
                            (this.state.page - 1) * this.state.pageSize,
                            this.state.page * this.state.pageSize
                        )
                        .map(
                            (
                                assistantship: AssistantshipResponse,
                                index: number
                            ) => (
                                <li
                                    key={'assistantship' + index}
                                    className="w3-bar"
                                >
                                    <span className="w3-bar-item w3-white w3-xlarge w3-right">
                                        {this.state.roles
                                            .map((role: RoleValidation) =>
                                                role.canUpdate(Action.Asistantships)
                                            )
                                            .filter((can: boolean) => can).length > 0 && (<button
                                            onClick={() =>
                                                this.setState({
                                                    assistantshipResponseToUpdate:
                                                        assistantship,
                                                })
                                            }
                                            className="w3-button w3-blue"
                                        >
                                            <FontAwesomeIcon
                                                icon={faPencilAlt}
                                            />
                                        </button>)}

                                        {this.state.roles
                                            .map((role: RoleValidation) =>
                                                role.canDelete(Action.Asistantships)
                                            )
                                            .filter((can: boolean) => can).length > 0 && (<button
                                            onClick={() =>
                                                this.deleteAssistanship(
                                                    assistantship._id
                                                )
                                            }
                                            className="w3-button w3-red"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>)}
                                    </span>
                                    <div className="">
                                        <span className="w3-large">
                                            <FontAwesomeIcon icon={faBook} />{' '}
                                            {assistantship.materia.nombre}
                                        </span>
                                        <br />
                                        <span className="w3-large">
                                            <FontAwesomeIcon icon={faUser} />{' '}
                                            {assistantship.usuario.email}
                                        </span>
                                        <br />
                                        <span className="w3-large">
                                            <FontAwesomeIcon icon={faCheck} />{' '}
                                            {assistantship.fechaInicio} -{' '}
                                            {assistantship.fechaFin}
                                        </span>
                                    </div>
                                </li>
                            )
                        )}
                </ul>
                <br />
                <div className="w3-center">
                    <div className="w3-bar">
                        {Array.from(
                            {
                                length: Math.ceil(
                                    this.state.assistantships.filter(
                                        (attendance: AssistantshipResponse) => this.state.roles
                                            .map((role: RoleValidation) => role.canReadAll(Action.Asistantships)).filter((can: boolean) => can).length > 0 ||
                                            this.props.auth.user?._id ===
                                            attendance.usuario._id
                                    ).length /
                                        this.state.pageSize
                                ),
                            },
                            (_, index: number) => index + 1
                        ).map((index: number) => (
                            <button
                                onClick={() => this.setState({ page: index })}
                                key={'paginator' + index}
                                className={`w3-button ${
                                    this.state.page === index ? 'w3-green' : ''
                                }`}
                            >
                                {index}
                            </button>
                        ))}
                    </div>
                </div>
                <br />
            </div>
        )
    }
}
