import React from 'react'
import { connect } from 'react-redux'
import { RootState } from '../../store/store'
import auth, { AuthState } from '../../store/auth'
import app, { AppState, LoadingPayload } from '../../store/app'
import { History } from 'history'
import Classes from './options/classes/classes'
import Loader from '../../components/loader/loader'
import Modal from '../../components/modal'
import Users from './options/users/users'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBook,
    faBookmark,
    faBuilding,
    faCalendar,
    faChartArea,
    faChartPie,
    faClock,
    faLocationArrow,
    faLock,
    faPlus,
    faShapes,
    faUniversity,
    faUser,
} from '@fortawesome/free-solid-svg-icons'
import Locations from './options/locations/locations'
import Roles from './options/roles/roles'
import Faculties from './options/faculties/faculties'
import Subjects from './options/subjects/subjects'
// import Attendances from './options/attendances/attendances'
import Assistantships from './options/assistantships/assistantships'
import Careers from './options/careers/careers'
import Registers from './options/registers/registers'
import Sessions from './options/sessions/sessions'
import Favorites from './options/favorite/favorite'
import Role, { Action, RoleValidation } from '../../libraries/role-manager/role'
import Dashboard from './options/dashboard/dashboard'
import { RolResponse } from '../../libraries/backend'

interface HomeProps {
    auth: AuthState
    app: AppState
    history: History
    logout(): void
    setLoading(payload: LoadingPayload): void
}

interface HomeState {
    canLogin: boolean
    optionSelect: string
    roles: RoleValidation[]
}

class Home extends React.Component<HomeProps, HomeState> {
    constructor(homeProps: HomeProps) {
        super(homeProps)

        if (this.props.auth.token === undefined) {
            this.props.history.replace('/login')
        }

        const roles: RoleValidation[] = Role.fromUser(this.props.auth.user)
        const canLogin: boolean = this.props.auth.user === undefined ? false : this.props.auth.user?.rol.filter((rol: RolResponse) => ['ADM','PRF', 'AYU'].includes(rol.codigo)).length > 0

        this.state = {
            canLogin,
            optionSelect: canLogin ? 'metrics' : '',
            roles,
        }
    }

    onLogoutButonClicked = () => {
        this.props.logout()
        this.props.history.replace('/login')
    }

    getClassForOption = (id: string): string => {
        if (this.state.optionSelect === id) {
            return 'w3-bar-item w3-button w3-padding w3-blue'
        } else {
            return 'w3-bar-item w3-button w3-padding'
        }
    }

    selectOption = (id: string) => {
        this.setState({
            optionSelect: id,
        })
    }

