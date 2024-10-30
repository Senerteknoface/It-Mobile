import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import logo from "./images/logo.png";
import Highlighter from 'react-highlight-words';
import axios from "axios";
import moment from 'moment';

import {
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  DoubleLeftOutlined,
  ReloadOutlined, SearchOutlined, CheckOutlined, CloseOutlined
} from "@ant-design/icons";
import { Button, Layout, InputNumber, Menu, theme, Form, Row, Col, Input, DatePicker, TimePicker, Select, Space, Switch, Table, Alert } from "antd";
const { Header, Sider, Content } = Layout;

function ActivityDetail() {
  const format = 'HH:mm';
  const baseUrl = "http://letstalkapi.technofaceapps.com/";
  const Authorization = localStorage.getItem("accessToken");

  const [activityType, setActivityType] = useState([]);
  const [activityTypeId, setAtivityTypeId] = useState("");
  const [activityTypeName, setActivityTypeName] = useState("");

  const [image, setImage] = useState();
  const [activityName, setActivityName] = useState();
  const [activityLocation, setActivityLocation] = useState();
  const [latitude, setLatitude] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [description, setDescription] = useState("");
  const [longitude, setLongitude] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [participantCount, setParticipantCount] = useState("");
  const [eventCost, setEventCost] = useState("");
  const [imageToken, setImageToken] = useState("");

  const refreshToken = async () => {
    try {
      const response = await axios.post("http://letstalkapi.technofaceapps.com/api/Auth/RefreshToken", {
        // Eğer refresh token gerekiyorsa burada geçerli bir refresh token göndermelisiniz
        refreshToken: localStorage.getItem("refreshToken"), // Örnek: localStorage'dan alın
      });

      localStorage.setItem("accessToken", response.data.accessToken); // Yeni access token'ı localStorage'a kaydedin
      return response.data.accessToken; // Yeni access token'ı döndürün
    } catch (error) {
      console.error("Token yenileme hatası:", error.response ? error.response.data : error.message);
      throw error; // Hata fırlat
    }
  };

  const updateActivity = async () => {
    const baseUrl = "http://letstalkapi.technofaceapps.com/api/Activities"; // API URL'si
    const data = {
      id: activityId, // ID'yi doğrudan ver
      activityTypeId: activityTypeId,
      name: activityName,
      description: description,
      locationName: activityLocation,
      latitude: latitude,
      longitude: longitude,
      date: date,
      time: time,
      participantCount: participantCount,
      eventCost: eventCost,
      detailAddress: detailAddress,
    };

    if (imageToken) {
      data.imageToken = imageToken;
    }

    const headers = {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    try {
      const response = await axios.put(baseUrl, data, { headers });
      alert("Güncelleme başarılı:", response.data);
    } catch (error) {
      // Eğer token süresi dolmuşsa yenileyip tekrar deneyin
      if (error.response && error.response.status === 401) {
        try {
          const newAccessToken = await refreshToken(); // Token'ı yenile
          const newHeaders = {
            Authorization: `Bearer ${newAccessToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          };
          const retryResponse = await axios.put(baseUrl, data, { headers: newHeaders });
          Alert("Güncelleme başarılı:", retryResponse.data);
        } catch (refreshError) {
          Alert("Güncelleme hatası:", refreshError.response ? refreshError.response.data : refreshError.message);
        }
      } else {
        alert("Güncelleme hatası:", error.response ? error.response.data : error.message);
      }
    }
  };



  const navigate = useNavigate();

  const backToActivity = () => {
    navigate("/Activity");
  };

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  let { activityId } = useParams();

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
      title: "Durum",
      dataIndex: "userTypes",
      key: "userTypes",
      ...getColumnSearchProps('userTypes'),
      render:(userTypes) =>{
        if (userTypes===0) return "None"
        if (userTypes===2) return "Katılıyor"
        if (userTypes===3) return "Katılmıyor"
      }
    },
    {
      title: "Detay",
      dataIndex: "detail",
      render: (_, record) => (
        <div>
          <Link>
            <CheckOutlined
              style={{ color: 'green', fontSize: '20px', marginRight: 15 }}
              onClick={() => updateUserActivityStatus(record.key, 2)}
            />
          </Link>
          <Link>
            <CloseOutlined
              style={{ color: 'red', fontSize: '20px' }}
              onClick={() => updateUserActivityStatus(record.key, 3)}
            />
          </Link>
        </div>
      )
    }
  ];

  useEffect(() => {
    axios
      .get("http://letstalkapi.technofaceapps.com/api/ActivityTypes/GetToList")
      .then((response) => {
        const activityOptions = response.data.data.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        setActivityType(activityOptions);
      })
      .catch((err) => {
        console.error("Error fetching activity types", err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    axios
      .get(`http://letstalkapi.technofaceapps.com/api/Activities/${activityId}`,
        {
          headers: {
            Authorization: `Bearer ${Authorization}`,
          },
        })
      .then((response) => {
        let finalData = response.data;
        setAtivityTypeId(finalData.data.activityTypeId)
        setImage(finalData.data.imagePath);
        setActivityName(finalData.data.name);
        setActivityLocation(finalData.data.locationName);
        setDate(finalData.data.date.slice(0, 10));
        setLatitude(finalData.data.latitude)
        setLongitude(finalData.data.longitude)
        setDescription(finalData.data.description)
        setTime(finalData.data.time)
        setParticipantCount(finalData.data.participantCount)
        setEventCost(finalData.data.eventCost)
        setDetailAddress(finalData.data.detailAddress)
      })
      .catch((err) => { });

  }, [Authorization, activityId]);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const numberControl = (event) => {
    if (
      !/[0-9]/.test(event.key) &&
      event.key !== 'Backspace' &&
      event.key !== '.'
    ) {
      event.preventDefault();
    }
  }
  const pasteControl = (event) => {
    // Yapıştırma işleminde sadece sayıları kabul etmek için kontrol
    const paste = (event.clipboardData || window.clipboardData).getData('text');
    if (!/^\d+$/.test(paste)) {
      event.preventDefault();
    }
  }
  const updateUserActivityStatus = (id, userActivityStatus) => {
    axios
      .post("http://letstalkapi.technofaceapps.com/api/UserActivities/UpdateStatus", {
        id: id,
        userActivityStatus: userActivityStatus
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then((response) => {
        console.log("Güncelleme başarılı:"+ userActivityStatus, response.data);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Güncelleme sırasında hata oluştu:" + userActivityStatus, error);
      });
  };


  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://letstalkapi.technofaceapps.com/api/UserActivities/GetByActivity/${activityId}`)
      .then((response) => {
        const finalData = response.data?.data;

        if (finalData && Array.isArray(finalData)) {
          const newData = finalData.map((item) => ({
            key: item.id,
            id: item.user.id,
            fullName: item.user.fullName,
            phoneNumber: item.user.phoneNumberCountryCode.slice(0, 3) + "-" + item.user.phoneNumber,
            birthDay: item.user.birthDay.slice(0, 10),
            gender: item.user.gender ? "Kadın" : "Erkek",
            age: item.user.age,
            userTypes: item.userActivityStatus
          }));
          console.log(newData)
          setData(newData);
        } else {
          console.log("Beklenen veri yapısı mevcut değil");
        }

        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });
  }, [activityId]);


  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      axios
        .post("http://letstalkapi.technofaceapps.com/api/UploadedFiles", formData, {
          headers: {
            Accept: "application/json",
          },
        })
        .then((response) => {
          const data = response.data;
          setImageToken(data.data.token);
          setImage(data.data.path);
          alert("başarılı bir şekilde yüklendi!");
        })
        .catch((error) => {
          console.error("Dosya yükleme hatası:", error);
          alert("Dosya yükleme sırasında bir hata oluştu.");
        });
    }

  };


  return (
    <Layout
      style={{
        height: "100vh",
      }}
    >
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
            padding: 12,
            minHeight: "calc(100vh - 112px)",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
          }}
        >
          <Form name="activity" style={{ width: "100%" }}>
            <Button
              type="primary"
              shape="round"
              icon={<DoubleLeftOutlined />}
              onClick={backToActivity}
            />
            <Row
              gutter={[16, 16]}
              justify="space-between"
              align="top"
              style={{
                width: "100%",
                overflowX: "hidden",
              }}
            >
              <Col
                xs={24} sm={24} md={8} lg={8} xl={8}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  overflow: "hidden",
                }}
              >
                <br />
                <img src={baseUrl + image} alt="logo" id="imagePath" style={{ maxWidth: 250, maxHeight: 200, borderRadius: 10 }}></img><br />
                <input type="file" id="fileInput" onChange={handleFileUpload} />
                <br />
                <Form.Item
                  name="activityType"
                  label="Etkinlik Türü:"
                  rules={[{ required: true, message: "Boş Geçilemez!" }]}
                >
                  <Select
                    style={{ width: "100%" }}
                    options={activityType}
                    placeholder={activityTypeName}
                    onChange={(value) => {
                      setAtivityTypeId(value);
                      const selectedActivity = activityType.find(
                        (option) => option.value === value
                      );
                      if (selectedActivity) {
                        setActivityTypeName(selectedActivity.label);
                      }
                    }}
                  />

                </Form.Item>
                <Form.Item
                  name="name"
                  label="Etkinlik Adı :"
                  rules={[{ required: true, message: "Boş Geçilemez!" }]}
                >
                  <Input style={{ width: "100%" }} onChange={setter => setDescription(setter.target.value)} placeholder={activityName} />
                </Form.Item>
                <Form.Item
                  label="Etkinlik Konumu :"
                  name="locationName"
                  rules={[{ required: true, message: "Boş Geçilemez!" }]}
                >
                  <Input style={{ width: "100%" }} onChange={setter => setActivityLocation(setter.target.value)} placeholder={activityLocation} />
                </Form.Item>
                <Form.Item

                  label="Etkinlik Koordinatı :"
                >
                  <Input
                    name="latitude"
                    rules={[{ required: true, message: "Boş Geçilemez !" }]}
                    style={{ width: "50%" }}
                    onChange={setter => setLatitude(setter.target.value)}
                    placeholder={latitude}
                  />
                  <Input
                    name="lalitude"
                    style={{ width: "50%" }}
                    rules={[{ required: true, message: "Boş Geçilemez !" }]}
                    onChange={setter => setLongitude(setter.target.value)}
                    placeholder={longitude}
                  />
                </Form.Item>
                <Form.Item
                  label="Etkinlik Adres Detay"
                  name="detailAddress"
                  rules={[{ required: true, message: "Boş Geçilez!" }]}
                >
                  <Input.TextArea onChange={setter => setDetailAddress(setter.target.value)}
                    placeholder={detailAddress}
                  />

                </Form.Item>
                <Form.Item
                  label="Etkinlik Açıklaması:"
                  name="description"
                  rules={[{ required: true, message: "Boş Geçilez!" }]}
                >
                  <Input.TextArea onChange={setter => setDescription(setter.target.value)} placeholder={description} />
                </Form.Item>
                <Form.Item
                  label="Etkinlik Tarihi"
                  name="DatePicker"
                  placeholder="Tarih Seçiniz"
                  rules={[{ required: true, message: "Boş Geçilez!" }]}
                >
                  <DatePicker
                    onChange={(date, dateString) => setDate(dateString)}
                    disabledDate={(current) => {
                      // Bugünden önceki tarihleri devre dışı bırak
                      return current && current < moment().startOf('day');
                    }}
                    placeholder={date}
                  />
                </Form.Item>
                <Form.Item
                  label="Etkinlik Saati"
                  name="TimePicker"
                  placeholder="Tarih Seçiniz"
                  rules={[{ required: true, message: "Boş Geçilez!" }]}
                >
                  <TimePicker
                    format={format}
                    onChange={(time, timeString) => setTime(timeString)}
                    placeholder={time}
                  />
                </Form.Item>
                <Form.Item
                  label="Katılımcı Sayısı"
                  name="participantCount"
                  rules={[{ required: true, message: "Boş Geçilez!" }]}
                >
                  <InputNumber min={1} max={15000}
                    onKeyDown={numberControl}
                    onChange={(participantCount, count) => setParticipantCount(participantCount)}
                    placeholder={participantCount}
                  />
                </Form.Item>
                <Form.Item
                  label="Etkinlik Ücreti"
                  name="eventCost"
                  onKeyDown={numberControl}
                  onPaste={pasteControl}
                  rules={[{ required: true, message: "Boş Geçilez!" }]}
                >
                  <InputNumber
                    min={1}
                    max={50000000000}
                    onChange={(eventCost, cost) => setEventCost(eventCost)}
                    placeholder={eventCost}
                  />
                </Form.Item>

                <Space direction="vertical" >
                  <Switch checkedChildren="Aktif" unCheckedChildren="Pasif" defaultChecked={"$isSuccess"} />
                </Space> <br />
                <Button type="primary" shape="round" icon={<ReloadOutlined />} size="large" onClick={updateActivity}>
                  Güncelle
                </Button>
              </Col>
              <Col
                xs={24} sm={24} md={16} lg={16} xl={16}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 2,
                  overflow: "hidden",
                }}
              >
                <Table
                  className="pl-5 pr-5 pt-5 rounded-lg bg-slate-100"
                  columns={columns}
                  dataSource={data}
                  loading={loading}
                  style={{ width: "100%", overflow: "hidden" }}
                />
              </Col>
            </Row>
          </Form>
        </Content>
      </Layout>
    </Layout>
  );
}

export default ActivityDetail;