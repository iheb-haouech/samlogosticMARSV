import { Card, Tag } from "antd";
import "./ComplaintCard.scss";
import Title from "antd/es/typography/Title";

interface ComplaintCardProps {
  id: number;
  title: string;
  date: string;
  status: string;
  onClick: () => void;
  isSelected: boolean;
  isAdmin: boolean;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({ title, date, onClick, isSelected, status }) => {
  return (
    <Card
      className={`complaint-card ${isSelected ? "complaint-card--selected" : ""}`}
      onClick={onClick}
      // tabIndex={0}
      aria-selected={isSelected}
    >
      <Tag color={status === "Closed" || status === "Resolved" ? "green" : "volcano"}>{status}</Tag>
      <Title level={5} className='complaint-card--title'>
        {title}
      </Title>
      <p className='complaint-card--date'>{date}</p>
    </Card>
  );
};

export default ComplaintCard;
