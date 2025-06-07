import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  IconButton, 
  Badge, 
  Menu, 
  MenuItem, 
  Typography, 
  Box, 
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import { useActivityNotifications } from '@/hooks/websocket/useActividadNotificacions';
import { useBodegaNotifications } from '@/hooks/websocket/useBodegaNotification';
import { usePlagaNotifications } from '@/hooks/websocket/useReportePlaga';
import { Notification } from '@/types/notificacion';

type PersistentNotification = Notification & {
  read: boolean;
};

const Notificacion: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<PersistentNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (!user?.id) return;

    const savedNotifications = localStorage.getItem(`notifications_${user.id}`);
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications) as PersistentNotification[];
        setNotifications(parsedNotifications);
        setUnreadCount(parsedNotifications.filter(n => !n.read).length);
      } catch (error) {
        console.error('Error al cargar notificaciones desde localStorage:', error);
      }
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id && notifications.length > 0) {
      try {
        localStorage.setItem(`notifications_${user.id}`, JSON.stringify(notifications));
      } catch (error) {
        console.error('Error al guardar notificaciones en localStorage:', error);
      }
    }
  }, [notifications, user?.id]);

  const addNotification = useCallback(
    (notification: Notification) => {
      setNotifications((prev) => {
        const exists = prev.some(n => n.id === notification.id);
        if (!exists) {
          const newNotification: PersistentNotification = { 
            ...notification, 
            read: false 
          };
          const updatedNotifications = [newNotification, ...prev].slice(0, 50); 
          setUnreadCount(prevUnread => prevUnread + 1);
          return updatedNotifications;
        }
        return prev;
      });
    },
    []
  );

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(n => n.read ? n : { ...n, read: true })
    );
    setUnreadCount(0);
  }, []);

 const deleteNotification = useCallback((id: string) => {
  setNotifications(prev => {
    const notificationToDelete = prev.find(n => n.id === id);
    const updatedNotifications = prev.filter(n => n.id !== id);
    
    if (notificationToDelete && !notificationToDelete.read) {
      setUnreadCount(prevUnread => Math.max(0, prevUnread - 1));
    }
    
    if (user?.id) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updatedNotifications));
    }
    
    return updatedNotifications;
  });
}, [user?.id]);  

const clearAllNotifications = useCallback(() => {
  setNotifications([]);
  setUnreadCount(0);
  
  if (user?.id) {
    localStorage.removeItem(`notifications_${user.id}`);
  }
}, [user?.id]); 

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    markAllAsRead();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClearAllClick = () => {
    setConfirmClearOpen(true);
  };

  const handleConfirmClear = () => {
    clearAllNotifications();
    setConfirmClearOpen(false);
  };

  const handleCancelClear = () => {
    setConfirmClearOpen(false);
  };

  useActivityNotifications(user?.id, addNotification);
  useBodegaNotifications(user?.id, addNotification);
  usePlagaNotifications(user?.id, addNotification);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
      <IconButton
        onClick={handleClick}
        sx={{ color: '#fff' }}
        aria-label="notificaciones"
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon sx={{ color: '#fff' }} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 500,
            overflow: 'auto',
            mt: 1,
          },
        }}
      >
        <Box sx={{ p: 1, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Notificaciones
            </Typography>
            {notifications.length > 0 && (
              <Button 
                size="small" 
                color="error" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearAllClick();
                }}
              >
                Limpiar todas
              </Button>
            )}
          </Box>
        </Box>

        {notifications.length === 0 ? (
          <MenuItem dense>
            <Typography variant="body2">No hay notificaciones</Typography>
          </MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              dense
              sx={{
                borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                '&:last-child': { borderBottom: 'none' },
                bgcolor: notification.read ? 'background.paper' : 'action.selected',
              }}
            >
              <Box sx={{ py: 1, width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography>{notification.message}</Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    sx={{ ml: 1 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>

      <Dialog
        open={confirmClearOpen}
        onClose={handleCancelClear}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"¿Limpiar todas las notificaciones?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Esta acción eliminará todas las notificaciones. ¿Estás seguro?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClear} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmClear} color="error" autoFocus>
            Limpiar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Notificacion;