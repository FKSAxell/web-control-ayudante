import React from 'react'
import { AuthState } from '../../../../store/auth'
import { AppState, LoadingPayload } from '../../../../store/app'
import { History } from 'history'
import Backend, { SubjectResponse } from '../../../../libraries/backend'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faPencilAlt,
    faPlus,
    faShapes,
} from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import UpdateSubjectModal from './update-subjects-modal'
import CreateSubjectModal from './create-subjects-modal'
import Role, { Action, RoleValidation } from '../../../../libraries/role-manager/role'

interface SubjectsProps {
    app: AppState
    auth: AuthState
    history: History
    setLoading(payload: LoadingPayload): void
}

interface SubjectsState {
    subjects: SubjectResponse[]
    showCreateModal: boolean
    subjectsResponseToUpdate?: SubjectResponse
    page: number
    pageSize: number
    roles: RoleValidation[]
}

export default class Subjects extends React.Component<
    SubjectsProps,
    SubjectsState
> {
    state: SubjectsState = {
        subjects: [],
        showCreateModal: false,
        subjectsResponseToUpdate: undefined,
        page: 1,
        pageSize: 5,
        roles: Role.fromUser(this.props.auth.user),
    }

    fetchData = async () => {
        try {
            this.setState({
                showCreateModal: false,
                subjectsResponseToUpdate: undefined,
            })
            this.props.setLoading({ isLoading: true })
            this.setState({
                subjects: await Backend.getSubjects(
                    this.props.auth.token || ''
                ),
            })
            this.props.setLoading({ isLoading: false })
        } catch (error) {
            this.props.setLoading({ isLoading: false })
            throw error
        }
    }

    deleteSubject = async (id: string) => {
        const action: boolean = window.confirm(
            'Realmente desea eleminar la materia'
        )
        if (action === true) {
            this.props.setLoading({ isLoading: true })
            await Backend.deleteSubject(this.props.auth.token || '', id)
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
                    <CreateSubjectModal
                        setLoading={this.props.setLoading}
                        app={this.props.app}
                        auth={this.props.auth}
                        onCloseButtonClicked={() =>
                            this.setState({ showCreateModal: false })
                        }
                        onClassCreated={this.fetchData}
                    />
                )}
                {this.state.subjectsResponseToUpdate !== undefined && (
                    <UpdateSubjectModal
                        subject={this.state.subjectsResponseToUpdate}
                        setLoading={this.props.setLoading}
                        app={this.props.app}
                        auth={this.props.auth}
                        onCloseButtonClicked={() =>
                            this.setState({
                                subjectsResponseToUpdate: undefined,
                            })
                        }
                        onClassCreated={this.fetchData}
                    />
                )}
                <br />
                <div>
                    <span className="w3-xlarge">Materias </span>
                    {this.state.roles
                        .map((role: RoleValidation) =>
                            role.canCreate(Action.Subjects)
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
                    {this.state.subjects
                        .slice(
                            (this.state.page - 1) * this.state.pageSize,
                            this.state.page * this.state.pageSize
                        )
                        .map((subject: SubjectResponse, index: number) => (
                            <li key={'subjects' + index} className="w3-bar">
                                <span className="w3-bar-item w3-white w3-xlarge w3-right">
                                    {this.state.roles
                                        .map((role: RoleValidation) =>
                                            role.canUpdate(Action.Subjects)
                                        )
                                        .filter((can: boolean) => can).length > 0 && (<button
                                        onClick={() =>
                                            this.setState({
                                                subjectsResponseToUpdate:
                                                    subject,
                                            })
                                        }
                                        className="w3-button w3-blue"
                                    >
                                        <FontAwesomeIcon icon={faPencilAlt} />
                                    </button>)}
                                    {this.state.roles
                                        .map((role: RoleValidation) =>
                                            role.canDelete(Action.Subjects)
                                        )
                                        .filter((can: boolean) => can).length > 0 && (<button
                                        onClick={() =>
                                            this.deleteSubject(subject._id)
                                        }
                                        className="w3-button w3-red"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>)}
                                </span>
                                <div className="">
                                    <span className="w3-large">
                                        <FontAwesomeIcon icon={faShapes} />{' '}
                                        {subject.nombre} ({subject.codigo})
                                    </span>
                                    <br />
                                    <span>{subject.facultad.nombre}</span>
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
                                    this.state.subjects.length /
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
