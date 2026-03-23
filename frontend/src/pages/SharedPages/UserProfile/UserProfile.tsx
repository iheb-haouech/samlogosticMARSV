import { Avatar, Button, Card, Form, Input, Popconfirm, Select } from "antd";
import { UserOutlined, WarningOutlined } from "@ant-design/icons";
import "./UserProfile.scss";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { deleteUser, selectCurrentUser, selectStatus, updateUser } from "../../../features/user/userSlice";
import { store } from "../../../store/store";
import {
  fetchCompanyTypes,
  selectCompanyTypes,
  selectCompanyTypesStatus,
} from "../../../features/companyType/companyTypeSlice";
import {
  fetchCompanyActivities,
  selectCompanyActivities,
} from "../../../features/companyActivity/companyActivitySlice";
import { useTranslation } from "react-i18next";
import { TunCities } from "../../../staticData/TunCities";

const countryOptions = [
  { value: "tunisia", label: "Tunisia" },
  //{ value: "us", label: "US" },
  //{ value: "italia", label: "Italia" },
];

export const UserProfile = () => {
  const { t } = useTranslation();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const companyTypeOptions = useSelector(selectCompanyTypes);
  const companyActivitiesOptions = useSelector(selectCompanyActivities);
  const companyTypesStatus = useSelector(selectCompanyTypesStatus);

  const currentUser: any = useSelector(selectCurrentUser);
  const status = useSelector(selectStatus);

  const [profileForm]: any = Form.useForm();
  const [passwordForm] = Form.useForm();

  const isAdmin = currentUser?.roleId === 2;

  useEffect(() => {
    store.dispatch(fetchCompanyTypes());
    console.log("not working");
  }, []);

  useEffect(() => {
    store.dispatch(fetchCompanyActivities());
    console.log("not working");
  }, []);

  useEffect(() => {
    if (currentUser) {
      profileForm.setFieldsValue({
        companyName: currentUser?.companyName,
        firstName: currentUser?.firstName,
        lastName: currentUser?.lastName,
        country: currentUser?.country,
        city: currentUser?.city,
        address: currentUser?.address,
        email: currentUser?.email,
        phone: currentUser?.phone,
        companyTypeId: currentUser?.companyTypeId,
        companyActivityId: currentUser?.companyActivityId,
        //commercialRegister: currentUser?.commercialRegister,
        patent: currentUser?.patent,
        websiteUrl: currentUser?.websiteUrl,
        zipCode: currentUser?.zipCode,
      });
    }
  }, [currentUser, profileForm]);

  const handleFormSubmit = () => {
    const updatedData = profileForm.getFieldsValue();
    store.dispatch(updateUser({ ...updatedData, id: currentUser.id }));
  };

  const handleChangePsw = async () => {
    store.dispatch(updateUser({ password: passwordForm.getFieldValue("password"), id: currentUser.id }));
  };

  const handleCancel = () => {
    if (currentUser) {
      profileForm.setFieldsValue({
        companyName: currentUser?.companyName,
        firstName: currentUser?.firstName,
        lastName: currentUser?.lastName,
        country: currentUser?.country,
        city: currentUser?.city,
        address: currentUser?.address,
        email: currentUser?.email,
        phone: currentUser?.phone,
        companyTypeId: currentUser?.companyTypeId,
        companyActivityId: currentUser?.companyActivityId,
        //commercialRegister: currentUser?.commercialRegister,
        patent: currentUser?.patent,
        websiteUrl: currentUser?.websiteUrl,
      });
    }
  };

  const handleCancelChangePsw = () => {
    passwordForm.setFieldsValue({
      confirmPassword: "",
      password: "",
    });
  };

  const validatePhone = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(t("phoneNumberRequired"));
    }
    if (!/^[0-9]+$/.test(value)) {
      return Promise.reject(t("phoneInvalid"));
    }
    return Promise.resolve();
  };

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "6px" }}>
      <div className='profile-container'>
        <Card title={t("profileDetails")}>
          <Form form={profileForm} layout='vertical' size='large' onFinish={handleFormSubmit}>
            <div className='profile-details'>
              <div className='profile-details-image'>
                <Avatar size={94} icon={<UserOutlined />} />
              </div>
              <div style={{ flex: "1" }} className='test'>
                {!isAdmin && (
                  <Form.Item
                    label={t("companyName")}
                    name='companyName'
                    rules={[{ required: true, message: t("companyNameRequired") }]}
                    hasFeedback
                  >
                    <Input id='companyName' placeholder={t("companyNamePlaceholder")} type='text' />
                  </Form.Item>
                )}
                <Form.Item label={t("firstName")} name='firstName'>
                  <Input id='firstName' placeholder={t("firstNamePlaceholder")} type='text' />
                </Form.Item>
                <Form.Item label={t("lastName")} name='lastName'>
                  <Input id='lastName' placeholder={t("lastNamePlaceholder")} type='text' />
                </Form.Item>
                <Form.Item
                  label={t("country")}
                  name='country'
                  rules={[{ required: true, message: t("countryRequired") }]}
                  hasFeedback
                >
                  <Select
                    placeholder={t("selectCountry")}
                    style={{ width: "-webkit-fill-available" }}
                    options={countryOptions}
                  />
                </Form.Item>
                <Form.Item
                  label={t("city")}
                  name='city'
                  rules={[{ required: true, message: t("cityRequired") }]}
                  hasFeedback
                >
                  <Select
                    placeholder={t("selectedCity")}
                    style={{ width: "-webkit-fill-available" }}
                    options={TunCities}
                  />
                </Form.Item>
                <Form.Item
                  label={t("address")}
                  name='address'
                  rules={[{ required: true, message: t("addressRequired") }]}
                  hasFeedback
                >
                  <Input id='address' placeholder={t("enterAddress")} type='text' />
                </Form.Item>
                <Form.Item
                  label={t("zipCode")}
                  name='zipCode'
                  rules={[{ required: true, message: t("zipCodeRequired") }]}
                  hasFeedback
                >
                  <Input id='zipCode' placeholder={t("enterZipCode")} type='text' />
                </Form.Item>
              </div>
              <div style={{ flex: "1" }} className='test'>
                <Form.Item
                  label={t("email")}
                  name='email'
                  rules={[
                    { required: true, message: t("emailRequired") },
                    { type: "email", message: t("emailInvalid") },
                  ]}
                  hasFeedback
                >
                  <Input id='email' placeholder={t("emailPlaceholder")} type='text' />
                </Form.Item>
                <Form.Item label={t("phoneNumber")} name='phone' rules={[{ validator: validatePhone }]} hasFeedback>
                  <Input id='phone' placeholder={t("phonePlaceholder")} type='text' />
                </Form.Item>
                {!isAdmin && (
                  <>
                    <Form.Item
                      label={t("companyType")}
                      name='companyTypeId'
                      rules={[{ required: true, message: t("companyTypeRequired") }]}
                      hasFeedback
                    >
                      <Select
                        className='auth-form--row-item'
                        placeholder={t("selectCompanyType")}
                        style={{ width: "-webkit-fill-available" }}
                        options={companyTypeOptions.map((type) => ({
                          value: type.id,
                          label: type.typeName,
                        }))}
                        loading={companyTypesStatus === "loading"}
                      />
                    </Form.Item>
                    <Form.Item
                      label={t("companyActivity")}
                      name='companyActivityId'
                      rules={[{ required: true, message: t("companyActivityRequired") }]}
                      hasFeedback
                    >
                      <Select
                        className='auth-form--row-item'
                        placeholder={t("selectCompanyActivity")}
                        style={{ width: "-webkit-fill-available" }}
                        options={companyActivitiesOptions.map((type) => ({
                          value: type.id,
                          label: type.typeName,
                        }))}
                        loading={companyTypesStatus === "loading"}
                      />
                    </Form.Item>
                    <Form.Item
                      label={t("patent")}
                      name='patent'
                      rules={[{ required: true, message: t("patentRequired") }]}
                      hasFeedback
                    >
                      <Input id='patent' placeholder={t("patentPlaceholder")} type='text' />
                    </Form.Item>
                  </>
                )}
                <Form.Item label={t("websiteUrl")} name='websiteUrl' hasFeedback>
                  <Input id='website-link' placeholder={t("websiteUrlPlaceholder")} type='text' />
                </Form.Item>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "end", marginTop: "1rem" }}>
              <Button onClick={handleCancel} danger size='middle'>
                {t("cancel")}
              </Button>
              <Button htmlType='submit' type='primary' loading={status === "loading"} size='middle'>
                {t("saveChanges")}
              </Button>
            </div>
          </Form>
        </Card>
        <Card title={t("resetPassword")}>
          <Form form={passwordForm} layout='vertical' size='large' onFinish={handleChangePsw}>
            <div className='profile-container-psw'>
              {/* Password Field */}
              <Form.Item
                className='profile-form--row-item'
                label={t("password")}
                name='password'
                rules={[
                  { required: true, message: t("passwordRequired") }, // Added translation key
                  { min: 8, message: t("passwordCriteria") }, // Ensure min length check is appropriately defined
                  { validator: (_, value) => (value ? Promise.resolve() : Promise.reject(t("passwordCriteria"))) },
                ]}
                hasFeedback
              >
                <Input.Password
                  id='password'
                  placeholder={t("enterPassword")}
                  type='password'
                  visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                />
              </Form.Item>

              {/* Confirm Password Field */}
              <Form.Item
                className='profile-form--row-item'
                label={t("confirmPassword")}
                name='confirmPassword'
                rules={[
                  { required: true, message: t("confirmPasswordRequired") }, // Added translation key for confirmation required
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(t("passwordMismatch")); // Ensure consistent error message for mismatch
                    },
                  }),
                ]}
                hasFeedback
              >
                <Input.Password id='confirmPassword' placeholder={t("confirmPasswordPlaceholder")} type='password' />
              </Form.Item>
            </div>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "end", marginTop: "1rem" }}>
              <Button size='middle' onClick={handleCancelChangePsw} danger>
                {t("cancel")}
              </Button>
              <Button size='middle' htmlType='submit' loading={status === "loading"} type='primary'>
                {t("saveChanges")}
              </Button>
            </div>
          </Form>
        </Card>

        <Card style={{ border: "1px solid #ff999b" }}>
          <div className='profile--delete-content'>
            <div className='profile--delete-text'>
              <WarningOutlined style={{ fontSize: "1.75rem" }} />
              <h3>{t("deleteAccount")}</h3>
            </div>
            <Popconfirm
              title={t("deleteConfirmTitle")}
              description={t("deleteConfirmDescription")}
              okText={t("yes")}
              cancelText={t("no")}
              onConfirm={() => {
                store.dispatch(deleteUser(currentUser?.id));
              }}
            >
              <Button loading={status === "loading"} type='primary'>
                {t("deleteAccount")}
              </Button>
            </Popconfirm>
          </div>
        </Card>
      </div>
    </div>
  );
};
