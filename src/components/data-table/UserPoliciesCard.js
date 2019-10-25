import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Empty } from 'antd';

import AssignPermissionForm from '../user/AssignPermissionForm';
import { arborist } from '../../utils/API';
import {
  formatNamespaceTree,
} from '../../utils/util';
import './UserPoliciesCard.less';


class UserPoliciesCard extends Component {
  constructor (props) {
    super(props);
    this.state = {
      roleOptions: [],
      resourceOptions: [],
    };
  }

  componentDidMount () {
    this.props.onRef(this);
    this.loadResourceOptions();
    this.loadRoleOptions();
  }

  onRefAssignPermissionForm = (ref) => {
    this.assignPermissionForm = ref;
  };

  submitEdit = () => this.assignPermissionForm.handleSubmit();

  loadRoleOptions = async () => {
    const resp = await arborist.get('/role');
    this.setState({
      roleOptions: resp.roles,
    });
  };

  loadResourceOptions = async () => {
    const resp = await arborist.get('/resource');
    this.setState({
      resourceOptions: formatNamespaceTree(resp.resources),
    });
  };

  render () {
    return (
      <Card
        title="User Permissions"
        bordered={false}
        className="user-policies-card"
      >
        {
          this.props.policies.length || !this.props.readOnly ? (
            <AssignPermissionForm
              onRef={this.onRefAssignPermissionForm}
              readOnly={this.props.readOnly}
              policies={this.props.policies}
              roleOptions={this.state.roleOptions}
              resourceOptions={this.state.resourceOptions}
            />
          ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }
      </Card>
    );
  }
}

UserPoliciesCard.propTypes = {
  onRef: PropTypes.func,
  policies: PropTypes.array.isRequired,
  readOnly: PropTypes.bool,
};

UserPoliciesCard.defaultProps = {
  onRef: () => {},
  readOnly: true,
};


export default UserPoliciesCard;
