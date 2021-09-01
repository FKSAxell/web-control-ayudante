import React from 'react'
import Backend, {
    AttendanceResponse,
    ClassesResponse
} from '../../../../libraries/backend'
import { AuthState } from '../../../../store/auth'
import { AppState, LoadingPayload } from '../../../../store/app'
import CreateAttendanceModal from '../attendances/create-attendances-modal'
import UpdateAttendanceModal from '../attendances/update-attendances-modal'
import Role, { Action, RoleValidation } from '../../../../libraries/role-manager/role'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faCheck, faPencilAlt, faPlus, faTrash, faUser } from '@fortawesome/free-solid-svg-icons'

export interface SeeAttendancesModalProps {
    auth: AuthState
    app: AppState
    class: ClassesResponse
    onCloseButtonClicked: () => void
    onClassCreated: () => Promise<void>
    setLoading(payload: LoadingPayload): void
}

export interface SeeAttendancesModalState {
    attendances: AttendanceResponse[]
    showCreateModal: boolean
    attendancesResponseToUpdate?: AttendanceResponse
    page: number
    pageSize: number
    roles: RoleValidation[]
}

export default class SeeAttendancesClassModal extends React.Component<
    SeeAttendancesModalProps,
    SeeAttendancesModalState
> {
    state: SeeAttendancesModalState = {
        attendances: [],
        showCreateModal: false,
        attendancesResponseToUpdate: undefined,
        page: 1,
        pageSize: 5,
        roles: Role.fromUser(this.props.auth.user),
    }

    fetchData = async () => {
        try {
            this.setState({
                showCreateModal: false,
                attendancesResponseToUpdate: undefined,
            })
            this.props.setLoading({ isLoading: true })
            this.setState({
                attendances: await Backend.getAttendances(
                    this.props.auth.token || ''
                ),
            })
            this.props.setLoading({ isLoading: false })
        } catch (error) {
            this.props.setLoading({ isLoading: false })
            throw error
        }
    }

    deleteAttendace = async (id: string) => {
        const action: boolean = window.confirm(
            'Realmente desea eleminar la asistencia'
        )
        if (action === true) {
            this.props.setLoading({ isLoading: true })
            await Backend.deleteAttendances(this.props.auth.token || '', id)
            await this.fetchData()
        }
    }

    componentDidMount() {
        this.fetchData()
    }

    render(): React.ReactElement {
        return (
            <div className="w3-modal" style={{ display: 'block' }}>
                <div
                    className="w3-modal-content w3-card-4 w3-animate-zoom"
                    style={{ maxWidth: '600px' }}
                >
                    <div className="w3-center">
                        <h1>Asistencias</h1>
                    </div>
                    <span
                        onClick={this.props.onCloseButtonClicked}
                        className="w3-button w3-xlarge w3-transparent w3-display-topright"
                    >
                        ×
                    </span>

                    <div className="w3-container">
                        {this.state.showCreateModal && (
                            <CreateAttendanceModal
                                setLoading={this.props.setLoading}
                                app={this.props.app}
                                auth={this.props.auth}
                                onCloseButtonClicked={() =>
                                    this.setState({ showCreateModal: false })
                                }
                                onClassCreated={this.fetchData}
                            />
                        )}
                        {this.state.attendancesResponseToUpdate !== undefined && (
                            <UpdateAttendanceModal
                                attendance={this.state.attendancesResponseToUpdate}
                                setLoading={this.props.setLoading}
                                app={this.props.app}
                                auth={this.props.auth}
                                onCloseButtonClicked={() =>
                                    this.setState({
                                        attendancesResponseToUpdate: undefined,
                                    })
                                }
                                onClassCreated={this.fetchData}
                            />
                        )}
                        <br />
                        <div>
                            {this.state.roles
                                .map((role: RoleValidation) =>
                                    role.canCreate(Action.Attendances)
                                )
                                .filter((can: boolean) => can).length > 0 && (
                                <button
                                    onClick={() =>
                                        this.setState({ showCreateModal: true })
                                    }
                                    className="w3-button w3-green"
                                >
                                    <FontAwesomeIcon icon={faPlus} /> Agregar
                                </button>
                            )}
                        </div>
                        <br />
                        <ul className="w3-ul w3-card-4">
                            {this.state.attendances
                                .filter((attendance: AttendanceResponse) => this.props.class._id === attendance.clase._id)
                                .filter(
                                    (attendance: AttendanceResponse) => this.state.roles
                                        .map((role: RoleValidation) => role.canReadAll(Action.Attendances)).filter((can: boolean) => can).length > 0 ||
                                        this.props.auth.user?._id ===
                                        attendance.usuario._id
                                )
                                .slice(
                                    (this.state.page - 1) * this.state.pageSize,
                                    this.state.page * this.state.pageSize
                                )
                                .map(
                                    (attendance: AttendanceResponse, index: number) => (
                                        <li key={'subjects' + index} className="w3-bar">
                                            <span className="w3-bar-item w3-white w3-xlarge w3-right">
                                                {this.state.roles
                                                    .map((role: RoleValidation) =>
                                                        role.canUpdate(
                                                            Action.Attendances
                                                        )
                                                    )
                                                    .filter((can: boolean) => can)
                                                    .length > 0 && (
                                                    <button
                                                        onClick={() =>
                                                            this.setState({
                                                                attendancesResponseToUpdate:
                                                                    attendance,
                                                            })
                                                        }
                                                        className="w3-button w3-blue"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faPencilAlt}
                                                        />
                                                    </button>
                                                )}

                                                {this.state.roles
                                                    .map((role: RoleValidation) =>
                                                        role.canDelete(
                                                            Action.Attendances
                                                        )
                                                    )
                                                    .filter((can: boolean) => can)
                                                    .length > 0 && (
                                                    <button
                                                        onClick={() =>
                                                            this.deleteAttendace(
                                                                attendance._id
                                                            )
                                                        }
                                                        className="w3-button w3-red"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faTrash}
                                                        />
                                                    </button>
                                                )}
                                            </span>
                                            <div className="">
                                                <span className="w3-large">
                                                    <FontAwesomeIcon icon={faBook} />{' '}
                                                    {attendance.clase.tema}
                                                </span>
                                                <br />
                                                <span className="w3-large">
                                                    <FontAwesomeIcon icon={faUser} />{' '}
                                                    {attendance.usuario.email}
                                                </span>
                                                <br />
                                                <span className="w3-large">
                                                    <FontAwesomeIcon icon={faCheck} />{' '}
                                                    {attendance.calificacion}
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
                                            this.state.attendances.filter(
                                                (attendance: AttendanceResponse) => this.state.roles
                                                    .map((role: RoleValidation) => role.canReadAll(Action.Attendances)).filter((can: boolean) => can).length > 0 ||
                                                    this.props.auth.user?._id ===
                                                    attendance.usuario._id
                                            ).length / this.state.pageSize
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
                </div>
            </div>
        )
    }
}
