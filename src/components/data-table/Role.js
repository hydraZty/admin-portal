import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DropdownSelection from './DropdownSelection';
import { setUserRoleFilterData, loadUserList } from '../../actions';

class Role extends Component {
  handleChangeOption = (selectedRoles) => {
    this.props.setUserRoleFilterData(selectedRoles);
    this.props.loadUserList();
  };

  render = () => (
    <DropdownSelection
      path="/role"
      field="roles"
      title="Roles"
      nameKeyword="id"
      selectedOptions={this.props.roles}
      handleChangeOption={this.handleChangeOption}
    />
  );
}

Role.propTypes = {
  roles: PropTypes.array,
  setUserRoleFilterData: PropTypes.func,
  loadUserList: PropTypes.func,
};

Role.defaultProps = {
  roles: [],
  setUserRoleFilterData: () => {
  },
  loadUserList: () => {
  },
};


const mapStateToProps = state => ({
  roles: state.userList.roles,
});


const mapDispatchToProps = {
  setUserRoleFilterData,
  loadUserList,
};


export default connect(mapStateToProps, mapDispatchToProps)(Role);
