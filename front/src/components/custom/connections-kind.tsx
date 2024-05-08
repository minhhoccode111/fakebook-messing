import { ConnectionsLabel, User } from "@/shared/types";
import Connection from "@/components/custom/connection";

type ConnectionsKindPropsType = {
  label: ConnectionsLabel;
  connections: User[];
};

const ConnectionsKind = ({ label, connections }: ConnectionsKindPropsType) => {
  return (
    <div className="">
      <p className="font-bold">{label}</p>
      <ul className="">
        {connections.map((user, index) => (
          <Connection key={index} user={user} label={label}></Connection>
        ))}
      </ul>
    </div>
  );
};

export default ConnectionsKind;
