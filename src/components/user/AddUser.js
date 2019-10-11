import React, { Component } from 'react'
import { Button, Modal } from 'antd'

import AddUserModal from './AddUserModal'
import './AddUser.less'

const TEXT={
  cancel:'CANCEL',
  previous:'PREVIOUS',
  saveNext:'SAVE & NEXT',
  finish:'FINISH',
}

export default class AddUser extends Component {
  constructor (props) {
    super(props)
    this.state = {
      AddUserModalVisible: false,
      okText: TEXT.saveNext,
      cancelText: TEXT.cancel,
    }
  }

  showAddUserModal = () => {
    this.setState({ AddUserModalVisible: true })
  }

  onRefAddUserModal = (ref) => {
    this.addUserModal = ref
  }

  afterModalStep = () => {
    const currentStep = this.addUserModal.state.step
    switch (currentStep) {
      case 0:
        this.closeModal()
        break
      case 1:
        this.setState({
          cancelText: TEXT.cancel
        })
        break
      case 2:
        this.setState({
          cancelText: TEXT.previous,
          okText: TEXT.saveNext,
        })
        break
      case 3:
        this.setState({
          okText: TEXT.finish
        })
        break
      case 4:
        // TODO upload data ...
        this.setState({
          AddUserModalVisible: false
        })
        break
      default:
    }
  }

  handleOk = async () => {
    await this.addUserModal.handleNextStep()
    this.afterModalStep()
  }


  handleCancel = async (e) => {
    if (e.target.nodeName !== 'BUTTON') {
      this.closeModal()
      return
    }
    await this.addUserModal.handlePreviousStep()
    this.afterModalStep()
  }

  closeModal = () => {
    this.setState({
      AddUserModalVisible: false,
      okText: TEXT.saveNext,
      cancelText: TEXT.cancel,
    })
  }


  render () {
    return (
      <div className="button-container">
        <Button type="primary" onClick={ this.showAddUserModal }>
          ADD NEW USER
        </Button>
        <Modal
          title={ 'ADD NEW USER' }
          className="custom-modal"
          maskClosable={ false }
          visible={ this.state.AddUserModalVisible }
          destroyOnClose={ true }
          onOk={ this.handleOk }
          onCancel={ this.handleCancel }
          okText={ this.state.okText }
          cancelText={ this.state.cancelText }
          okButtonProps={ { type: 'link' } }
          cancelButtonProps={ { type: 'link' } }
        >
          <AddUserModal
            onRef={ this.onRefAddUserModal }
          />
        </Modal>
      </div>
    )
  }
}
