import React from 'react'
import { AuthState } from '../../../../store/auth'
import { AppState, LoadingPayload } from '../../../../store/app'
import { History } from 'history'
import Backend, { SessionResponse } from '../../../../libraries/backend'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCalendar,
    faClock,
    faPencilAlt,
    faPlus,
} from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import Utils from '../../../../libraries/utils'
import CreateSessionModal from './create-session-modal'
import UpdateSessionModal from './update-session-modal'
import Role, { Action, RoleValidation } from '../../../../libraries/role-manager/role'

interface SessionsProps {
    app: AppState
    auth: AuthState
    history: History
    setLoading(payload: LoadingPayload): void
}

interface SessionsState {
    sessions: SessionResponse[]
    showCreateModal: boolean
    sessionResponseToUpdate?: SessionResponse
    page: number
    pageSize: number
    roles: RoleValidation[]
}

export default class Sessions extends React.Component<
    SessionsProps,
    SessionsState
> {
    state: SessionsState = {
        sessions: [],
        showCreateModal: false,
        sessionResponseToUpdate: undefined,
        page: 1,
        pageSize: 5,
        roles: Role.fromUser(this.props.auth.user),
    }

    fetchData = async () => {
        try {
            this.setState({
                showCreateModal: false,
                sessionResponseToUpdate: undefined,
            })
            this.props.setLoading({ isLoading: true })
            this.setState({
                sessions: await Backend.getSession(this.props.auth.token || ''),
            })
            this.props.setLoading({ isLoading: false })
        } catch (error) {
            this.props.setLoading({ isLoading: false })
            throw error
        }
    }

    deleteSession = async (id: string) => {
        const action: boolean = window.confirm(
            'Realmente desea eleminar la sesión'
        )
        if (action === true) {
            this.props.setLoading({ isLoading: true })
            await Backend.deleteSession(this.props.auth.token || '', id)
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
                    <CreateSessionModal
                        setLoading={this.props.setLoading}
                        app={this.props.app}
                        auth={this.props.auth}
                        onCloseButtonClicked={() =>
                            this.setState({ showCreateModal: false })
                        }
                        onClassCreated={this.fetchData}
                    />
                )}
                {this.state.sessionResponseToUpdate !== undefined && (
                    <UpdateSessionModal
                        session={this.state.sessionResponseToUpdate}
                        setLoading={this.props.setLoading}
                        app={this.props.app}
                        auth={this.props.auth}
                        onCloseButtonClicked={() =>
                            this.setState({
                                sessionResponseToUpdate: undefined,
                            })
                        }
                        onClassCreated={this.fetchData}
                    />
                )}
                <br />
                <div>
                    <span className="w3-xlarge">Sessions </span>
                    {this.state.roles
                        .map((role: RoleValidation) =>
                            role.canCreate(Action.Sessions)
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
                    {this.state.sessions
                        .slice(
                            (this.state.page - 1) * this.state.pageSize,
                            this.state.page * this.state.pageSize
                        )
                        .map((session: SessionResponse, index: number) => (
                            <li key={'session' + index} className="w3-bar">
                                <span className="w3-bar-item w3-white w3-xlarge w3-right">
                                    {this.state.roles
                                        .map((role: RoleValidation) =>
                                            role.canUpdate(Action.Sessions)
                                        )
                                        .filter((can: boolean) => can).length > 0 && (<button
                                        onClick={() =>
                                            this.setState({
                                                sessionResponseToUpdate:
                                                    session,
                                            })
                                        }
                                        className="w3-button w3-blue"
                                    >
                                        <FontAwesomeIcon icon={faPencilAlt} />
                                    </button>)}
                                    {this.state.roles
                                        .map((role: RoleValidation) =>
                                            role.canDelete(Action.Sessions)
                                        )
                                        .filter((can: boolean) => can).length > 0 && (<button
                                        onClick={() =>
                                            this.deleteSession(session._id)
                                        }
                                        className="w3-button w3-red"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>)}
                                </span>
                                <div className="">
                                    <span className="w3-large">
                                        <FontAwesomeIcon icon={faPlus} />{' '}
                                        {
                                            session.ayudantia.fechaFin
                                                .toString()
                                                .split('.')[0]
                                                .split('T')[0]
                                        }{' '}
                                        -{' '}
                                        {
                                            session.ayudantia.fechaInicio
                                                .toString()
                                                .split('.')[0]
                                                .split('T')[0]
                                        }
                                    </span>
                                    <br />
                                    <span>
                                        <FontAwesomeIcon icon={faClock} />{' '}
                                        {Utils.twoDigits(session.horaInicio)}:
                                        {Utils.twoDigits(session.minutoInicio)}{' '}
                                        - {Utils.twoDigits(session.horaFin)}:
                                        {Utils.twoDigits(session.minutoFin)}
                                    </span>
                                    <br />
                                    <span>
                                        <FontAwesomeIcon icon={faCalendar} />{' '}
                                        {session.dia}
                                    </span>
                                </div>
                            </li>
                        ))}
                </ul>
                <br />
                <div className="w3-center">
                    <div className="w3-bar">
                        {Array.from(
                            {
                                length: Math.ceil(
                                    this.state.sessions.length /
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
