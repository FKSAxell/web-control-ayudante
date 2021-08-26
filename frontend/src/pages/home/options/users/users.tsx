import React from 'react'
import { AuthState } from '../../../../store/auth'
import { AppState, LoadingPayload } from '../../../../store/app'
import { History } from 'history'
import Backend, {
    RolResponse,
    UsersResponse,
} from '../../../../libraries/backend'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faEnvelope,
    faPencilAlt,
    faPlus,
} from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import CreateUserModal from './create-users-modal'
import UpdateUserModal from './update-users-modal'
import Avatar from '../../../../assets/images/img_avatar2.png'
import Role, { Action, RoleValidation } from '../../../../libraries/role-manager/role'

interface UsersProps {
    app: AppState
    auth: AuthState
    history: History
    setLoading(payload: LoadingPayload): void
}

interface UsersState {
    users: UsersResponse[]
    showCreateModal: boolean
    userResponseToUpdate?: UsersResponse
    page: number
    pageSize: number
    roles: RoleValidation[]
}

export default class Users extends React.Component<UsersProps, UsersState> {
    state: UsersState = {
        users: [],
        showCreateModal: false,
        userResponseToUpdate: undefined,
        page: 1,
        pageSize: 5,
        roles: Role.fromUser(this.props.auth.user),
    }

    fetchData = async () => {
        try {
            this.setState({
                showCreateModal: false,
                userResponseToUpdate: undefined,
            })
            this.props.setLoading({ isLoading: true })
            this.setState({
                users: await Backend.getUsers(this.props.auth.token || ''),
            })
            this.props.setLoading({ isLoading: false })
        } catch (error) {
            this.props.setLoading({ isLoading: false })
            throw error
        }
    }

    deleteUser = async (id: string) => {
        const action: boolean = window.confirm(
            'Realmente desea eleminar al usuario'
        )
        if (action === true) {
            this.props.setLoading({ isLoading: true })
            await Backend.deleteUser(this.props.auth.token || '', id)
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
                    <CreateUserModal
                        setLoading={this.props.setLoading}
                        app={this.props.app}
                        auth={this.props.auth}
                        onCloseButtonClicked={() =>
                            this.setState({ showCreateModal: false })
                        }
                        onClassCreated={this.fetchData}
                    />
                )}
                {this.state.userResponseToUpdate !== undefined && (
                    <UpdateUserModal
                        user={this.state.userResponseToUpdate}
                        setLoading={this.props.setLoading}
                        app={this.props.app}
                        auth={this.props.auth}
                        onCloseButtonClicked={() =>
                            this.setState({ userResponseToUpdate: undefined })
                        }
                        onClassCreated={this.fetchData}
                    />
                )}
                <br />
                <div>
                    <span className="w3-xlarge">Usuarios </span>
                    {this.state.roles
                        .map((role: RoleValidation) =>
                            role.canRead(Action.Users)
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
                    {this.state.users
                        .slice(
                            (this.state.page - 1) * this.state.pageSize,
                            this.state.page * this.state.pageSize
                        )
                        .map((userResponse: UsersResponse, index: number) => (
                            <li key={'user' + index} className="w3-bar">
                                <span className="w3-bar-item w3-white w3-xlarge w3-right">
                                    {this.state.roles
                                        .map((role: RoleValidation) =>
                                            role.canUpdate(Action.Users)
                                        )
                                        .filter((can: boolean) => can).length > 0 && (<button
                                        onClick={() =>
                                            this.setState({
                                                userResponseToUpdate:
                                                    userResponse,
                                            })
                                        }
                                        className="w3-button w3-blue"
                                    >
                                        <FontAwesomeIcon icon={faPencilAlt} />
                                    </button>)}
                                    {this.state.roles
                                        .map((role: RoleValidation) =>
                                            role.canDelete(Action.Users)
                                        )
                                        .filter((can: boolean) => can).length > 0 && (<button
                                        onClick={() =>
                                            this.deleteUser(userResponse._id)
                                        }
                                        className="w3-button w3-red"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>)}
                                </span>
                                <div className="">
                                    <img
                                        src={Avatar}
                                        className="w3-bar-item w3-circle w3-hide-small"
                                        style={{ width: '100px' }}
                                    />
                                    <span className="w3-large">
                                        {userResponse.nombre}
                                    </span>
                                    <br />
                                    <span>
                                        <FontAwesomeIcon icon={faEnvelope} />{' '}
                                        {userResponse.email}
                                    </span>
                                    <br />
                                    <span>
                                        {userResponse.rol.map(
                                            (
                                                rol: RolResponse,
                                                roleIndex: number
                                            ) => (
                                                <span key={roleIndex}
                                                    className="w3-tag w3-blue"
                                                >
                                                    {rol.nombre}
                                                </span>
                                            )
                                        )}
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
                                    this.state.users.length /
                                        this.state.pageSize
                                ),
                            },
                            (_, index: number) => index + 1
                        ).map((index: number) => (
                            <button
                                onClick={() => this.setState({ page: index })}
                                key={'user-paginator' + index}
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
