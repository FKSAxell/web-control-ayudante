import React from 'react'
import {
    faBook,
    faCheck,
    faGraduationCap,
    faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ChartData } from 'chart.js/auto'
import { Line } from 'react-chartjs-2'
import Backend from '../../../../libraries/backend'
import { AppState, LoadingPayload } from '../../../../store/app'
import { AuthState } from '../../../../store/auth'

export interface DashboardProps {
    app: AppState
    auth: AuthState
    setLoading(payload: LoadingPayload): void
}
export interface DashboardState {
    data: ChartData
    plugins: any[]
    dashboard: any
}

export default class Dashboard extends React.Component<
    DashboardProps,
    DashboardState
> {
    state: DashboardState = {
        data: {
            labels: ['1', '2', '3', '4', '5', '6'],
            datasets: [
                {
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    //fill: true,
                    backgroundColor: 'rgb(255, 255, 255)',
                    borderColor: 'rgb(255, 255, 255)',
                },
            ],
        },
        plugins: [
            {
                id: 'custom_canvas_background_color',
                beforeDraw: (chart: any) => {
                    const ctx = chart.canvas.getContext('2d')
                    ctx.save()
                    ctx.globalCompositeOperation = 'destination-over'
                    ctx.fillStyle = '#243165'
                    ctx.fillRect(0, 0, chart.width, chart.height)
                    ctx.restore()
                },
            },
        ],
        dashboard: {},
    }
    componentDidMount() {
        this.fetchData()
    }

    fetchData = async () => {
        try {
            this.props.setLoading({ isLoading: true })
            const dashboard: any = await Backend.getMainDashboard(
                this.props.auth.token || '',
                this.props.auth.user?._id
            )
            this.setState({
                data: {
                    labels:
                        dashboard?.attendancesByDate === undefined
                            ? []
                            : Object.keys(dashboard?.attendancesByDate),
                    datasets: [
                        {
                            label: 'Asistencias',
                            data:
                                dashboard?.attendancesByDate === undefined
                                    ? []
                                    : Object.values(
                                        dashboard?.attendancesByDate
                                    ),
                            backgroundColor: 'rgb(255, 255, 255)',
                            borderColor: 'rgb(255, 255, 255)',
                        },
                    ],
                },
                dashboard,
            })
            this.props.setLoading({ isLoading: false })
        } catch (error) {
            this.props.setLoading({ isLoading: false })
            throw error
        }
    }

    render(): React.ReactElement {
        return (
            <div className="w3-container">
                <br />
                <div className="w3-row-padding">
                    <div className="w3-half">
                        <br />
                        <br />
                        <div className="w3-half w3-padding">
                            <div className=" w3-card w3-container w3-teal w3-padding-16">
                                <div className="w3-left">
                                    <FontAwesomeIcon
                                        className="w3-xxxlarge"
                                        icon={faGraduationCap}
                                    />
                                </div>
                                <div className="w3-right">
                                    <h3>
                                        {this.state.dashboard?.generalGrade}
                                    </h3>
                                </div>
                                <div className="w3-clear" />
                                <h4>Calificación general</h4>
                            </div>
                        </div>

                        <div className="w3-half w3-padding">
                            <div className=" w3-card w3-container w3-teal w3-padding-16">
                                <div className="w3-left">
                                    <FontAwesomeIcon
                                        className="w3-xxxlarge"
                                        icon={faCheck}
                                    />
                                </div>
                                <div className="w3-right">
                                    <h3>
                                        {
                                            this.state.dashboard
                                                ?.studentsForAssistant
                                        }
                                    </h3>
                                </div>
                                <div className="w3-clear" />
                                <h4>Inscritos en las clases</h4>
                            </div>
                        </div>

                        <div className="w3-half w3-padding">
                            <div className="w3-card w3-container w3-teal w3-padding-16">
                                <div className="w3-left">
                                    <FontAwesomeIcon
                                        className="w3-xxxlarge"
                                        icon={faBook}
                                    />
                                </div>
                                <div className="w3-right">
                                    <h3>{this.state.dashboard?.subjects}</h3>
                                </div>
                                <div className="w3-clear" />
                                <h4>Materias</h4>
                            </div>
                        </div>

                        <div className="w3-half w3-padding">
                            <div className="w3-card w3-container w3-teal w3-padding-16">
                                <div className="w3-left">
                                    <FontAwesomeIcon
                                        className="w3-xxxlarge"
                                        icon={faUsers}
                                    />
                                </div>
                                <div className="w3-right">
                                    <h3>{this.state.dashboard?.students}</h3>
                                </div>
                                <div className="w3-clear" />
                                <h4>Estudiantes</h4>
                            </div>
                        </div>
                    </div>

                    <div className="w3-half">
                        <div className="w3-padding">
                            <div className="w3-card w3-teal w3-padding">
                                <Line
                                    options={{
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: 'Asistencias a clase',
                                                color: 'white',
                                            },
                                            legend: {
                                                display: false,
                                            },
                                        },
                                        scales: {
                                            x: {
                                                grid: {
                                                    borderColor: 'white',
                                                },
                                                ticks: {
                                                    color: 'white',
                                                },
                                            },
                                            y: {
                                                grid: {
                                                    borderColor: 'white',
                                                },
                                                ticks: {
                                                    color: 'white',
                                                },
                                            },
                                        },
                                    }}
                                    plugins={this.state.plugins}
                                    data={this.state.data}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w3-card w3-padding">
                    <h1>Ranking de ayudantes</h1>
                    <h3>Mejores evaluados en la facultad</h3>
                    <table className="w3-table-all">
                        <thead>
                            <tr>
                                <th>Puesto</th>
                                <th>Nombre</th>
                                <th>Calificación</th>
                                <th>Clase</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.dashboard?.attendancesResume ===
                            undefined ? (
                                    <tr></tr>
                                ) : (
                                    this.state.dashboard?.attendancesResume.map(
                                        (attendanceResume: any, index: number) => (
                                            <tr key={'attendance-tr-' + index}>
                                                <td>{index + 1}</td>
                                                <td>{attendanceResume.usuario}</td>
                                                <td>
                                                    {attendanceResume.calificacion}
                                                </td>
                                                <td>{attendanceResume.clase}</td>
                                            </tr>
                                        )
                                    )
                                )}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}
