import React from 'react'
import { AuthState } from '../../../../store/auth'
import { AppState, LoadingPayload } from '../../../../store/app'
import { History } from 'history'
import Backend, { LocationsResponse } from '../../../../libraries/backend'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faLocationArrow,
    faPencilAlt,
    faPlus,
} from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import CreateLocationModal from './create-location-modal'
import UpdateLocationModal from './update-location-modal'
import Role, { Action, RoleValidation } from '../../../../libraries/role-manager/role'

interface LocationsProps {
    app: AppState
    auth: AuthState
    history: History
    setLoading(payload: LoadingPayload): void
}

interface LocationsState {
    locations: LocationsResponse[]
    showCreateModal: boolean
    locationResponseToUpdate?: LocationsResponse
    page: number
    pageSize: number
    roles: RoleValidation[]
}

export default class Locations extends React.Component<
    LocationsProps,
    LocationsState
> {
    state: LocationsState = {
        locations: [],
        showCreateModal: false,
        locationResponseToUpdate: undefined,
        page: 1,
        pageSize: 5,
        roles: Role.fromUser(this.props.auth.user),
    }

    fetchData = async () => {
        try {
            this.setState({
                showCreateModal: false,
                locationResponseToUpdate: undefined,
            })
            this.props.setLoading({ isLoading: true })
            this.setState({
                locations: await Backend.getLocations(
                    this.props.auth.token || ''
                ),
            })
            this.props.setLoading({ isLoading: false })
        } catch (error) {
            this.props.setLoading({ isLoading: false })
            throw error
        }
    }

    deleteLocation = async (id: string) => {
        const action: boolean = window.confirm(
            'Realmente desea eleminar la ubicación'
        )
        if (action === true) {
            this.props.setLoading({ isLoading: true })
            await Backend.deleteLocation(this.props.auth.token || '', id)
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
                    <CreateLocationModal
                        setLoading={this.props.setLoading}
                        app={this.props.app}
                        auth={this.props.auth}
                        onCloseButtonClicked={() =>
                            this.setState({ showCreateModal: false })
                        }
                        onClassCreated={this.fetchData}
                    />
                )}
                {this.state.locationResponseToUpdate !== undefined && (
                    <UpdateLocationModal
                        location={this.state.locationResponseToUpdate}
                        setLoading={this.props.setLoading}
                        app={this.props.app}
                        auth={this.props.auth}
                        onCloseButtonClicked={() =>
                            this.setState({
                                locationResponseToUpdate: undefined,
                            })
                        }
                        onClassCreated={this.fetchData}
                    />
                )}
                <br />
                <div>
                    <span className="w3-xlarge">Ubicaciones </span>
                    {this.state.roles
                        .map((role: RoleValidation) =>
                            role.canRead(Action.Locations)
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
                    {this.state.locations
                        .slice(
                            (this.state.page - 1) * this.state.pageSize,
                            this.state.page * this.state.pageSize
                        )
                        .map((location: LocationsResponse, index: number) => (
                            <li key={'location' + index} className="w3-bar">
                                <span className="w3-bar-item w3-white w3-xlarge w3-right">
                                    {this.state.roles
                                        .map((role: RoleValidation) =>
                                            role.canUpdate(Action.Locations)
                                        )
                                        .filter((can: boolean) => can).length > 0 && (<button
                                        onClick={() =>
                                            this.setState({
                                                locationResponseToUpdate:
                                                    location,
                                            })
                                        }
                                        className="w3-button w3-blue"
                                    >
                                        <FontAwesomeIcon icon={faPencilAlt} />
                                    </button>)}
                                    {this.state.roles
                                        .map((role: RoleValidation) =>
                                            role.canDelete(Action.Locations)
                                        )
                                        .filter((can: boolean) => can).length > 0 && (<button
                                        onClick={() =>
                                            this.deleteLocation(location._id)
                                        }
                                        className="w3-button w3-red"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>)}
                                </span>
                                <div className="">
                                    <span className="w3-large">
                                        <FontAwesomeIcon
                                            icon={faLocationArrow}
                                        />{' '}
                                        {location.nombre} ({location.codigo})
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
                                    this.state.locations.length /
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
