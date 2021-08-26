import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

//AUTH
export interface UserLoginResponse {
    token: string
    user: UsersResponse
}

//USER
export interface CreateUserRequest {
    nombre: string
    email: string
    password: string
    rol: string[]
}
export interface UsersResponse {
    _id: string
    rol: RolResponse[]
    nombre: string
    email: string
    password: string
    tokenFCM: string
    estado: string
}

//CLASSES
export interface CreateClassesRequest {
    tema: string
    descripcion: string
    enlace: string
    fechaClaseInicio: Date
    fechaClaseFin: Date
    location: string
    session: string
}

export interface ClassesRequest {
    tema: string
    descripcion: string
    enlace: string
    fechaClase: Date
}

export interface ClassesResponse {
    _id: string
    sesion: SessionResponse
    tema: string
    descripcion: string
    enlace: string
    fechaClaseFin: Date
    fechaClaseInicio: Date
    ubicacion: LocationResponse
    estado: string
}

// ROLE
export interface RolResponse {
    _id: string
    nombre: string
    codigo: string
    estado: string
}

export interface UpdateRolResponse {
    nombre: string
    codigo: string
}
export interface CreateRoleRequest {
    codigo: string
    nombre: string
}

// LOCATION
export interface LocationResponse {
    _id: string
    codigo: string
    estado: string
    nombre: string
}

export interface LocationsResponse {
    _id: string
    estado: string
    nombre: string
    codigo: string
}

export interface CreateLocationRequest {
    codigo: string
    nombre: string
}

// SESSION
export interface SessionResponse {
    _id: string
    ayudantia: AssistantshipResponse
    dia: number
    estado: string
    horaFin: number
    horaInicio: number
    minutoFin: number
    minutoInicio: number
}

export interface CreateSessionRequest {
    ayudantia: string
    dia: number
    horaFin: number
    horaInicio: number
    minutoFin: number
    minutoInicio: number
}

export interface UpdateSessionRequest {
    ayudantia: string
    dia: number
    horaFin: number
    horaInicio: number
    minutoFin: number
    minutoInicio: number
}

// FACULTY
export interface FacultyResponse {
    _id: string
    codigo: string
    nombre: string
    estado: string
}

export interface CreateFacultyRequest {
    codigo: string
    nombre: string
}

export interface UpdateFacultyRequest {
    codigo: string
    nombre: string
}

// SUBJECT
export interface SubjectResponse {
    _id: string
    codigo: string
    nombre: string
    facultad: FacultyResponse
}

export interface CreateSubjectRequest {
    codigo: string
    nombre: string
    facultad: string
}

export interface UpdateSubjectRequest {
    codigo: string
    nombre: string
    facultad: string
}

// ATTENDANCE
export interface AttendanceResponse {
    _id: string
    usuario: UsersResponse
    clase: ClassesResponse
    calificacion: number
    estado: string
}

export interface UpdateAttendanceResponse {
    usuario: string
    clase: string
    calificacion: number
}

export interface CreateAttendanceRequest {
    usuario: string
    clase: string
    calificacion: number
}

// ASSISTANSHIP
export interface AssistantshipResponse {
    _id: string
    usuario: UsersResponse
    materia: SubjectResponse
    fechaInicio: Date
    fechaFin: Date
    estado: string
}

export interface UpdateAssistantshipResponse {
    usuario: string
    materia: string
    fechaInicio: Date
    fechaFin: Date
}

export interface CreateAssistantshipRequest {
    usuario: string
    materia: string
    fechaInicio: Date
    fechaFin: Date
}

// CAREER
export interface CareerResponse {
    _id: string
    facultad: FacultyResponse
    nombre: string
    estado: string
}

export interface UpdateCareerResponse {
    facultad: string
    nombre: string
}

export interface CreateCareerRequest {
    facultad: string
    nombre: string
}

// REGISTER
export interface RegisterResponse {
    _id: string
    usuario: UsersResponse
    materia: SubjectResponse
    estado: string
}

export interface UpdateRegisterResponse {
    usuario: string
    materia: string
}

export interface CreateRegisterRequest {
    usuario: string
    materia: string
}

// FAVORITE
export interface FavoriteResponse {
    _id: string
    usuario: UsersResponse
    sesion: SessionResponse
    estado: string
}

export interface UpdateFavoriteResponse {
    usuario: string
    sesion: string
}

export interface CreateFavoriteRequest {
    usuario: string
    sesion: string
}

export default class Backend {
    private static url: string = `${process.env.REACT_APP_BACKEND_PROTOCOL}://${process.env.REACT_APP_BACKEND_HOSTNAME}:${process.env.REACT_APP_BACKEND_PORT}/api`

