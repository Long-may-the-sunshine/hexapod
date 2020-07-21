import React from "react"
import { PATHS } from "./components/vars"
import { Route, Switch, Redirect } from "react-router-dom"
import { ForwardKinematicsPage, LegPatternPage, LandingPage } from "./components/pages"

const InverseKinematicsPage = React.lazy(() =>
    import(/* webpackPrefetch: true */ "./components/pages/InverseKinematicsPage")
)
const WalkingGaitsPage = React.lazy(() =>
    import(/* webpackPrefetch: true */ "./components/pages/WalkingGaitsPage")
)

const Routes = pageComponent => (
    <Switch>
        <Route path="/" exact>
            {pageComponent(LandingPage)}
        </Route>
        <Route path={PATHS.legPatterns.path} exact>
            {pageComponent(LegPatternPage)}
        </Route>
        <Route path={PATHS.forwardKinematics.path} exact>
            {pageComponent(InverseKinematicsPage)}
        </Route>
        <Route path={PATHS.inverseKinematics.path} exact>
            {pageComponent(ForwardKinematicsPage)}
        </Route>
        <Route path={PATHS.walkingGaits.path} exact>
            {pageComponent(WalkingGaitsPage)}
        </Route>
        <Route>
            <Redirect to="/" />
        </Route>
    </Switch>
)

export default Routes
