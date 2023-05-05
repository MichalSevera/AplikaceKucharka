const ADMIN = Symbol("Admin");
const CREATOR = Symbol("Creator");

const UserUtils = {
  ADMIN,
  CREATOR,
  data: { // udržujte synchronizaci s development.json
    [ADMIN] : ["15-8545-1"],
    [CREATOR] : ["15-8545-1"]
  },

  hasAuthority: function(userId, authority){
    //console.log(this.data);
    if (this.data[authority] && Array.isArray(this.data[authority])) {
      return this.data[authority].includes(userId);
    }
    return false;
  },
};

module.exports = UserUtils;

