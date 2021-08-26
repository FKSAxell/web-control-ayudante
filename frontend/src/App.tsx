import React from 'react'
import './styles/w3.css'
import { Provider } from 'react-redux'
import Store from './store/store'
import { HashRouter, Switch, Route } from 'react-router-dom'
import Routers, { Route as EachRoute } from './routes/routes'

export interface AppProps {
}

export interface AppState {

}

export default class App extends React.Component<AppProps, AppState> {
    render(): React.ReactElement {
        return (
            <Provider store={Store}>
                <HashRouter>
                    <Switch>
                        {Routers.map((route: EachRoute) => (
                            <Route
                                key={route.path}
                                exact
                                path={route.path}
                                component={route.component}
                            />
                        ))}
                    </Switch>
                </HashRouter>
            </Provider>
        )
    }
}
