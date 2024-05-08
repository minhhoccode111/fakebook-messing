import { ConnectionsText, User } from "@/shared/types";
import Connection from "@/components/custom/connection";

type ConnectionsKindPropsType = {
  text: ConnectionsText;
  connections: User[];
};

const ConnectionsKind = ({ text, connections }: ConnectionsKindPropsType) => {
  return (
    <div className="">
      <p className="font-bold">{text}</p>
      <ul className="">
        {connections.map((user, index) => (
          <Connection key={index} user={user} text={text}></Connection>
        ))}
      </ul>
    </div>
  );
};

export default ConnectionsKind;
