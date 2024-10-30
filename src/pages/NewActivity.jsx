import React, { useState, useEffect } from "react";
import logo from "./images/logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FormData from 'form-data';
import moment from 'moment';

import {
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    DoubleLeftOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import {
    Button,
    Layout,
    Menu,
    theme,
    Form,
    Input,
    DatePicker,
    TimePicker,
    Row,
    Col,
    Image,
    Select,
    InputNumber,
    Flex,
} from "antd";
const { Header, Sider, Content } = Layout;

const NewActivity = () => {
    const [activityType, setActivityType] = useState([]);
    const [activityTypeId, setAtivityTypeId] = useState("");
    const [activityTypeName, setActivityTypeName] = useState("");

    const [imageToken, setImageToken] = useState("");
    const [imagePath, setImagePath] = useState("");

    const Authorization = localStorage.getItem("accessToken");
    const baseUrl = "http://letstalkapi.technofaceapps.com/";
    const [activityName, setActivityName] = useState("");
    const [description, setDescription] = useState("");
    const [locationName, setLocationName] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [participantCount, setParticipantCount] = useState("");
    const [eventCost, setEventCost] = useState("");
    const [detailAddress, setDetailAddress] = useState("");

    const [collapsed, setCollapsed] = useState(false);
    const { token: { colorBgContainer, borderRadiusLG }, } = theme.useToken();

    useEffect(() => {
        axios
            .get("http://letstalkapi.technofaceapps.com/api/ActivityTypes/GetToList")
            .then((response) => {
                const activityOptions = response.data.data.map((item) => ({
                    key: item.id,
                    label: item.name,
                    value: item.id,
                }));
                setActivityType(activityOptions);
                console.log(response)
            })
            .catch((err) => {
                console.error("Error fetching activity types", err);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const format = "HH:mm";
    const navigate = useNavigate();

    const backToActivity = () => {
        navigate("/Activity");
    };



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
                    setImagePath(data.data.path);
                    console.log(formData)
                    alert("başarılı bir şekilde yüklendi!");
                })
                .catch((error) => {
                    console.error("Dosya yükleme hatası:", error);
                    alert("Dosya yükleme sırasında bir hata oluştu.");
                });
        }

    };

    const postActivityData = async () => {
        const formData = new FormData();

        formData.append('activityTypeId', activityTypeId);
        formData.append('name', activityName);
        formData.append('description', description);
        formData.append('locationName', locationName);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);
        formData.append('date', date);
        formData.append('time', time);
        formData.append('participantCount', participantCount);
        formData.append('eventCost', eventCost);
        formData.append('detailAddress', detailAddress);
        formData.append('imageToken', imageToken);

        try {
            const response = await axios.post('http://letstalkapi.technofaceapps.com/api/Activities', formData, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${Authorization}`
                }
            });
            alert(response.data.name + " etkinliği başarılı şekilde eklendi.");
            backToActivity();
        } catch (error) {
            console.error('Hata: ', error.response ? error.response.data : error.message);
        }
    };

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

    return (
        <Layout style={{ height: "100vh" }}>
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
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={<MenuUnfoldOutlined />}
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
                        margin: "10px 16px",
                        padding: 20,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Button
                        type="primary"
                        shape="round"
                        icon={<DoubleLeftOutlined />}
                        onClick={backToActivity}
                    />
                    <br />
                    <Form
                        id="data"
                        name="data"
                        onFinish={postActivityData} // Alanlar dolu olduğunda tetiklenir
                        onFinishFailed={(errorInfo) => {
                            console.log("Doğrulama hatası:", errorInfo);
                            alert("Lütfen tüm alanları doldurun!");
                        }}
                    >
                        <Row>
                            <Col span={10}>
                                <br />
                                <input type="file" id="fileInput" onChange={handleFileUpload} />
                                <br />
                                <br />
                                <Form.Item
                                    name="activityType"
                                    label="Etkinlik Türü:"
                                    rules={[{ required: true, message: "Boş Geçilemez!" }]}
                                >
                                    <Select
                                        style={{ width: "100%" }}
                                        options={activityType}
                                        placeholder="Etkinlik Türünü Seçin"
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
                                    <Input style={{ width: "100%" }} onChange={setter => setActivityName(setter.target.value)} />
                                </Form.Item>
                                <Form.Item
                                    label="Etkinlik Konumu :"
                                    name="locationName"
                                    rules={[{ required: true, message: "Boş Geçilemez!" }]}
                                >
                                    <Input style={{ width: "100%" }} onChange={setter => setLocationName(setter.target.value)} />
                                </Form.Item>
                                <Form.Item

                                    label="Etkinlik Koordinatı :"
                                >
                                    <Input
                                        name="latitude"
                                        rules={[{ required: true, message: "Boş Geçilemez !" }]}
                                        style={{ width: "50%" }}
                                        onChange={setter => setLatitude(setter.target.value)}
                                    />
                                    <Input
                                        name="lalitude"
                                        style={{ width: "50%" }}
                                        rules={[{ required: true, message: "Boş Geçilemez !" }]}
                                        onChange={setter => setLongitude(setter.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Etkinlik Adres Detay"
                                    name="detailAddress"
                                    rules={[{ required: true, message: "Boş Geçilez!" }]}
                                >
                                    <Input.TextArea onChange={setter => setDetailAddress(setter.target.value)} />
                                </Form.Item>
                                <Form.Item
                                    label="Etkinlik Açıklaması:"
                                    name="description"
                                    rules={[{ required: true, message: "Boş Geçilez!" }]}
                                >
                                    <Input.TextArea onChange={setter => setDescription(setter.target.value)} />
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
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Etkinlik Ücreti"
                                    name="eventCost"
                                    onKeyDown={numberControl}
                                    onPaste={pasteControl}
                                    rules={[{ required: true, message: "Boş Geçilez!" }]}
                                >
                                    <InputNumber min={1} max={50000000000} onChange={(eventCost, cost) => setEventCost(eventCost)} />
                                </Form.Item>
                                <Button
                                    id="btn"
                                    type="primary"
                                    shape="round"
                                    icon={<PlusCircleOutlined />}
                                    size="large"
                                    htmlType="submit" // Submit butonuna tıklanıldığında form doğrulaması yapılır
                                >
                                    Ekle
                                </Button>
                            </Col>

                            <Col
                                span={14}
                                style={{
                                    display: Flex,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    position: "relative",
                                    border: 1,
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            border: "solid #c7c7c7 2px",
                                            width: "50%",
                                            minWidth: "350px",
                                            borderRadius: "10px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "100%",
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "center",
                                                alignContent: "center",
                                            }}
                                        >
                                            <div style={{ width: "80%", padding: "20px" }}>
                                                <Image
                                                    style={{ borderRadius: 20 }}
                                                    width={"100%"}
                                                    height={"100%"}
                                                    preview={false}
                                                    src={baseUrl + imagePath}
                                                    fallback="data:image/png;base64,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"
                                                />
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                width: "100%",
                                                textAlign: "center",
                                                lineHeight: "2",
                                                borderBottom: "1px solid gray",
                                                fontWeight: "600",
                                                marginBottom: "5px",
                                                fontSize: "16px",
                                            }}
                                        >
                                            Etkinlik Türü : {activityTypeName}
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    textAlign: "center",
                                                    width: "100%",
                                                    marginTop: "10px",
                                                    marginBottom: "10px",
                                                }}
                                            >
                                                <table style={{ textAlign: "center", width: "100%" }}>
                                                    <tr>
                                                        <label> Etkinlik Adı : {activityName}</label>
                                                    </tr>
                                                    <tr>
                                                        <label> Etkinlik Konumu : {locationName}</label>
                                                    </tr>
                                                    <tr>
                                                        <label>
                                                            {" "}
                                                            Etkinlik Adres Detay : {detailAddress}
                                                        </label>
                                                    </tr>
                                                    <tr>
                                                        <label> Etkinlik Açıklaması : {description}</label>
                                                    </tr>
                                                    <tr>
                                                        <label> Etkinlik Tarihi : {date}</label>
                                                    </tr>
                                                    <tr>
                                                        <label> Etkinlik Saati: {time}</label>
                                                    </tr>
                                                    <tr>
                                                        <label>
                                                            {" "}
                                                            Katılımcı Sayısı : {participantCount}
                                                        </label>
                                                    </tr>
                                                    <tr>
                                                        <label> Etkinlik Ücreti : {eventCost}</label>
                                                    </tr><br />
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Content>
            </Layout>
        </Layout>
    );
};
export default NewActivity;
