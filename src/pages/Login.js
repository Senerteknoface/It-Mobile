import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "./images/logo.png"

const Login = () => {

const navigate = useNavigate();

  const onFinish = (values) => {
    // Api istek atalım

    axios
      .post("http://letstalkapi.technofaceapps.com/api/Auth/Login", {
        email: values.username,
        password: values.password,
      })
      .then((response) => {
        const token = response.data.accessToken?.token;

        if (token) {
          localStorage.setItem("accessToken", token);
          navigate('/')
        } else {
          alert('Kullanıcı adı ve şifre bilgilerini kontrol ediniz.')
        }
      })
      .catch((error) => {
        alert('Kullanıcı adı ve şifre bilgilerini kontrol ediniz.')
      });
  };

  return (
    <>
      <div className="w-72 mt-72 ml-auto mr-auto">
        <div className="w-48 mb-8 ml-auto mr-auto">
          <img src={logo} alt=""></img>
        </div>

        <Form
          name="login"
          initialValues={{ remember: true }}
          style={{ maxWidth: 560 }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Kullanıcı Adı Alanı Boş Bırakılamaz",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Kullanıcı Adı" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Şifre Alanı Boş Bırakılamaz" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Şifre"
            />
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Giriş Yap
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};
export default Login;
