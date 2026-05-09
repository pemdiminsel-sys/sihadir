"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = exports.jwtConstants = void 0;
exports.jwtConstants = {
    secret: process.env.JWT_SECRET || 'secretKey',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
};
var Role;
(function (Role) {
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
    Role["ADMIN_OPD"] = "ADMIN_OPD";
    Role["PANITIA"] = "PANITIA";
    Role["PESERTA"] = "PESERTA";
    Role["PIMPINAN"] = "PIMPINAN";
})(Role || (exports.Role = Role = {}));
//# sourceMappingURL=constants.js.map