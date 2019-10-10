import React, { Component } from 'react';
import { Checkbox, Collapse, Icon } from 'antd';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import { arborist } from '../../utils/API';
import './DropdownSelection.less';

const { Panel } = Collapse;

class DropdownSelection extends Component {
  constructor (props) {
    super(props);
    this.state = {
      options: [],
      selectedOptions: [],
    };
  }

  componentDidMount = async () => {
    await this.loadOptions();
  }

  loadOptions = async () => {
    const resp = await arborist.get(this.props.path);
    let options = resp[this.props.field];
    options = map(options, option => {
      option.checked = false;
      return option;
    });
    this.setState({
      options,
    });
  }

  onChange = (option, checked) => {
    // TODO emit all checked data to parent component
    const selectedOptions = [];
    option.checked = checked;
    for (const g of this.state.options) {
      if (g.checked) {
        selectedOptions.push(g);
      }
    }
    this.setState({
      selectedOptions,
    }, () => {
      this.props.handleChangeOption(this.state.selectedOptions);
    });
  }

  render = () => (
    <div className="dropdown-container">
      <Collapse
        bordered={false}
        defaultActiveKey={[`${this.props.path}_options`]}
        expandIconPosition="right"
        expandIcon={({ isActive }) => <Icon type="down" rotate={isActive ? 180 : 0} />}
      >
        <Panel header={this.props.title} key={`${this.props.path}_options`}>
          {
            this.state.options.map(option => (
              <Checkbox
                onChange={(event) => this.onChange(option, event.target.checked)}
                key={option[this.props.nameKeyword]}
              >
                { option[this.props.nameKeyword] }
              </Checkbox>
            ))
          }
        </Panel>
      </Collapse>
    </div>
  )
}

DropdownSelection.propTypes = {
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  nameKeyword: PropTypes.string.isRequired,
  handleChangeOption: PropTypes.func.isRequired,
};

export default DropdownSelection;
