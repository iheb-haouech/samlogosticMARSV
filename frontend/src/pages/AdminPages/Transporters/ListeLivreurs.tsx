import { Layout, Table, Button, Modal, Form, Input, Select, InputNumber, message } from "antd";
import { useGetAdminTransportersQuery, useCreateTransporterMutation } from '../../../features/transporter/transportersApi';
import { useState } from "react";

const ListeLivreurs: React.FC = () => {
  const { data: transporters = [], isLoading: tableLoading } = useGetAdminTransportersQuery();
  const [createTransporter, { isLoading: createLoading }] = useCreateTransporterMutation();  // ✅ CORRIGÉ
  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();

  const columns: any[] = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Prénom', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Nom', dataIndex: 'lastName', key: 'lastName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Véhicule', dataIndex: 'vehicleNumber', key: 'vehicleNumber' },
    { title: 'Taille', dataIndex: 'vehicleSize', render: (size: string) => size?.toUpperCase(), key: 'vehicleSize' },
    { title: 'Poids max', dataIndex: 'maxWeightKg', render: (kg: number) => `${kg} kg`, key: 'maxWeightKg' },
  ];

  const handleCreate = async (values: any) => {
    console.log('Form values:', values);  // 🔍 Debug frontend
    try {
      await createTransporter(values).unwrap();
      message.success(`Transporteur créé : ${values.firstName} ${values.lastName}`);
      form.resetFields();
      setOpenModal(false);
    } catch (error: any) {
      message.error(error?.data?.message || 'Erreur création');
    }
  };

  return (
    <Layout style={{ backgroundColor: "white", padding: 24 }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Transporteurs ({transporters.length})</h2>
        <Button type="primary" onClick={() => setOpenModal(true)}>
          + Ajouter transporteur
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={transporters}
        rowKey="id"
        loading={tableLoading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
  title="Nouveau transporteur"
  open={openModal}
  onCancel={() => { form.resetFields(); setOpenModal(false); }}
  okText="Créer"
  onOk={form.submit}  // ✅ form.submit()
  confirmLoading={createLoading}
>
  <Form 
    form={form} 
    layout="vertical" 
    onFinish={handleCreate}  // ✅ onFinish
  >
    <Form.Item name="firstName" label="Prénom" rules={[{required:true}]}>
      <Input />
    </Form.Item>
    <Form.Item name="lastName" label="Nom" rules={[{required:true}]}>
      <Input />
    </Form.Item>
    <Form.Item name="email" label="Email" rules={[{required:true, type:'email'}]}>
      <Input />
    </Form.Item>
    <Form.Item name="password" label="Mot de passe" rules={[{required:true, min:6}]}>
      <Input.Password />
    </Form.Item>
    <Form.Item name="vehicleNumber" label="Véhicule" rules={[{required:true}]}>
      <Input />
    </Form.Item>
    <Form.Item name="vehicleSize" label="Taille" rules={[{required:true}]}>
      <Select>
        <Select.Option value="small">Petit</Select.Option>
        <Select.Option value="medium">Moyen</Select.Option>
        <Select.Option value="large">Grand</Select.Option>
      </Select>
    </Form.Item>
    <Form.Item name="maxWeightKg" label="Poids max kg" rules={[{required:true}]}>
      <InputNumber min={100} />
    </Form.Item>
  </Form>
</Modal>
    </Layout>
  );
};

export default ListeLivreurs;
