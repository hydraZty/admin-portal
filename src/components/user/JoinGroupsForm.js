import React from "react"
import { Form, Icon, Row, Col, Select } from "antd"
import PropTypes from 'prop-types'

import "./JoinGroupsForm.less"

const JoinGroupsForm = Form.create({ name: 'join_groups_form' })(
  class extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        groupOptions: [
          { label: 'CTDS-Mgmt', id: 1 },
          { label: 'CTDS-Dev', id: 2 },
          { label: 'NIAID-Mgmt', id: 3 },
          { label: 'NiAID-Dev', id: 4 },
        ],
        groupData: [],
      }
    }


    static propTypes = {
      onRef: PropTypes.func,
    }

    componentDidMount () {
      this.props.onRef(this)
    }

    handleSubmit = () => {
      return this.state.groupData
    }

    AddGruop = () => {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.setState({
            groupData: this.state.groupData.concat(values)
          })
          this.props.form.resetFields()
        } else {
          return err
        }
      })
    }

    removeGroup = (index) => {
      this.state.groupData.splice(index, 1)
      this.setState({
        groupData: this.state.groupData
      })
    }

    render () {
      const { form } = this.props
      const { getFieldDecorator } = form

      // Filter the options has added
      const filteredGroupOptions = this.state.groupOptions.filter(o => {
        let keys = this.state.groupData.map(i => i.group.key)
        return !keys.includes(o.id)
      })

      return (
        <Row>
          <Col span={ 22 } offset={ 2 }>
            <Row>
              <Form>
                <Col span={ 22 }>
                  <Form.Item className="group-form-item">
                    { getFieldDecorator('group', {
                      rules: [{ required: true, message: 'Required' }],
                    })(
                      <Select
                        labelInValue
                        showSearch
                        showArrow={ false }
                        style={ { width: '98%' } }
                        placeholder="Enter group name keyword">
                        {
                          filteredGroupOptions.map(r => {
                            return <Select.Option value={ r.id }>{ r.label }</Select.Option>
                          })
                        }
                      </Select>,
                    ) }
                  </Form.Item>
                </Col>

                <Col span={ 2 } className="add-button-col">
                  <div className="icon-wrapper" onClick={ this.AddGruop }>
                    <Icon type="plus"/>
                  </div>
                </Col>
              </Form>
            </Row>
            {
              this.state.groupData.map((row, index) => {
                return (
                  <Row className="group-list-row">
                    <Col span={ 22 } className="group-list-item">
                      { row.group.label }
                    </Col>
                    <Col span={ 2 } className="delete-button-col">
                      <div className="icon-wrapper" onClick={ () => this.removeGroup(index) }>
                        <Icon type="plus" rotate={ 45 }/>
                      </div>
                    </Col>
                  </Row>
                )
              })
            }
          </Col>
        </Row>
      )
    }
  }
)

export default JoinGroupsForm