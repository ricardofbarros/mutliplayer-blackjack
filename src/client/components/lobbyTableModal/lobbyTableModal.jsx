import React, {Component} from 'react';
import LobbyTableForm from '../lobbyTableForm';
import './lobbyTableModal.css';

class LobbyTableModal extends Component {
  static propTypes = {
    onSave: React.PropTypes.func.isRequired
  }

  render () {
    return (
      <div className='modal fade' id='lobbyTableModal' tabIndex='-1' role='dialog' aria-labelledby='lobbyTableModalLabel'>
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <button type='button' className='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>
              <h4 className='modal-title' id='lobbyTableModalLabel'>{'Create a new Table'}</h4>
            </div>
            <div className='modal-body'>
              <LobbyTableForm />
            </div>
            <div className='modal-footer'>
              <button type='button' className='btn btn-success'>Save changes</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LobbyTableModal;
