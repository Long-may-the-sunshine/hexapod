import React, { Suspense } from "react"
import { SECTION_NAMES } from "./components/vars"
import { Nav, NavDetailed, DimensionsWidget } from "./components"
import { VIRTUAL_HEXAPOD } from "./templates"
import Routes from "./Routes"

const HexapodPlot = React.lazy(() =>
    import(/* webpackPrefetch: true */ "./components/HexapodPlot")
)

window.dataLayer = window.dataLayer || []
function gtag() {
    window.dataLayer.push(arguments)
}

class App extends React.Component {
    state = {
        inHexapodPage: false,
        hexapod: VIRTUAL_HEXAPOD,
        revision: 0,
    }

    /* * * * * * * * * * * * * *
     * Page load and plot update handlers
     * * * * * * * * * * * * * */

    onPageLoad = pageName => {
        gtag("config", "UA-170794768-1", {
            page_path: window.location.pathname + window.location.search,
        })

        this.setState({ inHexapodPage: pageName !== SECTION_NAMES.landingPage })
        document.title = pageName + " - Mithi's Hexapod Robot Simulator"
    }

    manageState = hexapod => {
        if (!hexapod || !hexapod.foundSolution) {
            return
        }

        this.setState({
            revision: this.state.revision + 1,
            hexapod,
        })
    }

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
        <>
            <Nav />
            <div className="main content">
                <div className="sidebar column-container cell">
                    <div hidden={!this.state.inHexapodPage}>
                        <DimensionsWidget
                            params={{
                                dimensions: this.state.hexapod.dimensions,
                                pose: this.state.hexapod.pose,
                            }}
                            onUpdate={this.manageState}
                        />
                    </div>
                    {Routes(this.pageComponent)}
                </div>
                <div className="plot border">
                    <Suspense fallback={<p>Loading 3d plot...</p>}>
                        <HexapodPlot
                            hexapod={this.state.hexapod}
                            revision={this.state.revision}
                        />
                    </Suspense>
                </div>
            </div>
            {this.state.inHexapodPage ? <NavDetailed /> : null}
        </>
    )
}

export default App
