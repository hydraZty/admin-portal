import React, { Component } from 'react';
import { Typography, Row, Col,Modal } from 'antd';
import PropTypes from 'prop-types';

import AddUserForm from './AddUserForm';
import AssignPermissionForm from './AssignPermissionForm';
import JoinGroupsForm from './JoinGroupsForm';

import './AddUserModal.less';
import { arborist } from '../../utils/API';
import { unflatten, formatPolicies, formatTreeData } from '../../utils/util';

class AddUserModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      step: 1,
      users: [],
      policies: [],
      groups: [],
      roleOptions: [],
      resourceOptions: [],
    };
  }

  loadRoleOptions = async () => {
    const resp = await arborist.get('/role');
    this.setState({
      roleOptions: resp.roles,
    });
  };

  loadResourceOptions = async () => {
    const resp = await arborist.get('/resource');
    const resources = formatTreeData(resp.resources);
    this.setState({
      resourceOptions: unflatten(resources),
    });
  };

  static propTypes = {
    onRef: PropTypes.func,
    closeModal: PropTypes.func,
  };

  componentDidMount () {
    this.props.onRef(this);
    document.title = 'Add New User';
    this.loadResourceOptions();
    this.loadRoleOptions();
  }

  onRefAddUserForm = (ref) => {
    this.addUserForm = ref;
  };

  onRefAssignPermissionForm = (ref) => {
    this.assignPermissionForm = ref;
  };

  onRefJoinGroupsForm = (ref) => {
    this.joinGroupsForm = ref;
  };

  componentWillUnmount () {
    document.title = 'Admin Portal';
  }

  handleNextStep () {
    switch (this.state.step) {
      case 1:
        this.handleSubmitFirstStep();
        break;
      case 2:
        this.handleSubmitSecondStep();
        break;
      case 3:
        this.handleSubmitThirdStep();
        break;
      default:
    }
  }

  handlePreviousStep () {
    this.setState({
      step: this.state.step - 1,
    });
  }


  async handleSubmitFirstStep () {
    const { users } = await this.addUserForm.handleSubmit();
    if (users) {
      this.setState({
        users,
        step: this.state.step + 1,
      });
    }else{
        Modal.error({
          title: 'Missing Users',
        });
    }
  }

  handleSubmitSecondStep () {
    const policies = this.assignPermissionForm.handleSubmit();
    if (policies && policies.length) {
      this.setState({
        policies,
        step: this.state.step + 1,
      });
    }else{
        Modal.error({
          title: 'Missing Policies',
        });
    }
  }


  async handleSubmitThirdStep () {
    const groups = this.joinGroupsForm.handleSubmit();
    if (groups && groups.length) {
      const policies = formatPolicies(this.state.policies);

      const content = {
        users: this.state.users,
        policies,
        groups: groups.map(group => group.group.key),

      };

      try {
        await arborist.post('/users', content);
        window.location.reload(false);
        this.props.closeModal();
      } catch (e) {
        Modal.error({
          title: 'Create User Fail',
        });
        console.log(e.error);
        return false;
      }
    }else{
        Modal.error({
          title: 'Missing Groups',
        });
    }
  }

  render () {
    return (
      <div>
        <div className={`container ${this.state.step !== 1 ? 'disabled' : null}`}>
          <Typography.Title level={4}>Step 1. Enter username and email</Typography.Title>
          <AddUserForm
            onRef={this.onRefAddUserForm}
          />
        </div>
        <div className={`container ${this.state.step !== 2 ? 'disabled' : null}`}>
          <Typography.Title level={4}>Step 2. Assign Permissions to new users</Typography.Title>
          <Row>
            <Col span={21} offset={2}>
              <AssignPermissionForm
                onRef={this.onRefAssignPermissionForm}
                roleOptions={this.state.roleOptions}
                resourceOptions={this.state.resourceOptions}
              />
            </Col>
          </Row>
        </div>
        <div className={`container ${this.state.step !== 3 ? 'disabled' : null}`}>
          <Typography.Title level={4}>Step 3. Join groups</Typography.Title>
          <Row>
            <Col span={21} offset={2}>
              <JoinGroupsForm
                onRef={this.onRefJoinGroupsForm}
              />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default AddUserModal;
