import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DropdownSelection from './DropdownSelection';
import { setUserGroupFilterData, loadUserList } from '../../actions';

class Group extends Component {
  handleChangeOption = (selectedGroups) => {
    this.props.setUserGroupFilterData(selectedGroups);
    this.props.loadUserList();
  }

  render = () => (
    <DropdownSelection path="/group" field="groups" title="Groups" nameKeyword="name" selectedOptions={this.props.groups} handleChangeOption={this.handleChangeOption} />
  )
}

Group.propTypes = {
  groups: PropTypes.array,
  setUserGroupFilterData: PropTypes.func,
  loadUserList: PropTypes.func,
};

Group.defaultProps = {
  groups: [],
  setUserGroupFilterData: () => {},
  loadUserList: () => {},
};


const mapStateToProps = state => ({
  groups: state.userList.groups,
});


const mapDispatchToProps = {
  setUserGroupFilterData,
  loadUserList,
};


export default connect(mapStateToProps, mapDispatchToProps)(Group);
