import React from 'react'
import { AuthState } from '../../../../store/auth'
import { AppState, LoadingPayload } from '../../../../store/app'
import { History } from 'history'
import Backend, { FavoriteResponse } from '../../../../libraries/backend'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import Utils from '../../../../libraries/utils'
import UpdateFavoriteModal from './update-favorite-modal'
import CreateFavoriteModal from './create-favorite-modal'
import Role, { Action, RoleValidation } from '../../../../libraries/role-manager/role'

interface FavoritesProps {
    app: AppState
    auth: AuthState
    history: History
    setLoading(payload: LoadingPayload): void
}

interface FavoritesState {
    favorites: FavoriteResponse[]
    showCreateModal: boolean
    favoriteResponseToUpdate?: FavoriteResponse
    page: number
    pageSize: number
    roles: RoleValidation[]
}

export default class Favorites extends React.Component<
    FavoritesProps,
    FavoritesState
> {
    state: FavoritesState = {
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
                    this.props.auth.token || ''
                ),
            })
            this.props.setLoading({ isLoading: false })
        } catch (error) {
            this.props.setLoading({ isLoading: false })
            throw error
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
            <div className="w3-container">
                {this.state.showCreateModal && (
                    <CreateFavoriteModal
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
                    <UpdateFavoriteModal
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
                    />
                )}
                <br />
                <div>
                    <span className="w3-xlarge">Favoritos </span>
                    {this.state.roles
                        .map((role: RoleValidation) =>
                            role.canCreate(Action.Favorites)
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
                    {this.state.favorites
                        .slice(
                            (this.state.page - 1) * this.state.pageSize,
                            this.state.page * this.state.pageSize
                        )
                        .map((favorite: FavoriteResponse, index: number) => (
                            <li key={'favorites' + index} className="w3-bar">
                                <span className="w3-bar-item w3-white w3-xlarge w3-right">
                                    {this.state.roles
                                        .map((role: RoleValidation) =>
                                            role.canUpdate(Action.Favorites)
                                        )
                                        .filter((can: boolean) => can).length > 0 && (<button
                                        onClick={() =>
                                            this.setState({
                                                favoriteResponseToUpdate:
                                                    favorite,
                                            })
                                        }
                                        className="w3-button w3-blue"
                                    >
                                        <FontAwesomeIcon icon={faPencilAlt} />
                                    </button>)}
                                    {this.state.roles
                                        .map((role: RoleValidation) =>
                                            role.canDelete(Action.Favorites)
                                        )
                                        .filter((can: boolean) => can).length > 0 && (<button
                                        onClick={() =>
                                            this.deleteFavorite(favorite._id)
                                        }
                                        className="w3-button w3-red"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>)}
                                </span>
                                <div className="">
                                    <span className="w3-large">
                                        <FontAwesomeIcon icon={faPlus} />{' '}
                                        {favorite.usuario.email}
                                    </span>
                                    <br />
                                    <span>
                                        <FontAwesomeIcon icon={faClock} />{' '}
                                        {Utils.twoDigits(
                                            favorite.sesion.horaInicio
                                        )}
                                        :
                                        {Utils.twoDigits(
                                            favorite.sesion.minutoInicio
                                        )}{' '}
                                        -{' '}
                                        {Utils.twoDigits(
                                            favorite.sesion.horaFin
                                        )}
                                        :
                                        {Utils.twoDigits(
                                            favorite.sesion.minutoFin
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
                                    this.state.favorites.length /
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
