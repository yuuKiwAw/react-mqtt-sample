import { Row, Card, Form, Input, Button, Space } from "antd"
import React from "react"
import { mqttConnectData, mqttOption, payload } from "../../interface/mqtt"
import Notification from "../Notification"
import mqtt from "mqtt/dist/mqtt.min"

const MqttComponent: React.FC = () => {
    const [form] = Form.useForm()
    const [client, setClient] = React.useState<mqtt.MqttClient>();
    const [connectStatus, setConnectStatus] = React.useState("")
    const [payload, setPayload] = React.useState<payload>()

    const mqttConnect = (values: mqttConnectData) => {
        const m_host = "ws://" + values.host + ":" + values.port + "/mqtt"
        const m_mqttOption: mqttOption = {
            username: values.username,
            password: values.username,
            rejectUnauthorized: false
        }

        setConnectStatus('Connecting');
        setClient(mqtt.connect(m_host, m_mqttOption))
    }

    const mqttDisconnect = () => {
        if (client) {
            client.end()
            setConnectStatus('Connect')
            Notification("warning", "MQTT", "Disconnected.")
        }
    }

    React.useEffect(() => {
        if (client) {
            console.log(client)
            client.on('connect', () => { setConnectStatus('Connected'); Notification('success', 'MQTT', 'Connect Success.') });
            client.on('error', (err) => {
                console.error('Connection error: ', err);
                client.end();
                Notification("error", "MQTT", "Connect Error!\n" + err)
            });
            client.on('reconnect', () => { setConnectStatus('Reconnecting'); });
            client.on('message', (topic, message) => {
                const payload = { topic, message: message.toString() };
                setPayload(payload);
            });
        }
    }, [client]);

    const onFinish = (values: mqttConnectData) => {
        console.log({"Finish success": values})
        mqttConnect(values)
    }

    const onFinishFailed = (values: any) => {
        console.log({"Finish failed": values})
    }

    return (
        <Card title="MQTT COMPONENT" bordered>
            <Form
                name="mqttConnect"
                layout="vertical"
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="on"
            >
                <Row>
                    <Space>
                        <Form.Item
                            label="Host"
                            name="host"
                            rules={[{ required: true, message: "Please input host."}]}
                        >
                            <Input placeholder="input host"></Input>
                        </Form.Item>
                        <Form.Item
                            label="Port"
                            name="port"
                            rules={[{ required: true, message: "Please input port."}]}
                        >
                            <Input placeholder="input port"></Input>
                        </Form.Item>
                        <Form.Item
                            label="ClientId"
                            name="clientid"
                            rules={[{ required: true, message: "Please input clientid."}]}
                        >
                            <Input placeholder="input clientid"></Input>
                        </Form.Item>
                    </Space>
                </Row>

                <Row>
                    <Space>
                        <Form.Item label="Username" name="username">
                            <Input placeholder="input username"></Input>
                        </Form.Item>

                        <Form.Item label="Password" name="password">
                            <Input.Password placeholder="input password"></Input.Password>
                        </Form.Item>
                    </Space>
                </Row>

                <Row>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">Connect</Button>
                            <Button type="primary" danger onClick={mqttDisconnect}>Disconnect</Button>
                        </Space>
                    </Form.Item>
                </Row>
            </Form>
        </Card>
    )
}

export default MqttComponent;