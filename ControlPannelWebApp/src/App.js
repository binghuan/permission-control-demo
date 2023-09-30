import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Switch, Button } from '@mui/material';
import axios from 'axios'; // 引入axios
import './App.css';

const initialPermissions = {
  editMode: {
    "buttonCreate": "readwrite",
    "buttonEdit": "readwrite",
    "buttonDelete": "readwrite",
    "textFieldTitle": "readwrite",
    "pickerStartDateTime": "readwrite",
    "selectorDuration": "readwrite",
    "selectorRepeat": "readwrite",
    "selectorAttendee": "readwrite",
    "editorAttachment": "readwrite",
    "textFieldDesc": "readwrite",
    "checkboxEveryoneCanModifyMeeting": "readwrite",
    "checkboxEveryoneCanInviteOthers": "readwrite",
    "checkboxSendInvitationToTheChatRoom": "readwrite",
    "toggleGoingOrNot": "readwrite",
    "checkboxReceiveNotification": "readwrite"
  },
  viewMode: {
    "buttonCreate": "-",
    "buttonEdit": "readwrite",
    "buttonDelete": "readwrite",
    "textFieldTitle": "read",
    "pickerStartDateTime": "read",
    "selectorDuration": "read",
    "selectorRepeat": "read",
    "selectorAttendee": "read",
    "editorAttachment": "read",
    "textFieldDesc": "read",
    "checkboxEveryoneCanModifyMeeting": "read",
    "checkboxEveryoneCanInviteOthers": "read",
    "checkboxSendInvitationToTheChatRoom": "read",
    "toggleGoingOrNot": "read",
    "checkboxReceiveNotification": "readwrite"
  }
};

function App() {
  const [permissions, setPermissions] = useState(initialPermissions);
  const [isSidePanelOpen, setSidePanelOpen] = useState(false);

  // 使用useEffect來監聽permissions的變動
  useEffect(() => {
    // 發送資料到伺服器的函數
    const sendDataToServer = async () => {
      try {
        await axios.post('http://localhost:8080/permissions', permissions);
        console.log('Data sent to server successfully');
      } catch (error) {
        console.error('Failed to send data to server:', error);
      }
    };

    sendDataToServer();
  }, [permissions]);

  const handleToggleChange = (key, mode, type) => {
    setPermissions(prevPermissions => {
      const currentPermission = prevPermissions[mode][key];

      let newPermission;
      if (type === 'write' && currentPermission !== 'readwrite') {
        newPermission = 'readwrite'; // If write is turned on, read is also turned on.
      } else if (type === 'write' && currentPermission === 'readwrite') {
        newPermission = 'read'; // If write is turned off while in readwrite mode, it becomes 'read'.
      } else if (type === 'read' && currentPermission === 'readwrite') {
        newPermission = '-'; // If read is turned off while in readwrite mode, both are turned off.
      } else if (type === 'read' && currentPermission === 'read') {
        newPermission = '-'; // If read is turned off, the permission becomes '-'.
      } else if (type === 'read' && currentPermission === '-') {
        newPermission = 'read'; // If read is turned on while in '-' mode, it becomes 'read'.
      } else {
        newPermission = currentPermission; // No change in other cases.
      }

      return {
        ...prevPermissions,
        [mode]: {
          ...prevPermissions[mode],
          [key]: newPermission
        }
      };
    });
  };



  return (
    <div className="App">

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>UI Controls</TableCell>
            <TableCell >Key</TableCell>
            <TableCell colSpan={2}>EditMode</TableCell>
            <TableCell colSpan={2}>ViewMode</TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>Read</TableCell>
            <TableCell>Write</TableCell>
            <TableCell>Read</TableCell>
            <TableCell>Write</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(initialPermissions.editMode).map(key => (
            <TableRow key={key}>

              <TableCell><img src={`/images/${key}.png`} alt="icon" width="300" /></TableCell>


              <TableCell className="key-cell">{key}</TableCell>

              <TableCell>
                <Switch
                  disabled={permissions.editMode[key] === 'write'}
                  checked={permissions.editMode[key].includes('read')}
                  onChange={() => handleToggleChange(key, 'editMode', 'read')}
                />
              </TableCell>
              <TableCell>
                <Switch
                  disabled={permissions.editMode[key] === '-'}
                  checked={permissions.editMode[key].includes('write')}
                  onChange={() => handleToggleChange(key, 'editMode', 'write')}
                />
              </TableCell>
              <TableCell>
                <Switch
                  disabled={permissions.viewMode[key] === 'write'}
                  checked={permissions.viewMode[key].includes('read')}
                  onChange={() => handleToggleChange(key, 'viewMode', 'read')}
                />
              </TableCell>
              <TableCell>
                <Switch
                  disabled={permissions.viewMode[key] === '-'}
                  checked={permissions.viewMode[key].includes('write')}
                  onChange={() => handleToggleChange(key, 'viewMode', 'write')}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div
        className={isSidePanelOpen ? 'side-panel open' : 'side-panel'}
        onClick={() => setSidePanelOpen(true)} // 直接在這裡添加onClick事件
      >
        <Button
          style={{ position: 'absolute', top: '50%', left: -30, transform: 'translateY(-50%)', zIndex: 1 }}
          onClick={(e) => {
            e.stopPropagation(); // 防止事件冒泡到上面的div
            setSidePanelOpen(true);
          }}
        >
          &lt;
        </Button>
        <Button
          style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}
          onClick={(e) => {
            e.stopPropagation(); // 防止事件冒泡到上面的div
            setSidePanelOpen(false);
          }}
        >
          X
        </Button>
        <pre>{JSON.stringify(permissions, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;
