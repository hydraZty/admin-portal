import React, { Component } from 'react'
import { Typography, } from 'antd'
import PropTypes from 'prop-types'

// import API from '../../utils/API'
import AddUserForm from "./AddUserForm"
import AssignPermissionForm from "./AssignPermissionForm"
import JoinGroupsForm from "./JoinGroupsForm"

import './AddUserModal.less'
import { arborist } from "../../utils/API"

class AddUserModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      step: 1,
      users: [],
      policies: [],
      groups: [],
    }
  }

  static propTypes = {
    onRef: PropTypes.func,
    closeModal: PropTypes.func,
  }

  componentDidMount () {
    this.props.onRef(this)
    document.title = 'Add New User'
  }

  onRefAddUserForm = (ref) => {
    this.addUserForm = ref
  }

  onRefAssignPermissionForm = (ref) => {
    this.assignPermissionForm = ref
  }

  onRefJoinGroupsForm = (ref) => {
    this.joinGroupsForm = ref
  }

  componentWillUnmount () {
    document.title = 'Admin Portal'
  }

  handleNextStep () {
    switch (this.state.step) {
      case 1:
        this.handleSubmitFirstStep()
        break
      case 2:
        this.handleSubmitSecondStep()
        break
      case 3:
        this.handleSubmitThirdStep()
        break
      default:
    }
  }

  handlePreviousStep () {
    this.setState({
      step: this.state.step - 1
    })
  }


  async handleSubmitFirstStep () {
    let { users } = await this.addUserForm.handleSubmit()
    if (users) {
      this.setState({
        users: users,
        step: this.state.step + 1
      })
    }
  }

  handleSubmitSecondStep () {
    let policies = this.assignPermissionForm.handleSubmit()
    if (policies && policies.length) {
      this.setState({
        policies,
        step: this.state.step + 1
      })
    }
  }


  async handleSubmitThirdStep () {
    let groups = this.joinGroupsForm.handleSubmit()
    if (groups && groups.length) {

      let policies = []
      this.state.policies.map(item => {
        if (item.resources.length) {
          item.resources.map(resource => {
            policies.push({
              policy: `${resource.value.slice(1).replace(/\//ig, '.')}-${item.role.label}`,
              resource: resource.label,
              role: item.role.label
            })
          })
        } else {
          policies.push({
            policy: item.role.label,
            resource: "",
            role: item.role.label
          })
        }
      })

      let content = {
        users: this.state.users,
        policies,
        groups: groups.map(group => group.group.key)

      }

      try {
        await arborist.post('/users', content)
        this.props.closeModal()
      } catch (e) {
        console.log(e.message)
        return false
      }
    }
  }

  render () {

    return (
      <div>
        <div className={ `container ${this.state.step !== 1 ? "disabled" : null}` }>
          <Typography.Title level={ 4 }>Step 1. Enter username and email</Typography.Title>
          <AddUserForm
            onRef={ this.onRefAddUserForm }
          />
        </div>
        <div className={ `container ${this.state.step !== 2 ? "disabled" : null}` }>
          <Typography.Title level={ 4 }>Step 2. Assign Permissions to new users</Typography.Title>
          <AssignPermissionForm
            onRef={ this.onRefAssignPermissionForm }
          />
        </div>
        <div className={ `container ${this.state.step !== 3 ? "disabled" : null}` }>
          <Typography.Title level={ 4 }>Step 3. Join groups</Typography.Title>
          <JoinGroupsForm
            onRef={ this.onRefJoinGroupsForm }
          />
        </div>
      </div>
    )
  }
}

export default AddUserModal
