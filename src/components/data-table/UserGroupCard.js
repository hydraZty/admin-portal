import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Empty } from 'antd';

import JoinGroupsForm from '../user/JoinGroupsForm';
import { arborist } from '../../utils/API';
import './UserGroupCard.less';


class UserPoliciesCard extends Component {
  constructor (props) {
    super(props);
    this.state = {
      groupOptions: [],
    };
  }

  componentDidMount () {
    this.props.onRef(this);
    this.loadGroupOptions();
  }

  onRefJoinGroupsForm = (ref) => {
    this.JoinGroupsForm = ref;
  };

  submitEdit = () => this.JoinGroupsForm.handleSubmit();

  loadGroupOptions = async () => {
    const resp = await arborist.get('/group');
    this.setState({
      groupOptions: resp.groups,
    });
  };

  render () {
    return (
      <Card
        title="Groups"
        bordered={false}
        className="row-detail-card"
      >
        {
          this.props.groups.length || !this.props.readOnly ? (
            <JoinGroupsForm
              onRef={this.onRefJoinGroupsForm}
              readOnly={this.props.readOnly}
              groups={this.props.groups}
              groupOptions={this.state.groupOptions}
            />
          ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }
      </Card>
    );
  }
}

UserPoliciesCard.propTypes = {
  onRef: PropTypes.func,
  groups: PropTypes.array.isRequired,
  readOnly: PropTypes.bool,
};

UserPoliciesCard.defaultProps = {
  onRef: () => {},
  readOnly: true,
};


export default UserPoliciesCard;
