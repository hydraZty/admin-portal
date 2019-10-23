import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Input } from 'antd';
import './UserSearch.less';
import { loadUserList, setKeyword } from '../../actions';

const { Search } = Input;

class UserSearch extends Component {
  onSearch = (value) => {
    this.props.setKeyword(value);
    this.props.loadUserList();
  };

  render = () => (
    <div className="user-search">
      <Search
        className="search"
        placeholder="Username / Email"
        onSearch={this.onSearch}
      />
    </div>
  );
}

UserSearch.propTypes = {
  setKeyword: PropTypes.func,
  loadUserList: PropTypes.func,
};

UserSearch.defaultProps = {
  setKeyword: () => {},
  loadUserList: () => {},
};

const mapStateToProps = () => ({});


const mapDispatchToProps = {
  setKeyword,
  loadUserList,
};


export default connect(mapStateToProps, mapDispatchToProps)(UserSearch);
