import React, { Component } from 'react';
import DropdownSelection from './DropdownSelection';

class Role extends Component {
  handleChangeOption = (selectedRoles) => {
    // TODO save roles to redux
  }

  render = () => (
    <DropdownSelection path="/role" field="roles" title="Roles" nameKeyword="id" handleChangeOption={this.handleChangeOption} />
  )
}

Role.propTypes = {
};

export default Role;
