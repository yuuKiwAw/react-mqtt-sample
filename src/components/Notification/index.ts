import {notification} from 'antd'

type NotificationType = 'success' | 'info' | 'warning' | 'error'

const Notification = (type: NotificationType, title: string, message: string) => {
    notification[type]({
        message: title,
        description: message
    });
}

export default Notification