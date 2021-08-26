import MainDashboardResponse from '../responses/main-dashboard-response'
import AttendancesRepository, {
    AttendanceInterface,
} from '../database/models/attendance'
import RolesRepository, { RoleInterface } from '../database/models/role'
import UsersRepository, { UserInterface } from '../database/models/user'
import RegistersRepository, {
    RegisterInterface,
} from '../database/models/register'
import SubjectsRepository, {
    SubjectsInterface,
} from '../database/models/subject'
import MainDashboardRequest from '../requests/main-dashboard-request'

export default class DashboardController {
    async main(request: MainDashboardRequest): Promise<MainDashboardResponse> {
        const attendances: AttendanceInterface[] =
            await AttendancesRepository.find({ estado: 'A' })
                .populate({
                    path: 'usuario',
                    /*match: {
                        estado: 'A',
                    },*/
                })
                .populate({
                    path: 'clase',
                    /*match: {
                        estado: 'A',
                    },*/
                })
        const roles: RoleInterface[] = await RolesRepository.find({
            estado: 'A',
        })
        const estudentRolesId: any[] = roles
            .filter((role: RoleInterface) => role.codigo === 'EST')
            .map((role: RoleInterface) => role._id)
        const users: UserInterface[] = await UsersRepository.find({
            estado: 'A',
        })
        const subjects: SubjectsInterface[] = await SubjectsRepository.find({
            estado: 'A',
        })
        const registers: RegisterInterface[] = await RegistersRepository.find({
            estado: 'A',
            usuario: request.userId,
        })

        const attendancesByDate: any = {}
        const attendancesDate: string[] = attendances.map(
            (attendance: AttendanceInterface) =>
                attendance.fechaCreacion.toISOString().split('T')[0]
        )
        attendancesDate.forEach((attendanceDate: string) => {
            if (Object.keys(attendancesByDate).includes(attendanceDate)) {
                attendancesByDate[attendanceDate] += 1
            } else {
                attendancesByDate[attendanceDate] = 1
            }
        })

        const students: number = users.filter(
            (user: UserInterface) =>
                user.rol.filter((role: string[]) =>
                    estudentRolesId.filter((id: any) => id === role)
                ).length > 0
        ).length

        const generalGrade: number = attendances
            .map((attendances: AttendanceInterface) => attendances.calificacion)
            .reduce((previous: number, current: number) => previous + current)

        const attendancesResume: any[] = attendances.map(
            (attendance: AttendanceInterface) => {
                return {
                    usuario: attendance.usuario.nombre,
                    clase: attendance.clase.tema,
                    calificacion: attendance.calificacion,
                }
            }
        )
        const attendancesResumeGroup: any = {}
        attendancesResume.forEach((attendancesResume: any) => {
            if (
                Object.keys(attendancesResumeGroup).includes(
                    attendancesResume.usuario
                )
            ) {
                attendancesResumeGroup[
                    attendancesResume.usuario
                ].calificacion += attendancesResume.calificacion
            } else {
                attendancesResumeGroup[attendancesResume.usuario] =
                    attendancesResume
            }
        })

        return {
            generalGrade: generalGrade / attendances.length,
            students,
            subjects: subjects.length,
            studentsForAssistant: registers.length,
            attendancesByDate,
            attendancesResume: Object.values(attendancesResumeGroup),
        }
    }
}
