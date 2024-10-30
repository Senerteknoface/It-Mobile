import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import logo from "../pages/images/logo.png";
import Highlighter from 'react-highlight-words';

import {
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined, EyeOutlined, SearchOutlined
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Table, Input, Space } from "antd";
const { Header, Sider, Content } = Layout;
const Home = () => {
  
  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };


  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 18
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Ara`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          
        <Button
            type="primary"
            size="medium"
            icon={<SearchOutlined />}
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Ara
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="medium"
            style={{
              width: 90,
            }}
          >
            Temizle
          </Button>

          <Button
            type="link"
            size="medium"
            onClick={() => {
              close();
            }}
          >
            Kapat
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : '#039dfc',
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "Kullanıcı Id",
      dataIndex: "id",
      hidden:false
    },
    {
      title: "Adı Soyadı",
      dataIndex: "fullName",
      key: "fullName",
      ...getColumnSearchProps('fullName'),
    },
    {
      title: "Telefon Numarası",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      ...getColumnSearchProps('phoneNumber')
    },
    {
      title: "Doğum Tarihi",
      dataIndex: "birthDay",
      key: "birthDay",
    },
    {
      title: "Cinsiyet",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Yaş",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Detay",
      dataIndex: "detail",
     
      render: (_,record) => (

        <Link to={`/UserDetail/${record.id}`}><EyeOutlined /></Link> 
      )
    },
  ];

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://letstalkapi.technofaceapps.com/api/Users/GetToList")
      .then((response) => {
        if (response.data && response.data.data) {
          const finalData = response.data.data.map((item) => ({
            key: item["id"],
            id: item["id"],
            fullName: item["fullName"] || "Bilinmiyor",
            phoneNumber: 
              (item["phoneNumberCountryCode"] ? item["phoneNumberCountryCode"].slice(0, 3) : "Kod Yok") + 
              "-" + 
              (item["phoneNumber"] || "Telefon Yok"),
            birthDay: item["birthDay"] ? item["birthDay"].slice(0, 10) : "Tarih Yok",
            gender: item["gender"] ? "Kadın" : "Erkek",
            age: item["age"] || "Yaş Yok"
          }));
          setData(finalData);
        } else {
          console.error("Expected data format is missing");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Data fetch error:", err.message);
        setLoading(false);
      });
  }, []);
  
  


  return (
    <Layout style={
      {
        height: "100vh"
      }
    }>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div style={{ margin: 5 }}>
          <a href="/">
            <img src={logo} alt="Logo" />
          </a>
        </div>
        <br/>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["2"]}
          items={[
            {
              key: "2",
              icon: <UserOutlined />,
              label: <a href="/">Kullanıcı Listesi</a>
            },
            {
              key: "1",
              icon: <UploadOutlined />,
              label: <a href="/Activity">Etkinlik Yönetimi</a>
            },
            {
              key: "3",
              icon: <UploadOutlined />,
              label: <a href="/Chat">Soru / Cevap</a>
            }
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
          <div>
          <Table
                className="pl-5 pr-5 pt-5 rounded-lg bg-slate-100"
                columns={columns}
                dataSource={data}
                loading={loading}   
              />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;