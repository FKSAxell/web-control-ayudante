import React from 'react'
import { AuthState } from '../../../../store/auth'
import { AppState, LoadingPayload } from '../../../../store/app'
import { History } from 'history'
import Backend, {
    ClassesResponse,
    SubjectResponse, UsersResponse
} from '../../../../libraries/backend'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBook, faBurn, faCheck, faChessKnight,
    faClock,
    faLink,
    faLocationArrow,
    faPencilAlt,
    faPlus,
} from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import CreateClassModal from './create-class-modal'
import UpdateClassModal from './update-class-modal'
import SeeAttendancesClassModal from './see-attendances-modal'
import Utils from '../../../../libraries/utils'
import Role, { Action, RoleValidation } from '../../../../libraries/role-manager/role'

interface ClassesProps {
    app: AppState
    auth: AuthState
    history: History
    setLoading(payload: LoadingPayload): void
}

interface ClassesState {
    materias: SubjectResponse[]
    materiaSeleccionada: string
    ayudantes: UsersResponse[]
    ayudanteSeleccionado: string
    classes: ClassesResponse[]
    showCreateModal: boolean
    classResponseToUpdate?: ClassesResponse
    classToSeeAttendances?: ClassesResponse
    page: number
    pageSize: number
    roles: RoleValidation[]
}

export default class Classes extends React.Component<
    ClassesProps,
    ClassesState
> {
    state: ClassesState = {
        materias: [],
        materiaSeleccionada: '',
        ayudantes: [],
        ayudanteSeleccionado: '',
        classes: [],
        showCreateModal: false,
        classResponseToUpdate: undefined,
        classToSeeAttendances: undefined,
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
                classes: await Backend.getClasses(this.props.auth.token || '')
            })
            this.setState({
                //materias: this.state.classes.map(value => value.sesion.ayudantia.materia),
                materias: this.state.classes
                    .filter(
                        (clase: ClassesResponse) => this.state.roles
                            .map((role: RoleValidation) => role.canReadAll(Action.Asistantships)).filter((can: boolean) => can).length > 0 ||
                            this.props.auth.user?._id ===
                            clase.sesion.ayudantia.usuario._id
                    )
                    .map(value => value.sesion.ayudantia.materia),
                ayudantes: this.state.classes
                    .filter(
                        (clase: ClassesResponse) => this.state.roles
                            .map((role: RoleValidation) => role.canReadAll(Action.Asistantships)).filter((can: boolean) => can).length > 0 ||
                            this.props.auth.user?._id ===
                            clase.sesion.ayudantia.usuario._id
                    )
                    .map(value => value.sesion.ayudantia.usuario)
            })

            this.setState({
                materias: this.state.materias.filter( (ele, ind) => ind ===
                    this.state.materias.findIndex( elem => elem.nombre === ele.nombre)),
                ayudantes: this.state.ayudantes.filter( (ele, ind) => ind ===
                    this.state.ayudantes.findIndex( elem => elem.nombre === ele.nombre)),
            })

            this.setState({
                classes: this.state.classes.filter(value => this.state.materiaSeleccionada === '' ||
                    value.sesion.ayudantia.materia.nombre === this.state.materiaSeleccionada)
            })
            this.setState({
                classes: this.state.classes.filter(value => this.state.ayudanteSeleccionado === '' ||
                    value.sesion.ayudantia.usuario.nombre === this.state.ayudanteSeleccionado)
            })

            console.log(this.state.classes)
            this.props.setLoading({ isLoading: false })
        } catch (error) {
            this.props.setLoading({ isLoading: false })
            throw error
        }
    }

    handleChangeMateria = (selectedOptions: any) => {
        const name = selectedOptions.target.selectedOptions.item(0).label
        console.log(name)
        this.props.setLoading({ isLoading: true })
        this.setState({
            materiaSeleccionada: name
        })
        this.fetchData()
    }
    handleChangeAyudante = (selectedOptions: any) => {
        const name = selectedOptions.target.selectedOptions.item(0).label
        console.log(name)
        this.props.setLoading({ isLoading: true })
        this.setState({
            ayudanteSeleccionado: name
        })
        this.fetchData()
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
                {this.state.classToSeeAttendances !== undefined && (
                    <SeeAttendancesClassModal
                        class={this.state.classToSeeAttendances}
                        setLoading={this.props.setLoading}
                        app={this.props.app}
                        auth={this.props.auth}
                        onCloseButtonClicked={() =>
                            this.setState({ classToSeeAttendances: undefined })
                        }
                        onClassCreated={this.fetchData}
                    />
                )}
                <br />
                <div>
                    <span className="w3-xlarge">Clases </span>
                    {' '}
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
                <label>
                    <b>Materia</b>
                </label>
                <select
                    onChange={this.handleChangeMateria}
                    className="w3-input w3-border w3-margin-bottom"
                    required
                >
                    {this.state.materias.map(
                        (
                            materia: SubjectResponse,
                            index: number
                        ) => (
                            <option
                                key={index}
                                value={materia._id}
                            >
                                {materia.nombre}
                            </option>
                        )
                    )}
                </select>
                <label>
                    <b>Ayudante</b>
                </label>
                <select
                    onChange={this.handleChangeAyudante}
                    className="w3-input w3-border w3-margin-bottom"
                    required
                >
                    {this.state.ayudantes.map(
                        (
                            ayudante: UsersResponse,
                            index: number
                        ) => (
                            <option
                                key={index}
                                value={ayudante._id}
                            >
                                {ayudante.nombre}
                            </option>
                        )
                    )}
                </select>
                <ul className="w3-ul w3-card-4">
                    {this.state.classes
                        .filter(
                            (classResponse: ClassesResponse) => this.state.roles
                                .map((role: RoleValidation) => role.canReadAll(Action.Classes)).filter((can: boolean) => can).length > 0 ||
                                this.props.auth.user?._id ===
                                classResponse.sesion.ayudantia.usuario._id
                        )
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
                                                role.canRead(Action.Attendances)
                                            )
                                            .filter((can: boolean) => can).length > 0 && (<button
                                            onClick={() =>
                                                this.setState({
                                                    classToSeeAttendances:
                                                        classResponse
                                                })
                                            }
                                            className="w3-button w3-green"
                                        >
                                            <FontAwesomeIcon icon={faClock} />
                                        </button>)}

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
                                        <span className="w3-large">
                                            <FontAwesomeIcon icon={faBurn} />{' '}
                                            Materia: {classResponse.sesion.ayudantia.materia.nombre}
                                        </span>
                                        <br />
                                        <span className="w3-large">
                                            <FontAwesomeIcon icon={faChessKnight} />{' '}
                                            Ayudante: {classResponse.sesion.ayudantia.usuario.nombre}
                                        </span>
                                        <br />
                                        <span className="w3-large">
                                            <FontAwesomeIcon icon={faCheck} />{' '}
                                            Calificacion: 5
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
