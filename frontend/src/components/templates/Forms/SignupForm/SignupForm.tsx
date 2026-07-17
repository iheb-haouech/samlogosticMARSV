import { useEffect, useState } from "react";
import SignupFormProps from "./SignupFormProps";
import { Button, Col, Form, Input, Radio, Row, Select, Typography } from "antd";
import { UserDTO } from "../../../../api/myApi";
import { useTranslation } from "react-i18next";
import { apiClient } from "../../../../api";
import { useForm } from "antd/es/form/Form";
import { countriesList } from "../../../../staticData/countries";
import { PhoneCodesList } from "../../../../staticData/phone-codes";
import "./AuthForm.scss";

const SignupForm: React.FC<SignupFormProps> = ({ onSignInClick, onSubmit }) => {
  const { t } = useTranslation();
  const [form] = useForm();

  const initialState: UserDTO | any = {
    phone: "",
    email: "",
    password: "",
    companyName: "",
    city: "Tunis",
    country: "Tunisia",
    address: "",
    commercialRegister: null,
    patent: null,
    companyTypeId: 1,
    companyActivityId: null,
    accountType: "B2B",
    zipCode: "",
    firstName: "", 
    lastName: "", 
    phoneCountryCode: "216", 
  };

  const [newUser, setNewUser] = useState(initialState);
  const [, setConfirmPassword] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [companyTypeOptions, setCompanyTypeOptions] = useState<any[]>([]);
  const [companyActivitiesOptions, setCompanyActivitiesOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [countryOptions, setCountryOptions] = useState<{ value: string; label: string }[]>([]);
  const [cityOptions, setCityOptions] = useState<any>(countriesList["Tunisia"]);
  const [countryCodeOptions, setCountryCodeOptions] = useState<{ key: string; value: string; label: string }[]>([]);

  useEffect(() => {
    const countryList = Object.keys(countriesList)?.map((country: any) => ({
      value: country,
      label: country,
    }));
    setCountryOptions(countryList);

    const codeList = PhoneCodesList?.map((item, index) => ({
      key: `${item?.country}-${item?.code}-${index}`,
      value: item?.code,
      label: `${item?.country} (${item?.code})`,
    }));
    setCountryCodeOptions(codeList);
  }, []);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const companyTypeOptionsRes = await apiClient.companyTypes.appControllerGetAllCompanyTypes();
        const responseData: any = companyTypeOptionsRes.data;
        const types = responseData?.company_types || [];
        
        const order = [
          "Mise a la consommation",
          "Totalement exportatrice",
          "Partiellement exportatrice",
          "Autre",
        ];

        const sortedTypes = types.sort(
          (a: { typeName: string; }, b: { typeName: string; }) => order.indexOf(a.typeName) - order.indexOf(b.typeName)
        );

        setCompanyTypeOptions(sortedTypes);
      } catch (error) {
        console.error("Error fetching options:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();

    const fetchCompActOptions = async () => {
      try {
        setLoading(true);
        const companyActOptionsRes = await apiClient.companyActivities.appControllerGetAllCompanyActivities();
        const responseData: any = companyActOptionsRes.data;
        setCompanyActivitiesOptions(responseData?.company_activities);
      } catch (error) {
        console.error("Error fetching options:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompActOptions();
  }, []);

  const handleSubmit = () => {
    onSubmit({ ...newUser });
  };

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({ ...newUser, [field]: event.target.value });
    if (field === "password") {
      form.validateFields(["confirmPassword"]);
    }
  };

  const handleSelectChange = (field: string) => (value: any) => {
    if (field === "accountType") {
      const b2cDefaults =
        value === "B2C"
          ? {
              companyName: "",
              companyTypeId: null,
              companyActivityId: null,
              patent: "",
            }
          : {};

      setNewUser((prev: any) => ({ ...prev, accountType: value, ...b2cDefaults }));
      form.setFieldsValue(b2cDefaults);
      return;
    }

    setNewUser({ ...newUser, [field]: value });

    if (field === "country") {
      const newCities = countriesList[value] || [];
      setCityOptions(newCities); 
      form.setFieldsValue({ city: newCities[0] || "" }); 
      setNewUser((prev: any) => ({ ...prev, city: newCities[0] || "" }));
    }
  };

  const validatePhone = (_: any, value: string) => {
    if (!value) return Promise.reject(t("requiredPhone"));
    if (!/^[0-9]+$/.test(value)) return Promise.reject(t("phoneMustNumber"));
    if (value.length < 6) return Promise.reject(t("phoneLength"));
    return Promise.resolve();
  };

  const validateZipCode = (_: any, value: string) => {
    if (!value) return Promise.reject(t("zipCodeRequired"));
    if (!/^[0-9]+$/.test(value)) return Promise.reject(t("zipCodeRequiredNumber"));
    return Promise.resolve();
  };

  return (
    <div className='auth-form-inner-container'>
      <Form
        form={form}
        onFinish={handleSubmit}
        layout='vertical'
        size='large'
        initialValues={initialState}
        requiredMark={false}
      >
        {/* Name Fields Row */}
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label={t("firstName")}
              name='firstName'
              rules={[{ required: true, message: t("firstNameRequired") }]}
              hasFeedback
            >
              <Input
                placeholder={t("firstNamePlaceholder")}
                onChange={handleChange("firstName")}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label={t("lastName")}
              name='lastName'
              rules={[{ required: true, message: t("lastNameRequired") }]}
              hasFeedback
            >
              <Input
                placeholder={t("lastNamePlaceholder")}
                onChange={handleChange("lastName")}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Account Type Selector */}
        <Form.Item
          label={t("accountType")}
          name='accountType'
          rules={[{ required: true, message: t("accountTypeRequired") }]}
        >
          <Radio.Group
            optionType='button'
            buttonStyle='solid'
            className="premium-radio-group"
            onChange={(event) => handleSelectChange("accountType")(event.target.value)}
            options={[
              { label: "B2B", value: "B2B" },
              { label: "B2C", value: "B2C" },
            ]}
          />
        </Form.Item>

        {/* Conditional B2B Company Title */}
        {newUser.accountType === "B2B" && (
          <Form.Item
            label={t("companyName")}
            name='companyName'
            rules={[{ required: true, message: t("companyNameRequired") }]}
            hasFeedback
          >
            <Input
              placeholder={t("companyNamePlaceholder")}
              onChange={handleChange("companyName")}
            />
          </Form.Item>
        )}

        {/* Email Identification Entry */}
        <Form.Item
          label={t("email")}
          name='email'
          rules={[
            { required: true, message: t("emailRequired") },
            { type: "email", message: t("emailInvalid") },
          ]}
          hasFeedback
        >
          <Input
            placeholder='nom@entreprise.com'
            onChange={handleChange("email")}
          />
        </Form.Item>

        {/* Security Password Matrices Row */}
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label={t("password")}
              name='password'
              rules={[
                { required: true, message: t("passwordRequired") },
                { min: 8, message: t("passwordMinLength") },
              ]}
              hasFeedback
            >
              <Input.Password
                placeholder={t("passwordPlaceholder")}
                onChange={handleChange("password")}
                visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label={t("confirmPassword")}
              name='confirmPassword'
              rules={[
                { required: true, message: t("confirmPasswordRequired") },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(t("passwordNotMatch"));
                  },
                }),
              ]}
              hasFeedback
            >
              <Input.Password
                placeholder={t("confirmPasswordPlaceholder")}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Responsive Mobile Phone Configurations Group */}
        <Row gutter={16}>
          <Col xs={9} sm={8}>
            <Form.Item
              label={t("countryCode")}
              name='phoneCountryCode'
              rules={[{ required: true, message: t("countryCodeRequired") }]}
              hasFeedback
            >
              <Select
                showSearch
                placeholder="+216"
                onChange={handleSelectChange("phoneCountryCode")}
                options={countryCodeOptions}
                filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
              />
            </Form.Item>
          </Col>
          <Col xs={15} sm={16}>
            <Form.Item
              label={t("phoneNumber")}
              name='phone'
              rules={[{ validator: validatePhone }]}
              hasFeedback
            >
              <Input
                placeholder='99 999 999'
                onChange={handleChange("phone")}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Conditional B2B Corporate Parametrizations */}
        {newUser.accountType === "B2B" && (
          <>
            <Form.Item
              label={t("businessType")}
              name='companyTypeId'
              rules={[{ required: true, message: t("businessTypeRequired") }]}
              hasFeedback
            >
              <Select
                placeholder={t("businessTypePlaceholder")}
                onChange={handleSelectChange("companyTypeId")}
                options={companyTypeOptions.map((type) => ({
                  value: type.id,
                  label: type.typeName,
                }))}
                loading={loading}
              />
            </Form.Item>

            <Form.Item
              label={t("companyActivity")}
              name='companyActivityId'
              rules={[{ required: true, message: t("companyActivityRequired") }]}
              hasFeedback
            >
              <Select
                placeholder={t("companyActivityPlaceholder")}
                onChange={handleSelectChange("companyActivityId")}
                options={companyActivitiesOptions?.map((type: any) => ({
                  value: type?.id,
                  label: type?.typeName,
                }))}
                loading={loading}
              />
            </Form.Item>

            <Form.Item
              label={t("patent")}
              name='patent'
              rules={[{ required: true, message: t("patentRequired") }]}
              hasFeedback
            >
              <Input
                placeholder='ex: 1234567/A/M/000'
                onChange={handleChange("patent")}
              />
            </Form.Item>
          </>
        )}

        {/* Geographical Matrices Rows */}
        <Row gutter={16}>
          <Col xs={12} sm={12}>
            <Form.Item
              label={t("country")}
              name='country'
              rules={[{ required: true, message: t("countryRequired") }]}
              hasFeedback
            >
              <Select
                placeholder={t("countryPlaceholder")}
                onChange={handleSelectChange("country")}
                options={countryOptions}
              />
            </Form.Item>
          </Col>
          <Col xs={12} sm={12}>
            <Form.Item
              label={t("city")}
              name='city'
              rules={[{ required: true, message: t("cityRequired") }]}
              hasFeedback
            >
              <Select
                placeholder={t("cityPlaceholder")}
                options={cityOptions?.map((city: any) => ({ value: city, label: city }))}
                onChange={handleSelectChange("city")}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={t("address")}
          name='address'
          rules={[{ required: true, message: t("addressRequired") }]}
          hasFeedback
        >
          <Input
            placeholder={t("addressPlaceholder")}
            onChange={handleChange("address")}
            maxLength={60}
          />
        </Form.Item>

        <Form.Item
          label={t("zipCode")}
          name='zipCode'
          rules={[{ required: true, validator: validateZipCode }]}
          hasFeedback
        >
          <Input
            placeholder='1000'
            onChange={handleChange("zipCode")}
          />
        </Form.Item>

        {/* Actions Button Footnotes */}
        <Button 
          className='auth-form--submit-btn' 
          block 
          htmlType='submit' 
          type='primary' 
          size='large'
          style={{ marginTop: '12px', fontWeight: 600, borderRadius: '8px' }}
        >
          {t("Register")}
        </Button>
      </Form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Typography.Text style={{ color: '#475569' }}>
          {t("Already have an account?")}{" "}
          <Typography.Link 
            style={{ color: '#0ea5e9', fontWeight: 600 }} 
            onClick={onSignInClick}
          >
            {t("Log in")}
          </Typography.Link>
        </Typography.Text>
      </div>
    </div>
  );
};

export default SignupForm;