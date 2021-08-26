import React from 'react'
import { AuthState } from '../../../../store/auth'
import { AppState, LoadingPayload } from '../../../../store/app'
import { History } from 'history'
import Backend, { ClassesResponse } from '../../../../libraries/backend'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBook,
    faLink,
    faLocationArrow,
    faPencilAlt,
    faPlus,
} from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import CreateClassModal from './create-class-modal'
import UpdateClassModal from './update-class-modal'
import Utils from '../../../../libraries/utils'
import Role, { Action, RoleValidation } from '../../../../libraries/role-manager/role'

interface ClassesProps {
    app: AppState
    auth: AuthState
    history: History
    setLoading(payload: LoadingPayload): void
}

interface ClassesState {
    classes: ClassesResponse[]
    showCreateModal: boolean
    classResponseToUpdate?: ClassesResponse
    page: number
    pageSize: number
    roles: RoleValidation[]
}

export default class Classes extends React.Component<
    ClassesProps,
    ClassesState
> {
    state: ClassesState = {
        classes: [],
        showCreateModal: false,
        classResponseToUpdate: undefined,
        page: 1,
        pageSize: 5,
        roles: Role.fromUser(this.props.auth.user),
    }

    fetchData = async () => {
        try {
            this.setState({
                showCreateModal: false,
                classResponseToUpdate: undefined,
            })
            this.props.setLoading({ isLoading: true })
            this.setState({
                classes: await Backend.getClasses(this.props.auth.token || ''),
            })
            this.props.setLoading({ isLoading: false })
        } catch (error) {
            this.props.setLoading({ isLoading: false })
            throw error
        }
    }

    deleteClass = async (id: string) => {
        const action: boolean = window.confirm(
            'Realmente desea eleminar la clase'
        )
        if (action === true) {
            this.props.setLoading({ isLoading: true })
            await Backend.deleteClass(this.props.auth.token || '', id)
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
                    <CreateClassModal
                        setLoading={this.props.setLoading}
                        app={this.props.app}
                        auth={this.props.auth}
                        onCloseButtonClicked={() =>
                            this.setState({ showCreateModal: false })
                        }
                        onClassCreated={this.fetchData}
                    />
                )}
                {this.state.classResponseToUpdate !== undefined && (
                    <UpdateClassModal
                        class={this.state.classResponseToUpdate}
                        setLoading={this.props.setLoading}
                        app={this.props.app}
                        auth={this.props.auth}
                        onCloseButtonClicked={() =>
                            this.setState({ classResponseToUpdate: undefined })
                        }
                        onClassCreated={this.fetchData}
                    />
                )}
                <br />
                <div>
                    <span className="w3-xlarge">Clases </span>
                    {this.state.roles
                        .map((role: RoleValidation) =>
                            role.canCreate(Action.Classes)
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
                    {this.state.classes
                        .slice(
                            (this.state.page - 1) * this.state.pageSize,
                            this.state.page * this.state.pageSize
                        )
                        .map(
                            (classResponse: ClassesResponse, index: number) => (
                                <li key={'user' + index} className="w3-bar">
                                    <span className="w3-bar-item w3-white w3-xlarge w3-right">
                                        {this.state.roles
                                            .map((role: RoleValidation) =>
                                                role.canUpdate(Action.Classes)
                                            )
                                            .filter((can: boolean) => can).length > 0 && (<button
                                            onClick={() =>
                                                this.setState({
                                                    classResponseToUpdate:
                                                        classResponse,
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
                                                role.canDelete(Action.Classes)
                                            )
                                            .filter((can: boolean) => can).length > 0 && (<button
                                            onClick={() =>
                                                this.deleteClass(
                                                    classResponse._id
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
                                            {classResponse.tema} (
                                            {classResponse.descripcion})
                                        </span>
                                        <br />
                                        <span>
                                            <FontAwesomeIcon
                                                icon={faLocationArrow}
                                            />{' '}
                                            {classResponse.ubicacion.nombre}
                                        </span>
                                        <br />
                                        <span>
                                            <FontAwesomeIcon icon={faLink} />{' '}
                                            {classResponse.enlace}
                                        </span>
                                        <br />
                                        <span>
                                            <span className="w3-tag w3-blue">
                                                {
                                                    classResponse.fechaClaseInicio
                                                        .toString()
                                                        .split('.')[0]
                                                        .split('T')[0]
                                                }
                                            </span>{' '}
                                            <span className="w3-tag w3-blue">
                                                {Utils.twoDigits(
                                                    classResponse.sesion
                                                        .horaInicio
                                                )}
                                                :
                                                {Utils.twoDigits(
                                                    classResponse.sesion
                                                        .minutoInicio
                                                )}
                                            </span>{' '}
                                            <span className="w3-tag w3-green">
                                                {
                                                    classResponse.fechaClaseFin
                                                        .toString()
                                                        .split('.')[0]
                                                        .split('T')[0]
                                                }
                                            </span>{' '}
                                            <span className="w3-tag w3-green">
                                                {Utils.twoDigits(
                                                    classResponse.sesion.horaFin
                                                )}
                                                :
                                                {Utils.twoDigits(
                                                    classResponse.sesion
                                                        .minutoFin
                                                )}
                                            </span>
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
                                    this.state.classes.length /
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
