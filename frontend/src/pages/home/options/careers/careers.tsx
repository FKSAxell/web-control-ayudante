import React from 'react'
import { AuthState } from '../../../../store/auth'
import { AppState, LoadingPayload } from '../../../../store/app'
import { History } from 'history'
import Backend, { CareerResponse } from '../../../../libraries/backend'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBook,
    faLocationArrow,
    faPencilAlt,
    faPlus,
} from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import CreateCareerModal from './create-careers-modal'
import UpdateCareerModal from './update-careers-modal'
import Role, { Action, RoleValidation } from '../../../../libraries/role-manager/role'

interface CareersProps {
    app: AppState
    auth: AuthState
    history: History
    setLoading(payload: LoadingPayload): void
}

interface CareersState {
    careers: CareerResponse[]
    showCreateModal: boolean
    careersResponseToUpdate?: CareerResponse
    page: number
    pageSize: number
    roles: RoleValidation[]
}

export default class Careers extends React.Component<
    CareersProps,
    CareersState
> {
    state: CareersState = {
        careers: [],
        showCreateModal: false,
        careersResponseToUpdate: undefined,
        page: 1,
        pageSize: 5,
        roles: Role.fromUser(this.props.auth.user),
    }

    fetchData = async () => {
        try {
            this.setState({
                showCreateModal: false,
                careersResponseToUpdate: undefined,
            })
            this.props.setLoading({ isLoading: true })
            this.setState({
                careers: await Backend.getCareers(this.props.auth.token || ''),
            })
            this.props.setLoading({ isLoading: false })
        } catch (error) {
            this.props.setLoading({ isLoading: false })
            throw error
        }
    }

    deleteClass = async (id: string) => {
        const action: boolean = window.confirm(
            'Realmente desea eleminar la carrera'
        )
        if (action === true) {
            this.props.setLoading({ isLoading: true })
            await Backend.deleteCareer(this.props.auth.token || '', id)
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
                    <CreateCareerModal
                        setLoading={this.props.setLoading}
                        app={this.props.app}
                        auth={this.props.auth}
                        onCloseButtonClicked={() =>
                            this.setState({ showCreateModal: false })
                        }
                        onClassCreated={this.fetchData}
                    />
                )}
                {this.state.careersResponseToUpdate !== undefined && (
                    <UpdateCareerModal
                        career={this.state.careersResponseToUpdate}
                        setLoading={this.props.setLoading}
                        app={this.props.app}
                        auth={this.props.auth}
                        onCloseButtonClicked={() =>
                            this.setState({
                                careersResponseToUpdate: undefined,
                            })
                        }
                        onClassCreated={this.fetchData}
                    />
                )}
                <br />
                <div>
                    <span className="w3-xlarge">Carreras </span>
                    {this.state.roles
                        .map((role: RoleValidation) =>
                            role.canCreate(Action.Careers)
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
                    {this.state.careers
                        .slice(
                            (this.state.page - 1) * this.state.pageSize,
                            this.state.page * this.state.pageSize
                        )
                        .map((career: CareerResponse, index: number) => (
                            <li key={'career' + index} className="w3-bar">
                                <span className="w3-bar-item w3-white w3-xlarge w3-right">
                                    {this.state.roles
                                        .map((role: RoleValidation) =>
                                            role.canUpdate(Action.Careers)
                                        )
                                        .filter((can: boolean) => can).length > 0 && (<button
                                        onClick={() =>
                                            this.setState({
                                                careersResponseToUpdate: career,
                                            })
                                        }
                                        className="w3-button w3-blue"
                                    >
                                        <FontAwesomeIcon icon={faPencilAlt} />
                                    </button>)}


                                    {this.state.roles
                                        .map((role: RoleValidation) =>
                                            role.canDelete(Action.Careers)
                                        )
                                        .filter((can: boolean) => can).length > 0 && (<button
                                        onClick={() =>
                                            this.deleteClass(career._id)
                                        }
                                        className="w3-button w3-red"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>)}
                                </span>
                                <div className="">
                                    <span className="w3-large">
                                        <FontAwesomeIcon icon={faBook} />{' '}
                                        {career.nombre}
                                    </span>
                                    <br />
                                    <span>
                                        <FontAwesomeIcon
                                            icon={faLocationArrow}
                                        />{' '}
                                        {career.facultad.nombre}
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
                                    this.state.careers.length /
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
