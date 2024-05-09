import { ConnectionsText, User } from "@/shared/types";
import Connection from "@/components/custom/connection";

type ConnectionsKindPropsType = {
  text: ConnectionsText;
  connections: User[];
  isAllowActions: boolean;
};

const ConnectionsKind = ({
  text,
  connections,
  isAllowActions,
}: ConnectionsKindPropsType) => {
  return (
    <div className="">
      <p className="font-bold">{text}</p>
      <ul className="">
        {connections.map((user, index) => (
          <Connection
            isAllowActions={isAllowActions}
            key={index}
            user={user}
            text={text}
          ></Connection>
        ))}
      </ul>
    </div>
  );
};

export default ConnectionsKind;
