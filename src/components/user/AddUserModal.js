import React, { Component } from 'react'
import { Typography, } from 'antd'
import PropTypes from 'prop-types'

// import API from '../../utils/API'
import AddUserForm from "./AddUserForm"
import AssignPermissionForm from "./AssignPermissionForm"
import JoinGroupsForm from "./JoinGroupsForm"

import './AddUserModal.less'

class AddUserModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      step: 1,
      users: [],
      roles: [],
      groups: [],
    }
  }

  static propTypes = {
    onRef: PropTypes.func,
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
        step: this.state.step + 1
      })
    }
  }

  handleSubmitSecondStep () {
    let roles = this.assignPermissionForm.handleSubmit()
    console.log(roles)
    if (roles && roles.length) {
      this.setState({
        step: this.state.step + 1
      })
    }
  }


  handleSubmitThirdStep () {
    let groups = this.joinGroupsForm.handleSubmit()
    console.log(groups)
    if (groups && groups.length) {
      this.setState({
        step: this.state.step + 1
      })
    }
  }

  render () {
    return (
      this.state.step === 1 ?
        <div className="container">
          <Typography.Title level={ 4 }>Step 1. Enter username and email</Typography.Title>
          <div className="">
            <AddUserForm
              onRef={ this.onRefAddUserForm }
            />
          </div>
        </div>
        : this.state.step === 2 ?
        <div className="container">
          <Typography.Title level={ 4 }>Step 2. Assign Permissions to new users</Typography.Title>
          <AssignPermissionForm
            onRef={ this.onRefAssignPermissionForm }
          />
        </div>
        : this.state.step === 3 ?
          <div className="container">
            <Typography.Title level={ 4 }>Step 3. Join groups</Typography.Title>
            <JoinGroupsForm
              onRef={ this.onRefJoinGroupsForm }
            />
          </div>
          :
          null
    )
  }
}

export default AddUserModal
