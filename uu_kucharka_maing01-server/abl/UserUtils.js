const UserUtils = {
  ADMIN: Symbol("Admin"),
  CREATOR: Symbol("Creator"),

  hasAuthority: (userId, authority) => {
    const data = {}; // udržujte synchronizaci s development.json
    data[this.ADMIN] = ["15-8545-1"];
    data[this.CREATOR] = ["15-8545-1"];

    if (data[authority] && typeof data[authority] === "Array") {
      return data[authority].includes(userId);
    }

    return false;
  },
};

module.exports = UserUtils;
