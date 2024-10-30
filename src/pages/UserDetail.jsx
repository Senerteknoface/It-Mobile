import React, { useState, useEffect } from "react";
import logo from "../pages/images/logo.png";
import axios from "axios";
import moment from 'moment';
import { useNavigate, useParams } from 'react-router-dom';

import {
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  DoubleLeftOutlined
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Form, Col, Row, Typography, message, DatePicker, Input, Select, InputNumber, Checkbox } from "antd";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const UserDetail = () => {
  const baseUrl = "http://letstalkapi.technofaceapps.com/";
  const Authorization = localStorage.getItem("accessToken");
  let { userId } = useParams();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  const [userInfo, setUserInfo] = useState({
    userId: '',
    fullName: '',
    email: '',
    birthDay: '',
    gender: '',
    userDetailText: '',
    height: '',
    usagePurpose: '',
    image: '',
    showAgePermission: false,
    showDistancePermission: false,
    isReadPermission: false,
    autoPlayVideosPermission: false,
    stopNotificationsPermission: false,
  });

  console.log(userId)

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`http://letstalkapi.technofaceapps.com/api/Users/GetByIdSelectUserInformation/${userId}`, {
          headers: { Authorization: `Bearer ${Authorization}` },
        });
        const finalData = response.data.data;
        setUserInfo({
          userId: userId,
          fullName: finalData.fullName,
          email: finalData.email,
          birthDay: finalData.birthDay,
          gender: finalData.gender,
          userDetailText: finalData.userDetailText,
          height: finalData.height,
          image: finalData.userImages.find(img => img.profileImage)?.imagePath || '',
          showAgePermission: finalData.showAgePermission,
          showDistancePermission: finalData.showDistancePermission,
          autoPlayVideosPermission: finalData.autoPlayVideosPermission,
          stopNotificationsPermission: finalData.stopNotificationsPermission,
          isReadPermission: finalData.isReadPermission,
        });
      } catch (error) {
        message.error('Kullanıcı bilgileri alınırken hata oluştu.');
      }
    };

    fetchUserInfo();
  }, [Authorization, userId]);

  const userUpdate = async () => {
    try {
      const genderValue = userInfo.gender === "Kadın" ? 0 : 1; // Kadın için 0, Erkek için 1

      const updatedUser = {
        userId: userId,
        fullName: userInfo.fullName,
        email: userInfo.email,
        birthDay: moment(userInfo.birthDay).format('YYYY-MM-DD'),
        gender: genderValue, // Doğru cinsiyet değerini ayarlayın
        userDetailText: userInfo.userDetailText,
        height: userInfo.height,
        showAgePermission: userInfo.showAgePermission,
        showDistancePermission: userInfo.showDistancePermission,
        isReadPermission: userInfo.isReadPermission,
        autoPlayVideosPermission: userInfo.autoPlayVideosPermission,
        stopNotificationsPermission: userInfo.stopNotificationsPermission,
        updateUserCommand: "Update" // Zorunlu alanı burada ekleyin
      };

      await axios.put(`http://letstalkapi.technofaceapps.com/api/Users/UpdateUser`, updatedUser, {
        headers: {
          Authorization: `Bearer ${Authorization}`,
          "Content-Type": "application/json"
        },
      });

      message.success('Kullanıcı bilgileri güncellendi!');
    } catch (error) {
      console.error("Güncelleme sırasında bir hata oluştu:", error.response?.data);
      message.error('Güncelleme sırasında bir hata oluştu.');
    }
  };


  const backToHome = () => {
    navigate('/');
  };

  const onChangeCheckbox = (checkedValues) => {
    setUserInfo(prevState => ({
      ...prevState,
      showAgePermission: checkedValues.includes("showAgePermission"),
      showDistancePermission: checkedValues.includes("showDistancePermission"),
      isReadPermission: checkedValues.includes("isReadPermission"),
      autoPlayVideosPermission: checkedValues.includes("autoPlayVideosPermission"),
      stopNotificationsPermission: checkedValues.includes("stopNotificationsPermission"),
    }));
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div style={{ margin: 5 }}>
          <a href="/">
            <img src={logo} alt="Logo" style={{ maxWidth: '100%' }} />
          </a>
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["2"]} items={[
          { key: "2", icon: <UserOutlined />, label: <a href="/">Kullanıcı Listesi</a> },
          { key: "1", icon: <UploadOutlined />, label: <a href="/Activity">Etkinlik Yönetimi</a> },
          { key: "3", icon: <UploadOutlined />, label: <a href="/Chat">Soru / Cevap</a> }
        ]} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuUnfoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px", width: 64, height: 64 }}
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
          <Button
            type="primary"
            shape="round"
            icon={<DoubleLeftOutlined />}
            onClick={backToHome}
            style={{ marginBottom: 24 }}
          />
          <Row justify="start" gutter={16}>
            <Col span={6} style={{ textAlign: 'left' }}>
              {userInfo.image && (
                <img
                  src={baseUrl + userInfo.image}
                  alt="Profile"
                  style={{ width: '100%', maxWidth: 150, borderRadius: '10px', marginBottom: 8 }}
                />
              )}
              <Title level={5} style={{ margin: 0 }}>{userInfo.fullName}</Title>
            </Col>
            <Col span={18}>
              <Form layout="vertical" style={{ width: '100%' }}>
                <Form.Item
                  label="İsim :"
                  rules={[{ required: true, message: "Boş Geçilemez!" }]}
                >
                  <Input
                    value={userInfo.fullName}
                    onChange={e => setUserInfo(prevState => ({ ...prevState, fullName: e.target.value }))}
                    placeholder="İsim giriniz"
                  />
                </Form.Item>
                <Form.Item
                  label="E-posta :"
                  rules={[{ required: true, message: "Boş Geçilemez!" }, { type: 'email', message: 'Geçerli bir e-posta adresi giriniz!' }]}
                >
                  <Input
                    type="email"
                    value={userInfo.email}
                    onChange={e => setUserInfo(prevState => ({ ...prevState, email: e.target.value }))}
                    placeholder="E-posta giriniz"
                  />
                </Form.Item>
                <Form.Item
                  label="Cinsiyet:"
                  rules={[{ required: true, message: "Boş Geçilemez!" }]}
                >
                  <Select
                    value={userInfo.gender}
                    onChange={(value) => setUserInfo(prevState => ({ ...prevState, gender: value }))}
                    options={[
                      { value: 0, label: "Kadın" },
                      { value: 1, label: "Erkek" }
                    ]}
                    placeholder="Cinsiyeti Seçin"
                  />
                </Form.Item>
                <Form.Item
                  label="Kullanıcı Detay"
                  rules={[{ required: true, message: "Boş Geçilemez!" }]}
                >
                  <Input.TextArea
                    value={userInfo.userDetailText}
                    onChange={e => setUserInfo(prevState => ({ ...prevState, userDetailText: e.target.value }))}
                    placeholder="Kullanıcı detayını giriniz"
                  />
                </Form.Item>
                <Form.Item
                  label="Boyu"
                  rules={[{ required: true, message: "Boş Geçilemez!" }]}
                >
                  <InputNumber
                    min={1}
                    max={300}
                    value={userInfo.height}
                    onChange={value => setUserInfo(prevState => ({ ...prevState, height: value }))}
                    placeholder="Boyunuzu giriniz"
                  />
                </Form.Item>
                <Form.Item
                  label="Etkinlik Tarihi"
                  rules={[{ required: true, message: "Boş Geçilemez!" }]}
                >
                  <DatePicker
                    value={userInfo.birthDay ? moment(userInfo.birthDay, 'DD-MM-YYYY') : null}
                    onChange={(date, dateString) => setUserInfo(prevState => ({ ...prevState, birthDay: dateString }))}
                    placeholder="Tarih Seçiniz"
                  />
                </Form.Item>
                <Form.Item label="İzinler">
                  <Checkbox.Group onChange={onChangeCheckbox} value={[
                    userInfo.showAgePermission ? "showAgePermission" : null,
                    userInfo.showDistancePermission ? "showDistancePermission" : null,
                    userInfo.isReadPermission ? "isReadPermission" : null,
                    userInfo.autoPlayVideosPermission ? "autoPlayVideosPermission" : null,
                    userInfo.stopNotificationsPermission ? "stopNotificationsPermission" : null,
                  ].filter(Boolean)}>
                    <Row>
                      <Col span={6}>
                        <Checkbox value="showAgePermission">Yaş Gösterim İzini</Checkbox>
                      </Col>
                      <Col span={6}>
                        <Checkbox value="showDistancePermission">Mesafe İzini</Checkbox>
                      </Col>
                      <Col span={6}>
                        <Checkbox value="isReadPermission">Okuma İzini</Checkbox>
                      </Col>
                      <Col span={6}>
                        <Checkbox value="autoPlayVideosPermission">Otomatik Video Oynatma İzini</Checkbox>
                      </Col>
                      <Col span={6}>
                        <Checkbox value="stopNotificationsPermission">Bildirim İzini Durdurma</Checkbox>
                      </Col>
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
                <Button type="primary" onClick={userUpdate}>Güncelle</Button>
              </Form>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserDetail;
