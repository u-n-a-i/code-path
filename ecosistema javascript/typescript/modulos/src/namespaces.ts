// Namespaces

namespace Prueba {
  export interface User {
    id: number;
    userName: string;
  }

  export interface Error {
    id: number;
    isCritical: boolean;
    message: string;
  }
}

interface User {
  uuid: string;
  userName: string;
}

const user: Prueba.User = {
  id: 12345,
  userName: "Admin",
};

const user2: User = {
  uuid: "12345",
  userName: "Admin",
};
