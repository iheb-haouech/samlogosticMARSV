import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Button, Input, Select, Space, Switch, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { API_BASE_URL } from "../../../api";
import { rolesMap } from "../../../types/Roles";
import "./SuperAdminUsers.scss";

type UserRow = {
  id: number;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  email: string;
  phone?: string;
  city?: string;
  roleId?: number;
  verified?: boolean;
  blocked?: boolean;
  isMainAdmin?: boolean;
  adminManagedCities?: string[];
};

const roleOptions = [
  { label: "Admin", value: rolesMap.admin },
  { label: "Transporter", value: rolesMap.transporter },
  { label: "Client", value: rolesMap.user },
  { label: "Superadmin", value: rolesMap.superAdmin },
];

const SuperAdminUsers = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [savingUserId, setSavingUserId] = useState<number | null>(null);
  const token = localStorage.getItem("accessToken");

  const authHeaders = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token],
  );

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/user/superadmin/all-users`, authHeaders);
      setUsers(response.data || []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateLocalUser = (id: number, patch: Partial<UserRow>) => {
    setUsers((current) => current.map((user) => (user.id === id ? { ...user, ...patch } : user)));
  };

  const saveUser = async (user: UserRow) => {
    setSavingUserId(user.id);
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/user/superadmin/users/${user.id}/role`,
        {
          roleId: user.roleId,
          adminManagedCities: user.adminManagedCities || [],
          isMainAdmin: !!user.isMainAdmin,
          verified: !!user.verified,
          blocked: !!user.blocked,
        },
        authHeaders,
      );
      updateLocalUser(user.id, response.data);
    } finally {
      setSavingUserId(null);
    }
  };

  const columns: ColumnsType<UserRow> = [
    {
      title: "User",
      key: "user",
      render: (_, row) => (
        <div className="superadmin-users__identity">
          <strong>{row.companyName || `${row.firstName || ""} ${row.lastName || ""}`.trim() || "Unnamed user"}</strong>
          <span>{row.email}</span>
        </div>
      ),
    },
    {
      title: "City",
      dataIndex: "city",
      width: 130,
      render: (city) => city || "-",
    },
    {
      title: "Role",
      dataIndex: "roleId",
      width: 170,
      render: (_, row) => (
        <Select
          value={row.roleId}
          options={roleOptions}
          onChange={(roleId) => updateLocalUser(row.id, { roleId })}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Admin scope",
      dataIndex: "adminManagedCities",
      render: (_, row) => (
        <Input
          disabled={row.roleId !== rolesMap.admin}
          placeholder="Tunis, Sfax, Sousse"
          value={(row.adminManagedCities || []).join(", ")}
          onChange={(event) =>
            updateLocalUser(row.id, {
              adminManagedCities: event.target.value
                .split(",")
                .map((city) => city.trim())
                .filter(Boolean),
            })
          }
        />
      ),
    },
    {
      title: "Main admin",
      dataIndex: "isMainAdmin",
      width: 120,
      render: (_, row) => (
        <Switch
          disabled={row.roleId !== rolesMap.admin && row.roleId !== rolesMap.superAdmin}
          checked={!!row.isMainAdmin}
          onChange={(isMainAdmin) => updateLocalUser(row.id, { isMainAdmin })}
        />
      ),
    },
    {
      title: "Status",
      key: "status",
      width: 150,
      render: (_, row) => (
        <Space direction="vertical" size={4}>
          <Tag color={row.verified ? "green" : "orange"}>{row.verified ? "Verified" : "Waiting"}</Tag>
          {row.blocked && <Tag color="red">Blocked</Tag>}
        </Space>
      ),
    },
    {
      title: "Save",
      key: "save",
      width: 110,
      render: (_, row) => (
        <Button type="primary" loading={savingUserId === row.id} onClick={() => saveUser(row)}>
          Save
        </Button>
      ),
    },
  ];

  const roleCounts = roleOptions.map((role) => ({
    ...role,
    count: users.filter((user) => user.roleId === role.value).length,
  }));

  return (
    <div className="superadmin-users">
      <div className="superadmin-users__header">
        <div>
          <h2>Users & roles</h2>
          <p>Control account roles and admin city visibility from one place.</p>
        </div>
        <Button onClick={loadUsers}>Refresh</Button>
      </div>

      <div className="superadmin-users__stats">
        {roleCounts.map((role) => (
          <div className="superadmin-users__stat" key={role.value}>
            <span>{role.label}</span>
            <strong>{role.count}</strong>
          </div>
        ))}
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={users}
        loading={isLoading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 980 }}
      />
    </div>
  );
};

export default SuperAdminUsers;
