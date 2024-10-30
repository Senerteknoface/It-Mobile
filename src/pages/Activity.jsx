import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "./images/logo.png"
import Highlighter from 'react-highlight-words';
import {
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  PlusCircleOutlined,
  EyeOutlined,
  SearchOutlined
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Table, Input, Space } from "antd";
const { Header, Sider, Content } = Layout;

const Activity = () => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
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
      title: "Aktivite",
      dataIndex: "name",
      ...getColumnSearchProps('name'),
    },
    {
      title: "Lokasyon",
      dataIndex: "locationName"
    },
    {
      title: "Açık Adres",
      dataIndex: "detailAddress",
      ...getColumnSearchProps('detailAddress'),
    },
    {
      title: "Türü",
      dataIndex: "activityTypeName",
      ...getColumnSearchProps('activityTypeName'),
    },
    {
      title: "Tarih",
      dataIndex: "date"
    },
    {
      title: "Açıklama",
      dataIndex: "description"
    },
    {
      title: "Aktivite Detay",
      dataIndex: "detail",

      render: (_, record) => (

        <Link to={`/ActivityDetail/${record.id}`}><EyeOutlined /></Link>
      )
    }
  ];

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://letstalkapi.technofaceapps.com/api/Activities?PageIndex=0&PageSize=1000")
      .then((response) => {
        let finalData = response.data.data.items;
        finalData.forEach((item) => {
          data.push({
            key: item["id"],
            id: item["id"],
            name: item["name"],
            locationName: item["locationName"],
            detailAddress: item["detailAddress"],
            date: item["date"].slice(0, 10) + " / " + item["time"],
            description: item["description"],
            activityTypeName: item["activityType"].name,
            detail: item[""],
          });
        });
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = () => {
    navigate('/NewActivity')
  };
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
          <br />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
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
            background: colorBgContainer
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
            <Button color="primary" variant="solid" icon={<PlusCircleOutlined />} onClick={onFinish}>
              Yeni Aktivite Ekle
            </Button><br /><br />
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
export default Activity;
