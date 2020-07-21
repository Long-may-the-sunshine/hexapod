import React, { Suspense } from "react"
import ReactDOM from "react-dom"
import "./index.css"
import "./font.css"
import * as serviceWorker from "./serviceWorker"
import { BrowserRouter as Router } from "react-router-dom"

const App = React.lazy(() => import("./App"))

ReactDOM.render(
    <React.StrictMode>
        <Suspense fallback={<h1>Loading...</h1>}>
            <Router>
                <App />
            </Router>
        </Suspense>
    </React.StrictMode>,
    document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
