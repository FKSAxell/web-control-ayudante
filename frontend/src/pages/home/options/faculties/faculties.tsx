import React from 'react'
import { AuthState } from '../../../../store/auth'
import { AppState, LoadingPayload } from '../../../../store/app'
import { History } from 'history'
import Backend, { FacultyResponse } from '../../../../libraries/backend'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faPencilAlt,
    faPlus,
    faUniversity,
} from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import CreateFacultyModal from './create-faculty-modal'
import UpdateFacultyModal from './update-faculty-modal'
import Role, { Action, RoleValidation } from '../../../../libraries/role-manager/role'

interface FacultiesProps {
    app: AppState
    auth: AuthState
    history: History
    setLoading(payload: LoadingPayload): void
}

interface FacultiesState {
    faculties: FacultyResponse[]
    showCreateModal: boolean
    facultyToUpdate?: FacultyResponse
    page: number
    pageSize: number
    roles: RoleValidation[]
}

export default class Faculties extends React.Component<
    FacultiesProps,
    FacultiesState
> {
    state: FacultiesState = {
        faculties: [],
        showCreateModal: false,
        facultyToUpdate: undefined,
        page: 1,
        pageSize: 5,
        roles: Role.fromUser(this.props.auth.user),
    }

    fetchData = async () => {
        try {
            this.setState({
                showCreateModal: false,
                facultyToUpdate: undefined,
            })
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

    deleteFaculty = async (id: string) => {
        const action: boolean = window.confirm(
            'Realmente desea eleminar la facultad'
        )
        if (action === true) {
            this.props.setLoading({ isLoading: true })
            await Backend.deleteFaculty(this.props.auth.token || '', id)
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
                    <CreateFacultyModal
                        setLoading={this.props.setLoading}
                        app={this.props.app}
                        auth={this.props.auth}
                        onCloseButtonClicked={() =>
                            this.setState({ showCreateModal: false })
                        }
                        onClassCreated={this.fetchData}
                    />
                )}
                {this.state.facultyToUpdate !== undefined && (
                    <UpdateFacultyModal
                        location={this.state.facultyToUpdate}
                        setLoading={this.props.setLoading}
                        app={this.props.app}
                        auth={this.props.auth}
                        onCloseButtonClicked={() =>
                            this.setState({
                                facultyToUpdate: undefined,
                            })
                        }
                        onClassCreated={this.fetchData}
                    />
                )}
                <br />
                <div>
                    <span className="w3-xlarge">Facultades </span>
                    {this.state.roles
                        .map((role: RoleValidation) =>
                            role.canCreate(Action.Faculties)
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
                    {this.state.faculties
                        .slice(
                            (this.state.page - 1) * this.state.pageSize,
                            this.state.page * this.state.pageSize
                        )
                        .map((faculty: FacultyResponse, index: number) => (
                            <li key={'location' + index} className="w3-bar">
                                <span className="w3-bar-item w3-white w3-xlarge w3-right">
                                    {this.state.roles
                                        .map((role: RoleValidation) =>
                                            role.canUpdate(Action.Faculties)
                                        )
                                        .filter((can: boolean) => can).length > 0 && (<button
                                        onClick={() =>
                                            this.setState({
                                                facultyToUpdate:
                                                faculty,
                                            })
                                        }
                                        className="w3-button w3-blue"
                                    >
                                        <FontAwesomeIcon icon={faPencilAlt} />
                                    </button>)}
                                    {this.state.roles
                                        .map((role: RoleValidation) =>
                                            role.canDelete(Action.Faculties)
                                        )
                                        .filter((can: boolean) => can).length > 0 && (<button
                                        onClick={() =>
                                            this.deleteFaculty(faculty._id)
                                        }
                                        className="w3-button w3-red"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>)}
                                </span>
                                <div className="">
                                    <span className="w3-large">
                                        <FontAwesomeIcon
                                            icon={faUniversity}
                                        />{' '}
                                        {faculty.nombre} ({faculty.codigo})
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
                                    this.state.faculties.length /
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
