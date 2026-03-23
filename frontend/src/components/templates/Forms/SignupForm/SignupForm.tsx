import { useEffect, useState } from "react";
import SignupFormProps from "./SignupFormProps";
import { Button, Flex, Form, Input, Row, Select, Typography } from "antd";
import "./AuthForm.scss";
import Title from "antd/es/typography/Title";
import { UserDTO } from "../../../../api/myApi";
import { useTranslation } from "react-i18next";
import { apiClient } from "../../../../api";
import { useForm } from "antd/es/form/Form";
import { countriesList } from "../../../../staticData/countries";
import { PhoneCodesList } from "../../../../staticData/phone-codes";

const SignupForm: React.FC<SignupFormProps> = ({ onSignInClick, onSubmit }) => {
  const { t } = useTranslation();
  const initialState: UserDTO | any = {
    phone: "",
    email: "",
    password: "", //TODO
    companyName: "",
    city: "Tunis",
    country: "Tunisia",
    address: "",
    commercialRegister: null,
    patent: null,
    companyTypeId: 1,
    // roleId: 3,
    zipCode: "",
    firstName: "", // Add firstName
    lastName: "", // Add lastName
    phoneCountryCode: "216", // Default country code for Tunisia
  };

  const [form] = useForm();
  const [newUser, setNewUser] = useState(initialState);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [companyTypeOptions, setCompanyTypeOptions] = useState<any[]>([]);
  const [companyActivitiesOptions, setCompanyActivitiesOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [countryOptions, setCountryOptions] = useState<{ value: string; label: string }[]>([]);
  const [cityOptions, setCityOptions] = useState<any>(countriesList["Tunisia"]);
  const [countryCodeOptions, setCountryCodeOptions] = useState<{ key: string; value: string; label: string }[]>([]);

  // State to manage the selected role

  useEffect(() => {
    // Populate country options dynamically
    const countryList = Object.keys(countriesList)?.map((country: any) => ({
      value: country,
      label: country,
    }));
    setCountryOptions(countryList);

    // Populate country code options with unique keys
    const codeList = PhoneCodesList?.map((item, index) => ({
      key: `${item?.country}-${item?.code}-${index}`, // Ensure unique keys by including the index
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
        // trier par ordre alphabétique ou selon ton ordre custom
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
    const updatedUser = { ...newUser};
    onSubmit(updatedUser);
    console.log("newUser", updatedUser);
  };

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({ ...newUser, [field]: event.target.value });
    if (field === "password") {
      form.validateFields(["confirmPassword"]); // Re-validate confirm password when password changes
    }
  };

  const handleSelectChange = (field: string) => (value: any) => {
    setNewUser({ ...newUser, [field]: value });

    if (field === "country") {
      const newCities = countriesList[value] || [];
      setCityOptions(newCities); // Update the city options based on the selected country
      form.setFieldsValue({ city: newCities[0] || "" }); // Update the city field with the first city or empty string
      setNewUser((prev: any) => ({ ...prev, city: newCities[0] || "" })); // Reset the city value to the first city
    }

    if (field === "phoneCountryCode") {
      // Update the country code
      setNewUser((prev: any) => ({ ...prev, phoneCountryCode: value }));
    }
  };

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
  };

  const validatePhone = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(t("requiredPhone"));
    }
    if (!/^[0-9]+$/.test(value)) {
      return Promise.reject(t("phoneMustNumber"));
    }
    if (value.length < 6) {
      return Promise.reject(t("phoneLength"));
    }
    return Promise.resolve();
  };

  const validateZipCode = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(t("zipCodeRequired"));
    }
    if (!/^[0-9]+$/.test(value)) {
      return Promise.reject(t("zipCodeRequiredNumber"));
    }
    return Promise.resolve();
  };

  return (
    <div className='auth-form'>
      <div className='auth-form--logo-container'>
        <img className='auth-form--logo' style={{ width: 250 }} src='./png/vanloglogo-bgwhite.png' alt='vanlog Logo' />
      </div>
      <Title className='auth-form--title' level={3}>
        {t("Create an account")}
      </Title>
      <Form
        form={form}
        style={{ marginTop: "1rem" }}
        onFinish={handleSubmit}
        layout='vertical'
        size='large'
        initialValues={initialState}
      >
        <Form.Item
          label={t("firstName")}
          name='firstName'
          rules={[
            {
              required: true,
              message: t("firstNameRequired"),
            },
          ]}
          hasFeedback
        >
          <Input
            id='firstName'
            placeholder={t("firstNamePlaceholder")}
            onChange={handleChange("firstName")}
            value={newUser.firstName}
            type='text'
          />
        </Form.Item>

        <Form.Item
          label={t("lastName")}
          name='lastName'
          rules={[
            {
              required: true,
              message: t("lastNameRequired"),
            },
          ]}
          hasFeedback
        >
          <Input
            id='lastName'
            placeholder={t("lastNamePlaceholder")}
            onChange={handleChange("lastName")}
            value={newUser.lastName}
            type='text'
          />
        </Form.Item>

        <Form.Item
          label={t("Company Name")}
          name='companyName'
          rules={[
            {
              required: true,
              message: t("companyNameRequired"),
            },
          ]}
          hasFeedback
        >
          <Input
            id='companyName'
            placeholder={t("Company Name")}
            onChange={handleChange("companyName")}
            value={newUser.companyName}
            type='text'
          />
        </Form.Item>

        <Form.Item
          label='Email'
          name='email'
          rules={[
            {
              required: true,
              message: t("emailRequired"),
            },
            { type: "email", message: t("emailInvalid") },
          ]}
          hasFeedback
        >
          <Input
            id='signupEmail'
            placeholder='example@company.com'
            onChange={handleChange("email")}
            value={newUser.email}
            type='text'
          />
        </Form.Item>

        <Row>
          <Form.Item
            style={{ width: "48%", marginRight: 5 }}
            className='auth-form--row-item'
            label={t("Password")}
            name='password'
            rules={[
              {
                required: true,
                message: t("passwordRequired"),
              },
              { min: 8, message: t("passwordMinLength", { min: 8 }) },
            ]}
            hasFeedback
          >
            <Input.Password
              id='password'
              placeholder={t("enterPassword")}
              onChange={handleChange("password")}
              value={newUser.password}
              type='password'
              visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
            />
          </Form.Item>
          <Form.Item
            style={{ width: "48%" }}
            className='auth-form--row-item'
            label={t("Confirm password")}
            name='confirmPassword'
            rules={[
              {
                required: true,
                message: t("confirmPasswordRequired"),
              },
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
              id='confirmPassword'
              placeholder={t("Confirm password")}
              onChange={handleConfirmPasswordChange}
              value={confirmPassword}
              type='password'
            />
          </Form.Item>
        </Row>

        <div>
          <Row style={{ display: "flex", flexDirection: "row" }}>
            <Form.Item
              style={{ width: "33%", marginRight: 5 }}
              label={t("CountryCode")}
              name='phoneCountryCode'
              rules={[
                {
                  required: true,
                  message: t("Please select a country code."),
                },
              ]}
              hasFeedback
            >
              <Select
                showSearch // Enable search functionality
                placeholder={t("Select a country code")}
                style={{ width: "-webkit-fill-available" }}
                onChange={handleSelectChange("phoneCountryCode")}
                value={newUser?.phoneCountryCode}
                options={countryCodeOptions}
                filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
              />
            </Form.Item>

            <Form.Item
              style={{ width: "65%" }}
              label={t("Phone Number")}
              name='phone'
              rules={[
                {
                  validator: validatePhone,
                },
              ]}
              hasFeedback
            >
              <Input
                id='phone'
                placeholder='00 000 000'
                onChange={handleChange("phone")}
                value={newUser.phone}
                type='text'
              />
            </Form.Item>
          </Row>

          <Form.Item
            label={t("Business Type")}
            name='companyTypeId'
            rules={[
              {
                required: true,
                message: t("The Type of your business is required."),
              },
            ]}
            hasFeedback
          >
            <Select
              className='auth-form--row-item'
              placeholder="Selectioné Régime d'entreprise"
              style={{ width: "-webkit-fill-available" }}
              onChange={handleSelectChange("companyTypeId")}
              options={companyTypeOptions.map((type) => ({
                value: type.id,
                label: type.typeName,
              }))}
              loading={loading}
            />
          </Form.Item>
          <Form.Item
            label={t("Activité d’entreprise")}
            name='companyActivityId'
            rules={[
              {
                required: true,
                message: t("The Type of your business is required."),
              },
            ]}
            hasFeedback
          >
            <Select
              className='auth-form--row-item'
              placeholder='Selectioné Activité d’entreprise'
              style={{ width: "-webkit-fill-available" }}
              onChange={handleSelectChange("companyActivityId")}
              options={companyActivitiesOptions?.map((type: any) => ({
                value: type?.id,
                label: type?.typeName,
              }))}
              loading={loading}
            />
          </Form.Item>

          <Flex className='auth-form--row'>
            <Form.Item
              className='auth-form--row-item'
              label={t("Patent")}
              name='patent'
              rules={[
                {
                  required: true,
                  message: t("Patent is required."),
                },
              ]}
              hasFeedback
            >
              <Input
                id='patent'
                placeholder='ex: 123456'
                onChange={handleChange("patent")}
                value={newUser.patent}
                type='text'
              />
            </Form.Item>
          </Flex>

          <Flex className='auth-form--row'>
            <Form.Item
              className='auth-form--row-item'
              label={t("Country")}
              name='country'
              rules={[
                {
                  required: true,
                  message: t("Please select Country."),
                },
              ]}
              hasFeedback
            >
              <Select
                placeholder={t("Select a Country")}
                style={{ width: "-webkit-fill-available" }}
                onChange={handleSelectChange("country")}
                value={newUser.country}
                options={countryOptions}
              />
            </Form.Item>
            <Form.Item
              className='auth-form--row-item'
              label={t("City")}
              name='city'
              rules={[{ required: true, message: t("Please select City") }]}
              hasFeedback
            >
              <Select
                placeholder={t("Select a City")}
                options={cityOptions?.map((city: any) => ({ value: city, label: city }))}
                onChange={handleSelectChange("city")}
                value={newUser.city}
              />
            </Form.Item>
          </Flex>

          <Form.Item
            label={t("Adresse")}
            name='address'
            rules={[
              {
                required: true,
                message: t("Please type your address."),
              },
            ]}
            hasFeedback
          >
            <Input
              id='address'
              placeholder={t("Enter your address")}
              onChange={handleChange("address")}
              value={newUser.address}
              type='text'
              maxLength={40}
            />
          </Form.Item>

          <Form.Item
            label={t("zipCode")}
            name='zipCode'
            rules={[
              {
                required: true,
                validator: validateZipCode,
              },
            ]}
            hasFeedback
          >
            <Input
              id='zipCode'
              placeholder={t("Enter your zip code")}
              onChange={handleChange("zipCode")}
              value={newUser.zipCode}
              type='text'
            />
          </Form.Item>
        </div>

        {/* Role Toggle Button */}
        
        <Button className='auth-form--submit-btn' block htmlType='submit' type='primary' shape='round' size={"large"}>
          {t("Register")}
        </Button>
      </Form>
      <Typography.Text className='auth-form--text'>
        {t("Already have an account?")}{" "}
        <Typography.Link className='auth-form--textLink' onClick={onSignInClick}>
          {t("Log in")}
        </Typography.Link>
      </Typography.Text>
    </div>
  );
};

export default SignupForm;
