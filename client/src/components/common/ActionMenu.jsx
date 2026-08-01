import React from 'react'
import { Menu, MenuItem, IconButton } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'

const ActionMenu = ({ actions, ariaLabel = 'menú de acciones' }) => {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <IconButton
        aria-label={ariaLabel}
        aria-controls="action-menu"
        aria-haspopup="true"
        onClick={handleOpen}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        id="action-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: '20ch',
          },
        }}
      >
        {actions.map(({ label, onClick }, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              onClick()
              handleClose()
            }}
          >
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default ActionMenu
