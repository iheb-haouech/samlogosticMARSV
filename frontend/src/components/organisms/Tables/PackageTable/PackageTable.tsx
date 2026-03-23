import { Button, Form, InputNumber, Popconfirm, Table } from "antd";
import React, { useEffect, useState } from "react";
import { ColumnTypes, PackageTableProps } from "./PackageTableProps";
import "./PackageTable.scss";
import { HiOutlineTrash } from "react-icons/hi";
import { Package } from "../../../../types/Order";
import { useTranslation } from "react-i18next";

const PackageTable: React.FC<PackageTableProps> = ({ onPackagesChanges, packages }: PackageTableProps) => {
  const { t } = useTranslation();
  const [count, setCount] = useState(packages ? packages?.length : 0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [packagesData, setPackagesData] = useState<Package[]>(
    packages ? packages.map((pkg, index) => ({ ...pkg, index: index + 1 })) : [],
  );
  const [totals, setTotals] = useState({ totalQuantity: 0, totalWeight: 0 });

  useEffect(() => {
    // Calculate total values
    
    const newTotals = packagesData.reduce(
      (acc, item) => ({
        totalQuantity: acc?.totalQuantity + item?.quantity,
        totalWeight: acc?.totalWeight + item?.weight,
      }),
      { totalQuantity: 0, totalWeight: 0 },
    );
    setTotals(newTotals);
    onPackagesChanges({ packages: packagesData, ...newTotals });
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, [packagesData]);

  // Handle delete row (Package)
  const handleDelete = (index: number) => {
    const newData = packagesData.filter((row) => row.index !== index);
    setPackagesData(newData);
  };

  // Handle add new row (Package)
  const handleAdd = () => {
    const newDataRow: Package = {
      index: count + 1,
      weight: 0,
      length: 0,
      width: 0,
      height: 1,
      price: 0,
      quantity: 1,
    };
    setPackagesData([...packagesData, newDataRow]);
    setCount(count + 1);
  };

  const handleSave = (row: Package) => {
    const newData = packagesData.map((pkg) => {
      if (pkg.index === row.index) {
        return { ...pkg, ...row };
      }
      return pkg;
    });
    setPackagesData(newData);
  };

  const columns: ColumnTypes[number][] = [
    {
      title: "ID",
      key: "number",
      render: (_, _record, index) => index + 1,
    },
    {
      title: "Poids (Kg)",
      dataIndex: "weight",
      key: "weight",
      render: (weight, record) => (
        <Form.Item
          className='package-table--input'
          name={`weight-${record.index}`}
          initialValue={weight}
          rules={[
            {
              required: true,
              message: "Required field",
            },
          ]}
        >
          <InputNumber
            id={`weight-${record.index}`}
            type='number'
            step='1'
            min={0}
            style={{ width: "100%" }}
            value={weight}
            onChange={(value) => handleSave({ ...record, weight: value })}
          />
        </Form.Item>
      ),
    },
    {
      title: "Longeur (CM)",
      dataIndex: "length",
      key: "length",
      render: (width, record) => (
        <Form.Item
          className='package-table--input'
          name={`length-${record.index}`}
          initialValue={width}
          rules={[
            {
              required: true,
              message: "Required field",
            },
          ]}
        >
          <InputNumber
            id={`length-${record.index}`}
            type='number'
            step='1'
            style={{ width: "100%" }}
            min={0}
            value={width}
            onChange={(value) => handleSave({ ...record, length: value })}
          />
        </Form.Item>
      ),
    },
    {
      title: "Largeur (CM)",
      dataIndex: "width",
      key: "width",
      render: (width, record) => (
        <Form.Item
          className='package-table--input'
          name={`width-${record.index}`}
          initialValue={width}
          rules={[
            {
              required: true,
              message: "Required field",
            },
          ]}
        >
          <InputNumber
            id={`width-${record.index}`}
            type='number'
            step='1'
            style={{ width: "100%" }}
            min={0}
            value={width}
            onChange={(value) => handleSave({ ...record, width: value })}
          />
        </Form.Item>
      ),
    },
    {
      title: "Hauteur (CM)",
      dataIndex: "height",
      key: "height",
      render: (height, record) => (
        <Form.Item
          className='package-table--input'
          name={`height-${record.index}`}
          initialValue={height}
          rules={[
            {
              required: true,
              message: "Required field",
            },
          ]}
        >
          <InputNumber
            id={`height-${record.index}`}
            type='number'
            step='1'
            style={{ width: "100%" }}
            min={0}
            value={height}
            onChange={(value) => handleSave({ ...record, height: value })}
          />
        </Form.Item>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => (
        <Form.Item
          className='package-table--input'
          name={`quantity-${record.index}`}
          initialValue={quantity}
          rules={[
            {
              required: true,
              message: "Required field",
            },
          ]}
        >
          <InputNumber
            id={`quantity-${record.index}`}
            type='number'
            step='1'
            style={{ width: "100%" }}
            min={1}
            value={quantity}
            onChange={(value) => handleSave({ ...record, quantity: value })}
          />
        </Form.Item>
      ),
    },
    {
      title: "Action",
      dataIndex: "operation",
      render: (_, record) =>
        packagesData.length >= 1 ? (
          <Popconfirm title='Vous êtes sûr de supprimer ??' onConfirm={() => handleDelete(record.index!)}>
            <Button danger className='table--action-btn' icon={<HiOutlineTrash />} />
          </Popconfirm>
        ) : null,
    },
  ];

  return (
    <div className='packageTable'>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", padding: isMobile ? '8px' : '0' }}>
        <h3>{t("packages_list")}</h3>
        <Button size='middle' onClick={handleAdd} type='primary' shape='round'>
          {t("Add a package")}
        </Button>
      </div>

      <Table
        bordered
        columns={columns}
        dataSource={packagesData}
        pagination={false}
        rowKey='index'
        scroll={{ x: isMobile ? 'max-content' : 700 }}
        size={isMobile ? 'small' : 'middle'}
        summary={() => (
          <>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>
                <b>Total</b>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <b>{totals?.totalWeight} Kg</b>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}></Table.Summary.Cell>
              <Table.Summary.Cell index={3}></Table.Summary.Cell>
              <Table.Summary.Cell index={4}></Table.Summary.Cell>
              <Table.Summary.Cell index={5}>
                <b>{totals?.totalQuantity} Colis</b>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        )}
      />
    </div>
  );
};

export default PackageTable;
