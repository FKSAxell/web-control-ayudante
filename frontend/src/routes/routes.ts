import Home from '../pages/home/home'
import Login from '../pages/login'
import NotFound from '../pages/not-found'

export interface Route {
    path: string
    component: any
}

const routes: Route[] = [
    {
        path: '/',
        component: Home,
    },
    {
        path: '/login',
        component: Login,
    },
    {
        path: '*',
        component: NotFound,
    },
]

export default routes
