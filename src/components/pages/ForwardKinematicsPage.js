import React, { Component } from "react"
import LegPoseWidget from "./LegPoseWidgets"
import { Card, ToggleSwitch, ResetButton, NumberInputField, Slider } from "../generic"
import { DEFAULT_POSE } from "../../templates"
import { SECTION_NAMES, LEG_NAMES } from "../vars"
import { VirtualHexapod } from "../../hexapod"

class ForwardKinematicsPage extends Component {
    pageName = SECTION_NAMES.forwardKinematics
    state = { WidgetType: NumberInputField }

    componentDidMount = () => {
        this.props.onMount(this.pageName)
        this.reset()
    }

    reset = () => {
        const hexapod = new VirtualHexapod(this.props.params.dimensions, DEFAULT_POSE)
        this.props.onUpdate(hexapod)
    }

    updatePose = (name, angle, value) => {
        const pose = this.props.params.pose
        const newPose = {
            ...pose,
            [name]: { ...pose[name], [angle]: value },
        }
        const hexapod = new VirtualHexapod(this.props.params.dimensions, newPose)
        this.props.onUpdate(hexapod)
    }

    toggleMode = () => {
        const WidgetType = this.state.WidgetType === Slider ? NumberInputField : Slider
        this.setState({ WidgetType })
    }

    legPoseWidget = name => (
        <LegPoseWidget
            key={name}
            name={name}
            pose={this.props.params.pose[name]}
            onUpdate={this.updatePose}
            WidgetType={this.state.WidgetType}
            renderStacked={this.state.WidgetType === Slider}
        />
    )

    get toggleSwitch() {
        const props = {
            id: "FwdKinematicsSwitch",
            value: this.state.WidgetType === Slider ? "Slider" : "Field",
            handleChange: this.toggleMode,
            showValue: true,
        }

        return <ToggleSwitch {...props} />
    }

    render = () => (
        <Card title={<h2>{this.pageName}</h2>} other={this.toggleSwitch}>
            <div className="grid-cols-2">
                {LEG_NAMES.map(name => this.legPoseWidget(name))}
            </div>
            <ResetButton reset={this.reset} />
        </Card>
    )
}

export default ForwardKinematicsPage
