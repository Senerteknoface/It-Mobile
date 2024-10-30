import React, { useState, useEffect } from "react";
import logo from "../pages/images/logo.png";
import {
  MenuUnfoldOutlined,
  UploadOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, List, Input, Badge } from "antd";
const { Header, Sider, Content } = Layout;

const Chat = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState({});

  // Kullanıcı listesini API'den al
  useEffect(() => {
    // Burada API çağrınızı yapın. Örneğin:
    // axios.get('/api/users').then(response => setUsers(response.data));
    setUsers([
      { id: 1, name: 'Kullanıcı 1' },
      { id: 2, name: 'Kullanıcı 2' },
      { id: 3, name: 'Kullanıcı 3' },
    ]);
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setMessages([]); // Kullanıcı değiştiğinde mesajları sıfırla
    setNotifications((prev) => ({ ...prev, [user.id]: 0 })); // Seçilen kullanıcı için bildirimleri sıfırla
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessages([...messages, { text: messageInput, sender: 'Me' }]);
      setMessageInput('');
      // Kullanıcıdan gelen mesaj simüle edilirse:
      handleNewMessage(selectedUser.id, messageInput); // Kullanıcı mesajı gönderdikten sonra kendi mesajı olarak al
    }
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    setNotifications((prev) => {
      const newNotifications = { ...prev };
      delete newNotifications[userId];
      return newNotifications;
    });
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser(null);
      setMessages([]);
    }
  };

  const handleNewMessage = (userId, message) => {
    if (selectedUser && selectedUser.id === userId) {
      setMessages((prevMessages) => [...prevMessages, { text: message, sender: 'User' }]);
    } else {
      setNotifications((prev) => ({ ...prev, [userId]: (prev[userId] || 0) + 1 }));
    }
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div style={{ margin: 5 }}>
          <a href="/">
            <img src={logo} alt="Logo" />
          </a>
        </div>
        <br />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["3"]}
          items={[
            {
              key: "2",
              icon: <UploadOutlined />,
              label: <a href="/">Kullanıcı Listesi</a>,
            },
            {
              key: "1",
              icon: <UploadOutlined />,
              label: <a href="/Activity">Etkinlik Yönetimi</a>,
            },
            {
              key: "3",
              icon: <UploadOutlined />,
              label: <a href="/Chat">Soru / Cevap</a>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuUnfoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Layout style={{ height: '100vh' }}>
            <Sider width={300} style={{ background: '#fff' }}>
              <Menu mode="inline" style={{ height: '100%', borderRight: 0 }}>
                {users.map((user) => (
                  <Menu.Item
                    key={user.id}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    onClick={() => handleUserClick(user)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {user.name}
                      <Badge count={notifications[user.id]} offset={[10, 0]} />
                    </div>
                    <Button
                      type="text"
                      icon={<CloseCircleOutlined />}
                      onClick={(e) => {
                        e.stopPropagation(); // Kullanıcı seçimini engelle
                        handleDeleteUser(user.id);
                      }}
                      style={{ marginLeft: 'auto' }} // Butonu sağa yasla
                    />
                  </Menu.Item>
                ))}
              </Menu>
            </Sider>
            <Layout style={{ flex: 1 }}>
              <Content style={{ padding: '20px', height: '100%', overflow: 'hidden' }}> {/* Taşmayı önlüyoruz */}
                {selectedUser ? (
                  <>
                    <div style={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto' }}> {/* Mesajların alanını ayarlıyoruz */}
                      <List
                        bordered
                        dataSource={messages}
                        renderItem={(item) => (
                          <List.Item>
                            <strong>{item.sender}:</strong> {item.text}
                          </List.Item>
                        )}
                      />
                    </div>
                    <Input.Group compact style={{ marginTop: '10px' }}>
                      <Input
                        style={{ width: 'calc(100% - 100px)' }}
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Mesajınızı yazın..."
                      />
                      <Button type="primary" onClick={handleSendMessage}>
                        Gönder
                      </Button>
                    </Input.Group>
                  </>
                ) : (
                  <p>Bir kullanıcı seçin...</p>
                )}
              </Content>
            </Layout>
          </Layout>


        </Content>
      </Layout>
    </Layout>
  );
};

export default Chat;
