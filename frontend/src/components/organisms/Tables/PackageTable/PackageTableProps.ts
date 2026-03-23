import { TableProps } from "antd";
import { Package, PackagesData } from "../../../../types/Order";

export type ColumnTypes = Exclude<TableProps<Package>["columns"], undefined>;

export interface PackageTableProps {
  packages?: Package[];
  onPackagesChanges: (packages: PackagesData) => void;
}