    // AUTH
    static async login(
        email: string,
        password: string
    ): Promise<UserLoginResponse> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'post',
            url: `${this.url}/users/login`,
            data: {
                email,
                password,
            },
        }
        const axiosResponse: AxiosResponse<UserLoginResponse> = await Axios(
            axiosRequestConfig
        )
        return axiosResponse.data
    }

    // USER
    static async getUsers(token: string): Promise<UsersResponse[]> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'get',
            url: `${this.url}/users`,
            headers: {
                'x-token': token,
            },
        }
        const axiosResponse: AxiosResponse<UsersResponse[]> = await Axios(
            axiosRequestConfig
        )
        return axiosResponse.data
    }

    static async createUser(
        token: string,
        request: CreateUserRequest
    ): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'post',
            url: `${this.url}/users`,
            headers: {
                'x-token': token,
            },
            data: request,
        }
        await Axios(axiosRequestConfig)
    }

    static async updateUser(
        token: string,
        id: string,
        request: CreateUserRequest
    ): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'patch',
            url: `${this.url}/users/${id}`,
            headers: {
                'x-token': token,
            },
            data: request,
        }
        await Axios(axiosRequestConfig)
    }

    static async deleteUser(token: string, id: string): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'delete',
            url: `${this.url}/users/${id}`,
            headers: {
                'x-token': token,
            },
        }
        await Axios(axiosRequestConfig)
    }

    // CLASSES
    static async getClasses(token: string): Promise<ClassesResponse[]> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'get',
            url: `${this.url}/classes`,
            headers: {
                'x-token': token,
            },
        }
        const axiosResponse: AxiosResponse<ClassesResponse[]> = await Axios(
            axiosRequestConfig
        )
        return axiosResponse.data
    }

    static async createClass(
        token: string,
        classesRequest: CreateClassesRequest
    ): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'post',
            url: `${this.url}/classes`,
            headers: {
                'x-token': token,
            },
            data: classesRequest,
        }
        await Axios(axiosRequestConfig)
    }

    static async updateClass(
        token: string,
        id: string,
        classesRequest: CreateClassesRequest
    ): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'patch',
            url: `${this.url}/classes/${id}`,
            headers: {
                'x-token': token,
            },
            data: classesRequest,
        }
        await Axios(axiosRequestConfig)
    }

    static async deleteClass(token: string, id: string): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'delete',
            url: `${this.url}/classes/${id}`,
            headers: {
                'x-token': token,
            },
        }
        await Axios(axiosRequestConfig)
    }

    // ROLE
    static async getRoles(token: string): Promise<RolResponse[]> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'get',
            url: `${this.url}/roles`,
            headers: {
                'x-token': token,
            },
        }
        const axiosResponse: AxiosResponse<RolResponse[]> = await Axios(
            axiosRequestConfig
        )
        return axiosResponse.data
    }

    static async createRole(
        token: string,
        request: CreateRoleRequest
    ): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'post',
            url: `${this.url}/roles`,
            headers: {
                'x-token': token,
            },
            data: request,
        }
        await Axios(axiosRequestConfig)
    }

    static async updateRole(
        token: string,
        id: string,
        classesRequest: CreateRoleRequest
    ): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'patch',
            url: `${this.url}/roles/${id}`,
            headers: {
                'x-token': token,
            },
            data: classesRequest,
        }
        await Axios(axiosRequestConfig)
    }

    static async deleteRole(token: string, id: string): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'delete',
            url: `${this.url}/roles/${id}`,
            headers: {
                'x-token': token,
            },
        }
        await Axios(axiosRequestConfig)
    }

    // LOCATION
    static async getLocations(token: string): Promise<LocationResponse[]> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'get',
            url: `${this.url}/locations`,
            headers: {
                'x-token': token,
            },
        }
        const axiosResponse: AxiosResponse<LocationResponse[]> = await Axios(
            axiosRequestConfig
        )
        return axiosResponse.data
    }

    static async createLocation(
        token: string,
        classesRequest: CreateLocationRequest
    ): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'post',
            url: `${this.url}/locations`,
            headers: {
                'x-token': token,
            },
            data: classesRequest,
        }
        await Axios(axiosRequestConfig)
    }

    static async updateLocation(
        token: string,
        id: string,
        request: CreateLocationRequest
    ): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'patch',
            url: `${this.url}/locations/${id}`,
            headers: {
                'x-token': token,
            },
            data: request,
        }
        await Axios(axiosRequestConfig)
    }

    static async deleteLocation(token: string, id: string): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'delete',
            url: `${this.url}/locations/${id}`,
            headers: {
                'x-token': token,
            },
        }
        await Axios(axiosRequestConfig)
    }

    // SESSIONS
    static async getSession(token: string): Promise<SessionResponse[]> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'get',
            url: `${this.url}/sessions`,
            headers: {
                'x-token': token,
            },
        }
        const axiosResponse: AxiosResponse<SessionResponse[]> = await Axios(
            axiosRequestConfig
        )
        return axiosResponse.data
    }

    static async createSession(
        token: string,
        request: CreateSessionRequest
    ): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'post',
            url: `${this.url}/sessions`,
            headers: {
                'x-token': token,
            },
            data: request,
        }
        await Axios(axiosRequestConfig)
    }

    static async updateSession(
        token: string,
        id: string,
        request: UpdateSessionRequest
    ): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'patch',
            url: `${this.url}/sessions/${id}`,
            headers: {
                'x-token': token,
            },
            data: request,
        }
        await Axios(axiosRequestConfig)
    }

    static async deleteSession(token: string, id: string): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'delete',
            url: `${this.url}/sessions/${id}`,
            headers: {
                'x-token': token,
            },
        }
        await Axios(axiosRequestConfig)
    }

    // FACULTY
    static async getFaculties(token: string): Promise<FacultyResponse[]> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'get',
            url: `${this.url}/faculties`,
            headers: {
                'x-token': token,
            },
        }
        const axiosResponse: AxiosResponse<FacultyResponse[]> = await Axios(
            axiosRequestConfig
        )
        return axiosResponse.data
    }

    static async createFaculty(
        token: string,
        request: CreateFacultyRequest
    ): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'post',
            url: `${this.url}/faculties`,
            headers: {
                'x-token': token,
            },
            data: request,
        }
        await Axios(axiosRequestConfig)
    }

    static async updateFaculty(
        token: string,
        id: string,
        request: CreateFacultyRequest
    ): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'patch',
            url: `${this.url}/faculties/${id}`,
            headers: {
                'x-token': token,
            },
            data: request,
        }
        await Axios(axiosRequestConfig)
    }

    static async deleteFaculty(token: string, id: string): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'delete',
            url: `${this.url}/faculties/${id}`,
            headers: {
                'x-token': token,
            },
        }
        await Axios(axiosRequestConfig)
    }

    // SUBJECT
    static async getSubjects(token: string): Promise<SubjectResponse[]> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'get',
            url: `${this.url}/subjects`,
            headers: {
                'x-token': token,
            },
        }
        const axiosResponse: AxiosResponse<SubjectResponse[]> = await Axios(
            axiosRequestConfig
        )
        return axiosResponse.data
    }

    static async createSubject(
        token: string,
        request: CreateSubjectRequest
    ): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'post',
            url: `${this.url}/subjects`,
            headers: {
                'x-token': token,
            },
            data: request,
        }
        await Axios(axiosRequestConfig)
    }

    static async updateSubject(
        token: string,
        id: string,
        request: CreateSubjectRequest
    ): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'patch',
            url: `${this.url}/subjects/${id}`,
            headers: {
                'x-token': token,
            },
            data: request,
        }
        await Axios(axiosRequestConfig)
    }

    static async deleteSubject(token: string, id: string): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'delete',
            url: `${this.url}/subjects/${id}`,
            headers: {
                'x-token': token,
            },
        }
        await Axios(axiosRequestConfig)
    }

    // ATTENDANCE
    static async getAttendances(token: string): Promise<AttendanceResponse[]> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'get',
            url: `${this.url}/attendances`,
            headers: {
                'x-token': token,
            },
        }
        const axiosResponse: AxiosResponse<AttendanceResponse[]> = await Axios(
            axiosRequestConfig
        )
        return axiosResponse.data
    }

    static async createAttendance(
        token: string,
        request: CreateAttendanceRequest
    ): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'post',
            url: `${this.url}/attendances`,
            headers: {
                'x-token': token,
            },
            data: request,
        }
        await Axios(axiosRequestConfig)
    }

    static async updateAttendances(
        token: string,
        id: string,
        request: CreateAttendanceRequest
    ): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'patch',
            url: `${this.url}/attendances/${id}`,
            headers: {
                'x-token': token,
            },
            data: request,
        }
        await Axios(axiosRequestConfig)
    }

    static async deleteAttendances(token: string, id: string): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'delete',
            url: `${this.url}/attendances/${id}`,
            headers: {
                'x-token': token,
            },
        }
        await Axios(axiosRequestConfig)
    }

    // ASSISTANTSHIP
    static async getAssistanship(
        token: string
    ): Promise<AssistantshipResponse[]> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'get',
            url: `${this.url}/assistantships`,
            headers: {
                'x-token': token,
            },
        }
        const axiosResponse: AxiosResponse<AssistantshipResponse[]> =
            await Axios(axiosRequestConfig)
        return axiosResponse.data
    }

    static async createAssistanship(
        token: string,
        request: CreateAssistantshipRequest
    ): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'post',
            url: `${this.url}/assistantships`,
            headers: {
                'x-token': token,
            },
            data: request,
        }
        await Axios(axiosRequestConfig)
    }

    static async updateAssistanship(
        token: string,
        id: string,
        request: CreateAssistantshipRequest
    ): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'patch',
            url: `${this.url}/assistantships/${id}`,
            headers: {
                'x-token': token,
            },
            data: request,
        }
        await Axios(axiosRequestConfig)
    }

    static async deleteAssistanship(token: string, id: string): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'delete',
            url: `${this.url}/assistantships/${id}`,
            headers: {
                'x-token': token,
            },
        }
        await Axios(axiosRequestConfig)
    }

    // CAREER
    static async getCareers(token: string): Promise<CareerResponse[]> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'get',
            url: `${this.url}/careers`,
            headers: {
                'x-token': token,
            },
        }
        const axiosResponse: AxiosResponse<CareerResponse[]> = await Axios(
            axiosRequestConfig
        )
        return axiosResponse.data
    }

    static async createCareer(
        token: string,
        request: CreateCareerRequest
    ): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'post',
            url: `${this.url}/careers`,
            headers: {
                'x-token': token,
            },
            data: request,
        }
        await Axios(axiosRequestConfig)
    }

    static async updateCareer(
        token: string,
        id: string,
        request: UpdateCareerResponse
    ): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'patch',
            url: `${this.url}/careers/${id}`,
            headers: {
                'x-token': token,
            },
            data: request,
        }
        await Axios(axiosRequestConfig)
    }

    static async deleteCareer(token: string, id: string): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'delete',
            url: `${this.url}/careers/${id}`,
            headers: {
                'x-token': token,
            },
        }
        await Axios(axiosRequestConfig)
    }

    // REGISTER
    static async getRegisters(token: string): Promise<RegisterResponse[]> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'get',
            url: `${this.url}/registers`,
            headers: {
                'x-token': token,
            },
        }
        const axiosResponse: AxiosResponse<RegisterResponse[]> = await Axios(
            axiosRequestConfig
        )
        return axiosResponse.data
    }

    static async createRegister(
        token: string,
        request: CreateRegisterRequest
    ): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'post',
            url: `${this.url}/registers`,
            headers: {
                'x-token': token,
            },
            data: request,
        }
        await Axios(axiosRequestConfig)
    }

    static async updateRegister(
        token: string,
        id: string,
        request: UpdateRegisterResponse
    ): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'patch',
            url: `${this.url}/registers/${id}`,
            headers: {
                'x-token': token,
            },
            data: request,
        }
        await Axios(axiosRequestConfig)
    }

    static async deleteRegister(token: string, id: string): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'delete',
            url: `${this.url}/registers/${id}`,
            headers: {
                'x-token': token,
            },
        }
        await Axios(axiosRequestConfig)
    }

    // FAVORITE
    static async getFavorite(token: string): Promise<FavoriteResponse[]> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'get',
            url: `${this.url}/favorites`,
            headers: {
                'x-token': token,
            },
        }
        const axiosResponse: AxiosResponse<FavoriteResponse[]> = await Axios(
            axiosRequestConfig
        )
        return axiosResponse.data
    }

    static async createFavorite(
        token: string,
        request: CreateFavoriteRequest
    ): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'post',
            url: `${this.url}/favorites`,
            headers: {
                'x-token': token,
            },
            data: request,
        }
        await Axios(axiosRequestConfig)
    }

    static async updateFavorite(
        token: string,
        id: string,
        request: UpdateFavoriteResponse
    ): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'patch',
            url: `${this.url}/favorites/${id}`,
            headers: {
                'x-token': token,
            },
            data: request,
        }
        await Axios(axiosRequestConfig)
    }

    static async deleteFavorite(token: string, id: string): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'delete',
            url: `${this.url}/favorites/${id}`,
            headers: {
                'x-token': token,
            },
        }
        await Axios(axiosRequestConfig)
    }

    // DASHBOARD
    static async getMainDashboard(
        token: string,
        userId: string | undefined
    ): Promise<void> {
        const axiosRequestConfig: AxiosRequestConfig = {
            method: 'post',
            url: `${this.url}/dashboards/main`,
            headers: {
                'x-token': token,
            },
            data: {
                userId,
            },
        }
        const axiosResponse: AxiosResponse<any> = await Axios(
            axiosRequestConfig
        )
        return axiosResponse.data
    }
}
