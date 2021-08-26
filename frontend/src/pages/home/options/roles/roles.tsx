import React from 'react'
import { AuthState } from '../../../../store/auth'
import { AppState, LoadingPayload } from '../../../../store/app'
import { History } from 'history'
import Backend, {
    RolResponse,
} from '../../../../libraries/backend'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faLock,
    faPencilAlt,
    faPlus,
} from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import UpdateRoleModal from './update-roles-modal'
import CreateRoleModal from './create-roles-modal'
import Role, { Action, RoleValidation } from '../../../../libraries/role-manager/role'

interface RolesProps {
    app: AppState
    auth: AuthState
    history: History
    setLoading(payload: LoadingPayload): void
}

interface RolesState {
    roles: RolResponse[]
    showCreateModal: boolean
    roleResponseToUpdate?: RolResponse
    page: number
    pageSize: number
    userRoles: RoleValidation[]
}

export default class Roles extends React.Component<RolesProps, RolesState> {
    state: RolesState = {
        roles: [],
        showCreateModal: false,
        roleResponseToUpdate: undefined,
        page: 1,
        pageSize: 5,
        userRoles: Role.fromUser(this.props.auth.user),
    }

    fetchData = async () => {
        try {
            this.setState({
                showCreateModal: false,
                roleResponseToUpdate: undefined,
            })
            this.props.setLoading({ isLoading: true })
            this.setState({
                roles: await Backend.getRoles(this.props.auth.token || ''),
            })
            this.props.setLoading({ isLoading: false })
        } catch (error) {
            this.props.setLoading({ isLoading: false })
            throw error
        }
    }

    deleteRole = async (id: string) => {
        const action: boolean = window.confirm(
            'Realmente desea eleminar el rol'
        )
        if (action === true) {
            this.props.setLoading({ isLoading: true })
            await Backend.deleteRole(this.props.auth.token || '', id)
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
                    <CreateRoleModal
                        setLoading={this.props.setLoading}
                        app={this.props.app}
                        auth={this.props.auth}
                        onCloseButtonClicked={() =>
                            this.setState({ showCreateModal: false })
                        }
                        onClassCreated={this.fetchData}
                    />
                )}
                {this.state.roleResponseToUpdate !== undefined && (
                    <UpdateRoleModal
                        role={this.state.roleResponseToUpdate}
                        setLoading={this.props.setLoading}
                        app={this.props.app}
                        auth={this.props.auth}
                        onCloseButtonClicked={() =>
                            this.setState({
                                roleResponseToUpdate: undefined,
                            })
                        }
                        onClassCreated={this.fetchData}
                    />
                )}
                <br />
                <div>
                    <span className="w3-xlarge">Roles </span>
                    {this.state.userRoles
                        .map((role: RoleValidation) =>
                            role.canCreate(Action.Roles)
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
                    {this.state.roles
                        .slice(
                            (this.state.page - 1) * this.state.pageSize,
                            this.state.page * this.state.pageSize
                        )
                        .map((role: RolResponse, index: number) => (
                            <li key={'roles' + index} className="w3-bar">
                                <span className="w3-bar-item w3-white w3-xlarge w3-right">
                                    {this.state.userRoles
                                        .map((role: RoleValidation) =>
                                            role.canUpdate(Action.Roles)
                                        )
                                        .filter((can: boolean) => can).length > 0 && (<button
                                        onClick={() =>
                                            this.setState({
                                                roleResponseToUpdate: role,
                                            })
                                        }
                                        className="w3-button w3-blue"
                                    >
                                        <FontAwesomeIcon icon={faPencilAlt} />
                                    </button>)}
                                    {this.state.userRoles
                                        .map((role: RoleValidation) =>
                                            role.canDelete(Action.Roles)
                                        )
                                        .filter((can: boolean) => can).length > 0 && (<button
                                        onClick={() =>
                                            this.deleteRole(role._id)
                                        }
                                        className="w3-button w3-red"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>)}
                                </span>
                                <div className="">
                                    <span className="w3-large">
                                        <FontAwesomeIcon
                                            icon={faLock}
                                        />{' '}
                                        {role.nombre} ({role.codigo})
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
                                    this.state.roles.length /
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
