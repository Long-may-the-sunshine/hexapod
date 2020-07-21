import React, { Suspense } from "react"
import { VirtualHexapod } from "./hexapod"
import * as defaults from "./templates"
import { SECTION_NAMES } from "./components/vars"
import { Nav, NavDetailed, DimensionsWidget } from "./components"

import { PATHS } from "./components/vars"
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import { ForwardKinematicsPage, LegPatternPage, LandingPage } from "./components/pages"

const HexapodPlot = React.lazy(() =>
    import(/* webpackPrefetch: true */ "./components/HexapodPlot")
)
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

window.dataLayer = window.dataLayer || []
function gtag() {
    window.dataLayer.push(arguments)
}
class App extends React.Component {
    state = {
        inHexapodPage: false,
        hexapod: new VirtualHexapod(defaults.DEFAULT_DIMENSIONS, defaults.DEFAULT_POSE),
        revision: 0,
    }

    /* * * * * * * * * * * * * *
     * Page load and plot update handlers
     * * * * * * * * * * * * * */

    onPageLoad = pageName => {
        gtag("config", "UA-170794768-1", {
            page_path: window.location.pathname + window.location.search,
        })

        if (pageName === SECTION_NAMES.landingPage) {
            this.setState({ inHexapodPage: false })
            return
        }

        this.setState({ inHexapodPage: true })
        this.manageState("both", {
            dimensions: this.state.hexapod.dimensions,
            pose: defaults.DEFAULT_POSE,
        })
    }

    manageState = (type, newParams) => {
        let hexapod = null

        if (type === "pose") {
            hexapod = new VirtualHexapod(this.state.hexapod.dimensions, newParams.pose)
        }

        if (type === "dimensions") {
            hexapod = new VirtualHexapod(newParams.dimensions, this.state.hexapod.pose)
        }

        if (type === "hexapod") {
            hexapod = newParams.hexapod
        }

        if (type === "both") {
            hexapod = new VirtualHexapod(newParams.dimensions, newParams.pose)
        }

        if (!hexapod || !hexapod.foundSolution) {
            return
        }

        this.setState({
            revision: this.state.revision + 1,
            hexapod,
        })
    }

    /* * * * * * * * * * * * * *
     * Widgets
     * * * * * * * * * * * * * */

    dimensions = () => (
        <div hidden={!this.state.inHexapodPage}>
            <DimensionsWidget
                params={{ dimensions: this.state.hexapod.dimensions }}
                onUpdate={this.manageState}
            />
        </div>
    )

    /* * * * * * * * * * * * * *
     * Pages
     * * * * * * * * * * * * * */
    pageComponent = Component => (
        <Suspense fallback={<h1>Loading page</h1>}>
            <Component
                onMount={this.onPageLoad}
                onUpdate={this.manageState}
                params={{
                    pose: this.state.hexapod.pose,
                    dimensions: this.state.hexapod.dimensions,
                }}
            />
        </Suspense>
    )

    /* * * * * * * * * * * * * *
     * Layout
     * * * * * * * * * * * * * */

    render = () => (
        <Router>
            <Nav />
            <div className="main content">
                <div className="sidebar column-container cell">
                    {this.dimensions()}
                    {Routes(this.pageComponent)}
                </div>
                {this.state.inHexapodPage ? (
                    <HexapodPlot
                        hexapod={this.state.hexapod}
                        revision={this.state.revision}
                    />
                ) : null}
            </div>
            {this.state.inHexapodPage ? <NavDetailed /> : null}
        </Router>
    )
}

export default App
