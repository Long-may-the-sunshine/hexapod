import React, { Suspense } from "react"
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import { VirtualHexapod } from "./hexapod"
import * as defaults from "./templates"
import { SECTION_NAMES, PATHS } from "./components/vars"
import { Nav, NavDetailed, DimensionsWidget } from "./components"
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
        this.updatePlot(this.state.hexapod.dimensions, defaults.DEFAULT_POSE)
    }

    updatePlotWithHexapod = hexapod => {
        if (!hexapod || !hexapod.foundSolution) {
            return
        }

        this.setState({
            revision: this.state.revision + 1,
            hexapod,
        })
    }

    updatePlot = (dimensions, pose) => {
        const newHexapodModel = new VirtualHexapod(dimensions, pose)
        this.updatePlotWithHexapod(newHexapodModel)
    }

    updateDimensions = dimensions => this.updatePlot(dimensions, this.state.hexapod.pose)

    updatePose = pose => this.updatePlot(this.state.hexapod.dimensions, pose)

    /* * * * * * * * * * * * * *
     * Widgets
     * * * * * * * * * * * * * */

    dimensions = () => (
        <div hidden={!this.state.inHexapodPage}>
            <DimensionsWidget
                params={{ dimensions: this.state.hexapod.dimensions }}
                onUpdate={this.updateDimensions}
            />
        </div>
    )

    /* * * * * * * * * * * * * *
     * Pages
     * * * * * * * * * * * * * */
    pageComponent = (Component, onUpdate) => (
        <Suspense fallback={<h1>Loading page</h1>}>
            <Component
                onMount={this.onPageLoad}
                onUpdate={onUpdate}
                params={{
                    pose: this.state.hexapod.pose,
                    dimensions: this.state.hexapod.dimensions,
                }}
            />
        </Suspense>
    )

    pageLanding = () => this.pageComponent(LandingPage)

    pagePatterns = () => this.pageComponent(LegPatternPage, this.updatePose)

    pageIk = () => this.pageComponent(InverseKinematicsPage, this.updatePlotWithHexapod)

    pageFk = () => this.pageComponent(ForwardKinematicsPage, this.updatePose)

    pageWalking = () => this.pageComponent(WalkingGaitsPage, this.updatePlotWithHexapod)

    page = () => (
        <Switch>
            <Route path="/" exact component={this.pageLanding} />
            <Route path={PATHS.legPatterns.path} exact component={this.pagePatterns} />
            <Route path={PATHS.forwardKinematics.path} exact component={this.pageFk} />
            <Route path={PATHS.inverseKinematics.path} exact component={this.pageIk} />
            <Route path={PATHS.walkingGaits.path} exact component={this.pageWalking} />
            <Route>
                <Redirect to="/" />
            </Route>
        </Switch>
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
                    {this.page()}
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
