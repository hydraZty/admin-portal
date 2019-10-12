import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Button } from 'antd';

import UserPoliciesCard from './UserPoliciesCard';
import './RowDetail.less';

class RowDetail extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return (
      <div className="row-detail">
        <div className="user-info">
          <div className="info-wrapper">
            <Avatar size={44} style={{ marginRight: 16 }}>
              {this.props.user.name.split(' ').slice(0, 2).map(
                w => w[0],
              )}
            </Avatar>
            <div className="info-inner">
              <span className="user-name">{this.props.user.name}</span>
              <span className="user-email">{this.props.user.email}</span>
            </div>
          </div>
          <div className="actions">
            <Button>Disable</Button>
            <Button type="primary">Edit</Button>
          </div>
        </div>
        <UserPoliciesCard policies={this.props.user.policies} />
      </div>
    );
  }
}

RowDetail.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    policies: PropTypes.array,
  }).isRequired,
};

export default RowDetail;
