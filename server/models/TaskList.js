const Sequelize = require("sequelize");
const sequelize = require("../database");

const TaskList = sequelize.define("task_list", {
    name: {
        type: Sequelize.STRING(50),
        allowNull: false
    }
}, {
    paranoid: true,
    underscored: true,
    freezeTableName: true
});

TaskList.belongsTo(User, { foreignKey: "createdBy" });
TaskList.belongsTo(Workspace);

global.TaskList = TaskList;