    render(): React.ReactElement {
        return (
            <div>
                {this.props.app.isLoading && (
                    <Modal background={false} content={<Loader />} />
                )}
                <div
                    className="w3-bar w3-top w3-black w3-large"
                    style={{ zIndex: 4 }}
                >
                    {/*
                    <button className="w3-bar-item w3-button w3-hide-large w3-hover-none w3-hover-text-light-grey">
                        <FontAwesomeIcon icon={faBars}/>
                    </button>
                    */}
                    <span
                        onClick={this.onLogoutButonClicked}
                        className="w3-bar-item w3-right"
                    >
                        Salir
                    </span>
                </div>

                {/* w3-collapse */}
                <nav
                    className="w3-sidebar  w3-white w3-animate-left"
                    style={{ zIndex: 3, width: '300px' }}
                >
                    <div className="w3-container w3-row">
                        {/*<div className="w3-col s4">
                            <img src="/w3images/avatar2.png" className="w3-circle w3-margin-right" style={{ width: '46px' }}/>
                        </div>*/}
                        <div className="w3-col s8 w3-bar">
                            {/*<span>Bienvenido, <strong> Carlos </strong></span>*/}
                            {/*<a href="#" className="w3-bar-item w3-button"></a>
                            <a href="#" className="w3-bar-item w3-button"><i className="fa fa-user"></i></a>
                    <a href="#" className="w3-bar-item w3-button"><i className="fa fa-cog"></i></a>*/}
                        </div>
                    </div>
                    {/*<hr/>*/}
                    {this.state.canLogin && <div className="w3-container">
                        <h3>Dashboard</h3>
                    </div>}
                    <div className="w3-bar-block">
                        {this.state.canLogin && <button
                            onClick={() => this.selectOption('metrics')}
                            className={this.getClassForOption('metrics')}
                        >
                            <FontAwesomeIcon icon={faChartPie} /> Métricas
                        </button>}
                        {this.state.roles
                            .map((role: RoleValidation) =>
                                role.canRead(Action.Attendances)
                            )
                            .filter((can: boolean) => can).length > 0 && (
                            <button
                                onClick={() => this.selectOption('attendances')}
                                className={this.getClassForOption(
                                    'attendances'
                                )}
                            >
                                <FontAwesomeIcon icon={faClock} /> Asistencias
                            </button>
                        )}

                        {this.state.roles
                            .map((role: RoleValidation) =>
                                role.canRead(Action.Asistantships)
                            )
                            .filter((can: boolean) => can).length > 0 && (
                            <button
                                onClick={() =>
                                    this.selectOption('assistantships')
                                }
                                className={this.getClassForOption(
                                    'assistantships'
                                )}
                            >
                                <FontAwesomeIcon icon={faPlus} /> Ayudantías
                            </button>
                        )}

                        {this.state.roles
                            .map((role: RoleValidation) =>
                                role.canRead(Action.Careers)
                            )
                            .filter((can: boolean) => can).length > 0 && (
                            <button
                                onClick={() => this.selectOption('careers')}
                                className={this.getClassForOption('careers')}
                            >
                                <FontAwesomeIcon icon={faBuilding} /> Carreras
                            </button>
                        )}

                        {this.state.roles
                            .map((role: RoleValidation) =>
                                role.canRead(Action.Classes)
                            )
                            .filter((can: boolean) => can).length > 0 && (
                            <button
                                onClick={() => this.selectOption('classes')}
                                className={this.getClassForOption('classes')}
                            >
                                <FontAwesomeIcon icon={faBook} /> Clases
                            </button>
                        )}

                        {this.state.roles
                            .map((role: RoleValidation) =>
                                role.canRead(Action.Faculties)
                            )
                            .filter((can: boolean) => can).length > 0 && (
                            <button
                                onClick={() => this.selectOption('faculties')}
                                className={this.getClassForOption('faculties')}
                            >
                                <FontAwesomeIcon icon={faUniversity} />{' '}
                                Facultades
                            </button>
                        )}

                        {this.state.roles
                            .map((role: RoleValidation) =>
                                role.canRead(Action.Favorites)
                            )
                            .filter((can: boolean) => can).length > 0 && (
                            <button
                                onClick={() => this.selectOption('favorites')}
                                className={this.getClassForOption('favorites')}
                            >
                                <FontAwesomeIcon icon={faBookmark} /> Favoritos
                            </button>
                        )}

                        {this.state.roles
                            .map((role: RoleValidation) =>
                                role.canRead(Action.Subjects)
                            )
                            .filter((can: boolean) => can).length > 0 && (
                            <button
                                onClick={() => this.selectOption('subjects')}
                                className={this.getClassForOption('subjects')}
                            >
                                <FontAwesomeIcon icon={faShapes} /> Materias
                            </button>
                        )}

                        {this.state.roles
                            .map((role: RoleValidation) =>
                                role.canRead(Action.Registers)
                            )
                            .filter((can: boolean) => can).length > 0 && (
                            <button
                                onClick={() => this.selectOption('registers')}
                                className={this.getClassForOption('registers')}
                            >
                                <FontAwesomeIcon icon={faChartArea} /> Registros
                            </button>
                        )}

                        {this.state.roles
                            .map((role: RoleValidation) =>
                                role.canRead(Action.Roles)
                            )
                            .filter((can: boolean) => can).length > 0 && (
                            <button
                                onClick={() => this.selectOption('roles')}
                                className={this.getClassForOption('roles')}
                            >
                                <FontAwesomeIcon icon={faLock} /> Roles
                            </button>
                        )}

                        {this.state.roles
                            .map((role: RoleValidation) =>
                                role.canRead(Action.Sessions)
                            )
                            .filter((can: boolean) => can).length > 0 && (
                            <button
                                onClick={() => this.selectOption('sessions')}
                                className={this.getClassForOption('sessions')}
                            >
                                <FontAwesomeIcon icon={faCalendar} /> Sesiones
                            </button>
                        )}

                        {this.state.roles
                            .map((role: RoleValidation) =>
                                role.canRead(Action.Locations)
                            )
                            .filter((can: boolean) => can).length > 0 && (
                            <button
                                onClick={() => this.selectOption('locations')}
                                className={this.getClassForOption('locations')}
                            >
                                <FontAwesomeIcon icon={faLocationArrow} />{' '}
                                Ubicaciones
                            </button>
                        )}

                        {this.state.roles
                            .map((role: RoleValidation) =>
                                role.canRead(Action.Users)
                            )
                            .filter((can: boolean) => can).length > 0 && (
                            <button
                                onClick={() => this.selectOption('users')}
                                className={this.getClassForOption('users')}
                            >
                                <FontAwesomeIcon icon={faUser} /> Usuarios
                            </button>
                        )}
                    </div>
                </nav>

                {/*className="w3-main"*/}
                <div style={{ marginLeft: '300px', marginTop: '43px' }}>
                    {!this.state.canLogin && <h1>
                        Puedes Usar la aplicacion movil para estudiantes en el siguiente enlace: http://ayudantias.com/app
                    </h1>}
                    {this.state.optionSelect === 'classes' && (
                        <Classes
                            setLoading={this.props.setLoading}
                            app={this.props.app}
                            auth={this.props.auth}
                            history={this.props.history}
                        />
                    )}
                    {this.state.optionSelect === 'users' && (
                        <Users
                            setLoading={this.props.setLoading}
                            app={this.props.app}
                            auth={this.props.auth}
                            history={this.props.history}
                        />
                    )}
                    {this.state.optionSelect === 'locations' && (
                        <Locations
                            setLoading={this.props.setLoading}
                            app={this.props.app}
                            auth={this.props.auth}
                            history={this.props.history}
                        />
                    )}
                    {this.state.optionSelect === 'roles' && (
                        <Roles
                            setLoading={this.props.setLoading}
                            app={this.props.app}
                            auth={this.props.auth}
                            history={this.props.history}
                        />
                    )}
                    {this.state.optionSelect === 'faculties' && (
                        <Faculties
                            setLoading={this.props.setLoading}
                            app={this.props.app}
                            auth={this.props.auth}
                            history={this.props.history}
                        />
                    )}
                    {this.state.optionSelect === 'subjects' && (
                        <Subjects
                            setLoading={this.props.setLoading}
                            app={this.props.app}
                            auth={this.props.auth}
                            history={this.props.history}
                        />
                    )}
                    {/*this.state.optionSelect === 'attendances' && (
                        <Attendances
                            setLoading={this.props.setLoading}
                            app={this.props.app}
                            auth={this.props.auth}
                            history={this.props.history}
                        />
                    )*/}
                    {this.state.optionSelect === 'assistantships' && (
                        <Assistantships
                            setLoading={this.props.setLoading}
                            app={this.props.app}
                            auth={this.props.auth}
                            history={this.props.history}
                        />
                    )}
                    {this.state.optionSelect === 'careers' && (
                        <Careers
                            setLoading={this.props.setLoading}
                            app={this.props.app}
                            auth={this.props.auth}
                            history={this.props.history}
                        />
                    )}
                    {this.state.optionSelect === 'registers' && (
                        <Registers
                            setLoading={this.props.setLoading}
                            app={this.props.app}
                            auth={this.props.auth}
                            history={this.props.history}
                        />
                    )}
                    {this.state.optionSelect === 'sessions' && (
                        <Sessions
                            setLoading={this.props.setLoading}
                            app={this.props.app}
                            auth={this.props.auth}
                            history={this.props.history}
                        />
                    )}
                    {this.state.optionSelect === 'favorites' && (
                        <Favorites
                            setLoading={this.props.setLoading}
                            app={this.props.app}
                            auth={this.props.auth}
                            history={this.props.history}
                        />
                    )}
                    {this.state.optionSelect === 'metrics' && (
                        <Dashboard
                            setLoading={this.props.setLoading}
                            app={this.props.app}
                            auth={this.props.auth}
                        />
                    )}
                </div>
            </div>
        )
    }
}

function mapStateToProps(
    state: RootState,
    componentProps: HomeProps
): HomeProps {
    return {
        ...componentProps,
        auth: state.auth,
        app: state.app,
    }
}

const mapDispatchToProps = {
    logout: auth.actions.logout,
    setLoading: app.actions.setLoading,
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
