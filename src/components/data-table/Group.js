import React, { Component } from 'react';
import DropdownSelection from './DropdownSelection';

class Group extends Component {
  handleChangeOption = (selectedGroups) => {
    // TODO save groups to redux
  }

  render = () => (
    <DropdownSelection path="/group" field="groups" title="Groups" nameKeyword="name" handleChangeOption={this.handleChangeOption} />
  )
}

Group.propTypes = {
};

export default Group;
