import React, { Component } from 'react';
import {
  Typography, Row, Col, Modal,
} from 'antd';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { loadUserList } from '../../actions';
import AddUserForm from './AddUserForm';
import AssignPermissionForm from './AssignPermissionForm';
import JoinGroupsForm from './JoinGroupsForm';
import { arborist } from '../../utils/API';
import { unflatten, formatPolicies, formatTreeData } from '../../utils/util';
import './AddUserModal.less';


class AddUserModal extends Component {
  constructor (props) {
    super(props);
    this.state = {
      step: 1,
      users: [],
      policies: [],
      roleOptions: [],
      resourceOptions: [],
      groupOptions: [],
    };
  }

  componentDidMount () {
    this.props.onRef(this);
    document.title = 'Add New User';
    this.loadResourceOptions();
    this.loadRoleOptions();
    this.loadGroupOptions();
  }

  componentWillUnmount () {
    document.title = 'Admin Portal';
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

  loadGroupOptions = async () => {
    const resp = await arborist.get('/group');
    this.setState({
      groupOptions: resp.groups,
    });
  };

  onRefAddUserForm = (ref) => {
    this.addUserForm = ref;
  };

  onRefAssignPermissionForm = (ref) => {
    this.assignPermissionForm = ref;
  };

  onRefJoinGroupsForm = (ref) => {
    this.joinGroupsForm = ref;
  };

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
    this.setState(prevState => ({
      step: prevState.step - 1,
    }));
  }

  async handleSubmitFirstStep () {
    const { users } = await this.addUserForm.handleSubmit();
    if (users) {
      this.setState(prevState => ({
        users,
        step: prevState.step + 1,
      }));
    } else {
      Modal.error({
        title: 'Missing Users',
      });
    }
  }

  handleSubmitSecondStep () {
    const policies = this.assignPermissionForm.handleSubmit();
    if (policies && policies.length) {
      this.setState(prevState => ({
        policies,
        step: prevState.step + 1,
      }));
    } else {
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
        groups: groups.map(group => group.name),
      };

      try {
        await arborist.post('/users', content);
        this.props.loadUserList();
        this.props.closeModal();
      } catch (e) {
        Modal.error({
          title: 'Create User Fail',
        });
        return false;
      }
    } else {
      Modal.error({
        title: 'Missing Groups',
      });
    }
    return false;
  }

  render () {
    return (
      <div>
        <div className={this.state.step !== 1 ? 'add-user-modal--disabled' : null}>
          <Typography.Title level={4}>Step 1. Enter username and email</Typography.Title>
          <AddUserForm
            onRef={this.onRefAddUserForm}
          />
        </div>
        <div className={this.state.step !== 2 ? 'add-user-modal--disabled' : null}>
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
        <div className={this.state.step !== 3 ? 'add-user-modal--disabled' : null}>
          <Typography.Title level={4}>Step 3. Join groups</Typography.Title>
          <Row>
            <Col span={21} offset={2}>
              <JoinGroupsForm
                onRef={this.onRefJoinGroupsForm}
                groupOptions={this.state.groupOptions}
              />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

AddUserModal.propTypes = {
  onRef: PropTypes.func,
  closeModal: PropTypes.func,
  loadUserList: PropTypes.func,
};

AddUserModal.defaultProps = {
  onRef: () => {
  },
  closeModal: () => {
  },
  loadUserList: () => {
  },
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  loadUserList,
};


export default connect(mapStateToProps, mapDispatchToProps)(AddUserModal);
