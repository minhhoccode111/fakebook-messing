import Connection from "@/components/custom/connection";

import { ConnectionsText, User } from "@/shared/types";

type ConnectionsKindPropsType = {
  isAllowActions: boolean;
  text: ConnectionsText;
  connections: User[];
};

const ConnectionsKind = ({
  text,
  connections,
  isAllowActions,
}: ConnectionsKindPropsType) => {
  return (
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
  );
};

export default ConnectionsKind;
