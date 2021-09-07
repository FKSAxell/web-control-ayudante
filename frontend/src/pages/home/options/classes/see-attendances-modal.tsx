import React from 'react'
import Backend, {
    AttendanceResponse,
    ClassesResponse,
    FavoriteResponse
} from '../../../../libraries/backend'
import { AuthState } from '../../../../store/auth'
import { AppState, LoadingPayload } from '../../../../store/app'
import CreateAttendanceModal from '../attendances/create-attendances-modal'
import UpdateAttendanceModal from '../attendances/update-attendances-modal'
import Role, { Action, RoleValidation } from '../../../../libraries/role-manager/role'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faCheck, faChessKing, faPencilAlt, faPlus, faTrash, faUser } from '@fortawesome/free-solid-svg-icons'

export interface SeeAttendancesModalProps {
    auth: AuthState
    app: AppState
    class: ClassesResponse
    onCloseButtonClicked: () => void
    onClassCreated: () => Promise<void>
    setLoading(payload: LoadingPayload): void
}

export interface SeeAttendancesModalState {
    favorites: FavoriteResponse[]
    showCreateModal: boolean
    favoriteResponseToUpdate?: FavoriteResponse
    page: number
    pageSize: number
    roles: RoleValidation[]
}

export default class SeeAttendancesClassModal extends React.Component<
    SeeAttendancesModalProps,
    SeeAttendancesModalState
    > {
    state: SeeAttendancesModalState = {
        favorites: [],
        showCreateModal: false,
        favoriteResponseToUpdate: undefined,
        page: 1,
        pageSize: 5,
        roles: Role.fromUser(this.props.auth.user),
    }

    fetchData = async () => {
        try {
            this.setState({
                showCreateModal: false,
                favoriteResponseToUpdate: undefined,
            })
            this.props.setLoading({ isLoading: true })
            this.setState({
                favorites: await Backend.getFavorite(
                    this.props.auth.token || '', this.props.class._id
                ),
            })
            this.props.setLoading({ isLoading: false })
        } catch (error) {
            this.props.setLoading({ isLoading: false })
            throw error
        }
    }

    addAttendance = async (
        classId: string,
        userId: string
    ) => {
        this.props.setLoading({ isLoading: true })
        await Backend.createAttendance(
            this.props.auth.token || '',
            {
                calificacion: 5,
                clase: classId,
                usuario: userId
            }
        )
        await this.fetchData()
    }

    deleteAttendance = async (
        attendanceId: string
    ) => {
        const action: boolean = window.confirm(
            'Realmente desea borrar la asistencia?'
        )
        if (action === true) {
            try {
                this.props.setLoading({ isLoading: true })
                await Backend.deleteAttendances(
                    this.props.auth.token || '', attendanceId
                )
                await this.fetchData()
            } catch(error) {
                console.error(error)
                alert('Error borrando asistencia')
                this.props.setLoading({ isLoading: false })
            }
        }
    }

    deleteFavorite = async (id: string) => {
        const action: boolean = window.confirm(
            'Realmente desea eleminar el favorito'
        )
        if (action === true) {
            this.props.setLoading({ isLoading: true })
            await Backend.deleteFavorite(this.props.auth.token || '', id)
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
                        {this.state.favoriteResponseToUpdate !== undefined && (
                            /*<UpdateAttendanceModal
                                favorite={this.state.favoriteResponseToUpdate}
                                setLoading={this.props.setLoading}
                                app={this.props.app}
                                auth={this.props.auth}
                                onCloseButtonClicked={() =>
                                    this.setState({
                                        favoriteResponseToUpdate: undefined,
                                    })
                                }
                                onClassCreated={this.fetchData}
                            />*/
                            <div>
                                create
                            </div>
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
                            {this.state.favorites

                                .slice(
                                    (this.state.page - 1) * this.state.pageSize,
                                    this.state.page * this.state.pageSize
                                )
                                .map(
                                    (favorite: FavoriteResponse, index: number) => (
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
                                                                favoriteResponseToUpdate:
                                                                favorite,
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
                                                            this.deleteFavorite(
                                                                favorite._id
                                                            )
                                                        }
                                                        className="w3-button w3-red"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faTrash}
                                                        />
                                                    </button>
                                                )}

                                                {favorite.attendances.length === 0 && <button
                                                    onClick={() =>
                                                        this.addAttendance(
                                                            this.props.class._id,
                                                            favorite.usuario._id
                                                        )
                                                    }
                                                    className="w3-button w3-blue"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faCheck}
                                                    />
                                                </button>}

                                                {favorite.attendances.length > 0 && <button
                                                    onClick={() =>
                                                        this.deleteAttendance(
                                                            favorite.attendances[0]._id
                                                        )
                                                    }
                                                    className="w3-button w3-red"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                    />
                                                </button>}
                                            </span>
                                            <div>
                                                <br />
                                                <span className="w3-large">
                                                    <FontAwesomeIcon icon={faBook} />{' '}
                                                    {favorite.sesion.ayudantia.materia.nombre}
                                                </span>
                                                <br />
                                                <span className="w3-large">
                                                    <FontAwesomeIcon icon={faUser} />{' '}
                                                    {favorite.usuario.email}
                                                </span>
                                                <br />
                                                {favorite.attendances.length > 0 && <span className="w3-large">
                                                    <FontAwesomeIcon icon={faCheck} />{' '}
                                                    {favorite.attendances[0].calificacion}
                                                </span>}
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
                                            this.state.favorites.filter(
                                                (favorite: FavoriteResponse) => this.state.roles
                                                    .map((role: RoleValidation) => role.canReadAll(Action.Attendances)).filter((can: boolean) => can).length > 0/* ||
                                                    this.props.auth.user?._id ===
                                                    attendance.usuario._id*/
                                            ).filter((favorite: FavoriteResponse) => favorite.attendances === undefined || favorite.attendances === null || favorite.attendances.length === 0 ? false : this.props.class._id === favorite.attendances[0].clase._id)
                                                .length / this.state.pageSize
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
